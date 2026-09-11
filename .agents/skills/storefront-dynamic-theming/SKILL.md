---
name: storefront-dynamic-theming
description: Architecture, server-side CSS variable injection, dynamic branding, Tailwind v4 theme binding, and white-labeling rules for SellDesk multi-tenant storefronts. Use whenever implementing or styling storefront layouts, headers, buttons, footers, product cards, or custom merchant brand colors.
---

# 🎨 Storefront Dynamic Theming Skill (SellDesk Frontend)

In **SellDesk**, each merchant's storefront is a fully white-labeled e-commerce website. The backend `/storefront/init` API delivers custom merchant brand configurations:

- `color`: `{ primary: string, bg: string, text: string }`
- `font`: `{ family: string, size: string }`
- `header`: `{ logo, searchEnabled, cartEnabled, wishListEnabled }`
- `topbar`: `{ announcementText, showSocialLinks, phone }`
- `bottomNav`: `{ items: [{ label, icon, path }] }`
- `productCard`: `{ style, showAddToCart, showQuickView, showDiscountBadge }`
- `footer`: `{ copyright, socialLinks, columns }`

This skill provides the architecture to render dynamic merchant themes **without Flash of Unstyled Content (FOUC), hydration mismatch, or performance penalties**.

---

## 1. Zero-FOUC Server-Side CSS Variable Injection

> [!CAUTION]
> **Anti-Pattern: Client-Side Theme Switching**
> Never set merchant brand colors inside a `useEffect()` or client-side hook. Doing so causes an unstyled flash (FOUC) where the page renders default blue before snapping to the merchant's color, degrading user trust and Core Web Vitals.

### The Standard Server Layout Pattern (`app/(storefront)/layout.tsx`)

In Next.js Server Components, CSS Custom Properties (CSS variables) are injected directly onto the HTML structure during server rendering:

```typescript
// app/(storefront)/layout.tsx
import { headers } from "next/headers";
import { fetchStorefrontInit } from "@/services/tenant.service";
import { StorefrontHeader } from "@/components/layout/storefront-header";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { StorefrontBottomNav } from "@/components/layout/storefront-bottom-nav";
import { StorefrontProvider } from "@/features/stores/components/storefront-provider";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const host = headerList.get("x-tenant-host") || headerList.get("host") || "";

  const initData = await fetchStorefrontInit(host);
  const { config, business } = initData;

  // Dynamic CSS variables derived from merchant settings
  const dynamicThemeStyles: React.CSSProperties = {
    "--store-primary": config.color?.primary || "#2563eb",
    "--store-bg": config.color?.bg || "#ffffff",
    "--store-text": config.color?.text || "#1f2937",
    "--store-font": config.font?.family || "Inter, sans-serif",
  } as React.CSSProperties;

  return (
    <div
      id="storefront-root"
      style={dynamicThemeStyles}
      className="min-h-screen flex flex-col bg-[var(--store-bg)] text-[var(--store-text)] font-[family-name:var(--store-font)]"
    >
      <StorefrontProvider initialData={initData}>
        {/* Dynamic Topbar */}
        {config.topbar?.announcementText && (
          <div className="bg-[var(--store-primary)] text-white text-xs py-1.5 px-4 text-center font-medium">
            {config.topbar.announcementText}
          </div>
        )}

        {/* Dynamic Header */}
        <StorefrontHeader config={config.header} business={business} />

        {/* Main Storefront Content */}
        <main className="flex-1">{children}</main>

        {/* Dynamic Footer */}
        <StorefrontFooter config={config.footer} business={business} />

        {/* Mobile App-like Bottom Navigation */}
        <StorefrontBottomNav config={config.bottomNav} />
      </StorefrontProvider>
    </div>
  );
}
```

---

## 2. Tailwind v4 Dynamic Color Binding

In Tailwind CSS v4, bind CSS variables using arbitrary values or custom CSS utility classes:

### Reusable Tailwind Utility Classes (`src/styles/globals.css`)

```css
@layer utilities {
  .bg-store-primary {
    background-color: var(--store-primary);
  }
  .text-store-primary {
    color: var(--store-primary);
  }
  .border-store-primary {
    border-color: var(--store-primary);
  }
  .hover-bg-store-primary:hover {
    background-color: var(--store-primary);
    filter: brightness(0.92);
  }
}
```

### Clean Component Usage:

```typescript
// features/products/components/AddToCartButton.tsx
export const AddToCartButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 px-4 rounded-lg font-semibold text-white bg-store-primary hover-bg-store-primary transition-all duration-200 shadow-sm active:scale-[0.98]"
    >
      Add to Cart
    </button>
  );
};
```

---

## 3. Dynamic Font Loading Strategy

Merchants can configure Bangla and English fonts (`Inter`, `Hind Siliguri`, `Poppins`, `Roboto`).

### Font Preconnect Helper (`components/shared/StoreFontLoader.tsx`)

```typescript
export function StoreFontLoader({ fontFamily }: { fontFamily?: string }) {
  if (!fontFamily || fontFamily.includes("sans-serif")) return null;

  const fontName = fontFamily.split(",")[0].trim().replace(/['"]/g, "");
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontName
  )}:wght@400;500;600;700&display=swap`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={googleFontUrl} />
    </>
  );
}
```

---

## 4. Product Card Theme Adaptation

The storefront product card adapts to merchant preferences via `config.productCard`:

```typescript
// features/products/components/StorefrontProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Product } from "../types/product.types";
import { useTenant } from "@/hooks/use-tenant";

export const StorefrontProductCard = ({ product }: { product: Product }) => {
  const { config } = useTenant();
  const cardConfig = config.productCard;

  const isCompact = cardConfig?.style === "compact";
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.regularPrice);

  return (
    <div className="group relative rounded-xl border border-neutral-200 bg-white overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-neutral-50 overflow-hidden">
        <Image
          src={product.thumbnailUrl || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {cardConfig?.showDiscountBadge && hasDiscount && (
          <span className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            SAVE {Math.round(((product.regularPrice - product.discountPrice!) / product.regularPrice) * 100)}%
          </span>
        )}
      </Link>

      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-medium line-clamp-2 hover:text-store-primary transition-colors">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="font-bold text-base text-neutral-900">
              {product.discountPrice || product.regularPrice} BDT
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {product.regularPrice} BDT
              </span>
            )}
          </div>
        </div>

        {/* Optional Add To Cart on Card */}
        {cardConfig?.showAddToCart && (
          <button
            onClick={() => {/* add to cart logic */}}
            className="mt-3 w-full py-2 text-xs font-semibold rounded-md border border-store-primary text-store-primary hover:bg-store-primary hover:text-white transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};
```

---

## 5. White-Label Theming Checklist

- [ ] **No FOUC:** Theme variables (`--store-primary`, `--store-bg`, etc.) are injected in the server layout inline style, never in a client `useEffect`.
- [ ] **Tailwind Integration:** Colors use `bg-store-primary`, `text-store-primary`, or arbitrary CSS variables `bg-[var(--store-primary)]`.
- [ ] **Contrast Verification:** Text on primary colored buttons is readable (`#ffffff` or high-contrast dark).
- [ ] **Merchant Logo Fallback:** If `business.logo` is null or fails to load, fallback cleanly to `business.name` rendered in bold typography.
- [ ] **Favicon Dynamic Loading:** Root metadata dynamically points to merchant's custom favicon (`icons: { icon: business.favicon }`).
- [ ] **Mobile Bottom Bar:** Mobile bottom navigation renders `config.bottomNav.items` fixed at the bottom with safe area padding.
