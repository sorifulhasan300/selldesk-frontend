---
name: clean-architecture-frontend
description: Enforces strict Clean Architecture, SOLID principles, Feature-First modularity, multi-tenant route-group structure, reusable DataTable standards, debounced search (useDebounce), and zero-garbage code standards for Next.js 15, TypeScript, Tailwind, and React projects (SellDesk). Use when writing, refactoring, or reviewing frontend components, hooks, routes, middleware, or API integrations.
---

# Clean Architecture Frontend Skill (SellDesk)

This skill guides the AI agent in writing highly maintainable, scalable, type-safe, production-ready frontend code for **SellDesk** — a multi-tenant SaaS platform with three surfaces: **central admin**, **store dashboard** (owner/manager/staff), and **domain-resolved storefront**. It follows Clean Architecture and SOLID principles.

## Core Mandates

- **Zero Garbage Policy:** Never generate monolithic components, inline complex logic, unused code, or redundant re-renders.
- **Strict Layer Separation:** Presentation (UI), Business Logic (Hooks), Infrastructure (API/Data Access), and Routing (`app/`) MUST be strictly decoupled.
- **Strict Type Safety:** Absolute prohibition of `any` types. All data flows must be typed with TypeScript interfaces or validated via Zod schemas.
- **Surface Awareness:** Every file belongs to exactly one surface context — `admin`, `dashboard`, `storefront`, or `shared` (cross-surface). Never mix surface-specific logic into a shared file, and never let one surface import another surface's route-level code.
- **Mandatory Reusable DataTable:** Any tabular data presentation across dashboard or admin surfaces MUST use the shared `@/components/ui/DataTable` component. Writing ad-hoc `<table>` markup is strictly forbidden.
- **Mandatory Debounced Search:** All search inputs filtering tables or driving queries MUST use the project's `@/hooks/use-debounce` hook. Never fire live requests on raw keystrokes without debouncing.

---

## Project-Level Folder Architecture (authoritative — always follow this)

```
src/
├── app/
│   ├── (marketing)/                 # selldesk.com public landing/pricing
│   ├── (auth)/                      # shared login/register for all surfaces
│   ├── (admin)/admin/               # central SellDesk admin — platform-wide
│   │   ├── layout.tsx               # AdminGuard
│   │   ├── stores/[storeId]/        # dynamic route = one tenant store
│   │   ├── billing/                 # SellDesk's own platform billing
│   │   ├── users/                   # SellDesk internal staff
│   │   └── settings/                # platform-level config
│   ├── (dashboard)/dashboard/       # store owner/manager/staff panel
│   │   ├── layout.tsx               # StoreGuard + RoleGuard (owner/manager/staff)
│   │   ├── products/ orders/ staff/ analytics/ billing/ settings/
│   ├── (storefront)/                # public store, NO url prefix — domain-resolved
│   │   ├── layout.tsx               # tenant theme/logo injected here
│   │   ├── page.tsx                 # store homepage
│   │   ├── products/[slug]/
│   │   ├── cart/ checkout/
│   └── layout.tsx                   # root layout
│
├── middleware.ts                    # ⭐ tenant resolution — reads Host header,
│                                     #   rewrites to (admin)/(dashboard)/(storefront),
│                                     #   sets x-tenant-id for storefront requests
│
├── features/                        # ⭐ feature-first vertical slices
│   └── <feature-name>/
│       ├── components/              # JSX only, emits events via callbacks
│       ├── hooks/                   # state, side-effects, TanStack Query wrappers
│       ├── api/                     # HTTP calls via lib/api-client, this feature only
│       ├── schemas/                 # zod validation
│       ├── types/
│       └── index.ts                 # barrel — only export what other layers need
│
├── components/
│   ├── ui/                          # design primitives & reusable widgets (DataTable, button, skeleton)
│   ├── layout/                      # admin-sidebar, dashboard-sidebar, storefront-header
│   └── common/                      # shared common UI composites (Logo, etc.)
│
├── lib/
│   ├── api-client.ts                # single Axios instance + auth interceptor
│   ├── auth.ts                      # session/token helpers
│   ├── tenant.ts                    # resolveTenantFromHost(), tenant cache
│   ├── permissions.ts               # RBAC rules: owner/manager/staff
│   └── utils.ts
│
├── services/                        # cross-feature / app-wide services ONLY
│                                     # (nothing feature-specific belongs here —
│                                     #  feature-specific HTTP calls go in
│                                     #  features/<name>/api/ instead)
│
├── store/                           # Zustand — global client state only
│   ├── auth.store.ts
│   └── tenant.store.ts
│
├── hooks/                           # cross-feature reusable hooks (use-debounce, use-auth, use-role-guard)
├── types/                           # global/shared types only
├── config/                          # site config, env schema, constants
└── styles/
    └── globals.css
```

