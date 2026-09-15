import Link from "next/link";
import { Stethoscope, ClipboardCheck, PlaySquare, ChevronRight } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Part 3 Clinical Skills" };

export default async function Part3Page() {
  await requireUser();
  const [checklists, videos] = await Promise.all([
    prisma.checklist.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { steps: true } } },
    }),
    prisma.video.findMany({ where: { part: { slug: "PART_3" } }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Part 3 — Clinical Skills"
        description="Prepare for every graded station with video demonstrations, step-by-step procedural checklists, and self-assessment rubrics."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <ClipboardCheck className="h-5 w-5 text-emerald-500" /> Procedural checklists
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {checklists.map((c) => (
              <Link key={c.id} href={`/part3/${c.id}`}>
                <Card className="group h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-3 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.technique}</p>
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {c._count.steps} steps
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <PlaySquare className="h-5 w-5 text-emerald-500" /> Video demos
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Technique library</CardTitle>
              <CardDescription>Watch full station walkthroughs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {videos.map((v) => (
                <Link
                  key={v.id}
                  href="/videos"
                  className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent"
                >
                  <span className="truncate pr-2">{v.title}</span>
                  <PlaySquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
              {videos.length === 0 && (
                <p className="text-sm text-muted-foreground">No videos yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
