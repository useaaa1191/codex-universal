import type { Plan, SubStatus } from "@prisma/client";

export interface UserLike {
  subscription?: { plan: Plan; status: SubStatus } | null;
}

// Free tier gets sample (isFree) questions only. Any active paid plan unlocks
// the full bank and premium tooling (AI tutor, simulators, analytics depth).
export function hasProAccess(user: UserLike | null | undefined): boolean {
  const sub = user?.subscription;
  if (!sub) return false;
  const active = sub.status === "ACTIVE" || sub.status === "TRIALING";
  return active && sub.plan !== "FREE";
}

export function planLabel(plan?: Plan | null): string {
  switch (plan) {
    case "MONTHLY":
      return "Monthly Pass";
    case "PART_BUNDLE":
      return "Part Bundle";
    case "FULL_BUNDLE":
      return "Full 3-Part Bundle";
    case "FREE":
    default:
      return "Free";
  }
}

export interface PricingTier {
  id: Plan;
  name: string;
  price: string;
  cadence: string;
  priceEnv: string;
  highlight?: boolean;
  features: string[];
  cta: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    cadence: "forever",
    priceEnv: "",
    features: [
      "150+ sample questions across all 3 parts",
      "Tutored mode with explanations",
      "Basic performance summary",
      "Community study tips",
    ],
    cta: "Start free",
  },
  {
    id: "MONTHLY",
    name: "Monthly Pass",
    price: "$39",
    cadence: "per month",
    priceEnv: "STRIPE_PRICE_MONTHLY",
    highlight: true,
    features: [
      "Full 3,000+ question bank",
      "Timed block simulators",
      "Adaptive daily quizzes + spaced repetition",
      "AI tutor (grounded in the bank)",
      "Full analytics + predicted score",
    ],
    cta: "Go monthly",
  },
  {
    id: "PART_BUNDLE",
    name: "Part Bundle",
    price: "$129",
    cadence: "one part, one-time",
    priceEnv: "STRIPE_PRICE_PART_BUNDLE",
    features: [
      "Everything in Monthly, for one part",
      "6 months of access",
      "Part-specific simulators",
      "Downloadable study guides",
    ],
    cta: "Buy a part",
  },
  {
    id: "FULL_BUNDLE",
    name: "Full 3-Part Bundle",
    price: "$299",
    cadence: "all parts, one-time",
    priceEnv: "STRIPE_PRICE_FULL_BUNDLE",
    features: [
      "All three parts, 12 months of access",
      "Part 3 clinical-skills video library",
      "Priority AI tutor",
      "Best value for the full journey",
    ],
    cta: "Get everything",
  },
];
