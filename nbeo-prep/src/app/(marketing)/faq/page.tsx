import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about OptiPrep: how the question bank, simulators, spaced repetition, AI tutor, and clinical-skills module work.",
};

const faqs = [
  {
    q: "How many questions are included?",
    a: "OptiPrep ships with 3,000+ questions across NBEO Parts 1, 2, and 3, categorized by subject, topic, and difficulty, each with a detailed explanation and reference.",
  },
  {
    q: "Do the timed simulators match the real exam?",
    a: "Yes. Each part's simulator mirrors the real exam's block structure, item count, and pacing, with a flag-and-review workflow so exam day feels familiar.",
  },
  {
    q: "How does the spaced repetition work?",
    a: "Every question you miss becomes an SM-2 spaced-repetition card. The algorithm schedules reviews at expanding intervals, and your daily adaptive quiz targets your weakest topics.",
  },
  {
    q: "What can the AI tutor do?",
    a: "Ask it to explain any answer, summarize a topic into notes, or generate a custom quiz from a prompt like “20 hard questions on glaucoma management.” Responses stream in real time and stay grounded in the question bank.",
  },
  {
    q: "Is there anything for Part 3 clinical skills?",
    a: "Yes. The Part 3 module includes video demonstrations, step-by-step procedural checklists, and self-assessment rubrics for stations like slit lamp, tonometry, retinoscopy, BIO, gonioscopy, and case anchoring.",
  },
  {
    q: "Can I study offline?",
    a: "OptiPrep is a mobile-first PWA. Install it to your home screen and previously loaded questions are cached for offline review.",
  },
  {
    q: "Is there a free tier?",
    a: "Absolutely. The free tier gives you sample questions across all three parts with full explanations so you can try tutored mode before upgrading.",
  },
  {
    q: "Is OptiPrep affiliated with the NBEO?",
    a: "No. OptiPrep is an independent study platform and is not affiliated with or endorsed by the National Board of Examiners in Optometry.",
  },
];

export default function FaqPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="text-4xl font-bold tracking-tight">Frequently asked questions</h1>
      <p className="mt-4 text-muted-foreground">
        Everything you need to know about studying with OptiPrep.
      </p>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
