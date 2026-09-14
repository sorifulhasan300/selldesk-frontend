"use client";

import React from "react";
import { type BillingCycle } from "../types/plan.types";
import { cn } from "@/lib/utils";

interface PlanBillingToggleProps {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export function PlanBillingToggle({ cycle, onChange }: PlanBillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <div className="inline-flex items-center rounded-full border border-[#E2E8F0] bg-white p-1 shadow-xs">
        <button
          type="button"
          onClick={() => onChange("monthly")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer",
            cycle === "monthly"
              ? "bg-[#0F172A] text-white shadow-xs"
              : "text-[#64748B] hover:text-[#0F172A]",
          )}
        >
          Monthly Billing
        </button>
        <button
          type="button"
          onClick={() => onChange("yearly")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer",
            cycle === "yearly"
              ? "bg-[#0F172A] text-white shadow-xs"
              : "text-[#64748B] hover:text-[#0F172A]",
          )}
        >
          <span>Annual Billing</span>
          <span className="rounded-full bg-[#7C5CFC]/15 px-2 py-0.5 text-[10px] font-bold text-[#7C5CFC]">
            Save 20%
          </span>
        </button>
      </div>
    </div>
  );
}
