"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface StorePlanSummaryProps {
  packageName?: string;
  packagePrice?: number;
}

export function StorePlanSummary({
  packageName,
  packagePrice,
}: StorePlanSummaryProps) {
  const isFree = !packagePrice || packagePrice === 0;
  const displayName = packageName || "Free Trial";
  const displayPrice = isFree
    ? "14-Day Free Trial"
    : `৳${packagePrice?.toLocaleString()}/mo`;

  return (
    <div className="flex items-center justify-between rounded-xl border border-[#7C5CFC]/25 bg-[#7C5CFC]/5 p-3.5 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#7C5CFC] text-white shadow-xs">
          <Sparkles className="size-4" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#64748B]">
            Subscription Plan
          </p>
          <p className="text-xs font-bold text-[#0F172A]">
            {displayName}{" "}
            <span className="text-[#7C5CFC] font-semibold">
              ({displayPrice})
            </span>
          </p>
        </div>
      </div>
      <Link
        href="/plans"
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#7C5CFC] hover:underline"
      >
        <span>Change</span>
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
