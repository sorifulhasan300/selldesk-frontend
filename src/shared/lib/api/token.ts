import {
  AUTH_TOKEN_COOKIE_KEY,
  getAuthSession,
} from "@/features/auth/services/authSession";

// In-memory overrides (e.g. for SSR, unit tests, or dynamic switching)
let inMemoryAuthToken: string | null = null;
let inMemoryTenantSubdomain: string | null = null;
let inMemoryStoreId: string | null = null;

export const STORE_COOKIE_KEY = "selldesk_store_id";
export const STORE_STORAGE_KEY = "selldesk_store_id";
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
 * Programmatically set or clear the auth token in-memory and cookie
 */
export function setClientAuthToken(token: string | null, persist = true): void {
  inMemoryAuthToken = token;

  if (typeof window !== "undefined" && persist) {
    try {
      if (token) {
        // 7 days expiration for access token cookie
        document.cookie = `${AUTH_TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
      } else {
        document.cookie = `${AUTH_TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
      }
    } catch {
      // Ignore sandbox access errors
    }
  }
}

/**
 * Programmatically set or clear the store ID in-memory, localStorage, and cookie (primary backend identifier)
 */
export function setClientStoreId(storeId: string | null, persist = true): void {
  inMemoryStoreId = storeId ? storeId.trim() : null;

  if (typeof window !== "undefined" && persist) {
    try {
      if (inMemoryStoreId) {
        localStorage.setItem(STORE_STORAGE_KEY, inMemoryStoreId);
        // 30 days expiration for store context cookie
        document.cookie = `${STORE_COOKIE_KEY}=${encodeURIComponent(inMemoryStoreId)}; path=/; max-age=2592000; SameSite=Lax`;
      } else {
        localStorage.removeItem(STORE_STORAGE_KEY);
        document.cookie = `${STORE_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
      }
    } catch {
      // Ignore sandbox access errors
    }
  }
}

/**
 * Programmatically set or clear the tenant subdomain in-memory, localStorage, and cookie
 */
export function setClientTenantSubdomain(
  subdomain: string | null,
  persist = true,
): void {
  inMemoryTenantSubdomain = subdomain ? subdomain.trim().toLowerCase() : null;

  if (typeof window !== "undefined" && persist) {
    try {
      if (inMemoryTenantSubdomain) {
        localStorage.setItem(TENANT_STORAGE_KEY, inMemoryTenantSubdomain);
        // 30 days expiration for tenant cookie
        document.cookie = `${TENANT_COOKIE_KEY}=${encodeURIComponent(inMemoryTenantSubdomain)}; path=/; max-age=2592000; SameSite=Lax`;
      } else {
        localStorage.removeItem(TENANT_STORAGE_KEY);
        document.cookie = `${TENANT_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
      }
    } catch {
      // Ignore sandbox access errors
    }
  }
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

    // 2. Try cookie (primary and fallback cookie names)
    const tokenFromCookie =
      getCookie(AUTH_TOKEN_COOKIE_KEY) ||
      getCookie("auth_token") ||
      getCookie("token");
    if (tokenFromCookie && tokenFromCookie.trim().length > 0) {
      return tokenFromCookie.trim();
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

/**
 * Resolves active store ID (primary backend identifier) from:
 * 1. In-memory override
 * 2. Cookie (`selldesk_store_id`, `store_id`, `x-store-id`)
 * 3. LocalStorage (`selldesk_store_id`, `store_id`)
 * 4. Tenant subdomain fallback (via hostname / cookie)
 */
export function getStoreId(): string | null {
  if (inMemoryStoreId) {
    return inMemoryStoreId;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    // 1. Cookie lookup
    const storeCookie =
      getCookie(STORE_COOKIE_KEY) ||
      getCookie("store_id") ||
      getCookie("x-store-id");
    if (storeCookie && storeCookie.trim().length > 0) {
      return storeCookie.trim();
    }

    // 2. LocalStorage lookup
    const storedId =
      localStorage.getItem(STORE_STORAGE_KEY) ||
      localStorage.getItem("store_id");
    if (storedId && storedId.trim().length > 0) {
      return storedId.trim();
    }
  } catch {
    // Fail silently in case of security / sandbox access restrictions
  }

  // 3. Fallback to resolved tenant subdomain
  return getTenantSubdomain();
}
