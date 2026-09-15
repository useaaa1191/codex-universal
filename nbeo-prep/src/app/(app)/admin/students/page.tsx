import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials, formatPercent } from "@/lib/utils";

export const metadata = { title: "Admin · Students" };

export default async function AdminStudentsPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscription: true,
      _count: { select: { attempts: true } },
    },
  });

  const rows = await Promise.all(
    users.map(async (u) => {
      const [answered, correct, lastAttempt] = await Promise.all([
        prisma.response.count({ where: { attempt: { userId: u.id }, isCorrect: { not: null } } }),
        prisma.response.count({ where: { attempt: { userId: u.id }, isCorrect: true } }),
        prisma.attempt.findFirst({
          where: { userId: u.id },
          orderBy: { createdAt: "desc" },
          select: { createdAt: true },
        }),
      ]);
      return {
        id: u.id,
        name: u.name ?? u.email ?? "Anonymous",
        email: u.email ?? "",
        role: u.role,
        plan: u.subscription?.status === "ACTIVE" ? u.subscription.plan : "FREE",
        attempts: u._count.attempts,
        answered,
        accuracy: answered > 0 ? correct / answered : 0,
        lastActive: lastAttempt?.createdAt ?? null,
      };
    }),
  );

  const totalAnswered = rows.reduce((s, r) => s + r.answered, 0);
  const activeLearners = rows.filter((r) => r.answered > 0).length;
  const proMembers = rows.filter((r) => r.plan !== "FREE").length;

  return (
    <div className="mx-auto max-w-5xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/admin">
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>
      </Button>
      <PageHeader title="Student analytics" description="Monitor engagement and performance across the cohort." />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard icon={Users} label="Students" value={rows.length} />
        <StatCard icon={Users} label="Active" value={activeLearners} accent="text-emerald-500" />
        <StatCard icon={Users} label="Pro members" value={proMembers} accent="text-violet-500" />
        <StatCard icon={Users} label="Answers logged" value={totalAnswered.toLocaleString()} accent="text-sky-500" />
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="divide-y">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{initials(r.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{r.name}</p>
                    {r.role === "ADMIN" && <Badge variant="secondary" className="text-[10px]">Admin</Badge>}
                    <Badge variant={r.plan === "FREE" ? "outline" : "success"} className="text-[10px]">
                      {r.plan.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{r.email}</p>
                </div>
                <div className="hidden w-24 text-center sm:block">
                  <p className="text-sm font-semibold">{r.answered.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">answered</p>
                </div>
                <div className="w-20 text-center">
                  <p className="text-sm font-semibold">{r.answered > 0 ? formatPercent(r.accuracy) : "—"}</p>
                  <p className="text-xs text-muted-foreground">accuracy</p>
                </div>
                <div className="hidden w-28 text-right md:block">
                  <p className="text-xs text-muted-foreground">
                    {r.lastActive ? `${formatDistanceToNow(r.lastActive)} ago` : "No activity"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
