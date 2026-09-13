"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, AuthSession } from "../types";
import { clearAuthSession } from "../services/authSession";

export interface AuthStoreState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export interface AuthStoreActions {
  /**
   * Set authenticated user and update authentication status.
   * Supports both direct AuthUser and object containing user.
   */
  setAuth: (
    userOrPayload: AuthUser | { user: AuthUser; [key: string]: unknown },
  ) => void;

  /**
   * Log out user, reset authentication state, and clear stored session.
   */
  logout: () => void;

  /**
   * Update active user profile attributes.
   */
  updateUser: (user: Partial<AuthUser>) => void;

  /**
   * Backward-compatibility helper for session payloads.
   */
  setSession: (
    session:
      | { user: AuthUser; isAuthenticated?: boolean; [key: string]: unknown }
      | AuthSession,
  ) => void;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (userOrPayload) => {
        let user: AuthUser;

        if (
          userOrPayload &&
          typeof userOrPayload === "object" &&
          "user" in userOrPayload
        ) {
          user = userOrPayload.user as AuthUser;
        } else {
          user = userOrPayload as AuthUser;
        }

        set({
          user,
          isAuthenticated: Boolean(user),
        });
      },

      logout: () => {
        clearAuthSession();

        set({
          user: null,
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

      setSession: (session) => {
        set({
          user: session.user,
          isAuthenticated:
            "isAuthenticated" in session &&
            typeof session.isAuthenticated === "boolean"
              ? session.isAuthenticated
              : Boolean(session.user),
        });
      },
    }),
    {
      name: "selldesk_auth_session",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
