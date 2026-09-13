"use server";

import { cookies } from "next/headers";
import {
  serverApiClient,
  ServerApiError,
} from "@/shared/lib/api/server-client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import {
  onboardingFormSchema,
  type OnboardingFormData,
} from "../schemas/onboardingSchema";
import type { Tenant } from "@/features/tenant/types";
import type { AuthActionResult, AuthTokens } from "@/features/auth/types";

export interface StoreActionResult extends AuthActionResult<Tenant> {
  store?: Tenant;
}

/**
 * Cookie options helper for store context cookies
 */
function getStoreCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 30) {
  return {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/**
 * Server Action to Provision and Create a New Store / Tenant Workspace
 * Automatically reads HttpOnly auth token from cookies, dispatches payload to POST /stores,
 * and sets store identification cookies upon success.
 */
export async function createStoreAction(
  storeData: OnboardingFormData,
): Promise<StoreActionResult> {
  try {
    // 1. Validate complete onboarding form schema on the server
    const validation = onboardingFormSchema.safeParse(storeData);
    if (!validation.success) {
      const fieldErrors: Record<string, string[]> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString() || "form";
        fieldErrors[path] = [...(fieldErrors[path] || []), issue.message];
      });

      return {
        success: false,
        message: "Please review the store details and try again.",
        error: "Validation failed",
        errors: fieldErrors,
      };
    }

    // 2. Prepare payload matching backend CreateStoreDto
    const payload = {
      storeName: storeData.storeName.trim(),
      subDomain: storeData.subDomain.trim().toLowerCase(),
      productType: storeData.productType,
      sellingStatus: storeData.sellingStatus || undefined,
      currentRevenue: storeData.currentRevenue || undefined,
      industryCategory: storeData.industryCategory?.trim() || undefined,
      storePhone: storeData.storePhone?.trim() || undefined,
      logoUrl: storeData.logoUrl?.trim() || undefined,
      logoPublicId: storeData.logoPublicId?.trim() || undefined,
      bannerUrl: storeData.bannerUrl?.trim() || undefined,
      bannerPublicId: storeData.bannerPublicId?.trim() || undefined,
    };

    // 3. Dispatch POST /stores via serverApiClient (auth header dynamically attached)
    const response = await serverApiClient.post<{
      store: Tenant;
      tokens?: AuthTokens;
      token?: string;
    }>(API_ENDPOINTS.TENANTS.CREATE, payload);

    const createdStore: Tenant =
      (response as { store?: Tenant })?.store ||
      (response as unknown as Tenant);
    const tokens = (response as { tokens?: AuthTokens })?.tokens;

    if (!createdStore || !createdStore.id) {
      throw new Error("Invalid response from server: Store creation failed");
    }

    // 4. Update session cookies with store context
    const cookieStore = await cookies();
    const cookieOptions = getStoreCookieOptions();

    // Primary HttpOnly store identifier for server-side tenant routing
    cookieStore.set("store_id", createdStore.id, {
      ...cookieOptions,
      httpOnly: true,
    });

    // Client-accessible cookie for hydration and client-side helpers
    cookieStore.set("selldesk_store_id", createdStore.id, {
      ...cookieOptions,
      httpOnly: false,
    });

    // Subdomain context cookie
    if (createdStore.subDomain) {
      cookieStore.set("selldesk_tenant_subdomain", createdStore.subDomain, {
        ...cookieOptions,
        httpOnly: false,
      });
    }

    // 5. If refreshed tokens containing storeId claims were issued, update auth cookies
    if (tokens?.accessToken) {
      cookieStore.set("auth_token", tokens.accessToken, {
        ...cookieOptions,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      });
      cookieStore.set("selldesk_access_token", tokens.accessToken, {
        ...cookieOptions,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return {
      success: true,
      message: "Congratulations! Your store was created successfully 🎉",
      store: createdStore,
      data: createdStore,
      tokens,
    };
  } catch (error: unknown) {
    if (error instanceof ServerApiError) {
      return {
        success: false,
        message: error.message || "Failed to create store. Please try again.",
        error: error.message,
        errors: error.errors,
      };
    }

    const rawMessage =
      error instanceof Error
        ? error.message
        : "Unable to complete store creation. Please try again.";

    return {
      success: false,
      message: "Failed to create store. Please try again.",
      error: rawMessage,
    };
  }
}
