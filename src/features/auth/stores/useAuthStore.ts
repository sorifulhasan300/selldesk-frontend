"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, AuthSession } from "../types";
import { setAuthSession, clearAuthSession } from "../services/authSession";
import { setClientAuthToken } from "@/shared/lib/api/token";

export interface AuthStoreState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface AuthStoreActions {
  /**
   * Set authenticated user and authorization token.
   * Supports both (user, token) and ({ user, token }) argument shapes.
   */
  setAuth: (
    userOrPayload: AuthUser | { user: AuthUser; token?: string | null },
    tokenArg?: string | null,
  ) => void;

  /**
   * Log out user, remove authentication tokens, and clear stored session.
   */
  logout: () => void;

  /**
   * Update active user profile attributes.
   */
  updateUser: (user: Partial<AuthUser>) => void;

  /**
   * Backward-compatibility helper for AuthSession payload.
   */
  setSession: (session: AuthSession) => void;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      setAuth: (userOrPayload, tokenArg) => {
        let user: AuthUser;
        let token: string | null = null;

        if (
          userOrPayload &&
          typeof userOrPayload === "object" &&
          "user" in userOrPayload
        ) {
          user = userOrPayload.user;
          token = userOrPayload.token ?? null;
        } else {
          user = userOrPayload as AuthUser;
          token = tokenArg ?? null;
        }

        // Synchronize auth cookie & in-memory token for API requests
        setClientAuthToken(token);

        set({
          user,
          token,
          isAuthenticated: Boolean(user),
        });
      },

      logout: () => {
        // Clear all cookies and persistent auth storage
        clearAuthSession();
        setClientAuthToken(null);

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updatedUser: Partial<AuthUser>) =>
        set((state) => {
          if (!state.user) return state;
          const mergedUser = { ...state.user, ...updatedUser };
          return {
            user: mergedUser,
          };
        }),

      setSession: (session: AuthSession) => {
        setAuthSession(session);
        const accessToken = session.tokens?.accessToken ?? null;
        setClientAuthToken(accessToken);

        set({
          user: session.user,
          token: accessToken,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: "selldesk_auth_store_v1",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    },
  ),
);

export default useAuthStore;
