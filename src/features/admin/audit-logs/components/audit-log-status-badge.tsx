import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { AuditLogStatus } from "../types/audit-log.types";

export interface AuditLogStatusBadgeProps {
  status: AuditLogStatus;
}

export function AuditLogStatusBadge({ status }: AuditLogStatusBadgeProps) {
  if (status === "SUCCESS") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>SUCCESS</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <XCircle className="w-3.5 h-3.5" />
      <span>FAILED</span>
    </span>
  );
}
