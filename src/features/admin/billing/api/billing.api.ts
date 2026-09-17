import { apiClient } from "@/shared/lib/api/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type {
  AdminPlanItem,
  CreatePlanDTO,
  ExtendTrialDTO,
  UpdatePlanDTO,
} from "../types/billing.types";

export async function fetchAdminPlans(
  includeInactive = true,
): Promise<AdminPlanItem[]> {
  const url = API_ENDPOINTS.ADMIN.SUBSCRIPTIONS.PLANS(includeInactive);
  const response = await apiClient.get<unknown>(url, { rawResponse: true });
  const rawPayload = (response as { data?: unknown })?.data ?? response;

  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "data" in rawPayload &&
    Array.isArray((rawPayload as { data: unknown }).data)
  ) {
    return (rawPayload as { data: AdminPlanItem[] }).data;
  }

  if (Array.isArray(rawPayload)) {
    return rawPayload as AdminPlanItem[];
  }

  return [];
}

export async function createAdminPlan(
  payload: CreatePlanDTO,
): Promise<AdminPlanItem> {
  const url = API_ENDPOINTS.ADMIN.SUBSCRIPTIONS.CREATE_PLAN;
  const body: Record<string, unknown> = {
    name: payload.name.trim(),
    price: Number(payload.price),
  };
  if (payload.durationDays !== undefined) {
    body.durationDays = Number(payload.durationDays);
  }
  if (payload.isUnlimitedProduct !== undefined) {
    body.isUnlimitedProduct = Boolean(payload.isUnlimitedProduct);
  }
  if (!payload.isUnlimitedProduct && payload.productLimit !== undefined) {
    body.productLimit = Number(payload.productLimit);
  }
  if (payload.staffLimit !== undefined) {
    body.staffLimit = Number(payload.staffLimit);
  }
  if (payload.freeOrders !== undefined) {
    body.freeOrders = Number(payload.freeOrders);
  }
  if (payload.extraOrderRate !== undefined) {
    body.extraOrderRate = Number(payload.extraOrderRate);
  }
  if (payload.maxLandingPages !== undefined) {
    body.maxLandingPages = Number(payload.maxLandingPages);
  }
  if (payload.features && Array.isArray(payload.features)) {
    body.features = payload.features;
  }

  const response = await apiClient.post<unknown>(url, body, {
    rawResponse: true,
  });
  const rawPayload = (response as { data?: unknown })?.data ?? response;

  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "data" in rawPayload &&
    rawPayload.data &&
    typeof (rawPayload as { data: unknown }).data === "object"
  ) {
    return (rawPayload as { data: AdminPlanItem }).data;
  }

  return rawPayload as AdminPlanItem;
}

export async function updateAdminPlan(
  id: string,
  payload: UpdatePlanDTO,
): Promise<AdminPlanItem> {
  const url = API_ENDPOINTS.ADMIN.SUBSCRIPTIONS.UPDATE_PLAN(id);
  const body: Record<string, unknown> = {};
  if (payload.name !== undefined) body.name = payload.name.trim();
  if (payload.price !== undefined) body.price = Number(payload.price);
  if (payload.durationDays !== undefined) {
    body.durationDays = Number(payload.durationDays);
  }
  if (payload.isUnlimitedProduct !== undefined) {
    body.isUnlimitedProduct = Boolean(payload.isUnlimitedProduct);
  }
  if (!payload.isUnlimitedProduct && payload.productLimit !== undefined) {
    body.productLimit = Number(payload.productLimit);
  }
  if (payload.staffLimit !== undefined) {
    body.staffLimit = Number(payload.staffLimit);
  }
  if (payload.freeOrders !== undefined) {
    body.freeOrders = Number(payload.freeOrders);
  }
  if (payload.extraOrderRate !== undefined) {
    body.extraOrderRate = Number(payload.extraOrderRate);
  }
  if (payload.maxLandingPages !== undefined) {
    body.maxLandingPages = Number(payload.maxLandingPages);
  }
  if (payload.features !== undefined) body.features = payload.features;
  if (payload.isActive !== undefined) body.isActive = Boolean(payload.isActive);

  const response = await apiClient.patch<unknown>(url, body, {
    rawResponse: true,
  });
  const rawPayload = (response as { data?: unknown })?.data ?? response;

  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "data" in rawPayload &&
    rawPayload.data &&
    typeof (rawPayload as { data: unknown }).data === "object"
  ) {
    return (rawPayload as { data: AdminPlanItem }).data;
  }

  return rawPayload as AdminPlanItem;
}

export async function extendStoreTrial(
  storeId: string,
  payload: ExtendTrialDTO,
): Promise<unknown> {
  const url = API_ENDPOINTS.ADMIN.SUBSCRIPTIONS.EXTEND_TRIAL(storeId);
  return apiClient.patch(url, payload);
}
