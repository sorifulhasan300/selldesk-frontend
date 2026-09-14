"use server";

import {
  serverApiClient,
  ServerApiError,
} from "@/shared/lib/api/server-client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { SUBDOMAIN_REGEX } from "../schemas/onboardingSchema";

export interface SubdomainCheckResult {
  available: boolean;
  message?: string;
  error?: string;
}

export async function checkSubdomainAvailabilityAction(
  subdomain: string,
): Promise<SubdomainCheckResult> {
  const clean = subdomain.trim().toLowerCase();

  if (!clean || clean.length < 3) {
    return {
      available: false,
      message: "Subdomain must be at least 3 characters",
    };
  }

  if (clean.length > 30) {
    return {
      available: false,
      message: "Subdomain cannot exceed 30 characters",
    };
  }

  if (!SUBDOMAIN_REGEX.test(clean)) {
    return {
      available: false,
      message: "Only lowercase letters, numbers, and hyphens allowed",
    };
  }

  try {
    const endpoint = `${API_ENDPOINTS.TENANTS.CHECK_SUBDOMAIN}?subdomain=${encodeURIComponent(clean)}`;
    const response = await serverApiClient.get<{
      available?: boolean;
      isAvailable?: boolean;
    }>(endpoint, { skipAuth: true });

    const isAvailable = response?.available ?? response?.isAvailable ?? true;

    return {
      available: isAvailable,
      message: isAvailable
        ? "Subdomain is available"
        : "Subdomain is already in use",
    };
  } catch (error: unknown) {
    if (error instanceof ServerApiError && error.statusCode === 409) {
      return {
        available: false,
        message: "Subdomain is already taken",
      };
    }

    // Default to format-valid if check endpoint is temporarily offline/unreachable
    return {
      available: true,
      message: "Format is valid",
    };
  }
}
