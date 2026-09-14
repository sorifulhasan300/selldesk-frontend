"use client";

import React from "react";
import { Coins, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurrentRevenueTier } from "../schemas/onboardingSchema";

export interface RevenueTierOption {
  value: CurrentRevenueTier;
  label: string;
  sub: string;
}

export const REVENUE_TIER_OPTIONS: RevenueTierOption[] = [
  {
    value: "NO_REVENUE",
    label: "No Revenue",
    sub: "৳0 / Just starting",
  },
  {
    value: "REVENUE_0_10K",
    label: "< ৳10k",
    sub: "Under 10k BDT / mo",
  },
  {
    value: "REVENUE_10K_50K",
    label: "৳10k - ৳50k",
    sub: "Growing sales / mo",
  },
  {
    value: "REVENUE_50K_100K",
    label: "৳50k - ৳100k",
    sub: "Scaling sales / mo",
  },
  {
    value: "REVENUE_100K_PLUS",
    label: "৳100k+",
    sub: "High volume / mo",
  },
];

export interface RevenueTierSelectCardsProps {
  value?: CurrentRevenueTier;
  onChange: (tier: CurrentRevenueTier) => void;
  disabled?: boolean;
  error?: string;
}

export function RevenueTierSelectCards({
  value,
  onChange,
  disabled = false,
  error,
}: RevenueTierSelectCardsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]">
          <Coins className="size-3.5 text-[#7C5CFC]" />
          <span>Estimated Monthly Revenue *</span>
        </label>
        <span className="text-[11px] text-[#64748B]">
          Helps us tailor your setup
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Revenue Tier Options"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"
      >
        {REVENUE_TIER_OPTIONS.map((tier) => {
          const isSelected = value === tier.value;

          return (
            <button
              key={tier.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(tier.value)}
              className={cn(
                "group relative flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition-all duration-200 outline-hidden select-none",
                disabled && "opacity-60 cursor-not-allowed pointer-events-none",
                isSelected
                  ? "border-[#7C5CFC] bg-[#7C5CFC]/5 ring-1 ring-[#7C5CFC] shadow-2xs"
                  : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC] cursor-pointer",
              )}
            >
              {/* Selection Indicator */}
              <div className="flex w-full items-center justify-between">
                <span
                  className={cn(
                    "text-xs font-bold leading-tight",
                    isSelected ? "text-[#0F172A]" : "text-[#1E293B]",
                  )}
                >
                  {tier.label}
                </span>
                {isSelected ? (
                  <div className="flex size-3.5 items-center justify-center rounded-full bg-[#7C5CFC] text-white shadow-2xs animate-in zoom-in-75 duration-150">
                    <Check className="size-2 stroke-[3]" />
                  </div>
                ) : (
                  <div className="size-3 rounded-full border border-[#CBD5E1] bg-transparent group-hover:border-[#94A3B8] transition-colors" />
                )}
              </div>

              <span className="text-[10px] text-[#64748B] leading-tight line-clamp-1">
                {tier.sub}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle className="size-3" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
