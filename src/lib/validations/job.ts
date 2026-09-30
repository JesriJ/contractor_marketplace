import { z } from "zod";

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

function moneyField(label: string, max: number) {
  return z
    .unknown()
    .transform(asString)
    .pipe(
      z
        .string()
        .regex(
          /^(?:0|[1-9]\d{0,6})(?:\.\d{1,2})?$/,
          `${label} must be a positive amount with up to 2 decimal places.`,
        )
        .refine((value) => {
          const amount = Number(value);
          return amount > 0 && amount <= max;
        }, `${label} must be between 0.01 and ${max}.`),
    );
}

export const jobSchema = z.object({
  title: textField(120, "Title is required.", "Title must be 120 characters or fewer."),
  description: textField(5000, "Description is required.", "Description must be 5000 characters or fewer."),
  budget: moneyField("Budget", 1_000_000),
  location: textField(120, "Location is required.", "Location must be 120 characters or fewer."),
});

export const bidSchema = z.object({
  amount: moneyField("Bid amount", 1_000_000),
  message: textField(2000, "Message is required.", "Message must be 2000 characters or fewer."),
  estimatedDuration: textField(
    120,
    "Estimated time is required.",
    "Estimated time must be 120 characters or fewer.",
  ),
});

export type JobInput = z.infer<typeof jobSchema>;
export type BidInput = z.infer<typeof bidSchema>;

export function validationMessage(error: z.ZodError) {
  return error.issues
    .slice(0, 3)
    .map((issue) => issue.message)
    .join(" ");
}

export function jobInputFromFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    budget: formData.get("budget"),
    location: formData.get("location"),
  };
}

export function bidInputFromFormData(formData: FormData) {
  return {
    amount: formData.get("amount"),
    message: formData.get("message"),
    estimatedDuration: formData.get("estimatedDuration"),
  };
}
