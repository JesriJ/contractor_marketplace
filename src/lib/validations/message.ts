import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .unknown()
    .transform((value) => (typeof value === "string" ? value.trim() : ""))
    .pipe(
      z.string().min(1, "Message cannot be empty.").max(2000, "Message must be 2000 characters or fewer."),
    ),
});

export function messageValidationError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid message.";
}
