"use client";

import React from "react";

export interface PaymentMethodBadgeProps {
  method: string;
}

export function isManualPaymentMethod(method: string): boolean {
  const m = (method || "").toUpperCase();
  return (
    m.includes("MANUAL") ||
    m.includes("BANK") ||
    m.includes("CASH") ||
    m.includes("OFFLINE")
  );
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  const cleanMethod = (method || "UNKNOWN").toUpperCase();
  const isManual = isManualPaymentMethod(cleanMethod);

  let label = cleanMethod;
  let colorCls = "bg-[#F4F3FA] text-[#555068] border-[#E2E0EE]";

  if (cleanMethod.includes("BKASH")) {
    label = "bKash";
    colorCls = "bg-[#FFF0F5] text-[#D82365] border-[#FBCFE8]";
  } else if (cleanMethod.includes("NAGAD")) {
    label = "Nagad";
    colorCls = "bg-[#FFF5EB] text-[#F97316] border-[#FED7AA]";
  } else if (cleanMethod.includes("ROCKET")) {
    label = "Rocket";
    colorCls = "bg-[#F3E8FF] text-[#8B5CF6] border-[#DDD6FE]";
  } else if (cleanMethod.includes("BANK")) {
    label = "Bank Transfer";
    colorCls = "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]";
  } else if (cleanMethod.includes("SSLCOMMERZ")) {
    label = "SSLCommerz";
    colorCls = "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]";
  } else if (cleanMethod.includes("MANUAL")) {
    label = "Manual";
    colorCls = "bg-[#F5F3FF] text-[#7C5CFC] border-[#DDD6FE]";
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11.5px] font-semibold border ${colorCls}`}
      >
        {label}
      </span>
      {isManual && (
        <span className="text-[10.5px] font-medium text-admin-brand bg-admin-brand-soft px-1.5 py-0.5 rounded-[4px]">
          Manual
        </span>
      )}
    </div>
  );
}
