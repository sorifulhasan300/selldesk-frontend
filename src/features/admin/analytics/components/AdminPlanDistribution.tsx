"use client";

import React from "react";
import type { PlanDistributionData, PlanItem } from "../types/analytics.types";

export interface AdminPlanDistributionProps {
  planDistribution?: PlanDistributionData;
}

/**
 * Resolve semantic CSS variable or token for plan color.
 * Guarantees that global theme color changes in globals.css reflect automatically.
 */
function resolvePlanColorVariable(
  planName: string,
  fallbackColor?: string,
): string {
  const normalized = planName.toLowerCase();
  if (normalized.includes("pro")) return "var(--brand)";
  if (
    normalized.includes("biz") ||
    normalized.includes("business") ||
    normalized.includes("enterprise")
  ) {
    return "var(--gold)";
  }
  if (
    normalized.includes("free") ||
    normalized.includes("trial") ||
    normalized.includes("starter")
  ) {
    return "var(--line)";
  }
  return fallbackColor || "var(--brand)";
}

function resolvePlanBadgeClass(planName: string): string {
  const normalized = planName.toLowerCase();
  if (normalized.includes("pro")) return "bg-admin-brand";
  if (
    normalized.includes("biz") ||
    normalized.includes("business") ||
    normalized.includes("enterprise")
  ) {
    return "bg-admin-gold";
  }
  return "bg-admin-line";
}

export function AdminPlanDistribution({
  planDistribution,
}: AdminPlanDistributionProps) {
  const plans: PlanItem[] =
    planDistribution?.plans && planDistribution.plans.length > 0
      ? planDistribution.plans
      : [
          { name: "Pro", count: 0, percentage: 58, color: "var(--brand)" },
          { name: "Business", count: 0, percentage: 20, color: "var(--gold)" },
          { name: "Free", count: 0, percentage: 22, color: "var(--line)" },
        ];

  // Top plan for donut center display
  const topPlan =
    plans.length > 0
      ? plans.reduce(
          (max, p) => (p.percentage > max.percentage ? p : max),
          plans[0],
        )
      : { name: "Pro", percentage: 0 };

  // Calculate dynamic conic-gradient segments immutably
  const gradientStops = plans.map((p, idx) => {
    const start = plans
      .slice(0, idx)
      .reduce((sum, prev) => sum + prev.percentage, 0);
    const end = Math.min(100, start + p.percentage);
    const colorVar = resolvePlanColorVariable(p.name, p.color);
    return `${colorVar} ${start}% ${end}%`;
  });

  const conicGradientStyle =
    gradientStops.length > 0
      ? `conic-gradient(${gradientStops.join(", ")})`
      : "conic-gradient(var(--brand) 0% 58%, var(--gold) 58% 78%, var(--line) 78% 100%)";

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[16px] p-5 shadow-2xs flex flex-col justify-between items-center text-center">
      <div className="w-full flex items-center justify-between mb-[18px]">
        <div className="text-[14.5px] font-semibold text-admin-text">
          Plan distribution
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Donut Chart: 132x132 conic-gradient */}
        <div
          className="w-[132px] h-[132px] rounded-full flex items-center justify-center mb-4 shadow-xs"
          style={{ background: conicGradientStyle }}
        >
          {/* Inner Circle: 92x92 surface */}
          <span className="w-[92px] h-[92px] rounded-full bg-admin-surface flex flex-col items-center justify-center shadow-2xs select-none">
            <b className="text-[20px] font-bold text-admin-text leading-tight">
              {topPlan.percentage}%
            </b>
            <small className="text-[11px] text-admin-text-soft leading-none mt-0.5 font-medium">
              {topPlan.name} plan
            </small>
          </span>
        </div>
      </div>

      {/* Legend Items */}
      <div className="flex items-center justify-center gap-4 mt-4 select-none flex-wrap">
        {plans.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-[7px] text-[12.5px] text-admin-text-soft"
          >
            <span
              className={`w-[9px] h-[9px] rounded-full shrink-0 ${resolvePlanBadgeClass(
                p.name,
              )}`}
            />
            <span>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
