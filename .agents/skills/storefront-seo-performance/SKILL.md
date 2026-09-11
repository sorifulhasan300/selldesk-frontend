---
name: storefront-seo-performance
description: Comprehensive guide and standards for public storefront SEO, dynamic metadata generation, JSON-LD structured data, Next.js 15/16 ISR/SSG rendering strategies, media & image optimization, and Core Web Vitals in SellDesk. Use whenever building storefront pages, products, categories, layouts, or SEO utilities.
---

# 🚀 Storefront SEO & Performance Skill (SellDesk Frontend)

The **Storefront** (`src/app/(storefront)`) is the customer-facing revenue engine for every merchant on **SellDesk**. Unlike the private dashboard, every storefront page must compete in search engines (Google, Bing), render rich cards on social media (Facebook, WhatsApp, Twitter/X), and load in under 2 seconds on mobile 4G connections.

**If the storefront has poor SEO or high latency, merchants lose ranking, traffic, and sales.**

This skill establishes the non-negotiable SEO and performance standards for SellDesk storefront development.

---

## 1. Dynamic Metadata Generation (`generateMetadata`)

In Next.js App Router, every public route must export a dynamic `generateMetadata` function. Static or placeholder titles (`"My Store"`) are strictly prohibited on dynamic pages.

### Pattern 1: Storefront Root (`app/(storefront)/page.tsx`)

```typescript
import type { Metadata } from "next";
import { headers } from "next/headers";
import { fetchStorefrontInit } from "@/services/tenant.service";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-tenant-host") || headerList.get("host") || "";

  const initData = await fetchStorefrontInit(host);
  const { business, config } = initData;

  const storeUrl = `https://${business.domain}`;
  const title = `${business.name} | Official Online Store`;
  const description =
    config.page?.about?.content?.replace(/<[^>]*>?/gm, "").slice(0, 160) ||
    `Shop premium products online at ${business.name}. Fast delivery, cash on delivery, and best prices.`;
  const ogImage = business.logo || "/default-og.png";

  return {
    title,
    description,
    metadataBase: new URL(storeUrl),
    alternates: {
      canonical: storeUrl,
    },
    openGraph: {
      title,
      description,
      url: storeUrl,
      siteName: business.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: business.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: business.favicon || "/favicon.ico",
      shortcut: business.favicon || "/favicon.ico",
      apple: business.logo || "/apple-touch-icon.png",
    },
  };
}
```

### Pattern 2: Product Details Page (`app/(storefront)/products/[slug]/page.tsx`)

```typescript
import type { Metadata } from "next";
import { headers } from "next/headers";
import { fetchStorefrontProductBySlug } from "@/features/products/api/products.api";
import { fetchStorefrontInit } from "@/services/tenant.service";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const headerList = await headers();
  const host = headerList.get("x-tenant-host") || headerList.get("host") || "";

  const [product, initData] = await Promise.all([
    fetchStorefrontProductBySlug(host, slug).catch(() => null),
    fetchStorefrontInit(host),
  ]);

  if (!product) return { title: "Product Not Found" };

  const storeName = initData.business.name;
  const title = `${product.name} - Best Price Online | ${storeName}`;
  const description =
    product.shortDescription ||
    `${product.name} available at ${storeName}. Order now for fast delivery in ${initData.business.currency}.`;

  const canonicalUrl = `https://${initData.business.domain}/products/${slug}`;
  const mainImage =
    product.thumbnailUrl || product.images?.[0]?.url || "/default-product.png";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: storeName,
      type: "article",
      images: [
        {
          url: mainImage,
          width: 1000,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [mainImage],
    },
  };
}
```

---

## 2. Structured Data (JSON-LD E-commerce Schemas)

Search engines require structured data to display Google Rich Results (pricing, stock availability, star ratings).

### JSON-LD Helper Component (`components/shared/JsonLd.tsx`)

```typescript
import React from "react";

export function JsonLd({ schema }: { schema: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Product Schema Injection (`app/(storefront)/products/[slug]/page.tsx`)

```typescript
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((img) => img.url) || [product.thumbnailUrl],
    description: product.description,
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "Generic",
    },
    offers: {
      "@type": "Offer",
      url: `https://${product.storeDomain}/products/${product.slug}`,
      priceCurrency: product.currency || "BDT",
      price: product.discountPrice || product.regularPrice,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stockQuantity > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <JsonLd schema={productJsonLd} />
      <ProductDetailsView product={product} />
    </>
  );
}
```

---

## 3. Rendering & Caching Strategy (ISR / SSG / Streaming)

To balance fresh inventory data with ultra-fast page speeds, SellDesk uses a hybrid caching architecture:

```
┌────────────────────────────────────────────────────────┐
│             Storefront Rendering Hierarchy             │
├─────────────────────────┬──────────────────────────────┤
│ Home / Category Pages   │ ISR (Incremental Static Reg) │ Revalidate: 300s
├─────────────────────────┼──────────────────────────────┤
│ Product Details Pages   │ ISR + Dynamic Streaming      │ Revalidate: 60s
├─────────────────────────┼──────────────────────────────┤
│ Cart / Checkout / Auth  │ Dynamic Client-Side Only     │ force-dynamic
└─────────────────────────┴──────────────────────────────┘
```

### 1. Incremental Static Regeneration (ISR)

Enable ISR on public content routes using route segment config:

```typescript
// app/(storefront)/products/[slug]/page.tsx
export const revalidate = 120; // Automatically regenerate cached HTML every 2 minutes
```

### 2. Static Params Pre-generation (`generateStaticParams`)

For high-traffic stores, pre-render top products at build time:

```typescript
export async function generateStaticParams() {
  // Fetch top 50 popular products to pre-render
  const topProducts = await fetchFeaturedProductSlugs();
  return topProducts.map((slug) => ({ slug }));
}
```

### 3. Non-Blocking Streaming with React Suspense

Keep the initial page response under 200ms TTFB by streaming slow data (related products, customer reviews):

```typescript
import { Suspense } from "react";
import { ProductHero } from "./components/ProductHero";
import { RelatedProducts } from "./components/RelatedProducts";
import { SkeletonList } from "@/components/ui/skeleton";

