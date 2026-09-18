import { apiClient } from "@/shared/lib/api/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type {
  AdminUserDetails,
  AdminUserItem,
  AdminUsersQuery,
  AdminUsersResponse,
  CreateAdminStaffDTO,
  UpdateUserRoleDTO,
  UpdateUserStatusDTO,
} from "../types/admin-users.types";

export async function fetchAdminUsers(
  query: AdminUsersQuery,
): Promise<AdminUsersResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.role && query.role.trim() && query.role.toUpperCase() !== "ALL") {
    params.set("role", query.role.trim().toUpperCase());
  }
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

  const endpoint = `${API_ENDPOINTS.ADMIN.USERS.LIST}?${params.toString()}`;
  const response = await apiClient.get<unknown>(endpoint, {
    rawResponse: true,
  });
  const rawPayload = (response as { data?: unknown })?.data ?? response;

  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "data" in rawPayload &&
    (rawPayload as { data: unknown }).data &&
    typeof (rawPayload as { data: unknown }).data === "object"
  ) {
    const envelope = (rawPayload as { data: AdminUsersResponse }).data;
    if (Array.isArray(envelope?.items)) {
      return envelope;
    }
  }

  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "items" in rawPayload &&
    Array.isArray((rawPayload as AdminUsersResponse).items)
  ) {
    return rawPayload as AdminUsersResponse;
  }

  return {
    items: [],
    meta: {
      total: 0,
      page: query.page || 1,
      limit: query.limit || 10,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
}

export async function fetchAdminUserDetails(
  id: string,
): Promise<AdminUserDetails> {
  const response = await apiClient.get<unknown>(
    API_ENDPOINTS.ADMIN.USERS.DETAILS(id),
    { rawResponse: true },
  );
  const rawPayload = (response as { data?: unknown })?.data ?? response;

  if (
    rawPayload &&
    typeof rawPayload === "object" &&
    "data" in rawPayload &&
    (rawPayload as { data: unknown }).data
  ) {
    return (rawPayload as { data: AdminUserDetails }).data;
  }

  return rawPayload as AdminUserDetails;
}

export async function createAdminStaff(
  payload: CreateAdminStaffDTO,
): Promise<AdminUserItem> {
  return apiClient.post(API_ENDPOINTS.ADMIN.USERS.CREATE, payload);
}

export async function updateAdminUserRole(
  id: string,
  payload: UpdateUserRoleDTO,
): Promise<AdminUserItem> {
  return apiClient.patch(API_ENDPOINTS.ADMIN.USERS.ROLE(id), payload);
}

export async function updateAdminUserStatus(
  id: string,
  payload: UpdateUserStatusDTO,
): Promise<AdminUserItem> {
  return apiClient.patch(API_ENDPOINTS.ADMIN.USERS.STATUS(id), payload);
}

export async function deleteAdminUser(
  id: string,
): Promise<{ id: string; message: string }> {
  return apiClient.delete(API_ENDPOINTS.ADMIN.USERS.DELETE(id));
}
