/**
 * Generic API Response and Contract Types for SellDesk
 * Fully aligned with NestJS backend TransformInterceptor & HttpExceptionFilter envelopes.
 */

/**
 * Pagination metadata contract returned from paginated endpoints
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Standard successful API response envelope
 * @template T - The response payload data type
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta | Record<string, unknown>;
  timestamp?: string;
  path?: string;
}

/**
 * Standard error API response envelope
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error?: string;
  path?: string;
  timestamp?: string;
  errors?: Record<string, string[]>;
}

/**
 * Standard paginated API response envelope
 * @template T - The individual item type inside data array
 */
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  meta: PaginationMeta;
  timestamp?: string;
  path?: string;
}

/**
 * Multi-tenant HTTP headers used across SellDesk API requests
 */
export interface ApiMultiTenantHeaders {
  "x-store-id"?: string;
  "x-tenant-id"?: string;
  "x-subdomain"?: string;
  authorization?: string;
}
