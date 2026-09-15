import Stripe from "stripe";

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export const stripe = isStripeConfigured
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    })
  : null;

export function priceIdForEnv(envKey: string): string | undefined {
  if (!envKey) return undefined;
  return process.env[envKey] || undefined;
}
