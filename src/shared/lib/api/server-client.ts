import { cookies, headers } from "next/headers";
import { ApiError, formatBengaliErrorMessage } from "./errors";
import { extractSubdomainFromHost } from "./token";
import type { BackendEnvelope, BackendErrorEnvelope } from "./types";

/**
 * Cookie key constants for authentication and tenant resolution
 */
export const SERVER_AUTH_COOKIE_KEYS = [
  "auth_token",
  "selldesk_access_token",
  "access_token",
  "token",
] as const;

export const SERVER_STORE_COOKIE_KEYS = [
  "selldesk_store_id",
  "store_id",
  "x-store-id",
  "storeId",
  "tenant_id",
  "selldesk_tenant_subdomain",
  "x-tenant-id",
  "tenant",
  "subdomain",
] as const;

export const SERVER_TENANT_COOKIE_KEYS = SERVER_STORE_COOKIE_KEYS;

/**
 * Next.js Server-Side Fetch Cache and Revalidation Configuration
 */
export interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Request options for server-side API calls
 */
export interface ServerApiRequestOptions extends Omit<
  RequestInit,
  "body" | "method" | "headers"
> {
  /**
   * Custom request headers
   */
  headers?: HeadersInit | Record<string, string | undefined>;

  /**
   * URL query parameters
   */
  params?:
    | Record<
        string,
        | string
        | number
        | boolean
        | undefined
        | null
        | (string | number | boolean)[]
      >
    | URLSearchParams;

  /**
   * Explicit Bearer auth token override. If provided, bypasses reading from cookies.
   */
  token?: string | null;

  /**
   * Explicit Store ID override (primary backend header: X-Store-Id).
   * If provided, bypasses reading from incoming headers/cookies.
   */
  storeId?: string | null;

  /**
   * Explicit Tenant ID override (alias for storeId)
   */
  tenantId?: string | null;

  /**
   * Explicit Store / Tenant Subdomain override
   */
  storeSubdomain?: string | null;
  tenantSubdomain?: string | null;

  /**
   * If true, bypasses attaching the Authorization Bearer header
   * @default false
   */
  skipAuth?: boolean;

  /**
   * If true, returns the raw response payload without unwrapping { success: true, data: T }
   * @default false
   */
  rawResponse?: boolean;

  /**
   * Next.js cache strategy: 'no-store' | 'force-cache' | 'default' | 'reload' | 'no-cache' | 'only-if-cached'
   */
  cache?: RequestCache;

  /**
   * Next.js revalidation and tagging configuration
   */
  next?: NextFetchRequestConfig;
}

/**
 * Options for constructing a ServerApiError
 */
export interface ServerApiErrorOptions {
  status: number;
  message: string;
  bengaliMessage?: string;
  originalMessage?: string | string[];
  code?: string;
  errors?: Record<string, string[]>;
  endpoint?: string;
  response?: Response;
  data?: unknown;
}

/**
 * Custom typed error class for Server-Side API requests.
 * Fully compatible with SellDesk's client-side ApiError.
 */
export class ServerApiError extends ApiError {
  readonly endpoint?: string;
  readonly response?: Response;
  readonly data?: unknown;

  constructor(options: ServerApiErrorOptions) {
    const bengali =
      options.bengaliMessage ||
      formatBengaliErrorMessage(
        options.status,
        options.originalMessage ?? options.message,
      );

    super({
      statusCode: options.status,
      message: options.message,
      bengaliMessage: bengali,
      originalMessage: options.originalMessage ?? options.message,
      code: options.code,
      errors: options.errors,
    });

    this.name = "ServerApiError";
    this.endpoint = options.endpoint;
    this.response = options.response;
    this.data = options.data;

    Object.setPrototypeOf(this, ServerApiError.prototype);
  }
}

/**
 * Type guard for ServerApiError
 */
export function isServerApiError(error: unknown): error is ServerApiError {
  return error instanceof ServerApiError;
}

/**
 * Server API Client Interface
 */