### Why this shape (for the agent's own reasoning, not to repeat to the user)

- `()` route groups (`(admin)`, `(dashboard)`, `(storefront)`) organize surfaces without polluting the URL; only `(storefront)` has NO extra path segment because it is resolved purely by domain via middleware.
- `[storeId]`, `[slug]` are dynamic segments — one file serves many records.
- A dedicated Express/Node backend is assumed for SellDesk: `app/api/` is **skipped entirely** except a NextAuth route if NextAuth is used. Do not generate `app/api/*` route handlers for business logic — always call the external backend through `lib/api-client.ts`.

---

## Decision Tree: Where Does the Code Belong?

```
[Is it Next.js routing — a page, layout, or route group?]
├── YES ──► app/(admin|dashboard|storefront|auth|marketing)/...
│           Route configuration, layout wrappers, passing route params ONLY.
│           No business logic, no direct data fetching, minimal JSX.
└── NO
    │
    ├── [Does it resolve tenant/domain or run on every request?]
    │    └── YES ──► middleware.ts (routing logic) + lib/tenant.ts (resolution logic)
    │
    ├── [Is it a raw visual component with no API/state logic?]
    │    └── YES ──► components/ui/ (design system) or components/layout/ (surface shells)
    │
    ├── [Is it specific to one business feature — Product, Order, Staff, Store, Billing?]
    │    └── YES ──► features/[feature-name]/
    │                 ├── UI/JSX  ──► features/[feature-name]/components/
    │                 ├── Logic   ──► features/[feature-name]/hooks/
    │                 ├── API     ──► features/[feature-name]/api/
    │                 ├── Schema  ──► features/[feature-name]/schemas/
    │                 └── Types   ──► features/[feature-name]/types/
    │
    ├── [Is it global app state (auth session, current tenant)?]
    │    └── YES ──► store/ (Zustand)
    │
    ├── [Is it a service used by MULTIPLE features or by middleware/layouts,
    │     not owned by any single feature — e.g. tenant lookup, api client config?]
    │    └── YES ──► lib/ (infra/config) or services/ (cross-feature orchestration)
    │
    └── [Is it a cross-feature reusable hook — useAuth, useRoleGuard?]
         └── YES ──► hooks/
```

---

## Architectural Rules & Best Practices

### 1. File & Component Constraints

- **Max File Length:** No file should exceed **150 lines of code**. If it exceeds, break it down into smaller sub-components or utility functions.
- **Single Responsibility (SRP):**
  - **`app/**` (Pages/Layouts):\*\* Route configuration, layout wrappers, passing route params. No business logic or state!
  - **UI Components:** Rendering JSX and emitting events via callbacks (`onClick`, `onChange`).
  - **Custom Hooks:** All state management, side-effects (`useEffect`), and data transformations.

### 2. Surface & Role Boundaries

- **`(admin)` code never imports from `(dashboard)` or `(storefront)` route folders, and vice versa.** Shared logic must live in `features/`, `components/`, or `lib/` — never cross-import between route groups.
- Every `(admin)` and `(dashboard)` layout must wrap children in the relevant guard (`AdminGuard`, `StoreGuard`, `RoleGuard`) — never check role/permission inline inside a page component.
- Role checks always go through `lib/permissions.ts` — never hardcode `role === "owner"` comparisons inside components.

### 3. API & Data Management Rules

- **No Direct Fetching in UI:** Never use raw `fetch()` or `axios` directly inside a React UI component.
- **Use Centralized Client:** All HTTP requests must go through `@/lib/api-client` (Axios with Auth Interceptor), targeting the dedicated backend — not `app/api/*`.
- **Feature-owned API calls live in `features/<name>/api/`.** Only tenant/session/cross-cutting calls go in `services/`.
- **TanStack Query (React Query):** Wrap API calls inside custom Query/Mutation hooks (e.g., `useProducts()`, `useCreateProduct()`).

### 4. Type Safety & Validation

- **Form & Payload Validation:** Always pair `react-hook-form` with `zod` for input validation.
- **Explicit Return Types:** Specify explicit return types for hooks, utilities, and API calls.

### 5. Table & Search Standards (Dashboard & Admin)

