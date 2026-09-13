"use client";

import React, { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Store,
  Globe,
  Phone,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  OnboardingFormData,
  generateSubdomainSlug,
} from "../schemas/onboardingSchema";
import { SubdomainPreview } from "./SubdomainPreview";
import { Button } from "@/components/ui/button";

interface Step1StoreIdentityProps {
  form: UseFormReturn<OnboardingFormData>;
  onNext: () => void;
}

export function Step1StoreIdentity({ form, onNext }: Step1StoreIdentityProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const storeName = watch("storeName");
  const subDomain = watch("subDomain");
  const isManuallyEditedRef = useRef(false);

  // Auto-suggest subdomain as user types storeName if user hasn't explicitly edited it
  useEffect(() => {
    if (!isManuallyEditedRef.current && storeName) {
      const suggested = generateSubdomainSlug(storeName);
      setValue("subDomain", suggested, {
        shouldValidate: !!suggested,
        shouldDirty: true,
      });
    }
  }, [storeName, setValue]);

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isManuallyEditedRef.current = true;
    const cleanVal = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setValue("subDomain", cleanVal, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleResetSubdomain = () => {
    isManuallyEditedRef.current = false;
    const suggested = generateSubdomainSlug(storeName || "");
    setValue("subDomain", suggested, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Heading */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Define your store identity
        </h2>
        <p className="text-sm text-muted-foreground">
          How customers will recognize and discover your online storefront.
        </p>
      </div>

      <div className="space-y-5">
        {/* Store Name Input */}
        <div className="space-y-2">
          <label
            htmlFor="storeName"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            <Store className="size-4 text-primary" />
            Store Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              id="storeName"
              type="text"
              placeholder="e.g. My Lifestyle or Gadget Hub"
              {...register("storeName")}
              className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground shadow-2xs transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent ${
                errors.storeName
                  ? "border-destructive focus-visible:ring-destructive/30"
                  : "border-border hover:border-border/80"
              }`}
            />
          </div>
          {errors.storeName && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.storeName.message}</span>
            </p>
          )}
        </div>

        {/* Subdomain Input with Live Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="subDomain"
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
            >
              <Globe className="size-4 text-primary" />
              Subdomain <span className="text-destructive">*</span>
            </label>
            {storeName && (
              <button
                type="button"
                onClick={handleResetSubdomain}
                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
              >
                <RefreshCw className="size-3" />
                Sync with store name
              </button>
            )}
          </div>

          <div className="relative flex rounded-xl border border-border bg-background shadow-2xs transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring">
            <input
              id="subDomain"
              type="text"
              placeholder="yourstore"
              value={subDomain || ""}
              onChange={handleSubdomainChange}
              className="w-full bg-transparent px-4 py-2.5 font-mono text-sm tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-hidden tabular-nums"
            />
            <span className="flex items-center rounded-r-xl border-l border-border bg-secondary/50 px-3 text-xs font-mono font-medium text-muted-foreground select-none">
              .selldesk.com
            </span>
          </div>

          {errors.subDomain && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.subDomain.message}</span>
            </p>
          )}

          {/* Interactive Live Subdomain Preview Pill */}
          <SubdomainPreview subDomain={subDomain || ""} />
        </div>

        {/* Store Phone Input */}
        <div className="space-y-2">
          <label
            htmlFor="storePhone"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            <Phone className="size-4 text-primary" />
            Official Store Mobile Number{" "}
            <span className="text-destructive">*</span>
          </label>
          <div className="relative flex rounded-xl border border-border bg-background shadow-2xs transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring">
            <span className="flex items-center gap-1 rounded-l-xl border-r border-border bg-secondary/50 px-3 text-xs font-mono font-semibold text-foreground select-none">
              🇧🇩 +88
            </span>
            <input
              id="storePhone"
              type="tel"
              placeholder="01704319458"
              maxLength={11}
              {...register("storePhone")}
              className="w-full bg-transparent px-4 py-2.5 font-mono text-sm tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-hidden tabular-nums"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Used for order notifications, updates, and customer support.
          </p>
          {errors.storePhone && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.storePhone.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={onNext}
          size="lg"
          className="w-full justify-center gap-2 rounded-xl text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.99] cursor-pointer"
        >
          <span>Next Step</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
