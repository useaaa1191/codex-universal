"use client";

import * as React from "react";
import { CheckCircle2, Circle, AlertCircle, Save, RotateCcw, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { VideoEmbed } from "@/components/video-embed";
import { cn } from "@/lib/utils";
import { saveRubricScore } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";

interface Step {
  id: string;
  text: string;
  critical: boolean;
}

export function ChecklistRunner({
  checklist,
  videoId,
  lastScore,
}: {
  checklist: { id: string; title: string; technique: string; description: string; steps: Step[] };
  videoId: string | null;
  lastScore: { score: number; maxScore: number } | null;
}) {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState<{ score: number; max: number } | null>(null);

  const total = checklist.steps.length;
  const done = checklist.steps.filter((s) => checked[s.id]).length;
  const criticalTotal = checklist.steps.filter((s) => s.critical).length;
  const criticalDone = checklist.steps.filter((s) => s.critical && checked[s.id]).length;

  function toggle(id: string) {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  }

  async function submit() {
    setSaving(true);
    try {
      await saveRubricScore({ checklistId: checklist.id, score: done, maxScore: total, notes });
      setSaved({ score: done, max: total });
      toast({ variant: "success", title: "Self-assessment saved", description: `${done}/${total} steps completed.` });
    } catch {
      toast({ variant: "destructive", title: "Could not save" });
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setChecked({});
    setNotes("");
    setSaved(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{checklist.title}</h1>
        <p className="mt-1 text-muted-foreground">{checklist.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{checklist.technique}</Badge>
          <Badge variant="outline">{total} steps</Badge>
          <Badge variant="outline">{criticalTotal} critical</Badge>
          {lastScore && (
            <Badge variant="success">
              Last: {lastScore.score}/{lastScore.maxScore}
            </Badge>
          )}
        </div>
      </div>

      {videoId && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Video demonstration</h2>
          <VideoEmbed youtubeId={videoId} title={checklist.title} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Procedural checklist</CardTitle>
          <CardDescription>
            Tick each step as you rehearse. Critical steps must be completed to pass the station.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="mb-3 flex items-center gap-4 text-sm">
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Steps</span>
                <span className="font-medium">
                  {done}/{total}
                </span>
              </div>
              <Progress className="mt-1" value={total ? Math.round((done / total) * 100) : 0} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Critical</span>
                <span className="font-medium">
                  {criticalDone}/{criticalTotal}
                </span>
              </div>
              <Progress
                className="mt-1"
                value={criticalTotal ? Math.round((criticalDone / criticalTotal) * 100) : 0}
                indicatorClassName="bg-warning"
              />
            </div>
          </div>

          {checklist.steps.map((s, i) => {
            const on = checked[s.id];
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                  on ? "border-success/50 bg-success/5" : "hover:bg-accent",
                )}
              >
                {on ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <span className="flex-1">
                  <span className="mr-2 font-medium text-muted-foreground">{i + 1}.</span>
                  {s.text}
                </span>
                {s.critical && (
                  <Badge variant="warning" className="shrink-0 gap-1">
                    <AlertCircle className="h-3 w-3" /> critical
                  </Badge>
                )}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Self-assessment rubric</CardTitle>
          <CardDescription>Note what to improve, then save your score.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {saved && (
            <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-sm">
              <Trophy className="h-5 w-5 text-success" />
              <span>
                Scored <strong>{saved.score}/{saved.max}</strong> ({Math.round((saved.score / saved.max) * 100)}%).
                {criticalDone < criticalTotal && " Watch the critical steps you missed."}
              </span>
            </div>
          )}
          <Textarea
            placeholder="What went well? What will you drill before the exam?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={submit} disabled={saving || done === 0}>
              <Save className="h-4 w-4" /> Save self-assessment
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
