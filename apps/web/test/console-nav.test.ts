import { describe, expect, it } from "vitest";
import { breadcrumb, parseConsolePath, sectionHref, switchProjectHref } from "../lib/console-nav";

const projects = [
  { id: "p1", name: "Bean & Brew" },
  { id: "a b", name: "Spaced" },
];

describe("parseConsolePath", () => {
  it("has no project on the projects list", () => {
    expect(parseConsolePath("/dashboard/projects")).toEqual({ projectId: null, section: null });
  });

  it("has a project but no section at the project root (it redirects to Knowledge)", () => {
    expect(parseConsolePath("/dashboard/projects/p1")).toEqual({ projectId: "p1", section: null });
  });

  it("reads each section, and a conversation thread as conversations", () => {
    expect(parseConsolePath("/dashboard/projects/p1/knowledge").section).toBe("knowledge");
    expect(parseConsolePath("/dashboard/projects/p1/try").section).toBe("try");
    expect(parseConsolePath("/dashboard/projects/p1/conversations/c9").section).toBe("conversations");
  });

  it("decodes the project id and ignores a trailing slash", () => {
    expect(parseConsolePath("/dashboard/projects/a%20b/usage/")).toEqual({ projectId: "a b", section: "usage" });
  });

  it("has no section for an unknown segment, and survives a malformed id", () => {
    expect(parseConsolePath("/dashboard/projects/p1/nope").section).toBeNull();
    expect(parseConsolePath("/dashboard/projects/%E0%A4%A/knowledge").projectId).toBe("%E0%A4%A");
  });
});

describe("sectionHref", () => {
  it("encodes the id", () => {
    expect(sectionHref("a b", "knowledge")).toBe("/dashboard/projects/a%20b/knowledge");
  });
});

describe("breadcrumb", () => {
  it("is just Projects on the list, marked current", () => {
    expect(breadcrumb("/dashboard/projects", projects)).toEqual([{ label: "Projects", href: null }]);
  });

  it("is Projects / name / section inside a project", () => {
    expect(breadcrumb("/dashboard/projects/p1/knowledge", projects)).toEqual([
      { label: "Projects", href: "/dashboard/projects" },
      { label: "Bean & Brew", href: "/dashboard/projects/p1/knowledge" },
      { label: "Knowledge", href: null },
    ]);
  });

  it("ends at the project name at the project root", () => {
    expect(breadcrumb("/dashboard/projects/p1", projects).map((c) => c.label)).toEqual(["Projects", "Bean & Brew"]);
  });

  it("adds the conversation under Conversations in a thread", () => {
    expect(breadcrumb("/dashboard/projects/p1/conversations/c9", projects)).toEqual([
      { label: "Projects", href: "/dashboard/projects" },
      { label: "Bean & Brew", href: "/dashboard/projects/p1/knowledge" },
      { label: "Conversations", href: "/dashboard/projects/p1/conversations" },
      { label: "Conversation", href: null },
    ]);
  });

  it("says the project is not found for an unknown id", () => {
    expect(breadcrumb("/dashboard/projects/zzz/usage", projects)).toEqual([
      { label: "Projects", href: "/dashboard/projects" },
      { label: "Project not found", href: null },
    ]);
  });
});

describe("switchProjectHref", () => {
  it("keeps the current section", () => {
    expect(switchProjectHref("/dashboard/projects/p1/usage", "a b")).toBe("/dashboard/projects/a%20b/usage");
  });

  it("goes to the list of conversations from a thread, since the thread belongs to the old project", () => {
    expect(switchProjectHref("/dashboard/projects/p1/conversations/c9", "p2")).toBe(
      "/dashboard/projects/p2/conversations",
    );
  });

  it("opens Knowledge from outside a project or an unknown section", () => {
    expect(switchProjectHref("/dashboard/projects", "p2")).toBe("/dashboard/projects/p2/knowledge");
    expect(switchProjectHref("/dashboard/projects/p1/nope", "p2")).toBe("/dashboard/projects/p2/knowledge");
  });
});
