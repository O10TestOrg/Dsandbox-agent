import { describe, expect, it } from "vitest";
import { APP_NAME } from "@askwell/shared";

describe("@askwell/shared", () => {
  it("exports APP_NAME through the package entry", () => {
    expect(APP_NAME).toBe("Askwell");
  });
});
