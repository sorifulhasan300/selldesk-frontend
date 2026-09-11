---
name: storefront-cart-checkout-workflow
description: Complete standards and patterns for storefront cart state, guest vs customer cart syncing, dynamic zone-based delivery calculation, coupon validation, and idempotent checkout submission in SellDesk. Use whenever building or modifying cart drawers, checkout forms, order submission, or pricing calculations in (storefront).
---

# 🛒 Storefront Cart & Checkout Workflow Skill (SellDesk Frontend)

The **Cart & Checkout funnel** in `src/app/(storefront)` is the most critical conversion path in **SellDesk**. Even minor bugs—such as duplicate orders on slow mobile networks, incorrect delivery fee calculations, or cart items disappearing when switching pages—directly cause lost revenue and customer distrust.

This skill governs the end-to-end e-commerce state management, real-time calculations, and order submission guarantees.

---

## 1. Store-Partitioned Cart State Architecture

In a multi-tenant SaaS, a customer may visit Store A (`storea.selldesk.com`) and Store B (`storeb.selldesk.com`). Cart items from Store A must **never** leak into Store B.

### The Rule of LocalStorage Cart Isolation:

- Every tenant cart key in LocalStorage MUST be scoped by `storeId`:
  `selldesk_cart_${storeId}`
- Never use a generic key like `cart_items` or `current_cart`.

### Cart Store Implementation (Zustand + Persist)

```typescript
// features/cart/store/cart.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "../types/cart.types";

interface CartState {
  storeId: string;
  items: CartItem[];
  appliedCoupon: {
    code: string;
    discountType: "FIXED" | "PERCENTAGE";
    discountAmount: number;
  } | null;
  selectedDeliveryZone: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string, variantId?: string) => void;
  updateQuantity: (
    itemId: string,
    quantity: number,
    variantId?: string,
  ) => void;
  applyCoupon: (coupon: CartState["appliedCoupon"]) => void;
  removeCoupon: () => void;
  setDeliveryZone: (zone: string) => void;
  clearCart: () => void;
}

export const createTenantCartStore = (storeId: string) =>
  create<CartState>()(
    persist(
      (set, get) => ({
        storeId,
        items: [],
        appliedCoupon: null,
        selectedDeliveryZone: null,

        addItem: (newItem) => {
          set((state) => {
            const existingIndex = state.items.findIndex(
              (i) =>
                i.productId === newItem.productId &&
                i.variantId === newItem.variantId,
            );

            if (existingIndex > -1) {
              const updated = [...state.items];
              updated[existingIndex].quantity += newItem.quantity;
              return { items: updated };
            }

            return { items: [...state.items, newItem] };
          });
        },

        updateQuantity: (productId, quantity, variantId) => {
          if (quantity <= 0) {
            get().removeItem(productId, variantId);
            return;
          }
          set((state) => ({
            items: state.items.map((item) =>
              item.productId === productId && item.variantId === variantId
                ? { ...item, quantity }
                : item,
            ),
          }));
        },

        removeItem: (productId, variantId) => {
          set((state) => ({
            items: state.items.filter(
              (item) =>
                !(item.productId === productId && item.variantId === variantId),
            ),
          }));
        },

        applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
        removeCoupon: () => set({ appliedCoupon: null }),
        setDeliveryZone: (zone) => set({ selectedDeliveryZone: zone }),
        clearCart: () =>
          set({ items: [], appliedCoupon: null, selectedDeliveryZone: null }),
      }),
      {
        name: `selldesk_cart_${storeId}`, // ⭐ Multi-tenant storage isolation
        storage: createJSONStorage(() => localStorage),
      },
    ),
  );
```

---

## 2. Dynamic Zone-Based Delivery Calculation

The backend `/storefront/init` API provides the store's delivery rules:

- `chargeMode`: e.g. `"ZONE_BASED"`
- `freeDeliveryThreshold`: number | null (e.g., 2000 BDT)
- `zoneRules`: Array of `{ zone: "inside_city", name: "Inside Dhaka", rate: 60 }`

### Calculation Hook (`features/cart/hooks/use-cart-totals.ts`)

