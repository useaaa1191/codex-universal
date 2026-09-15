import Link from "next/link";
import { BookOpen, Zap, Brain, Sigma, ArrowRight } from "lucide-react";
import type { ResourceKind } from "@prisma/client";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = { title: "Library" };

const KIND_META: Record<ResourceKind, { label: string; icon: typeof BookOpen; color: string }> = {
  STUDY_GUIDE: { label: "Study Guides", icon: BookOpen, color: "text-sky-500" },
  HIGH_YIELD: { label: "High-Yield", icon: Zap, color: "text-amber-500" },
  MNEMONIC: { label: "Mnemonics", icon: Brain, color: "text-violet-500" },
  FORMULA: { label: "Formulas", icon: Sigma, color: "text-emerald-500" },
};

export default async function LibraryPage() {
  await requireUser();
  const resources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { part: true },
  });

  const kinds = Object.keys(KIND_META) as ResourceKind[];

  const grid = (items: typeof resources) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => {
        const meta = KIND_META[r.kind];
        return (
          <Link key={r.id} href={`/library/${r.slug}`}>
            <Card className="group h-full transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${meta.color}`}>
                    <meta.icon className="h-5 w-5" />
                  </div>
                  {r.part && <Badge variant="outline">{r.part.subtitle}</Badge>}
                </div>
                <h3 className="mt-3 font-semibold group-hover:text-primary">{r.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.summary}</p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                  Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">Nothing here yet.</p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Content library"
        description="Downloadable study guides, high-yield review sheets, a mnemonics library, and pharmacology & optics formula references."
      />
      <Tabs defaultValue="all">
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          {kinds.map((k) => (
            <TabsTrigger key={k} value={k}>
              {KIND_META[k].label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">{grid(resources)}</TabsContent>
        {kinds.map((k) => (
          <TabsContent key={k} value={k}>
            {grid(resources.filter((r) => r.kind === k))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
