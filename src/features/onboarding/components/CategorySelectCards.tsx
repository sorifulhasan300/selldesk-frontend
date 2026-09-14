"use client";

import React from "react";
import {
  Shirt,
  Smartphone,
  Apple,
  Sparkles,
  Home,
  Package,
  BookOpen,
  UtensilsCrossed,
  Dumbbell,
  Check,
  Tag,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryOption {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const STORE_CATEGORIES: CategoryOption[] = [
  { id: "fashion", name: "Fashion & Apparel", icon: Shirt },
  { id: "electronics", name: "Electronics & Gadgets", icon: Smartphone },
  { id: "grocery", name: "Grocery & Organic", icon: Apple },
  { id: "beauty", name: "Health & Beauty", icon: Sparkles },
  { id: "home", name: "Home & Living", icon: Home },
  { id: "retail", name: "General Retail", icon: Package },
  { id: "books", name: "Books & Stationery", icon: BookOpen },
  { id: "food", name: "Food & Restaurant", icon: UtensilsCrossed },
  { id: "sports", name: "Sports & Fitness", icon: Dumbbell },
];

export interface CategorySelectCardsProps {
  value?: string;
  onChange: (category: string) => void;
  disabled?: boolean;
  error?: string;
}

export function CategorySelectCards({
  value,
  onChange,
  disabled = false,
  error,
}: CategorySelectCardsProps) {
  const handleBadgeClick = (categoryName: string) => {
    // If clicked badge is already selected, allow toggling off or re-selecting
    if (value?.trim().toLowerCase() === categoryName.trim().toLowerCase()) {
      onChange(categoryName);
    } else {
      onChange(categoryName);
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="space-y-2.5">
      {/* Label and Helper Text */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="industryCategory"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]"
        >
          <Tag className="size-3.5 text-[#7C5CFC]" />
          <span>Store Category *</span>
        </label>
        <span className="text-[11px] text-[#64748B]">
          Select badge or type custom
        </span>
      </div>

      {/* Interactive Input Field with Clear Button */}
      <div className="relative">
        <input
          id="industryCategory"
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g. Fashion & Apparel, Handmade Crafts, Pet Store..."
          className={cn(
            "w-full rounded-xl border bg-white px-3.5 py-2.5 pr-8 text-sm text-[#0F172A] shadow-2xs placeholder:text-[#94A3B8] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#7C5CFC]/25 disabled:opacity-60",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-[#E2E8F0] focus:border-[#7C5CFC]",
          )}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            title="Clear category"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Suggested Category Badge Pills */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#64748B]">
            Suggested Categories:
          </span>
          {value && (
            <span className="text-[10px] text-[#7C5CFC] font-mono">
              [ Selected: {value} ]
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {STORE_CATEGORIES.map((cat) => {
            const isSelected =
              value?.trim().toLowerCase() === cat.name.trim().toLowerCase();
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                disabled={disabled}
                onClick={() => handleBadgeClick(cat.name)}
                className={cn(
                  "group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer shadow-2xs select-none active:scale-95 disabled:opacity-60",
                  isSelected
                    ? "border-[#7C5CFC] bg-[#7C5CFC] text-white font-semibold shadow-xs ring-2 ring-[#7C5CFC]/25"
                    : "border-[#E2E8F0] bg-[#F8FAFC] text-[#334155] hover:border-[#CBD5E1] hover:bg-white hover:text-[#0F172A]",
                )}
              >
                {isSelected ? (
                  <Check className="size-3 text-white stroke-[3] shrink-0" />
                ) : (
                  <Icon className="size-3 text-[#7C5CFC] shrink-0 group-hover:scale-110 transition-transform" />
                )}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle className="size-3" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

// Export alias for semantic clarity
export const CategorySelectBadges = CategorySelectCards;
