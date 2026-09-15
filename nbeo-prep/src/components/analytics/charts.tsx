"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatPercent } from "@/lib/utils";
import type { Analytics } from "@/lib/analytics";

const PART_LABEL: Record<string, string> = {
  PART_1: "Part 1",
  PART_2: "Part 2",
  PART_3: "Part 3",
};

export function AnalyticsCharts({ analytics }: { analytics: Analytics }) {
  const radarData = analytics.subjectMastery.slice(0, 8).map((s) => ({
    subject: s.subject.split(" ").slice(0, 2).join(" "),
    accuracy: Math.round(s.accuracy * 100),
  }));

  const heat = analytics.subjectMastery.slice(0, 10);

  return (
    <div className="mt-6 space-y-6">
      {/* Predicted scores */}
      <div className="grid gap-4 lg:grid-cols-3">
        {analytics.predictions.map((p) => (
          <Card key={p.partSlug}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{PART_LABEL[p.partSlug]} predicted score</CardTitle>
              <CardDescription>Scaled score model (pass ≈ 300)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold">{p.answered ? p.predictedScore : "—"}</span>
                  {p.answered > 0 && (
                    <Badge
                      className="ml-2"
                      variant={p.predictedScore >= 300 ? "success" : "warning"}
                    >
                      {p.predictedScore >= 300 ? "On track" : "Keep going"}
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {p.answered > 0 ? `${Math.round(p.passLikelihood * 100)}% pass odds` : "No data"}
                </span>
              </div>
              <Progress
                className="mt-3"
                value={p.answered ? Math.min(100, Math.round((p.predictedScore / 500) * 100)) : 0}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score trend</CardTitle>
            <CardDescription>Accuracy per completed session</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.trend.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={analytics.trend} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v}%`, "Accuracy"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#acc)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Mastery radar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subject mastery</CardTitle>
            <CardDescription>Accuracy across your most-practiced subjects</CardDescription>
          </CardHeader>
          <CardContent>
            {radarData.length < 3 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <Radar
                    dataKey="accuracy"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.35}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v}%`, "Accuracy"]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Time per difficulty */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pacing by difficulty</CardTitle>
            <CardDescription>Average seconds per question</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.timeByDifficulty.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={analytics.timeByDifficulty} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="difficulty" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v}s`, "Avg time"]}
                  />
                  <Bar dataKey="avgSeconds" radius={[6, 6, 0, 0]}>
                    {analytics.timeByDifficulty.map((d, i) => (
                      <Cell
                        key={i}
                        fill={
                          d.difficulty === "HARD"
                            ? "hsl(var(--destructive))"
                            : d.difficulty === "MEDIUM"
                              ? "hsl(var(--warning))"
                              : "hsl(var(--success))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Mastery heatmap (list) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mastery heatmap</CardTitle>
            <CardDescription>Accuracy by subject</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {heat.length === 0 && <EmptyChart />}
            {heat.map((s) => (
              <div key={s.subjectId}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate pr-2">{s.subject}</span>
                  <span className="text-muted-foreground">
                    {formatPercent(s.accuracy)} · {s.answered}
                  </span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round(s.accuracy * 100)}%`,
                      background:
                        s.accuracy >= 0.75
                          ? "hsl(var(--success))"
                          : s.accuracy >= 0.5
                            ? "hsl(var(--warning))"
                            : "hsl(var(--destructive))",
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-[220px] items-center justify-center text-center text-sm text-muted-foreground">
      Answer more questions to unlock this chart.
    </div>
  );
}
