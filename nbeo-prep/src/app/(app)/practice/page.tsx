import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/entitlements";
import { PageHeader } from "@/components/app/page-header";
import { PracticeBuilder } from "@/components/practice/practice-builder";

export const metadata = { title: "Practice" };

export default async function PracticePage() {
  const user = await requireUser();
  const parts = await prisma.part.findMany({
    orderBy: { number: "asc" },
    include: { subjects: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Practice"
        description="Build a custom set, or jump into a quick session. Tutored mode gives instant explanations; timed mode mirrors the real exam."
      />
      <PracticeBuilder
        pro={hasProAccess(user)}
        parts={parts.map((p) => ({
          slug: p.slug,
          number: p.number,
          title: p.title,
          subtitle: p.subtitle,
          color: p.color,
          blockCount: p.blockCount,
          itemsPerBlock: p.itemsPerBlock,
          minutesPerBlock: p.minutesPerBlock,
          totalItems: p.totalItems,
          subjects: p.subjects.map((s) => ({ id: s.id, name: s.name })),
        }))}
      />
    </div>
  );
}
