import Link from "next/link";
import {
  Brain,
  Timer,
  Target,
  LineChart,
  Stethoscope,
  Sparkles,
  BookOpen,
  Repeat,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/marketing/reveal";
import { PARTS, partColorClasses } from "@/lib/nbeo-content";

const features = [
  {
    icon: Target,
    title: "3,000+ question bank",
    desc: "Categorized by subject, topic, and difficulty. Tutored and randomized modes with detailed, referenced explanations.",
  },
  {
    icon: Timer,
    title: "Timed block simulators",
    desc: "Mirror the real exam length and pacing. Flag-and-review workflow so exam day feels routine.",
  },
  {
    icon: Repeat,
    title: "Adaptive spaced repetition",
    desc: "Every missed question becomes an SM-2 card. Daily quizzes target your lowest-performing topics automatically.",
  },
  {
    icon: Brain,
    title: "AI tutor",
    desc: "Ask for explanations or say “20 hard questions on glaucoma management.” Grounded in the bank, streamed instantly.",
  },
  {
    icon: LineChart,
    title: "Deep analytics",
    desc: "Score trends, subject-mastery radar, time-per-question heatmaps, percentile comparisons, and predicted scores.",
  },
  {
    icon: Stethoscope,
    title: "Part 3 clinical skills",
    desc: "Video demonstrations, step-by-step procedural checklists, and self-assessment rubrics for every graded station.",
  },
];

const stats = [
  { value: "3,000+", label: "Practice questions" },
  { value: "3", label: "Exam parts covered" },
  { value: "27", label: "Mapped subjects" },
  { value: "SM-2", label: "Spaced repetition" },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-500/10 via-background to-background" />
        <div
          className="absolute inset-x-0 top-0 -z-10 h-[500px] opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(600px circle at 20% 10%, hsl(var(--primary)/0.25), transparent 40%), radial-gradient(500px circle at 80% 0%, hsl(262 83% 58% / 0.18), transparent 40%)",
          }}
        />
        <div className="container flex flex-col items-center py-24 text-center md:py-32">
          <Reveal>
            <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              A next-gen alternative to legacy board prep
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
              Pass NBEO Parts 1, 2 & 3 with a platform built for{" "}
              <span className="bg-gradient-to-r from-sky-500 to-violet-600 bg-clip-text text-transparent">
                how you actually learn
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              A 3,000+ question bank, exam-accurate simulators, adaptive spaced repetition,
              an AI tutor, and a full clinical-skills module. Everything you need, in one
              fast, modern app.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="xl" asChild>
                <Link href="/register">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/login">Try the demo account</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-xs text-muted-foreground">
              Demo login: <span className="font-mono">demo@optiprep.app</span> /{" "}
              <span className="font-mono">demo1234</span>
            </p>
          </Reveal>

          <Reveal delay={0.25} className="mt-16 w-full">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <Card key={s.label} className="border-primary/10 bg-card/60">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary">{s.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/20 py-24">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything the exam demands, engineered for speed
            </h2>
            <p className="mt-4 text-muted-foreground">
              Sub-second navigation, offline access, and a 60fps UI — so your study time
              goes to learning, not waiting.
            </p>
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Parts */}
      <section id="parts" className="py-24">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three parts. One focused path.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Each track maps to the official NBEO content outline with its own dashboard,
              syllabus, and study calendar.
            </p>
          </Reveal>
          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {PARTS.map((p, i) => {
              const c = partColorClasses(p.color);
              return (
                <Reveal key={p.slug} delay={i * 0.07}>
                  <Card className="group h-full overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${c.gradient}`} />
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${c.gradient} font-bold text-white`}
                        >
                          {p.number}
                        </span>
                        <div>
                          <h3 className="font-semibold">{p.title.split("—")[1]?.trim()}</h3>
                          <p className="text-xs text-muted-foreground">{p.subtitle}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">{p.description}</p>
                      <ul className="mt-4 space-y-2">
                        {p.subjects.slice(0, 4).map((s) => (
                          <li key={s.slug} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className={`h-4 w-4 ${c.text}`} />
                            {s.name}
                          </li>
                        ))}
                        <li className="pl-6 text-sm text-muted-foreground">
                          + {p.subjects.length - 4} more subjects
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Secondary features */}
      <section className="border-t bg-muted/20 py-24">
        <div className="container grid gap-12 lg:grid-cols-3">
          <Reveal>
            <div className="flex gap-4">
              <Smartphone className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Mobile-first PWA</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Install it to your home screen, cache questions for offline study, and get
                  push reminders to protect your streak.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex gap-4">
              <BookOpen className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">A real content library</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Downloadable study guides, high-yield sheets, a mnemonics library, and
                  pharmacology & optics formula references.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex gap-4">
              <ShieldCheck className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Accessible & type-safe</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  WCAG 2.1 AA-minded, keyboard-friendly, and validated end-to-end with Zod.
                  Fast where it matters.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <Reveal>
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
              <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                  Start studying in the next 60 seconds
                </h2>
                <p className="max-w-xl text-muted-foreground">
                  Explore the full app on the demo account, then create your own to track
                  progress across all three parts.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="xl" asChild>
                    <Link href="/register">
                      Create free account <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="xl" variant="outline" asChild>
                    <Link href="/pricing">See pricing</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
