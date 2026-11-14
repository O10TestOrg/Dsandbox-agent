"use server";

import { redirect } from "next/navigation";
import { clearDemoName, displayNameFromEmail, setDemoName } from "../../lib/demo-session";

export type AuthState = { error: string } | null;

/** Demo login: any email and any non-empty password. The password is read only to check it is there, then dropped. */
export async function demoSignIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const name = displayNameFromEmail(email);
  if (!name) return { error: "Enter an email." };
  if (!password) return { error: "Enter a password." };
  await setDemoName(name);
  redirect("/dashboard");
}

export async function demoSignOut(): Promise<void> {
  await clearDemoName();
  redirect("/sign-in");
}
