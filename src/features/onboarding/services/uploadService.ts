import axios from "axios";
import { getAuthToken, getStoreId } from "@/shared/lib/api/token";

export interface UploadBackendResponse {
  url: string;
  public_id: string;
  secure_url?: string;
  publicId?: string;
  format?: string;
  bytes?: number;
  [key: string]: unknown;
}

export interface UploadImageOptions {
  storeId?: string;
  token?: string;
}

/**
 * Upload an image file directly to the backend upload endpoint.
 *
 * Endpoint: POST http://localhost:5000/api/v1/upload/single
 * - Body: multipart/form-data containing 'file' and optional 'folder'
 * - Headers: Authorization Bearer token, X-Store-Id, withCredentials: true
 *
 * CRITICAL: Never manually set 'Content-Type': 'multipart/form-data'.
 * The browser / Axios will automatically construct the Content-Type header
 * with the correct multipart boundary delimiter.
 */
export async function uploadImageToBackend(
  file: File,
  folderPath?: string,
  options?: UploadImageOptions,
): Promise<UploadBackendResponse> {
  // 1. Construct Standard FormData
  const formData = new FormData();
  formData.append("file", file); // Key 'file' matches backend upload middleware FileInterceptor('file')
  if (folderPath) {
    formData.append("folder", folderPath);
  }

  // 2. Resolve target API endpoint URL
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1";

  const cleanBase = apiBase.replace(/\/+$/, "");

  // Append folder to query param as well to ensure backend NestJS @Query() parses it seamlessly
  const uploadUrl = folderPath
    ? `${cleanBase}/upload/single?folder=${encodeURIComponent(folderPath)}`
    : `${cleanBase}/upload/single`;

  // 3. Resolve Auth Token & Store context
  const resolvedToken = options?.token || getAuthToken();

  // Extract storeId from folder path (e.g. selldesk/stores/{storeId}/logo) or options/storage
  const extractedStoreId = folderPath?.match(/stores\/([^/]+)/)?.[1];
  const resolvedStoreId =
    options?.storeId || extractedStoreId || getStoreId() || undefined;

  // 4. Configure Headers
  // CRITICAL: Do NOT set 'Content-Type': 'multipart/form-data'
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }

  if (resolvedStoreId) {
    headers["X-Store-Id"] = resolvedStoreId;
    headers["x-store-id"] = resolvedStoreId;
  }

  // 5. Send POST request with verbose error catching
  try {
    const response = await axios.post(uploadUrl, formData, {
      headers,
      withCredentials: true, // For HttpOnly cookies (credentials: 'include')
    });

    const resData = response.data?.data || response.data;

    const url = resData?.url || resData?.secure_url || "";
    const public_id = resData?.public_id || resData?.publicId || "";

    return {
      ...resData,
      url,
      public_id,
      secure_url: resData?.secure_url || url,
      publicId: resData?.publicId || public_id,
    };
  } catch (error: unknown) {
    const axiosErr = error as { response?: { data?: unknown } };
    console.log("Upload Response Error:", axiosErr?.response?.data || error);
    throw error;
  }
}
