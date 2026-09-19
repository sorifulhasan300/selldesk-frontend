import React from "react";

export interface AuditLogActionBadgeProps {
  action: string;
}

export function formatActionName(action: string): string {
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function AuditLogActionBadge({ action }: AuditLogActionBadgeProps) {
  const upper = action.toUpperCase();

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (
    upper.includes("DELETE") ||
    upper.includes("REMOVE") ||
    upper.includes("SUSPEND") ||
    upper.includes("REJECT")
  ) {
    colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (
    upper.includes("CREATE") ||
    upper.includes("ADD") ||
    upper.includes("APPROVE") ||
    upper.includes("REGISTER")
  ) {
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (upper.includes("ROLE") || upper.includes("PLAN")) {
    colorClasses = "bg-sky-50 text-sky-700 border-sky-200";
  } else if (
    upper.includes("UPDATE") ||
    upper.includes("STATUS") ||
    upper.includes("EDIT")
  ) {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (upper.includes("SWITCH") || upper.includes("AUTH")) {
    colorClasses = "bg-purple-50 text-purple-700 border-purple-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold border whitespace-nowrap shrink-0 ${colorClasses} tracking-tight select-none`}
    >
      {formatActionName(action)}
    </span>
  );
}
