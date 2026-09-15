import { prisma } from "@/lib/prisma";

export interface SubjectMastery {
  subjectId: string;
  subject: string;
  partSlug: string;
  answered: number;
  correct: number;
  accuracy: number;
}

export interface WeakTopic {
  topicId: string;
  topic: string;
  subject: string;
  partSlug: string;
  answered: number;
  correct: number;
  accuracy: number;
}

export interface TrendPoint {
  date: string;
  accuracy: number;
  answered: number;
  label: string;
}

export interface PartPrediction {
  partSlug: string;
  partTitle: string;
  accuracy: number;
  answered: number;
  predictedScore: number;
  passLikelihood: number;
}

export interface Analytics {
  totalAnswered: number;
  totalCorrect: number;
  overallAccuracy: number;
  avgSecondsPerQuestion: number;
  studyStreak: number;
  subjectMastery: SubjectMastery[];
  weakTopics: WeakTopic[];
  trend: TrendPoint[];
  timeByDifficulty: { difficulty: string; avgSeconds: number; answered: number }[];
  predictions: PartPrediction[];
  percentile: number;
}

// NBEO reports scaled scores; passing is 300. We model a predicted scaled score
// from recent accuracy with a light logistic curve for pass likelihood.
export function predictScaledScore(accuracy: number): number {
  // 0% -> ~180, 65% -> ~300 (pass line), 100% -> ~500
  const score = 180 + accuracy * 320;
  return Math.round(score);
}

export function passLikelihood(accuracy: number): number {
  // Logistic centered near 62% accuracy.
  const x = (accuracy - 0.62) / 0.08;
  return Math.round((1 / (1 + Math.exp(-x))) * 100) / 100;
}

export async function getAnalytics(userId: string): Promise<Analytics> {
  const responses = await prisma.response.findMany({
    where: { attempt: { userId }, isCorrect: { not: null } },
    include: {
      question: {
        include: {
          subject: { include: { part: true } },
          topic: true,
          part: true,
        },
      },
      attempt: true,
    },
    orderBy: { answeredAt: "asc" },
  });

  const totalAnswered = responses.length;
  const totalCorrect = responses.filter((r) => r.isCorrect).length;
  const overallAccuracy = totalAnswered ? totalCorrect / totalAnswered : 0;
  const avgSecondsPerQuestion = totalAnswered
    ? Math.round(responses.reduce((s, r) => s + r.timeSpentSec, 0) / totalAnswered)
    : 0;

  // Subject mastery
  const subjMap = new Map<string, SubjectMastery>();
  for (const r of responses) {
    const s = r.question.subject;
    const cur = subjMap.get(s.id) ?? {
      subjectId: s.id,
      subject: s.name,
      partSlug: s.part.slug,
      answered: 0,
      correct: 0,
      accuracy: 0,
    };
    cur.answered += 1;
    if (r.isCorrect) cur.correct += 1;
    subjMap.set(s.id, cur);
  }
  const subjectMastery = Array.from(subjMap.values())
    .map((s) => ({ ...s, accuracy: s.answered ? s.correct / s.answered : 0 }))
    .sort((a, b) => b.answered - a.answered);

  // Weak topics (>= 3 answered)
  const topicMap = new Map<string, WeakTopic>();
  for (const r of responses) {
    if (!r.question.topic) continue;
    const tpc = r.question.topic;
    const cur = topicMap.get(tpc.id) ?? {
      topicId: tpc.id,
      topic: tpc.name,
      subject: r.question.subject.name,
      partSlug: r.question.subject.part.slug,
      answered: 0,
      correct: 0,
      accuracy: 0,
    };
    cur.answered += 1;
    if (r.isCorrect) cur.correct += 1;
    topicMap.set(tpc.id, cur);
  }
  const weakTopics = Array.from(topicMap.values())
    .filter((t) => t.answered >= 3)
    .map((t) => ({ ...t, accuracy: t.correct / t.answered }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 8);

  // Trend by attempt
  const attemptMap = new Map<string, { date: Date; answered: number; correct: number }>();
  for (const r of responses) {
    const key = r.attemptId;
    const cur = attemptMap.get(key) ?? {
      date: r.attempt.createdAt,
      answered: 0,
      correct: 0,
    };
    cur.answered += 1;
    if (r.isCorrect) cur.correct += 1;
    attemptMap.set(key, cur);
  }
  const trend: TrendPoint[] = Array.from(attemptMap.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((a, i) => ({
      date: a.date.toISOString(),
      label: `#${i + 1}`,
      answered: a.answered,
      accuracy: a.answered ? Math.round((a.correct / a.answered) * 100) : 0,
    }));

  // Time by difficulty
  const diffMap = new Map<string, { total: number; answered: number }>();
  for (const r of responses) {
    const d = r.question.difficulty;
    const cur = diffMap.get(d) ?? { total: 0, answered: 0 };
    cur.total += r.timeSpentSec;
    cur.answered += 1;
    diffMap.set(d, cur);
  }
  const order = ["EASY", "MEDIUM", "HARD"];
  const timeByDifficulty = order
    .filter((d) => diffMap.has(d))
    .map((d) => {
      const v = diffMap.get(d)!;
      return { difficulty: d, avgSeconds: Math.round(v.total / v.answered), answered: v.answered };
    });

  // Predictions per part
  const parts = await prisma.part.findMany({ orderBy: { number: "asc" } });
  const partAgg = new Map<string, { answered: number; correct: number }>();
  for (const r of responses) {
    const key = r.question.part.slug;
    const cur = partAgg.get(key) ?? { answered: 0, correct: 0 };
    cur.answered += 1;
    if (r.isCorrect) cur.correct += 1;
    partAgg.set(key, cur);
  }
  const predictions: PartPrediction[] = parts.map((p) => {
    const agg = partAgg.get(p.slug) ?? { answered: 0, correct: 0 };
    const acc = agg.answered ? agg.correct / agg.answered : 0;
    return {
      partSlug: p.slug,
      partTitle: p.title,
      accuracy: acc,
      answered: agg.answered,
      predictedScore: predictScaledScore(acc),
      passLikelihood: passLikelihood(acc),
    };
  });

  // Study streak (distinct days with activity, counting back from today)
  const days = new Set(
    responses
      .map((r) => r.answeredAt)
      .filter(Boolean)
      .map((d) => new Date(d as Date).toISOString().slice(0, 10)),
  );
  let studyStreak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      studyStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (studyStreak === 0 && key === new Date().toISOString().slice(0, 10)) {
      // allow no-activity today without breaking a prior streak
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  const percentile = Math.min(99, Math.max(1, Math.round(overallAccuracy * 100 * 0.9 + 5)));

  return {
    totalAnswered,
    totalCorrect,
    overallAccuracy,
    avgSecondsPerQuestion,
    studyStreak,
    subjectMastery,
    weakTopics,
    trend,
    timeByDifficulty,
    predictions,
    percentile,
  };
}
