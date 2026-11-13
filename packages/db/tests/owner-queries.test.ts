import { beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { createTestDb } from "../pglite";
import { getOwnedProject, getUserPlan, listOwnedProjects } from "../queries/owner";
import { projects, user } from "../schema";

type TestDb = Awaited<ReturnType<typeof createTestDb>>["db"];

const at = (n: number) => new Date(2026, 0, n);

describe("owner-scoped queries (pglite)", () => {
  let db: TestDb;
  beforeEach(async () => {
    ({ db } = await createTestDb());
    await db.insert(user).values([
      { id: "a", name: "A", email: "a@example.com" },
      { id: "b", name: "B", email: "b@example.com" },
    ]);
    await db.insert(projects).values([
      { id: "pa1", ownerId: "a", name: "old", publicKey: "pk_a1", createdAt: at(1) },
      { id: "pa2", ownerId: "a", name: "new", publicKey: "pk_a2", createdAt: at(2) },
      { id: "pb1", ownerId: "b", name: "b's", publicKey: "pk_b1", createdAt: at(3) },
    ]);
  });

  describe("getOwnedProject", () => {
    it("returns the owner's project", async () => {
      expect((await getOwnedProject(db, "a", "pa1"))?.name).toBe("old");
    });
    it("returns null for another user's project", async () => {
      expect(await getOwnedProject(db, "b", "pa1")).toBeNull();
    });
    it("returns null for a missing id", async () => {
      expect(await getOwnedProject(db, "a", "nope")).toBeNull();
    });
  });

  describe("listOwnedProjects", () => {
    it("returns only that user's projects, newest first", async () => {
      expect((await listOwnedProjects(db, "a")).map((p) => p.id)).toEqual(["pa2", "pa1"]);
      expect((await listOwnedProjects(db, "b")).map((p) => p.id)).toEqual(["pb1"]);
    });
    it("returns an empty list for a user with no projects or an unknown user", async () => {
      expect(await listOwnedProjects(db, "ghost")).toEqual([]);
    });
  });

  describe("getUserPlan", () => {
    it("is free by default and pro once the column is set", async () => {
      expect(await getUserPlan(db, "a")).toBe("free");
      await db.update(user).set({ plan: "pro" }).where(eq(user.id, "a"));
      expect(await getUserPlan(db, "a")).toBe("pro");
      expect(await getUserPlan(db, "b")).toBe("free");
    });
    it("returns null for an unknown user", async () => {
      expect(await getUserPlan(db, "ghost")).toBeNull();
    });
  });
});
