---
name: multi-tenant-data-isolation
description: Enforces strict multi-tenant security, server-side data isolation, dynamic x-store-id API header injection, zero client-side tenant filtering, and tenant-scoped TanStack Query cache partitioning for SellDesk frontend. Use whenever writing API requests, custom query hooks, Zustand stores, middleware, route handlers, or dashboard/storefront features.
---

# 🛡️ Multi-Tenant Security & Data Isolation Skill (SellDesk Frontend)

This skill is the single source of truth for **tenant isolation and security** across the SellDesk frontend (`selldesk-frontend`). In a multi-tenant SaaS platform, data isolation bugs are the **#1 critical vulnerability** (leading to cross-store data leaks, privacy violations, and security breaches).

Whenever you write or refactor code in SellDesk, you **MUST** strictly adhere to the rules, patterns, and invariants outlined below.

---

## 1. The Prime Law: Server-Enforced Isolation vs Zero Client-Side Filtering

> [!CAUTION]
> **ABSOLUTE PROHIBITION: NEVER USE CLIENT-SIDE FILTERING TO SEPARATE TENANT DATA.**
> Under NO circumstances may the frontend fetch a combined/unscoped dataset and filter by tenant or store ID in JavaScript:
>
> ```typescript
> // ❌ CATASTROPHIC BUG: NEVER DO THIS!
> const storeOrders = allOrders.filter(
>   (order) => order.storeId === currentStore.id,
> );
> const storeProducts = products.filter((p) => p.storeId === activeStoreId);
> ```

### Why This is Fatal:

1. **Severe Security Breach:** All raw data returned by an endpoint is exposed in the browser's Network tab (`DevTools`). A merchant or malicious user can open DevTools and view competitor revenues, customer addresses, phone numbers, and margins.
2. **Massive Over-fetching & Latency:** As thousands of tenants join the platform, returning cross-tenant records crashes the browser and destroys performance.
3. **Compliance & Legal Liability:** Violates privacy laws (GDPR, merchant confidentiality).

### The Golden Rule:

- **Every tenant-scoped query MUST be filtered at the database level** (backend Prisma `$extends` query filter and `TenantGuard`).
- The frontend's responsibility is **always and only** to provide the validated `storeId` / tenant context to the backend via headers (`x-store-id`) or path parameters.
- If an endpoint returns data belonging to other stores, **that is a critical backend vulnerability**; the frontend must NEVER mask it with a client-side filter.

---

## 2. Tri-Surface Context Matrix

SellDesk operates across three distinct surfaces. Each has a strict tenant identity contract:

| Surface             | URL / Path                                                                     | How Tenant Identity is Resolved                                               | Auth Requirement                                               | Headers Required                                            |
| :------------------ | :----------------------------------------------------------------------------- | :---------------------------------------------------------------------------- | :------------------------------------------------------------- | :---------------------------------------------------------- |
| **Storefront**      | `(storefront)` — domain-based (`subdomain.selldesk.com` or `customdomain.com`) | `middleware.ts` extracts `host` -> Backend resolves via `StoreDomainResolver` | Public (or customer account)                                   | `x-store-id` (injected from domain resolution or bootstrap) |
| **Store Dashboard** | `(dashboard)/dashboard/*`                                                      | Active merchant session + selected store in Zustand (`tenant.store.ts`)       | Merchant Auth (Owner, Manager, Staff) validated by `UserStore` | `x-store-id: <storeId>` + `Authorization: Bearer <token>`   |
| **Central Admin**   | `(admin)/admin/*`                                                              | Explicit route parameter: `/admin/stores/[storeId]/*`                         | Super Admin / Super Staff only                                 | Target `x-store-id` or route parameter                      |

---

## 3. Dynamic API Header Enforcement (`x-store-id`)

The NestJS backend enforces tenant context using `TenantGuard` and `@Headers('x-store-id')`. The frontend HTTP client MUST guarantee that every tenant-bound request carries the validated store identifier.

### Centralized Axios Interceptor (`lib/api-client.ts`)

```typescript
import axios, { InternalAxiosRequestConfig } from "axios";
import { useTenantStore } from "@/store/tenant.store";
import { useAuthStore } from "@/store/auth.store";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Injects Auth & Active Store Context
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. In-flight Token Injection
    const token = useAuthStore.getState().accessToken;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Multi-tenant Header Injection
    // Check if storeId was explicitly provided in config
    const explicitStoreId = config.headers["x-store-id"];

    if (!explicitStoreId) {
      const activeStoreId = useTenantStore.getState().activeStoreId;
      if (activeStoreId) {
        config.headers["x-store-id"] = activeStoreId;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Catch 403 Tenant Denials
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      const msg = error.response.data?.message || "";
      if (msg.includes("store context") || msg.includes("Access denied")) {
        console.error("[SECURITY] Access denied for store context:", msg);
        // Do not display raw other-tenant data; gracefully redirect or notify
      }
    }
    return Promise.reject(error);
  },
);
```

### Fail-Fast Guard for Tenant-Scoped Calls

When executing tenant-scoped operations, **never execute requests with an empty or undefined `storeId`**:

