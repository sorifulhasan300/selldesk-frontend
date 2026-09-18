"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminUserDetails } from "../api/admin-users.api";
import type { AdminUserDetails } from "../types/admin-users.types";

/**
 * Hook to retrieve comprehensive administrative user details with store memberships.
 * Query key partitioned: ['admin', 'users', userId]
 */
export function useAdminUserDetails(userId?: string | null) {
  return useQuery<AdminUserDetails>({
    queryKey: ["admin", "users", userId],
    queryFn: () => fetchAdminUserDetails(userId!),
    enabled: Boolean(userId),
    staleTime: 30000,
  });
}
