import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRole } from "@prisma/client";
import { EmptyState } from "@/components/EmptyState";
import { HireRequestForm } from "@/components/HireRequestForm";
import { getPublicContractor, getContractorProfileForUser } from "@/lib/contractor-profiles";
import { formatHourlyRate, formatLocation, formatPostedDate, formatRating } from "@/lib/format";
import { getContractorReputation } from "@/lib/reviews";
import { getSession } from "@/lib/session";

type ContractorProfilePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reviewPage?: string }>;
};

export async function generateMetadata({ params }: ContractorProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const contractor = await getPublicContractor(id).catch(() => null);

  if (!contractor) {
    return { title: "Contractor not found | Contractor Marketplace" };
  }

  return {
    title: `${contractor.companyName} | Contractor Marketplace`,
    description: `${contractor.trade} in ${formatLocation(contractor.city, contractor.state)}.`,
  };
}

export default async function ContractorProfilePage({ params, searchParams }: ContractorProfilePageProps) {
  const { id } = await params;
  const { reviewPage } = await searchParams;
  const parsedReviewPage = Number(reviewPage ?? "1");

  let contractor: Awaited<ReturnType<typeof getPublicContractor>> = null;
  try {
    contractor = await getPublicContractor(id);
  } catch {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          title="Unable to load this profile"
          description="Confirm the database is running, then try again."
        />
      </section>
    );
  }

  if (!contractor) {
    notFound();
  }

  const session = await getSession();
  const reputation = await getContractorReputation(
    contractor.id,
    Number.isFinite(parsedReviewPage) ? parsedReviewPage : 1,
  );
  const ownProfile =
    session?.user.role === UserRole.CONTRACTOR
      ? await getContractorProfileForUser(session.user.id)
      : null;
  const isOwner = ownProfile?.id === contractor.id;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm text-slate-500">
        <Link href="/contractors" className="hover:text-slate-800">
          Find contractors
        </Link>
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
        {contractor.companyName}
      </h1>
      <p className="mt-1 text-slate-700">{contractor.trade}</p>
      <p className="mt-2 text-sm text-slate-600">
        {contractor.verified ? "Verified by the platform" : "Not verified"}
      </p>
      <p className="mt-2 text-sm text-slate-700">
        {reputation.reviewCount > 0 && reputation.ratingAverage != null
          ? `${formatRating(reputation.ratingAverage)} / 5 · ${reputation.reviewCount} ${reputation.reviewCount === 1 ? "review" : "reviews"}`
          : "No reviews yet"}
      </p>
      <p className="mt-4 text-sm text-slate-700">{formatLocation(contractor.city, contractor.state)}</p>
      <p className="mt-1 text-sm text-slate-700">
        {contractor.yearsExperience} {contractor.yearsExperience === 1 ? "year" : "years"} experience
      </p>
      <p className="mt-1 text-sm text-slate-700">{formatHourlyRate(contractor.hourlyRate)}</p>

      <div className="mt-6">
        {session?.user.role === UserRole.CUSTOMER ? (
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h2 className="text-base font-semibold text-slate-900">Request service</h2>
            <p className="mt-1 text-sm text-slate-600">
              Describe the work. {contractor.companyName} can accept or reject this request.
            </p>
            <div className="mt-4">
              <HireRequestForm contractorId={contractor.id} />
            </div>
          </div>
        ) : null}
        {!session ? (
          <Link href={`/login?callbackUrl=/contractors/${contractor.id}`} className="text-sm font-medium text-blue-700 hover:text-blue-800">
            Log in to request service
          </Link>
        ) : null}
        {isOwner ? (
          <Link href="/contractor-profile/edit" className="text-sm font-medium text-blue-700 hover:text-blue-800">
            Edit your profile
          </Link>
        ) : null}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-slate-900">About</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{contractor.bio}</p>

      <h2 className="mt-10 text-lg font-semibold text-slate-900">Reviews</h2>
      {reputation.reviews.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            title="No reviews yet."
            description="Reviews appear here after a customer completes a job with this contractor."
          />
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {reputation.reviews.map((review) => (
            <li key={review.id} className="rounded-md border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-900">{review.rating} / 5</p>
              <p className="mt-1 text-sm text-slate-600">{review.jobTitle}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{review.comment}</p>
              <p className="mt-2 text-xs text-slate-500">{formatPostedDate(review.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
      {reputation.reviewPageCount > 1 ? (
        <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Review pages">
          {reputation.reviewPage > 1 ? (
            <Link
              href={`/contractors/${contractor.id}?reviewPage=${reputation.reviewPage - 1}`}
              className="font-medium text-blue-700 hover:text-blue-800"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-slate-600">
            Page {reputation.reviewPage} of {reputation.reviewPageCount}
          </span>
          {reputation.reviewPage < reputation.reviewPageCount ? (
            <Link
              href={`/contractors/${contractor.id}?reviewPage=${reputation.reviewPage + 1}`}
              className="font-medium text-blue-700 hover:text-blue-800"
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}

      <h2 className="mt-10 text-lg font-semibold text-slate-900">Past work</h2>
      {reputation.pastWork.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            title="No completed jobs yet."
            description="Completed jobs will be listed here. This profile does not include sample work."
          />
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {reputation.pastWork.map((job) => (
            <li key={job.id} className="rounded-md border border-slate-200 bg-white p-4">
              <Link href={`/jobs/${job.id}`} className="text-sm font-medium text-slate-900 hover:text-blue-800">
                {job.title}
              </Link>
              <p className="mt-1 text-sm text-slate-600">{job.location}</p>
              <p className="mt-1 text-sm text-slate-600">Completed</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
