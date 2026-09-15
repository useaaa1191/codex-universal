import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { QuestionEditor } from "@/components/admin/question-editor";

export const metadata = { title: "New question" };

export default async function NewQuestionPage() {
  await requireAdmin();
  const parts = await prisma.part.findMany({
    orderBy: { number: "asc" },
    include: { subjects: { orderBy: { order: "asc" }, include: { topics: { orderBy: { order: "asc" } } } } },
  });
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
    />
  );
}
