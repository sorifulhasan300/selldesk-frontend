"use client";

import React from "react";
import type { AdminAnalyticsOverviewResponse } from "../types/analytics.types";
import { formatBdtCurrency } from "../utils/formatters";

export interface AdminKpiGridProps {
  kpis?: AdminAnalyticsOverviewResponse["kpis"];
}

interface KpiDisplayItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaType: "up" | "warn";
}

export function AdminKpiGrid({ kpis }: AdminKpiGridProps) {
  // Fallbacks if data is still settling
  const totalStores = kpis?.totalStores;
  const activeStores = kpis?.activeStores;
  const mrr = kpis?.monthlyRecurringRevenue;
  const newSignups = kpis?.newSignups;

  const items: KpiDisplayItem[] = [
    {
      id: "total-stores",
      label: "Total stores",
      value: totalStores ? totalStores.value.toLocaleString() : "0",
      delta:
        totalStores?.label ||
        (totalStores
          ? `${totalStores.isPositive ? "+" : ""}${totalStores.percentage}% this month`
          : "+0% this month"),
      deltaType: totalStores?.isPositive === false ? "warn" : "up",
    },
    {
      id: "active-stores",
      label: "Active stores",
      value: activeStores ? activeStores.value.toLocaleString() : "0",
      delta:
        activeStores?.label ||
        (activeStores
          ? `${activeStores.isPositive ? "+" : ""}${activeStores.percentage}%`
          : "+0%"),
      deltaType: activeStores?.isPositive === false ? "warn" : "up",
    },
    {
      id: "mrr",
      label: "Monthly recurring revenue",
      value: mrr ? mrr.formatted || formatBdtCurrency(mrr.value) : "৳0",
      delta:
        mrr?.label ||
        (mrr ? `${mrr.isPositive ? "+" : ""}${mrr.percentage}%` : "+0%"),
      deltaType: mrr?.isPositive === false ? "warn" : "up",
    },
    {
      id: "new-signups",
      label: "New signups",
      value: newSignups ? newSignups.value.toLocaleString() : "0",
      delta:
        newSignups?.label ||
        (newSignups ? `${newSignups.onTrial} on trial` : "0 on trial"),
      deltaType: "warn",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-[18px]">
      {items.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-admin-surface border border-admin-line rounded-[16px] p-[18px] shadow-2xs"
        >
          <div className="text-[13px] text-admin-text-soft mb-2.5 font-normal">
            {kpi.label}
          </div>
          <div className="text-[24px] font-bold text-admin-text leading-tight">
            {kpi.value}
          </div>
          <span
            className={`text-[12px] mt-2 inline-block px-2.5 py-0.5 rounded-full font-semibold ${
              kpi.deltaType === "up"
                ? "bg-admin-green-soft text-admin-green"
                : "bg-admin-gold-soft text-admin-gold"
            }`}
          >
            {kpi.delta}
          </span>
        </div>
      ))}
    </div>
  );
}
