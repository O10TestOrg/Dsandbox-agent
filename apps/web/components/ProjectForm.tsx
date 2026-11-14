"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "./Button";
import { INPUT } from "./field";
import { SignalMessage } from "./Signal";
import { parseProjectName } from "../lib/project-name";

/** One name field with a submit button. Used for "Add project" and "Rename". The name renders as text only. */
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
  const id = useId();

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
    <form onSubmit={handle} noValidate className="space-y-2">
      <label className="block text-body" htmlFor={id}>
        Project name
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <input
          id={id}
          name="name"
          type="text"
          defaultValue={initialName}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${INPUT} sm:flex-1`}
        />
        <div className="flex gap-2">
          <Button type="submit">{submitLabel}</Button>
          {onCancel ? (
            <Button variant="quiet" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      </div>
      {error ? (
        <div id={`${id}-error`}>
          <SignalMessage tone="danger" role="alert">
            {error}
          </SignalMessage>
        </div>
      ) : null}
    </form>
  );
}