```typescript
import { useMemo } from "react";
import { useCart } from "./use-cart";
import { useTenant } from "@/hooks/use-tenant";

export const useCartTotals = () => {
  const { items, appliedCoupon, selectedDeliveryZone } = useCart();
  const { config } = useTenant();
  const deliveryConfig = config.deliveryCharge;

  // 1. Subtotal calculation
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  // 2. Delivery charge calculation
  const deliveryFee = useMemo(() => {
    if (items.length === 0) return 0;

    // Check Free Delivery Threshold
    if (
      deliveryConfig.freeDeliveryThreshold !== null &&
      subtotal >= deliveryConfig.freeDeliveryThreshold
    ) {
      return 0;
    }

    // Match zone rule rate
    const matchedZone = deliveryConfig.zoneRules.find(
      (z) => z.zone === selectedDeliveryZone,
    );
    return matchedZone
      ? matchedZone.rate
      : deliveryConfig.zoneRules[0]?.rate || 0;
  }, [items, subtotal, selectedDeliveryZone, deliveryConfig]);

  // 3. Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === "FIXED") {
      return Math.min(appliedCoupon.discountAmount, subtotal);
    }
    // Percentage
    return Math.round((subtotal * appliedCoupon.discountAmount) / 100);
  }, [appliedCoupon, subtotal]);

  // 4. Final Payable Total
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  return {
    subtotal,
    deliveryFee,
    discountAmount,
    grandTotal,
    isFreeDelivery: deliveryFee === 0 && subtotal > 0,
  };
};
```

---

## 3. Real-Time Coupon Validation

Coupons must be validated against the backend endpoint `POST /storefront/cart/validate-coupon` before checkout:

```typescript
// features/cart/api/cart.api.ts
import { apiClient } from "@/lib/api-client";

export interface ValidateCouponPayload {
  code: string;
  subtotal: number;
}

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountAmount: number;
  message?: string;
}

export const validateStorefrontCoupon = async (
  storeId: string,
  payload: ValidateCouponPayload,
): Promise<CouponValidationResult> => {
  const { data } = await apiClient.post<CouponValidationResult>(
    "/storefront/cart/validate-coupon",
    payload,
    {
      headers: { "x-store-id": storeId },
    },
  );
  return data;
};
```

---

## 4. Idempotent Checkout Submission (Double-Click Prevention)

> [!CAUTION]
> **Duplicate Order Bug:** On slow 3G or 4G mobile connections in Bangladesh, customers often click the "Place Order" button multiple times.
> Without submission locks and idempotency keys, multiple identical orders are created in the database, wasting merchant inventory and SMS balance.

### Client-Side Idempotency & Lock Pattern:

```typescript
// features/checkout/hooks/use-submit-order.ts
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useTenant } from "@/hooks/use-tenant";

export const useSubmitOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { storeId } = useTenant();
  const { items, appliedCoupon, selectedDeliveryZone, clearCart } = useCart();

  // Ref lock to block synchronous multi-clicks
  const isLocked = useRef(false);

  const submitOrder = async (customerData: CustomerCheckoutFormData) => {
    if (isLocked.current || isSubmitting) return;

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      isLocked.current = true;
      setIsSubmitting(true);

      // 1. Generate client idempotency key (UUID v4)
      const idempotencyKey = crypto.randomUUID();

      const orderPayload = {
        idempotencyKey,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        deliveryAddress: customerData.address,
        deliveryZone: selectedDeliveryZone,
        paymentMethod: customerData.paymentMethod, // e.g. "COD", "BKASH"
        couponCode: appliedCoupon?.code,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          price: i.price,
        })),
      };

      const { data: order } = await apiClient.post(
        "/orders/storefront",
        orderPayload,
        {
          headers: {
            "x-store-id": storeId,
            "x-idempotency-key": idempotencyKey,
          },
        },
      );

      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/order-confirmed?orderId=${order.id}`);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      toast.error(msg);
    } finally {
      isLocked.current = false;
      setIsSubmitting(false);
    }
  };

  return { submitOrder, isSubmitting };
};
```

---

## 5. Mobile Fast Checkout & OTP Verification

If `business.isCustomerAuthEnabled` is true in `StorefrontInit`:

1. Customer enters mobile number (`+88017xxxxxxxx`).
2. Trigger `POST /storefront/auth/send-otp`.
3. Modal displays 4/6-digit OTP input with countdown timer (60s resend).
4. On `verify-otp` success, auth token is stored and order submits automatically.
5. If customer auth is disabled by store owner, allow instant 1-step Guest Checkout!

---

## 6. Cart & Checkout Verification Checklist

- [ ] **Store Scoped Key:** LocalStorage cart uses `selldesk_cart_${storeId}`.
- [ ] **Multi-Click Protected:** Place order button is disabled with spinner during request; `useRef` lock prevents simultaneous duplicate requests.
- [ ] **Zone-Based Delivery:** Correct delivery fee updates instantly upon changing radio button (`Inside City` vs `Outside City`).
- [ ] **Free Delivery Trigger:** If subtotal >= `freeDeliveryThreshold`, delivery fee drops to 0 and displays `"FREE Delivery"`.
- [ ] **Coupon Limits:** Cannot apply a coupon if subtotal doesn't meet minimum requirements.
- [ ] **Stock Checking:** Quantity selector cannot exceed maximum available variant inventory.
