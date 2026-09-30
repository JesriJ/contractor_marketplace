import { BidStatus, JobStatus, PaymentStatus, Prisma } from "@prisma/client";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { amountToCents, getStripe } from "@/lib/stripe";

const payableStatuses: JobStatus[] = [
  JobStatus.ASSIGNED,
  JobStatus.IN_PROGRESS,
  JobStatus.PENDING_CONFIRMATION,
  JobStatus.COMPLETED,
];

export type PaymentView = {
  id: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
};

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; status: number; error: string };

function appUrl() {
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

async function requireCustomer() {
  const session = await getSession();
  if (!session?.user) {
    return { ok: false as const, status: 401, error: "Not authenticated." };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, contractorProfile: { select: { id: true } } },
  });
  if (!user) {
    return { ok: false as const, status: 401, error: "Not authenticated." };
  }
  return { ok: true as const, user };
}

export async function getJobPayment(jobId: string): Promise<PaymentView | null> {
  const payment = await prisma.payment.findUnique({
    where: { jobId },
    select: { id: true, amount: true, currency: true, status: true },
  });
  if (!payment) {
    return null;
  }
  return {
    id: payment.id,
    amount: payment.amount.toString(),
    currency: payment.currency,
    status: payment.status,
  };
}

export async function createCheckoutSession(jobId: string): Promise<CheckoutResult> {
  const access = await requireCustomer();
  if (!access.ok) {
    return access;
  }
  if (access.user.role !== "CUSTOMER") {
    return { ok: false, status: 403, error: "Unauthorized." };
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      budget: true,
      status: true,
      customerId: true,
      contractorId: true,
      bids: {
        where: { status: BidStatus.ACCEPTED },
        select: { amount: true },
        take: 1,
      },
    },
  });
  if (!job) {
    return { ok: false, status: 404, error: "Job not found." };
  }
  if (job.customerId !== access.user.id) {
    return { ok: false, status: 403, error: "Unauthorized." };
  }
  if (job.status === JobStatus.CANCELLED) {
    return { ok: false, status: 400, error: "This job has been cancelled." };
  }
  if (!job.contractorId || !payableStatuses.includes(job.status)) {
    return { ok: false, status: 400, error: "Payment is available after a contractor is assigned." };
  }

  const serverAmount = job.bids[0]?.amount ?? job.budget;
  if (!serverAmount || Number(serverAmount.toString()) <= 0) {
    return { ok: false, status: 400, error: "This job does not have a price yet." };
  }

  const existing = await prisma.payment.findUnique({ where: { jobId: job.id } });
  if (existing?.status === PaymentStatus.SUCCEEDED) {
    return { ok: false, status: 409, error: "This job is already paid." };
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return { ok: false, status: 500, error: "Use a Stripe test secret key." };
  }
  if (!stripe) {
    return { ok: false, status: 503, error: "Stripe is not configured." };
  }

  const payment =
    existing ??
    (await prisma.payment.create({
      data: {
        jobId: job.id,
        customerId: job.customerId,
        contractorId: job.contractorId,
        amount: serverAmount,
        currency: "usd",
      },
    }));

  if (payment.stripeCheckoutSessionId) {
    const current = await stripe.checkout.sessions.retrieve(payment.stripeCheckoutSessionId);
    if (current.status === "open" && current.url) {
      return { ok: true, url: current.url };
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: payment.id,
    success_url: `${appUrl()}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl()}/payments/cancel?job=${job.id}`,
    metadata: {
      paymentId: payment.id,
      jobId: job.id,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountToCents(serverAmount),
          product_data: {
            name: job.title,
          },
        },
      },
    ],
  });

  if (!session.url) {
    return { ok: false, status: 500, error: "Stripe did not return a checkout URL." };
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      stripeCheckoutSessionId: session.id,
      amount: serverAmount,
      status: PaymentStatus.PENDING,
    },
  });

  return { ok: true, url: session.url };
}

function intentId(value: string | Stripe.PaymentIntent | null | undefined) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function findPayment(
  tx: Prisma.TransactionClient,
  input: { paymentId?: string | null; sessionId?: string | null; intentId?: string | null },
) {
  if (input.paymentId) {
    return tx.payment.findUnique({ where: { id: input.paymentId } });
  }
  if (input.sessionId) {
    return tx.payment.findUnique({ where: { stripeCheckoutSessionId: input.sessionId } });
  }
  if (input.intentId) {
    return tx.payment.findUnique({ where: { stripePaymentIntentId: input.intentId } });
  }
  return null;
}

async function applyEvent(tx: Prisma.TransactionClient, event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const payment = await findPayment(tx, {
      paymentId: session.metadata?.paymentId,
      sessionId: session.id,
      intentId: intentId(session.payment_intent),
    });
    if (!payment || session.payment_status !== "paid") {
      return;
    }
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.SUCCEEDED,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: intentId(session.payment_intent),
      },
    });
    return;
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const payment = await findPayment(tx, {
      paymentId: session.metadata?.paymentId,
      sessionId: session.id,
    });
    if (!payment) return;
    await tx.payment.updateMany({
      where: { id: payment.id, status: PaymentStatus.PENDING },
      data: { status: PaymentStatus.FAILED },
    });
    return;
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const payment = await findPayment(tx, {
      paymentId: intent.metadata?.paymentId,
      intentId: intent.id,
    });
    if (!payment) return;
    await tx.payment.updateMany({
      where: { id: payment.id, status: PaymentStatus.PENDING },
      data: {
        status: PaymentStatus.FAILED,
        stripePaymentIntentId: intent.id,
      },
    });
    return;
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const payment = await findPayment(tx, {
      paymentId: session.metadata?.paymentId,
      sessionId: session.id,
    });
    if (!payment) return;
    await tx.payment.updateMany({
      where: { id: payment.id, status: PaymentStatus.PENDING },
      data: { status: PaymentStatus.CANCELLED },
    });
  }
}

export async function processStripeEvent(event: Stripe.Event) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.stripeWebhookEvent.create({
        data: { id: event.id, type: event.type },
      });
      await applyEvent(tx, event);
    });
    return { ok: true as const, duplicate: false };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: true as const, duplicate: true };
    }
    throw error;
  }
}

export function constructStripeEvent(payload: string, signature: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return { ok: false as const, status: 500, error: "Stripe webhook secret is not configured." };
  }
  if (!signature) {
    return { ok: false as const, status: 400, error: "Missing Stripe signature." };
  }

  const key = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")
    ? process.env.STRIPE_SECRET_KEY
    : "sk_test_webhook_verification";
  const stripe = new Stripe(key);

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return { ok: true as const, event };
  } catch {
    return { ok: false as const, status: 400, error: "Invalid Stripe signature." };
  }
}