```typescript
// features/products/api/products.api.ts
import { apiClient } from "@/lib/api-client";
import { Product } from "../types/product.types";

export const fetchStoreProducts = async (
  storeId: string,
): Promise<Product[]> => {
  if (!storeId) {
    throw new Error(
      "[SECURITY ERROR] Cannot fetch products: storeId is missing from context.",
    );
  }

  const { data } = await apiClient.get<Product[]>("/products", {
    headers: { "x-store-id": storeId },
  });
  return data;
};
```

---

## 4. TanStack Query: Tenant-Scoped Cache Partitioning

> [!IMPORTANT]
> **CRITICAL BUG VECTOR: Cross-Tenant Cache Contamination**
> TanStack Query caches responses in memory by `queryKey`. If your query key is generic (e.g. `['products']`), switching stores or switching storefronts will instantly display Store A's cached products inside Store B!

### Query Key Hierarchy Rule:

Every tenant-scoped query key **MUST ALWAYS** include the `storeId`:

```typescript
// ❌ DANGEROUS: Stale cross-tenant cache leak!
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

// ✅ SAFE: Partitioned by storeId!
export const useProducts = (storeId: string, filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["store", storeId, "products", filters],
    queryFn: () => fetchStoreProducts(storeId, filters),
    enabled: Boolean(storeId), // Prevents query from running before store is resolved
  });
};
```

### Complete Store-Switch Cache Purge

When a merchant switches their active store in the dashboard header/dropdown, all previous tenant queries must be purged to prevent any residual leak:

```typescript
// features/stores/hooks/use-switch-store.ts
import { useQueryClient } from "@tanstack/react-query";
import { useTenantStore } from "@/store/tenant.store";

export const useSwitchStore = () => {
  const queryClient = useQueryClient();
  const setActiveStoreId = useTenantStore((state) => state.setActiveStoreId);

  const switchStore = (newStoreId: string) => {
    // 1. Remove all cached queries for the previous store
    queryClient.removeQueries({ queryKey: ["store"] });

    // 2. Set new active store context
    setActiveStoreId(newStoreId);
  };

  return { switchStore };
};
```

---

## 5. Next.js Middleware & Domain Resolution

Next.js `middleware.ts` runs on the edge before any route renders. It is the gatekeeper that identifies the tenant domain and rewrites to the storefront route group:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host")?.toLowerCase() || "";
  const baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "selldesk.com";

  // 1. Skip static assets, internal Next.js files, and API
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Central Platform Admin Surface
  if (host.startsWith("admin.") || url.pathname.startsWith("/admin")) {
    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, req.url));
  }

  // 3. Store Dashboard Surface
  if (host.startsWith("app.") || url.pathname.startsWith("/dashboard")) {
    return NextResponse.rewrite(new URL(`/dashboard${url.pathname}`, req.url));
  }

  // 4. Marketing Landing Surface (selldesk.com or www.selldesk.com)
  if (
    host === baseDomain ||
    host === `www.${baseDomain}` ||
    host === "localhost:3000"
  ) {
    if (url.pathname === "/") {
      return NextResponse.next(); // Public landing
    }
  }

  // 5. Storefront Surface: Domain / Subdomain Resolved
  // Pass host and resolve in storefront layout
  const response = NextResponse.rewrite(
    new URL(`/(storefront)${url.pathname}`, req.url),
  );
  response.headers.set("x-tenant-host", host);
  return response;
}
```

---

## 6. Server Components vs Client Components Isolation

### Server Components (`app/(storefront)/...`)

In Server Components, read the tenant host or context from headers and fetch the verified bootstrap data server-side:

```typescript
// app/(storefront)/layout.tsx
import { headers } from "next/headers";
import { fetchStorefrontInit } from "@/services/tenant.service";
import { StorefrontProvider } from "@/features/stores/components/storefront-provider";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const host = headerList.get("x-tenant-host") || headerList.get("host") || "";

  // Call backend /storefront/init with Host header
  const initData = await fetchStorefrontInit(host);

  return (
    <StorefrontProvider initialData={initData}>
      {children}
    </StorefrontProvider>
  );
}
```

### Client Components (`features/*`)

In Client Components, access tenant data through the validated `useTenant()` hook. Never read or trust unverified query params or raw `localStorage` for security decisions:

```typescript
"use client";

import { useTenant } from "@/hooks/use-tenant";

export const CartSummary = () => {
  const { store, storeId } = useTenant();

  if (!storeId) return null;

  return <div>Store: {store.name} ({store.currency})</div>;
};
```

---

## 7. Multi-Tenant Verification Checklist

Before opening a PR or merging any frontend code, verify each item:

- [ ] **No Client-side Filtering:** No `.filter(item => item.storeId === ...)` exists in hooks, components, or services.
- [ ] **Header Injection:** All tenant-scoped requests carry `x-store-id` via the Axios interceptor or explicit parameter.
- [ ] **Cache Partitioning:** Every TanStack Query key for tenant data begins with `['store', storeId, ...]`.
- [ ] **Disabled when Store Unknown:** `enabled: Boolean(storeId)` is set on all tenant query hooks.
- [ ] **Store Switch Invalidation:** Switching active stores clears previous store queries (`queryClient.removeQueries({ queryKey: ['store'] })`).
- [ ] **Anti-Spoofing Alignment:** Host domain and store context match; no mismatched hardcoded UUIDs in production.
