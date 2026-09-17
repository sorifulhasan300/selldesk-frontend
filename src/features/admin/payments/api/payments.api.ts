import { apiClient } from "@/shared/lib/api/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type {
  ApprovePaymentDTO,
  SubscriptionPaymentItem,
  SubscriptionPaymentStatus,
  SubscriptionPaymentsMeta,
  SubscriptionPaymentsQuery,
  SubscriptionPaymentsResponse,
  SubscriptionPaymentsStats,
} from "../types/payment.types";

/**
 * Fetch list of subscription payments from backend with search, pagination, and sorting
 * GET /api/v1/admin/subscriptions/payments
 */
export async function fetchSubscriptionPayments(
  query?: SubscriptionPaymentsQuery,
): Promise<SubscriptionPaymentsResponse> {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  if (query?.search && query.search.trim())
    params.set("search", query.search.trim());
  if (query?.status && query.status !== "ALL" && query.status.trim()) {
    params.set("status", query.status.trim().toUpperCase());
  }
  if (query?.sortBy) {
    const sortBy = query.sortBy === "method" ? "paymentMethod" : query.sortBy;
    params.set("sortBy", sortBy);
  }
  if (query?.sortOrder) params.set("sortOrder", query.sortOrder);

  const endpoint = API_ENDPOINTS.ADMIN.SUBSCRIPTIONS.PAYMENTS(
    params.toString(),
  );
  const response = await apiClient.get<unknown>(endpoint, {
    rawResponse: true,
  });
  const rawPayload = (response as { data?: unknown })?.data ?? response;

  const page = query?.page || 1;
  const limit = query?.limit || 10;

  const rawStats =
    (rawPayload as { stats?: SubscriptionPaymentsStats })?.stats ??
    (response as { stats?: SubscriptionPaymentsStats })?.stats;

  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "data" in rawPayload &&
    Array.isArray((rawPayload as { data: unknown }).data)
  ) {
    const p = rawPayload as {
      data: SubscriptionPaymentItem[];
      meta?: SubscriptionPaymentsMeta;
      stats?: SubscriptionPaymentsStats;
    };
    const responseMeta = (response as { meta?: SubscriptionPaymentsMeta })
      ?.meta;
    const meta: SubscriptionPaymentsMeta = p.meta ??
      responseMeta ?? {
        page,
        limit,
        total: p.data.length,
        totalPages: Math.ceil(p.data.length / limit) || 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

    const stats: SubscriptionPaymentsStats = rawStats ??
      p.stats ?? {
        totalTransactions: meta.total,
        pendingApprovals: p.data.filter((item) => item.status === "PENDING")
          .length,
        approvedPayments: p.data.filter((item) => item.status === "APPROVED")
          .length,
        approvedVolume: p.data
          .filter((item) => item.status === "APPROVED")
          .reduce((sum, item) => sum + (item.amount || 0), 0),
      };

    return {
      data: p.data,
      meta,
      stats,
    };
  }

  if (Array.isArray(rawPayload)) {
    const data = rawPayload as SubscriptionPaymentItem[];
    const meta: SubscriptionPaymentsMeta = {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit) || 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
    const stats: SubscriptionPaymentsStats = rawStats ?? {
      totalTransactions: data.length,
      pendingApprovals: data.filter((item) => item.status === "PENDING").length,
      approvedPayments: data.filter((item) => item.status === "APPROVED")
        .length,
      approvedVolume: data
        .filter((item) => item.status === "APPROVED")
        .reduce((sum, item) => sum + (item.amount || 0), 0),
    };
    return {
      data,
      meta,
      stats,
    };
  }

  return {
    data: [],
    meta: {
      page,
      limit,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    stats: rawStats ?? {
      totalTransactions: 0,
      pendingApprovals: 0,
      approvedPayments: 0,
      approvedVolume: 0,
    },
  };
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
