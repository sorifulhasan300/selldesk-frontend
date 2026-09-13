"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Image as ImageIcon,
  UploadCloud,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle,
  Store,
  Sparkles,
} from "lucide-react";
import { OnboardingFormData } from "../schemas/onboardingSchema";
import { Button } from "@/components/ui/button";

interface Step3BrandingAssetsProps {
  form: UseFormReturn<OnboardingFormData>;
  onBack: () => void;
  onSubmit: (isSkipping?: boolean) => void;
  isSubmitting: boolean;
}

export function Step3BrandingAssets({
  form,
  onBack,
  onSubmit,
  isSubmitting,
}: Step3BrandingAssetsProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const logoUrl = watch("logoUrl");
  const bannerUrl = watch("bannerUrl");
  const storeName = watch("storeName") || "আপনার স্টোর";

  const [logoImgError, setLogoImgError] = useState(false);
  const [bannerImgError, setBannerImgError] = useState(false);

  // Quick preset sample logos for rapid onboarding demo
  const sampleLogos = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80",
  ];

  const sampleBanners = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80",
  ];

  return (
    <div className="space-y-6 font-bengali">
      {/* Step Heading */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-3 py-0.5 text-xs font-medium text-primary">
          <Sparkles className="size-3" />
          ঐচ্ছিক ধাপ (Optional)
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          ব্র্যান্ডিং ও মিডিয়া যুক্ত করুন
        </h2>
        <p className="text-sm text-muted-foreground">
          আপনার স্টোরের লোগো ও ব্যানার দিন। চাইলে এখন স্কিপ করে পরবর্তীতে
          ড্যাশবোর্ড থেকেও যুক্ত করতে পারবেন।
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Store Logo */}
        <div className="space-y-3">
          <label
            htmlFor="logoUrl"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            <ImageIcon className="size-4 text-primary" />
            স্টোরের লোগো (Logo Image URL)
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Live Circular Logo Preview */}
            <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/40 shadow-inner">
              {logoUrl && !logoImgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Store Logo"
                  onError={() => setLogoImgError(true)}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-2 text-center">
                  <Store className="size-6 text-muted-foreground/60" />
                  <span className="text-[10px] text-muted-foreground font-medium mt-1">
                    লোগো প্রিভিউ
                  </span>
                </div>
              )}
            </div>

            {/* Input & Demo Helper */}
            <div className="w-full space-y-2">
              <div className="relative flex rounded-xl border border-border bg-background shadow-2xs transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="logoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  {...register("logoUrl")}
                  onChange={(e) => {
                    setLogoImgError(false);
                    register("logoUrl").onChange(e);
                  }}
                  className="w-full bg-transparent px-4 py-2.5 font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
                />
              </div>

              {/* Sample presets */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>নমুনা লোগো:</span>
                {sampleLogos.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => {
                      setLogoImgError(false);
                      setValue("logoUrl", url, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    ডেমো {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {errors.logoUrl && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.logoUrl.message}</span>
            </p>
          )}
        </div>

        {/* 2. Store Banner */}
        <div className="space-y-3">
          <label
            htmlFor="bannerUrl"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
          >
            <UploadCloud className="size-4 text-primary" />
            স্টোরের ব্যানার (Banner Image URL)
          </label>

          {/* Banner Live Card Preview */}
          <div className="relative aspect-3/1 w-full overflow-hidden rounded-xl border border-border bg-muted/40 shadow-xs">
            {bannerUrl && !bannerImgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bannerUrl}
                alt="Store Banner"
                onError={() => setBannerImgError(true)}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center p-4 text-center bg-gradient-to-r from-secondary/40 via-muted/30 to-secondary/30">
                <ImageIcon className="size-7 text-muted-foreground/60 mb-1" />
                <span className="text-xs font-semibold text-foreground">
                  {storeName}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  ব্যানার সাইজ রিকমেন্ডেশন: ১২০০x৪০০ পিক্সেল
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative flex rounded-xl border border-border bg-background shadow-2xs transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring">
              <input
                id="bannerUrl"
                type="url"
                placeholder="https://example.com/banner.jpg"
                {...register("bannerUrl")}
                onChange={(e) => {
                  setBannerImgError(false);
                  register("bannerUrl").onChange(e);
                }}
                className="w-full bg-transparent px-4 py-2.5 font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
              />
            </div>

            {/* Sample presets */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>নমুনা ব্যানার:</span>
              {sampleBanners.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => {
                    setBannerImgError(false);
                    setValue("bannerUrl", url, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  ডেমো {i + 1}
                </button>
              ))}
            </div>
          </div>

          {errors.bannerUrl && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.bannerUrl.message}</span>
            </p>
          )}
        </div>

        {/* Live Confirmation Preview Box */}
        <div className="rounded-xl border border-border/80 bg-secondary/30 p-3.5 text-xs text-foreground/80 flex items-start gap-2.5">
          <CheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            লোগো বা ব্যানার না থাকলেও সমস্যা নেই। আপনি যেকোনো সময় স্টোর
            ড্যাশবোর্ডের <strong>সেটিংস</strong> পেজ থেকে যেকোনো ছবি বা ব্যানার
            আপলোড করতে পারবেন।
          </p>
        </div>
      </div>

      {/* Step Actions */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            size="lg"
            disabled={isSubmitting}
            className="flex-1 justify-center gap-2 rounded-xl text-sm font-bold"
          >
            <ArrowLeft className="size-4" />
            <span>পেছনে যান</span>
          </Button>

          {/* Primary CTA: "স্টোর তৈরি করুন 🚀" */}
          <Button
            type="button"
            onClick={() => onSubmit(false)}
            size="lg"
            disabled={isSubmitting}
            className="flex-2 justify-center gap-2 rounded-xl text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>স্টোর প্রস্তুত হচ্ছে...</span>
              </>
            ) : (
              <span>স্টোর তৈরি করুন 🚀</span>
            )}
          </Button>
        </div>

        {/* Skip for now button */}
        <div className="text-center">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSubmit(true)}
            className="inline-flex items-center justify-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:underline active:scale-95 disabled:opacity-50"
          >
            এখনি স্কিপ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
