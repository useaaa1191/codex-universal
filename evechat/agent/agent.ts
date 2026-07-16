import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { defineAgent } from "eve";

/**
 * Scaleway Generative APIs (OpenAI-compatible).
 * Project: ee9e975c-6021-45f0-ad87-e565cadbf5f3
 * Model: glm-5.2
 *
 * Set SCW_SECRET_KEY (or SCALEWAY_API_KEY / EVE_MODEL_API_KEY) in the environment.
 */
const SCALEWAY_PROJECT_ID = "ee9e975c-6021-45f0-ad87-e565cadbf5f3";
const SCALEWAY_BASE_URL =
  process.env.EVE_MODEL_BASE_URL?.trim() ||
  `https://api.scaleway.ai/${SCALEWAY_PROJECT_ID}/v1`;
const SCALEWAY_MODEL_ID = process.env.EVE_MODEL_ID?.trim() || "glm-5.2";
const SCALEWAY_API_KEY =
  process.env.SCW_SECRET_KEY?.trim() ||
  process.env.SCALEWAY_API_KEY?.trim() ||
  process.env.EVE_MODEL_API_KEY?.trim() ||
  "";

const scaleway = createOpenAICompatible({
  name: "scaleway",
  baseURL: SCALEWAY_BASE_URL,
  // Required at runtime. Prefer SCW_SECRET_KEY in .env.local / Vercel env.
  apiKey: SCALEWAY_API_KEY,
  includeUsage: true,
  // Match Scaleway chat.completions defaults from their OpenAI-compatible example.
  transformRequestBody: (args) => ({
    ...args,
    max_tokens: args.max_tokens ?? 16384,
    temperature: args.temperature ?? 1,
    top_p: args.top_p ?? 0.95,
    presence_penalty: args.presence_penalty ?? 0,
    response_format: args.response_format ?? { type: "text" },
  }),
});

export default defineAgent({
  model: scaleway.chatModel(SCALEWAY_MODEL_ID),
  // glm-5.2 serverless context is capped at 256k during preview.
  modelContextWindowTokens: 256_000,
});
