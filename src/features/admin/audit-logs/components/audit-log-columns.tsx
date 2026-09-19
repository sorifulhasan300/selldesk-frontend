"use client";

import React from "react";
import { Eye, Globe } from "lucide-react";
import type { ColumnDef } from "@/components/ui/DataTable";
import { UserAvatar } from "@/features/admin/users/components/UserAvatar";
import { UserRoleBadge } from "@/features/admin/users/components/UserRoleBadge";
import type { AuditLog } from "../types/audit-log.types";
import { AuditLogActionBadge } from "./audit-log-action-badge";
import { AuditLogStatusBadge } from "./audit-log-status-badge";
import {
  formatAuditDateTime,
  parseDeviceString,
  truncateSnippet,
} from "../utils/audit-log-formatters";

export interface AuditLogColumnsOptions {
  onViewDetails: (log: AuditLog) => void;
}

export function getAuditLogColumns({
  onViewDetails,
}: AuditLogColumnsOptions): ColumnDef<AuditLog>[] {
  return [
    {
      id: "createdAt",
      header: "TIMESTAMP",
      enableSorting: true,
      cell: ({ row }) => {
        const { formatted, relative } = formatAuditDateTime(row.createdAt);
        return (
          <div className="flex flex-col whitespace-nowrap">
            <span className="font-semibold text-admin-text text-[12.5px]">
              {formatted}
            </span>
            {relative && (
              <span className="text-[11px] text-admin-text-soft">
                {relative}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actor",
      header: "ACTOR",
      cell: ({ row }) => {
        const actor = row.actor;
        const name = actor?.name || row.actorEmail || "System Automation";
        const email =
          actor?.email || row.actorEmail || "system@selldesk.internal";
        const role = actor?.role || row.actorRole || "SYSTEM";

        return (
          <div className="flex items-center gap-2.5 min-w-[190px]">
            <UserAvatar
              name={name}
              avatarUrl={actor?.avatarUrl}
              className="w-8 h-8 text-[11px] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-semibold text-admin-text text-[12.5px] truncate">
                  {name}
                </span>
                <UserRoleBadge role={role} size="sm" />
              </div>
              <span className="text-[11px] text-admin-text-soft truncate block mt-0.5">
                {email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "action",
      header: "ACTION",
      enableSorting: true,
      cellClassName: "whitespace-nowrap",
      cell: ({ row }) => <AuditLogActionBadge action={row.action} />,
    },
    {
      id: "targetType",
      header: "TARGET",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-[12px] whitespace-nowrap">
          <span className="font-semibold text-admin-text bg-admin-bg px-2 py-0.5 rounded-[6px] border border-admin-line">
            {row.targetType}
          </span>
          {row.targetId && (
            <span
              className="text-admin-text-soft font-mono text-[11px]"
              title={row.targetId}
            >
              #{truncateSnippet(row.targetId, 8)}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "store",
      header: "STORE",
      cell: ({ row }) => {
        if (!row.store)
          return <span className="text-admin-text-soft text-[12px]">—</span>;
        return (
          <div className="flex items-center gap-1.5 text-[12px] whitespace-nowrap">
            <Globe className="w-3.5 h-3.5 text-admin-text-soft shrink-0" />
            <span className="font-medium text-admin-text truncate max-w-[120px]">
              {row.store.storeName}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-mono">
              {row.store.subDomain}
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "STATUS",
      cellClassName: "whitespace-nowrap",
      cell: ({ row }) => <AuditLogStatusBadge status={row.status} />,
    },
    {
      id: "ipAddress",
      header: "IP & DEVICE",
      cell: ({ row }) => (
        <div
          className="flex flex-col text-[11.5px] max-w-[140px]"
          title={row.userAgent || row.ipAddress || ""}
        >
          <span className="font-mono text-admin-text font-medium whitespace-nowrap">
            {row.ipAddress || "Internal"}
          </span>
          <span className="text-admin-text-soft truncate">
            {parseDeviceString(row.userAgent)}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      headerClassName: "w-16 text-center",
      cellClassName: "w-16 text-center whitespace-nowrap",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onViewDetails(row)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-admin-bg hover:bg-admin-line/60 text-admin-text font-medium text-[11.5px] border border-admin-line transition-colors cursor-pointer"
          title="View full audit log details"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>
      ),
    },
  ];
}
