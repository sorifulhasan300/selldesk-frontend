import { AxiosError } from "axios";
import type { ApiErrorOptions, BackendErrorEnvelope } from "./types";

/**
 * Standard HTTP Status Code to Bengali Message Mappings
 */
export const HTTP_STATUS_BENGALI_MAP: Record<number, string> = {
  400: "অনুরোধটি সঠিক নয়। অনুগ্রহ করে তথ্য যাচাই করে পুনরায় চেষ্টা করুন।",
  401: "আপনার লগইন সেশনের মেয়াদ শেষ হয়েছে। অনুগ্রহ করে আবার লগইন করুন।",
  403: "এই তথ্য বা ফিচারে প্রবেশ করার জন্য আপনার প্রয়োজনীয় অনুমতি নেই।",
  404: "অনুরোধ করা তথ্য বা পেজটি খুঁজে পাওয়া যায়নি।",
  405: "অনুরোধ পদ্ধতি এই রুটে সমর্থিত নয়।",
  408: "সার্ভার রেসপন্স করতে অতিরিক্ত সময় নিয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
  409: "এই তথ্যটি ইতিমধ্যে বিদ্যমান অথবা অন্য তথ্যের সাথে বিরোধ তৈরি করছে।",
  413: "ফাইলের আকার অনেক বড়। অনুগ্রহ করে ছোট আকারের ফাইল আপলোড করুন।",
  422: "প্রদত্ত তথ্যে ভুল রয়েছে। অনুগ্রহ করে ফর্মের ভুলগুলো সংশোধন করুন।",
  429: "খুব কম সময়ে অতিরিক্ত অনুরোধ করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।",
  500: "সার্ভারে অভ্যন্তরীণ ত্রুটি দেখা দিয়েছে। আমাদের টিম কাজ করছে, কিছুক্ষণ পর চেষ্টা করুন।",
  502: "গেটওয়ে সার্ভার থেকে কোনো উত্তর পাওয়া যায়নি। সংযোগ পরীক্ষা করুন।",
  503: "সার্ভার এই মুহূর্তে রক্ষণাবেক্ষণ বা অতিরিক্ত চাপের কারণে অনুপলব্ধ।",
  504: "গেটওয়ে সার্ভারের সময়সীমা শেষ হয়েছে। পুনরায় চেষ্টা করুন।",
};

/**
 * Common Backend Error Patterns mapped to natural Bengali
 */
export const BACKEND_MESSAGE_BENGALI_MAP: Array<{
  pattern: RegExp;
  bengali: string;
}> = [
  {
    pattern: /invalid credentials|invalid email or password|wrong password/i,
    bengali: "ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।",
  },
  {
    pattern: /user not found|account not found/i,
    bengali: "এই তথ্যের কোনো ব্যবহারকারী বা অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।",
  },
  {
    pattern: /email already exists|email already in use|email.*taken/i,
    bengali: "এই ইমেইল এড্রেস দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।",
  },
  {
    pattern: /phone.*already exists|phone.*already in use/i,
    bengali: "এই ফোন নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত রয়েছে।",
  },
  {
    pattern:
      /subdomain.*already taken|subdomain.*already in use|subdomain.*exists/i,
    bengali:
      "এই সাবডোমেনটি ইতিমধ্যে অন্য কেউ ব্যবহার করছেন। অন্য নাম নির্বাচন করুন।",
  },
  {
    pattern: /store not found/i,
    bengali: "নির্দিষ্ট স্টোরটি খুঁজে পাওয়া যায়নি। সাবডোমেন যাচাই করুন।",
  },
  {
    pattern: /store is suspended|store is inactive/i,
    bengali:
      "স্টোরটি সাময়িকভাবে স্থগিত বা নিষ্ক্রিয় রয়েছে। সাপোর্টে যোগাযোগ করুন।",
  },
  {
    pattern: /subscription expired|plan expired/i,
    bengali:
      "আপনার স্টোরের সাবস্ক্রিপশন প্ল্যানের মেয়াদ শেষ হয়েছে। নবায়ন করুন।",
  },
  {
    pattern: /jwt expired|token.*expired/i,
    bengali: "আপনার লগইন সেশনের মেয়াদ শেষ হয়ে গেছে। পুনরায় লগইন করুন।",
  },
  {
    pattern: /jwt malformed|invalid token|invalid signature/i,
    bengali: "লগইন সেশনটি অবৈধ। অনুগ্রহ করে পুনরায় লগইন করুন।",
  },
  {
    pattern: /network error|failed to fetch/i,
    bengali: "ইন্টারনেট সংযোগ বিচ্ছিন্ন অথবা সার্ভারে পৌঁছানো সম্ভব হচ্ছে না।",
  },
  {
    pattern: /timeout of \d+ms exceeded|timeout/i,
    bengali:
      "অনুরোধের সময়সীমা পার হয়ে গেছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।",
  },
  {
    pattern: /request aborted|canceled/i,
    bengali: "অনুরোধটি বাতিল করা হয়েছে।",
  },
];

/**
 * Formats raw backend error message strings or arrays into idiomatic Bengali
 */
export function formatBengaliErrorMessage(
  statusCode?: number,
  rawMessage?: string | string[],
): string {
  // 1. If raw message is an array (e.g. class-validator validation errors)
  if (Array.isArray(rawMessage) && rawMessage.length > 0) {
    const joined = rawMessage.join(", ");
    // Check if any array item matches known patterns
    for (const rule of BACKEND_MESSAGE_BENGALI_MAP) {
      if (rule.pattern.test(joined)) {
        return rule.bengali;
      }
    }
    // If array items are in Bengali, return directly
    if (/[\u0980-\u09FF]/.test(joined)) {
      return joined;
    }
    // For validation arrays (e.g. class-validator)
    return "প্রদত্ত তথ্যে ভুল রয়েছে। অনুগ্রহ করে তথ্য যাচাই করে পুনরায় চেষ্টা করুন।";
  }

  // 2. If raw message is a single string
  if (typeof rawMessage === "string" && rawMessage.trim().length > 0) {
    const trimmed = rawMessage.trim();

    // If message is already written in Bengali, preserve it
    if (/[\u0980-\u09FF]/.test(trimmed)) {
      return trimmed;
    }

    // Check against common backend English message patterns
    for (const rule of BACKEND_MESSAGE_BENGALI_MAP) {
      if (rule.pattern.test(trimmed)) {
        return rule.bengali;
      }
    }
  }

  // 3. Fall back to HTTP status code mapping
  if (statusCode && HTTP_STATUS_BENGALI_MAP[statusCode]) {
    return HTTP_STATUS_BENGALI_MAP[statusCode];
  }

  // 4. Default general fallback
  return "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।";
}

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
  fallbackMessage = "একটি সমস্যা দেখা দিয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।",
): string {
  if (!error) return fallbackMessage;

  if (isApiError(error)) {
    return error.bengaliMessage || fallbackMessage;
  }

  const parsed = parseApiError(error);
  return parsed.bengaliMessage || fallbackMessage;
}
