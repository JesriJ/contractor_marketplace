import type { Metadata } from "next";
import Link from "next/link";
import { PaymentStatus } from "@prisma/client";
import { StatusBadge } from "@/components/StatusBadge";
import { formatMoney } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Payment | Contractor Marketplace",
  robots: { index: false, follow: false },
};

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string; status?: string }>;
};

export default async function PaymentSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const session = await getSession();

  if (!sessionId) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-semibold text-slate-900">Payment</h1>
        <p className="mt-3 text-sm text-slate-700">
          Stripe did not return a checkout session. Payment status is updated from Stripe webhooks, not this page.
        </p>
      </section>
    );
  }

  if (!session?.user) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-semibold text-slate-900">Payment submitted</h1>
        <p className="mt-3 text-sm text-slate-700">
          <Link href="/login" className="font-medium text-blue-700 hover:text-blue-800">
            Log in
          </Link>{" "}
          to see whether Stripe has confirmed this payment.
        </p>
      </section>
    );
  }

  const payment = await prisma.payment.findUnique({
    where: { stripeCheckoutSessionId: sessionId },
    select: {
      amount: true,
      status: true,
      jobId: true,
      customerId: true,
      contractor: { select: { userId: true } },
    },
  });

  const allowed =
    payment &&
    (payment.customerId === session.user.id || payment.contractor.userId === session.user.id);

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Payment submitted</h1>
      {!payment || !allowed ? (
        <p className="mt-3 text-sm text-slate-700">
          This checkout session is not confirmed yet. The job is marked paid only after the Stripe webhook is verified.
        </p>
      ) : (
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <p>Amount: {formatMoney(payment.amount.toString())}</p>
          <p className="flex items-center gap-2">
            Status <StatusBadge status={payment.status} />
          </p>
          {payment.status === PaymentStatus.PENDING ? (
            <p>Stripe has not confirmed this payment yet. Refresh this page after the webhook arrives.</p>
          ) : null}
          {payment.status === PaymentStatus.SUCCEEDED ? <p>Stripe confirmed this payment.</p> : null}
          <Link href={`/jobs/${payment.jobId}`} className="inline-block font-medium text-blue-700 hover:text-blue-800">
            Back to job
          </Link>
        </div>
      )}
    </section>
  );
}
