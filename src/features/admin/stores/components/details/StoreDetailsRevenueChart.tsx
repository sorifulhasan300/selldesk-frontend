"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MonthlyRevenuePoint } from "../../types/stores.types";

export interface StoreDetailsRevenueChartProps {
  data?: MonthlyRevenuePoint[];
}

const DEFAULT_MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const DEFAULT_HEIGHTS = [40, 48, 52, 72, 65, 96];

export function StoreDetailsRevenueChart({
  data,
}: StoreDetailsRevenueChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const points: MonthlyRevenuePoint[] =
    data && data.length > 0
      ? data
      : DEFAULT_MONTHS.map((m, idx) => ({
          month: m,
          year: 2026,
          revenue: DEFAULT_HEIGHTS[idx] * 5000,
          orders: Math.round(DEFAULT_HEIGHTS[idx] * 0.8),
        }));

  const maxRevenue = Math.max(...points.map((p) => p.revenue || 0), 1000);

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[18px] p-6 shadow-2xs">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[15px] font-bold text-admin-text">
          Revenue — last 6 months
        </h2>
        <Link
          href="/admin/analytics"
          className="text-[13px] font-medium text-admin-brand hover:text-admin-brand-dark inline-flex items-center gap-1 transition-colors"
        >
          View report
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex items-end gap-3.5 sm:gap-6 h-[120px] pt-2 relative">
        {points.map((point, index) => {
          const fillRatio =
            point.revenue > 0
              ? Math.min(
                  100,
                  Math.max(15, Math.round((point.revenue / maxRevenue) * 100)),
                )
              : DEFAULT_HEIGHTS[index] || 30;

          return (
            <div
              key={`${point.month}-${index}`}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {hoveredIdx === index && (
                <div className="absolute -top-11 z-20 bg-admin-text text-white text-[11px] py-1 px-2 rounded-[8px] whitespace-nowrap shadow-md pointer-events-none transition-all">
                  <div className="font-semibold">
                    ৳{point.revenue.toLocaleString("en-US")}
                  </div>
                  <div className="text-[10px] text-white/70">
                    {point.orders} orders
                  </div>
                </div>
              )}

              {/* Bar track and fill matching visual specification */}
              <div className="w-full h-full rounded-[10px] bg-[#ede9fe] relative overflow-hidden flex items-end">
                <div
                  className="w-full bg-[#7c5cfc] rounded-b-[10px] rounded-t-[4px] transition-all duration-300 group-hover:brightness-95"
                  style={{ height: `${fillRatio}%` }}
                />
              </div>

              <div className="text-[12px] font-medium text-admin-text-soft group-hover:text-admin-text transition-colors select-none">
                {point.month}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
