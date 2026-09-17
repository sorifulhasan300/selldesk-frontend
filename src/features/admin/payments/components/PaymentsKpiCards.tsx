"use client";

import React from "react";
import { Receipt, CheckCircle2, Clock, Banknote } from "lucide-react";
import type {
  SubscriptionPaymentItem,
  SubscriptionPaymentsStats,
} from "../types/payment.types";
import { formatBdtCurrency } from "@/features/admin/analytics/utils/formatters";

export interface PaymentsKpiCardsProps {
  stats?: SubscriptionPaymentsStats;
  payments?: SubscriptionPaymentItem[];
  isLoading?: boolean;
}

export function PaymentsKpiCards({
  stats,
  payments,
  isLoading,
}: PaymentsKpiCardsProps) {
  const totalCount = stats ? stats.totalTransactions : (payments?.length ?? 0);
  const pendingCount = stats
    ? stats.pendingApprovals
    : (payments?.filter((p) => p.status === "PENDING").length ?? 0);
  const approvedCount = stats
    ? stats.approvedPayments
    : (payments?.filter((p) => p.status === "APPROVED").length ?? 0);
  const totalApprovedVolume = stats
    ? stats.approvedVolume
    : (payments
        ?.filter((p) => p.status === "APPROVED")
        .reduce((sum, p) => sum + (p.amount || 0), 0) ?? 0);

  const cards = [
    {
      label: "Total Transactions",
      value: totalCount,
      icon: Receipt,
      color: "text-admin-brand",
      bgColor: "bg-admin-brand-soft",
    },
    {
      label: "Pending Approvals",
      value: pendingCount,
      icon: Clock,
      color: "text-admin-gold",
      bgColor: "bg-admin-gold-soft",
    },
    {
      label: "Approved Payments",
      value: approvedCount,
      icon: CheckCircle2,
      color: "text-admin-green",
      bgColor: "bg-admin-green-soft",
    },
    {
      label: "Approved Volume",
      value: formatBdtCurrency(totalApprovedVolume),
      icon: Banknote,
      color: "text-admin-brand",
      bgColor: "bg-admin-brand-soft",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-admin-surface border border-admin-line rounded-[14px] p-4 flex items-center gap-3.5 shadow-xs"
          >
            <div
              className={`w-11 h-11 rounded-[10px] ${c.bgColor} ${c.color} flex items-center justify-center shrink-0`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[12px] font-medium text-admin-text-soft">
                {c.label}
              </div>
              <div className="text-2xl font-bold text-admin-text tracking-tight mt-0.5">
                {isLoading ? (
                  <div className="h-6 w-16 bg-admin-line rounded-[4px] animate-pulse" />
                ) : (
                  c.value
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
