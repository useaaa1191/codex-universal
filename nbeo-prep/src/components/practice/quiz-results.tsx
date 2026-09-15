import Link from "next/link";
import { CheckCircle2, XCircle, Flag, RotateCcw, LayoutDashboard, MinusCircle } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPercent, formatDuration, cn } from "@/lib/utils";

type AttemptWithResponses = Prisma.AttemptGetPayload<{
  include: {
    part: true;
    responses: {
      include: {
        question: {
          include: { options: true; subject: true; topic: true };
        };
      };
    };
  };
}>;

export function QuizResults({ attempt }: { attempt: AttemptWithResponses }) {
  const responses = [...attempt.responses].sort((a, b) => a.order - b.order);
  const answered = responses.filter((r) => r.isCorrect !== null);
  const correct = responses.filter((r) => r.isCorrect === true).length;
  const incorrect = answered.length - correct;
  const skipped = responses.length - answered.length;
  const accuracy = answered.length ? correct / answered.length : 0;
  const totalTime = responses.reduce((s, r) => s + r.timeSpentSec, 0);

  // Subject breakdown
  const subj = new Map<string, { name: string; total: number; correct: number }>();
  for (const r of answered) {
    const s = r.question.subject;
    const cur = subj.get(s.id) ?? { name: s.name, total: 0, correct: 0 };
    cur.total += 1;
    if (r.isCorrect) cur.correct += 1;
    subj.set(s.id, cur);
  }

  const renderItem = (r: (typeof responses)[number], i: number) => {
    const correctOpt = r.question.options.find((o) => o.isCorrect);
    const selectedOpt = r.question.options.find((o) => o.id === r.selectedOptionId);
    return (
      <Card key={r.id} className="overflow-hidden">
        <CardContent className="p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">Q{i + 1}</Badge>
            <Badge variant="secondary">{r.question.subject.name}</Badge>
            {r.isCorrect === true && (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> Correct
              </Badge>
            )}
            {r.isCorrect === false && (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" /> Incorrect
              </Badge>
            )}
            {r.isCorrect === null && (
              <Badge variant="outline" className="gap-1">
                <MinusCircle className="h-3 w-3" /> Skipped
              </Badge>
            )}
            {r.flagged && (
              <Badge variant="warning" className="gap-1">
                <Flag className="h-3 w-3" /> Flagged
              </Badge>
            )}
          </div>
          <p className="text-sm font-medium leading-relaxed">{r.question.stem}</p>
          <div className="mt-3 space-y-1.5 text-sm">
            {r.question.options.map((o) => {
              const isCorrect = o.isCorrect;
              const isSelected = o.id === r.selectedOptionId;
              return (
                <div
                  key={o.id}
                  className={cn(
                    "rounded-md border px-3 py-2",
                    isCorrect && "border-success bg-success/10",
                    isSelected && !isCorrect && "border-destructive bg-destructive/10",
                  )}
                >
                  {o.text}
                  {isCorrect && <span className="ml-2 text-xs font-medium text-success">(correct)</span>}
                  {isSelected && !isCorrect && (
                    <span className="ml-2 text-xs font-medium text-destructive">(your answer)</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Explanation: </span>
            {r.question.explanation}
            {r.question.reference && (
              <div className="mt-1 text-xs">Reference: {r.question.reference}</div>
            )}
          </div>
          {!selectedOpt && !correctOpt && null}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{attempt.title}</h1>
          <p className="text-sm text-muted-foreground">
            {attempt.part?.subtitle ?? "Mixed"} · Completed{" "}
            {attempt.finishedAt?.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/practice">
              <RotateCcw className="h-4 w-4" /> New set
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Score */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="sm:col-span-1">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl font-bold text-primary">{formatPercent(accuracy)}</div>
            <p className="mt-1 text-sm text-muted-foreground">Score</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-3">
          <CardContent className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
            <Stat label="Correct" value={correct} className="text-success" />
            <Stat label="Incorrect" value={incorrect} className="text-destructive" />
            <Stat label="Skipped" value={skipped} className="text-muted-foreground" />
            <Stat label="Time" value={formatDuration(totalTime)} />
          </CardContent>
        </Card>
      </div>

      {/* Subject breakdown */}
      {subj.size > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Breakdown by subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from(subj.values()).map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="font-medium">
                    {s.correct}/{s.total} ({formatPercent(s.correct / s.total)})
                  </span>
                </div>
                <Progress className="mt-1" value={Math.round((s.correct / s.total) * 100)} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Review */}
      <h2 className="mb-4 mt-8 text-lg font-semibold">Review answers</h2>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({responses.length})</TabsTrigger>
          <TabsTrigger value="incorrect">Incorrect ({incorrect})</TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged ({responses.filter((r) => r.flagged).length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {responses.map(renderItem)}
        </TabsContent>
        <TabsContent value="incorrect" className="space-y-4">
          {responses.filter((r) => r.isCorrect === false).map(renderItem)}
        </TabsContent>
        <TabsContent value="flagged" className="space-y-4">
          {responses.filter((r) => r.flagged).map(renderItem)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <div className="text-center">
      <div className={cn("text-2xl font-bold", className)}>{value}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
