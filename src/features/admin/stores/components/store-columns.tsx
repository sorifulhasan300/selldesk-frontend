"use client";

import React from "react";
import type { ColumnDef } from "@/components/ui/DataTable";
import type { AdminStoreItem } from "../types/stores.types";
import { StoreAvatar } from "./StoreAvatar";
import { StoreStatusBadge } from "./StoreStatusBadge";
import { StorePlanBadge } from "./StorePlanBadge";
import { StoreRowActions } from "./StoreRowActions";
import {
  formatBdtCurrency,
  formatDisplayDate,
} from "@/features/admin/analytics/utils/formatters";

export interface ColumnOptions {
  onExtendTrial: (store: AdminStoreItem) => void;
  onToggleStatus: (store: AdminStoreItem) => void;
  onSwitchContext: (storeId: string) => void;
}

export function getStoreColumns({
  onExtendTrial,
  onToggleStatus,
  onSwitchContext,
}: ColumnOptions): ColumnDef<AdminStoreItem>[] {
  return [
    {
      id: "storeName",
      header: "STORE",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <StoreAvatar name={row.storeName} />
          <div>
            <div className="font-semibold text-admin-text leading-tight text-[13.5px]">
              {row.storeName}
            </div>
            <div className="text-[12px] text-admin-text-soft leading-snug">
              {row.subDomain}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "owner",
      header: "OWNER",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-admin-text leading-tight text-[13px]">
            {row.owner?.name || "No Owner"}
          </div>
          <div className="text-[12px] text-admin-text-soft leading-snug">
            {row.owner?.email || "—"}
          </div>
        </div>
      ),
    },
    {
      id: "plan",
      header: "PLAN :",
      cell: ({ row }) => <StorePlanBadge plan={row.currentPlan} />,
    },
    {
      id: "status",
      header: "STATUS",
      cell: ({ row }) => <StoreStatusBadge status={row.status} />,
    },
    {
      id: "ordersCount",
      header: "ORDERS :",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium text-admin-text text-[13px]">
          {row.ordersCount ?? 0}
        </span>
      ),
    },
    {
      id: "monthlyRevenue",
      header: "REVENUE :",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-semibold text-admin-text text-[13px]">
          {formatBdtCurrency(row.monthlyRevenue ?? 0)}
        </span>
      ),
    },
    {
      id: "createdAt",
      header: "CREATED :",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-admin-text-soft text-[13px]">
          {formatDisplayDate(row.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      headerClassName: "w-10",
      cellClassName: "w-10 text-center",
      cell: ({ row }) => (
        <StoreRowActions
          store={row}
          onExtendTrial={onExtendTrial}
          onToggleStatus={onToggleStatus}
          onSwitchContext={onSwitchContext}
        />
      ),
    },
  ];
}
