"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminAuditLogDetails } from "../api/audit-logs.api";

export function useAdminAuditLogDetails(id: string | null | undefined) {
  return useQuery({
    queryKey: ["admin", "audit-logs", id],
    queryFn: () => {
      if (!id) throw new Error("Audit log ID is required");
      return fetchAdminAuditLogDetails(id);
    },
    enabled: Boolean(id),
    staleTime: 60000,
  });
}
