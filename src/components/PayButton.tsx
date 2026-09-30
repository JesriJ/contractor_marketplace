"use client";

import { useActionState } from "react";
import { startCheckoutAction } from "@/lib/actions/payment";

export function PayButton({ jobId }: { jobId: string }) {
  const [state, formAction, pending] = useActionState(startCheckoutAction, { error: null });

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="jobId" value={jobId} />
      {state.error ? (
        <p className="text-sm text-red-800" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {pending ? "Opening checkout..." : "Pay contractor"}
      </button>
    </form>
  );
}
