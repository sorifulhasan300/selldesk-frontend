"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthSession, AuthUser, AuthTokens } from "../types";
import { setAuthSession, clearAuthSession } from "../services/authSession";

interface AuthState {
  session: AuthSession | null;
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      tokens: null,
      isAuthenticated: false,

      setSession: (session: AuthSession) => {
        setAuthSession(session);
        set({
          session,
          user: session.user,
          tokens: session.tokens,
          isAuthenticated: true,
        });
      },

      updateUser: (updatedUser: Partial<AuthUser>) =>
        set((state) => {
          if (!state.user) return state;
          const mergedUser = { ...state.user, ...updatedUser };
          const mergedSession = state.session
            ? { ...state.session, user: mergedUser }
            : null;
          if (mergedSession) {
            setAuthSession(mergedSession);
          }
          return {
            user: mergedUser,
            session: mergedSession,
          };
        }),

      logout: () => {
        clearAuthSession();
        set({
          session: null,
          user: null,
          tokens: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "selldesk_auth_store_v1",
    },
  ),
);
