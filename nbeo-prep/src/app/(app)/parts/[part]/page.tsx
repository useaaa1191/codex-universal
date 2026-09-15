import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, PlaySquare, Stethoscope, Target } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { partColorClasses } from "@/lib/nbeo-content";
import { formatPercent } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StartButton } from "@/components/practice/start-button";

const numberToSlug: Record<string, "PART_1" | "PART_2" | "PART_3"> = {
  "1": "PART_1",
  "2": "PART_2",
  "3": "PART_3",
};

export default async function PartPage({ params }: { params: { part: string } }) {
  const user = await requireUser();
  const slug = numberToSlug[params.part];
  if (!slug) notFound();

  const part = await prisma.part.findUnique({
    where: { slug },
    include: {
      subjects: {
        orderBy: { order: "asc" },
        include: {
          topics: { orderBy: { order: "asc" } },
          _count: { select: { questions: true } },
        },
      },
    },
  });
  if (!part) notFound();

  // Per-subject accuracy for this user
  const responses = await prisma.response.findMany({
    where: {
      attempt: { userId: user.id },
      isCorrect: { not: null },
      question: { partId: part.id },
    },
    select: { isCorrect: true, question: { select: { subjectId: true } } },
  });
  const acc = new Map<string, { c: number; t: number }>();
  for (const r of responses) {
    const cur = acc.get(r.question.subjectId) ?? { c: 0, t: 0 };
    cur.t += 1;
    if (r.isCorrect) cur.c += 1;
    acc.set(r.question.subjectId, cur);
  }

  const c = partColorClasses(part.color);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={part.title} description={part.description}>
        <StartButton
          params={{ mode: "TUTORED", partSlug: slug, count: 20, difficulty: "ALL" }}
        >
          <Target className="h-4 w-4" /> Practice this part
        </StartButton>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Question bank</p>
            <p className="text-2xl font-bold">{part.totalItems.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Subjects</p>
            <p className="text-2xl font-bold">{part.subjects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Exam structure</p>
            <p className="text-2xl font-bold">
              {part.blockCount} × {part.itemsPerBlock}
            </p>
            <p className="text-xs text-muted-foreground">{part.minutesPerBlock} min / block</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick links for Part 3 */}
      {slug === "PART_3" && (
        <Card className="mt-6">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <Stethoscope className={`h-6 w-6 ${c.text}`} />
              <div>
                <p className="font-semibold">Clinical skills stations</p>
                <p className="text-sm text-muted-foreground">
                  Video demos, procedural checklists, and self-assessment rubrics.
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/part3">Open Part 3 module</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Syllabus */}
      <h2 className="mb-4 mt-8 text-lg font-semibold">
        Syllabus mapped to the NBEO content outline
      </h2>
      <Card>
        <CardContent className="p-2 sm:p-4">
          <Accordion type="multiple">
            {part.subjects.map((s) => {
              const a = acc.get(s.id);
              const accuracy = a && a.t ? a.c / a.t : null;
              return (
                <AccordionItem key={s.id} value={s.id}>
                  <AccordionTrigger>
                    <div className="flex flex-1 items-center justify-between gap-3 pr-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{s.name}</span>
                        <Badge variant="outline" className="text-[10px]">
                          ~{s.weight}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        {accuracy !== null && (
                          <span className="text-xs text-muted-foreground">
                            {formatPercent(accuracy)}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {s._count.questions} Q
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {s.blueprint && (
                      <p className="mb-3 text-sm text-muted-foreground">{s.blueprint}</p>
                    )}
                    {accuracy !== null && (
                      <Progress className="mb-4" value={Math.round(accuracy * 100)} />
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {s.topics.map((t) => (
                        <Badge key={t.id} variant="secondary" className="font-normal">
                          {t.name}
                        </Badge>
                      ))}
                    </div>
                    <StartButton
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      params={{
                        mode: "TUTORED",
                        partSlug: slug,
                        subjectId: s.id,
                        count: 20,
                        difficulty: "ALL",
                      }}
                    >
                      <Target className="h-4 w-4" /> Practice {s.name}
                    </StartButton>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/library">
            <BookOpen className="h-4 w-4" /> Study guides & high-yield sheets
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/videos">
            <PlaySquare className="h-4 w-4" /> Video lessons
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/study">Study calendar</Link>
        </Button>
      </div>
    </div>
  );
}
