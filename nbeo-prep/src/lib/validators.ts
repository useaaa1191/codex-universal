import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const createAttemptSchema = z.object({
  partSlug: z.enum(["PART_1", "PART_2", "PART_3"]).optional(),
  mode: z.enum(["TUTORED", "TIMED", "RANDOM", "DAILY", "CUSTOM", "SIMULATOR"]),
  subjectId: z.string().optional(),
  count: z.coerce.number().int().min(1).max(200).default(20),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "ALL"]).default("ALL"),
  timeLimitSec: z.coerce.number().int().optional(),
});
export type CreateAttemptInput = z.infer<typeof createAttemptSchema>;

export const answerSchema = z.object({
  attemptId: z.string(),
  questionId: z.string(),
  selectedOptionId: z.string().nullable(),
  timeSpentSec: z.coerce.number().int().min(0).default(0),
  flagged: z.boolean().default(false),
});

export const srsReviewSchema = z.object({
  cardId: z.string(),
  quality: z.coerce.number().int().min(0).max(5),
});

export const rubricSchema = z.object({
  checklistId: z.string(),
  score: z.coerce.number().int().min(0),
  maxScore: z.coerce.number().int().min(1),
  notes: z.string().max(2000).optional(),
});

export const adminQuestionSchema = z.object({
  id: z.string().optional(),
  partSlug: z.enum(["PART_1", "PART_2", "PART_3"]),
  subjectId: z.string().min(1),
  topicId: z.string().optional().nullable(),
  stem: z.string().min(5),
  explanation: z.string().min(5),
  reference: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  isFree: z.boolean().default(false),
  options: z
    .array(
      z.object({
        text: z.string().min(1),
        isCorrect: z.boolean(),
      }),
    )
    .min(2)
    .max(6)
    .refine((opts) => opts.filter((o) => o.isCorrect).length === 1, {
      message: "Exactly one option must be correct",
    }),
});
export type AdminQuestionInput = z.infer<typeof adminQuestionSchema>;

export const tutorQuizSchema = z.object({
  prompt: z.string().min(3).max(300),
  count: z.coerce.number().int().min(1).max(20).default(10),
});
