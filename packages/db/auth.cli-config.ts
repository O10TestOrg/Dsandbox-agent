// Minimal Better Auth config used ONLY by the Better Auth CLI to generate
// schema/auth.ts. Lane B owns the real app config in apps/web.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter({} as never, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: { google: { clientId: "x", clientSecret: "x" } },
  user: {
    additionalFields: {
      plan: { type: "string", required: true, defaultValue: "free", input: false },
      stripeCustomerId: { type: "string", required: false, unique: true, input: false },
    },
  },
});
