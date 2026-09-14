"use server";

import { serverApiClient } from "@/shared/lib/api/server-client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import {
  type BackendPlan,
  type PlanPackage,
  transformBackendPlanToPackage,
} from "../types/plan.types";

/**
 * Server Action: Fetches active SaaS subscription plans dynamically from the database
 * via backend endpoint GET /api/v1/subscriptions/plans.
 */
export async function fetchSubscriptionPlansAction(): Promise<{
  success: boolean;
  plans: PlanPackage[];
  error?: string;
}> {
  try {
    const response = await serverApiClient.get<
      BackendPlan[] | { data: BackendPlan[] }
    >(API_ENDPOINTS.SUBSCRIPTIONS.PLANS, {
      skipAuth: true,
      cache: "no-store",
    });

    const rawPlans = Array.isArray(response)
      ? response
      : (response as { data: BackendPlan[] })?.data;

    if (!rawPlans || !Array.isArray(rawPlans)) {
      return {
        success: false,
        plans: [],
        error: "Failed to parse subscription plans from server.",
      };
    }

    const dynamicPackages = rawPlans
      .filter((p) => p.isActive !== false)
      .sort((a, b) => a.price - b.price)
      .map(transformBackendPlanToPackage);

    return {
      success: true,
      plans: dynamicPackages,
    };
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Unable to connect to plans service";
    return {
      success: false,
      plans: [],
      error: errorMsg,
    };
  }
}
