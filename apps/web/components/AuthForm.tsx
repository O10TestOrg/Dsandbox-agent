"use client";

import { useActionState } from "react";
import { demoSignIn, type AuthState } from "../app/(auth)/actions";

type Mode = "sign-in" | "sign-up";

const inputClass =
  "mt-1 w-full rounded-control border border-line bg-transparent px-3 py-2.5 text-ink";

/** Demo form: any email and any non-empty password. The password is never sent anywhere but the demo action, which drops it. */
export function AuthForm({ mode }: { mode: Mode }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(demoSignIn, null);

  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="off" className={inputClass} />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input name="password" type="password" required autoComplete="off" className={inputClass} />
      </label>
      {state?.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-control bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Please wait…" : mode === "sign-up" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
