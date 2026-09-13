import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route Configuration Constants
 */
const PROTECTED_PREFIXES = ["/onboarding", "/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

const AUTH_COOKIE_NAME = "selldesk_access_token";

/**
 * Next.js Route Protection Middleware
 *
 * Enforces route access policies:
 * - Protected Routes (/onboarding/*, /dashboard/*): Unauthenticated users are redirected to /login with callback URL.
 * - Auth Routes (/login, /register): Authenticated users are redirected to /dashboard.
 * - Public Routes (/, /pricing, storefronts): Accessible to all visitors.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token from request cookies
  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ||
    request.cookies.get("token")?.value;

  const isAuthenticated = Boolean(token && token.trim().length > 0);

  // Check if current route matches protected patterns
  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  // Check if current route is an authentication route
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // 1. Unauthenticated users attempting to access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    // Preserve intended destination for seamless post-login redirection
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users attempting to access auth routes (login/register)
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Multi-tenant context header propagation
  const response = NextResponse.next();
  const host = request.headers.get("host") || "";
  response.headers.set("x-request-host", host);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - Next.js internal static assets (_next/static, _next/image)
     * - favicon.ico and common static file extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
