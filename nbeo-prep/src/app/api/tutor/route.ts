import { streamText } from "ai";
import { openai, isAiConfigured, AI_MODEL, TUTOR_SYSTEM_PROMPT } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 30;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

function keywords(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3),
    ),
  ).slice(0, 6);
}

async function groundingContext(lastUserMessage: string): Promise<string> {
  const words = keywords(lastUserMessage);
  if (words.length === 0) return "";
  const questions = await prisma.question.findMany({
    where: {
      OR: words.flatMap((w) => [
        { stem: { contains: w, mode: "insensitive" as const } },
        { explanation: { contains: w, mode: "insensitive" as const } },
        { subject: { name: { contains: w, mode: "insensitive" as const } } },
      ]),
    },
    take: 5,
    include: { subject: true, topic: true },
  });
  if (questions.length === 0) return "";
  return questions
    .map(
      (q, i) =>
        `[${i + 1}] (${q.subject.name}${q.topic ? " / " + q.topic.name : ""}) ${q.stem}\nKey point: ${q.explanation}`,
    )
    .join("\n\n");
}

function textToStream(text: string): Response {
  const encoder = new TextEncoder();
  const words = text.split(/(\s+)/);
  const stream = new ReadableStream({
    async start(controller) {
      for (const w of words) {
        controller.enqueue(encoder.encode(w));
        await new Promise((r) => setTimeout(r, 12));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const context = await groundingContext(lastUser);

  if (!isAiConfigured || !openai) {
    // Graceful, still-useful fallback grounded in the question bank.
    const fallback = context
      ? `Here is what the OptiPrep question bank covers on that topic:\n\n${context}\n\n---\nTo get fully conversational, streamed answers and custom quiz generation, add an OPENAI_API_KEY to your environment. The tutor will then explain any answer and generate quizzes on demand.`
      : `I can explain answers and generate custom quizzes once an OPENAI_API_KEY is configured. In the meantime, try asking about a specific NBEO topic (for example, "glaucoma management" or "vergence optics") and I will surface the relevant bank content.`;
    return textToStream(fallback);
  }

  const system = context
    ? `${TUTOR_SYSTEM_PROMPT}\n\nRelevant question-bank context to ground your answer:\n${context}`
    : TUTOR_SYSTEM_PROMPT;

  const result = await streamText({
    model: openai(AI_MODEL),
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: 0.4,
  });

  return result.toTextStreamResponse();
}
