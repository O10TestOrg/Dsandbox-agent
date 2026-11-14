import { cookies } from "next/headers";

/** The demo "session": a plain cookie holding the display name. Not secret, not signed (project.md §6.2). */
export const DEMO_COOKIE = "askwell_demo";

/** Longest display name. Keeps the cookie far under the 4 KB limit, past which browsers drop it silently. */
export const MAX_NAME_LENGTH = 64;

/** The part of the email before the @ (or the whole text when there is no @), capped at MAX_NAME_LENGTH. */
export function displayNameFromEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  return (at > 0 ? trimmed.slice(0, at) : trimmed).trim().slice(0, MAX_NAME_LENGTH);
}

/** The display name for this request, or null when signed out. Call on the server. */
export async function getDemoName(): Promise<string | null> {
  const value = (await cookies()).get(DEMO_COOKIE)?.value;
  return value ? value : null;
}

export async function setDemoName(name: string): Promise<void> {
  (await cookies()).set(DEMO_COOKIE, name, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 7 });
}

export async function clearDemoName(): Promise<void> {
  (await cookies()).delete(DEMO_COOKIE);
}
