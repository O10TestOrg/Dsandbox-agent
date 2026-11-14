import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, string>();
const cookieJar = {
  get: (name: string) => (store.has(name) ? { name, value: store.get(name) as string } : undefined),
  set: (name: string, value: string) => void store.set(name, value),
  delete: (name: string) => void store.delete(name),
};
class Redirect extends Error {
  constructor(public url: string) {
    super(`redirect:${url}`);
  }
}

vi.mock("next/headers", () => ({ cookies: async () => cookieJar }));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Redirect(url);
  },
}));

const { demoSignIn, demoSignOut } = await import("../app/(auth)/actions");
const { getDemoName, displayNameFromEmail, DEMO_COOKIE } = await import("../lib/demo-session");

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
};

beforeEach(() => store.clear());

describe("displayNameFromEmail", () => {
  it("uses the part before the @", () => {
    expect(displayNameFromEmail("ada@example.com")).toBe("ada");
  });
  it("uses the whole text when there is no @", () => {
    expect(displayNameFromEmail("  ada  ")).toBe("ada");
  });
});

describe("demo sign in", () => {
  it("sets the cookie from the email and goes to the dashboard", async () => {
    await expect(demoSignIn(null, form({ email: "ada@example.com", password: "x" }))).rejects.toMatchObject({
      url: "/dashboard",
    });
    expect(store.get(DEMO_COOKIE)).toBe("ada");
    expect(await getDemoName()).toBe("ada");
  });

  it("refuses an empty password and sets no cookie", async () => {
    const res = await demoSignIn(null, form({ email: "ada@example.com", password: "" }));
    expect(res?.error).toBeTruthy();
    expect(store.has(DEMO_COOKIE)).toBe(false);
  });

  it("refuses an empty email", async () => {
    const res = await demoSignIn(null, form({ email: "  ", password: "x" }));
    expect(res?.error).toBeTruthy();
    expect(store.has(DEMO_COOKIE)).toBe(false);
  });

  it("never stores the password", async () => {
    await demoSignIn(null, form({ email: "ada@example.com", password: "hunter2" })).catch(() => undefined);
    expect([...store.values()].join()).not.toContain("hunter2");
  });
});

describe("demo sign out", () => {
  it("clears the cookie and goes to /sign-in", async () => {
    store.set(DEMO_COOKIE, "ada");
    await expect(demoSignOut()).rejects.toMatchObject({ url: "/sign-in" });
    expect(store.has(DEMO_COOKIE)).toBe(false);
    expect(await getDemoName()).toBeNull();
  });
});
