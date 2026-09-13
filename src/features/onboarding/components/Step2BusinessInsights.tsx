"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Package,
  DownloadCloud,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Tag,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import {
  OnboardingFormData,
  ProductType,
  SellingStatus,
  CurrentRevenueTier,
} from "../schemas/onboardingSchema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Step2BusinessInsightsProps {
  form: UseFormReturn<OnboardingFormData>;
  onNext: () => void;
  onBack: () => void;
}

const POPULAR_CATEGORIES = [
  "Fashion & Apparel",
  "Gadgets & Electronics",
  "Beauty & Cosmetics",
  "Food & Grocery",
  "Books & Stationery",
  "Home & Lifestyle",
  "Handicrafts & Gifts",
  "Health & Wellness",
];

export function Step2BusinessInsights({
  form,
  onNext,
  onBack,
}: Step2BusinessInsightsProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const productType = watch("productType");
  const sellingStatus = watch("sellingStatus");
  const currentRevenue = watch("currentRevenue");
  const industryCategory = watch("industryCategory");

  const handleSelectProductType = (val: ProductType) => {
    setValue("productType", val, { shouldValidate: true, shouldDirty: true });
  };

  const handleSelectSellingStatus = (val: SellingStatus) => {
    setValue("sellingStatus", val, { shouldValidate: true, shouldDirty: true });
  };

  const handleSelectRevenue = (val: CurrentRevenueTier) => {
    setValue("currentRevenue", val, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCategoryChipClick = (cat: string) => {
    setValue("industryCategory", cat, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Heading */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Tell us about your business
        </h2>
        <p className="text-sm text-muted-foreground">
          Provide accurate details so we can tailor the dashboard and features
          for your store.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Product Type Cards */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Package className="size-4 text-primary" />
            What type of products do you sell?{" "}
            <span className="text-destructive">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Physical */}
            <button
              type="button"
              onClick={() => handleSelectProductType("PHYSICAL")}
              className={cn(
                "group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.98] shadow-2xs cursor-pointer",
                productType === "PHYSICAL"
                  ? "border-primary bg-secondary/40 ring-1 ring-primary/40 shadow-xs"
                  : "border-border bg-card hover:border-border/80 hover:bg-muted/30",
              )}
            >
              <div className="flex w-full items-center justify-between mb-2">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg transition-colors",
                    productType === "PHYSICAL"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground group-hover:bg-secondary group-hover:text-primary",
                  )}
                >
                  <Package className="size-5" />
                </div>
                {productType === "PHYSICAL" && (
                  <CheckCircle2 className="size-5 text-primary" />
                )}
              </div>
              <h3 className="text-sm font-bold text-foreground">
                Physical Products
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Apparel, electronics, food, or items delivered via courier.
              </p>
            </button>

            {/* Digital */}
            <button
              type="button"
              onClick={() => handleSelectProductType("DIGITAL")}
              className={cn(
                "group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.98] shadow-2xs cursor-pointer",
                productType === "DIGITAL"
                  ? "border-primary bg-secondary/40 ring-1 ring-primary/40 shadow-xs"
                  : "border-border bg-card hover:border-border/80 hover:bg-muted/30",
              )}
            >
              <div className="flex w-full items-center justify-between mb-2">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg transition-colors",
                    productType === "DIGITAL"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground group-hover:bg-secondary group-hover:text-primary",
                  )}
                >
                  <DownloadCloud className="size-5" />
                </div>
                {productType === "DIGITAL" && (
                  <CheckCircle2 className="size-5 text-primary" />
                )}
              </div>
              <h3 className="text-sm font-bold text-foreground">
                Digital Products
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                E-books, software, digital downloads, or online courses.
              </p>
            </button>
          </div>
          {errors.productType && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.productType.message}</span>
            </p>
          )}
        </div>

        {/* 2. Selling Status */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <TrendingUp className="size-4 text-primary" />
            What is your current business stage?{" "}
            <span className="text-destructive">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Newbie */}
            <button
              type="button"
              onClick={() => handleSelectSellingStatus("NEWBIE")}
              className={cn(
                "group relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 active:scale-[0.98] shadow-2xs cursor-pointer",
                sellingStatus === "NEWBIE"
                  ? "border-primary bg-secondary/40 ring-1 ring-primary/40 shadow-xs"
                  : "border-border bg-card hover:border-border/80 hover:bg-muted/30",
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  sellingStatus === "NEWBIE"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground group-hover:text-primary",
                )}
              >
                <Sparkles className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">
                    New Business
                  </h4>
                  {sellingStatus === "NEWBIE" && (
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Starting a brand new venture
                </p>
              </div>
            </button>

            {/* Already Selling */}
            <button
              type="button"
              onClick={() => handleSelectSellingStatus("ALREADY_SELLING")}
              className={cn(
                "group relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 active:scale-[0.98] shadow-2xs cursor-pointer",
                sellingStatus === "ALREADY_SELLING"
                  ? "border-primary bg-secondary/40 ring-1 ring-primary/40 shadow-xs"
                  : "border-border bg-card hover:border-border/80 hover:bg-muted/30",
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  sellingStatus === "ALREADY_SELLING"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground group-hover:text-primary",
                )}
              >
                <TrendingUp className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">
                    Existing Business
                  </h4>
                  {sellingStatus === "ALREADY_SELLING" && (
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Already selling offline or via social media
                </p>
              </div>
            </button>
          </div>
          {errors.sellingStatus && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.sellingStatus.message}</span>
            </p>
          )}
        </div>

        {/* 3. Current Revenue */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <DollarSign className="size-4 text-primary" />
            Estimated Monthly Revenue{" "}
            <span className="text-destructive">*</span>
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                id: "NO_REVENUE",
                label: "No revenue yet",
                sub: "Just starting out",
              },
              {
                id: "REVENUE_UNDER_10K",
                label: "Under 10k BDT",
                sub: "Per month",
              },
              {
                id: "REVENUE_10K_50K",
                label: "10k - 50k BDT",
                sub: "Per month",
              },
              {
                id: "REVENUE_ABOVE_50K",
                label: "50k+ BDT",
                sub: "Per month",
              },
            ].map((tier) => {
              const isSelected = currentRevenue === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() =>
                    handleSelectRevenue(tier.id as CurrentRevenueTier)
                  }
                  className={cn(
                    "flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-150 active:scale-[0.98] shadow-2xs cursor-pointer",
                    isSelected
                      ? "border-primary bg-secondary/40 ring-1 ring-primary/40 shadow-xs"
                      : "border-border bg-card hover:border-border/80 hover:bg-muted/30",
                  )}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                      {tier.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    {tier.sub}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.currentRevenue && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.currentRevenue.message}</span>
            </p>
          )}
        </div>

        {/* 4. Industry Category */}
        <div className="space-y-2.5">
          <label
            htmlFor="industryCategory"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            <Tag className="size-4 text-primary" />
            Industry Category <span className="text-destructive">*</span>
          </label>

          {/* Quick Suggestion Pills */}
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_CATEGORIES.map((cat) => {
              const isSelected = industryCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChipClick(cat)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-150 active:scale-95 cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : "border-border/80 bg-background text-foreground/80 hover:border-primary/40 hover:bg-secondary/40",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Custom Input */}
          <div className="relative">
            <input
              id="industryCategory"
              type="text"
              placeholder="Or type your category here (e.g. Organic Food)"
              {...register("industryCategory")}
              className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground shadow-2xs transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent ${
                errors.industryCategory
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : "border-border hover:border-border/80"
              }`}
            />
          </div>
          {errors.industryCategory && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.industryCategory.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Step Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          size="lg"
          className="flex-1 justify-center gap-2 rounded-xl text-sm font-bold cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </Button>
        <Button
          type="button"
          onClick={onNext}
          size="lg"
          className="flex-1 justify-center gap-2 rounded-xl text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.99] cursor-pointer"
        >
          <span>Next Step</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
