"use server";

import { cookies } from "next/headers";
import {
  serverApiClient,
  ServerApiError,
} from "@/shared/lib/api/server-client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { uploadImageAction } from "@/shared/actions/uploadActions";
import {
  onboardingFormSchema,
  type OnboardingFormData,
} from "../schemas/onboardingSchema";
import type { Tenant } from "@/features/tenant/types";
import type {
  AuthActionResult,
  AuthTokens,
  UploadedAsset,
} from "@/features/auth/types";

export interface StoreActionResult extends AuthActionResult<Tenant> {
  store?: Tenant;
  redirectUrl?: string;
  requiresPayment?: boolean;
}

export interface UpdateStoreBrandingPayload {
  logoUrl?: string;
  logoPublicId?: string;
  bannerUrl?: string;
  bannerPublicId?: string;
}

const cookieOpts = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

/**
 * Step A (Create Store Base Record):
 * Submits the onboarding form payload to POST /api/v1/stores WITHOUT waiting for
 * Cloudinary image URLs. Returns the created store and sets session cookies.
 */
export async function createStoreAction(
  storeData: OnboardingFormData,
): Promise<StoreActionResult> {
  try {
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

    const selectedPkg =
      storeData.packageId || storeData.selectedPackageId || "free-trial";

    // Omit image URLs so the base record is created immediately in PostgreSQL
    const payload = {
      packageId: selectedPkg,
      planId: selectedPkg,
      storeName: storeData.storeName.trim(),
      subDomain: storeData.subDomain.trim().toLowerCase(),
      productType: storeData.productType,
      sellingStatus: storeData.sellingStatus || undefined,
      currentRevenue: storeData.currentRevenue || undefined,
      industryCategory: storeData.industryCategory?.trim() || undefined,
      storePhone: storeData.storePhone?.trim()
        ? storeData.storePhone.trim().startsWith("0")
          ? storeData.storePhone.trim()
          : `0${storeData.storePhone.trim()}`
        : undefined,
      logoUrl: undefined,
      logoPublicId: undefined,
      bannerUrl: undefined,
      bannerPublicId: undefined,
    };

    const response = await serverApiClient.post<{
      store: Tenant;
      tokens?: AuthTokens;
      token?: string;
      requiresPayment?: boolean;
      redirectUrl?: string;
    }>(API_ENDPOINTS.TENANTS.CREATE, payload);

    const createdStore: Tenant =
      (response as { store?: Tenant })?.store ||
      (response as unknown as Tenant);
    const tokens = (response as { tokens?: AuthTokens })?.tokens;

    if (!createdStore?.id) {
      throw new Error("Invalid response from server: Store creation failed");
    }

    const cookieStore = await cookies();
    cookieStore.set("store_id", createdStore.id, {
      ...cookieOpts,
      httpOnly: true,
    });
    cookieStore.set("selldesk_store_id", createdStore.id, {
      ...cookieOpts,
      httpOnly: false,
    });

    if (createdStore.subDomain) {
      cookieStore.set("selldesk_tenant_subdomain", createdStore.subDomain, {
        ...cookieOpts,
        httpOnly: false,
      });
    }

    if (tokens?.accessToken) {
      const authOpts = {
        ...cookieOpts,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      };
      cookieStore.set("auth_token", tokens.accessToken, authOpts);
      cookieStore.set("selldesk_access_token", tokens.accessToken, authOpts);
    }

    const requiresPayment = Boolean(response?.requiresPayment);
    const redirectUrl =
      response?.redirectUrl ||
      (requiresPayment ? "/dashboard?payment=pending" : "/dashboard");

    return {
      success: true,
      message: "Store created successfully.",
      store: createdStore,
      data: createdStore,
      redirectUrl,
      requiresPayment,
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
        : "Unable to complete store creation.";
    return {
      success: false,
      message: "Failed to create store. Please try again.",
      error: rawMessage,
    };
  }
}

/**
 * Step B Helper (Upload Store Asset):
 * Uploads a logo or banner file to the dedicated Cloudinary store folder:
 * selldesk/stores/{storeId}/logo or selldesk/stores/{storeId}/banner
 */
export async function uploadStoreAssetAction(
  formData: FormData,
  storeId: string,
  assetType: "logo" | "banner",
): Promise<AuthActionResult<UploadedAsset>> {
  return uploadImageAction(formData, {
    folder: assetType,
    storeId,
    isPublic: false,
  });
}

/**
 * Step B Sync (Update Store Branding):
 * Sends PATCH /api/v1/stores/{storeId} with Cloudinary URLs and Public IDs.
 */
export async function updateStoreBrandingAction(
  storeId: string,
  branding: UpdateStoreBrandingPayload,
): Promise<StoreActionResult> {
  try {
    if (!storeId) {
      return {
        success: false,
        message: "Store ID is required to update branding.",
        error: "Missing storeId",
      };
    }

    const payload: UpdateStoreBrandingPayload = {};
    if (branding.logoUrl !== undefined) payload.logoUrl = branding.logoUrl;
    if (branding.logoPublicId !== undefined)
      payload.logoPublicId = branding.logoPublicId;
    if (branding.bannerUrl !== undefined)
      payload.bannerUrl = branding.bannerUrl;
    if (branding.bannerPublicId !== undefined)
      payload.bannerPublicId = branding.bannerPublicId;

    const response = await serverApiClient.patch<Tenant>(
      API_ENDPOINTS.TENANTS.UPDATE(storeId),
      payload,
      { storeId },
    );

    const updatedStore: Tenant =
      (response as { store?: Tenant })?.store ||
      (response as unknown as Tenant);

    return {
      success: true,
      message: "Store branding updated successfully.",
      store: updatedStore,
      data: updatedStore,
    };
  } catch (error: unknown) {
    if (error instanceof ServerApiError) {
      return {
        success: false,
        message: error.message || "Failed to update store branding.",
        error: error.message,
        errors: error.errors,
      };
    }
    const rawMessage =
      error instanceof Error
        ? error.message
        : "Unable to update store branding.";
    return {
      success: false,
      message: "Failed to update store branding.",
      error: rawMessage,
    };
  }
}
