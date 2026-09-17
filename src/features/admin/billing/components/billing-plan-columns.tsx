"use client";

import React from "react";
import type { ColumnDef } from "@/components/ui/DataTable";
import type { AdminPlanItem } from "../types/billing.types";
import { PlanStatusBadge } from "./PlanStatusBadge";
import { formatBdtCurrency } from "@/features/admin/analytics/utils/formatters";
import { Edit2, Power } from "lucide-react";

export interface PlanColumnOptions {
  onEditPlan: (plan: AdminPlanItem) => void;
  onToggleStatus: (plan: AdminPlanItem) => void;
}

export function getPlanColumns({
  onEditPlan,
  onToggleStatus,
}: PlanColumnOptions): ColumnDef<AdminPlanItem>[] {
  return [
    {
      id: "name",
      header: "PLAN NAME",
      enableSorting: true,
      cell: ({ row }) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-admin-text text-[14px]">
              {row.name}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-admin-brand-soft text-admin-brand">
              {row.durationDays}d
            </span>
          </div>
          {row.features && row.features.length > 0 && (
            <div className="text-[12px] text-admin-text-soft mt-0.5 line-clamp-1 max-w-[280px]">
              {row.features.join(" • ")}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "price",
      header: "PRICE",
      enableSorting: true,
      cell: ({ row }) => (
        <div>
          <span className="font-bold text-admin-text text-[14px]">
            {row.price === 0 ? "Free" : formatBdtCurrency(row.price)}
          </span>
          <span className="text-[12px] text-admin-text-soft ml-1">
            /{row.durationDays} days
          </span>
        </div>
      ),
    },
    {
      id: "limits",
      header: "LIMITS",
      cell: ({ row }) => (
        <div className="text-[12.5px] text-admin-text space-y-0.5">
          <div>
            <span className="text-admin-text-soft">Products: </span>
            <span className="font-medium">
              {row.isUnlimitedProduct
                ? "Unlimited"
                : `${row.productLimit ?? "—"}`}
            </span>
          </div>
          <div>
            <span className="text-admin-text-soft">Staff: </span>
            <span className="font-medium">{row.staffLimit ?? 2} seats</span>
          </div>
        </div>
      ),
    },
    {
      id: "orders",
      header: "ORDERS & PAGES",
      cell: ({ row }) => (
        <div className="text-[12.5px] text-admin-text space-y-0.5">
          <div>
            <span className="text-admin-text-soft">Included: </span>
            <span className="font-medium">{row.freeOrders} orders</span>
          </div>
          <div>
            <span className="text-admin-text-soft">Extra: </span>
            <span className="font-medium">৳{row.extraOrderRate}/ord</span>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "STATUS",
      enableSorting: true,
      cell: ({ row }) => <PlanStatusBadge isActive={row.isActive} />,
    },
    {
      id: "actions",
      header: "ACTIONS",
      headerClassName: "w-28 text-right",
      cellClassName: "w-28 text-right",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEditPlan(row)}
            aria-label={`Edit ${row.name}`}
            className="p-1.5 rounded-[8px] text-admin-text-soft hover:text-admin-brand hover:bg-admin-brand-soft/60 transition-colors cursor-pointer"
            title="Edit plan details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(row)}
            aria-label={`Toggle ${row.name} status`}
            className={`p-1.5 rounded-[8px] transition-colors cursor-pointer ${
              row.isActive
                ? "text-admin-red hover:bg-admin-red-soft/60"
                : "text-admin-green hover:bg-admin-green-soft/60"
            }`}
            title={row.isActive ? "Deactivate plan" : "Activate plan"}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
}
