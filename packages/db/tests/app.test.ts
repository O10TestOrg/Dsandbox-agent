import { beforeEach, describe, expect, it } from "vitest";
import { eq, sql, cosineDistance } from "drizzle-orm";
import { DEFAULT_WIDGET_CONFIG } from "@askwell/shared";
import { createTestDb } from "../pglite";
import {
  conversations,
  knowledgeChunks,
  knowledgeSources,
  messages,
  projects,
  user,
  widgetConfigs,
  EMBEDDING_DIMENSIONS,
} from "../schema";

type TestDb = Awaited<ReturnType<typeof createTestDb>>["db"];

const vec = (hot: number) => Array.from({ length: EMBEDDING_DIMENSIONS }, (_, i) => (i === hot ? 1 : 0));

async function seed(db: TestDb) {
  await db.insert(user).values({ id: "u1", name: "u1", email: "u1@example.com" });
  await db.insert(projects).values({ id: "p1", ownerId: "u1", name: "P", publicKey: "pk_1" });
  await db.insert(widgetConfigs).values({ projectId: "p1", ...DEFAULT_WIDGET_CONFIG });
  await db.insert(knowledgeSources).values({ id: "s1", projectId: "p1", title: "FAQ", type: "text", status: "ready" });
  await db.insert(knowledgeChunks).values([
    { id: "c1", projectId: "p1", sourceId: "s1", content: "alpha", embedding: vec(0) },
    { id: "c2", projectId: "p1", sourceId: "s1", content: "beta", embedding: vec(1) },
  ]);
  await db.insert(conversations).values({ id: "v1", projectId: "p1", visitorId: "vis" });
  await db.insert(messages).values({ id: "m1", conversationId: "v1", role: "visitor", body: "hi" });
}

describe("app tables (pglite)", () => {
  let db: TestDb;
  beforeEach(async () => {
    ({ db } = await createTestDb());
    await seed(db);
  });

  it("deleting a source deletes its chunks only", async () => {
    await db.insert(knowledgeSources).values({ id: "s2", projectId: "p1", title: "B", type: "pdf", status: "ready" });
    await db.insert(knowledgeChunks).values({ id: "c3", projectId: "p1", sourceId: "s2", content: "g", embedding: vec(2) });
    await db.delete(knowledgeSources).where(eq(knowledgeSources.id, "s1"));
    const left = await db.select().from(knowledgeChunks);
    expect(left.map((c) => c.id)).toEqual(["c3"]);
  });

  it("deleting a project deletes config, sources, chunks, conversations and messages", async () => {
    await db.delete(projects).where(eq(projects.id, "p1"));
    for (const t of [widgetConfigs, knowledgeSources, knowledgeChunks, conversations, messages]) {
      expect(await db.select().from(t)).toHaveLength(0);
    }
    expect(await db.select().from(user)).toHaveLength(1);
  });

  it("deleting a user deletes their projects", async () => {
    await db.delete(user).where(eq(user.id, "u1"));
    expect(await db.select().from(projects)).toHaveLength(0);
  });

  it("rejects a duplicate public_key", async () => {
    await expect(
      db.insert(projects).values({ id: "p2", ownerId: "u1", name: "Q", publicKey: "pk_1" }),
    ).rejects.toThrow();
  });

  it("rejects values outside the fixed sets", async () => {
    await expect(
      db.insert(knowledgeSources).values({ id: "s9", projectId: "p1", title: "x", type: "docx" as never, status: "ready" }),
    ).rejects.toThrow();
    await expect(
      db.insert(messages).values({ id: "m9", conversationId: "v1", role: "system" as never, body: "x" }),
    ).rejects.toThrow();
  });

  it("rejects a chunk whose source belongs to another project", async () => {
    await db.insert(projects).values({ id: "p2", ownerId: "u1", name: "Q", publicKey: "pk_2" });
    await expect(
      db.insert(knowledgeChunks).values({ id: "cx", projectId: "p2", sourceId: "s1", content: "x", embedding: vec(3) }),
    ).rejects.toThrow();
  });

  it("finds the nearest chunk by cosine distance", async () => {
    const q = vec(1);
    const rows = await db
      .select({ id: knowledgeChunks.id, distance: sql<number>`${cosineDistance(knowledgeChunks.embedding, q)}` })
      .from(knowledgeChunks)
      .orderBy(cosineDistance(knowledgeChunks.embedding, q))
      .limit(1);
    expect(rows[0]?.id).toBe("c2");
    expect(Number(rows[0]?.distance)).toBeCloseTo(0);
  });
});
