import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment cancelled | Contractor Marketplace",
  robots: { index: false, follow: false },
};

type CancelPageProps = {
  searchParams: Promise<{ job?: string }>;
};

export default async function PaymentCancelPage({ searchParams }: CancelPageProps) {
  const { job } = await searchParams;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold text-slate-900">Checkout cancelled</h1>
      <p className="mt-3 text-sm text-slate-700">
        No payment was confirmed. Leaving checkout does not mark a job as paid or unpaid. Stripe sends that result to
        the webhook.
      </p>
      {job ? (
        <p className="mt-4 text-sm">
          <Link href={`/jobs/${job}`} className="font-medium text-blue-700 hover:text-blue-800">
            Back to job
          </Link>
        </p>
      ) : null}
    </section>
  );
}
