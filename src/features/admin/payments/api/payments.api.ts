import { apiClient } from "@/shared/lib/api/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type {
  ApprovePaymentDTO,
  SubscriptionPaymentItem,
  SubscriptionPaymentStatus,
} from "../types/payment.types";

/**
 * Fetch list of subscription payments from backend
 * GET /api/v1/admin/subscriptions/payments
 */
export async function fetchSubscriptionPayments(
  status?: SubscriptionPaymentStatus | "ALL",
): Promise<SubscriptionPaymentItem[]> {
  const queryStatus = status && status !== "ALL" ? status : undefined;
  const url = API_ENDPOINTS.ADMIN.SUBSCRIPTIONS.PAYMENTS(queryStatus);
  const response = await apiClient.get<unknown>(url, { rawResponse: true });
  const rawPayload = (response as { data?: unknown })?.data ?? response;

  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "data" in rawPayload &&
    Array.isArray((rawPayload as { data: unknown }).data)
  ) {
    return (rawPayload as { data: SubscriptionPaymentItem[] }).data;
  }

  if (Array.isArray(rawPayload)) {
    return rawPayload as SubscriptionPaymentItem[];
  }

  return [];
}

/**
 * Approve or reject a subscription payment
 * PATCH /api/v1/admin/subscriptions/payments/:id/approve
 */
export async function approveOrRejectSubscriptionPayment(
  id: string,
  payload: ApprovePaymentDTO,
): Promise<unknown> {
  const url = API_ENDPOINTS.ADMIN.SUBSCRIPTIONS.APPROVE_PAYMENT(id);
  const body: { status: SubscriptionPaymentStatus; note?: string } = {
    status: payload.status,
  };

  if (payload.note && payload.note.trim()) {
    body.note = payload.note.trim();
  }

  return apiClient.patch(url, body);
}
