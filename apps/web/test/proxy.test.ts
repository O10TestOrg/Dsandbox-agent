import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "../proxy";

const req = (path: string, cookie?: string) =>
  new NextRequest(`http://localhost:3000${path}`, cookie ? { headers: { cookie } } : undefined);

describe("proxy", () => {
  it("redirects a request without the demo cookie for /dashboard/x to /sign-in", () => {
    const res = proxy(req("/dashboard/x"));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/sign-in");
  });

  it("redirects for /dashboard itself", () => {
    const res = proxy(req("/dashboard"));
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/sign-in");
  });

  it("redirects when the cookie is empty", () => {
    const res = proxy(req("/dashboard", "askwell_demo="));
    expect(new URL(res.headers.get("location") ?? "").pathname).toBe("/sign-in");
  });

  it("lets a request with the demo cookie through", () => {
    const res = proxy(req("/dashboard/projects", "askwell_demo=ada"));
    expect(res.headers.get("location")).toBeNull();
  });

  it("lets / through with no cookie", () => {
    const res = proxy(req("/"));
    expect(res.headers.get("location")).toBeNull();
  });
});
