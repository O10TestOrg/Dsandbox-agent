import { describe, expect, it } from "vitest";
import {
  KNOWLEDGE_PROCESSING_MS,
  msUntilReady,
  parseSourceTitle,
  sourceTypeFromFileName,
} from "../lib/knowledge";

describe("sourceTypeFromFileName", () => {
  it.each([
    ["guide.pdf", "pdf"],
    ["notes.md", "md"],
    ["faq.txt", "txt"],
    ["GUIDE.PDF", "pdf"],
    ["my.notes.v2.md", "md"],
  ])("maps %s to %s", (name, type) => {
    expect(sourceTypeFromFileName(name)).toBe(type);
  });

  it.each(["photo.png", "archive.pdf.zip", "pdf", "notes.", "", ".md.exe"])("rejects %j", (name) => {
    expect(sourceTypeFromFileName(name)).toBeNull();
  });
});

describe("parseSourceTitle", () => {
  it("trims, and refuses empty or over-long titles", () => {
    expect(parseSourceTitle("  Refunds  ")).toEqual({ ok: true, title: "Refunds" });
    expect(parseSourceTitle("   ")).toMatchObject({ ok: false });
    expect(parseSourceTitle("a".repeat(120))).toMatchObject({ ok: true });
    expect(parseSourceTitle("a".repeat(121))).toMatchObject({ ok: false });
  });
});

describe("msUntilReady", () => {
  const created = "2026-11-14T10:00:00.000Z";
  const at = (ms: number) => Date.parse(created) + ms;

  it("waits the remaining time for a fresh processing source", () => {
    expect(msUntilReady({ status: "processing", createdAt: created }, at(500))).toBe(KNOWLEDGE_PROCESSING_MS - 500);
  });

  it("is 0 once the source is 2 s old or older (stale)", () => {
    expect(msUntilReady({ status: "processing", createdAt: created }, at(KNOWLEDGE_PROCESSING_MS))).toBe(0);
    expect(msUntilReady({ status: "processing", createdAt: created }, at(60_000))).toBe(0);
  });

  it("is null for a source that is not processing", () => {
    expect(msUntilReady({ status: "ready", createdAt: created }, at(0))).toBeNull();
    expect(msUntilReady({ status: "failed", createdAt: created }, at(0))).toBeNull();
  });

  it("treats an unreadable date as stale rather than stuck", () => {
    expect(msUntilReady({ status: "processing", createdAt: "nope" }, at(0))).toBe(0);
  });

  it("caps the wait if the clock is behind the saved time", () => {
    expect(msUntilReady({ status: "processing", createdAt: created }, at(-60_000))).toBe(KNOWLEDGE_PROCESSING_MS);
  });
});
