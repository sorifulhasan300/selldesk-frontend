"use server";

import {
  serverApiClient,
  ServerApiError,
} from "@/shared/lib/api/server-client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type { AuthActionResult, UploadedAsset } from "@/features/auth/types";

export interface UploadOptions {
  folder?: string;
  isPublic?: boolean;
  storeId?: string;
  token?: string;
}

/**
 * Server Action for single image file upload (profile avatar, store logo, or store banner)
 * Dispatches multipart/form-data to the backend upload endpoint via serverApiClient.
 */
export async function uploadImageAction(
  formData: FormData,
  options?: UploadOptions,
): Promise<AuthActionResult<UploadedAsset>> {
  try {
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return {
        success: false,
        message: "No file selected",
        error: "Please select an image file to upload",
      };
    }

    // Allow options from parameter or embedded directly inside FormData
    const formFolder = formData.get("folder");
    const formIsPublic = formData.get("isPublic");
    const formStoreId = formData.get("storeId");
    const formToken = formData.get("token");

    const folderName =
      (typeof formFolder === "string" && formFolder.trim()
        ? formFolder.trim()
        : undefined) ||
      options?.folder ||
      (options?.isPublic ? "avatars" : "store");

    const storeId =
      (typeof formStoreId === "string" && formStoreId.trim()
        ? formStoreId.trim()
        : undefined) || options?.storeId;

    const token =
      (typeof formToken === "string" && formToken.trim()
        ? formToken.trim()
        : undefined) || options?.token;

    const isPublic =
      formIsPublic !== null
        ? formIsPublic === "true" || formIsPublic === "1"
        : (options?.isPublic ?? !storeId);

    // Primary endpoint determination
    const primaryEndpoint = isPublic
      ? API_ENDPOINTS.UPLOAD.PUBLIC(folderName)
      : API_ENDPOINTS.UPLOAD.SINGLE(folderName);

    const headers: Record<string, string> = {};
    if (storeId) {
      headers["x-store-id"] = storeId;
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const result = await serverApiClient.upload<UploadedAsset>(
        primaryEndpoint,
        formData,
        { headers, storeId, token },
      );

      return {
        success: true,
        message: "Image uploaded successfully!",
        data: result,
      };
    } catch (primaryError: unknown) {
      // If single upload failed without a storeId (e.g. initial public avatars), attempt public endpoint fallback
      if (
        !options?.isPublic &&
        !storeId &&
        primaryError instanceof ServerApiError &&
        (primaryError.statusCode === 403 || primaryError.statusCode === 401)
      ) {
        const fallbackEndpoint = API_ENDPOINTS.UPLOAD.PUBLIC(folderName);
        const fallbackResult = await serverApiClient.upload<UploadedAsset>(
          fallbackEndpoint,
          formData,
        );

        return {
          success: true,
          message: "Image uploaded successfully!",
          data: fallbackResult,
        };
      }

      throw primaryError;
    }
  } catch (error: unknown) {
    if (error instanceof ServerApiError) {
      return {
        success: false,
        message: error.message || "Failed to upload image",
        error: error.message,
      };
    }

    const rawMessage =
      error instanceof Error
        ? error.message
        : "Unable to complete image upload";

    return {
      success: false,
      message: "Failed to upload image",
      error: rawMessage,
    };
  }
}
