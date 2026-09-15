"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { hasProAccess } from "@/lib/entitlements";
import { scheduleSm2 } from "@/lib/srs";
import {
  createAttemptSchema,
  answerSchema,
  srsReviewSchema,
  rubricSchema,
  adminQuestionSchema,
} from "@/lib/validators";
import type { Prisma, Difficulty } from "@prisma/client";

function sample<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

// -------------------------------------------------------------------------
// Attempts / practice
// -------------------------------------------------------------------------

export async function createAttempt(input: z.infer<typeof createAttemptSchema>) {
  const user = await requireUser();
  const data = createAttemptSchema.parse(input);
  const pro = hasProAccess(user);

  const where: Prisma.QuestionWhereInput = {};
  if (data.partSlug) where.part = { slug: data.partSlug };
  if (data.subjectId) where.subjectId = data.subjectId;
  if (data.difficulty !== "ALL") where.difficulty = data.difficulty as Difficulty;
  if (!pro) where.isFree = true;

  let questionIds: string[] = [];

  if (data.mode === "DAILY") {
    // Adaptive: due SRS cards first, then weakest-topic questions.
    const due = await prisma.srsCard.findMany({
      where: { userId: user.id, dueDate: { lte: new Date() } },
      select: { questionId: true },
      take: data.count,
    });
    questionIds = due.map((d) => d.questionId);
    if (questionIds.length < data.count) {
      const weak = await getWeakTopicIds(user.id);
      const fill = await prisma.question.findMany({
        where: { ...where, ...(weak.length ? { topicId: { in: weak } } : {}), id: { notIn: questionIds } },
        select: { id: true },
        take: (data.count - questionIds.length) * 3,
      });
      questionIds = [...questionIds, ...sample(fill.map((q) => q.id), data.count - questionIds.length)];
    }
  } else {
    const candidates = await prisma.question.findMany({ where, select: { id: true }, take: 1500 });
    questionIds = sample(candidates.map((c) => c.id), data.count);
  }

  if (questionIds.length === 0) {
    throw new Error("No questions match those filters. Try widening your selection.");
  }

  const part = data.partSlug ? await prisma.part.findUnique({ where: { slug: data.partSlug } }) : null;

  const attempt = await prisma.attempt.create({
    data: {
      userId: user.id,
      partId: part?.id ?? null,
      mode: data.mode,
      timeLimitSec: data.timeLimitSec ?? null,
      title:
        data.mode === "DAILY"
          ? "Daily adaptive quiz"
          : data.mode === "SIMULATOR"
            ? `${part?.subtitle ?? ""} exam simulator`
            : `${data.mode.charAt(0)}${data.mode.slice(1).toLowerCase()} practice`,
      responses: {
        create: questionIds.map((qid, i) => ({ questionId: qid, order: i })),
      },
    },
  });

  return { attemptId: attempt.id };
}

export async function saveAnswer(input: z.infer<typeof answerSchema>) {
  const user = await requireUser();
  const data = answerSchema.parse(input);

  const response = await prisma.response.findFirst({
    where: { attemptId: data.attemptId, questionId: data.questionId, attempt: { userId: user.id } },
    include: { question: { include: { options: true } } },
  });
  if (!response) throw new Error("Response not found");

  let isCorrect: boolean | null = null;
  if (data.selectedOptionId) {
    const opt = response.question.options.find((o) => o.id === data.selectedOptionId);
    isCorrect = opt?.isCorrect ?? false;
  }

  await prisma.response.update({
    where: { id: response.id },
    data: {
      selectedOptionId: data.selectedOptionId,
      isCorrect,
      flagged: data.flagged,
      timeSpentSec: data.timeSpentSec,
      answeredAt: data.selectedOptionId ? new Date() : null,
    },
  });

  return { isCorrect };
}

