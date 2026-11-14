import type { NextConfig } from "next";

/**
 * Security headers (project.md §9 "Clickjacking"). Every route may only be framed by our own origin.
 * Follow-up: a full script CSP (script-src etc.) is not set yet.
 */
const nextConfig: NextConfig = {
  transpilePackages: ["@askwell/shared"],
  headers() {
    return Promise.resolve([
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ]);
  },
};

export default nextConfig;
