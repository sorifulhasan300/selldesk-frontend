---
name: clean-architecture-frontend
description: Enforces strict Clean Architecture, SOLID principles, Feature-First modularity, and zero-garbage code standards for Next.js 15, TypeScript, Tailwind, and React projects. Use when writing, refactoring, or reviewing frontend components, hooks, or API integrations.
---

# Clean Architecture Frontend Skill

This skill guides the AI agent in writing highly maintainable, scalable, type-safe, and production-ready frontend code following Clean Architecture and SOLID principles.

## Core Mandates

- **Zero Garbage Policy:** Never generate monolithic components, inline complex logic, unused code, or redundant re-renders.
- **Strict Layer Separation:** Presentation (UI), Business Logic (Hooks/Use Cases), and Infrastructure (API/Data Access) MUST be strictly decoupled.
- **Strict Type Safety:** Absolute prohibition of `any` types. All data flows must be typed with TypeScript interfaces or validated via Zod schemas.

---

## Decision Tree: Where Does the Code Belong?

Follow this decision flow before creating or modifying any file:

[Is it a raw visual component with no API/State logic?]
├── YES ──► Place in components/ui/ (Design System / Shadcn)
└── NO
│
├── [Is it specific to a business feature like Product or Order?]
│ ├── YES ──► Place inside features/[feature-name]/
│ │ ├── UI/JSX ──► features/[feature-name]/components/
│ │ ├── Logic ──► features/[feature-name]/hooks/
│ │ ├── API ──► features/[feature-name]/api/
│ │ └── Types ──► features/[feature-name]/types/
│ └── NO
│ │
│ ├── [Is it global app state or API client configuration?]
│ │ └── YES ──► Place in lib/ or store/
│ └── [Is it Next.js page routing structure?]
│ └── YES ──► Place in app/ (Routing only, minimal JSX)

---

## Architectural Rules & Best Practices

### 1. File & Component Constraints

- **Max File Length:** No file should exceed **150 lines of code**. If it exceeds, break it down into smaller sub-components or utility functions.
- **Single Responsibility (SRP):**
  - **Pages/Route Handlers (`app/`):** Route configuration, layout wrappers, and passing route params. No business logic or state!
  - **UI Components:** Rendering JSX and emitting events via callbacks (`onClick`, `onChange`).
  - **Custom Hooks:** All state management, side-effects (`useEffect`), and data transformations.

### 2. API & Data Management Rules

- **No Direct Fetching in UI:** Never use raw `fetch()` or `axios` directly inside a React UI component.
- **Use Centralized Client:** All HTTP requests must go through `@/lib/api-client` (Axios with Auth Interceptor).
- **TanStack Query (React Query):** Wrap API calls inside custom Query/Mutation hooks (e.g., `useProducts()`, `useCreateProduct()`).

### 3. Type Safety & Validation

- **Form & Payload Validation:** Always pair `react-hook-form` with `zod` for input validation.
- **Explicit Return Types:** Specify explicit return types for hooks, utilities, and API calls.

---

## Standard Code Patterns

### Pattern A: API Call (`features/products/api/products.api.ts`)

```typescript
import { apiClient } from "@/lib/api-client";
import { Product, CreateProductDTO } from "../types/product.types";

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>("/products");
  return data;
};

export const createProduct = async (payload: CreateProductDTO): Promise<Product> => {
  const { data } = await apiClient.post<Product>("/products", payload);
  return data;
};
Pattern B: Custom Hook (features/products/hooks/use-products.ts)
TypeScript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, createProduct } from "../api/products.api";
import { CreateProductDTO } from "../types/product.types";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductDTO) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
Pattern C: Clean UI Component (features/products/components/ProductList.tsx)
TypeScript
import { useProducts } from "../hooks/use-products";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductList = () => {
  const { data: products, isLoading, isError } = useProducts();

  if (isLoading) return <Skeleton className="h-40 w-full"/>;
  if (isError) return <div className="text-red-500">Failed to load products.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key="{product.id}" product="{product}"/>
      ))}
    </div>
  );
};

Anti-Patterns (STRICTLY FORBIDDEN)
❌ Forbidden: Writing useEffect to fetch data directly inside UI components.

❌ Forbidden: Using any type for variables, props, or API responses.

❌ Forbidden: Creating massive monolithic files (>150 lines) containing UI, Form logic, and API calls.

❌ Forbidden: Prop-drilling deeper than 2 levels (use Zustand or React Context instead).

❌ Forbidden: Leaving console.log, dead code, or unhandled promise rejections.
```
