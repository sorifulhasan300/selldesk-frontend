"use client";

import React, { useState, useRef } from "react";
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
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { OnboardingFormData } from "../schemas/onboardingSchema";
import { uploadImageAction } from "@/shared/actions/uploadActions";
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
  const storeName = watch("storeName") || "Your Store";

  const [logoImgError, setLogoImgError] = useState(false);
  const [bannerImgError, setBannerImgError] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement | null>(null);

  // Quick preset sample logos for rapid onboarding demo
  const sampleLogos = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80",
  ];

  const sampleBanners = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80",
  ];

  // Upload logo file handler
  const handleLogoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file format", {
        description: "Please select an image file (JPG, PNG, WEBP).",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large", {
        description: "Image size must be under 5MB.",
      });
      return;
    }

    try {
      setIsUploadingLogo(true);
      setLogoImgError(false);
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImageAction(formData, {
        folder: "logo",
      });

      if (result.success && result.data) {
        setValue("logoUrl", result.data.url, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("logoPublicId", result.data.publicId, {
          shouldValidate: true,
          shouldDirty: true,
        });
        toast.success("Logo uploaded successfully!");
      } else {
        toast.error("Failed to upload logo", {
          description: result.error || result.message,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload logo";
      toast.error("Failed to upload logo", { description: msg });
    } finally {
      setIsUploadingLogo(false);
      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = "";
      }
    }
  };

  // Upload banner file handler
  const handleBannerFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file format", {
        description: "Please select an image file (JPG, PNG, WEBP).",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large", {
        description: "Image size must be under 5MB.",
      });
      return;
    }

    try {
      setIsUploadingBanner(true);
      setBannerImgError(false);
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImageAction(formData, {
        folder: "banners",
      });

      if (result.success && result.data) {
        setValue("bannerUrl", result.data.url, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("bannerPublicId", result.data.publicId, {
          shouldValidate: true,
          shouldDirty: true,
        });
        toast.success("Banner uploaded successfully!");
      } else {
        toast.error("Failed to upload banner", {
          description: result.error || result.message,
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to upload banner";
      toast.error("Failed to upload banner", { description: msg });
    } finally {
      setIsUploadingBanner(false);
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Heading */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-3 py-0.5 text-xs font-medium text-primary">
          <Sparkles className="size-3" />
          Optional Step
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Add branding & media
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload your store logo and banner. You can also skip this and
          configure them later in your dashboard.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Store Logo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="logoUrl"
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
            >
              <ImageIcon className="size-4 text-primary" />
              Store Logo
            </label>

            {/* Logo File Upload Button */}
            <input
              ref={logoFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isSubmitting || isUploadingLogo}
              onChange={handleLogoFileChange}
              className="hidden"
              id="logoFileInput"
            />
            <button
              type="button"
              disabled={isSubmitting || isUploadingLogo}
              onClick={() => logoFileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-2.5 py-1 text-xs font-medium text-primary hover:bg-secondary transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUploadingLogo ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="size-3" />
                  <span>Upload File</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Live Circular Logo Preview */}
            <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/40 shadow-inner">
              {isUploadingLogo ? (
                <Loader2 className="size-6 animate-spin text-primary" />
              ) : logoUrl && !logoImgError ? (
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
                    Logo Preview
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
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue("logoUrl", "", { shouldValidate: true });
                      setValue("logoPublicId", "", { shouldValidate: true });
                    }}
                    className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Remove"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Sample presets */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>Sample logos:</span>
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
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    Demo {i + 1}
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="bannerUrl"
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
            >
              <UploadCloud className="size-4 text-primary" />
              Store Banner
            </label>

            {/* Banner File Upload Button */}
            <input
              ref={bannerFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isSubmitting || isUploadingBanner}
              onChange={handleBannerFileChange}
              className="hidden"
              id="bannerFileInput"
            />
            <button
              type="button"
              disabled={isSubmitting || isUploadingBanner}
              onClick={() => bannerFileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-2.5 py-1 text-xs font-medium text-primary hover:bg-secondary transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUploadingBanner ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="size-3" />
                  <span>Upload File</span>
                </>
              )}
            </button>
          </div>

          {/* Banner Live Card Preview */}
          <div className="relative aspect-3/1 w-full overflow-hidden rounded-xl border border-border bg-muted/40 shadow-xs">
            {isUploadingBanner ? (
              <div className="flex size-full items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : bannerUrl && !bannerImgError ? (
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
                  Recommended size: 1200x400 pixels
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
              {bannerUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setValue("bannerUrl", "", { shouldValidate: true });
                    setValue("bannerPublicId", "", { shouldValidate: true });
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Remove"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Sample presets */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>Sample banners:</span>
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
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  Demo {i + 1}
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
            No logo or banner right now? You can always upload or update them
            later from your store&apos;s <strong>Settings</strong> page.
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
            disabled={isSubmitting || isUploadingLogo || isUploadingBanner}
            className="flex-1 justify-center gap-2 rounded-xl text-sm font-bold cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Back</span>
          </Button>

          {/* Primary CTA: Create Store */}
          <Button
            type="button"
            onClick={() => onSubmit(false)}
            size="lg"
            disabled={isSubmitting || isUploadingLogo || isUploadingBanner}
            className="flex-2 justify-center gap-2 rounded-xl text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating store...</span>
              </>
            ) : (
              <span>Create Store 🚀</span>
            )}
          </Button>
        </div>

        {/* Skip for now button */}
        <div className="text-center">
          <button
            type="button"
            disabled={isSubmitting || isUploadingLogo || isUploadingBanner}
            onClick={() => onSubmit(true)}
            className="inline-flex items-center justify-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:underline active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
