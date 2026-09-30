"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession } from "@/lib/payments";

export type PayFormState = {
  error: string | null;
};

export async function startCheckoutAction(
  _previous: PayFormState,
  formData: FormData,
): Promise<PayFormState> {
  const jobId = String(formData.get("jobId") ?? "");
  const result = await createCheckoutSession(jobId);
  if (!result.ok) {
    return { error: result.error };
  }
  redirect(result.url);
}
