import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (key.startsWith("sk_live_")) {
    throw new Error("Refusing to use a live Stripe secret key.");
  }
  return new Stripe(key);
}

export function amountToCents(value: { toString(): string } | string) {
  const raw = value.toString();
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) {
    throw new Error("Invalid payment amount.");
  }
  const [whole, fraction = ""] = raw.split(".");
  const cents = `${fraction}00`.slice(0, 2);
  return Number(whole) * 100 + Number(cents);
}
