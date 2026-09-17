"use client";

import React from "react";
import type { ColumnDef } from "@/components/ui/DataTable";
import type { SubscriptionPaymentItem } from "../types/payment.types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import {
  formatBdtCurrency,
  formatDisplayDate,
} from "@/features/admin/analytics/utils/formatters";
import { CheckCircle, Eye } from "lucide-react";

export interface PaymentColumnOptions {
  onReviewPayment: (payment: SubscriptionPaymentItem) => void;
  onViewDetails: (payment: SubscriptionPaymentItem) => void;
}

export function getPaymentColumns({
  onReviewPayment,
  onViewDetails,
}: PaymentColumnOptions): ColumnDef<SubscriptionPaymentItem>[] {
  return [
    {
      id: "store",
      header: "STORE",
      enableSorting: true,
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-admin-text text-[13.5px]">
            {row.store?.storeName || "Unknown Store"}
          </div>
          <div className="text-[12px] text-admin-text-soft">
            {row.store?.subDomain ? `${row.store.subDomain}.selldesk.com` : "—"}
          </div>
        </div>
      ),
    },
    {
      id: "plan",
      header: "SUBSCRIPTION PLAN",
      enableSorting: true,
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-admin-text text-[13.5px]">
            {row.plan?.name || "Standard Plan"}
          </span>
          <span className="ml-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full bg-admin-brand-soft text-admin-brand">
            {row.plan?.durationDays ?? 30}d
          </span>
        </div>
      ),
    },
    {
      id: "amount",
      header: "AMOUNT",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-bold text-admin-text text-[14px]">
          {formatBdtCurrency(row.amount)}
        </span>
      ),
    },
    {
      id: "method",
      header: "METHOD & TRX ID",
      cell: ({ row }) => (
        <div className="space-y-1">
          <PaymentMethodBadge method={row.paymentMethod} />
          {row.transactionId && (
            <div className="text-[11.5px] font-mono text-admin-text-soft bg-admin-bg px-1.5 py-0.5 rounded-[4px] inline-block max-w-[180px] truncate">
              {row.transactionId}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "createdAt",
      header: "DATE",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[12.5px] text-admin-text-soft">
          {formatDisplayDate(row.createdAt)}
        </span>
      ),
    },
    {
      id: "status",
      header: "STATUS",
      enableSorting: true,
      cell: ({ row }) => <PaymentStatusBadge status={row.status} />,
    },
    {
      id: "actions",
      header: "ACTION",
      headerClassName: "w-32 text-right",
      cellClassName: "w-32 text-right",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status === "PENDING" ? (
            <button
              type="button"
              onClick={() => onReviewPayment(row)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] bg-admin-green-soft text-admin-green hover:bg-admin-green/20 text-[12px] font-semibold transition-colors cursor-pointer"
              title="Review and approve payment"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onViewDetails(row)}
              className="p-1.5 rounded-[8px] text-admin-text-soft hover:text-admin-brand hover:bg-admin-brand-soft transition-colors cursor-pointer"
              title="View transaction details"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];
}
