---
name: rbac-and-permission-gating
description: Comprehensive Role-Based Access Control (RBAC), declarative permission gating, route guards, and 401 token refresh queue standards for SellDesk frontend. Use whenever managing user roles, restricting UI actions (buttons, modals), protecting dashboard routes, or handling authentication sessions.
---

# 🔐 RBAC & Permission Gating Skill (SellDesk Frontend)

In **SellDesk**, a single user account can have different roles across different tenant stores. For example, User A may be the **`STORE_OWNER`** of Store 1, but only a **`STORE_STAFF`** in Store 2.

Exposing sensitive actions (such as store deletion, staff management, or platform billing) to unauthorized staff members creates severe security and operational risks.

This skill establishes the **centralized capability-based permission architecture** for SellDesk.

---

## 1. Role Hierarchy & Domain Models

```
┌─────────────────────────────────────────────────────────────┐
│                 Platform Roles (Global)                     │
│        SUPER_ADMIN ──────────────► SUPER_STAFF              │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                Store Roles (Tenant Scoped)                  │
│       STORE_OWNER ──────► STORE_MANAGER ──────► STORE_STAFF │
└─────────────────────────────────────────────────────────────┘
```

### Store Role Capabilities:

- **`STORE_OWNER`**: Unrestricted authority over the store. Has access to billing plans, subscription upgrades, payout credentials, staff invites, and store deletion.
- **`STORE_MANAGER`**: Can create and modify products, manage orders, create coupons, and configure delivery charges. **Cannot** delete the store, modify platform billing, or alter owner roles.
- **`STORE_STAFF`**: Operational day-to-day access: view and update order statuses, view product stock. **Cannot** delete records, view merchant financial ledgers, or access store settings.

---

## 2. Centralized Permission Matrix (`src/lib/permissions.ts`)

> [!IMPORTANT]
> **The Golden Law of RBAC:** Never write inline string comparisons like `if (role === "STORE_OWNER")` inside UI components!
> Always check for **Capabilities / Actions** (e.g. `hasPermission(role, 'billing:manage')`).

```typescript
// src/lib/permissions.ts
export type StoreRole = "STORE_OWNER" | "STORE_MANAGER" | "STORE_STAFF";
export type PlatformRole = "SUPER_ADMIN" | "SUPER_STAFF";
export type UserRole = StoreRole | PlatformRole | "CUSTOMER";

export type PermissionAction =
  | "products:view"
  | "products:create"
  | "products:update"
  | "products:delete"
  | "orders:view"
  | "orders:update_status"
  | "orders:delete"
  | "staff:view"
  | "staff:manage"
  | "coupons:manage"
  | "delivery:manage"
  | "billing:manage"
  | "settings:manage"
  | "store:delete";

const ROLE_PERMISSIONS: Record<StoreRole, PermissionAction[]> = {
  STORE_OWNER: [
    "products:view",
    "products:create",
    "products:update",
    "products:delete",
    "orders:view",
    "orders:update_status",
    "orders:delete",
    "staff:view",
    "staff:manage",
    "coupons:manage",
    "delivery:manage",
    "billing:manage",
    "settings:manage",
    "store:delete",
  ],
  STORE_MANAGER: [
    "products:view",
    "products:create",
    "products:update",
    "orders:view",
    "orders:update_status",
    "staff:view",
    "coupons:manage",
    "delivery:manage",
  ],
  STORE_STAFF: ["products:view", "orders:view", "orders:update_status"],
};

export function hasPermission(
  role: UserRole | null | undefined,
  action: PermissionAction,
): boolean {
  if (!role) return false;

  // Super Admin has universal capability
  if (role === "SUPER_ADMIN") return true;

  const permissions = ROLE_PERMISSIONS[role as StoreRole];
  return permissions ? permissions.includes(action) : false;
}
```

---

## 3. Declarative UI Permission Gating (`<Can />`)

