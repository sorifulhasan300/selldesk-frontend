"use client";

import React from "react";
import type { SubscriptionPaymentItem } from "../types/payment.types";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { formatBdtCurrency } from "@/features/admin/analytics/utils/formatters";

export interface PaymentSummaryInfoProps {
  payment: SubscriptionPaymentItem;
}

export function PaymentSummaryInfo({ payment }: PaymentSummaryInfoProps) {
  return (
    <div className="bg-admin-bg p-4 rounded-[12px] border border-admin-line grid grid-cols-2 gap-3 text-[13px]">
      <div>
        <span className="text-admin-text-soft text-[11.5px] block">Store</span>
        <span className="font-semibold text-admin-text">
          {payment.store?.storeName}
        </span>
      </div>
      <div>
        <span className="text-admin-text-soft text-[11.5px] block">Plan</span>
        <span className="font-semibold text-admin-text">
          {payment.plan?.name} ({payment.plan?.durationDays}d)
        </span>
      </div>
      <div>
        <span className="text-admin-text-soft text-[11.5px] block">
          Amount Paid
        </span>
        <span className="font-bold text-admin-brand text-[15px]">
          {formatBdtCurrency(payment.amount)}
        </span>
      </div>
      <div>
        <span className="text-admin-text-soft text-[11.5px] block">Method</span>
        <PaymentMethodBadge method={payment.paymentMethod} />
      </div>
      {payment.transactionId && (
        <div className="col-span-2">
          <span className="text-admin-text-soft text-[11.5px] block">
            Transaction ID
          </span>
          <span className="font-mono text-[12.5px] font-semibold text-admin-text bg-admin-surface px-2 py-1 rounded-[6px] border border-admin-line inline-block mt-0.5">
            {payment.transactionId}
          </span>
        </div>
      )}
      {payment.note && (
        <div className="col-span-2">
          <span className="text-admin-text-soft text-[11.5px] block">
            Merchant Note
          </span>
          <span className="text-admin-text text-[12.5px] italic">
            &quot;{payment.note}&quot;
          </span>
        </div>
      )}
    </div>
  );
}
