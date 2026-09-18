"use client";

import React, { useEffect, useSyncExternalStore, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck, ShieldAlert, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { getAuthSession } from "@/features/auth/services/authSession";
import {
  PLATFORM_ADMIN_ROLES,
  TENANT_STORE_ROLES,
  isRouteAccessible,
  type Role,
} from "@/config/admin-routes";

/**
 * React 19 hydration-safe hook using useSyncExternalStore
 */
const emptySubscribe = () => () => {};
function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Hydration listener for Zustand persist storage
 */
function useIsStoreHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (!useAuthStore.persist?.onFinishHydration) {
        return () => {};
      }
      return useAuthStore.persist.onFinishHydration(onStoreChange);
    },
    () => useAuthStore.persist?.hasHydrated() ?? true,
    () => false,
  );
}

export interface SuperAdminGuardProps {
  children: React.ReactNode;
  /**
   * Optional custom allowed roles override.
   * Defaults to PLATFORM_ADMIN_ROLES (SUPER_ADMIN, SUPER_STAFF).
   */
  allowedRoles?: readonly string[];
  /**
   * Custom fallback to display while authenticating / authorizing
   */
  fallback?: React.ReactNode;
  /**
   * Redirection target for unauthenticated users (defaults to '/login')
   */
  redirectToLogin?: string;
  /**
   * Redirection target for authenticated users lacking platform admin roles (defaults to '/dashboard')
   */
  redirectToUnauthorized?: string;
}

/**
 * SellDesk Super Admin Authorization Barrier
 *
 * Protects all administrative sub-routes against unauthenticated visitors
 * and unauthorized tenant users (STORE_OWNER, STORE_MANAGER, STORE_STAFF).
 * Applies client-side SSR hydration safety and route-level privilege checks.
 */
export function SuperAdminGuard({
  children,
  allowedRoles = PLATFORM_ADMIN_ROLES,
  fallback,
  redirectToLogin = "/login",
  redirectToUnauthorized = "/dashboard",
}: SuperAdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const isClient = useIsClient();
  const isStoreHydrated = useIsStoreHydrated();

  // Resolve authorization state and redirect targets
  let authorizationState:
    | "loading"
    | "authorized"
    | "unauthenticated"
    | "unauthorized" = "loading";
  let redirectTarget: string | null = null;

  if (!isClient) {
    authorizationState = "loading";
  } else {
    // 1. Resolve session credentials synchronously from store or storage
    const localSession = getAuthSession();
    const activeUser = user || localSession?.user || null;
    const hasAuth =
      isAuthenticated || Boolean(localSession?.isAuthenticated && activeUser);

    if (!hasAuth || !activeUser) {
      // If store is still rehydrating and storage might not be parsed, keep in loading state
      if (!isStoreHydrated) {
        authorizationState = "loading";
      } else {
        authorizationState = "unauthenticated";
        redirectTarget = `${redirectToLogin}?from=${encodeURIComponent(pathname || "/admin")}`;
      }
    } else {
      const currentRole = (activeUser.role || "").toUpperCase();

      // 2. Tenant role check: Store owners and staff belong in the tenant dashboard
      const isTenantRole = (TENANT_STORE_ROLES as readonly string[]).includes(
        currentRole as Role,
      );
      if (isTenantRole) {
        authorizationState = "unauthorized";
        redirectTarget = redirectToUnauthorized;
      } else {
        // 3. Platform Admin role check
        const hasPlatformPrivileges = allowedRoles.some(
          (role) => role.toUpperCase() === currentRole,
        );

        if (!hasPlatformPrivileges) {
          authorizationState = "unauthorized";
          redirectTarget = redirectToUnauthorized;
        } else if (pathname && pathname !== "/admin") {
          // 4. Sub-route specific permissions (e.g. SUPER_STAFF accessing /admin/billing)
          const isCurrentRouteAllowed = isRouteAccessible(
            pathname,
            currentRole,
          );
          if (!isCurrentRouteAllowed) {
            authorizationState = "unauthorized";
            redirectTarget = "/admin";
          } else {
            authorizationState = "authorized";
          }
        } else {
          authorizationState = "authorized";
        }
      }
    }
  }

  const lastToastPathRef = useRef<string | null>(null);

  // Trigger external side-effect (Next.js client-side navigation) with unauthorized access toast
  useEffect(() => {
    if (redirectTarget) {
      if (
        authorizationState === "unauthorized" &&
        pathname &&
        lastToastPathRef.current !== pathname
      ) {
        lastToastPathRef.current = pathname;
        toast.error("You do not have permission to access this route.", {
          id: "unauthorized-route-access",
          description: "Access restricted based on your role permissions.",
        });
      }
      router.replace(redirectTarget);
    }
  }, [redirectTarget, authorizationState, pathname, router]);

  // Handle server-side proxy redirect with query parameter (?denied=true)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("denied") === "true") {
      toast.error("You do not have permission to access that route.", {
        id: "proxy-denied-access",
        description: "Access restricted based on your role permissions.",
      });
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("denied");
      window.history.replaceState(
        {},
        "",
        cleanUrl.pathname + (cleanUrl.search ? cleanUrl.search : ""),
      );
    }
  }, [pathname]);

  // Render authorized layout tree
  if (authorizationState === "authorized") {
    return <>{children}</>;
  }

  // Custom fallback if provided by parent caller
  if (fallback) {
    return <>{fallback}</>;
  }

  // SellDesk Moderate-Modern branded loading / transition state
  return (
    <div className="min-h-screen w-full bg-[#F8F9FC] flex flex-col items-center justify-center p-4 selection:bg-[#7C5CFC]/20">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-xs text-center flex flex-col items-center">
        {authorizationState === "unauthorized" ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-5 shadow-xs">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-800 mb-3 border border-amber-200">
              Access Restricted
            </span>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Insufficient Privileges
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Your account role does not have permission to view the SellDesk
              Platform Super Admin console. Redirecting you to your store
              dashboard...
            </p>
            <button
              onClick={() => router.replace(redirectToUnauthorized)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#7C5CFC] text-white hover:bg-[#6A48F3] transition-colors shadow-sm shadow-[#7C5CFC]/25 cursor-pointer"
            >
              <span>Go to Store Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : authorizationState === "unauthenticated" ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-[#7C5CFC] mb-5 shadow-xs">
              <Lock className="w-8 h-8" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7C5CFC]/10 text-[#7C5CFC] mb-3 border border-[#7C5CFC]/20">
              Authentication Required
            </span>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Super Admin Session Required
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Redirecting you to the secure SellDesk sign-in portal...
            </p>
            <div className="w-8 h-8 border-3 border-[#7C5CFC]/30 border-t-[#7C5CFC] rounded-full animate-spin" />
          </>
        ) : (
          <>
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-[#7C5CFC] shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="absolute -inset-1.5 rounded-3xl border border-[#7C5CFC]/20 animate-pulse pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#7C5CFC]/10 text-[#7C5CFC] mb-3 border border-[#7C5CFC]/20">
              <span className="w-2 h-2 rounded-full bg-[#7C5CFC] animate-ping" />
              <span>SellDesk Platform Security</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Verifying Admin Privileges
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs">
              Validating cryptographic credentials and role-based permissions...
            </p>

            <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-[#7C5CFC] via-[#A78BFA] to-[#7C5CFC] animate-pulse" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SuperAdminGuard;