export interface ServerApiClient {
  get<T = unknown>(
    endpoint: string,
    options?: ServerApiRequestOptions,
  ): Promise<T>;
  post<T = unknown, B = unknown>(
    endpoint: string,
    body?: B,
    options?: ServerApiRequestOptions,
  ): Promise<T>;
  put<T = unknown, B = unknown>(
    endpoint: string,
    body?: B,
    options?: ServerApiRequestOptions,
  ): Promise<T>;
  patch<T = unknown, B = unknown>(
    endpoint: string,
    body?: B,
    options?: ServerApiRequestOptions,
  ): Promise<T>;
  delete<T = unknown>(
    endpoint: string,
    options?: ServerApiRequestOptions,
  ): Promise<T>;
  upload<T = unknown>(
    endpoint: string,
    formData: FormData,
    options?: ServerApiRequestOptions,
  ): Promise<T>;
  request<T = unknown>(
    endpoint: string,
    options: ServerApiRequestOptions & {
      method?: string;
      body?: unknown;
    },
  ): Promise<T>;
}

/**
 * Base API URL Resolution for Server Context:
 * Priority 1: process.env.NEXT_PUBLIC_API_BASE_URL (Explicit requirement)
 * Priority 2: process.env.API_BASE_URL (Internal server-to-server URL override)
 * Priority 3: process.env.NEXT_PUBLIC_API_URL (SellDesk standard env)
 * Priority 4: http://localhost:5000/api/v1 (Local backend fallback)
 */
export function getServerApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/v1"
  );
}

/**
 * Helper to build the fully-qualified URL with query parameters
 */
function buildTargetUrl(
  endpoint: string,
  params?: ServerApiRequestOptions["params"],
): string {
  let urlString: string;

  if (/^https?:\/\//i.test(endpoint)) {
    urlString = endpoint;
  } else {
    const baseUrl = getServerApiBaseUrl().replace(/\/+$/, "");
    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    urlString = `${baseUrl}/${cleanEndpoint}`;
  }

  if (!params) {
    return urlString;
  }

  const isRelative = !/^https?:\/\//i.test(urlString);
  const dummyOrigin = "http://localhost";
  const url = isRelative ? new URL(urlString, dummyOrigin) : new URL(urlString);

  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  } else {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== undefined && item !== null) {
              url.searchParams.append(key, String(item));
            }
          });
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    });
  }

  return isRelative ? `${url.pathname}${url.search}` : url.toString();
}

/**
 * Dynamically resolves the active Bearer Auth Token from Next.js 15 server context
 */
async function resolveAuthToken(
  options?: ServerApiRequestOptions,
): Promise<string | null> {
  if (options?.skipAuth) {
    return null;
  }

  if (options?.token) {
    return options.token.trim();
  }

  try {
    const cookieStore = await cookies();

    for (const key of SERVER_AUTH_COOKIE_KEYS) {
      const cookie = cookieStore.get(key);
      if (cookie?.value && cookie.value.trim().length > 0) {
        return cookie.value.trim();
      }
    }
  } catch {
    // Graceful fallback when executed outside of an active HTTP request context (e.g. build phase)
  }

  return null;
}

/**
 * Dynamically resolves active store ID (primary backend identifier) / tenant ID from Next.js 15 server context:
 * 1. Explicit options (storeId / tenantId / storeSubdomain / tenantSubdomain)
 * 2. Incoming request headers (x-store-id, store-id, x-tenant-id, x-subdomain)
 * 3. Incoming Host / X-Forwarded-Host header
 * 4. Incoming server cookies (selldesk_store_id, store_id, tenant_id, etc.)
 */
export async function resolveStoreId(
  options?: ServerApiRequestOptions,
): Promise<string | null> {
  if (options?.storeId) {
    return options.storeId.trim();
  }

  if (options?.tenantId) {
    return options.tenantId.trim();
  }

  if (options?.storeSubdomain) {
    return options.storeSubdomain.trim().toLowerCase();
  }

  if (options?.tenantSubdomain) {
    return options.tenantSubdomain.trim().toLowerCase();
  }

  // 1. Resolve from incoming server headers (Primary: x-store-id, store-id)
  try {
    const headerList = await headers();

    const headerStore =
      headerList.get("x-store-id") ||
      headerList.get("store-id") ||
      headerList.get("x-tenant-id") ||
      headerList.get("x-subdomain") ||
      headerList.get("x-tenant-subdomain") ||
      headerList.get("x-store-subdomain");

    if (headerStore && headerStore.trim().length > 0) {
      return headerStore.trim();
    }

    // Attempt parsing from incoming host header
    const hostHeader =
      headerList.get("x-forwarded-host") || headerList.get("host");

    if (hostHeader) {
      const extracted = extractSubdomainFromHost(hostHeader);
      if (extracted) {
        return extracted.trim().toLowerCase();
      }
    }
  } catch {
    // Fall through if headers() is unavailable
  }

  // 2. Resolve from incoming cookies
  try {
    const cookieStore = await cookies();

    for (const key of SERVER_STORE_COOKIE_KEYS) {
      const cookie = cookieStore.get(key);
      if (cookie?.value && cookie.value.trim().length > 0) {
        return cookie.value.trim();
      }
    }
  } catch {
    // Fall through if cookies() is unavailable
  }

  return null;
}

