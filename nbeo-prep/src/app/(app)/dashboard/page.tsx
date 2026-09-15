import Link from "next/link";
import {
  Target,
  Flame,
  CheckCircle2,
  Repeat,
  ArrowRight,
  TrendingUp,
  CalendarCheck,
  Bot,
  AlertTriangle,
} from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getAnalytics } from "@/lib/analytics";
import { hasProAccess, planLabel } from "@/lib/entitlements";
import { partColorClasses } from "@/lib/nbeo-content";
import { formatPercent } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function DashboardPage() {
  const user = await requireUser();
  const [analytics, parts, dueCount, recentAttempts] = await Promise.all([
    getAnalytics(user.id),
    prisma.part.findMany({ orderBy: { number: "asc" } }),
    prisma.srsCard.count({ where: { userId: user.id, dueDate: { lte: new Date() } } }),
    prisma.attempt.findMany({
      where: { userId: user.id, status: "COMPLETED" },
      orderBy: { finishedAt: "desc" },
      take: 5,
      include: { part: true, responses: true },
    }),
  ]);

  const pro = hasProAccess(user);
  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's your board-prep progress across all three parts."
      >
        <Badge variant={pro ? "success" : "secondary"}>{planLabel(user.subscription?.plan)}</Badge>
        <Button asChild>
          <Link href="/practice">
            <Target className="h-4 w-4" /> Start practice
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CheckCircle2}
          label="Overall accuracy"
          value={formatPercent(analytics.overallAccuracy)}
          sub={`${analytics.totalCorrect}/${analytics.totalAnswered} correct`}
        />
        <StatCard
          icon={Flame}
          label="Study streak"
          value={`${analytics.studyStreak} days`}
          sub="Keep it going"
          accent="text-orange-500"
        />
        <StatCard
          icon={Repeat}
          label="Reviews due"
          value={dueCount}
          sub="Spaced repetition"
          accent="text-violet-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Est. percentile"
          value={`${analytics.percentile}th`}
          sub="Based on your accuracy"
          accent="text-emerald-500"
        />
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <QuickAction
          href="/daily"
          icon={CalendarCheck}
          title="Daily adaptive quiz"
          desc="Targets your weakest topics"
        />
        <QuickAction href="/srs" icon={Repeat} title={`Review ${dueCount} cards`} desc="Spaced repetition due today" />
        <QuickAction href="/tutor" icon={Bot} title="Ask the AI tutor" desc="Explanations & custom quizzes" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Parts */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Your exam parts</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {parts.map((p) => {
              const c = partColorClasses(p.color);
              const pred = analytics.predictions.find((x) => x.partSlug === p.slug);
              return (
                <Link key={p.id} href={`/parts/${p.number}`}>
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
                    <div className={`h-1.5 bg-gradient-to-r ${c.gradient}`} />
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${c.gradient} text-sm font-bold text-white`}
                        >
                          {p.number}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {p.subtitle}
                        </Badge>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold">
                        {p.title.split("—")[1]?.trim()}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">{p.totalItems} questions</p>
                      {pred && pred.answered > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Accuracy</span>
                            <span className="font-medium">{formatPercent(pred.accuracy)}</span>
                          </div>
                          <Progress className="mt-1" value={Math.round(pred.accuracy * 100)} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Recent activity */}
          <h2 className="mb-4 mt-8 text-lg font-semibold">Recent activity</h2>
          <Card>
            <CardContent className="divide-y p-0">
              {recentAttempts.length === 0 && (
                <p className="p-6 text-sm text-muted-foreground">
                  No completed sessions yet. Start a practice set to see your history here.
                </p>
              )}
              {recentAttempts.map((a) => {
                const answered = a.responses.filter((r) => r.isCorrect !== null).length;
                const correct = a.responses.filter((r) => r.isCorrect).length;
                const acc = answered ? correct / answered : 0;
                return (
                  <div key={a.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.part?.subtitle ?? "Mixed"} · {answered} questions ·{" "}
                        {a.finishedAt?.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={acc >= 0.7 ? "success" : acc >= 0.5 ? "warning" : "destructive"}>
                      {formatPercent(acc)}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Weak topics */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Focus areas</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-warning" /> Weakest topics
              </CardTitle>
              <CardDescription>Where your accuracy is lowest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.weakTopics.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Answer more questions to reveal your weak topics.
                </p>
              )}
              {analytics.weakTopics.slice(0, 6).map((t) => (
                <div key={t.topicId}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2">{t.topic}</span>
                    <span className="font-medium">{formatPercent(t.accuracy)}</span>
                  </div>
                  <Progress
                    className="mt-1"
                    value={Math.round(t.accuracy * 100)}
                    indicatorClassName={t.accuracy < 0.5 ? "bg-destructive" : "bg-warning"}
                  />
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/daily">
                  Practice weak topics <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof Target;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href}>
      <Card className="group transition-colors hover:border-primary/40">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{title}</p>
            <p className="truncate text-xs text-muted-foreground">{desc}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
