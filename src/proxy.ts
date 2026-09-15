import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route Configuration Constants
 */
const PROTECTED_PREFIXES = ["/dashboard", "/onboarding", "/admin"];
const AUTH_ROUTES = ["/login", "/register"];

const AUTH_COOKIE_NAME = "auth_token";
const FALLBACK_AUTH_COOKIE_NAME = "selldesk_access_token";
const EMAIL_VERIFIED_COOKIE = "email_verified";

/**
 * Next.js Route Protection Proxy (Next.js 16)
 *
 * Enforces session verification, email verification, and onboarding/dashboard access policies:
 * 1. Read auth_token directly from request.cookies.
 * 2. If unauthenticated, access to /dashboard redirects to /login, /onboarding redirects to /register.
 * 3. If authenticated but email is not verified, access to /onboarding or /dashboard redirects to /verify-email.
 * 4. If email is verified, access to /verify-email redirects to /onboarding or /dashboard.
 * 5. If authenticated and verified, access to /register or /login redirects to:
 *    - /onboarding (if store creation is pending)
 *    - /dashboard (if store is already provisioned)
 * 6. Access to /dashboard without a provisioned store redirects to /onboarding.
 * 7. Access to /onboarding with an already provisioned store redirects to /dashboard.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve primary authentication token directly from request cookies
  const authToken =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ||
    request.cookies.get(FALLBACK_AUTH_COOKIE_NAME)?.value ||
    request.cookies.get("token")?.value;

  const isAuthenticated = Boolean(authToken && authToken.trim().length > 0);

  // Check email verification status
  const isEmailVerified =
    request.cookies.get(EMAIL_VERIFIED_COOKIE)?.value === "true";

  // Check if current user has an active store provisioned
  const storeId =
    request.cookies.get("store_id")?.value ||
    request.cookies.get("selldesk_store_id")?.value;

  const hasStore = Boolean(storeId && storeId.trim().length > 0);

  // Identify matching route types
  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isVerifyEmailRoute =
    pathname === "/verify-email" || pathname.startsWith("/verify-email/");

  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  // 1. Unauthenticated users attempting to access protected routes (/dashboard or /onboarding)
  if (!isAuthenticated && isProtectedRoute) {
    const redirectTarget = pathname.startsWith("/onboarding")
      ? "/register"
      : "/login";
    const targetUrl = new URL(redirectTarget, request.url);
    if (pathname !== "/dashboard" && pathname !== "/onboarding") {
      targetUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(targetUrl);
  }

  // 2. Authenticated users without verified email attempting to access protected routes
  if (isAuthenticated && !isEmailVerified && isProtectedRoute) {
    return NextResponse.redirect(new URL("/verify-email", request.url));
  }

  // 3. Verified authenticated users visiting /verify-email
  if (isAuthenticated && isEmailVerified && isVerifyEmailRoute) {
    const destination = hasStore ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 4. Authenticated users attempting to access auth routes (/register or /login)
  if (isAuthenticated && isAuthRoute) {
    if (!isEmailVerified) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }
    const destination = hasStore ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 5. Authenticated users attempting to access /dashboard when store creation is still pending
  if (isAuthenticated && !hasStore && isDashboardRoute) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 6. Authenticated users attempting to access /onboarding when store is already provisioned
  if (isAuthenticated && hasStore && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 6. Multi-tenant host header forwarding
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
     * - favicon.ico and static file extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

export default proxy;
