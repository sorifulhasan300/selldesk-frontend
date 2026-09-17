"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import type { AdminAnalyticsTimeframe } from "../types/analytics.types";

export interface AdminOverviewHeaderProps {
  timeframe: AdminAnalyticsTimeframe;
}

export function AdminOverviewHeader({ timeframe }: AdminOverviewHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRangeSelect = (range: AdminAnalyticsTimeframe) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeframe", range);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <AdminPageHeader title="Dashboard Overview">
      {/* Time Toggle Group */}
      <div className="flex bg-white border border-[#E9E7F3] rounded-full p-[3px] shadow-2xs">
        {(["week", "month", "year"] as const).map((range) => (
          <button
            key={range}
            type="button"
            onClick={() => handleRangeSelect(range)}
            className={`px-4 py-[7px] text-[13px] rounded-full transition-all cursor-pointer capitalize ${
              timeframe === range
                ? "bg-[#7C5CFC] text-white font-semibold shadow-xs"
                : "text-[#77738C] hover:text-[#1C1A2E] font-medium"
            }`}
          >
            This {range}
          </button>
        ))}
      </div>
    </AdminPageHeader>
  );
}

export default AdminOverviewHeader;
