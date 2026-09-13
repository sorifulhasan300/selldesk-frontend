import { AxiosError } from "axios";
import type { ApiErrorOptions, BackendErrorEnvelope } from "./types";

/**
 * Standard HTTP Status Code to Error Message Mappings
 */
export const HTTP_STATUS_MESSAGE_MAP: Record<number, string> = {
  400: "Invalid request. Please check your information and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  405: "HTTP method not supported for this route.",
  408: "Request timed out. Please try again.",
  409: "A conflict occurred. The resource may already exist.",
  413: "File size is too large. Please upload a smaller file.",
  422: "Validation failed. Please correct the errors and try again.",
  429: "Too many requests. Please slow down and try again shortly.",
  500: "Internal server error. Please try again in a few moments.",
  502: "Bad gateway. Unable to reach server.",
  503: "Service unavailable. Server is under maintenance or overloaded.",
  504: "Gateway timeout. Please try again.",
};

export const HTTP_STATUS_BENGALI_MAP = HTTP_STATUS_MESSAGE_MAP;

/**
 * Common Backend Error Patterns mapped to natural English messages
 */
export const BACKEND_MESSAGE_MAP: Array<{
  pattern: RegExp;
  message: string;
}> = [
  {
    pattern: /invalid credentials|invalid email or password|wrong password/i,
    message: "Invalid email or password. Please try again.",
  },
  {
    pattern: /user not found|account not found/i,
    message: "No user account was found with these details.",
  },
  {
    pattern: /email already exists|email already in use|email.*taken/i,
    message: "An account with this email address already exists.",
  },
  {
    pattern: /phone.*already exists|phone.*already in use/i,
    message: "An account with this phone number already exists.",
  },
  {
    pattern:
      /subdomain.*already taken|subdomain.*already in use|subdomain.*exists/i,
    message: "This subdomain is already taken. Please choose another one.",
  },
  {
    pattern: /store not found/i,
    message: "Store not found. Please verify the subdomain.",
  },
  {
    pattern: /store is suspended|store is inactive/i,
    message:
      "This store is temporarily inactive or suspended. Please contact support.",
  },
  {
    pattern: /subscription expired|plan expired/i,
    message: "Your subscription plan has expired. Please renew to continue.",
  },
  {
    pattern: /jwt expired|token.*expired/i,
    message: "Your session has expired. Please log in again.",
  },
  {
    pattern: /jwt malformed|invalid token|invalid signature/i,
    message: "Invalid session token. Please log in again.",
  },
  {
    pattern: /network error|failed to fetch/i,
    message: "Network error. Unable to connect to the server.",
  },
  {
    pattern: /timeout of \d+ms exceeded|timeout/i,
    message: "Request timed out. Please check your connection and try again.",
  },
  {
    pattern: /request aborted|canceled/i,
    message: "The request was canceled.",
  },
];

export const BACKEND_MESSAGE_BENGALI_MAP = BACKEND_MESSAGE_MAP.map((item) => ({
  pattern: item.pattern,
  bengali: item.message,
}));

/**
 * Formats raw backend error message strings or arrays into user-friendly English
 */
export function formatBengaliErrorMessage(
  statusCode?: number,
  rawMessage?: string | string[],
): string {
  // 1. If raw message is an array (e.g. class-validator validation errors)
  if (Array.isArray(rawMessage) && rawMessage.length > 0) {
    const joined = rawMessage.join(", ");
    // Check if any array item matches known patterns
    for (const rule of BACKEND_MESSAGE_MAP) {
      if (rule.pattern.test(joined)) {
        return rule.message;
      }
    }
    return joined;
  }

  // 2. If raw message is a single string
  if (typeof rawMessage === "string" && rawMessage.trim().length > 0) {
    const trimmed = rawMessage.trim();

    // Check against common backend message patterns
    for (const rule of BACKEND_MESSAGE_MAP) {
      if (rule.pattern.test(trimmed)) {
        return rule.message;
      }
    }

    return trimmed;
  }

  // 3. Fall back to HTTP status code mapping
  if (statusCode && HTTP_STATUS_MESSAGE_MAP[statusCode]) {
    return HTTP_STATUS_MESSAGE_MAP[statusCode];
  }

  // 4. Default general fallback
  return "An unexpected error occurred. Please try again.";
}

