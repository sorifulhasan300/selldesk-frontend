import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuditLogTable } from "@/features/admin/audit-logs";

export const metadata: Metadata = {
  title: "Audit Logs | SellDesk Admin",
  description:
    "Review platform activity trails, security events, and administrative actions.",
};

function AuditLogsTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-48 bg-admin-line rounded-[10px]" />
      <div className="h-[400px] w-full bg-admin-surface border border-admin-line rounded-[18px]" />
    </div>
  );
}

export default function AdminAuditLogsPage() {
  return (
    <Suspense fallback={<AuditLogsTableSkeleton />}>
      <AuditLogTable />
    </Suspense>
  );
}
