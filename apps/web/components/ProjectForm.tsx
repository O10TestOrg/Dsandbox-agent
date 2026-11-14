"use client";

import { useState, type FormEvent } from "react";
import { parseProjectName } from "../lib/project-name";

/** One name field with a submit button. Used for "New project" and "Rename". The name renders as text only. */
export function ProjectForm({
  initialName = "",
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initialName?: string;
  submitLabel: string;
  onSubmit: (name: string) => void;
  onCancel?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  function handle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = parseProjectName(String(new FormData(form).get("name") ?? ""));
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    setError(null);
    onSubmit(parsed.name);
    form.reset();
  }

  return (
    <form onSubmit={handle} className="flex flex-col gap-2 sm:flex-row sm:items-start" noValidate>
      <div className="flex-1">
        <label className="sr-only" htmlFor={`project-name-${submitLabel}`}>
          Project name
        </label>
        <input
          id={`project-name-${submitLabel}`}
          name="name"
          type="text"
          defaultValue={initialName}
          placeholder="Project name"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          className="w-full rounded-control border border-line bg-transparent px-3 py-2.5 text-ink"
        />
        {error ? (
          <p role="alert" className="mt-1 text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-control bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
        >
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-control border border-line px-4 py-2.5 text-sm transition hover:bg-raised"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
