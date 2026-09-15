import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ChecklistRunner } from "@/components/part3/checklist-runner";

export default async function ChecklistPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const checklist = await prisma.checklist.findUnique({
    where: { id: params.id },
    include: { steps: { orderBy: { order: "asc" } }, part: true },
  });
  if (!checklist) notFound();

  const relatedVideo = await prisma.video.findFirst({
    where: { part: { slug: "PART_3" }, title: { contains: checklist.technique, mode: "insensitive" } },
  });

  const lastScore = await prisma.rubricScore.findFirst({
    where: { userId: user.id, checklistId: checklist.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/part3">
          <ArrowLeft className="h-4 w-4" /> Back to Part 3
        </Link>
      </Button>

      <ChecklistRunner
        checklist={{
          id: checklist.id,
          title: checklist.title,
          technique: checklist.technique,
          description: checklist.description,
          steps: checklist.steps.map((s) => ({
            id: s.id,
            text: s.text,
            critical: s.critical,
          })),
        }}
        videoId={relatedVideo?.youtubeId ?? null}
        lastScore={lastScore ? { score: lastScore.score, maxScore: lastScore.maxScore } : null}
      />
    </div>
  );
}