export const resolveTenantId = resolveStoreId;

/**
 * Prepares the outgoing Headers object with auth, tenant context, and incoming header forwarding
 */
async function prepareHeaders(
  options?: ServerApiRequestOptions,
): Promise<Headers> {
  const requestHeaders = new Headers();

  // Set default Accept header
  requestHeaders.set("Accept", "application/json");

  // 1. Forward incoming request tracking headers if present
  try {
    const incomingHeaders = await headers();

    const requestId =
      incomingHeaders.get("x-request-id") ||
      incomingHeaders.get("x-correlation-id");
    if (requestId) {
      requestHeaders.set("X-Request-ID", requestId);
    }

    const forwardedFor = incomingHeaders.get("x-forwarded-for");
    if (forwardedFor) {
      requestHeaders.set("X-Forwarded-For", forwardedFor);
    }
  } catch {
    // outside request context
  }

  // 2. Dynamically attach Bearer Token
  const token = await resolveAuthToken(options);
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  // 3. Dynamically attach Store / Tenant context headers (Primary: X-Store-Id for NestJS backend)
  const storeId = await resolveStoreId(options);
  if (storeId) {
    // Primary backend header required by NestJS controllers (Orders, Payments, CMS, Coupons, Storefront)
    requestHeaders.set("X-Store-Id", storeId);
    requestHeaders.set("x-store-id", storeId);
    requestHeaders.set("store-id", storeId);

    // Multi-tenant subdomain headers for storefront domain routing
    requestHeaders.set("X-Tenant-ID", storeId);
    requestHeaders.set("X-Tenant-Subdomain", storeId);
    requestHeaders.set("X-Store-Subdomain", storeId);
    requestHeaders.set("X-Subdomain", storeId);
  }

  // 4. Merge caller-supplied headers (overrides automatically if provided)
  if (options?.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        requestHeaders.set(key, value);
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        requestHeaders.set(key, value);
      });
    } else {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          requestHeaders.set(key, value);
        }
      });
    }
  }

  return requestHeaders;
}

/**
 * Normalizes and extracts body payload and sets appropriate Content-Type header
 */
function prepareBody(body: unknown, headers: Headers): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  // FormData: Native fetch calculates boundary automatically, do NOT set Content-Type
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    headers.delete("Content-Type");
    return body;
  }

  // Raw Blobs / ArrayBuffers / URLSearchParams
  if (
    (typeof Blob !== "undefined" && body instanceof Blob) ||
    body instanceof ArrayBuffer ||
    body instanceof URLSearchParams
  ) {
    return body as BodyInit;
  }

  // String payload
  if (typeof body === "string") {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return body;
  }

  // JSON payload
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return JSON.stringify(body);
}

/**
 * Core internal execute method for serverApiClient
 */
