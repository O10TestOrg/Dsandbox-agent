import { afterEach, describe, expect, it, vi } from "vitest";

type CookieOptions = { httpOnly?: boolean; secure?: boolean; sameSite?: string; path?: string; maxAge?: number };
const setCalls: { name: string; value: string; options: CookieOptions }[] = [];
const cookieJar = {
  set: (name: string, value: string, options: CookieOptions) => void setCalls.push({ name, value, options }),
};

vi.mock("next/headers", () => ({ cookies: () => Promise.resolve(cookieJar) }));

const { setDemoName, DEMO_COOKIE } = await import("../lib/demo-session");

const SEVEN_DAYS = 60 * 60 * 24 * 7;

afterEach(() => {
  setCalls.length = 0;
  vi.unstubAllEnvs();
});

describe("setDemoName cookie options", () => {
  it("is httpOnly, lax, site-wide and lasts 7 days", async () => {
    await setDemoName("ada");
    expect(setCalls).toEqual([
      {
        name: DEMO_COOKIE,
        value: "ada",
        options: expect.objectContaining({ httpOnly: true, sameSite: "lax", path: "/", maxAge: SEVEN_DAYS }) as CookieOptions,
      },
    ]);
  });

  it("is secure in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await setDemoName("ada");
    expect(setCalls[0]?.options.secure).toBe(true);
  });

  it("is not secure outside production, so local http still works", async () => {
    vi.stubEnv("NODE_ENV", "development");
    await setDemoName("ada");
    expect(setCalls[0]?.options.secure).toBe(false);
  });
});
