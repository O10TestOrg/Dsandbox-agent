import { describe, expect, it } from "vitest";
import type { DemoConversation, DemoKnowledgeSource, DemoProject } from "@askwell/shared";
import { projectRows } from "../lib/project-rows";

const project = (id: string, createdAt: string, messagesUsed = 0): DemoProject => ({
  id,
  name: id,
  createdAt,
  messagesUsed,
});

const source = (projectId: string, createdAt: string): DemoKnowledgeSource => ({
  id: `${projectId}-${createdAt}`,
  projectId,
  title: "t",
  type: "text",
  status: "ready",
  createdAt,
});

const convo = (projectId: string, createdAt: string, lastMessageAt = createdAt): DemoConversation => ({
  id: `${projectId}-${createdAt}`,
  projectId,
  createdAt,
  messages: [{ id: "m", role: "visitor", body: "hi", createdAt: lastMessageAt }],
});

describe("projectRows", () => {
  it("counts only each project's own sources and conversations", () => {
    const rows = projectRows(
      [project("a", "2026-09-01T00:00:00Z", 7), project("b", "2026-09-02T00:00:00Z")],
      [source("a", "2026-09-03T00:00:00Z"), source("a", "2026-09-04T00:00:00Z"), source("b", "2026-09-05T00:00:00Z")],
      [convo("b", "2026-09-06T00:00:00Z")],
    );
    expect(rows.map((r) => [r.project.id, r.sources, r.conversations, r.messages])).toEqual([
      ["a", 2, 0, 7],
      ["b", 1, 1, 0],
    ]);
  });

  it("dates Updated by the latest source, conversation message or the project itself", () => {
    const [byConversation, bySource, byProject] = projectRows(
      [
        project("c", "2026-09-01T00:00:00Z"),
        project("s", "2026-09-01T00:00:00Z"),
        project("p", "2026-09-20T00:00:00Z"),
      ],
      [source("s", "2026-09-10T00:00:00Z"), source("c", "2026-09-02T00:00:00Z")],
      [convo("c", "2026-09-03T00:00:00Z", "2026-09-15T00:00:00Z"), convo("p", "2026-09-05T00:00:00Z")],
    );
    expect(byConversation?.updatedAt).toBe("2026-09-15T00:00:00.000Z");
    expect(bySource?.updatedAt).toBe("2026-09-10T00:00:00.000Z");
    expect(byProject?.updatedAt).toBe("2026-09-20T00:00:00.000Z");
  });

  it("ignores unreadable dates instead of breaking Updated", () => {
    const [row] = projectRows([project("a", "2026-09-01T00:00:00Z")], [source("a", "not a date")], []);
    expect(row?.updatedAt).toBe("2026-09-01T00:00:00.000Z");
  });

  it("keeps the store's project order", () => {
    const rows = projectRows([project("z", "2026-09-01T00:00:00Z"), project("a", "2026-09-09T00:00:00Z")], [], []);
    expect(rows.map((r) => r.project.id)).toEqual(["z", "a"]);
  });
});
