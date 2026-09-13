import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { clearAuthSession } from "@/features/auth/services/authSession";
import {
  ApiError,
  getApiErrorMessage,
  isApiError,
  parseApiError,
  formatBengaliErrorMessage,
} from "./errors";
import {
  getAuthToken,
  getStoreId,
  getTenantSubdomain,
  setClientAuthToken,
  setClientStoreId,
  setClientTenantSubdomain,
} from "./token";
import type { ApiClientInstance, ApiRequestConfig } from "./types";

/**
 * Base API URL Resolution:
 * Priority 1: process.env.NEXT_PUBLIC_API_BASE_URL (Explicit requirement)
 * Priority 2: process.env.NEXT_PUBLIC_API_URL (SellDesk standard env)
 * Priority 3: http://localhost:5000/api/v1 (Local backend fallback)
 */
export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

/**
 * Core Axios instance configured for SellDesk
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request Interceptor:
 * - Automatically attaches Bearer auth token if present
 * - Automatically attaches tenant subdomain / store context headers
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const customConfig = config as InternalAxiosRequestConfig &
      ApiRequestConfig;

    // 1. If sending FormData, delete Content-Type to let browser/Axios calculate the boundary
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      config.headers.delete("Content-Type");
    }

    // 2. Bearer Token resolution
    if (!customConfig.skipAuth) {
      const token = getAuthToken();
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    // 2. Store / Tenant context resolution (Primary: X-Store-Id for NestJS backend)
    const storeId =
      customConfig.storeId ||
      customConfig.tenantSubdomain ||
      getStoreId() ||
      getTenantSubdomain();

    if (storeId) {
      // Primary backend header required by NestJS controllers (Orders, Payments, CMS, etc.)
      config.headers.set("X-Store-Id", storeId);
      config.headers.set("x-store-id", storeId);
      config.headers.set("store-id", storeId);

      // Multi-tenant subdomain headers for storefront domain routing
      config.headers.set("X-Tenant-Subdomain", storeId);
      config.headers.set("X-Tenant-ID", storeId);
      config.headers.set("X-Store-Subdomain", storeId);
    }

    return config;
  },
  (error) => {
    return Promise.reject(parseApiError(error));
  },
);

/**
 * Response Interceptor:
 * - Automatically unwraps response.data.data when backend envelope is present
 * - Handles 401 Unauthorized globally
 * - Formats all errors into typed ApiError instances with Bengali messages
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const customConfig = response.config as ApiRequestConfig;

    // Return raw AxiosResponse if requested
    if (customConfig?.rawResponse) {
      return response as unknown as AxiosResponse;
    }

    const resData = response.data;

    // If response matches SellDesk backend envelope: { success: true, data: T }
    if (
      resData &&
      typeof resData === "object" &&
      "success" in resData &&
      resData.success === true &&
      "data" in resData
    ) {
      return (resData as { data: unknown }).data as unknown as AxiosResponse;
    }

    // Otherwise return response payload directly
    return resData;
  },
  (error) => {
    const apiError = parseApiError(error);

    // Global 401 Unauthorized handling
    if (apiError.isUnauthorized && typeof window !== "undefined") {
      clearAuthSession();
      // Dispatch browser custom event for decoupling with React UI listeners
      window.dispatchEvent(
        new CustomEvent("selldesk:unauthorized", {
          detail: { error: apiError },
        }),
      );
    }

    return Promise.reject(apiError);
  },
);

/**
 * Production-ready typed API Client for SellDesk
 */
export const apiClient: ApiClientInstance & {
  instance: AxiosInstance;
  getErrorMessage: typeof getApiErrorMessage;
} = {
  instance: axiosInstance,
  getErrorMessage: getApiErrorMessage,

  /**
   * HTTP GET method with payload unwrapping
   */
  async get<T = unknown>(url: string, config?: ApiRequestConfig): Promise<T> {
    return (await axiosInstance.get(url, config)) as unknown as T;
  },

  /**
   * HTTP POST method with payload unwrapping
   */
  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig,
  ): Promise<T> {
    return (await axiosInstance.post(url, data, config)) as unknown as T;
  },

  /**
   * HTTP PUT method with payload unwrapping
   */
  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig,
  ): Promise<T> {
    return (await axiosInstance.put(url, data, config)) as unknown as T;
  },

  /**
   * HTTP PATCH method with payload unwrapping
   */
  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig,
  ): Promise<T> {
    return (await axiosInstance.patch(url, data, config)) as unknown as T;
  },

  /**
   * HTTP DELETE method with payload unwrapping
   */
  async delete<T = unknown>(
    url: string,
    config?: ApiRequestConfig,
  ): Promise<T> {
    return (await axiosInstance.delete(url, config)) as unknown as T;
  },

  /**
   * Multipart/form-data upload method
   */
  async upload<T = unknown>(
    url: string,
    formData: FormData,
    config?: ApiRequestConfig,
  ): Promise<T> {
    const uploadHeaders = { ...(config?.headers as Record<string, string>) };
    delete uploadHeaders["Content-Type"];

    const uploadConfig: ApiRequestConfig = {
      ...config,
      headers: uploadHeaders,
    };
    return (await axiosInstance.post(
      url,
      formData,
      uploadConfig,
    )) as unknown as T;
  },

  /**
   * Generic HTTP request method
   */
  async request<T = unknown>(config: ApiRequestConfig): Promise<T> {
    return (await axiosInstance.request(config)) as unknown as T;
  },

  /**
   * Programmatically set auth token
   */
  setAuthToken(token: string | null): void {
    setClientAuthToken(token);
  },

  /**
   * Programmatically set store ID (primary backend identifier)
   */
  setStoreId(storeId: string | null): void {
    setClientStoreId(storeId);
  },

  /**
   * Programmatically set tenant subdomain
   */
  setTenantSubdomain(subdomain: string | null): void {
    setClientTenantSubdomain(subdomain);
  },
};

// Re-export core error and context utilities directly from client module
export {
  ApiError,
  getApiErrorMessage,
  isApiError,
  formatBengaliErrorMessage,
  setClientAuthToken,
  setClientStoreId,
  setClientTenantSubdomain,
  getStoreId,
  getTenantSubdomain,
};

export default apiClient;
