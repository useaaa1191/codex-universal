import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { SrsReviewer } from "@/components/srs/srs-reviewer";

export const metadata = { title: "Spaced Repetition" };

export default async function SrsPage() {
  const user = await requireUser();
  const [dueCards, totalCards, upcoming] = await Promise.all([
    prisma.srsCard.findMany({
      where: { userId: user.id, dueDate: { lte: new Date() } },
      orderBy: { dueDate: "asc" },
      take: 40,
      include: {
        question: { include: { options: { orderBy: { order: "asc" } }, subject: true, topic: true } },
      },
    }),
    prisma.srsCard.count({ where: { userId: user.id } }),
    prisma.srsCard.count({ where: { userId: user.id, dueDate: { gt: new Date() } } }),
  ]);

  const cards = dueCards.map((c) => ({
    id: c.id,
    intervalDays: c.intervalDays,
    repetitions: c.repetitions,
    stem: c.question.stem,
    explanation: c.question.explanation,
    reference: c.question.reference,
    subject: c.question.subject.name,
    topic: c.question.topic?.name ?? null,
    options: c.question.options.map((o) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })),
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Spaced repetition"
        description="Review the questions you have missed. The SM-2 algorithm schedules each card at the optimal interval."
      />
      <SrsReviewer cards={cards} totalCards={totalCards} upcoming={upcoming} />
    </div>
  );
}
