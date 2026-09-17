"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { getPaymentColumns } from "./payment-columns";
import type { SubscriptionPaymentItem } from "../types/payment.types";

export interface PaymentsTableProps {
  payments: SubscriptionPaymentItem[];
  isLoading?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (columnId: string) => void;
  onReviewPayment: (payment: SubscriptionPaymentItem) => void;
  onViewDetails: (payment: SubscriptionPaymentItem) => void;
}

export function PaymentsTable({
  payments,
  isLoading = false,
  sortBy,
  sortOrder,
  onSortChange,
  onReviewPayment,
  onViewDetails,
}: PaymentsTableProps) {
  const columns = useMemo(
    () =>
      getPaymentColumns({
        onReviewPayment,
        onViewDetails,
      }),
    [onReviewPayment, onViewDetails],
  );

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[16px] overflow-hidden shadow-xs">
      <DataTable
        data={payments}
        columns={columns}
        keyExtractor={(row) => row.id}
        isLoading={isLoading}
        loadingRowsCount={6}
        emptyMessage="No subscription payment records found matching your filters."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
      />
    </div>
  );
}
