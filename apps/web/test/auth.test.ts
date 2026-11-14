import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { createTestDb } from "../../../packages/db/pglite";
import { user } from "../../../packages/db/schema";

const testDb = await createTestDb();

vi.mock("server-only", () => ({}));
vi.mock("@askwell/db/client", () => ({ getDb: () => testDb.db }));

type Auth = ReturnType<typeof import("../lib/auth").getAuth>;
let auth: Auth;

beforeAll(async () => {
  vi.stubEnv("BETTER_AUTH_SECRET", "test-secret-test-secret-test-secret-12345");
  vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
  auth = (await import("../lib/auth")).getAuth();
});

const planOf = async (email: string) => {
  const [row] = await testDb.db.select().from(user).where(eq(user.email, email));
  return row?.plan;
};

describe("email sign-up", () => {
  it("creates a user on the free plan", async () => {
    const res = await auth.api.signUpEmail({
      body: { name: "Ada", email: "ada@example.com", password: "correct horse battery" },
    });
    expect(res.user.email).toBe("ada@example.com");
    expect(await planOf("ada@example.com")).toBe("free");
  });

  it("never lets the client choose the plan", async () => {
    // plan is not an accepted input; the cast only simulates a hostile request body.
    const attempt = auth.api.signUpEmail({
      body: { name: "Eve", email: "eve@example.com", password: "correct horse battery", plan: "pro" } as never,
    });
    await attempt.catch(() => undefined); // rejecting the field is fine; accepting it is not
    expect(await planOf("eve@example.com")).not.toBe("pro");
  });

  it("never lets the client set a stripe customer id", async () => {
    await auth.api
      .signUpEmail({
        body: { name: "Mal", email: "mal@example.com", password: "correct horse battery", stripeCustomerId: "cus_evil" } as never,
      })
      .catch(() => undefined);
    const [row] = await testDb.db.select().from(user).where(eq(user.email, "mal@example.com"));
    expect(row?.stripeCustomerId ?? null).toBeNull();
  });
});
