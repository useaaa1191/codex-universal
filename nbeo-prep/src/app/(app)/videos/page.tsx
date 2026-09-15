import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDuration } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoEmbed } from "@/components/video-embed";

export const metadata = { title: "Videos" };

export default async function VideosPage() {
  await requireUser();
  const videos = await prisma.video.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: { part: true },
  });

  const byCategory = new Map<string, typeof videos>();
  for (const v of videos) {
    const arr = byCategory.get(v.category) ?? [];
    arr.push(v);
    byCategory.set(v.category, arr);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Video lessons"
        description="Progress-tracked video lessons and clinical-skill demonstrations across all three parts."
      />
      <div className="space-y-10">
        {Array.from(byCategory.entries()).map(([category, list]) => (
          <div key={category}>
            <h2 className="mb-4 text-lg font-semibold">{category}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {list.map((v) => (
                <Card key={v.id} className="overflow-hidden">
                  <VideoEmbed youtubeId={v.youtubeId} title={v.title} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold leading-snug">{v.title}</h3>
                      <Badge variant="outline" className="shrink-0">
                        {formatDuration(v.durationSec)}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {v.description}
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      {v.part && <Badge variant="secondary" className="text-[10px]">{v.part.subtitle}</Badge>}
                      {v.isFree && <Badge variant="success" className="text-[10px]">Free</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
