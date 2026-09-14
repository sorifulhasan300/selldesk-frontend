"use client";

import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Store, Phone, Loader2, AlertCircle } from "lucide-react";
import {
  onboardingFormSchema,
  defaultOnboardingValues,
  type OnboardingFormData,
  generateSubdomainSlug,
} from "../schemas/onboardingSchema";
import {
  useOnboardingStore,
  useIsHydrated,
} from "../hooks/useOnboardingStorage";
import { createStoreAction } from "../actions/storeActions";
import { useTenantStore } from "@/features/tenant/stores/useTenantStore";
import { OnboardingProgressStepper } from "./OnboardingProgressStepper";
import { StorePlanSummary } from "./StorePlanSummary";
import { StoreBrandingUpload } from "./StoreBrandingUpload";
import { SubdomainInputField } from "./SubdomainInputField";
import { CategorySelectCards } from "./CategorySelectCards";
import { ProductTypeSelectCards } from "./ProductTypeSelectCards";

export function OnboardingWizard() {
  const router = useRouter();
  const isHydrated = useIsHydrated();
  const { formData, setFormData, resetOnboarding } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubdomainManuallyEdited, setIsSubdomainManuallyEdited] =
    useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      ...defaultOnboardingValues,
      ...formData,
      packageId:
        formData?.packageId ||
        formData?.selectedPackageId ||
        defaultOnboardingValues.packageId ||
        "free-trial",
      selectedPackageId:
        formData?.selectedPackageId ||
        formData?.packageId ||
        defaultOnboardingValues.selectedPackageId ||
        "free-trial",
      packageName:
        formData?.packageName ||
        defaultOnboardingValues.packageName ||
        "Free Trial",
      packagePrice:
        formData?.packagePrice ?? defaultOnboardingValues.packagePrice ?? 0,
      industryCategory:
        formData?.industryCategory ||
        defaultOnboardingValues.industryCategory ||
        "Fashion & Apparel",
      productType:
        formData?.productType ||
        defaultOnboardingValues.productType ||
        "PHYSICAL",
      storeName: formData?.storeName || "",
      subDomain: formData?.subDomain || "",
      storePhone: formData?.storePhone || "",
      logo: formData?.logo || "",
      banner: formData?.banner || "",
      logoUrl: formData?.logoUrl || "",
      logoPublicId: formData?.logoPublicId || "",
      bannerUrl: formData?.bannerUrl || "",
      bannerPublicId: formData?.bannerPublicId || "",
    },
    mode: "onTouched",
  });

  const storeName = useWatch({ control, name: "storeName" });
  const subDomain = useWatch({ control, name: "subDomain" });
  const industryCategory = useWatch({ control, name: "industryCategory" });
  const productType = useWatch({ control, name: "productType" });
  const logoUrl = useWatch({ control, name: "logoUrl" });
  const logoPublicId = useWatch({ control, name: "logoPublicId" });
  const bannerUrl = useWatch({ control, name: "bannerUrl" });
  const bannerPublicId = useWatch({ control, name: "bannerPublicId" });

  // Sync state from onboarding store on hydration
  useEffect(() => {
    if (formData) {
      const pkgId =
        formData.packageId || formData.selectedPackageId || "free-trial";
      setValue("packageId", pkgId);
      setValue("selectedPackageId", pkgId);
      if (formData.packageName) setValue("packageName", formData.packageName);
      if (formData.packagePrice !== undefined)
        setValue("packagePrice", formData.packagePrice);
      if (formData.storePhone && !getValues("storePhone")) {
        setValue("storePhone", formData.storePhone);
      }
      if (formData.industryCategory && !getValues("industryCategory")) {
        setValue("industryCategory", formData.industryCategory);
      }
      if (formData.productType && !getValues("productType")) {
        setValue("productType", formData.productType);
      }
    }
  }, [formData, setValue, getValues]);

  // Auto-Sync: As merchant types storeName, slugify into subDomain unless manually edited
  useEffect(() => {
    if (!isSubdomainManuallyEdited && storeName) {
      const slug = generateSubdomainSlug(storeName);
      setValue("subDomain", slug, {
        shouldValidate: true,
      });
    }
  }, [storeName, isSubdomainManuallyEdited, setValue]);

  const handleSyncWithStoreName = () => {
    setIsSubdomainManuallyEdited(false);
    if (storeName) {
      const slug = generateSubdomainSlug(storeName);
      setValue("subDomain", slug, { shouldValidate: true });
      toast.success("Subdomain synced with Store Name");
    }
  };

  const onError = (fieldErrors: typeof errors) => {
    // 1. Console debugging: Log all validation errors directly to console
    console.log("Validation Errors:", fieldErrors);

    // 2. Visual feedback: Trigger sonner toast showing which required field is missing/invalid
    const errorEntries = Object.entries(fieldErrors);
    if (errorEntries.length > 0) {
      const [firstKey, firstError] = errorEntries[0];
      const errorMessage =
        (firstError as { message?: string })?.message ||
        "Please complete all required fields.";

      const fieldLabels: Record<string, string> = {
        storeName: "Store Name",
        subDomain: "Subdomain",
        storePhone: "Merchant Support Phone",
        productType: "Product Type",
        industryCategory: "Store Category",
        packageId: "Package Selection",
        selectedPackageId: "Package Selection",
        fullName: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        password: "Password",
      };

      const readableName = fieldLabels[firstKey] || firstKey;
      toast.error(`Please check ${readableName}`, {
        description: errorMessage,
      });
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsSubmitting(true);
      const submissionData: OnboardingFormData = {
        ...data,
        packageId:
          data.packageId ||
          data.selectedPackageId ||
          formData.packageId ||
          formData.selectedPackageId ||
          "free-trial",
        selectedPackageId:
          data.selectedPackageId ||
          data.packageId ||
          formData.selectedPackageId ||
          formData.packageId ||
          "free-trial",
      };
      setFormData(submissionData);
      const result = await createStoreAction(submissionData);
      if (!result.success) {
        toast.error("Store creation failed", {
          description: result.error || result.message,
        });
        return;
      }

      if (result.store) {
        useTenantStore.getState().setTenant(result.store);
      }
      resetOnboarding();
      toast.success("Store created successfully! 🎉");

      const targetUrl = result.redirectUrl || "/dashboard";
      // Perform full window navigation to safely reload session cookies
      // and prevent Chrome DevTools Soft-Navigation (reportAllChanges) crash
      if (typeof window !== "undefined") {
        window.location.assign(targetUrl);
      } else {
        router.push(targetUrl);
      }
    } catch (err) {
      toast.error("Failed to create store", {
        description: err instanceof Error ? err.message : "Unexpected error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FC] p-4">
        <div className="w-full max-w-lg animate-pulse rounded-2xl border border-[#E2E8F0] bg-white p-8 space-y-4 shadow-sm">
          <div className="h-6 w-1/3 bg-[#E2E8F0] rounded-md" />
          <div className="h-10 w-full bg-[#E2E8F0] rounded-md" />
          <div className="h-28 w-full bg-[#E2E8F0] rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col">
      {/* 1. Global Sticky Onboarding Stepper Header (Step 4: Store Setup) */}
      <OnboardingProgressStepper currentStep={4} />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header Title & Subtitle */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Set Up Your Store
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
              Configure your online storefront address, category, catalog type,
              and branding to begin selling.
            </p>
          </div>

          {/* Moderate-Modern Clean Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-sm">
            <form
              id="onboarding-form"
              onSubmit={handleSubmit(onSubmit, onError)}
              noValidate
              className="space-y-6"
            >
              {/* Global Error Notice for Hidden/Non-rendered fields if any */}
              {Object.keys(errors).some(
                (key) =>
                  ![
                    "storeName",
                    "subDomain",
                    "industryCategory",
                    "productType",
                    "storePhone",
                  ].includes(key),
              ) && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600 flex items-start gap-2 shadow-2xs">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Validation Issue: </span>
                    <span>
                      {Object.entries(errors)
                        .filter(
                          ([k]) =>
                            ![
                              "storeName",
                              "subDomain",
                              "industryCategory",
                              "productType",
                              "storePhone",
                            ].includes(k),
                        )
                        .map(([k, v]) => `${k}: ${v?.message}`)
                        .join(", ")}
                    </span>
                  </div>
                </div>
              )}

              {/* Form State Registered Hidden Inputs */}
              <input type="hidden" {...register("packageId")} />
              <input type="hidden" {...register("selectedPackageId")} />
              <input type="hidden" {...register("packageName")} />
              <input type="hidden" {...register("subDomain")} />
              <input type="hidden" {...register("productType")} />
              <input type="hidden" {...register("industryCategory")} />
              <input type="hidden" {...register("logoUrl")} />
              <input type="hidden" {...register("logoPublicId")} />
              <input type="hidden" {...register("bannerUrl")} />
              <input type="hidden" {...register("bannerPublicId")} />

              {/* Selected Plan Summary Banner */}
              <StorePlanSummary
                packageName={formData.packageName}
                packagePrice={formData.packagePrice}
              />

              {/* Store Name Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="storeName"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]"
                >
                  <Store className="size-3.5 text-[#7C5CFC]" />
                  <span>Store Name *</span>
                </label>
                <input
                  id="storeName"
                  type="text"
                  placeholder="e.g. Maha Fashion"
                  disabled={isSubmitting}
                  {...register("storeName")}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0F172A] shadow-2xs placeholder:text-[#94A3B8] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#7C5CFC]/25 ${
                    errors.storeName
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#E2E8F0] focus:border-[#7C5CFC]"
                  }`}
                />
                {errors.storeName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.storeName.message}</span>
                  </p>
                )}
              </div>

              {/* 2. Auto-Subdomain with Animated Status Badge */}
              <SubdomainInputField
                value={subDomain || ""}
                onChange={(val) =>
                  setValue("subDomain", val, { shouldValidate: true })
                }
                onManualEdit={() => setIsSubdomainManuallyEdited(true)}
                error={errors.subDomain?.message}
                disabled={isSubmitting}
                storeName={storeName}
                onSyncWithStoreName={
                  isSubdomainManuallyEdited
                    ? handleSyncWithStoreName
                    : undefined
                }
              />

              {/* 3. Interactive Category Select Cards */}
              <CategorySelectCards
                value={industryCategory}
                onChange={(cat) =>
                  setValue("industryCategory", cat, { shouldValidate: true })
                }
                disabled={isSubmitting}
                error={errors.industryCategory?.message}
              />

              {/* 3. Interactive Product Type Select Cards */}
              <ProductTypeSelectCards
                value={productType}
                onChange={(pt) =>
                  setValue("productType", pt, { shouldValidate: true })
                }
                disabled={isSubmitting}
                error={errors.productType?.message}
              />

              {/* Support Phone Number */}
              <div className="space-y-1.5">
                <label
                  htmlFor="storePhone"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]"
                >
                  <Phone className="size-3.5 text-[#7C5CFC]" />
                  <span>Merchant Support Phone *</span>
                </label>
                <input
                  id="storePhone"
                  type="tel"
                  placeholder="017XXXXXXXX"
                  disabled={isSubmitting}
                  {...register("storePhone")}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0F172A] shadow-2xs placeholder:text-[#94A3B8] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#7C5CFC]/25 ${
                    errors.storePhone
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#E2E8F0] focus:border-[#7C5CFC]"
                  }`}
                />
                {errors.storePhone ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{errors.storePhone.message}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#64748B]">
                    Primary contact number for order delivery & customer
                    inquiries.
                  </p>
                )}
              </div>

              {/* 4. Store Branding Upload (Both Logo & Banner) */}
              <StoreBrandingUpload
                logoUrl={logoUrl}
                logoPublicId={logoPublicId}
                bannerUrl={bannerUrl}
                bannerPublicId={bannerPublicId}
                onLogoChange={(url, publicId) => {
                  setValue("logoUrl", url, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("logoPublicId", publicId || "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                onBannerChange={(url, publicId) => {
                  setValue("bannerUrl", url, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("bannerPublicId", publicId || "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                disabled={isSubmitting}
              />

              {/* Moderate-Modern Pill CTA Button with Chip Icon */}
              <div className="pt-3">
                <button
                  id="onboarding-submit-button"
                  form="onboarding-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium pl-6 pr-1.5 py-1.5 rounded-full inline-flex items-center justify-between transition-all duration-200 active:scale-[0.99] disabled:opacity-60 cursor-pointer shadow-md"
                >
                  <span className="text-sm font-semibold">
                    {isSubmitting
                      ? "Launching Storefront..."
                      : "Complete Setup & Launch Store"}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#7C5CFC] text-white shadow-xs">
                    {isSubmitting ? (
                      <Loader2 className="size-4.5 animate-spin" />
                    ) : (
                      <Store className="size-4.5" />
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
