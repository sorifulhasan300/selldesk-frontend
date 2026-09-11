---
name: testing-convention-frontend
description: Standardized testing conventions for SellDesk frontend using Vitest, React Testing Library, and MSW/mocks. Defines what to test vs skip, feature-level integration test standards, TanStack Query testing, Zustand store mocking, user-event testing, and assertions. Use whenever writing, refactoring, or running frontend unit and integration tests.
---

# 🧪 Testing Convention Skill (SellDesk Frontend)

This skill governs the automated testing standards for **SellDesk Frontend** (`selldesk-frontend`). In a complex multi-tenant SaaS application, brittle tests that assert against CSS classes or internal React state waste time and block refactoring.

Our standard is **Feature-Level Integration Testing**: test how real users interact with the app, verify data isolation, and guarantee that critical business workflows (checkout, product creation, role guards) work flawlessly.

---

## 1. Test Scope Matrix (What to Test vs What to Skip)

| Category                                                       | Must Test? | Reason / What to Assert                                                                       |
| :------------------------------------------------------------- | :--------: | :-------------------------------------------------------------------------------------------- |
| **Feature Hooks** (`useCart`, `useProducts`)                   |  **YES**   | State mutations, TanStack Query triggers, tenant ID scoping, error states.                    |
| **Business Logic Components** (`ProductForm`, `CheckoutForm`)  |  **YES**   | Form submission, Zod validation errors, user interactions with `@testing-library/user-event`. |
| **Zod Schemas** (`product.schema.ts`, `checkout.schema.ts`)    |  **YES**   | Edge cases, required fields, phone number / UUID / price validation logic.                    |
| **Security & Route Guards** (`StoreGuard`, `RoleGuard`)        |  **YES**   | Proper blocking of unauthorized roles, redirection, rendering authorized children.            |
| **API Adapters & Interceptors** (`api-client.ts`)              |  **YES**   | Header injection (`x-store-id`, `Authorization`), 401/403 response interceptors.              |
| **Dumb UI Primitives** (`button.tsx`, `badge.tsx`, `card.tsx`) |   **NO**   | Raw shadcn / Radix primitives are already tested by their respective libraries.               |
| **Static Layouts & Styling**                                   |   **NO**   | Do not assert whether an element has `p-4`, `bg-blue-600`, or flex layout.                    |
| **Third-Party Libraries**                                      |   **NO**   | Do not test Lucide icons, Framer Motion transitions, or Tailwind CSS.                         |

---

## 2. Directory Structure & File Naming

Test files MUST be co-located within the relevant feature folder inside a `__tests__/` directory or alongside the target file:

```text
src/
├── features/
│   ├── products/
│   │   ├── components/
│   │   │   ├── ProductForm.tsx
│   │   │   └── __tests__/
│   │   │       └── ProductForm.spec.tsx     <-- Component Integration Test
│   │   ├── hooks/
│   │   │   ├── use-products.ts
│   │   │   └── __tests__/
│   │   │       └── use-products.spec.ts     <-- Hook Test
│   │   └── schemas/
│   │       ├── product.schema.ts
│   │       └── __tests__/
│   │           └── product.schema.spec.ts   <-- Zod Schema Test
│   └── ...
├── test/                                    <-- Global test utilities
│   ├── setup.ts                             <-- Jest-DOM matchers & mocks
│   └── test-utils.tsx                       <-- Custom renderWithProviders wrapper
└── vitest.config.ts
```

- **File extension:** Use `.spec.tsx` for React components/hooks and `.spec.ts` for schemas/utilities.

---

## 3. Global Test Wrapper (`test/test-utils.tsx`)

Every component test involving TanStack Query, Zustand, or routing must be rendered through `renderWithProviders`:

```typescript
// test/test-utils.tsx
import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry in tests to keep test runs fast
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren): React.JSX.Element {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }), queryClient };
}
```

---

## 4. Standard Mocking Patterns

### A. Mocking the API Client (`@/lib/api-client`)

Always mock API functions or the Axios instance cleanly:

```typescript
import { vi } from "vitest";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// In your test:
const mockGet = vi.mocked(apiClient.get);
mockGet.mockResolvedValueOnce({
  data: [{ id: "p-1", name: "Wireless Mouse", regularPrice: 1200 }],
});
```

### B. Mocking Next.js Navigation (`useRouter`, `useParams`)

```typescript
import { vi } from "vitest";

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({ storeId: "store-test-uuid-123", slug: "sample-product" }),
  useSearchParams: () => new URLSearchParams({ page: "1" }),
  usePathname: () => "/dashboard/products",
}));
```

### C. Mocking Zustand Stores (`useTenantStore`, `useAuthStore`)

