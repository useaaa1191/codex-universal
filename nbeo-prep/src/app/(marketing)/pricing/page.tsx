import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_TIERS } from "@/lib/entitlements";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple pricing for OptiPrep NBEO board prep: a free tier of sample questions, a monthly pass, per-part bundles, and the full 3-part bundle.",
};

export default function PricingPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Pricing that fits your timeline</h1>
        <p className="mt-4 text-muted-foreground">
          Start free with sample questions across all three parts. Upgrade when you are ready
          for the full bank, simulators, and the AI tutor.
        </p>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-4">
        {PRICING_TIERS.map((tier) => (
          <Card
            key={tier.id}
            className={
              tier.highlight
                ? "relative border-primary shadow-lg ring-1 ring-primary/20"
                : "relative"
            }
          >
            {tier.highlight && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Badge>
            )}
            <CardHeader className="text-center">
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-sm text-muted-foreground"> / {tier.cadence}</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-6 w-full"
                variant={tier.highlight ? "default" : "outline"}
              >
                <Link href={tier.id === "FREE" ? "/register" : "/billing"}>{tier.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        All paid plans include a 7-day money-back guarantee. Prices in USD.
      </p>
    </div>
  );
}
