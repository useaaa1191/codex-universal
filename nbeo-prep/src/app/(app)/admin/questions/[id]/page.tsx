import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { QuestionEditor } from "@/components/admin/question-editor";

export const metadata = { title: "Edit question" };

export default async function EditQuestionPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const [parts, question] = await Promise.all([
    prisma.part.findMany({
      orderBy: { number: "asc" },
      include: { subjects: { orderBy: { order: "asc" }, include: { topics: { orderBy: { order: "asc" } } } } },
    }),
    prisma.question.findUnique({
      where: { id: params.id },
      include: { options: { orderBy: { order: "asc" } }, part: true },
    }),
  ]);
  if (!question) notFound();

  return (
    <QuestionEditor
      parts={parts.map((p) => ({
        slug: p.slug,
        subtitle: p.subtitle,
        subjects: p.subjects.map((s) => ({
          id: s.id,
          name: s.name,
          topics: s.topics.map((t) => ({ id: t.id, name: t.name })),
        })),
      }))}
      initial={{
        id: question.id,
        partSlug: question.part.slug,
        subjectId: question.subjectId,
        topicId: question.topicId,
        stem: question.stem,
        explanation: question.explanation,
        reference: question.reference,
        difficulty: question.difficulty,
        isFree: question.isFree,
        options: question.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
      }}
    />
  );
}
