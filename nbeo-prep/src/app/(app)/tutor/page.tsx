import { requireUser } from "@/lib/session";
import { isAiConfigured } from "@/lib/ai";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { TutorClient } from "@/components/tutor/tutor-client";

export const metadata = { title: "AI Tutor" };

export default async function TutorPage() {
  await requireUser();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="AI Tutor"
        description="Explanations and custom quizzes, grounded in the OptiPrep question bank."
      >
        <Badge variant={isAiConfigured ? "success" : "secondary"}>
          {isAiConfigured ? "Live model connected" : "Demo mode (add OPENAI_API_KEY)"}
        </Badge>
      </PageHeader>
      <TutorClient />
    </div>
  );
}
