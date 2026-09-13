import { AuthSession, AuthUser, AuthTokens } from "../types";

export const AUTH_SESSION_STORAGE_KEY = "selldesk_auth_session";
export const AUTH_TOKEN_COOKIE_KEY = "selldesk_access_token";

/**
 * Retrieve active auth session from client-side storage
 */
export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (parsed && parsed.tokens && parsed.user) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse stored auth session:", error);
    return null;
  }
}

/**
 * Store auth session into client-side storage & sync cookies
 */
export function setAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));

    // Set cookie for Next.js middleware / SSR compatibility (7 days expiry)
    if (session.tokens?.accessToken) {
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `${AUTH_TOKEN_COOKIE_KEY}=${session.tokens.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  } catch (error) {
    console.error("Failed to save auth session:", error);
  }
}

/**
 * Clear current session credentials
 */
export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    document.cookie = `${AUTH_TOKEN_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  } catch (error) {
    console.error("Failed to clear auth session:", error);
  }
}

/**
 * Generate a valid synthetic session credentials bundle
 * Used for instant onboarding transition and offline development
 */
export function generateLocalSession(params: {
  fullName: string;
  email: string;
  phone: string;
}): AuthSession {
  const userId = `usr_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
  const now = new Date().toISOString();

  const user: AuthUser = {
    id: userId,
    name: params.fullName,
    email: params.email,
    phone: params.phone,
    role: "STORE_OWNER",
    isEmailVerified: true,
  };

  const tokens: AuthTokens = {
    accessToken: `mock_jwt_access_${userId}`,
    refreshToken: `mock_jwt_refresh_${userId}`,
  };

  return {
    user,
    tokens,
    isAuthenticated: true,
    createdAt: now,
  };
}
