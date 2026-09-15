"use client";

import * as React from "react";
import { Bot, Send, Sparkles, User, Loader2, CheckCircle2, Wand2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Explain the mechanism of prostaglandin analogs",
  "20 hard questions on glaucoma management",
  "Summarize diabetic retinopathy staging",
  "How do I neutralize with motion in retinoscopy?",
];

interface GenQ {
  id: string;
  stem: string;
  subject: string;
  topic: string | null;
  difficulty: string;
  explanation: string;
  reference: string | null;
  options: { id: string; text: string; isCorrect: boolean }[];
}

export function TutorClient() {
  return (
    <Tabs defaultValue="chat">
      <TabsList>
        <TabsTrigger value="chat">
          <Bot className="mr-1.5 h-4 w-4" /> Chat
        </TabsTrigger>
        <TabsTrigger value="quiz">
          <Wand2 className="mr-1.5 h-4 w-4" /> Generate a quiz
        </TabsTrigger>
      </TabsList>
      <TabsContent value="chat">
        <ChatPanel />
      </TabsContent>
      <TabsContent value="quiz">
        <QuizPanel />
      </TabsContent>
    </Tabs>
  );
}

function ChatPanel() {
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong reaching the tutor.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <Card className="flex h-[70vh] flex-col">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Ask the OptiPrep Tutor</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Explanations grounded in the question bank. Ask about any topic, or request a
              custom quiz.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={cn(
                "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              {m.content || (streaming && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
      </div>
      <form
        className="flex items-center gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about the NBEO exams…"
          disabled={streaming}
        />
        <Button type="submit" size="icon" disabled={streaming || !input.trim()}>
          {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </Card>
  );
}

function QuizPanel() {
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState<GenQ[]>([]);
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({});
  const [note, setNote] = React.useState<string | null>(null);

  async function generate(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true);
    setNote(null);
    try {
      const res = await fetch("/api/tutor/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, count: 10 }),
      });
      const data = await res.json();
      setQuestions(data.questions ?? []);
      setRevealed({});
      setNote(`Generated ${data.questions?.length ?? 0} questions grounded in the bank.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-medium">Describe the quiz you want</p>
          <p className="mb-3 text-xs text-muted-foreground">
            e.g. “20 hard questions on glaucoma management” or “optics vergence problems”.
          </p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              generate(prompt);
            }}
          >
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="20 hard questions on glaucoma management"
            />
            <Button type="submit" disabled={loading || !prompt.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              Generate
            </Button>
          </form>
          {note && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {note}
            </p>
          )}
        </CardContent>
      </Card>

      {questions.map((q, i) => (
        <Card key={q.id}>
          <CardContent className="p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">Q{i + 1}</Badge>
              <Badge variant="secondary">{q.subject}</Badge>
              <Badge
                variant={
                  q.difficulty === "HARD" ? "destructive" : q.difficulty === "MEDIUM" ? "warning" : "success"
                }
              >
                {q.difficulty}
              </Badge>
            </div>
            <p className="text-sm font-medium">{q.stem}</p>
            <div className="mt-3 space-y-1.5">
              {q.options.map((o, oi) => (
                <div
                  key={o.id}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm",
                    revealed[q.id] && o.isCorrect && "border-success bg-success/10",
                  )}
                >
                  <span className="mr-2 font-semibold text-muted-foreground">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {o.text}
                  {revealed[q.id] && o.isCorrect && (
                    <span className="ml-2 text-xs font-medium text-success">(correct)</span>
                  )}
                </div>
              ))}
            </div>
            {revealed[q.id] ? (
              <div className="mt-3 rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Explanation: </span>
                {q.explanation}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setRevealed((r) => ({ ...r, [q.id]: true }))}
              >
                Show answer
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