- **Mandatory Reusable DataTable (`@/components/ui/DataTable`):**
  - Whenever implementing list or tabular views in the store dashboard or central admin (e.g., products, orders, customers, inventory, staff, stores), **always** use the reusable `DataTable` component located at `@/components/ui/DataTable`.
  - Creating custom, ad-hoc `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>` markup for feature data displays is **strictly forbidden**.
  - Column definitions must be strictly typed using `ColumnDef<TData, TValue>` from `@/components/ui/DataTable`.
  - Always extract column definitions into a dedicated `<feature>-columns.tsx` file (e.g., `features/products/components/product-columns.tsx`) to maintain separation of concerns and stay well under the 150-line file limit.
  - Wire standard props cleanly:
    - `data`: Typed array of domain records (`TData[]`).
    - `columns`: Array of `ColumnDef<TData, unknown>[]`.
    - `keyExtractor`: Function returning a unique row identifier string (e.g., `(row) => row.id`).
    - `isLoading`: Boolean loading state from TanStack Query.
    - `loadingRowsCount`: Expected skeleton row count (defaults to page size / limit, e.g. 6 or 10).
    - `emptyMessage`: Clear, context-aware message or UI node when no records match.
    - Sorting props (`sortBy`, `sortOrder`, `onSortChange`) and row selection (`enableRowSelection`, `selectedRowIds`, `onSelectRow`, `onSelectAll`) when required.

- **Mandatory Debounced Search with `useDebounce` (`@/hooks/use-debounce`):**
  - Every search bar, filter input, or query input driving table data or syncing with URL search params MUST use the project's `@/hooks/use-debounce` hook.
  - Maintain local state for the immediate input (`searchInput`) for a lag-free typing experience, while passing the debounced value (`debouncedSearch`, recommended 300ms–400ms delay) to the query hook or URL params.
  - Use the returned `flush(immediateValue)` callback to immediately trigger searches upon pressing `Enter` or clicking an explicit search icon/button.
  - Use the returned `isPending` / `isDebouncing` flag to render search activity spinners or indicators in the UI toolbar.
  - Never fire API requests, TanStack Query key updates, or router navigation directly inside raw `onChange` keystroke events.
  - Never implement custom `setTimeout` debounce logic inside components or install redundant third-party debounce packages.

---

## Standard Code Patterns

### Pattern A: API Call (`features/products/api/products.api.ts`)

```typescript
import { apiClient } from "@/lib/api-client";
import { Product, CreateProductDTO } from "../types/product.types";

export const fetchProducts = async (storeId: string): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>("/products", {
    headers: { "x-store-id": storeId },
  });
  return data;
};

export const createProduct = async (
  storeId: string,
  payload: CreateProductDTO,
): Promise<Product> => {
  const { data } = await apiClient.post<Product>("/products", payload, {
    headers: { "x-store-id": storeId },
  });
  return data;
};
```

### Pattern B: Custom Hook (`features/products/hooks/use-products.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, createProduct } from "../api/products.api";
import { CreateProductDTO } from "../types/product.types";

export const useProducts = (storeId: string) => {
  return useQuery({
    queryKey: ["store", storeId, "products"],
    queryFn: () => fetchProducts(storeId),
    enabled: Boolean(storeId), // Never run query without valid tenant context
  });
};

export const useCreateProduct = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductDTO) => createProduct(storeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["store", storeId, "products"],
      });
    },
  });
};
```

### Pattern C: Clean UI Component (`features/products/components/ProductList.tsx`)

```typescript
import { useProducts } from "../hooks/use-products";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductList = () => {
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (isError) return <div className="text-red-500">Failed to load products.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Pattern D: Tenant Resolution (`middleware.ts` + `lib/tenant.ts`)

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveTenantFromHost } from "@/lib/tenant";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  if (host.startsWith("admin.")) {
    return NextResponse.rewrite(
      new URL(`/admin${req.nextUrl.pathname}`, req.url),
    );
  }

  if (host.startsWith("app.")) {
    return NextResponse.rewrite(
      new URL(`/dashboard${req.nextUrl.pathname}`, req.url),
    );
  }

  const tenant = resolveTenantFromHost(host);
  const res = NextResponse.rewrite(new URL(req.nextUrl.pathname, req.url));
  res.headers.set("x-tenant-id", tenant.id);
  return res;
}
```

### Pattern E: Route Guard in a Layout (`app/(dashboard)/dashboard/layout.tsx`)

```typescript
import { StoreGuard } from "@/features/auth/components/store-guard";
import { RoleGuard } from "@/features/auth/components/role-guard";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreGuard>
      <RoleGuard allow={["owner", "manager", "staff"]}>
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </RoleGuard>
    </StoreGuard>
  );
}
```

### Pattern F: Reusable DataTable with Debounced Search (`features/products/...`)

#### 1. Typed Column Definitions (`features/products/components/product-columns.tsx`)

```typescript
import type { ColumnDef } from "@/components/ui/DataTable";
import type { Product } from "../types/product.types";

