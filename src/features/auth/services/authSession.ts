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
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    // Handle both Zustand persist wrapper { state: { user, isAuthenticated }, version }
    // and direct AuthSession / safeSession payload { user, isAuthenticated, tokens }
    const sessionData =
      "state" in parsed && parsed.state && typeof parsed.state === "object"
        ? parsed.state
        : parsed;

    const user = sessionData?.user;
    if (!user || typeof user !== "object") {
      return null;
    }

    const isAuthenticated =
      typeof sessionData.isAuthenticated === "boolean"
        ? sessionData.isAuthenticated
        : Boolean(user);

    const tokens: AuthTokens = sessionData?.tokens || {
      accessToken: "",
      refreshToken: "",
    };

    return {
      user: user as AuthUser,
      tokens,
      isAuthenticated,
      createdAt: sessionData?.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to parse stored auth session:", error);
    return null;
  }
}

/**
 * Store client-safe user metadata into client-side storage (no raw tokens)
 */
export function setAuthSession(
  session: AuthSession | { user: AuthUser; isAuthenticated?: boolean },
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    let existingWrapper: Record<string, unknown> | null = null;
    if (raw) {
      try {
        existingWrapper = JSON.parse(raw);
      } catch {
        existingWrapper = null;
      }
    }

    const safeState = {
      user: session.user,
      isAuthenticated:
        "isAuthenticated" in session ? session.isAuthenticated : true,
    };

    if (
      existingWrapper &&
      typeof existingWrapper === "object" &&
      "state" in existingWrapper
    ) {
      localStorage.setItem(
        AUTH_SESSION_STORAGE_KEY,
        JSON.stringify({
          ...existingWrapper,
          state: {
            ...(existingWrapper.state as object),
            ...safeState,
          },
        }),
      );
    } else {
      localStorage.setItem(
        AUTH_SESSION_STORAGE_KEY,
        JSON.stringify({
          state: safeState,
          version: 0,
        }),
      );
    }
  } catch (error) {
    console.error("Failed to save auth session:", error);
  }
}

/**
 * Clear current session credentials from client-side storage
 */
export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
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
