import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Only redirects. The real session check happens on the server in every owner page and route.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const guarded = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (guarded && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
