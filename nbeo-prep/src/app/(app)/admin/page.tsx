import Link from "next/link";
import { FileQuestion, Users, PlaySquare, BookOpen, ArrowRight, ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  await requireAdmin();
  const [questions, users, videos, resources, attempts] = await Promise.all([
    prisma.question.count(),
    prisma.user.count(),
    prisma.video.count(),
    prisma.resource.count(),
    prisma.attempt.count({ where: { status: "COMPLETED" } }),
  ]);

  const links = [
    { href: "/admin/questions", icon: FileQuestion, title: "Questions", desc: "Create and edit questions & explanations" },
    { href: "/admin/videos", icon: PlaySquare, title: "Videos", desc: "Manage the video library" },
    { href: "/admin/students", icon: Users, title: "Students", desc: "View student analytics" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Admin CMS" description="Manage content and monitor student performance.">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <ShieldCheck className="h-4 w-4" /> Administrator
        </span>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={FileQuestion} label="Questions" value={questions.toLocaleString()} />
        <StatCard icon={Users} label="Students" value={users} accent="text-violet-500" />
        <StatCard icon={PlaySquare} label="Videos" value={videos} accent="text-emerald-500" />
        <StatCard icon={BookOpen} label="Resources" value={resources} accent="text-amber-500" />
        <StatCard icon={FileQuestion} label="Sessions" value={attempts} accent="text-sky-500" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            <Card className="group h-full transition-colors hover:border-primary/40">
              <CardContent className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <l.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold">{l.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{l.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                  Manage <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
