import { beforeEach, describe, expect, it } from "vitest";
import { eq, sql } from "drizzle-orm";
import { createTestDb } from "../pglite";
import { projects, user } from "../schema";

type Setup = Awaited<ReturnType<typeof createTestDb>>;

describe("app timestamps are time-zone safe (pglite)", () => {
  let db: Setup["db"];
  let client: Setup["client"];

  beforeEach(async () => {
    ({ db, client } = await createTestDb());
    await db.insert(user).values({ id: "u1", name: "u1", email: "u1@example.com" });
    // A session in another zone, like a server or tool not running in UTC.
    await client.exec("SET TIME ZONE 'America/New_York'");
  });

  it("an explicit UTC instant reads back as the same instant", async () => {
    const instant = "2026-01-31T23:30:00Z"; // a month boundary in UTC, not in New York
    await db.execute(
      sql`insert into projects (id, owner_id, name, public_key, period_start) values ('p1', 'u1', 'P', 'pk_1', ${instant}::timestamptz)`,
    );
    const [row] = await db.select().from(projects).where(eq(projects.id, "p1"));
    expect(row?.periodStart.toISOString()).toBe("2026-01-31T23:30:00.000Z");
  });

  it("default now() stores the current instant", async () => {
    const before = Date.now();
    await db.insert(projects).values({ id: "p2", ownerId: "u1", name: "P", publicKey: "pk_2" });
    const [row] = await db.select().from(projects).where(eq(projects.id, "p2"));
    expect(Math.abs((row?.periodStart.getTime() ?? 0) - before)).toBeLessThan(60_000);
    expect(Math.abs((row?.createdAt.getTime() ?? 0) - before)).toBeLessThan(60_000);
  });
});
