"use client";

import React from "react";
import { Package, Download, Layers, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductType } from "../schemas/onboardingSchema";

export interface ProductTypeOption {
  value: ProductType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const PRODUCT_TYPE_OPTIONS: ProductTypeOption[] = [
  {
    value: "PHYSICAL",
    title: "Physical Goods",
    description: "Shipped via courier (clothing, gadgets, beauty)",
    icon: Package,
  },
  {
    value: "DIGITAL",
    title: "Digital Products",
    description: "Instant download files, software, licenses, e-books",
    icon: Download,
  },
  {
    value: "BOTH",
    title: "Physical & Digital",
    description: "Hybrid catalog of physical goods and digital assets",
    icon: Layers,
  },
];

export interface ProductTypeSelectCardsProps {
  value?: ProductType;
  onChange: (type: ProductType) => void;
  disabled?: boolean;
  error?: string;
}

export function ProductTypeSelectCards({
  value,
  onChange,
  disabled = false,
  error,
}: ProductTypeSelectCardsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]">
          <Layers className="size-3.5 text-[#7C5CFC]" />
          <span>Product Type *</span>
        </label>
        <span className="text-[11px] text-[#64748B]">What will you sell?</span>
      </div>

      <div
        role="radiogroup"
        aria-label="Product Type Options"
        className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
      >
        {PRODUCT_TYPE_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          const Icon = opt.icon;

          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={cn(
                "group relative flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all duration-200 outline-hidden select-none",
                disabled && "opacity-60 cursor-not-allowed pointer-events-none",
                isSelected
                  ? "border-[#7C5CFC] bg-[#7C5CFC]/5 ring-1 ring-[#7C5CFC] shadow-2xs"
                  : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC] cursor-pointer",
              )}
            >
              {/* Top-Right Selection Indicator Badge */}
              {isSelected ? (
                <div className="absolute top-2.5 right-2.5 flex size-4 items-center justify-center rounded-full bg-[#7C5CFC] text-white shadow-2xs animate-in zoom-in-75 duration-150">
                  <Check className="size-2.5 stroke-[3]" />
                </div>
              ) : (
                <div className="absolute top-2.5 right-2.5 size-3.5 rounded-full border border-[#CBD5E1] bg-transparent group-hover:border-[#94A3B8] transition-colors" />
              )}

              {/* Pill / Chip Icon */}
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg transition-colors",
                  isSelected
                    ? "bg-[#7C5CFC]/15 text-[#7C5CFC]"
                    : "bg-[#F8F9FC] text-[#64748B] group-hover:bg-[#F1F5F9] group-hover:text-[#0F172A]",
                )}
              >
                <Icon className="size-4" />
              </div>

              {/* Title and Description */}
              <div className="space-y-0.5 pr-2">
                <p
                  className={cn(
                    "text-xs font-semibold leading-snug",
                    isSelected ? "text-[#0F172A]" : "text-[#1E293B]",
                  )}
                >
                  {opt.title}
                </p>
                <p className="text-[10px] text-[#64748B] leading-relaxed line-clamp-2">
                  {opt.description}
                </p>
              </div>
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
