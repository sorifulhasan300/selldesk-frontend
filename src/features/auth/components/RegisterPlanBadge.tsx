"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RegisterPlanBadgeProps {
  packageName?: string;
  packagePrice?: number;
}

export function RegisterPlanBadge({
  packageName,
  packagePrice,
}: RegisterPlanBadgeProps) {
  const displayName = packageName || "Free Trial";
  const displayPrice =
    packagePrice !== undefined && packagePrice > 0
      ? `৳${packagePrice.toLocaleString()}/mo`
      : "14-Day Free Trial";

  return (
    <div className="flex items-center justify-between rounded-xl border border-[#7C5CFC]/25 bg-[#7C5CFC]/5 px-3.5 py-2.5 shadow-2xs">
      <div className="flex items-center gap-2 text-xs">
        <span className="flex size-2 rounded-full bg-[#7C5CFC] animate-pulse" />
        <span className="text-[#0F172A] font-medium">
          Selected Plan:{" "}
          <strong className="font-bold text-[#7C5CFC]">
            {displayName} ({displayPrice})
          </strong>
        </span>
      </div>
      <Link
        href="/plans"
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#7C5CFC] hover:underline transition-colors"
      >
        <span>Change</span>
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
