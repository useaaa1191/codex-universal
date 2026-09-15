"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Timer, Shuffle, Loader2, Play, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { partColorClasses as pcc } from "@/lib/nbeo-content";
import { createAttempt } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";

interface PartLite {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  color: string;
  blockCount: number;
  itemsPerBlock: number;
  minutesPerBlock: number;
  totalItems: number;
  subjects: { id: string; name: string }[];
}

const MODES = [
  {
    id: "TUTORED",
    label: "Tutored",
    icon: GraduationCap,
    desc: "Instant feedback and explanation after each question.",
  },
  {
    id: "TIMED",
    label: "Timed",
    icon: Timer,
    desc: "A countdown clock. Review everything at the end.",
  },
  {
    id: "RANDOM",
    label: "Randomized",
    icon: Shuffle,
    desc: "A shuffled mixed set. Review at the end.",
  },
] as const;

export function PracticeBuilder({ parts, pro }: { parts: PartLite[]; pro: boolean }) {
  const router = useRouter();
  const [mode, setMode] = React.useState<string>("TUTORED");
  const [partSlug, setPartSlug] = React.useState<string>(parts[0]?.slug ?? "PART_1");
  const [subjectId, setSubjectId] = React.useState<string>("all");
  const [difficulty, setDifficulty] = React.useState<string>("ALL");
  const [count, setCount] = React.useState<string>("20");
  const [loading, setLoading] = React.useState<string | null>(null);

  const activePart = parts.find((p) => p.slug === partSlug) ?? parts[0];

  async function launch(opts: {
    mode: string;
    partSlug?: string;
    subjectId?: string;
    difficulty?: string;
    count: number;
    timeLimitSec?: number;
    key: string;
  }) {
    setLoading(opts.key);
    try {
      const res = await createAttempt({
        mode: opts.mode as never,
        partSlug: opts.partSlug as never,
        subjectId: opts.subjectId === "all" ? undefined : opts.subjectId,
        difficulty: (opts.difficulty ?? "ALL") as never,
        count: opts.count,
        timeLimitSec: opts.timeLimitSec,
      });
      router.push(`/session/${res.attemptId}`);
    } catch (e) {
      setLoading(null);
      toast({
        variant: "destructive",
        title: "Could not start",
        description: e instanceof Error ? e.message : "Try different filters.",
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* Custom builder */}
      <Card>
        <CardHeader>
          <CardTitle>Build a custom set</CardTitle>
          <CardDescription>
            {pro
              ? "Full access to all 3,000+ questions."
              : "Free tier draws from sample questions. Upgrade to unlock the full bank."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode */}
          <div className="grid gap-3 sm:grid-cols-3">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "rounded-lg border p-4 text-left transition-colors",
                  mode === m.id ? "border-primary bg-primary/5" : "hover:border-primary/40",
                )}
              >
                <m.icon className={cn("h-5 w-5", mode === m.id ? "text-primary" : "text-muted-foreground")} />
                <p className="mt-2 text-sm font-semibold">{m.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Exam part</Label>
              <Select value={partSlug} onValueChange={(v) => { setPartSlug(v); setSubjectId("all"); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {parts.map((p) => (
                    <SelectItem key={p.slug} value={p.slug}>
                      Part {p.number} — {p.subtitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  {activePart?.subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Questions</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["10", "20", "30", "50"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c} questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            size="lg"
            disabled={loading !== null}
            onClick={() =>
              launch({
                key: "custom",
                mode,
                partSlug,
                subjectId,
                difficulty,
                count: parseInt(count, 10),
                timeLimitSec: mode === "TIMED" ? parseInt(count, 10) * 75 : undefined,
              })
            }
          >
            {loading === "custom" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Start {count}-question {mode.toLowerCase()} set
          </Button>
        </CardContent>
      </Card>

      {/* Exam simulators */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Full exam simulators</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {parts.map((p) => {
            const c = pcc(p.color);
            const items = Math.min(p.itemsPerBlock, 40);
            const minutes = Math.round((items / p.itemsPerBlock) * p.minutesPerBlock);
            return (
              <Card key={p.slug} className="overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${c.gradient}`} />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{p.subtitle} Simulator</h3>
                    <Badge variant="outline">Part {p.number}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A timed block of {items} items in {minutes} minutes, matching real exam pacing.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    disabled={loading !== null || !pro}
                    onClick={() =>
                      launch({
                        key: `sim-${p.slug}`,
                        mode: "SIMULATOR",
                        partSlug: p.slug,
                        count: items,
                        timeLimitSec: minutes * 60,
                      })
                    }
                  >
                    {!pro ? (
                      <>
                        <Lock className="h-4 w-4" /> Upgrade to unlock
                      </>
                    ) : loading === `sim-${p.slug}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Timer className="h-4 w-4" /> Start simulator
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
