"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { getPlanColumns } from "./billing-plan-columns";
import type { AdminPlanItem } from "../types/billing.types";

export interface BillingPlansTableProps {
  plans: AdminPlanItem[];
  isLoading?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (columnId: string) => void;
  onEditPlan: (plan: AdminPlanItem) => void;
  onToggleStatus: (plan: AdminPlanItem) => void;
}

export function BillingPlansTable({
  plans,
  isLoading = false,
  sortBy,
  sortOrder,
  onSortChange,
  onEditPlan,
  onToggleStatus,
}: BillingPlansTableProps) {
  const columns = useMemo(
    () =>
      getPlanColumns({
        onEditPlan,
        onToggleStatus,
      }),
    [onEditPlan, onToggleStatus],
  );

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[16px] overflow-hidden shadow-xs">
      <DataTable
        data={plans}
        columns={columns}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        loadingRowsCount={5}
        emptyMessage="No subscription plans found matching your criteria."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
      />
    </div>
  );
}
