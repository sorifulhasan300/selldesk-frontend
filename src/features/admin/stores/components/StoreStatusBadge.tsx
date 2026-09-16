import React from "react";
import type { StoreOperationalStatus } from "../types/stores.types";

export interface StoreStatusBadgeProps {
  status: StoreOperationalStatus | string;
}

export function StoreStatusBadge({ status }: StoreStatusBadgeProps) {
  const normalized = (status || "").toLowerCase();

  let colorClasses = "bg-admin-green-soft text-admin-green";
  let label = "Active";

  if (normalized === "trial") {
    colorClasses = "bg-admin-gold-soft text-admin-gold";
    label = "Trial";
  } else if (normalized === "suspended" || normalized === "disabled") {
    colorClasses = "bg-admin-red-soft text-admin-red";
    label = "Suspended";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClasses}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-current"
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}
