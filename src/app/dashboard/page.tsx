import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { EmptyState } from "@/components/EmptyState";
import { HireRequestList } from "@/components/HireRequestList";
import { JobCard } from "@/components/JobCard";
import { StatusBadge } from "@/components/StatusBadge";
import { getContractorProfileForUser } from "@/lib/contractor-profiles";
import { formatHourlyRate, formatLocation, formatMoney } from "@/lib/format";
import { listHireRequestsForCurrentUser } from "@/lib/hire-requests";
import { listJobsForContractor, listJobsForCustomer } from "@/lib/jobs";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard | Contractor Marketplace",
  robots: { index: false, follow: false },
};

type DashboardPageProps = {
  searchParams: Promise<{ notice?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await requireSession();
  const { notice } = await searchParams;
  const isCustomer = session.user.role === UserRole.CUSTOMER;

  if (!isCustomer) {
    const profile = await getContractorProfileForUser(session.user.id);
    if (!profile) {
      redirect("/contractor-profile/create");
    }

    const work = await listJobsForContractor(profile.id);
    const requests = await listHireRequestsForCurrentUser();

    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Contractor dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Signed in as {session.user.email}</p>

        {notice === "customer-only" ? (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">
            Only customer accounts can post jobs.
          </p>
        ) : null}

        <div className="mt-8 rounded-md border border-slate-200 bg-white p-4">
          <h2 className="text-base font-semibold text-slate-900">{profile.companyName}</h2>
          <p className="mt-1 text-sm text-slate-600">{profile.trade}</p>
          <p className="mt-3 text-sm text-slate-700">{formatLocation(profile.city, profile.state)}</p>
          <p className="mt-1 text-sm text-slate-700">{formatHourlyRate(profile.hourlyRate)}</p>
          <p className="mt-2 text-sm text-slate-600">
            {profile.verified ? "Verified by the platform" : "Not verified"}
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <Link href="/contractor-profile/edit" className="font-medium text-blue-700 hover:text-blue-800">
              Edit profile
            </Link>
            <Link href="/jobs" className="font-medium text-blue-700 hover:text-blue-800">
              Find jobs
            </Link>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">Assigned jobs</h2>
        {work.activeJobs.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No assigned jobs."
              description="A job appears here after a customer accepts your bid or you accept a service request."
            />
          </div>
        ) : (
          <ul className="mt-3 space-y-4">
            {work.activeJobs.map((job) => (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-8 text-lg font-semibold text-slate-900">My bids</h2>
        {work.bids.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No bids yet." description="Bids you submit on open jobs will appear here." />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
            {work.bids.map((bid) => (
              <li key={bid.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <div>
                  <Link href={`/jobs/${bid.job.id}`} className="font-medium text-slate-900 hover:text-blue-800">
                    {bid.job.title}
                  </Link>
                  <p className="text-slate-600">
                    {bid.job.location} · {formatMoney(bid.amount)}
                  </p>
                </div>
                <StatusBadge status={bid.status} />
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-8 text-lg font-semibold text-slate-900">Service requests</h2>
        {!requests.ok ? (
          <div className="mt-3">
            <EmptyState title="Unable to load requests" description={requests.error} />
          </div>
        ) : null}
        {requests.ok && requests.data.requests.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No service requests." description="Requests from customers will appear here." />
          </div>
        ) : null}
        {requests.ok && requests.data.requests.length > 0 ? (
          <HireRequestList requests={requests.data.requests} role={requests.data.role} />
        ) : null}
      </section>
    );
  }

  const jobs = await listJobsForCustomer(session.user.id);
  const requests = await listHireRequestsForCurrentUser();
  const activeJobs = jobs.filter((job) => job.status === "ASSIGNED");

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Customer dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Signed in as {session.user.email}</p>

      {notice === "contractor-only" ? (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">
          Only contractor accounts can create or edit a contractor profile.
        </p>
      ) : null}

      <p className="mt-6 text-sm">
        <Link href="/jobs/create" className="font-medium text-blue-700 hover:text-blue-800">
          Post a job
        </Link>
      </p>

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Assigned jobs</h2>
      {activeJobs.length === 0 ? (
        <div className="mt-3">
          <EmptyState title="No assigned jobs." description="A job appears here after you accept a bid or a contractor accepts your service request." />
        </div>
      ) : (
        <ul className="mt-3 space-y-4">
          {activeJobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-semibold text-slate-900">My job posts</h2>
      {jobs.length === 0 ? (
        <div className="mt-3">
          <EmptyState title="No jobs posted yet." description="Post a job when you want contractors to bid." />
        </div>
      ) : (
        <ul className="mt-3 space-y-4">
          {jobs.map((job) => (
            <li key={job.id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-semibold text-slate-900">Service requests</h2>
      {!requests.ok ? (
        <div className="mt-3">
          <EmptyState title="Unable to load requests" description={requests.error} />
        </div>
      ) : null}
      {requests.ok && requests.data.requests.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            title="No service requests."
            description="Request service from a contractor profile when you already know who you want to hire."
          />
        </div>
      ) : null}
      {requests.ok && requests.data.requests.length > 0 ? (
        <HireRequestList requests={requests.data.requests} role={requests.data.role} />
      ) : null}

      <div className="mt-6">
        <EmptyState
          title="No conversations yet."
          description="Messages with contractors will appear here after messaging is available."
        />
      </div>
    </section>
  );
}
