import { describe, expect, it } from "vitest";
import { usagePercent } from "../lib/usage";

describe("usagePercent", () => {
  it("is the share of the limit used", () => {
    expect(usagePercent(25, 100)).toBe(25);
    expect(usagePercent(0, 100)).toBe(0);
    expect(usagePercent(100, 100)).toBe(100);
  });

  it("caps at 100 when over the limit", () => {
    expect(usagePercent(250, 100)).toBe(100);
  });

  it("is safe with a zero or negative limit", () => {
    expect(usagePercent(0, 0)).toBe(0);
    expect(usagePercent(5, 0)).toBe(100);
    expect(usagePercent(5, -10)).toBe(100);
  });

  it("never goes below 0 or returns NaN for odd input", () => {
    expect(usagePercent(-5, 100)).toBe(0);
    expect(usagePercent(Number.NaN, 100)).toBe(0);
  });

  it("rounds to a whole percent", () => {
    expect(usagePercent(1, 3)).toBe(33);
  });
});
