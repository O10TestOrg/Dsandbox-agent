"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "../lib/auth-client";

type Mode = "sign-in" | "sign-up";

const MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Wrong email or password.",
  USER_ALREADY_EXISTS: "That email is already in use. Try signing in.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "That email is already in use. Try signing in.",
  PASSWORD_TOO_SHORT: "That password is too short.",
};

const inputClass =
  "mt-1 w-full rounded-control border border-line bg-transparent px-3 py-2.5 text-ink";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();

    setError(null);
    setPending(true);
    try {
      const { error: authError } =
        mode === "sign-up"
          ? await authClient.signUp.email({ name, email, password })
          : await authClient.signIn.email({ email, password });
      if (authError) {
        setError((authError.code && MESSAGES[authError.code]) || authError.message || "Something went wrong. Try again.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      {mode === "sign-up" ? (
        <label className="block text-sm font-medium">
          Name
          <input name="name" type="text" required autoComplete="name" className={inputClass} />
        </label>
      ) : null}
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
          className={inputClass}
        />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
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
