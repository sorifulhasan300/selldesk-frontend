"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminStoreDetails } from "../api/stores.api";
import type { AdminStoreDetails } from "../types/stores.types";

/**
 * Hook to retrieve full administrative store details by ID.
 * Follows Clean Architecture Pattern B with partition key: ['admin', 'stores', storeId]
 */
export function useAdminStoreDetails(storeId: string) {
  return useQuery<AdminStoreDetails>({
    queryKey: ["admin", "stores", storeId],
    queryFn: () => fetchAdminStoreDetails(storeId),
    enabled: Boolean(storeId),
    staleTime: 30000,
  });
}
