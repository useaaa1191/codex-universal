"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { upsertQuestion } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";

interface PartTree {
  slug: string;
  subtitle: string;
  subjects: { id: string; name: string; topics: { id: string; name: string }[] }[];
}

interface Initial {
  id: string;
  partSlug: string;
  subjectId: string;
  topicId: string | null;
  stem: string;
  explanation: string;
  reference: string | null;
  difficulty: string;
  isFree: boolean;
  options: { text: string; isCorrect: boolean }[];
}

export function QuestionEditor({ parts, initial }: { parts: PartTree[]; initial?: Initial }) {
  const router = useRouter();
  const [partSlug, setPartSlug] = React.useState(initial?.partSlug ?? parts[0]?.slug ?? "PART_1");
  const activePart = parts.find((p) => p.slug === partSlug) ?? parts[0];
  const [subjectId, setSubjectId] = React.useState(initial?.subjectId ?? activePart?.subjects[0]?.id ?? "");
  const activeSubject = activePart?.subjects.find((s) => s.id === subjectId);
  const [topicId, setTopicId] = React.useState<string>(initial?.topicId ?? "none");
  const [stem, setStem] = React.useState(initial?.stem ?? "");
  const [explanation, setExplanation] = React.useState(initial?.explanation ?? "");
  const [reference, setReference] = React.useState(initial?.reference ?? "");
  const [difficulty, setDifficulty] = React.useState(initial?.difficulty ?? "MEDIUM");
  const [isFree, setIsFree] = React.useState(initial?.isFree ?? false);
  const [options, setOptions] = React.useState(
    initial?.options ?? [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  );
  const [saving, setSaving] = React.useState(false);

  function onPartChange(v: string) {
    setPartSlug(v);
    const p = parts.find((x) => x.slug === v);
    setSubjectId(p?.subjects[0]?.id ?? "");
    setTopicId("none");
  }

  function setCorrect(idx: number) {
    setOptions((o) => o.map((opt, i) => ({ ...opt, isCorrect: i === idx })));
  }

  async function save() {
    if (!subjectId) {
      toast({ variant: "destructive", title: "Pick a subject" });
      return;
    }
    setSaving(true);
    try {
      await upsertQuestion({
        id: initial?.id,
        partSlug: partSlug as "PART_1" | "PART_2" | "PART_3",
        subjectId,
        topicId: topicId === "none" ? null : topicId,
        stem,
        explanation,
        reference: reference || undefined,
        difficulty: difficulty as "EASY" | "MEDIUM" | "HARD",
        isFree,
        options: options.filter((o) => o.text.trim().length > 0),
      });
      toast({ variant: "success", title: initial ? "Question updated" : "Question created" });
      router.push("/admin/questions");
      router.refresh();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/admin/questions">
          <ArrowLeft className="h-4 w-4" /> Back to questions
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{initial ? "Edit question" : "New question"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Part</Label>
              <Select value={partSlug} onValueChange={onPartChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {parts.map((p) => (
                    <SelectItem key={p.slug} value={p.slug}>
                      {p.subtitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={subjectId} onValueChange={(v) => { setSubjectId(v); setTopicId("none"); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activePart?.subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Topic</Label>
              <Select value={topicId} onValueChange={setTopicId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {activeSubject?.topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stem">Question stem</Label>
            <Textarea id="stem" value={stem} onChange={(e) => setStem(e.target.value)} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Answer options (select the correct one)</Label>
            {options.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCorrect(i)}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    o.isCorrect ? "border-success bg-success/15 text-success" : "text-muted-foreground",
                  )}
                  aria-label={`Mark option ${String.fromCharCode(65 + i)} correct`}
                >
                  {String.fromCharCode(65 + i)}
                </button>
                <Input
                  value={o.text}
                  onChange={(e) =>
                    setOptions((opts) => opts.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))
                  }
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setOptions((opts) => opts.filter((_, j) => j !== i))}
                    aria-label="Remove option"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOptions((o) => [...o, { text: "", isCorrect: false }])}
              >
                <Plus className="h-4 w-4" /> Add option
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation</Label>
            <Textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Free sample</p>
              <p className="text-xs text-muted-foreground">Available to free-tier users</p>
            </div>
            <Switch checked={isFree} onCheckedChange={setIsFree} />
          </div>

          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {initial ? "Save changes" : "Create question"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
