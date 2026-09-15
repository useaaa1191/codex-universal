"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import type { Plan } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING_TIERS } from "@/lib/entitlements";
import { activateDemoPlan } from "@/lib/actions";
import { toast } from "@/components/ui/use-toast";

export function BillingClient({
  currentPlan,
  stripeConfigured,
}: {
  currentPlan: Plan;
  stripeConfigured: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState<string | null>(null);

  async function choose(planId: string) {
    if (planId === "FREE") return;
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.demo) {
        await activateDemoPlan(planId as "MONTHLY" | "PART_BUNDLE" | "FULL_BUNDLE");
        toast({ variant: "success", title: "Plan activated (demo)", description: "Full access unlocked." });
        router.refresh();
      } else if (data.error) {
        toast({ variant: "destructive", title: "Checkout failed", description: data.error });
      }
    } catch {
      toast({ variant: "destructive", title: "Something went wrong" });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {PRICING_TIERS.map((tier) => {
        const isCurrent = tier.id === currentPlan;
        return (
          <Card key={tier.id} className={tier.highlight ? "relative border-primary ring-1 ring-primary/20" : "relative"}>
            {tier.highlight && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Badge>
            )}
            <CardHeader className="text-center">
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className="text-sm text-muted-foreground"> / {tier.cadence}</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={isCurrent ? "outline" : tier.highlight ? "default" : "outline"}
                disabled={isCurrent || loading !== null || tier.id === "FREE"}
                onClick={() => choose(tier.id)}
              >
                {loading === tier.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : tier.highlight ? (
                  <Sparkles className="h-4 w-4" />
                ) : null}
                {isCurrent ? "Current plan" : tier.id === "FREE" ? "Included" : tier.cta}
              </Button>
              {!stripeConfigured && tier.id !== "FREE" && !isCurrent && (
                <p className="mt-2 text-center text-[10px] text-muted-foreground">Activates in demo mode</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
