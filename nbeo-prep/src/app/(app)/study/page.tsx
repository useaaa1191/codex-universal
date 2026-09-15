import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { StudyPlanner } from "@/components/study/study-planner";

export const metadata = { title: "Study Plan" };

export default async function StudyPage() {
  const user = await requireUser();
  const tasks = await prisma.studyTask.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Study plan"
        description="Your study calendar. Plan sessions, track reviews, and keep your streak alive."
      />
      <StudyPlanner
        tasks={tasks.map((t) => ({
          id: t.id,
          title: t.title,
          type: t.type,
          done: t.done,
          date: t.date.toISOString(),
        }))}
      />
    </div>
  );
}
