"use server";

import { redirect } from "next/navigation";
import { clearDemoName, displayNameFromEmail, setDemoName } from "../../lib/demo-session";

export type AuthState = { error: string } | null;

/** Demo login: any email. The password is checked in the browser only; it is never submitted, so this never sees it. */
export async function demoSignIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const name = displayNameFromEmail(email);
  if (!name) return { error: "Enter an email." };
  await setDemoName(name);
  redirect("/dashboard");
}

export async function demoSignOut(): Promise<void> {
  await clearDemoName();
  redirect("/sign-in");
}
