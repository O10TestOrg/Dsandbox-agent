import { describe, expect, it } from "vitest";
// Next's own compiler for `source` patterns (it writes the regex into routes-manifest.json).
import { buildCustomRoute } from "next/dist/lib/build-custom-route";
import nextConfig from "../next.config";

type Header = { key: string; value: string };
type HeaderRoute = { source: string; headers: Header[] };

/** Headers Next would send for `path`: every matching rule, later rules overriding earlier keys. */
async function headersFor(path: string): Promise<Record<string, string>> {
  const routes = ((await nextConfig.headers?.()) ?? []) as HeaderRoute[];
  const out: Record<string, string> = {};
  for (const route of routes) {
    const { regex } = buildCustomRoute("header", route) as { regex: string };
    if (new RegExp(regex).test(path)) {
      for (const h of route.headers) out[h.key.toLowerCase()] = h.value;
    }
  }
  return out;
}

describe("security headers", () => {
  it.each(["/", "/sign-in", "/sign-up", "/dashboard", "/dashboard/p1", "/api/projects", "/embedded", "/embedx"])(
    "%s may only be framed by our own origin",
    async (path) => {
      const h = await headersFor(path);
      expect(h["content-security-policy"]).toBe("frame-ancestors 'self'");
      expect(h["x-frame-options"]).toBe("SAMEORIGIN");
      expect(h["x-content-type-options"]).toBe("nosniff");
      expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    },
  );

  it.each(["/embed", "/embed/", "/embed/chat"])("%s may be framed by any site", async (path) => {
    const h = await headersFor(path);
    expect(h["content-security-policy"]).toBe("frame-ancestors *");
    expect(h["x-frame-options"]).toBeUndefined();
    expect(h["x-content-type-options"]).toBe("nosniff");
  });
});