Use the declarative `<Can />` component to conditionally render UI controls without cluttering JSX with boolean logic:

```typescript
// features/auth/components/Can.tsx
"use client";

import React from "react";
import { PermissionAction, hasPermission } from "@/lib/permissions";
import { useAuthStore } from "@/store/auth.store";
import { useTenantStore } from "@/store/tenant.store";

interface CanProps {
  do: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ do: action, children, fallback = null }) => {
  // Read role in active store context
  const activeRole = useTenantStore((state) => state.currentUserRole);
  const platformRole = useAuthStore((state) => state.user?.role);

  const effectiveRole = platformRole === "SUPER_ADMIN" ? "SUPER_ADMIN" : activeRole;
  const isAllowed = hasPermission(effectiveRole, action);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
```

### Component Usage Example:

```typescript
// features/orders/components/OrderActions.tsx
import { Can } from "@/features/auth/components/Can";
import { Button } from "@/components/ui/button";

export const OrderActions = ({ orderId }: { orderId: string }) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline">Print Invoice</Button>

      {/* Only Owners can permanently delete an order */}
      <Can do="orders:delete">
        <Button variant="destructive" onClick={() => handleDelete(orderId)}>
          Delete Order
        </Button>
      </Can>
    </div>
  );
};
```

---

## 4. Route & Layout Guard Protection

Protect entire route sub-trees inside Next.js layout files using `RoleGuard`:

```typescript
// features/auth/components/role-guard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTenantStore } from "@/store/tenant.store";
import { StoreRole } from "@/lib/permissions";

interface RoleGuardProps {
  allow: StoreRole[];
  children: React.ReactNode;
  fallbackUrl?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allow,
  children,
  fallbackUrl = "/dashboard",
}) => {
  const router = useRouter();
  const currentRole = useTenantStore((state) => state.currentUserRole);
  const isReady = useTenantStore((state) => state.isInitialized);

  useEffect(() => {
    if (isReady && currentRole && !allow.includes(currentRole)) {
      router.replace(fallbackUrl);
    }
  }, [isReady, currentRole, allow, router, fallbackUrl]);

  if (!isReady || !currentRole || !allow.includes(currentRole)) {
    return null; // Don't flash unauthorized content
  }

  return <>{children}</>;
};
```

### Applying Guard in Sub-Layouts:

```typescript
// app/(dashboard)/dashboard/billing/layout.tsx
import { RoleGuard } from "@/features/auth/components/role-guard";

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  // Only the STORE_OWNER can access store billing & plan upgrades
  return (
    <RoleGuard allow={["STORE_OWNER"]}>
      {children}
    </RoleGuard>
  );
}
```

---

## 5. Token Lifecycle & 401 Refresh Queue

When a JWT access token expires during page usage, multiple parallel requests (products, orders, notifications) may fail with 401 at the same millisecond.

Without a **Refresh Queue**, the frontend fires 5 simultaneous refresh requests, corrupting refresh token rotation.

```typescript
// lib/api-client.ts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post(
          "/auth/refresh-token",
          {},
          {
            headers: { Authorization: undefined }, // Don't send expired token
          },
        );

        const newToken = data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = "/login?expired=1";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
```

---

## 6. RBAC Verification Checklist

- [ ] **Capability-Based:** All UI gates use `<Can do="..." />` instead of comparing role strings.
- [ ] **Sensitive Layouts Guarded:** `/dashboard/billing`, `/dashboard/settings`, and `/dashboard/staff` are wrapped in `<RoleGuard allow={['STORE_OWNER']}>`.
- [ ] **Store Role Isolation:** When switching stores, `currentUserRole` updates to match the user's role in the new store.
- [ ] **Refresh Queue Implemented:** 401 errors are queued during token refresh; no duplicate refresh calls.
- [ ] **Clean Fallbacks:** Unauthorized users see graceful redirects or disabled states, never broken pages.
