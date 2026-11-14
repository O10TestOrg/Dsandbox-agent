import { describe, expect, it } from "vitest";
import { canSaveToStorage } from "../components/storage-available";

const working = () => {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
};

describe("canSaveToStorage", () => {
  it("is true when a value can be written and removed", () => {
    const storage = working();
    expect(canSaveToStorage(() => storage)).toBe(true);
    expect(storage.getItem("askwell:storage-probe")).toBeNull();
  });

  it("is false when writing throws (quota or blocked)", () => {
    const storage = {
      ...working(),
      setItem: () => {
        throw new DOMException("full", "QuotaExceededError");
      },
    };
    expect(canSaveToStorage(() => storage)).toBe(false);
  });

  it("is false when reaching storage throws (blocked in the browser)", () => {
    expect(
      canSaveToStorage(() => {
        throw new DOMException("denied", "SecurityError");
      }),
    ).toBe(false);
  });

  it("is false when there is no storage", () => {
    expect(canSaveToStorage(() => undefined)).toBe(false);
  });
});
