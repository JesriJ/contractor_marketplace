import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobStatus } from "@prisma/client";
import { BidForm } from "@/components/BidForm";
import { DecisionForm } from "@/components/DecisionForm";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { acceptBidAction, cancelJobAction, confirmCompletionAction, rejectBidAction, requestCompletionAction, startJobAction, submitBidAction } from "@/lib/actions/job";
import { PayButton } from "@/components/PayButton";
import { ReviewForm } from "@/components/ReviewForm";
import { formatLocation, formatMoney, formatPostedDate } from "@/lib/format";
import { getJobDetail } from "@/lib/jobs";
import { getJobPayment } from "@/lib/payments";
import { getSession } from "@/lib/session";

type JobPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const detail = await getJobDetail(id).catch(() => null);
  if (!detail) {
    return { title: "Job not found | Contractor Marketplace" };
  }
  return {
    title: `${detail.job.title} | Contractor Marketplace`,
    description: `${detail.job.title} in ${detail.job.location}.`,
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const detail = await getJobDetail(id).catch(() => null);
  if (!detail) {
    notFound();
  }

  const session = await getSession();
  const { job } = detail;
  const payment =
    detail.isOwner || detail.isAssignedContractor ? await getJobPayment(job.id).catch(() => null) : null;
  const canPay =
    detail.isOwner &&
    job.contractor &&
    job.status !== JobStatus.CANCELLED &&
    job.status !== JobStatus.OPEN &&
    job.status !== JobStatus.BIDDING &&
    payment?.status !== "SUCCEEDED";
  const canManage = detail.isOwner && (job.status === JobStatus.OPEN || job.status === JobStatus.BIDDING);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm text-slate-500">
        <Link href="/jobs" className="hover:text-slate-800">
          Find jobs
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{job.title}</h1>
        <StatusBadge status={job.status} />
      </div>
      <p className="mt-3 text-sm text-slate-700">{job.location}</p>
      <p className="mt-1 text-sm text-slate-700">
        {job.budget ? `Budget: ${formatMoney(job.budget)}` : "Budget not specified"}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {job.bidCount} {job.bidCount === 1 ? "bid" : "bids"} · Posted {formatPostedDate(job.createdAt)}
      </p>
      {detail.customerEmail ? (
        <p className="mt-2 text-sm text-slate-600">Customer: {detail.customerEmail}</p>
      ) : null}
      {job.contractor ? (
        <p className="mt-2 text-sm text-slate-700">
          Assigned to{" "}
          <Link href={`/contractors/${job.contractor.id}`} className="font-medium text-blue-700 hover:text-blue-800">
            {job.contractor.companyName}
          </Link>
        </p>
      ) : null}
      {detail.canMessage ? (
        <p className="mt-3 text-sm">
          <Link href={`/jobs/${job.id}/messages`} className="font-medium text-blue-700 hover:text-blue-800">
            Message
          </Link>
        </p>
      ) : null}

      {(detail.isOwner || detail.isAssignedContractor) && (
        <div className="mt-6 rounded-md border border-slate-200 bg-white p-4">
          <h2 className="text-base font-semibold text-slate-900">Payment</h2>
          {payment ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              {formatMoney(payment.amount)} <StatusBadge status={payment.status} />
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-600">No payment has been recorded.</p>
          )}
          {payment?.status === "PENDING" ? (
            <p className="mt-2 text-sm text-slate-600">
              Checkout can stay pending until Stripe sends a verified webhook.
            </p>
          ) : null}
          {canPay ? (
            <div className="mt-3">
              <PayButton jobId={job.id} />
            </div>
          ) : null}
        </div>
      )}

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Description</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{job.description}</p>

      {canManage ? (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href={`/jobs/${job.id}/edit`} className="text-sm font-medium text-blue-700 hover:text-blue-800">
            Edit job
          </Link>
          <DecisionForm action={cancelJobAction} jobId={job.id} label="Cancel job" pendingLabel="Cancelling..." />
        </div>
      ) : null}

      {detail.isAssignedContractor && job.status === JobStatus.ASSIGNED ? (
        <div className="mt-6">
          <DecisionForm action={startJobAction} jobId={job.id} label="Start job" pendingLabel="Starting..." />
        </div>
      ) : null}
      {detail.isAssignedContractor && job.status === JobStatus.IN_PROGRESS ? (
        <div className="mt-6">
          <DecisionForm
            action={requestCompletionAction}
            jobId={job.id}
            label="Mark complete"
            pendingLabel="Submitting..."
          />
        </div>
      ) : null}
      {detail.isOwner && job.status === JobStatus.PENDING_CONFIRMATION ? (
        <div className="mt-6 space-y-2">
          <p className="text-sm text-slate-700">The contractor marked this job complete. Confirm when the work is finished.</p>
          <DecisionForm
            action={confirmCompletionAction}
            jobId={job.id}
            label="Confirm completion"
            pendingLabel="Confirming..."
          />
        </div>
      ) : null}

      {detail.canReview ? (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Leave a review</h2>
          <div className="mt-4 rounded-md border border-slate-200 bg-white p-6">
            <ReviewForm jobId={job.id} />
          </div>
        </div>
      ) : null}
      {detail.isOwner && detail.review ? (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Your review</h2>
          <p className="mt-2 text-sm text-slate-800">{detail.review.rating} / 5</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{detail.review.comment}</p>
        </div>
      ) : null}

      {detail.isOwner ? (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Bids</h2>
          {detail.bids.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                title="No bids yet."
                description="Contractors will appear here once they respond."
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {detail.bids.map((bid) => (
                <li key={bid.id} className="rounded-md border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/contractors/${bid.contractor.id}`} className="font-medium text-slate-900 hover:text-blue-800">
                        {bid.contractor.companyName}
                      </Link>
                      <p className="text-sm text-slate-600">
                        {bid.contractor.trade} · {formatLocation(bid.contractor.city, bid.contractor.state)}
                      </p>
                    </div>
                    <StatusBadge status={bid.status} />
                  </div>
                  <p className="mt-3 text-sm text-slate-800">{formatMoney(bid.amount)}</p>
                  <p className="mt-1 text-sm text-slate-600">Estimated time: {bid.estimatedDuration}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{bid.message}</p>
                  {bid.status === "PENDING" && canManage ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <DecisionForm
                        action={acceptBidAction}
                        jobId={job.id}
                        bidId={bid.id}
                        label="Accept bid"
                        pendingLabel="Accepting..."
                      />
                      <DecisionForm
                        action={rejectBidAction}
                        jobId={job.id}
                        bidId={bid.id}
                        label="Reject bid"
                        pendingLabel="Rejecting..."
                      />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {detail.canBid ? (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Submit a bid</h2>
          <div className="mt-4 rounded-md border border-slate-200 bg-white p-6">
            <BidForm action={submitBidAction} jobId={job.id} />
          </div>
        </div>
      ) : null}

      {detail.needsProfile ? (
        <p className="mt-8 text-sm text-slate-700">
          <Link href="/contractor-profile/create" className="font-medium text-blue-700 hover:text-blue-800">
            Create your contractor profile
          </Link>{" "}
          before submitting a bid.
        </p>
      ) : null}

      {detail.myBid ? (
        <div className="mt-10 rounded-md border border-slate-200 bg-white p-4">
          <h2 className="text-base font-semibold text-slate-900">Your bid</h2>
          <div className="mt-2">
            <StatusBadge status={detail.myBid.status} />
          </div>
          <p className="mt-3 text-sm text-slate-800">{formatMoney(detail.myBid.amount)}</p>
          <p className="mt-1 text-sm text-slate-600">Estimated time: {detail.myBid.estimatedDuration}</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{detail.myBid.message}</p>
        </div>
      ) : null}

      {!session && (job.status === JobStatus.OPEN || job.status === JobStatus.BIDDING) ? (
        <p className="mt-8 text-sm">
          <Link href={`/login?callbackUrl=/jobs/${job.id}`} className="font-medium text-blue-700 hover:text-blue-800">
            Log in
          </Link>{" "}
          to submit a bid.
        </p>
      ) : null}
    </section>
  );
}
