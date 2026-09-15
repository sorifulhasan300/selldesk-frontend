/**
 * SellDesk Super Admin - Centralized Route & RBAC Configuration
 *
 * Defines the strongly typed navigation topology, allowed platform roles,
 * and authorization helper utilities for the SellDesk Super Admin Dashboard (/admin).
 */

export type Role =
  | "SUPER_ADMIN"
  | "SUPER_STAFF"
  | "STORE_OWNER"
  | "STORE_MANAGER"
  | "STORE_STAFF";

export type AdminRole = "SUPER_ADMIN" | "SUPER_STAFF";

export const PLATFORM_ADMIN_ROLES: readonly AdminRole[] = [
  "SUPER_ADMIN",
  "SUPER_STAFF",
] as const;

export const TENANT_STORE_ROLES: readonly Role[] = [
  "STORE_OWNER",
  "STORE_MANAGER",
  "STORE_STAFF",
] as const;

export type BadgeVariant =
  | "default"
  | "purple"
  | "success"
  | "warning"
  | "info";

export interface AdminRouteBadge {
  text: string;
  variant?: BadgeVariant;
}

export interface AdminRoute {
  title: string;
  href: string;
  icon: string;
  allowedRoles: readonly (Role | AdminRole | string)[];
  badge?: AdminRouteBadge | string;
  exactMatch?: boolean;
  description?: string;
  children?: AdminRoute[];
}

/**
 * Super Admin Navigation Registry
 *
 * Scoped by database roles:
 * - SUPER_ADMIN: Unrestricted access across platform management, stores, users, billing, settings.
 * - SUPER_STAFF: Platform operations & store directory access; billing and settings restricted.
 */
export const ADMIN_ROUTES: readonly AdminRoute[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: "LayoutDashboard",
    allowedRoles: ["SUPER_ADMIN", "SUPER_STAFF"],
    exactMatch: true,
    description: "Platform health, system metrics, and real-time activity",
  },
  {
    title: "Stores",
    href: "/admin/stores",
    icon: "Store",
    allowedRoles: ["SUPER_ADMIN", "SUPER_STAFF"],
    badge: {
      text: "Multi-Tenant",
      variant: "purple",
    },
    description: "Global store directory, provisioning, and tenant inspection",
  },
  {
    title: "Users & Staff",
    href: "/admin/users",
    icon: "Users",
    allowedRoles: ["SUPER_ADMIN"],
    description:
      "Platform administrators, staff credentials, and role assignments",
  },
  {
    title: "Billing & Plans",
    href: "/admin/billing",
    icon: "CreditCard",
    allowedRoles: ["SUPER_ADMIN"],
    badge: {
      text: "SaaS",
      variant: "success",
    },
    description:
      "Platform subscription packages, billing cycles, and SaaS revenue",
  },
  {
    title: "Platform Settings",
    href: "/admin/settings",
    icon: "Settings",
    allowedRoles: ["SUPER_ADMIN"],
    description:
      "System configurations, security controls, and integration keys",
  },
] as const;

/**
 * Returns true if the provided role is a recognized platform-level administrator
 */
export function isPlatformAdmin(role: string | null | undefined): boolean {
  if (!role) return false;
  const normalized = role.trim().toUpperCase();
  return (PLATFORM_ADMIN_ROLES as readonly string[]).includes(normalized);
}

/**
 * Returns true if the user possesses full Super Admin privileges
 */
export function isSuperAdmin(role: string | null | undefined): boolean {
  if (!role) return false;
  return role.trim().toUpperCase() === "SUPER_ADMIN";
}

/**
 * Dynamically filter the admin navigation items based on the active user role
 *
 * @param userRole - Role string from auth token or session
 * @returns Filtered array of admin route items accessible to this role
 */
export function getAccessibleRoutes(
  userRole: string | null | undefined,
): AdminRoute[] {
  if (!userRole) {
    return [];
  }

  const normalizedRole = userRole.trim().toUpperCase();

  return ADMIN_ROUTES.filter((route) => {
    return route.allowedRoles.some(
      (role) => role.toUpperCase() === normalizedRole,
    );
  }).map((route) => {
    if (route.children && route.children.length > 0) {
      return {
        ...route,
        children: route.children.filter((child) =>
          child.allowedRoles.some((r) => r.toUpperCase() === normalizedRole),
        ),
      };
    }
    return route;
  });
}

/**
 * Check whether a specific pathname is accessible by the specified role
 *
 * @param href - Path to evaluate (e.g. '/admin/billing')
 * @param userRole - Current user role
 */
export function isRouteAccessible(
  href: string,
  userRole: string | null | undefined,
): boolean {
  if (!userRole) return false;
  const normalizedRole = userRole.trim().toUpperCase();

  // Find exact or parent match
  const matchingRoute = ADMIN_ROUTES.find((route) => {
    if (route.exactMatch) {
      return route.href === href;
    }
    return href === route.href || href.startsWith(`${route.href}/`);
  });

  if (!matchingRoute) {
    // If not explicitly configured, fallback to standard platform admin check
    return isPlatformAdmin(userRole);
  }

  return matchingRoute.allowedRoles.some(
    (role) => role.toUpperCase() === normalizedRole,
  );
}

/**
 * Retrieve the allowed roles for a given admin pathname
 */
export function getAllowedRolesForRoute(href: string): readonly string[] {
  const matchingRoute = ADMIN_ROUTES.find((route) => {
    if (route.exactMatch) {
      return route.href === href;
    }
    return href === route.href || href.startsWith(`${route.href}/`);
  });

  return matchingRoute ? matchingRoute.allowedRoles : PLATFORM_ADMIN_ROLES;
}
