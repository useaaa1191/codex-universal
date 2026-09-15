"use client";

import * as React from "react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { CheckCircle2, Circle, Plus, CalendarDays, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toggleStudyTask, addStudyTask } from "@/lib/actions";

interface Task {
  id: string;
  title: string;
  type: string;
  done: boolean;
  date: string;
}

const TYPE_COLORS: Record<string, string> = {
  study: "bg-sky-500/15 text-sky-500",
  review: "bg-violet-500/15 text-violet-500",
  quiz: "bg-emerald-500/15 text-emerald-500",
  simulator: "bg-amber-500/15 text-amber-500",
  reading: "bg-pink-500/15 text-pink-500",
  skills: "bg-teal-500/15 text-teal-500",
};

function dayLabel(d: Date) {
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEEE, MMM d");
}

export function StudyPlanner({ tasks: initial }: { tasks: Task[] }) {
  const [tasks, setTasks] = React.useState(initial);
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState(format(new Date(), "yyyy-MM-dd"));
  const [adding, setAdding] = React.useState(false);
  const [, startTransition] = React.useTransition();

  function toggle(id: string) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
    startTransition(() => {
      void toggleStudyTask(id);
    });
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    await addStudyTask({ title, date, type: "study" });
    const optimistic: Task = {
      id: `tmp-${Date.now()}`,
      title,
      type: "study",
      done: false,
      date: new Date(date).toISOString(),
    };
    setTasks((t) => [...t, optimistic].sort((a, b) => a.date.localeCompare(b.date)));
    setTitle("");
    setAdding(false);
  }

  const groups = new Map<string, Task[]>();
  for (const t of tasks) {
    const key = t.date.slice(0, 10);
    const arr = groups.get(key) ?? [];
    arr.push(t);
    groups.set(key, arr);
  }
  const sortedKeys = Array.from(groups.keys()).sort();

  const completed = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5">
          <form className="flex flex-col gap-2 sm:flex-row" onSubmit={add}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a study task…"
              className="flex-1"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="sm:w-44"
            />
            <Button type="submit" disabled={adding || !title.trim()}>
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            {completed}/{tasks.length} tasks completed
          </p>
        </CardContent>
      </Card>

      {sortedKeys.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-10 text-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No tasks yet. Add your first study session above.</p>
          </CardContent>
        </Card>
      )}

      {sortedKeys.map((key) => {
        const d = new Date(key);
        const overdue = isPast(d) && !isToday(d);
        return (
          <div key={key}>
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-sm font-semibold">{dayLabel(d)}</h2>
              {overdue && <Badge variant="destructive" className="text-[10px]">overdue</Badge>}
            </div>
            <Card>
              <CardContent className="divide-y p-0">
                {groups.get(key)!.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggle(t.id)}
                    className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-accent"
                  >
                    {t.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <span className={cn("flex-1 text-sm", t.done && "text-muted-foreground line-through")}>
                      {t.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                        TYPE_COLORS[t.type] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      {t.type}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
