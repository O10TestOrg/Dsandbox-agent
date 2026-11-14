"use client";

import { useState, type FormEvent } from "react";
import { buttonClass } from "./Button";
import { SignalMessage } from "./Signal";
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
          className="min-h-12 w-full rounded-square border border-line bg-transparent px-3 py-2.5 text-ink"
        />
        {error ? (
          <SignalMessage tone="danger" role="alert" className="mt-1">
            {error}
          </SignalMessage>
        ) : null}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className={buttonClass("primary")}
        >
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className={buttonClass("quiet")}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
