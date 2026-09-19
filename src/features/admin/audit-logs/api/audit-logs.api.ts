import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type {
  AuditLog,
  AuditLogsMeta,
  AuditLogsQueryParams,
  AuditLogsResponse,
} from "../types/audit-log.types";

export async function fetchAdminAuditLogs(
  query: AuditLogsQueryParams,
): Promise<AuditLogsResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.action?.trim() && query.action.toUpperCase() !== "ALL") {
    params.set("action", query.action.trim());
  }
  if (query.targetType?.trim() && query.targetType.toUpperCase() !== "ALL") {
    params.set("targetType", query.targetType.trim());
  }
  if (query.status && query.status !== "ALL") {
    params.set("status", query.status);
  }
  if (query.startDate) params.set("startDate", query.startDate);
  if (query.endDate) params.set("endDate", query.endDate);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

  const endpoint = `${API_ENDPOINTS.ADMIN.AUDIT_LOGS.LIST}?${params.toString()}`;
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
    const envelope = rawPayload as {
      data: AuditLog[];
      meta?: AuditLogsMeta;
    };
    return {
      data: envelope.data,
      meta: envelope.meta ?? {
        total: envelope.data.length,
        page: query.page || 1,
        limit: query.limit || 10,
        totalPages: Math.ceil(envelope.data.length / (query.limit || 10)) || 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  if (Array.isArray(rawPayload)) {
    return {
      data: rawPayload as AuditLog[],
      meta: {
        total: rawPayload.length,
        page: query.page || 1,
        limit: query.limit || 10,
        totalPages: Math.ceil(rawPayload.length / (query.limit || 10)) || 1,
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
      limit: query.limit || 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

export async function fetchAdminAuditLogDetails(id: string): Promise<AuditLog> {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.ADMIN.AUDIT_LOGS.DETAILS(id),
    { rawResponse: true },
  );
  const rawPayload = (response as { data?: unknown })?.data ?? response;

  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "data" in rawPayload &&
    (rawPayload as { data: unknown }).data
  ) {
    return (rawPayload as { data: AuditLog }).data;
  }

  return rawPayload as AuditLog;
}
