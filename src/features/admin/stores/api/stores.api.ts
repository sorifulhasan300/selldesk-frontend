import { apiClient } from "@/shared/lib/api/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type {
  AdminStoreDetails,
  AdminStoreItem,
  AdminStoresMeta,
  AdminStoresQuery,
  AdminStoresResponse,
} from "../types/stores.types";

export async function fetchAdminStores(
  query: AdminStoresQuery,
): Promise<AdminStoresResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search && query.search.trim())
    params.set("search", query.search.trim());
  if (query.status && query.status.toLowerCase() !== "all" && query.status.trim())
    params.set("status", query.status.trim().toUpperCase());
  if (query.plan && query.plan.toLowerCase() !== "all" && query.plan.trim())
    params.set("plan", query.plan.trim());
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

  const endpoint = `${API_ENDPOINTS.ADMIN.STORES.LIST}?${params.toString()}`;

  // Fetch live data directly from the NestJS backend
  const response = await apiClient.get<unknown>(endpoint, {
    rawResponse: true,
  });
  const rawPayload = (response as { data?: unknown })?.data ?? response;

  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "data" in rawPayload &&
    Array.isArray((rawPayload as { data: unknown }).data)
  ) {
    const p = rawPayload as {
      data: AdminStoreItem[];
      meta?: AdminStoresMeta;
    };
    return {
      data: p.data,
      meta: p.meta ?? {
        total: p.data.length,
        page: query.page || 1,
        limit: query.limit || 6,
        totalPages: Math.ceil(p.data.length / (query.limit || 6)) || 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  if (Array.isArray(rawPayload)) {
    return {
      data: rawPayload,
      meta: {
        total: rawPayload.length,
        page: query.page || 1,
        limit: query.limit || 6,
        totalPages: Math.ceil(rawPayload.length / (query.limit || 6)) || 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  return {
    data: [],
    meta: {
      total: 0,
      page: query.page || 1,
      limit: query.limit || 6,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

export async function updateAdminStoreStatus(id: string, status: string) {
  return apiClient.patch(API_ENDPOINTS.ADMIN.STORES.STATUS(id), { status });
}

export async function switchAdminStoreContext(id: string) {
  return apiClient.post(API_ENDPOINTS.ADMIN.STORES.SWITCH(id));
}

export async function fetchAdminStoreDetails(
  id: string,
): Promise<AdminStoreDetails> {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.ADMIN.STORES.DETAILS(id),
    { rawResponse: true },
  );
  const rawPayload = (response as { data?: unknown })?.data ?? response;
  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "data" in rawPayload &&
    rawPayload.data &&
    typeof (rawPayload as { data: unknown }).data === "object"
  ) {
    return (rawPayload as { data: AdminStoreDetails }).data;
  }
  return rawPayload as AdminStoreDetails;
}
