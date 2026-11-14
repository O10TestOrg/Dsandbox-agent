import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "../proxy";

const req = (path: string, cookie?: string) =>
  new NextRequest(`http://localhost:3000${path}`, cookie ? { headers: { cookie } } : undefined);

describe("proxy", () => {
  it("redirects a signed-out request for /dashboard/x to /sign-in", () => {
    const res = proxy(req("/dashboard/x"));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/sign-in");
  });

  it("redirects a signed-out request for /dashboard itself", () => {
    const res = proxy(req("/dashboard"));
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/sign-in");
  });

  it("lets a request with a session cookie through to /dashboard", () => {
    const res = proxy(req("/dashboard", "better-auth.session_token=abc.def"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("lets a request with the secure-prefixed session cookie through", () => {
    const res = proxy(req("/dashboard", "__Secure-better-auth.session_token=abc.def"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("lets / through with no session", () => {
    const res = proxy(req("/"));
    expect(res.headers.get("location")).toBeNull();
  });
});
