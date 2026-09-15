"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Eye, PartyPopper, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { SRS_RATINGS } from "@/lib/srs";
import { reviewSrsCard } from "@/lib/actions";

interface Card {
  id: string;
  intervalDays: number;
  repetitions: number;
  stem: string;
  explanation: string;
  reference: string | null;
  subject: string;
  topic: string | null;
  options: { id: string; text: string; isCorrect: boolean }[];
}

export function SrsReviewer({
  cards,
  totalCards,
  upcoming,
}: {
  cards: Card[];
  totalCards: number;
  upcoming: number;
}) {
  const router = useRouter();
  const [index, setIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [done, setDone] = React.useState(0);
  const [pending, setPending] = React.useState(false);

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <PartyPopper className="h-10 w-10 text-success" />
          <h3 className="text-lg font-semibold">You&apos;re all caught up</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            No cards are due right now. You have {totalCards} cards total, with {upcoming} scheduled
            for later. Miss a question in practice and it will show up here.
          </p>
          <Button onClick={() => router.push("/practice")}>Practice more questions</Button>
        </CardContent>
      </Card>
    );
  }

  if (index >= cards.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-success" />
          <h3 className="text-lg font-semibold">Review session complete</h3>
          <p className="text-sm text-muted-foreground">
            You reviewed {done} card{done === 1 ? "" : "s"}. Great work.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.refresh()}>
              <Repeat className="h-4 w-4" /> Check for more
            </Button>
            <Button onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const card = cards[index];

  async function rate(quality: number) {
    if (pending) return;
    setPending(true);
    await reviewSrsCard({ cardId: card.id, quality });
    setPending(false);
    setDone((d) => d + 1);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Card {index + 1} of {cards.length} due
        </span>
        <span>{done} reviewed</span>
      </div>
      <Progress className="mb-6" value={Math.round((index / cards.length) * 100)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{card.subject}</Badge>
                {card.topic && <Badge variant="outline">{card.topic}</Badge>}
                <Badge variant="outline" className="ml-auto">
                  interval {card.intervalDays}d
                </Badge>
              </div>
              <p className="text-base font-medium leading-relaxed">{card.stem}</p>

              <div className="mt-4 space-y-2">
                {card.options.map((o, i) => (
                  <div
                    key={o.id}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm",
                      revealed && o.isCorrect && "border-success bg-success/10",
                    )}
                  >
                    <span className="mr-2 font-semibold text-muted-foreground">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {o.text}
                    {revealed && o.isCorrect && (
                      <span className="ml-2 text-xs font-medium text-success">(correct)</span>
                    )}
                  </div>
                ))}
              </div>

              {revealed && (
                <div className="mt-4 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Explanation: </span>
                  {card.explanation}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5">
        {!revealed ? (
          <Button className="w-full" size="lg" onClick={() => setRevealed(true)}>
            <Eye className="h-4 w-4" /> Show answer
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SRS_RATINGS.map((r) => (
              <Button
                key={r.label}
                variant={r.quality <= 2 ? "destructive" : r.quality === 3 ? "outline" : "success"}
                disabled={pending}
                onClick={() => rate(r.quality)}
                className="flex-col h-auto py-3"
              >
                <span className="font-semibold">{r.label}</span>
                <span className="text-[10px] font-normal opacity-80">{r.hint}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
