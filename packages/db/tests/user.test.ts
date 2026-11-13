import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { createTestDb } from "../pglite";
import { user } from "../schema";

type TestDb = Awaited<ReturnType<typeof createTestDb>>["db"];

const newUser = (id: string, extra: Partial<typeof user.$inferInsert> = {}) => ({
  id,
  name: id,
  email: `${id}@example.com`,
  ...extra,
});

describe("user table (migrations on pglite)", () => {
  let db: TestDb;
  beforeEach(async () => {
    ({ db } = await createTestDb());
  });

  it("defaults a new user to the free plan", async () => {
    await db.insert(user).values(newUser("u1"));
    const [row] = await db.select().from(user).where(eq(user.id, "u1"));
    expect(row?.plan).toBe("free");
    expect(row?.stripeCustomerId).toBeNull();
  });

  it("rejects a plan other than free or pro", async () => {
    await expect(db.insert(user).values(newUser("u1", { plan: "enterprise" }))).rejects.toThrow();
  });

  it("rejects a second user with the same stripe_customer_id", async () => {
    await db.insert(user).values(newUser("u1", { stripeCustomerId: "cus_1" }));
    await expect(db.insert(user).values(newUser("u2", { stripeCustomerId: "cus_1" }))).rejects.toThrow();
  });

  it("allows many users without a stripe_customer_id", async () => {
    await db.insert(user).values([newUser("u1"), newUser("u2")]);
    expect(await db.select().from(user)).toHaveLength(2);
  });
});
