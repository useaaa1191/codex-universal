import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tutorQuizSchema } from "@/lib/validators";

export const runtime = "nodejs";

function keywords(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3),
    ),
  ).slice(0, 6);
}

// Grounded quiz generation: pull genuinely-correct items from the bank that
// match the prompt. This keeps every answer verifiable even without an LLM key.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = tutorQuizSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }
  const { prompt, count } = parsed.data;

  const words = keywords(prompt);
  const hard = /\bhard\b/i.test(prompt);
  const easy = /\beasy\b/i.test(prompt);

  const where = {
    ...(hard ? { difficulty: "HARD" as const } : {}),
    ...(easy ? { difficulty: "EASY" as const } : {}),
    ...(words.length
      ? {
          OR: words.flatMap((w) => [
            { stem: { contains: w, mode: "insensitive" as const } },
            { subject: { name: { contains: w, mode: "insensitive" as const } } },
            { topic: { name: { contains: w, mode: "insensitive" as const } } },
          ]),
        }
      : {}),
  };

  let questions = await prisma.question.findMany({
    where,
    take: count,
    include: { options: { orderBy: { order: "asc" } }, subject: true, topic: true },
  });

  if (questions.length === 0) {
    questions = await prisma.question.findMany({
      take: count,
      include: { options: { orderBy: { order: "asc" } }, subject: true, topic: true },
    });
  }

  return NextResponse.json({
    grounded: true,
    matched: questions.length,
    questions: questions.map((q) => ({
      id: q.id,
      stem: q.stem,
      subject: q.subject.name,
      topic: q.topic?.name ?? null,
      difficulty: q.difficulty,
      explanation: q.explanation,
      reference: q.reference,
      options: q.options.map((o) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })),
    })),
  });
}
