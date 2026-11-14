import type { NextConfig } from "next";

/**
 * Security headers (project.md §9 "Clickjacking"). Only `/embed` may be framed by other
 * sites, because the widget loads it in an iframe on customers' pages. Every other route
 * may only be framed by our own origin.
 * Follow-up: a full script CSP (script-src etc.) is not set yet.
 */
const nextConfig: NextConfig = {
  transpilePackages: ["@askwell/shared"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Everything except /embed and /embed/*.
        source: "/((?!embed(?:/|$)).*)",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/embed/:path*",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors *" }],
      },
    ];
  },
};

export default nextConfig;