async function executeRequest<T = unknown>(
  endpoint: string,
  options: ServerApiRequestOptions & {
    method?: string;
    body?: unknown;
  },
): Promise<T> {
  const method = options.method?.toUpperCase() || "GET";
  const targetUrl = buildTargetUrl(endpoint, options.params);
  const requestHeaders = await prepareHeaders(options);
  const bodyPayload = prepareBody(options.body, requestHeaders);

  const fetchInit: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: requestHeaders,
    body: bodyPayload,
    cache: options.cache,
    next: options.next,
    signal: options.signal,
    redirect: options.redirect,
  };

  let response: Response;

  try {
    response = await fetch(targetUrl, fetchInit);
  } catch (error: unknown) {
    const rawMessage =
      error instanceof Error ? error.message : "Network fetch request failed";
    const bengali = formatBengaliErrorMessage(0, rawMessage);

    throw new ServerApiError({
      status: 0,
      message: rawMessage,
      bengaliMessage: bengali,
      originalMessage: rawMessage,
      endpoint: targetUrl,
    });
  }

  // 204 No Content handling
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  // Extract response body content
  const contentType = response.headers.get("content-type") || "";
  let payload: unknown = null;

  try {
    if (contentType.includes("json")) {
      payload = await response.json();
    } else {
      const text = await response.text();
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }
  } catch {
    payload = null;
  }

  // Handle HTTP error responses (4xx, 5xx)
  if (!response.ok) {
    const errorEnvelope =
      payload && typeof payload === "object"
        ? (payload as BackendErrorEnvelope)
        : undefined;

    const originalMessage =
      errorEnvelope?.message ||
      errorEnvelope?.error ||
      (typeof payload === "string" && payload.trim().length > 0
        ? payload
        : response.statusText || `HTTP Error ${response.status}`);

    const normalizedMessage = Array.isArray(originalMessage)
      ? originalMessage.join(", ")
      : typeof originalMessage === "string"
        ? originalMessage
        : `HTTP Error ${response.status}`;

    const bengaliMessage = formatBengaliErrorMessage(
      response.status,
      originalMessage,
    );

    throw new ServerApiError({
      status: response.status,
      message: normalizedMessage,
      bengaliMessage,
      originalMessage,
      code: errorEnvelope?.error,
      errors: errorEnvelope?.errors,
      endpoint: targetUrl,
      response,
      data: payload,
    });
  }

  // Return raw payload if rawResponse is requested
  if (options.rawResponse) {
    return payload as T;
  }

  // Standard SellDesk backend envelope unwrapping: { success: true, data: T }
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    (payload as { success: boolean }).success === true &&
    "data" in payload
  ) {
    return (payload as BackendEnvelope<T>).data;
  }

  // Otherwise return raw payload
  return payload as T;
}

/**
 * Dedicated Production-Ready Server-Side API Client for Next.js 15 App Router.
 * Supports native Next.js fetch deduping, cache control, tags revalidation,
 * and automatic server cookie/header propagation.
 */
export const serverApiClient: ServerApiClient = {
  /**
   * HTTP GET method with payload unwrapping and Next.js caching support
   */
  async get<T = unknown>(
    endpoint: string,
    options?: ServerApiRequestOptions,
  ): Promise<T> {
    return executeRequest<T>(endpoint, {
      ...options,
      method: "GET",
    });
  },

  /**
   * HTTP POST method with payload unwrapping
   */
  async post<T = unknown, B = unknown>(
    endpoint: string,
    body?: B,
    options?: ServerApiRequestOptions,
  ): Promise<T> {
    return executeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  },

  /**
   * HTTP PUT method with payload unwrapping
   */
  async put<T = unknown, B = unknown>(
    endpoint: string,
    body?: B,
    options?: ServerApiRequestOptions,
  ): Promise<T> {
    return executeRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  },

  /**
   * HTTP PATCH method with payload unwrapping
   */
  async patch<T = unknown, B = unknown>(
    endpoint: string,
    body?: B,
    options?: ServerApiRequestOptions,
  ): Promise<T> {
    return executeRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  },

  /**
   * HTTP DELETE method with payload unwrapping
   */
  async delete<T = unknown>(
    endpoint: string,
    options?: ServerApiRequestOptions,
  ): Promise<T> {
    return executeRequest<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  },

  /**
   * Multipart/form-data upload method for server actions / route handlers
   */
  async upload<T = unknown>(
    endpoint: string,
    formData: FormData,
    options?: ServerApiRequestOptions,
  ): Promise<T> {
    return executeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
    });
  },

  /**
   * Generic request method supporting custom HTTP verbs
   */
  async request<T = unknown>(
    endpoint: string,
    options: ServerApiRequestOptions & {
      method?: string;
      body?: unknown;
    },
  ): Promise<T> {
    return executeRequest<T>(endpoint, options);
  },
};

export default serverApiClient;
