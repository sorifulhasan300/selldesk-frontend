"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import { uploadImageAction } from "@/shared/actions/uploadActions";
import { toast } from "sonner";

export interface StoreBrandingUploadProps {
  logoUrl?: string;
  logoPublicId?: string;
  bannerUrl?: string;
  bannerPublicId?: string;
  onLogoChange: (url: string, publicId?: string) => void;
  onBannerChange?: (url: string, publicId?: string) => void;
  disabled?: boolean;
}

export function StoreBrandingUpload({
  logoUrl,
  bannerUrl,
  onLogoChange,
  onBannerChange,
  disabled = false,
}: StoreBrandingUploadProps) {
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }

    try {
      setIsUploadingLogo(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageAction(formData, {
        folder: "stores",
        isPublic: true,
      });

      if (res.success && res.data) {
        onLogoChange(res.data.url, res.data.publicId);
        toast.success("Store logo uploaded!");
      } else {
        toast.error("Upload failed", { description: res.error || res.message });
      }
    } catch {
      toast.error("Failed to upload store logo.");
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }

    try {
      setIsUploadingBanner(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageAction(formData, {
        folder: "stores",
        isPublic: true,
      });

      if (res.success && res.data) {
        if (onBannerChange) {
          onBannerChange(res.data.url, res.data.publicId);
        }
        toast.success("Store banner uploaded!");
      } else {
        toast.error("Upload failed", { description: res.error || res.message });
      }
    } catch {
      toast.error("Failed to upload store banner.");
    } finally {
      setIsUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]">
          <Sparkles className="size-3.5 text-[#7C5CFC]" />
          <span>Store Branding</span>
          <span className="text-[11px] font-normal text-[#64748B]">
            (Optional)
          </span>
        </label>
        <span className="text-[11px] text-[#64748B]">Logo & Banner</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Store Logo Card */}
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/50 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1E293B]">
              Store Logo
            </span>
            <span className="text-[10px] text-[#64748B]">1:1 ratio</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Logo Preview */}
            <div className="relative flex size-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-white overflow-hidden shadow-2xs">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Store logo"
                  className="size-full object-contain p-1"
                />
              ) : isUploadingLogo ? (
                <Loader2 className="size-5 animate-spin text-[#7C5CFC]" />
              ) : (
                <ImageIcon className="size-5 text-[#94A3B8]" />
              )}
            </div>

            {/* Logo Actions */}
            <div className="flex flex-col gap-1.5">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                disabled={isUploadingLogo || disabled}
                onChange={handleLogoUpload}
                className="hidden"
                id="storeLogoInput"
              />
              <div className="flex items-center gap-2">
                <label
                  htmlFor="storeLogoInput"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8F9FC] cursor-pointer shadow-2xs transition-colors disabled:opacity-60"
                >
                  <Upload className="size-3 text-[#7C5CFC]" />
                  <span>{logoUrl ? "Change" : "Upload"}</span>
                </label>

                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => onLogoChange("", "")}
                    className="rounded-full p-1.5 text-[#64748B] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove logo"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-[#64748B]">
                PNG, JPG or WEBP up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Store Banner Card */}
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/50 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1E293B]">
              Store Banner
            </span>
            <span className="text-[10px] text-[#64748B]">
              16:9 or 3:1 ratio
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Banner Preview */}
            <div className="relative flex h-14 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-white overflow-hidden shadow-2xs">
              {bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bannerUrl}
                  alt="Store banner"
                  className="size-full object-cover"
                />
              ) : isUploadingBanner ? (
                <Loader2 className="size-5 animate-spin text-[#7C5CFC]" />
              ) : (
                <ImageIcon className="size-5 text-[#94A3B8]" />
              )}
            </div>

            {/* Banner Actions */}
            <div className="flex flex-col gap-1.5">
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                disabled={isUploadingBanner || disabled}
                onChange={handleBannerUpload}
                className="hidden"
                id="storeBannerInput"
              />
              <div className="flex items-center gap-2">
                <label
                  htmlFor="storeBannerInput"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8F9FC] cursor-pointer shadow-2xs transition-colors disabled:opacity-60"
                >
                  <Upload className="size-3 text-[#7C5CFC]" />
                  <span>{bannerUrl ? "Change" : "Upload"}</span>
                </label>

                {bannerUrl && onBannerChange && (
                  <button
                    type="button"
                    onClick={() => onBannerChange("", "")}
                    className="rounded-full p-1.5 text-[#64748B] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove banner"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-[#64748B]">
                Wide header cover image
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
