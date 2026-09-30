"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/actions/job";

type JobFormValues = {
  title: string;
  description: string;
  budget: string;
  location: string;
};

type JobFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  jobId?: string;
  defaultValues?: JobFormValues;
};

const emptyValues: JobFormValues = {
  title: "",
  description: "",
  budget: "",
  location: "",
};

const fieldClass = "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900";

export function JobForm({ action, submitLabel, jobId, defaultValues = emptyValues }: JobFormProps) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {jobId ? <input type="hidden" name="jobId" value={jobId} /> : null}
      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      ) : null}
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Title</span>
        <input name="title" required maxLength={120} defaultValue={defaultValues.title} className={fieldClass} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Description</span>
        <textarea
          name="description"
          required
          rows={5}
          maxLength={5000}
          defaultValue={defaultValues.description}
          className={fieldClass}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Budget (USD)</span>
          <input
            name="budget"
            type="number"
            required
            min={0.01}
            max={1000000}
            step={0.01}
            defaultValue={defaultValues.budget}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Location</span>
          <input
            name="location"
            required
            maxLength={120}
            defaultValue={defaultValues.location}
            className={fieldClass}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
