import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { QuizRunner } from "@/components/practice/quiz-runner";
import { QuizResults } from "@/components/practice/quiz-results";

export default async function SessionPage({ params }: { params: { attemptId: string } }) {
  const user = await requireUser();
  const attempt = await prisma.attempt.findFirst({
    where: { id: params.attemptId, userId: user.id },
    include: {
      part: true,
      responses: {
        orderBy: { order: "asc" },
        include: {
          question: {
            include: {
              options: { orderBy: { order: "asc" } },
              subject: true,
              topic: true,
            },
          },
        },
      },
    },
  });

  if (!attempt) notFound();

  if (attempt.status === "COMPLETED") {
    return <QuizResults attempt={attempt} />;
  }

  const tutored = attempt.mode === "TUTORED";

  const questions = attempt.responses.map((r) => ({
    responseId: r.id,
    questionId: r.questionId,
    order: r.order,
    stem: r.question.stem,
    explanation: r.question.explanation,
    reference: r.question.reference,
    difficulty: r.question.difficulty,
    subject: r.question.subject.name,
    topic: r.question.topic?.name ?? null,
    options: r.question.options.map((o) => ({ id: o.id, text: o.text })),
    correctOptionId: r.question.options.find((o) => o.isCorrect)?.id ?? "",
    selectedOptionId: r.selectedOptionId,
    flagged: r.flagged,
  }));

  return (
    <QuizRunner
      attempt={{
        id: attempt.id,
        mode: attempt.mode,
        title: attempt.title ?? "Practice",
        timeLimitSec: attempt.timeLimitSec,
        tutored,
      }}
      questions={questions}
    />
  );
}
