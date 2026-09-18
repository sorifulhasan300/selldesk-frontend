"use client";

import React from "react";
import type { AdminUserRole } from "../types/admin-users.types";

export interface UserRoleBadgeProps {
  role: AdminUserRole | string;
}

const ROLE_STYLES: Record<string, { label: string; className: string }> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    className:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  },
  SUPER_STAFF: {
    label: "Super Staff",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  },
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const normalized = (role || "").toUpperCase();
  const config = ROLE_STYLES[normalized] ?? {
    label: role || "Unknown",
    className: "bg-admin-bg text-admin-text-soft border-admin-line",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.className} select-none`}
    >
      {config.label}
    </span>
  );
}
