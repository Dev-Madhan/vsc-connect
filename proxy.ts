import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Edge proxy (replaces the deprecated middleware.ts convention).
 *
 * Protected route groups:
 *  - /dashboard/**  — requires a valid Better Auth session cookie
 *  - legacy protected paths kept from the original proxy
 */

const LEGACY_PROTECTED = [
  "/members",
  "/events/manage",
  "/gallery/manage",
  "/sponsors/manage",
  "/settings",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Dashboard protection (new) ──────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Legacy protected routes ─────────────────────────────────────────────
  const isLegacyProtected = LEGACY_PROTECTED.some((route) =>
    pathname.startsWith(route)
  );

  if (isLegacyProtected) {
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token");

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
