import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const hasStripeSecretKey = Boolean(stripeSecretKey);

export const stripe = new Stripe(stripeSecretKey ?? "sk_test_missing");
