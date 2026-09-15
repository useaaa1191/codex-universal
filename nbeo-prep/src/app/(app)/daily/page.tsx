import { CalendarCheck, Sparkles, Target, Repeat } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getAnalytics } from "@/lib/analytics";
import { formatPercent } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StartButton } from "@/components/practice/start-button";

export const metadata = { title: "Daily Quiz" };

export default async function DailyPage() {
  const user = await requireUser();
  const [analytics, dueCount] = await Promise.all([
    getAnalytics(user.id),
    prisma.srsCard.count({ where: { userId: user.id, dueDate: { lte: new Date() } } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Daily adaptive quiz"
        description="A personalized set that targets your lowest-performing topics and reviews questions you missed."
      />

      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <CalendarCheck className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Today&apos;s quiz is ready</h2>
              <p className="text-sm text-muted-foreground">
                20 questions · {dueCount} due reviews + your weakest topics
              </p>
            </div>
          </div>
          <StartButton size="xl" params={{ mode: "DAILY", count: 20, difficulty: "ALL" }}>
            <Sparkles className="h-4 w-4" /> Start daily quiz
          </StartButton>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Repeat className="h-4 w-4 text-violet-500" /> Due for review
            </CardTitle>
            <CardDescription>Spaced-repetition cards scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dueCount}</p>
            <p className="text-sm text-muted-foreground">cards ready to review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-warning" /> Weak topics targeted
            </CardTitle>
            <CardDescription>The daily quiz prioritizes these</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.weakTopics.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Answer more questions to reveal weak topics.
              </p>
            )}
            {analytics.weakTopics.slice(0, 4).map((t) => (
              <div key={t.topicId}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate pr-2">{t.topic}</span>
                  <Badge variant="outline">{formatPercent(t.accuracy)}</Badge>
                </div>
                <Progress className="mt-1" value={Math.round(t.accuracy * 100)} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
