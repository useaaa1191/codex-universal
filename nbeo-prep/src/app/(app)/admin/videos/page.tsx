import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { VideoManager } from "@/components/admin/video-manager";

export const metadata = { title: "Admin · Videos" };

export default async function AdminVideosPage() {
  await requireAdmin();
  const videos = await prisma.video.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: { part: true },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/admin">
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>
      </Button>
      <PageHeader title="Video library" description="Add, preview, and remove progress-tracked video lessons." />
      <VideoManager
        videos={videos.map((v) => ({
          id: v.id,
          title: v.title,
          category: v.category,
          youtubeId: v.youtubeId,
          durationSec: v.durationSec,
          isFree: v.isFree,
          partSubtitle: v.part?.subtitle ?? null,
        }))}
      />
    </div>
  );
}
