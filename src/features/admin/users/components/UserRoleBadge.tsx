"use client";

import React from "react";
import type { AdminUserRole } from "../types/admin-users.types";

export interface UserRoleBadgeProps {
  role: AdminUserRole | string;
  size?: "sm" | "md";
}

const ROLE_STYLES: Record<string, { label: string; className: string }> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  SUPER_STAFF: {
    label: "Super Staff",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  STORE_OWNER: {
    label: "Owner",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  STORE_MANAGER: {
    label: "Manager",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  STORE_STAFF: {
    label: "Staff",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  SYSTEM: {
    label: "System",
    className: "bg-zinc-100 text-zinc-700 border-zinc-200",
  },
};

export function UserRoleBadge({ role, size = "md" }: UserRoleBadgeProps) {
  const normalized = (role || "").toUpperCase();
  const config = ROLE_STYLES[normalized] ?? {
    label: role || "Unknown",
    className: "bg-admin-bg text-admin-text-soft border-admin-line",
  };

  const sizeClass =
    size === "sm"
      ? "text-[10px] px-1.5 py-0.2 leading-tight"
      : "text-[11px] px-2 py-0.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border whitespace-nowrap shrink-0 ${sizeClass} ${config.className} select-none`}
    >
      {config.label}
    </span>
  );
}
