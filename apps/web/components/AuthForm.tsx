"use client";

import { useActionState, useState, type FormEvent } from "react";
import { Button } from "./Button";
import { INPUT, LABEL } from "./field";
import { SignalMessage } from "./Signal";
import { demoSignIn, type AuthState } from "../app/(auth)/actions";

type Mode = "sign-in" | "sign-up";

/** Demo form: any email and any non-empty password. The password is only checked here in the browser; it is never sent. */
export function AuthForm({ mode }: { mode: Mode }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(demoSignIn, null);
  const [clientError, setClientError] = useState<string | null>(null);

  // The password input has no `name`, so it is not part of the submitted form data.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const password = event.currentTarget.elements.namedItem("pw") as HTMLInputElement | null;
    if (!password?.value) {
      event.preventDefault();
      setClientError("Enter a password.");
      return;
    }
    setClientError(null);
  }

  const error = clientError ?? state?.error;

  return (
    <form action={action} onSubmit={onSubmit} className="space-y-6">
      <label className={LABEL}>
        Email
        <input name="email" type="email" required autoComplete="off" className={INPUT} />
      </label>
      <label className={LABEL}>
        Password
        <input id="pw" type="password" required autoComplete="off" className={INPUT} />
      </label>
      {error ? (
        <SignalMessage tone="danger" role="alert">
          {error}
        </SignalMessage>
      ) : null}
      <Button type="submit" loading={pending} className="w-full">
        {pending ? "Signing in…" : mode === "sign-up" ? "Create account" : "Sign in"}
      </Button>
    </form>
  );
}
