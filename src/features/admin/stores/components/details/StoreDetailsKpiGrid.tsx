"use client";

import React from "react";
import type { AdminStoreDetails } from "../../types/stores.types";

export interface StoreDetailsKpiGridProps {
  metrics: AdminStoreDetails["overview"]["metrics"];
}

interface KpiItem {
  id: string;
  label: string;
  value: string;
  change: number;
}

export function StoreDetailsKpiGrid({ metrics }: StoreDetailsKpiGridProps) {
  const items: KpiItem[] = [
    {
      id: "orders",
      label: "Total orders",
      value: (metrics?.totalOrders?.value ?? 0).toLocaleString("en-US"),
      change: metrics?.totalOrders?.change ?? 12.8,
    },
    {
      id: "revenue",
      label: "Total revenue",
      value:
        metrics?.totalRevenue?.formatted ||
        `৳${(metrics?.totalRevenue?.value ?? 0).toLocaleString("en-US")}`,
      change: metrics?.totalRevenue?.change ?? 8.4,
    },
    {
      id: "customers",
      label: "Customers",
      value: (metrics?.customers?.value ?? 0).toLocaleString("en-US"),
      change: metrics?.customers?.change ?? 5.1,
    },
    {
      id: "aov",
      label: "Avg. order value",
      value:
        metrics?.avgOrderValue?.formatted ||
        `৳${(metrics?.avgOrderValue?.value ?? 0).toLocaleString("en-US")}`,
      change: metrics?.avgOrderValue?.change ?? -1.2,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => {
        const isPositive = item.change >= 0;
        const changeText = `${isPositive ? "+" : ""}${item.change}%`;

        return (
          <div
            key={item.id}
            className="bg-admin-surface border border-admin-line rounded-[18px] p-5 shadow-2xs flex flex-col justify-between"
          >
            <div className="text-[12.5px] font-normal text-admin-text-soft">
              {item.label}
            </div>

            <div className="text-[23px] font-bold text-admin-text tracking-tight mt-1.5 leading-tight">
              {item.value}
            </div>

            <div className="mt-3">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  isPositive
                    ? "bg-admin-green-soft text-admin-green"
                    : "bg-admin-gold-soft text-admin-gold"
                }`}
              >
                {changeText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
