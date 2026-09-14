"use client";

import React from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { type PlanPackage, type BillingCycle } from "../types/plan.types";
import { cn } from "@/lib/utils";

interface PlanPricingCardProps {
  plan: PlanPackage;
  billingCycle: BillingCycle;
  isSelected?: boolean;
  onSelect: (plan: PlanPackage) => void;
}

export function PlanPricingCard({
  plan,
  billingCycle,
  isSelected,
  onSelect,
}: PlanPricingCardProps) {
  const isFree = plan.price === 0;
  const isStarter = plan.name.toLowerCase().includes("starter");
  const isPopular = plan.popular || isStarter;

  // Calculate annual price display (20% discount if yearly)
  const displayPrice = isFree
    ? "Free"
    : billingCycle === "yearly"
      ? `৳${Math.round(plan.price * 0.8 * 12).toLocaleString()}`
      : `৳${plan.price.toLocaleString()}`;

  const displayPeriod = isFree
    ? "for 14 days"
    : billingCycle === "yearly"
      ? "/ year"
      : "/ month";

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border bg-white p-6 sm:p-7 transition-all duration-300 shadow-sm hover:shadow-md",
        isPopular
          ? "border-[#7C5CFC] ring-2 ring-[#7C5CFC]/20 shadow-md"
          : "border-[#E2E8F0] hover:border-[#CBD5E1]",
        isSelected && "ring-2 ring-[#7C5CFC] bg-[#F8F9FC]",
      )}
    >
      {/* Popular/Featured Gold Badge */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B45C] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0F172A] shadow-xs">
            <Sparkles className="size-3 fill-[#0F172A]" />
            Most Popular
          </span>
        </div>
      )}

      <div>
        {/* Plan Header */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-sans text-xl font-bold tracking-tight text-[#0F172A]">
            {plan.name}
          </h3>
          {plan.badge && !isPopular && (
            <span className="rounded-full border border-[#E2E8F0] bg-[#F8F9FC] px-2.5 py-0.5 text-[11px] font-semibold text-[#64748B]">
              {plan.badge}
            </span>
          )}
        </div>

        <p className="mt-2 min-h-[36px] text-xs leading-relaxed text-[#64748B]">
          {plan.description}
        </p>

        {/* Price display */}
        <div className="mt-5 flex items-baseline gap-1.5 pb-2">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            {displayPrice}
          </span>
          <span className="text-xs font-semibold text-[#64748B]">
            {displayPeriod}
          </span>
        </div>

        {/* Separator */}
        <div className="my-5 border-t border-[#E2E8F0]" />

        {/* Features list */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
            What&apos;s included:
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-[#0F172A]"
              >
                <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
                  <Check className="size-3 stroke-[2.5]" />
                </div>
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strict Pill-Shaped CTA Button */}
      <div className="mt-8 pt-2">
        <button
          type="button"
          onClick={() => onSelect(plan)}
          className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium pl-6 pr-1.5 py-1.5 rounded-full inline-flex items-center justify-between transition-transform active:scale-95 shadow-sm cursor-pointer"
        >
          <span className="text-sm font-semibold">
            {isFree ? "Start Free Trial" : `Choose ${plan.name}`}
          </span>
          <span className="w-8 h-8 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-xs">
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>
    </div>
  );
}
