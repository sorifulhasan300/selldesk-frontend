export * from "./types";
export * from "./errors";
export * from "./token";
export * from "./client";

// Primary API client instances
export { apiClient, axiosInstance, API_BASE_URL } from "./client";

// Core error & token helpers
export {
  ApiError,
  getApiErrorMessage,
  isApiError,
  parseApiError,
  formatBengaliErrorMessage,
} from "./errors";

export {
  getAuthToken,
  getStoreId,
  getTenantSubdomain,
  setClientAuthToken,
  setClientStoreId,
  setClientTenantSubdomain,
  STORE_COOKIE_KEY,
  STORE_STORAGE_KEY,
  TENANT_COOKIE_KEY,
  TENANT_STORAGE_KEY,
} from "./token";

// Default export preserves client-side apiClient for backward compatibility
export { default } from "./client";
