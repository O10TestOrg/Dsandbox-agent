import { describe, expect, it } from "vitest";
import {
  DEMO_CONVERSATIONS,
  DEMO_KNOWLEDGE_SOURCES,
  DEMO_MESSAGE_MAX_CHARS,
  DEMO_PROJECTS,
  DEMO_UNKNOWN_REPLY,
  getScriptedReply,
} from "../index";

const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe("getScriptedReply", () => {
  const coffee = DEMO_PROJECTS[0]!.id;

  it("answers a sample question", () => {
    expect(getScriptedReply(coffee, "What are your opening hours?")).toMatch(/open/i);
  });

  it("matches keywords case-insensitively", () => {
    expect(getScriptedReply(coffee, "OPENING HOURS?")).toBe(
      getScriptedReply(coffee, "opening hours?"),
    );
    expect(getScriptedReply(coffee, "opening hours?")).not.toBe(DEMO_UNKNOWN_REPLY);
  });

  it("says it doesn't know for an unrelated question", () => {
    expect(getScriptedReply(coffee, "Who won the football match?")).toBe(
      "I don't know — that isn't in my knowledge yet.",
    );
  });

  it("says it doesn't know for an unknown project", () => {
    expect(getScriptedReply("nope", "opening hours?")).toBe(DEMO_UNKNOWN_REPLY);
  });

  it("answers at least one question for every sample project", () => {
    const answers = DEMO_PROJECTS.map((p) => getScriptedReply(p.id, "price"));
    expect(answers.some((a) => a !== DEMO_UNKNOWN_REPLY)).toBe(true);
  });
});

describe("seed integrity", () => {
  const projectIds = new Set(DEMO_PROJECTS.map((p) => p.id));

  it("has 3 projects with 2-4 sources and 3-5 conversations each", () => {
    expect(DEMO_PROJECTS).toHaveLength(3);
    for (const id of projectIds) {
      const sources = DEMO_KNOWLEDGE_SOURCES.filter((s) => s.projectId === id);
      const convos = DEMO_CONVERSATIONS.filter((c) => c.projectId === id);
      expect(sources.length).toBeGreaterThanOrEqual(2);
      expect(sources.length).toBeLessThanOrEqual(4);
      expect(convos.length).toBeGreaterThanOrEqual(3);
      expect(convos.length).toBeLessThanOrEqual(5);
    }
  });

  it("points every source and conversation at a seed project", () => {
    for (const s of DEMO_KNOWLEDGE_SOURCES) expect(projectIds.has(s.projectId)).toBe(true);
    for (const c of DEMO_CONVERSATIONS) expect(projectIds.has(c.projectId)).toBe(true);
  });

  it("gives conversations 2-6 messages", () => {
    for (const c of DEMO_CONVERSATIONS) {
      expect(c.messages.length).toBeGreaterThanOrEqual(2);
      expect(c.messages.length).toBeLessThanOrEqual(6);
    }
  });

  it("uses unique ids", () => {
    expect(unique(DEMO_PROJECTS.map((p) => p.id))).toBe(true);
    expect(unique(DEMO_KNOWLEDGE_SOURCES.map((s) => s.id))).toBe(true);
    expect(unique(DEMO_CONVERSATIONS.map((c) => c.id))).toBe(true);
    expect(unique(DEMO_CONVERSATIONS.flatMap((c) => c.messages.map((m) => m.id)))).toBe(true);
  });

  it("caps messages at 1000 characters", () => {
    expect(DEMO_MESSAGE_MAX_CHARS).toBe(1000);
  });
});