Reset store states before each test in `beforeEach()`:

```typescript
import { useTenantStore } from "@/store/tenant.store";
import { useAuthStore } from "@/store/auth.store";

beforeEach(() => {
  vi.clearAllMocks();

  // Set predictable tenant context
  useTenantStore.setState({
    activeStoreId: "store-123",
    currentStore: {
      id: "store-123",
      storeName: "Demo Store",
      subDomain: "demo",
      currency: "BDT",
    } as any,
  });

  // Set predictable auth context
  useAuthStore.setState({
    user: {
      id: "user-1",
      email: "merchant@selldesk.com",
      role: "STORE_OWNER",
    } as any,
    accessToken: "mock-jwt-token",
  });
});
```

---

## 5. Three Standard Test Patterns

### Pattern 1: Testing a Custom Feature Hook (`renderHook`)

```typescript
// features/products/hooks/__tests__/use-products.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "../use-products";
import { fetchStoreProducts } from "../../api/products.api";
import { createTestQueryClient } from "@/test/test-utils";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

vi.mock("../../api/products.api");

describe("useProducts Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch products scoped to storeId", async () => {
    const mockProducts = [
      { id: "prod-1", name: "Sneakers", regularPrice: 2500 },
    ];
    vi.mocked(fetchStoreProducts).mockResolvedValueOnce(mockProducts as any);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useProducts("store-123"), { wrapper });

    // Assert initial loading
    expect(result.current.isLoading).toBe(true);

    // Wait for resolution
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockProducts);
    expect(fetchStoreProducts).toHaveBeenCalledWith("store-123", undefined);
  });
});
```

### Pattern 2: Testing Feature Component Integration (`userEvent`)

Always use `@testing-library/user-event` over `fireEvent` to simulate realistic user browser interactions:

```typescript
// features/products/components/__tests__/ProductForm.spec.tsx
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm } from "../ProductForm";
import { renderWithProviders } from "@/test/test-utils";

describe("ProductForm Component", () => {
  it("should show validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    renderWithProviders(<ProductForm onSubmit={mockSubmit} />);

    // Click submit without entering values
    const submitBtn = screen.getByRole("button", { name: /create product/i });
    await user.click(submitBtn);

    // Assert validation error messages appear
    expect(await screen.findByText(/product name is required/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("should submit valid product data", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    renderWithProviders(<ProductForm onSubmit={mockSubmit} />);

    // Fill form
    await user.type(screen.getByLabelText(/product name/i), "Premium Silk Shirt");
    await user.type(screen.getByLabelText(/regular price/i), "1500");
    await user.click(screen.getByRole("button", { name: /create product/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Premium Silk Shirt",
          regularPrice: 1500,
        })
      );
    });
  });
});
```

### Pattern 3: Testing Zod Validation Schemas

Schema tests run fast and ensure data payloads sent to the backend are strictly valid:

```typescript
// features/products/schemas/__tests__/product.schema.spec.ts
import { describe, it, expect } from "vitest";
import { createProductSchema } from "../product.schema";

describe("createProductSchema", () => {
  it("should pass on valid product payload", () => {
    const payload = {
      name: "Smartphone Case",
      regularPrice: 450,
      stockQuantity: 20,
    };

    const result = createProductSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("should fail when price is negative", () => {
    const payload = {
      name: "Smartphone Case",
      regularPrice: -50,
    };

    const result = createProductSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        "Price must be positive",
      );
    }
  });
});
```

---

## 6. Query Selector Hierarchy (Accessibility First)

When selecting DOM elements in tests, always prioritize user-accessible queries:

1. **`getByRole`** (e.g. `screen.getByRole('button', { name: /save/i })`, `screen.getByRole('heading', { level: 1 })`) — **PRIMARY CHOICE**
2. **`getByLabelText`** (for labeled form inputs)
3. **`getByPlaceholderText`** (for search or inputs with placeholders)
4. **`getByText`** (for static content, paragraphs, alerts)
5. **`getByTestId`** — **STRICTLY LAST RESORT** only for unlabelled, dynamic, or canvas elements (`data-testid="chart-container"`).

---

## 7. Testing Checklist

Before submitting code:

- [ ] **Run Test Suite:** All tests pass with `pnpm test` (or `vitest run`).
- [ ] **User-Event Used:** Interactive tests use `userEvent.setup()` instead of `fireEvent`.
- [ ] **No Cross-Test Leaks:** Mocked functions and Zustand stores are cleared in `beforeEach()`.
- [ ] **Accessibility Queries:** Elements are selected via `getByRole` or `getByLabelText`.
- [ ] **Async Waiters:** Async assertions use `await waitFor(() => ...)` or `await screen.findBy...`.