export const formatApiErrorMessage = formatBengaliErrorMessage;

/**
 * Custom Error Class representing a structured API error response
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly bengaliMessage: string;
  readonly originalMessage: string | string[];
  readonly code?: string;
  readonly errors?: Record<string, string[]>;
  readonly rawError?: AxiosError;

  constructor(options: ApiErrorOptions) {
    // Standard Error message defaults to the user-friendly Bengali message
    super(options.bengaliMessage || options.message);

    this.name = "ApiError";
    this.statusCode = options.statusCode;
    this.bengaliMessage = options.bengaliMessage;
    this.originalMessage = options.originalMessage ?? options.message;
    this.code = options.code;
    this.errors = options.errors;
    this.rawError = options.rawError;

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get status(): number {
    return this.statusCode;
  }

  get isBadRequest(): boolean {
    return this.statusCode === 400;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isConflict(): boolean {
    return this.statusCode === 409;
  }

  get isValidationError(): boolean {
    return (
      this.statusCode === 422 || (this.statusCode === 400 && !!this.errors)
    );
  }

  get isRateLimited(): boolean {
    return this.statusCode === 429;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  get isNetworkError(): boolean {
    return (
      this.statusCode === 0 ||
      (Boolean(this.rawError) && !this.rawError?.response)
    );
  }
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Parse and convert an unknown error into a structured ApiError
 */
export function parseApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof AxiosError) {
    const statusCode = error.response?.status || 0;
    const responseData = error.response?.data as
      | BackendErrorEnvelope
      | undefined;

    const originalMessage =
      responseData?.message ||
      responseData?.error ||
      error.message ||
      "Unknown error";

    const bengaliMessage = formatBengaliErrorMessage(
      statusCode,
      originalMessage,
    );

    return new ApiError({
      statusCode,
      message:
        typeof originalMessage === "string"
          ? originalMessage
          : originalMessage.join(", "),
      bengaliMessage,
      originalMessage,
      code: responseData?.error || error.code,
      errors: responseData?.errors,
      rawError: error,
    });
  }

  if (error instanceof Error) {
    const errorWithStatus = error as Error & {
      statusCode?: number;
      status?: number;
      errors?: Record<string, string[]>;
      code?: string;
    };
    const statusCode =
      errorWithStatus.statusCode || errorWithStatus.status || 0;
    const bengaliMessage = formatBengaliErrorMessage(
      statusCode || undefined,
      error.message,
    );
    return new ApiError({
      statusCode,
      message: error.message,
      bengaliMessage,
      originalMessage: error.message,
      code: errorWithStatus.code,
      errors: errorWithStatus.errors,
    });
  }

  const stringified = String(error || "Unknown error");
  return new ApiError({
    statusCode: 0,
    message: stringified,
    bengaliMessage: formatBengaliErrorMessage(undefined, stringified),
    originalMessage: stringified,
  });
}

/**
 * Primary helper function to safely extract a user-facing Bengali error message
 * from any error type (ApiError, AxiosError, Error, string, or unknown)
 *
 * @example
 * ```ts
 * try {
 *   await apiClient.post("/orders", data);
 * } catch (err) {
 *   toast.error(getApiErrorMessage(err));
 * }
 * ```
 */
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "An unexpected error occurred. Please try again.",
): string {
  if (!error) return fallbackMessage;

  if (isApiError(error)) {
    return error.bengaliMessage || fallbackMessage;
  }

  const parsed = parseApiError(error);
  return parsed.bengaliMessage || fallbackMessage;
}
