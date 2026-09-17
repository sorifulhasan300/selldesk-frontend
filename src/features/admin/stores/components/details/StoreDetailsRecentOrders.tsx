"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RecentOrderItem } from "../../types/stores.types";
import { FALLBACK_RECENT_ORDERS } from "./recent-orders.constants";

export interface StoreDetailsRecentOrdersProps {
  orders?: RecentOrderItem[];
}

function PaymentBadge({ status }: { status: string }) {
  const norm = (status || "").toLowerCase();
  if (norm === "paid") {
    return (
      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-admin-green-soft text-admin-green">
        Paid
      </span>
    );
  }
  if (norm === "pending" || norm === "unpaid" || norm === "partial_paid") {
    return (
      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-admin-gold-soft text-admin-gold">
        Pending
      </span>
    );
  }
  return (
    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-admin-red-soft text-admin-red">
      Failed
    </span>
  );
}

export function StoreDetailsRecentOrders({
  orders,
}: StoreDetailsRecentOrdersProps) {
  const displayOrders =
    orders && orders.length > 0 ? orders : FALLBACK_RECENT_ORDERS;

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[18px] p-6 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-admin-text">Recent orders</h2>
        <Link
          href="/admin/orders"
          className="text-[13px] font-medium text-admin-brand hover:text-admin-brand-dark inline-flex items-center gap-1 transition-colors"
        >
          View all orders
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-admin-line text-[11px] font-semibold text-admin-text-soft uppercase tracking-wider">
              <th className="py-2.5 font-bold">Order</th>
              <th className="py-2.5 font-bold">Customer</th>
              <th className="py-2.5 font-bold text-center">Payment</th>
              <th className="py-2.5 font-bold">Date</th>
              <th className="py-2.5 font-bold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-line/50 text-[13px]">
            {displayOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-admin-bg/40 transition-colors"
              >
                <td className="py-3 font-bold text-admin-text whitespace-nowrap">
                  {order.orderNumber}
                </td>
                <td className="py-3">
                  <div className="font-semibold text-admin-text leading-tight">
                    {order.customer?.name || "Guest"}
                  </div>
                  <div className="text-[11.5px] text-admin-text-soft">
                    {order.customer?.email || "—"}
                  </div>
                </td>
                <td className="py-3 text-center">
                  <PaymentBadge
                    status={order.paymentBadge || order.paymentStatus}
                  />
                </td>
                <td className="py-3 text-admin-text-soft whitespace-nowrap text-[12.5px]">
                  {order.date}
                </td>
                <td className="py-3 text-right font-bold text-admin-text whitespace-nowrap">
                  {order.formattedAmount ||
                    `৳${order.amount.toLocaleString("en-US")}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
