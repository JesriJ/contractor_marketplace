import { z } from "zod";
import { US_STATE_CODES } from "@/lib/us-states";

const stateCodes = US_STATE_CODES as unknown as [string, ...string[]];

function asString(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
}

function textField(max: number, requiredMessage: string, lengthMessage: string) {
  return z
    .unknown()
    .transform((value) => (typeof value === "string" ? value.trim() : ""))
    .pipe(z.string().min(1, requiredMessage).max(max, lengthMessage));
}

export const contractorProfileSchema = z.object({
  companyName: textField(100, "Company name is required.", "Company name must be 100 characters or fewer."),
  trade: textField(80, "Trade is required.", "Trade must be 80 characters or fewer."),
  bio: textField(2000, "Bio is required.", "Bio must be 2000 characters or fewer."),
  city: textField(80, "City is required.", "City must be 80 characters or fewer."),
  state: z
    .unknown()
    .transform((value) => (typeof value === "string" ? value.trim().toUpperCase() : ""))
    .pipe(z.enum(stateCodes, { message: "Choose a state." })),
  yearsExperience: z
    .unknown()
    .transform(asString)
    .pipe(
      z
        .string()
        .regex(/^\d{1,2}$/, "Years of experience must be a whole number from 0 to 80.")
        .transform((value) => Number(value))
        .refine((value) => value <= 80, "Years of experience must be 80 or less."),
    ),
  hourlyRate: z
    .unknown()
    .transform(asString)
    .pipe(
      z
        .string()
        .regex(
          /^(?:0|[1-9]\d{0,4})(?:\.\d{1,2})?$/,
          "Hourly rate must be a positive amount with up to 2 decimal places.",
        )
        .refine((value) => {
          const amount = Number(value);
          return amount > 0 && amount <= 10000;
        }, "Hourly rate must be between 0.01 and 10000."),
    ),
});

export type ContractorProfileInput = z.infer<typeof contractorProfileSchema>;

export function profileValidationMessage(error: z.ZodError) {
  return error.issues
    .slice(0, 3)
    .map((issue) => issue.message)
    .join(" ");
}

export function profileInputFromFormData(formData: FormData) {
  return {
    companyName: formData.get("companyName"),
    trade: formData.get("trade"),
    bio: formData.get("bio"),
    city: formData.get("city"),
    state: formData.get("state"),
    yearsExperience: formData.get("yearsExperience"),
    hourlyRate: formData.get("hourlyRate"),
  };
}
