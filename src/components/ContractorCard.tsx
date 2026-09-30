import Link from "next/link";
import type { PublicContractor } from "@/lib/contractor-profiles";
import { formatHourlyRate, formatLocation, formatRating } from "@/lib/format";

export function ContractorCard({ contractor }: { contractor: PublicContractor }) {
  return (
    <article className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-4">
      <h2 className="text-base font-semibold text-slate-900">{contractor.companyName}</h2>
      <p className="mt-1 text-sm text-slate-600">{contractor.trade}</p>
      <p className="mt-3 text-sm text-slate-700">{formatLocation(contractor.city, contractor.state)}</p>
      <p className="mt-2 text-sm text-slate-700">{formatHourlyRate(contractor.hourlyRate)}</p>
      <p className="mt-1 text-sm text-slate-700">
        {contractor.reviewCount > 0 && contractor.ratingAverage != null
          ? `${formatRating(contractor.ratingAverage)} / 5 · ${contractor.reviewCount} ${contractor.reviewCount === 1 ? "review" : "reviews"}`
          : "No reviews yet"}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {contractor.yearsExperience} {contractor.yearsExperience === 1 ? "year" : "years"} experience
      </p>
      <p className="mt-2 text-sm text-slate-600">
        {contractor.verified ? "Verified by the platform" : "Not verified"}
      </p>
      <Link
        href={`/contractors/${contractor.id}`}
        className="mt-4 text-sm font-medium text-blue-700 hover:text-blue-800"
      >
        View profile
      </Link>
    </article>
  );
}
