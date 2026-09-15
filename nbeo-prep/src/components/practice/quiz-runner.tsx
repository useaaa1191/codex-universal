"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  BookOpenCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatDuration } from "@/lib/utils";
import { saveAnswer, finishAttempt } from "@/lib/actions";

interface QOption {
  id: string;
  text: string;
}
interface QItem {
  responseId: string;
  questionId: string;
  order: number;
  stem: string;
  explanation: string;
  reference: string | null;
  difficulty: string;
  subject: string;
  topic: string | null;
  options: QOption[];
  correctOptionId: string;
  selectedOptionId: string | null;
  flagged: boolean;
}

interface RunnerProps {
  attempt: {
    id: string;
    mode: string;
    title: string;
    timeLimitSec: number | null;
    tutored: boolean;
  };
  questions: QItem[];
}

export function QuizRunner({ attempt, questions }: RunnerProps) {
  const router = useRouter();
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string | null>>(
    Object.fromEntries(questions.map((q) => [q.questionId, q.selectedOptionId])),
  );
  const [flags, setFlags] = React.useState<Record<string, boolean>>(
    Object.fromEntries(questions.map((q) => [q.questionId, q.flagged])),
  );
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>(
    Object.fromEntries(
      questions.map((q) => [q.questionId, attempt.tutored && !!q.selectedOptionId]),
    ),
  );
  const [remaining, setRemaining] = React.useState<number | null>(attempt.timeLimitSec);
  const [finishing, setFinishing] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const startRef = React.useRef<number>(Date.now());
  const [, startTransition] = React.useTransition();

  const q = questions[index];
  const answeredCount = Object.values(answers).filter(Boolean).length;

  // Timer
  React.useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 0) {
      void handleFinish();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => (r === null ? null : r - 1)), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  React.useEffect(() => {
    startRef.current = Date.now();
  }, [index]);

  function persist(item: QItem, selectedOptionId: string | null, flagged: boolean) {
    const timeSpentSec = Math.round((Date.now() - startRef.current) / 1000);
    startTransition(() => {
      void saveAnswer({
        attemptId: attempt.id,
        questionId: item.questionId,
        selectedOptionId,
        timeSpentSec,
        flagged,
      });
    });
  }

  function selectOption(optId: string) {
    if (attempt.tutored && revealed[q.questionId]) return; // lock after reveal
    setAnswers((a) => ({ ...a, [q.questionId]: optId }));
    persist(q, optId, flags[q.questionId] ?? false);
    if (attempt.tutored) {
      setRevealed((r) => ({ ...r, [q.questionId]: true }));
    }
  }

  function toggleFlag() {
    const next = !flags[q.questionId];
    setFlags((f) => ({ ...f, [q.questionId]: next }));
    persist(q, answers[q.questionId] ?? null, next);
  }

  async function handleFinish() {
    setFinishing(true);
    await finishAttempt(attempt.id);
    router.refresh();
  }

  const selected = answers[q.questionId];
  const isRevealed = attempt.tutored && revealed[q.questionId];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Top bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">{attempt.title}</h1>
          <p className="text-xs text-muted-foreground">
            {attempt.tutored ? "Tutored mode · instant feedback" : "Timed / review at the end"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {remaining !== null && (
            <Badge
              variant={remaining < 60 ? "destructive" : "secondary"}
              className="gap-1.5 px-3 py-1.5 text-sm tabular-nums"
            >
              <Clock className="h-4 w-4" /> {formatDuration(remaining)}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
            Finish
          </Button>
        </div>
      </div>

      <Progress value={Math.round(((index + 1) / questions.length) * 100)} className="mb-6" />

      <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
        {/* Question */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={q.questionId}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      Question {index + 1} of {questions.length}
                    </Badge>
                    <Badge variant="secondary">{q.subject}</Badge>
                    {q.topic && <Badge variant="outline">{q.topic}</Badge>}
                    <Badge
                      variant={
                        q.difficulty === "HARD"
                          ? "destructive"
                          : q.difficulty === "MEDIUM"
                            ? "warning"
                            : "success"
                      }
                    >
                      {q.difficulty}
                    </Badge>
                    <button
                      onClick={toggleFlag}
                      className={cn(
                        "ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                        flags[q.questionId]
                          ? "bg-warning/15 text-warning"
                          : "text-muted-foreground hover:bg-accent",
                      )}
                    >
                      <Flag className="h-3.5 w-3.5" />
                      {flags[q.questionId] ? "Flagged" : "Flag"}
                    </button>
                  </div>

                  <p className="text-base font-medium leading-relaxed">{q.stem}</p>

                  <div className="mt-5 space-y-2">
                    {q.options.map((opt, i) => {
                      const isSelected = selected === opt.id;
                      const isCorrect = opt.id === q.correctOptionId;
                      let state: "idle" | "correct" | "incorrect" | "selected" = "idle";
                      if (isRevealed) {
                        if (isCorrect) state = "correct";
                        else if (isSelected) state = "incorrect";
                      } else if (isSelected) {
                        state = "selected";
                      }
                      return (
                        <button
                          key={opt.id}
                          onClick={() => selectOption(opt.id)}
                          disabled={isRevealed}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                            state === "idle" && "hover:border-primary/50 hover:bg-accent",
                            state === "selected" && "border-primary bg-primary/5",
                            state === "correct" && "border-success bg-success/10",
                            state === "incorrect" && "border-destructive bg-destructive/10",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                              state === "correct" && "border-success text-success",
                              state === "incorrect" && "border-destructive text-destructive",
                              state === "selected" && "border-primary text-primary",
                            )}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1">{opt.text}</span>
                          {state === "correct" && <CheckCircle2 className="h-5 w-5 text-success" />}
                          {state === "incorrect" && <XCircle className="h-5 w-5 text-destructive" />}
                        </button>
                      );
                    })}
                  </div>

                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-5 overflow-hidden rounded-lg border bg-muted/40 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <BookOpenCheck className="h-4 w-4 text-primary" /> Explanation
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {q.explanation}
                      </p>
                      {q.reference && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium">Reference:</span> {q.reference}
                        </p>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            {index === questions.length - 1 ? (
              <Button onClick={() => setConfirmOpen(true)}>Finish attempt</Button>
            ) : (
              <Button onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Palette */}
        <div className="hidden lg:block">
          <Card className="sticky top-6">
            <CardContent className="p-4">
              <p className="mb-3 text-sm font-semibold">
                {answeredCount}/{questions.length} answered
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((item, i) => {
                  const ans = !!answers[item.questionId];
                  const fl = flags[item.questionId];
                  return (
                    <button
                      key={item.questionId}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "relative flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium transition-colors",
                        i === index && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                        ans ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {i + 1}
                      {fl && (
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-warning" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-primary/15" /> Answered
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-muted" /> Unanswered
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning" /> Flagged
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finish this attempt?</DialogTitle>
            <DialogDescription>
              You have answered {answeredCount} of {questions.length} questions. You can review
              your results and explanations after finishing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={finishing}>
              Keep going
            </Button>
            <Button onClick={handleFinish} disabled={finishing}>
              {finishing && <Loader2 className="h-4 w-4 animate-spin" />} Finish & review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
