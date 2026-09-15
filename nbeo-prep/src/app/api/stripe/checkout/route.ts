import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, isStripeConfigured, priceIdForEnv } from "@/lib/stripe";
import { PRICING_TIERS } from "@/lib/entitlements";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planId } = await req.json();
  const tier = PRICING_TIERS.find((t) => t.id === planId);
  if (!tier || tier.id === "FREE") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (!isStripeConfigured || !stripe) {
    // No keys — signal the client to use demo activation.
    return NextResponse.json({ demo: true });
  }

  const priceId = priceIdForEnv(tier.priceEnv);
  if (!priceId) {
    return NextResponse.json({ error: `Missing price id (${tier.priceEnv})` }, { status: 400 });
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: { subscription: true },
  });
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const isSubscription = tier.id === "MONTHLY";

  const checkout = await stripe.checkout.sessions.create({
    mode: isSubscription ? "subscription" : "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { userId: user.id, plan: tier.id },
    success_url: `${origin}/billing?success=1`,
    cancel_url: `${origin}/billing?canceled=1`,
  });

  return NextResponse.json({ url: checkout.url });
}