export const productColumns: ColumnDef<Product>[] = [
  {
    id: "name",
    header: "Product",
    accessorKey: "name",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-medium text-admin-text">{row.name}</span>
    ),
  },
  {
    id: "price",
    header: "Price",
    accessorFn: (row) => `$${row.price.toFixed(2)}`,
    enableSorting: true,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="text-xs px-2 py-0.5 rounded-full bg-admin-brand-soft text-admin-brand">
        {row.status}
      </span>
    ),
  },
];
```

#### 2. Feature Hook with Debounced Search (`features/products/hooks/use-products-table.ts`)

```typescript
import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useProducts } from "./use-products";

export function useProductsTable(storeId: string) {
  const [searchInput, setSearchInput] = useState("");

  // Mandatory: useDebounce hook with 400ms delay and instant flush
  const [debouncedSearch, flushSearch, isDebouncing] = useDebounce(
    searchInput,
    400,
  );

  const { data, isLoading, refetch } = useProducts(storeId, {
    search: debouncedSearch,
  });

  const handleImmediateSearch = useCallback(() => {
    flushSearch(searchInput);
  }, [flushSearch, searchInput]);

  return {
    products: data?.items ?? [],
    isLoading,
    searchInput,
    setSearchInput,
    isDebouncing,
    handleImmediateSearch,
    refetch,
  };
}
```

#### 3. Table UI Component (`features/products/components/ProductsTable.tsx`)

```typescript
import { DataTable } from "@/components/ui/DataTable";
import { productColumns } from "./product-columns";
import { useProductsTable } from "../hooks/use-products-table";

export function ProductsTable({ storeId }: { storeId: string }) {
  const {
    products,
    isLoading,
    searchInput,
    setSearchInput,
    isDebouncing,
    handleImmediateSearch,
  } = useProductsTable(storeId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleImmediateSearch()}
          placeholder="Search products..."
          className="px-3 py-2 border border-admin-line rounded-lg text-sm"
        />
        {isDebouncing && (
          <span className="text-xs text-admin-text-soft">Searching...</span>
        )}
      </div>

      {/* Mandatory reusable DataTable */}
      <DataTable
        data={products}
        columns={productColumns}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        loadingRowsCount={6}
        emptyMessage="No products found."
      />
    </div>
  );
}
```

---

## Anti-Patterns (STRICTLY FORBIDDEN)

- ❌ Writing `useEffect` to fetch data directly inside UI components.
- ❌ Using `any` type for variables, props, or API responses.
- ❌ Creating massive monolithic files (>150 lines) containing UI, form logic, and API calls.
- ❌ Prop-drilling deeper than 2 levels (use Zustand or React Context instead).
- ❌ Leaving `console.log`, dead code, or unhandled promise rejections.
- ❌ Placing business-logic route handlers in `app/api/*` when a dedicated backend exists.
- ❌ Cross-importing between `(admin)`, `(dashboard)`, and `(storefront)` route folders.
- ❌ Checking `role`/`permission` inline in a page instead of via `lib/permissions.ts` + guard components.
- ❌ Putting a feature-specific API call in `services/` instead of `features/<name>/api/`.
- ❌ Filtering tenant data client-side (`data.filter(i => i.storeId === currentStore.id)`) — ALWAYS enforce at database & API boundary!
- ❌ Using unpartitioned TanStack Query keys (e.g., `['products']` instead of `['store', storeId, 'products']`).
- ❌ Re-inventing custom HTML `<table>` markup in dashboard or admin views instead of using `@/components/ui/DataTable`.
- ❌ Firing API queries or router navigation directly on raw search input keystrokes without using `@/hooks/use-debounce`.
- ❌ Writing custom inline `setTimeout` or importing external debounce utilities instead of using `@/hooks/use-debounce`.
- ❌ Inlining massive column definitions inside table JSX instead of extracting to a `<feature>-columns.tsx` file.

---

## Companion Frontend Skills

Refer to these specialized SellDesk frontend skills for in-depth execution guidelines:

- **`multi-tenant-data-isolation`**: Strict server-side data isolation, `x-store-id` injection, and cache partitioning.
- **`storefront-seo-performance`**: Dynamic metadata, OpenGraph, JSON-LD schemas, ISR/SSG, and `next/image` optimization.
- **`storefront-cart-checkout-workflow`**: LocalStorage cart isolation, dynamic delivery charge calculation, coupons, and idempotent order submission.
- **`storefront-dynamic-theming`**: Zero-FOUC server-side CSS variable injection, Tailwind v4 binding, and merchant white-labeling.
- **`rbac-and-permission-gating`**: Capability-based `<Can do="..." />`, layout `RoleGuard`, and 401 token refresh queue.
- **`form-and-validation-standard`**: React Hook Form + Zod v4, memoized `useFieldArray` variant rows, and NestJS error mapping.
- **`testing-convention-frontend`**: Vitest and React Testing Library standards for feature-level tests, hooks, and schemas.
- **`git-commit-pr-convention`**: Conventional Commits 1.0, SellDesk domain scopes, branch naming, and PR checklists.
