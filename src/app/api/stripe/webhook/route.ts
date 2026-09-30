import { NextResponse } from "next/server";
import { constructStripeEvent, processStripeEvent } from "@/lib/payments";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  const verified = constructStripeEvent(payload, signature);
  if (!verified.ok) {
    return NextResponse.json({ error: verified.error }, { status: verified.status });
  }

  try {
    const result = await processStripeEvent(verified.event);
    return NextResponse.json({ received: true, duplicate: result.duplicate });
  } catch {
    return NextResponse.json({ error: "Unable to process Stripe event." }, { status: 500 });
  }
}
