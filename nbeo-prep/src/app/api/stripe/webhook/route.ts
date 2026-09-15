import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isStripeConfigured || !stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    if (!secret || !sig) throw new Error("Missing webhook secret/signature");
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : "invalid"}` },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const userId = s.metadata?.userId ?? s.client_reference_id;
      const plan = (s.metadata?.plan as Plan) ?? "MONTHLY";
      if (userId) {
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            plan,
            status: "ACTIVE",
            stripeCustomerId: (s.customer as string) ?? undefined,
            stripeSubscriptionId: (s.subscription as string) ?? undefined,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000),
          },
          create: {
            userId,
            plan,
            status: "ACTIVE",
            stripeCustomerId: (s.customer as string) ?? undefined,
            stripeSubscriptionId: (s.subscription as string) ?? undefined,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000),
          },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: "CANCELED", plan: "FREE" },
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
