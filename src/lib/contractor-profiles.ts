import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import {
  contractorProfileSchema,
  profileValidationMessage,
  type ContractorProfileInput,
} from "@/lib/validations/contractor-profile";

export const CONTRACTOR_PAGE_SIZE = 12;

const publicProfileSelect = {
  id: true,
  companyName: true,
  trade: true,
  bio: true,
  hourlyRate: true,
  yearsExperience: true,
  city: true,
  state: true,
  profileImage: true,
  verified: true,
  createdAt: true,
} satisfies Prisma.ContractorProfileSelect;

type ProfileRecord = Prisma.ContractorProfileGetPayload<{
  select: typeof publicProfileSelect;
}>;

export type PublicContractor = {
  id: string;
  companyName: string;
  trade: string;
  bio: string;
  hourlyRate: string;
  yearsExperience: number;
  city: string;
  state: string;
  profileImage: string | null;
  verified: boolean;
  createdAt: string;
};

export type ProfileMutationResult =
  | { ok: true; profile: PublicContractor }
  | { ok: false; status: number; error: string };

export type ContractorSearch = {
  trade?: string;
  city?: string;
  state?: string;
  page?: number;
};

function toPublicContractor(profile: ProfileRecord): PublicContractor {
  return {
    id: profile.id,
    companyName: profile.companyName,
    trade: profile.trade,
    bio: profile.bio,
    hourlyRate: profile.hourlyRate.toString(),
    yearsExperience: profile.yearsExperience,
    city: profile.city,
    state: profile.state,
    profileImage: profile.profileImage,
    verified: profile.verified,
    createdAt: profile.createdAt.toISOString(),
  };
}

function cleanQuery(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed.slice(0, 80) : undefined;
}

export function contractorSearchWhere(search: ContractorSearch): Prisma.ContractorProfileWhereInput {
  const trade = cleanQuery(search.trade);
  const city = cleanQuery(search.city);
  const state = cleanQuery(search.state)?.toUpperCase();
  const filters: Prisma.ContractorProfileWhereInput[] = [];

  if (trade) {
    filters.push({ trade: { contains: trade, mode: "insensitive" } });
  }

  if (city) {
    filters.push({
      OR: [
        { city: { contains: city, mode: "insensitive" } },
        { state: { contains: city, mode: "insensitive" } },
      ],
    });
  }

  if (state) {
    filters.push({ state: { equals: state, mode: "insensitive" } });
  }

  return filters.length > 0 ? { AND: filters } : {};
}

export async function searchContractors(search: ContractorSearch) {
  const page = Number.isInteger(search.page) && search.page && search.page > 0 ? search.page : 1;
  const where = contractorSearchWhere(search);

  const [total, profiles] = await prisma.$transaction([
    prisma.contractorProfile.count({ where }),
    prisma.contractorProfile.findMany({
      where,
      select: publicProfileSelect,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * CONTRACTOR_PAGE_SIZE,
      take: CONTRACTOR_PAGE_SIZE,
    }),
  ]);

  return {
    contractors: profiles.map(toPublicContractor),
    total,
    page,
    pageSize: CONTRACTOR_PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / CONTRACTOR_PAGE_SIZE)),
  };
}

export async function getPublicContractor(id: string) {
  const profile = await prisma.contractorProfile.findUnique({
    where: { id },
    select: publicProfileSelect,
  });

  return profile ? toPublicContractor(profile) : null;
}

export async function getContractorProfileForUser(userId: string) {
  const profile = await prisma.contractorProfile.findUnique({
    where: { userId },
    select: publicProfileSelect,
  });

  return profile ? toPublicContractor(profile) : null;
}

async function requireContractorSession(): Promise<
  { ok: true; userId: string } | { ok: false; status: number; error: string }
> {
  const session = await getSession();
  if (!session?.user) {
    return { ok: false, status: 401, error: "Not authenticated." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  if (!user || user.role !== UserRole.CONTRACTOR) {
    return { ok: false, status: 403, error: "Unauthorized." };
  }

  return { ok: true, userId: user.id };
}

function profileData(input: ContractorProfileInput) {
  return {
    companyName: input.companyName,
    trade: input.trade,
    bio: input.bio,
    city: input.city,
    state: input.state,
    yearsExperience: input.yearsExperience,
    hourlyRate: input.hourlyRate,
  };
}

export async function createContractorProfile(input: unknown): Promise<ProfileMutationResult> {
  const access = await requireContractorSession();
  if (!access.ok) {
    return access;
  }

  const parsed = contractorProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, status: 400, error: profileValidationMessage(parsed.error) };
  }

  try {
    const profile = await prisma.contractorProfile.create({
      data: {
        userId: access.userId,
        ...profileData(parsed.data),
      },
      select: publicProfileSelect,
    });

    return { ok: true, profile: toPublicContractor(profile) };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, status: 409, error: "You already have a contractor profile." };
    }

    return { ok: false, status: 500, error: "Unable to save profile." };
  }
}

export async function updateContractorProfile(input: unknown): Promise<ProfileMutationResult> {
  const access = await requireContractorSession();
  if (!access.ok) {
    return access;
  }

  const parsed = contractorProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, status: 400, error: profileValidationMessage(parsed.error) };
  }

  try {
    const profile = await prisma.contractorProfile.update({
      where: { userId: access.userId },
      data: profileData(parsed.data),
      select: publicProfileSelect,
    });

    return { ok: true, profile: toPublicContractor(profile) };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { ok: false, status: 404, error: "Contractor profile not found." };
    }

    return { ok: false, status: 500, error: "Unable to save profile." };
  }
}