export async function finishAttempt(attemptId: string) {
  const user = await requireUser();
  const attempt = await prisma.attempt.findFirst({
    where: { id: attemptId, userId: user.id },
    include: { responses: true },
  });
  if (!attempt) throw new Error("Attempt not found");

  await prisma.attempt.update({
    where: { id: attemptId },
    data: { status: "COMPLETED", finishedAt: new Date() },
  });

  // Missed questions become / update SRS cards.
  for (const r of attempt.responses) {
    if (r.isCorrect === false) {
      await prisma.srsCard.upsert({
        where: { userId_questionId: { userId: user.id, questionId: r.questionId } },
        update: { dueDate: new Date(), repetitions: 0, intervalDays: 1 },
        create: {
          userId: user.id,
          questionId: r.questionId,
          dueDate: new Date(Date.now() + 24 * 3600 * 1000),
          intervalDays: 1,
        },
      });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/srs");
  return { ok: true };
}

// -------------------------------------------------------------------------
// Spaced repetition
// -------------------------------------------------------------------------

export async function reviewSrsCard(input: z.infer<typeof srsReviewSchema>) {
  const user = await requireUser();
  const data = srsReviewSchema.parse(input);
  const card = await prisma.srsCard.findFirst({ where: { id: data.cardId, userId: user.id } });
  if (!card) throw new Error("Card not found");

  const next = scheduleSm2(
    {
      easeFactor: card.easeFactor,
      intervalDays: card.intervalDays,
      repetitions: card.repetitions,
      lapses: card.lapses,
    },
    data.quality,
  );

  await prisma.srsCard.update({
    where: { id: card.id },
    data: {
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      repetitions: next.repetitions,
      lapses: next.lapses,
      dueDate: next.dueDate,
      lastReviewedAt: new Date(),
    },
  });

  revalidatePath("/srs");
  return { dueDate: next.dueDate, intervalDays: next.intervalDays };
}

// -------------------------------------------------------------------------
// Part 3 rubric self-assessment
// -------------------------------------------------------------------------

export async function saveRubricScore(input: z.infer<typeof rubricSchema>) {
  const user = await requireUser();
  const data = rubricSchema.parse(input);
  await prisma.rubricScore.create({
    data: {
      userId: user.id,
      checklistId: data.checklistId,
      score: data.score,
      maxScore: data.maxScore,
      notes: data.notes,
    },
  });
  revalidatePath(`/part3`);
  return { ok: true };
}

// -------------------------------------------------------------------------
// Study plan
// -------------------------------------------------------------------------

export async function toggleStudyTask(taskId: string) {
  const user = await requireUser();
  const task = await prisma.studyTask.findFirst({ where: { id: taskId, userId: user.id } });
  if (!task) throw new Error("Task not found");
  await prisma.studyTask.update({ where: { id: task.id }, data: { done: !task.done } });
  revalidatePath("/study");
}

export async function addStudyTask(input: { title: string; date: string; type?: string }) {
  const user = await requireUser();
  const schema = z.object({ title: z.string().min(1), date: z.string(), type: z.string().optional() });
  const data = schema.parse(input);
  await prisma.studyTask.create({
    data: { userId: user.id, title: data.title, date: new Date(data.date), type: data.type ?? "study" },
  });
  revalidatePath("/study");
}

// -------------------------------------------------------------------------
// Admin CMS
// -------------------------------------------------------------------------

export async function upsertQuestion(input: z.infer<typeof adminQuestionSchema>) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  const data = adminQuestionSchema.parse(input);
  const part = await prisma.part.findUniqueOrThrow({ where: { slug: data.partSlug } });

  if (data.id) {
    await prisma.option.deleteMany({ where: { questionId: data.id } });
    await prisma.question.update({
      where: { id: data.id },
      data: {
        partId: part.id,
        subjectId: data.subjectId,
        topicId: data.topicId ?? null,
        stem: data.stem,
        explanation: data.explanation,
        reference: data.reference,
        difficulty: data.difficulty,
        isFree: data.isFree,
        options: { create: data.options.map((o, i) => ({ text: o.text, isCorrect: o.isCorrect, order: i })) },
      },
    });
  } else {
    await prisma.question.create({
      data: {
        partId: part.id,
        subjectId: data.subjectId,
        topicId: data.topicId ?? null,
        stem: data.stem,
        explanation: data.explanation,
        reference: data.reference,
        difficulty: data.difficulty,
        isFree: data.isFree,
        options: { create: data.options.map((o, i) => ({ text: o.text, isCorrect: o.isCorrect, order: i })) },
      },
    });
  }
  revalidatePath("/admin/questions");
  return { ok: true };
}

export async function deleteQuestion(id: string) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  await prisma.question.delete({ where: { id } });
  revalidatePath("/admin/questions");
  return { ok: true };
}

const videoSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  youtubeId: z.string().min(3),
  category: z.string().min(1),
  durationSec: z.coerce.number().int().min(0).default(0),
  partSlug: z.enum(["PART_1", "PART_2", "PART_3"]).optional(),
  isFree: z.boolean().default(false),
});

export async function addVideo(input: z.infer<typeof videoSchema>) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  const data = videoSchema.parse(input);
  await prisma.video.create({
    data: {
      title: data.title,
      description: data.description,
      youtubeId: data.youtubeId,
      category: data.category,
      durationSec: data.durationSec,
      isFree: data.isFree,
      ...(data.partSlug ? { part: { connect: { slug: data.partSlug } } } : {}),
    },
  });
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  return { ok: true };
}

export async function deleteVideo(id: string) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Forbidden");
  await prisma.video.delete({ where: { id } });
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  return { ok: true };
}

// -------------------------------------------------------------------------
// Billing (demo activation when Stripe is not configured)
// -------------------------------------------------------------------------

export async function activateDemoPlan(plan: "MONTHLY" | "PART_BUNDLE" | "FULL_BUNDLE" | "FREE") {
  const user = await requireUser();
  if (process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is configured; use checkout instead.");
  }
  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      plan,
      status: plan === "FREE" ? "NONE" : "ACTIVE",
      currentPeriodEnd: plan === "FREE" ? null : new Date(Date.now() + 30 * 24 * 3600 * 1000),
    },
    create: {
      userId: user.id,
      plan,
      status: plan === "FREE" ? "NONE" : "ACTIVE",
      currentPeriodEnd: plan === "FREE" ? null : new Date(Date.now() + 30 * 24 * 3600 * 1000),
    },
  });
  revalidatePath("/billing");
  revalidatePath("/dashboard");
  return { ok: true };
}

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

async function getWeakTopicIds(userId: string): Promise<string[]> {
  const responses = await prisma.response.findMany({
    where: { attempt: { userId }, isCorrect: { not: null }, question: { topicId: { not: null } } },
    select: { isCorrect: true, question: { select: { topicId: true } } },
  });
  const map = new Map<string, { correct: number; total: number }>();
  for (const r of responses) {
    const tid = r.question.topicId!;
    const cur = map.get(tid) ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (r.isCorrect) cur.correct += 1;
    map.set(tid, cur);
  }
  return Array.from(map.entries())
    .filter(([, v]) => v.total >= 2)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .slice(0, 6)
    .map(([id]) => id);
}
