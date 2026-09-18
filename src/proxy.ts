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
const USER_ROLE_COOKIE_NAME = "user_role";
const FALLBACK_USER_ROLE_COOKIE_NAME = "selldesk_user_role";

/**
 * Safely decodes role claim from JWT access token
 */
function extractRoleFromJwt(jwtToken?: string | null): string | null {
  if (!jwtToken) return null;
  try {
    const parts = jwtToken.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload =
      typeof atob === "function"
        ? atob(base64)
        : typeof Buffer !== "undefined"
          ? Buffer.from(base64, "base64").toString("utf-8")
          : null;
    if (!jsonPayload) return null;
    const payload = JSON.parse(jsonPayload) as { role?: string };
    return payload?.role || null;
  } catch {
    return null;
  }
}

/**
 * Next.js Route Protection Proxy (Next.js 16)
 *
 * Enforces session verification, email verification, role-based boundaries, and onboarding/dashboard access policies:
 * 1. Read auth_token directly from request.cookies.
 * 2. If unauthenticated, access to protected routes redirects to /login (or /register for /onboarding).
 * 3. If authenticated but email is not verified, access to protected routes redirects to /verify-email.
 * 4. If authenticated and role is SUPER_ADMIN or SUPER_STAFF:
 *    - Never allow redirection to /onboarding (redirect to /admin instead).
 *    - Access to /onboarding, /dashboard, /login, /register, or /verify-email redirects to /admin.
 * 5. If authenticated tenant user:
 *    - If email verified, /login or /register redirects to /dashboard (if store provisioned) or /onboarding.
 *    - Access to /dashboard without a provisioned store redirects to /onboarding.
 *    - Access to /onboarding with an already provisioned store redirects to /dashboard.
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

  // Extract user role from cookies or JWT payload
  const rawRole =
    request.cookies.get(USER_ROLE_COOKIE_NAME)?.value ||
    request.cookies.get(FALLBACK_USER_ROLE_COOKIE_NAME)?.value ||
    extractRoleFromJwt(authToken);

  const userRole = rawRole ? rawRole.trim().toUpperCase() : null;
  const isPlatformAdmin =
    userRole === "SUPER_ADMIN" || userRole === "SUPER_STAFF";

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

  const isOnboardingRoute =
    pathname === "/onboarding" || pathname.startsWith("/onboarding/");

  // 1. Unauthenticated users attempting to access protected routes (/dashboard, /onboarding, /admin)
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
    if (isPlatformAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const destination = hasStore ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 4. Authenticated users attempting to access auth routes (/register or /login)
  if (isAuthenticated && isAuthRoute) {
    if (!isEmailVerified) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }
    if (isPlatformAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const destination = hasStore ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 5. SUPER_ADMIN / SUPER_STAFF route guards: strictly block onboarding and redirect to /admin
  if (isAuthenticated && isPlatformAdmin) {
    if (isOnboardingRoute || isDashboardRoute) {
      const targetUrl = new URL("/admin", request.url);
      targetUrl.searchParams.set("denied", "true");
      return NextResponse.redirect(targetUrl);
    }
  }

  // 6. Authenticated tenant users attempting to access /dashboard when store creation is still pending
  if (isAuthenticated && !isPlatformAdmin && !hasStore && isDashboardRoute) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 7. Authenticated tenant users attempting to access /onboarding when store is already provisioned
  if (isAuthenticated && !isPlatformAdmin && hasStore && isOnboardingRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 8. Multi-tenant host header forwarding
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
