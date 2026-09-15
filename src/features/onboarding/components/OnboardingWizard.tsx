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
  getStoredOnboardingDraft,
  setStoredOnboardingDraft,
  clearOnboardingDraft,
  sanitizeFormData,
} from "../hooks/useOnboardingStore";
import {
  createStoreAction,
  updateStoreBrandingAction,
} from "../actions/storeActions";
import { uploadImageToBackend } from "../services/uploadService";
import { useTenantStore } from "@/features/tenant/stores/useTenantStore";
import { OnboardingProgressStepper } from "./OnboardingProgressStepper";
import { StorePlanSummary } from "./StorePlanSummary";
import { StoreBrandingUpload } from "./StoreBrandingUpload";
import { SubdomainInputField } from "./SubdomainInputField";
import { CategorySelectCards } from "./CategorySelectCards";
import { ProductTypeSelectCards } from "./ProductTypeSelectCards";
import { SellingStatusSelectCards } from "./SellingStatusSelectCards";
import { RevenueTierSelectCards } from "./RevenueTierSelectCards";

export type SubmissionStage =
  | "idle"
  | "creating"
  | "uploading"
  | "finalizing"
  | "redirecting";

function OnboardingWizardForm() {
  const router = useRouter();
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const setStep = useOnboardingStore((s) => s.setStep);
  const isSubdomainManuallyEdited = useOnboardingStore(
    (s) => s.isSubdomainManuallyEdited,
  );
  const setIsSubdomainManuallyEdited = useOnboardingStore(
    (s) => s.setIsSubdomainManuallyEdited,
  );
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);

  const [submissionStage, setSubmissionStage] =
    useState<SubmissionStage>("idle");
  const [isUploadingBranding, setIsUploadingBranding] = useState(false);
  const isSubmitting = submissionStage !== "idle" || isUploadingBranding;
  const [isCompleted, setIsCompleted] = useState(false);

  // Client-side image File objects held in memory for post-creation upload
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Compute rehydrated initial draft values from localStorage (selldesk_onboarding_draft_v2) & Zustand
  const initialData = React.useMemo(() => {
    const storedDraft = getStoredOnboardingDraft();
    const storeState = useOnboardingStore.getState();
    const merged: OnboardingFormData = {
      ...defaultOnboardingValues,
      ...storeState.formData,
      ...(storedDraft?.formData || {}),
    };

    const pkgId =
      merged.packageId ||
      merged.selectedPackageId ||
      defaultOnboardingValues.packageId ||
      "free-trial";
    merged.packageId = pkgId;
    merged.selectedPackageId = pkgId;

    const isManual =
      storedDraft?.isSubdomainManuallyEdited ??
      storeState.isSubdomainManuallyEdited ??
      (Boolean(merged.storeName) &&
        Boolean(merged.subDomain) &&
        merged.subDomain !== generateSubdomainSlug(merged.storeName));

    return {
      formData: merged,
      isManualSubdomain: Boolean(isManual),
    };
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: initialData.formData,
    mode: "onTouched",
  });

  const allFormValues = useWatch({ control });
  const storeName = allFormValues?.storeName;
  const subDomain = allFormValues?.subDomain;
  const industryCategory = allFormValues?.industryCategory;
  const productType = allFormValues?.productType;
  const sellingStatus = allFormValues?.sellingStatus;
  const currentRevenue = allFormValues?.currentRevenue;
  const logoPreview =
    allFormValues?.logoPreview || allFormValues?.logoUrl || "";
  const bannerPreview =
    allFormValues?.bannerPreview || allFormValues?.bannerUrl || "";
  const packageName = allFormValues?.packageName;
  const packagePrice = allFormValues?.packagePrice;

  // Initialize step & manual subdomain preference on mount
  useEffect(() => {
    if (initialData.isManualSubdomain) {
      setIsSubdomainManuallyEdited(true);
    }
    setStep(4);
  }, [initialData.isManualSubdomain, setIsSubdomainManuallyEdited, setStep]);

  // Real-time form persistence: watch and auto-sync changes to localStorage & Zustand
  useEffect(() => {
    if (isCompleted || !allFormValues) return;

    const sanitized = sanitizeFormData(
      allFormValues as Partial<OnboardingFormData>,
    );

    // Update Zustand store
    useOnboardingStore.getState().setFormData(sanitized);

    // Persist directly to localStorage under selldesk_onboarding_draft_v2
    setStoredOnboardingDraft(
      {
        ...useOnboardingStore.getState().formData,
        ...sanitized,
      },
      4,
      useOnboardingStore.getState().isSubdomainManuallyEdited,
    );
  }, [allFormValues, isCompleted]);

  // Auto-Sync: As merchant types storeName, slugify into subDomain unless manually edited
  useEffect(() => {
    if (!isSubdomainManuallyEdited && storeName) {
      const slug = generateSubdomainSlug(storeName);
      if (getValues("subDomain") !== slug) {
        setValue("subDomain", slug, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [storeName, isSubdomainManuallyEdited, setValue, getValues]);

  const handleSyncWithStoreName = () => {
    setIsSubdomainManuallyEdited(false);
    if (storeName) {
      const slug = generateSubdomainSlug(storeName);
      setValue("subDomain", slug, { shouldValidate: true, shouldDirty: true });
      toast.success("Subdomain synced with Store Name");
    }
  };

  const onError = (fieldErrors: typeof errors) => {
    console.log("Validation Errors:", fieldErrors);

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
        sellingStatus: "Selling Stage",
        currentRevenue: "Estimated Monthly Revenue",
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
      const currentStoreData = useOnboardingStore.getState().formData;
      const selectedPkg =
        data.packageId ||
        data.selectedPackageId ||
        currentStoreData.packageId ||
        currentStoreData.selectedPackageId ||
        "free-trial";

      // ─────────────────────────────────────────────────────────────
      // STEP 1 (Base Creation):
      // Call POST /api/v1/stores with basic metadata WITHOUT image URLs
      // ─────────────────────────────────────────────────────────────
      setSubmissionStage("creating");

      const baseCreationData: OnboardingFormData = {
        ...data,
        packageId: selectedPkg,
        selectedPackageId: selectedPkg,
        // Enforce no image URLs in Step 1
        logoUrl: "",
        logoPublicId: "",
        bannerUrl: "",
        bannerPublicId: "",
        logoPreview: "",
        bannerPreview: "",
      };

      const result = await createStoreAction(baseCreationData);
      if (!result.success || !result.store?.id) {
        toast.error("Store creation failed", {
          description:
            result.error ||
            result.message ||
            "Failed to initialize store base record. Please try again.",
        });
        setSubmissionStage("idle");
        return;
      }

      const storeId = result.store.id;
      const authToken = result.tokens?.accessToken;

      // Update tenant store in global state
      if (result.store) {
        useTenantStore.getState().setTenant(result.store);
      }

      let logoUrl: string | undefined;
      let logoPublicId: string | undefined;
      let bannerUrl: string | undefined;
      let bannerPublicId: string | undefined;
      let logoFailed = false;
      let bannerFailed = false;

      // ─────────────────────────────────────────────────────────────
      // STEP 2 (Dynamic Logo Upload):
      // Take the selected Logo File object and upload via
      // uploadImageToBackend(logoFile, `selldesk/stores/${storeId}/logo`)
      // ─────────────────────────────────────────────────────────────
      if (logoFile) {
        setSubmissionStage("uploading");
        try {
          const logoResponse = await uploadImageToBackend(
            logoFile,
            `selldesk/stores/${storeId}/logo`,
            { storeId, token: authToken },
          );

          // Extract values safely
          logoUrl = logoResponse?.data?.url || logoResponse?.url;
          logoPublicId =
            logoResponse?.data?.public_id || logoResponse?.public_id;

          if (!logoUrl) {
            logoFailed = true;
          }
        } catch (error: unknown) {
          const uploadErr = error as { response?: { data?: unknown } };
          console.log(
            "Upload Response Error:",
            uploadErr?.response?.data || error,
          );
          logoFailed = true;
        }
      }

      // ─────────────────────────────────────────────────────────────
      // STEP 3 (Dynamic Banner Upload):
      // Take the selected Banner File object and upload via
      // uploadImageToBackend(bannerFile, `selldesk/stores/${storeId}/banner`)
      // ─────────────────────────────────────────────────────────────
      if (bannerFile) {
        setSubmissionStage("uploading");
        try {
          const bannerResponse = await uploadImageToBackend(
            bannerFile,
            `selldesk/stores/${storeId}/banner`,
            { storeId, token: authToken },
          );

          // Extract values safely
          bannerUrl = bannerResponse?.data?.url || bannerResponse?.url;
          bannerPublicId =
            bannerResponse?.data?.public_id || bannerResponse?.public_id;

          if (!bannerUrl) {
            bannerFailed = true;
          }
        } catch (error: unknown) {
          const uploadErr = error as { response?: { data?: unknown } };
          console.log(
            "Upload Response Error:",
            uploadErr?.response?.data || error,
          );
          bannerFailed = true;
        }
      }

      // ─────────────────────────────────────────────────────────────
      // STEP 4 (Database Sync):
      // Extract returned url & public_id from both responses,
      // and pass these URLs to the store PATCH action.
      // ─────────────────────────────────────────────────────────────
      if (logoUrl || bannerUrl) {
        setSubmissionStage("finalizing");
        try {
          console.log("Sending PATCH Payload to Store:", {
            logo_url: logoUrl,
            logo_public_id: logoPublicId,
            banner_url: bannerUrl,
            banner_public_id: bannerPublicId,
          });

          const patchPayload = {
            logoUrl: logoUrl,
            logoPublicId: logoPublicId,
            bannerUrl: bannerUrl,
            bannerPublicId: bannerPublicId,
            logo_url: logoUrl,
            logo_public_id: logoPublicId,
            banner_url: bannerUrl,
            banner_public_id: bannerPublicId,
          };

          const patchRes = await updateStoreBrandingAction(
            storeId,
            patchPayload,
            authToken,
          );

          if (patchRes.success && patchRes.store) {
            useTenantStore.getState().setTenant(patchRes.store);
          }
        } catch (patchErr: unknown) {
          const apiErr = patchErr as { response?: { data?: unknown } };
          console.log(
            "Patch Branding Response Error:",
            apiErr?.response?.data || patchErr,
          );
        }
      }

      // ─────────────────────────────────────────────────────────────
      // STEP 5 (Redirect):
      // Finalize setup, clear drafts, notify user, and redirect
      // ─────────────────────────────────────────────────────────────
      setSubmissionStage("finalizing");
      setIsCompleted(true);

      // Auto-Clean on Successful Submission: clear selldesk_onboarding_draft_v2
      resetOnboarding();
      clearOnboardingDraft();

      if (logoFailed && bannerFailed) {
        toast.warning("Store created successfully!", {
          description:
            "Branding image uploads failed. You can update your logo and banner anytime in Store Settings.",
        });
      } else if (logoFailed) {
        toast.warning("Store created successfully!", {
          description:
            "Logo upload failed. You can update it anytime in Store Settings.",
        });
      } else if (bannerFailed) {
        toast.warning("Store created successfully!", {
          description:
            "Banner upload failed. You can update it anytime in Store Settings.",
        });
      } else {
        toast.success("Store created successfully! 🎉");
      }

      const targetUrl =
        result.redirectUrl ||
        (result.requiresPayment ? "/dashboard?payment=pending" : "/dashboard");

      setSubmissionStage("redirecting");

      // Perform full window navigation to safely reload session cookies
      // and prevent Chrome DevTools Soft-Navigation (reportAllChanges) crash
      if (typeof window !== "undefined") {
        window.location.assign(targetUrl);
      } else {
        router.push(targetUrl);
      }
    } catch (err) {
      toast.error("Failed to create store", {
        description:
          err instanceof Error
            ? err.message
            : "Unexpected error during store setup.",
      });
      setSubmissionStage("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col">
      {/* 1. Global Sticky Onboarding Stepper Header (Step 4: Store Setup) */}
      <OnboardingProgressStepper currentStep={currentStep || 4} />

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
                    "sellingStatus",
                    "currentRevenue",
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
                              "sellingStatus",
                              "currentRevenue",
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
              <input type="hidden" {...register("sellingStatus")} />
              <input type="hidden" {...register("currentRevenue")} />
              <input type="hidden" {...register("industryCategory")} />
              <input type="hidden" {...register("logoUrl")} />
              <input type="hidden" {...register("logoPublicId")} />
              <input type="hidden" {...register("bannerUrl")} />
              <input type="hidden" {...register("bannerPublicId")} />
              <input type="hidden" {...register("logoPreview")} />
              <input type="hidden" {...register("bannerPreview")} />

              {/* Selected Plan Summary Banner */}
              <StorePlanSummary
                packageName={packageName || "Free Trial"}
                packagePrice={packagePrice ?? 0}
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

              {/* 4. Interactive Selling Stage Select Cards */}
              <SellingStatusSelectCards
                value={sellingStatus}
                onChange={(status) =>
                  setValue("sellingStatus", status, { shouldValidate: true })
                }
                disabled={isSubmitting}
                error={errors.sellingStatus?.message}
              />

              {/* 5. Interactive Estimated Monthly Revenue Select Cards */}
              <RevenueTierSelectCards
                value={currentRevenue}
                onChange={(tier) =>
                  setValue("currentRevenue", tier, { shouldValidate: true })
                }
                disabled={isSubmitting}
                error={errors.currentRevenue?.message}
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
                logoPreview={logoPreview}
                bannerPreview={bannerPreview}
                logoUrl={allFormValues?.logoUrl}
                bannerUrl={allFormValues?.bannerUrl}
                onUploadingChange={(isUploading) =>
                  setIsUploadingBranding(isUploading)
                }
                onLogoSelect={(file, previewUrl) => {
                  setLogoFile(file);
                  setValue("logoPreview", previewUrl, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                onLogoChange={(url, publicId) => {
                  setValue("logoUrl", url, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("logoPublicId", publicId || "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setValue("logoPreview", url, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  // Immediately persist state to draft storage
                  useOnboardingStore.getState().setFormData({
                    logoPreview: url,
                    logoUrl: url,
                    logoPublicId: publicId || "",
                  });
                  setStoredOnboardingDraft(
                    {
                      ...getValues(),
                      logoPreview: url,
                      logoUrl: url,
                      logoPublicId: publicId || "",
                    },
                    4,
                    isSubdomainManuallyEdited,
                  );
                }}
                onBannerSelect={(file, previewUrl) => {
                  setBannerFile(file);
                  setValue("bannerPreview", previewUrl, {
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
                  setValue("bannerPreview", url, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  // Immediately persist state to draft storage
                  useOnboardingStore.getState().setFormData({
                    bannerPreview: url,
                    bannerUrl: url,
                    bannerPublicId: publicId || "",
                  });
                  setStoredOnboardingDraft(
                    {
                      ...getValues(),
                      bannerPreview: url,
                      bannerUrl: url,
                      bannerPublicId: publicId || "",
                    },
                    4,
                    isSubdomainManuallyEdited,
                  );
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
                    {submissionStage === "creating"
                      ? "Creating store base..."
                      : submissionStage === "uploading" || isUploadingBranding
                        ? "Uploading store branding..."
                        : submissionStage === "finalizing" ||
                            submissionStage === "redirecting"
                          ? "Finalizing store setup..."
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

export function OnboardingWizard() {
  const isHydrated = useIsHydrated();

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

  return <OnboardingWizardForm />;
}