export default function ProductPage({ product }: { product: Product }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 1. Critical above-the-fold content rendered immediately */}
      <ProductHero product={product} />

      {/* 2. Secondary content streamed asynchronously */}
      <Suspense fallback={<SkeletonList count={4} />}>
        <RelatedProducts categoryId={product.categoryId} />
      </Suspense>
    </div>
  );
}
```

---

## 4. Media & Image Optimization Rules (Core Web Vitals)

Images represent over 70% of e-commerce page weight. Failing to optimize images causes bad **LCP (Largest Contentful Paint)** and **CLS (Cumulative Layout Shift)**.

### The Five Commandments of Storefront Images:

1. **Mandatory `next/image`:** Never use raw `<img>` tags. Always use `import Image from "next/image"`.
2. **Prioritize the LCP Element:** The primary hero banner on the homepage and the main product image on the PDP **MUST** have the `priority` prop. Never lazy load above-the-fold images!
3. **Explicit Responsive `sizes`:** Always provide the `sizes` attribute so the browser downloads the smallest required WebP/AVIF file.
4. **Enforce Aspect-Ratio Containers:** Always wrap images in a container with a fixed aspect ratio (e.g. `aspect-square`, `aspect-[4/3]`) to prevent layout shifts while loading.
5. **Configured Remote Domains:** Ensure CDN domains (Cloudinary, SellDesk S3) are configured in `next.config.ts`.

### Standard Product Card Image Pattern:

```typescript
// features/products/components/ProductCard.tsx
import Image from "next/image";
import { Product } from "../types/product.types";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group relative rounded-lg border bg-white overflow-hidden">
      {/* Aspect-ratio wrapper prevents CLS */}
      <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
        <Image
          src={product.thumbnailUrl || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
        <p className="font-bold text-base mt-2">{product.regularPrice} BDT</p>
      </div>
    </div>
  );
};
```

### Hero Banner Pattern (LCP Optimized):

```typescript
// features/stores/components/StoreHeroBanner.tsx
import Image from "next/image";

export const StoreHeroBanner = ({ bannerUrl, title }: { bannerUrl: string; title: string }) => {
  return (
    <div className="relative w-full aspect-[21/9] max-h-[480px] overflow-hidden rounded-xl">
      <Image
        src={bannerUrl}
        alt={title}
        fill
        priority // ⭐ Critical for fast LCP
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
};
```

---

## 5. Next.js Remote Images Configuration (`next.config.ts`)

To allow Cloudinary and SellDesk image CDN assets:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.selldesk.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
```

---

## 6. Core Web Vitals Benchmark Targets

Every storefront component must pass these thresholds on mobile emulation:

| Metric                              | Target    | How to Maintain in SellDesk                                                                                 |
| :---------------------------------- | :-------- | :---------------------------------------------------------------------------------------------------------- |
| **LCP** (Largest Contentful Paint)  | `< 2.5s`  | `priority` on Hero banner/product image, ISR pre-rendered HTML, fast backend Redis cache.                   |
| **CLS** (Cumulative Layout Shift)   | `< 0.1`   | Fixed aspect-ratio wrappers (`aspect-square`), `next/font` with `display: 'swap'`, reserved banner heights. |
| **INP** (Interaction to Next Paint) | `< 200ms` | Debounced search inputs, lightweight cart drawer, no long blocking JS execution in the main thread.         |
| **FID / TTFB**                      | `< 200ms` | Backend Redis multi-tenant cache (`@SetTtl(3600)` on `/storefront/init`).                                   |

---

## 7. Storefront SEO & Performance Review Checklist

Before releasing any storefront code:

- [ ] **Dynamic Metadata:** Every page exports `generateMetadata()` with title, description, OG image, and canonical URL.
- [ ] **Structured Data:** PDP includes valid schema.org `Product` JSON-LD with price and currency.
- [ ] **No Native `<img>`:** 100% of images use Next.js `Image` component with `sizes`.
- [ ] **LCP Priority:** Above-the-fold hero images or PDP featured images have `priority`.
- [ ] **Aspect Ratio Containers:** All image parents have `aspect-square`, `aspect-[21/9]`, or explicit dimensions to prevent CLS.
- [ ] **Mobile-First Responsive:** Tested on 375px mobile viewport.
