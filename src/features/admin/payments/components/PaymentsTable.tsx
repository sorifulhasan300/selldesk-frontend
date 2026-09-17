"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { getPaymentColumns } from "./payment-columns";
import { PaymentsPagination } from "./PaymentsPagination";
import type {
  SubscriptionPaymentItem,
  SubscriptionPaymentsMeta,
} from "../types/payment.types";

export interface PaymentsTableProps {
  payments: SubscriptionPaymentItem[];
  meta?: SubscriptionPaymentsMeta;
  isLoading?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (columnId: string) => void;
  onReviewPayment: (payment: SubscriptionPaymentItem) => void;
  onViewDetails: (payment: SubscriptionPaymentItem) => void;
  page?: number;
  setPage?: (page: number) => void;
  limit?: number;
  setLimit?: (limit: number) => void;
}

export function PaymentsTable({
  payments,
  meta,
  isLoading = false,
  sortBy,
  sortOrder,
  onSortChange,
  onReviewPayment,
  onViewDetails,
  setPage,
  limit = 10,
  setLimit,
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
        loadingRowsCount={limit}
        emptyMessage="No subscription payment records found matching your filters."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
      />
      {meta && setPage && setLimit && (
        <PaymentsPagination
          meta={meta}
          rowsPerPage={limit}
          onRowsPerPageChange={setLimit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
