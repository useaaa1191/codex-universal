import { CheckCircle2, Timer, Flame, Trophy } from "lucide-react";
import { requireUser } from "@/lib/session";
import { getAnalytics } from "@/lib/analytics";
import { formatPercent, formatDuration } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { AnalyticsCharts } from "@/components/analytics/charts";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const user = await requireUser();
  const analytics = await getAnalytics(user.id);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Analytics"
        description="Track your trends, mastery, and predicted scores across all three parts."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CheckCircle2}
          label="Overall accuracy"
          value={formatPercent(analytics.overallAccuracy)}
          sub={`${analytics.totalAnswered} answered`}
        />
        <StatCard
          icon={Timer}
          label="Avg time / question"
          value={formatDuration(analytics.avgSecondsPerQuestion)}
          accent="text-sky-500"
        />
        <StatCard
          icon={Flame}
          label="Study streak"
          value={`${analytics.studyStreak}d`}
          accent="text-orange-500"
        />
        <StatCard
          icon={Trophy}
          label="Est. percentile"
          value={`${analytics.percentile}th`}
          accent="text-emerald-500"
        />
      </div>

      <AnalyticsCharts analytics={analytics} />
    </div>
  );
}
