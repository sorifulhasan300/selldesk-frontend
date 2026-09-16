"use client";

import React from "react";
import type { RevenueGrowthData } from "../types/analytics.types";
import { formatBdtCurrency } from "../utils/formatters";

export interface AdminRevenueChartProps {
  revenueGrowth?: RevenueGrowthData;
}

export function AdminRevenueChart({ revenueGrowth }: AdminRevenueChartProps) {
  const chartData = revenueGrowth?.chartData || [];
  const currency = revenueGrowth?.currency || "BDT";

  // Compute maximum value for relative track & fill height calculation
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue || 0), 1000);
  const maxTarget = Math.max(
    ...chartData.map((d) => d.target || 0),
    maxRevenue,
  );
  const ceiling = Math.max(maxRevenue, maxTarget);

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[16px] p-5 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-[18px]">
        <div className="text-[14.5px] font-semibold text-admin-text">
          Revenue growth — last 6 months
        </div>
        <div className="text-[12px] text-admin-text-soft">
          Amounts in {currency}
        </div>
      </div>

      <div className="flex items-end gap-3.5 h-[120px] pt-2">
        {chartData.length === 0 ? (
          <div className="w-full flex items-center justify-center text-[12.5px] text-admin-text-soft">
            No revenue records available
          </div>
        ) : (
          chartData.map((bar) => {
            // Track height scaled between 70px and 120px
            const targetRatio = bar.target ? bar.target / ceiling : 0.8;
            const trackHeight = Math.max(
              70,
              Math.min(120, Math.round(targetRatio * 120)),
            );

            // Fill percentage relative to target (or relative to track height)
            const fillPercent =
              bar.target && bar.target > 0
                ? Math.min(100, Math.round((bar.revenue / bar.target) * 100))
                : Math.min(100, Math.round((bar.revenue / ceiling) * 100));

            return (
              <div
                key={bar.month}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                title={`${bar.month}: ${formatBdtCurrency(bar.revenue)} (Target: ${formatBdtCurrency(bar.target)})`}
              >
                <div
                  className="w-full rounded-t-[6px] rounded-b-[3px] bg-admin-brand-soft relative overflow-hidden transition-all group"
                  style={{ height: `${trackHeight}px` }}
                >
                  <i
                    className="absolute bottom-0 left-0 right-0 bg-admin-brand rounded-t-[6px] rounded-b-[3px] transition-all not-italic"
                    style={{ height: `${fillPercent}%` }}
                  />
                </div>
                <div className="text-[11.5px] text-admin-text-soft select-none">
                  {bar.month}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
