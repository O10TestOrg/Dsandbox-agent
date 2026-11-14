import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE } from "./lib/demo-session";

// Only redirects. The demo cookie is not secret, so this is a convenience, not security.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const guarded = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (guarded && !request.cookies.get(DEMO_COOKIE)?.value) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
