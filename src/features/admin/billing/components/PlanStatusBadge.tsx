"use client";

import React from "react";

export interface PlanStatusBadgeProps {
  isActive: boolean;
}

export function PlanStatusBadge({ isActive }: PlanStatusBadgeProps) {
  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#E6F7EF] text-[#1E9A6C] border border-[#1E9A6C]/20">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1E9A6C]" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FCEBEB] text-[#D8484A] border border-[#D8484A]/20">
      <span className="w-1.5 h-1.5 rounded-full bg-[#D8484A]" />
      Inactive
    </span>
  );
}
