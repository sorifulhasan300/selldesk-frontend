"use client";

import React from "react";
import { CreditCard, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import type { AdminPlanItem } from "../types/billing.types";

export interface BillingKpiCardsProps {
  plans: AdminPlanItem[];
  isLoading?: boolean;
}

export function BillingKpiCards({ plans, isLoading }: BillingKpiCardsProps) {
  const totalPlans = plans.length;
  const activePlans = plans.filter((p) => p.isActive).length;
  const inactivePlans = totalPlans - activePlans;
  const freeOrTrial = plans.filter(
    (p) => p.price === 0 || p.name.toLowerCase().includes("trial"),
  ).length;

  const cards = [
    {
      label: "Total SaaS Plans",
      value: totalPlans,
      icon: CreditCard,
      color: "text-admin-brand",
      bgColor: "bg-admin-brand-soft",
    },
    {
      label: "Active Packages",
      value: activePlans,
      icon: CheckCircle2,
      color: "text-admin-green",
      bgColor: "bg-admin-green-soft",
    },
    {
      label: "Inactive / Archived",
      value: inactivePlans,
      icon: ShieldAlert,
      color: "text-admin-red",
      bgColor: "bg-admin-red-soft",
    },
    {
      label: "Free / Trial Tiers",
      value: freeOrTrial,
      icon: Sparkles,
      color: "text-admin-gold",
      bgColor: "bg-admin-gold-soft",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-admin-surface border border-admin-line rounded-[14px] p-4 flex items-center gap-3.5 shadow-xs"
          >
            <div
              className={`w-11 h-11 rounded-[10px] ${c.bgColor} ${c.color} flex items-center justify-center shrink-0`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[12px] font-medium text-admin-text-soft">
                {c.label}
              </div>
              <div className="text-2xl font-bold text-admin-text tracking-tight mt-0.5">
                {isLoading ? (
                  <div className="h-6 w-12 bg-admin-line rounded-[4px] animate-pulse" />
                ) : (
                  c.value
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
