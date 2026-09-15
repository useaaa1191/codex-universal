// SM-2 spaced-repetition scheduling.
// quality: 0-5 (0 = complete blackout, 5 = perfect recall).

export interface SrsState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
}

export interface SrsReviewResult extends SrsState {
  dueDate: Date;
}

export const SRS_RATINGS = [
  { label: "Again", quality: 1, hint: "Missed it — see it again soon" },
  { label: "Hard", quality: 3, hint: "Recalled with difficulty" },
  { label: "Good", quality: 4, hint: "Recalled correctly" },
  { label: "Easy", quality: 5, hint: "Instant recall" },
] as const;

export function scheduleSm2(state: SrsState, quality: number, now = new Date()): SrsReviewResult {
  const q = Math.max(0, Math.min(5, quality));
  let { easeFactor, intervalDays, repetitions, lapses } = state;

  // Update ease factor (SM-2 formula), floored at 1.3.
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  if (q < 3) {
    // Lapse — restart the interval.
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    if (repetitions === 0) intervalDays = 1;
    else if (repetitions === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
    repetitions += 1;
  }

  const dueDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    intervalDays,
    repetitions,
    lapses,
    dueDate,
  };
}
