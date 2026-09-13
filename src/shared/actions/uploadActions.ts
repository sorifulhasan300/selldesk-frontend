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

    const folderName =
      options?.folder || (options?.isPublic ? "avatars" : "store");

    // Primary endpoint determination
    const primaryEndpoint = options?.isPublic
      ? API_ENDPOINTS.UPLOAD.PUBLIC(folderName)
      : API_ENDPOINTS.UPLOAD.SINGLE(folderName);

    try {
      const result = await serverApiClient.upload<UploadedAsset>(
        primaryEndpoint,
        formData,
      );

      return {
        success: true,
        message: "Image uploaded successfully!",
        data: result,
      };
    } catch (primaryError: unknown) {
      // If single upload failed due to missing store context during onboarding, attempt public endpoint fallback
      if (
        !options?.isPublic &&
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
