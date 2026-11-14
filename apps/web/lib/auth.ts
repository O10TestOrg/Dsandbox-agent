import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@askwell/db/schema";
import { getDb, type Database } from "@askwell/db/client";

/**
 * Base URL: BETTER_AUTH_URL when set (local, production). On Vercel previews it is
 * unset, so fall back to the preview's own host.
 */
function resolveOrigins(): { baseURL: string | undefined; trustedOrigins: string[] } {
  const configured = process.env.BETTER_AUTH_URL;
  const previewHosts = [process.env.VERCEL_BRANCH_URL, process.env.VERCEL_URL].filter(
    (h): h is string => Boolean(h),
  );
  const previewOrigins = previewHosts.map((h) => `https://${h}`);
  const baseURL = configured || previewOrigins[0];
  const trustedOrigins = [...new Set([...(baseURL ? [baseURL] : []), ...previewOrigins])];
  return { baseURL, trustedOrigins };
}

const { baseURL, trustedOrigins } = resolveOrigins();

type Auth = ReturnType<typeof createAuth>;
let instance: Auth | undefined;

function createAuth(db: Database) {
  return betterAuth({
    baseURL,
    trustedOrigins,
    database: drizzleAdapter(db, { provider: "pg", schema }),
    // Email + password only. Verification is off (product owner decision). No social providers yet.
    emailAndPassword: { enabled: true, requireEmailVerification: false },
    user: {
      additionalFields: {
        // The server decides the plan (project.md §5). input: false = a request can never set it.
        plan: { type: "string", required: true, defaultValue: "free", input: false },
        stripeCustomerId: { type: "string", required: false, input: false },
      },
    },
    plugins: [nextCookies()],
  });
}

/**
 * The Better Auth instance, created on first use. It needs the db client, and `getDb()`
 * requires DATABASE_URL, so it is built at request time, never at `next build`.
 */
export function getAuth(): Auth {
  instance ??= createAuth(getDb());
  return instance;
}
