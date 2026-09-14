"use client";

import React from "react";
import { PlanPackage } from "../types/plan.types";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  plan: PlanPackage;
  isSelected: boolean;
  onSelect: (plan: PlanPackage) => void;
}

export function SubscriptionCard({
  plan,
  isSelected,
  onSelect,
}: SubscriptionCardProps) {
  return (
    <div
      onClick={() => onSelect(plan)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(plan);
        }
      }}
      className={cn(
        "relative flex flex-col justify-between rounded-xl p-5 sm:p-6 transition-all duration-200 cursor-pointer text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring select-none",
        isSelected
          ? "border-primary bg-primary/[0.03] ring-1 ring-primary shadow-xs"
          : "border border-border/80 bg-card hover:border-border hover:bg-muted/20",
      )}
    >
      <div>
        {/* Top Row: Plan Name & Badge */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-sans font-bold text-base sm:text-lg text-foreground tracking-tight">
            {plan.name}
          </h3>
          {plan.badge && (
            <span
              className={cn(
                "inline-block rounded-md px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide uppercase border",
                plan.popular
                  ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                  : "border-border/80 bg-muted/60 text-muted-foreground",
              )}
            >
              {plan.badge}
            </span>
          )}
        </div>

        {/* Price Display */}
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {plan.priceDisplay}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {plan.billingPeriod}
          </span>
        </div>

        {/* Short Description */}
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {plan.description}
        </p>

        {/* Divider */}
        <div className="my-4 border-t border-border/60" />

        {/* Feature List (em-dash separator, zero icons) */}
        <ul className="space-y-2">
          {plan.features.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs text-foreground/90 leading-snug"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "font-mono select-none shrink-0",
                  isSelected
                    ? "text-primary font-bold"
                    : "text-muted-foreground",
                )}
              >
                —
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Clean Selection Button */}
      <div className="mt-6 pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(plan);
          }}
          className={cn(
            "w-full rounded-lg py-2.5 px-3 text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer focus-visible:outline-hidden",
            isSelected
              ? "bg-primary text-primary-foreground shadow-xs"
              : "border border-border/80 bg-background text-foreground hover:bg-muted hover:border-border",
          )}
        >
          {isSelected ? "[ SELECTED ]" : "Select Plan"}
        </button>
      </div>
    </div>
  );
}
