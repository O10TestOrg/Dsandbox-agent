import { describe, expect, it } from "vitest";
import { PROJECT_NAME_MAX, parseProjectName } from "../lib/project-name";

describe("parseProjectName", () => {
  it("trims the name", () => {
    expect(parseProjectName("  Docs bot  ")).toEqual({ ok: true, name: "Docs bot" });
  });

  it("refuses an empty or whitespace-only name", () => {
    expect(parseProjectName("")).toMatchObject({ ok: false });
    expect(parseProjectName("   ")).toMatchObject({ ok: false });
  });

  it("accepts exactly 60 characters and refuses 61", () => {
    expect(PROJECT_NAME_MAX).toBe(60);
    expect(parseProjectName("a".repeat(60))).toMatchObject({ ok: true });
    expect(parseProjectName("a".repeat(61))).toMatchObject({ ok: false });
  });

  it("measures the length after trimming", () => {
    expect(parseProjectName(` ${"a".repeat(60)} `)).toMatchObject({ ok: true });
  });
});
