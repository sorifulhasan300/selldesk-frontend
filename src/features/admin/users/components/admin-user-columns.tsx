"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { ColumnDef } from "@/components/ui/DataTable";
import { formatDisplayDate } from "@/features/admin/analytics/utils/formatters";
import type { AdminUserItem } from "../types/admin-users.types";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserAvatar } from "./UserAvatar";
import { UserRowActions } from "./UserRowActions";
import { UserStatusSwitch } from "./UserStatusSwitch";

export interface UserColumnOptions {
  currentUserId?: string | null;
  onViewDetails: (user: AdminUserItem) => void;
  onChangeRole: (user: AdminUserItem) => void;
  onToggleStatus: (user: AdminUserItem) => void;
  onDelete: (user: AdminUserItem) => void;
}

export function getUserColumns({
  currentUserId,
  onViewDetails,
  onChangeRole,
  onToggleStatus,
  onDelete,
}: UserColumnOptions): ColumnDef<AdminUserItem>[] {
  return [
    {
      id: "name",
      header: "USER",
      enableSorting: true,
      cell: ({ row }) => {
        const isSelf = currentUserId === row.id;
        return (
          <div className="flex items-center gap-3">
            <UserAvatar name={row.name} avatarUrl={row.avatarUrl} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-semibold text-admin-text text-[13.5px] truncate">
                <span>{row.name}</span>
                {isSelf && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-admin-brand/10 text-admin-brand font-medium">
                    You
                  </span>
                )}
              </div>
              <div className="text-[12px] text-admin-text-soft truncate">
                {row.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "role",
      header: "ROLE",
      cell: ({ row }) => <UserRoleBadge role={row.role} />,
    },
    {
      id: "isEmailVerified",
      header: "EMAIL VERIFIED",
      cell: ({ row }) =>
        row.isEmailVerified ? (
          <span className="inline-flex items-center gap-1 text-[12px] text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[12px] text-amber-600 font-medium">
            <XCircle className="w-3.5 h-3.5" />
            <span>Unverified</span>
          </span>
        ),
    },
    {
      id: "status",
      header: "STATUS",
      cell: ({ row }) => (
        <UserStatusSwitch
          isActive={row.isActive}
          isSelf={currentUserId === row.id}
          onToggle={() => onToggleStatus(row)}
        />
      ),
    },
    {
      id: "stores",
      header: "STORES",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] bg-admin-bg border border-admin-line text-[12px] font-medium text-admin-text">
          {row._count?.stores ?? 0}{" "}
          {(row._count?.stores ?? 0) === 1 ? "store" : "stores"}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: "JOINED",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[12.5px] text-admin-text-soft whitespace-nowrap">
          {formatDisplayDate(row.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      headerClassName: "w-10 text-center",
      cellClassName: "w-10 text-center",
      cell: ({ row }) => (
        <UserRowActions
          user={row}
          isCurrentUser={currentUserId === row.id}
          onViewDetails={onViewDetails}
          onChangeRole={onChangeRole}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
