import { describe, expect, it } from "vitest";
import { formText } from "../lib/form-text";

describe("formText", () => {
  it("returns the field's text", () => {
    const data = new FormData();
    data.set("name", "Taskly");
    expect(formText(data, "name")).toBe("Taskly");
  });

  it("returns an empty string for a missing field or a file", () => {
    const data = new FormData();
    data.set("upload", new File(["x"], "notes.txt"));
    expect(formText(data, "missing")).toBe("");
    expect(formText(data, "upload")).toBe("");
  });
});
