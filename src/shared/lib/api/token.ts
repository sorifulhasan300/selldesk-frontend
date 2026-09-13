import {
  AUTH_TOKEN_COOKIE_KEY,
  getAuthSession,
} from "@/features/auth/services/authSession";

// In-memory overrides (e.g. for SSR, unit tests, or dynamic switching)
let inMemoryAuthToken: string | null = null;
let inMemoryTenantSubdomain: string | null = null;

export const TENANT_COOKIE_KEY = "selldesk_tenant_subdomain";
export const TENANT_STORAGE_KEY = "selldesk_tenant_subdomain";

// System-reserved host subdomains that should not be treated as tenant stores
const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "app",
  "admin",
  "dev",
  "staging",
  "test",
  "mail",
  "auth",
  "static",
  "cdn",
]);

/**
 * Programmatically set or clear the auth token in-memory
 */
export function setClientAuthToken(token: string | null): void {
  inMemoryAuthToken = token;
}

/**
 * Programmatically set or clear the tenant subdomain in-memory
 */
export function setClientTenantSubdomain(subdomain: string | null): void {
  inMemoryTenantSubdomain = subdomain ? subdomain.trim().toLowerCase() : null;
}

/**
 * Safely extract cookie value by name from document.cookie (browser-safe)
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined" || !document.cookie) {
    return null;
  }

  const matches = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1")}=([^;]*)`,
    ),
  );

  return matches ? decodeURIComponent(matches[1]) : null;
}

/**
 * Safely retrieves the active Bearer Auth Token:
 * 1. In-memory override
 * 2. Auth Session in localStorage (`selldesk_auth_session`)
 * 3. Auth Cookie (`selldesk_access_token`)
 */
export function getAuthToken(): string | null {
  if (inMemoryAuthToken) {
    return inMemoryAuthToken;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    // 1. Try auth session from localStorage
    const session = getAuthSession();
    if (session?.tokens?.accessToken) {
      return session.tokens.accessToken;
    }

    // 2. Try cookie
    const tokenFromCookie = getCookie(AUTH_TOKEN_COOKIE_KEY);
    if (tokenFromCookie) {
      return tokenFromCookie;
    }
  } catch {
    // Fail silently in non-browser or sandbox environments
  }

  return null;
}

/**
 * Extracts the tenant subdomain from the current browser host if applicable
 * Example:
 * - "mystore.selldesk.com" -> "mystore"
 * - "mystore.localhost:3000" -> "mystore"
 * - "selldesk.com" -> null
 * - "www.selldesk.com" -> null
 */
export function extractSubdomainFromHost(hostname: string): string | null {
  if (!hostname) return null;

  const cleanHost = hostname.split(":")[0].trim().toLowerCase();

  // Ignore bare localhost or IP addresses
  if (
    cleanHost === "localhost" ||
    /^(?:\d{1,3}\.){3}\d{1,3}$/.test(cleanHost)
  ) {
    return null;
  }

  const parts = cleanHost.split(".");

  // e.g. "mystore.localhost"
  if (parts.length === 2 && parts[1] === "localhost") {
    const candidate = parts[0];
    return RESERVED_SUBDOMAINS.has(candidate) ? null : candidate;
  }

  // e.g. "mystore.selldesk.com" (3 parts) or "mystore.staging.selldesk.com" (> 2 parts)
  if (parts.length >= 3) {
    const candidate = parts[0];
    if (RESERVED_SUBDOMAINS.has(candidate)) {
      return null;
    }
    return candidate;
  }

  return null;
}

/**
 * Resolves active tenant subdomain from:
 * 1. In-memory override
 * 2. Browser window hostname (for multi-tenant wildcard domain resolution)
 * 3. Cookie (`selldesk_tenant_subdomain`)
 * 4. LocalStorage (`selldesk_tenant_subdomain`)
 */
export function getTenantSubdomain(): string | null {
  if (inMemoryTenantSubdomain) {
    return inMemoryTenantSubdomain;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    // 1. Hostname detection
    const hostSubdomain = extractSubdomainFromHost(window.location.hostname);
    if (hostSubdomain) {
      return hostSubdomain;
    }

    // 2. Cookie lookup
    const cookieSubdomain = getCookie(TENANT_COOKIE_KEY);
    if (cookieSubdomain) {
      return cookieSubdomain.trim().toLowerCase();
    }

    // 3. LocalStorage lookup
    const storedSubdomain = localStorage.getItem(TENANT_STORAGE_KEY);
    if (storedSubdomain) {
      return storedSubdomain.trim().toLowerCase();
    }
  } catch {
    // Fail silently in case of security / sandbox access restrictions
  }

  return null;
}
