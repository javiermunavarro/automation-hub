import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "your_stripe_secret_key") {
    return null;
  }
  return new Stripe(key, { typescript: true });
}

export const stripe = getStripe();
