import { describe, expect, it } from "vitest";
import type { DemoConversation, DemoMessage } from "@askwell/shared";
import { latestActivity, previewOf, sortNewestFirst } from "../lib/conversations";

const msg = (role: DemoMessage["role"], body: string, createdAt: string): DemoMessage => ({
  id: `${role}-${createdAt}`,
  role,
  body,
  createdAt,
});

const convo = (id: string, createdAt: string, messages: DemoMessage[]): DemoConversation => ({
  id,
  projectId: "p",
  createdAt,
  messages,
});

describe("sortNewestFirst", () => {
  it("orders by the latest message, not by when the conversation started", () => {
    const oldStartRecentReply = convo("a", "2026-10-01T08:00:00Z", [
      msg("visitor", "hi", "2026-10-01T08:00:00Z"),
      msg("bot", "hello", "2026-10-09T08:00:00Z"),
    ]);
    const newerStartOlderReply = convo("b", "2026-10-05T08:00:00Z", [
      msg("visitor", "hi", "2026-10-05T08:00:00Z"),
    ]);
    expect(sortNewestFirst([newerStartOlderReply, oldStartRecentReply]).map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("falls back to createdAt for a conversation with no messages", () => {
    const empty = convo("empty", "2026-10-07T00:00:00Z", []);
    const older = convo("older", "2026-10-01T00:00:00Z", [msg("visitor", "hi", "2026-10-01T00:00:00Z")]);
    expect(latestActivity(empty)).toBe(Date.parse("2026-10-07T00:00:00Z"));
    expect(sortNewestFirst([older, empty]).map((c) => c.id)).toEqual(["empty", "older"]);
  });

  it("does not change the list it is given", () => {
    const list = [
      convo("x", "2026-10-01T00:00:00Z", []),
      convo("y", "2026-10-02T00:00:00Z", []),
    ];
    sortNewestFirst(list);
    expect(list.map((c) => c.id)).toEqual(["x", "y"]);
  });
});

describe("previewOf", () => {
  it("uses the first visitor message, even when a bot message comes first", () => {
    const c = convo("c", "2026-10-01T00:00:00Z", [
      msg("bot", "Welcome!", "2026-10-01T00:00:00Z"),
      msg("visitor", "Do you ship abroad?", "2026-10-01T00:01:00Z"),
    ]);
    expect(previewOf(c)).toBe("Do you ship abroad?");
  });

  it("truncates a long message to one line with an ellipsis", () => {
    const c = convo("c", "2026-10-01T00:00:00Z", [msg("visitor", "word ".repeat(50), "2026-10-01T00:00:00Z")]);
    const preview = previewOf(c, 40);
    expect(preview).toHaveLength(40);
    expect(preview.endsWith("…")).toBe(true);
  });

  it("collapses line breaks so the preview stays on one line", () => {
    const c = convo("c", "2026-10-01T00:00:00Z", [msg("visitor", "line one\n\n  line two", "2026-10-01T00:00:00Z")]);
    expect(previewOf(c)).toBe("line one line two");
  });

  it("says so when there is no visitor message", () => {
    expect(previewOf(convo("c", "2026-10-01T00:00:00Z", []))).toBe("No messages");
  });
});
