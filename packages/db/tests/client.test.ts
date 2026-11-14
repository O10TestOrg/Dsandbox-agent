import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("db client", () => {
  it("can be imported without DATABASE_URL (e.g. during next build)", async () => {
    vi.stubEnv("DATABASE_URL", "");
    await expect(import("../client")).resolves.toHaveProperty("getDb");
  });

  it("getDb() throws a clear error when DATABASE_URL is unset", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const { getDb } = await import("../client");
    expect(() => getDb()).toThrow("DATABASE_URL is not set");
  });
});
