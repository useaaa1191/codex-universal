import { requireUser } from "@/lib/session";
import { isStripeConfigured } from "@/lib/stripe";
import { planLabel, hasProAccess } from "@/lib/entitlements";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BillingClient } from "@/components/billing/billing-client";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const user = await requireUser();
  const pro = hasProAccess(user);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Billing & plans" description="Manage your subscription and unlock the full platform.">
        <Badge variant={pro ? "success" : "secondary"}>{planLabel(user.subscription?.plan)}</Badge>
      </PageHeader>

      {!isStripeConfigured && (
        <Card className="mb-6 border-warning/40 bg-warning/5">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Demo mode:</span> Stripe keys are not
            configured, so “Upgrade” will instantly activate the plan locally for exploration. Add
            <span className="font-mono"> STRIPE_SECRET_KEY </span> and price IDs to enable real
            checkout.
          </CardContent>
        </Card>
      )}

      <BillingClient
        currentPlan={user.subscription?.plan ?? "FREE"}
        stripeConfigured={isStripeConfigured}
      />
    </div>
  );
}
