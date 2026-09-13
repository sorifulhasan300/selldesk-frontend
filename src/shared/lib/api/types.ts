import type { AxiosRequestConfig, AxiosError } from "axios";

/**
 * Standard SellDesk Backend Success Envelope
 * Matches NestJS TransformInterceptor response format
 */
export interface BackendEnvelope<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  timestamp?: string;
  path?: string;
}

/**
 * Alias for BackendEnvelope
 */
export type ApiResponse<T = unknown> = BackendEnvelope<T>;

/**
 * Standard SellDesk Backend Error Envelope
 * Matches NestJS HttpExceptionFilter response format
 */
export interface BackendErrorEnvelope {
  success: false;
  statusCode: number;
  message: string | string[];
  error?: string;
  path?: string;
  timestamp?: string;
  errors?: Record<string, string[]>;
}

/**
 * Extended Axios Request Configuration for SellDesk API Client
 */
export interface ApiRequestConfig extends AxiosRequestConfig {
  /**
   * If true, bypass attaching Authorization header for public endpoints
   * @default false
   */
  skipAuth?: boolean;

  /**
   * Explicitly specify or override tenant subdomain for multi-tenant routing
   */
  tenantSubdomain?: string;

  /**
   * If true, returns the raw AxiosResponse without unwrapping `response.data.data`
   * @default false
   */
  rawResponse?: boolean;

  /**
   * If true, bypasses global error handling / redirects
   * @default false
   */
  skipErrorHandling?: boolean;
}

/**
 * Options for constructing an ApiError instance
 */
export interface ApiErrorOptions {
  statusCode: number;
  message: string;
  bengaliMessage: string;
  originalMessage?: string | string[];
  code?: string;
  errors?: Record<string, string[]>;
  rawError?: AxiosError;
}

/**
 * Interface representing the core API client utilities
 */
export interface ApiClientInstance {
  get<T = unknown>(url: string, config?: ApiRequestConfig): Promise<T>;
  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig,
  ): Promise<T>;
  put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig,
  ): Promise<T>;
  patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig,
  ): Promise<T>;
  delete<T = unknown>(url: string, config?: ApiRequestConfig): Promise<T>;
  upload<T = unknown>(
    url: string,
    formData: FormData,
    config?: ApiRequestConfig,
  ): Promise<T>;
  request<T = unknown>(config: ApiRequestConfig): Promise<T>;
  setAuthToken(token: string | null): void;
  setTenantSubdomain(subdomain: string | null): void;
}
