"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import {
  type OnboardingFormData,
  onboardingFormSchema,
  defaultOnboardingValues,
} from "../schemas/onboardingSchema";
import {
  useOnboardingStore,
  useIsHydrated,
} from "../hooks/useOnboardingStorage";
import { createStoreAction } from "../actions/storeActions";
import { useTenantStore } from "@/features/tenant/stores/useTenantStore";
import { OnboardingHeader } from "./OnboardingHeader";
import { Step1StoreIdentity } from "./Step1StoreIdentity";
import { Step2BusinessInsights } from "./Step2BusinessInsights";
import { Step3BrandingAssets } from "./Step3BrandingAssets";
import { Button } from "@/components/ui/button";

interface OnboardingWizardProps {
  onComplete?: (data: OnboardingFormData) => Promise<void> | void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const router = useRouter();
  const isHydrated = useIsHydrated();

  const { currentStep, formData, setStep, setFormData, resetOnboarding } =
    useOnboardingStore();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdStoreData, setCreatedStoreData] =
    useState<OnboardingFormData | null>(null);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  // Re-sync form with persisted draft data when hydrated from localStorage
  useEffect(() => {
    if (isHydrated) {
      form.reset(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  // Synchronize form draft changes to reactive storage
  const syncDraftToStore = () => {
    setFormData(form.getValues());
  };

  // Step navigation with strict step validation
  const handleNext = async () => {
    syncDraftToStore();
    if (currentStep === 1) {
      const isValid = await form.trigger([
        "storeName",
        "subDomain",
        "storePhone",
      ]);
      if (!isValid) return;

      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      const isValid = await form.trigger([
        "productType",
        "sellingStatus",
        "currentRevenue",
        "industryCategory",
      ]);
      if (!isValid) return;

      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    syncDraftToStore();
    if (currentStep > 1) {
      setStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Final submission executing Next.js 15 createStoreAction
  const handleFinalSubmit = async (isSkipping: boolean = false) => {
    try {
      setIsSubmitting(true);

      if (isSkipping) {
        form.setValue("logoUrl", "");
        form.setValue("logoPublicId", "");
        form.setValue("bannerUrl", "");
        form.setValue("bannerPublicId", "");
      }

      // Validate all required steps prior to action dispatch
      const isStep1Valid = await form.trigger([
        "storeName",
        "subDomain",
        "storePhone",
      ]);
      const isStep2Valid = await form.trigger([
        "productType",
        "sellingStatus",
        "currentRevenue",
        "industryCategory",
      ]);

      if (!isStep1Valid) {
        setStep(1);
        toast.error("Please review your store's basic information.");
        return;
      }

      if (!isStep2Valid) {
        setStep(2);
        toast.error("Please review your business details.");
        return;
      }

      const allData = form.getValues();

      if (onComplete) {
        await onComplete(allData);
      } else {
        // Dispatch createStoreAction to backend
        const result = await createStoreAction(allData);

        if (!result.success) {
          toast.error("Failed to create store", {
            description:
              result.error ||
              result.message ||
              "Could not complete store setup. Please try again.",
          });
          return;
        }

        // Synchronize active tenant in client Zustand store
        if (result.store) {
          useTenantStore.getState().setTenant(result.store);
        }
      }

      // Draft Cleanup & Handoff: clear local persistence before handoff to dashboard
      resetOnboarding();
      setCreatedStoreData(allData);
      setIsSuccess(true);
      toast.success("Congratulations! Your store is ready 🎉", {
        description: "Redirecting to your dashboard...",
      });

      // Immediate redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.log("Onboarding submission failed:", error);
      toast.error(
        "An unexpected error occurred while creating your store. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    resetOnboarding();
    form.reset(defaultOnboardingValues);
    setIsSuccess(false);
    setCreatedStoreData(null);
  };

  // SSR hydration placeholder
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <OnboardingHeader currentStep={1} />
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-xl animate-pulse rounded-2xl border border-border/60 bg-card p-8 shadow-xl">
            <div className="h-6 w-1/3 rounded-md bg-muted" />
            <div className="mt-4 h-10 w-full rounded-md bg-muted" />
            <div className="mt-4 h-10 w-full rounded-md bg-muted" />
            <div className="mt-6 h-10 w-full rounded-md bg-muted" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-secondary selection:text-secondary-foreground">
      {/* Floating Minimal Header with SellDesk Logo and Progress Bar */}
      <OnboardingHeader currentStep={currentStep} />

      {/* Main Centered Content */}
      <main className="relative flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        {/* Ambient Background Lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden opacity-30"
        >
          <div className="h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="h-80 w-80 rounded-full bg-secondary/40 blur-2xl" />
        </div>

        {/* Success Screen Card */}
        {isSuccess && createdStoreData ? (
          <div className="w-full max-w-xl rounded-2xl border border-border/60 bg-card p-8 shadow-xl backdrop-blur-md text-center space-y-6">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary shadow-xs">
              <Sparkles className="size-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-xs font-semibold text-primary">
                <CheckCircle2 className="size-3.5" /> Store is ready to go live
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                🎉 Congratulations! &quot;{createdStoreData.storeName}&quot;
                created successfully!
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your store subdomain is active. You can now add products and
                start selling.
              </p>
            </div>

            {/* Store Preview Link */}
            <div className="rounded-xl border border-border/80 bg-secondary/40 p-4 text-left">
              <span className="text-xs text-muted-foreground font-medium">
                Your store URL:
              </span>
              <div className="mt-1 flex items-center justify-between gap-2">
                <a
                  href={`https://${createdStoreData.subDomain}.selldesk.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm font-semibold text-primary hover:underline flex items-center gap-1.5 tabular-nums"
                >
                  <span>https://{createdStoreData.subDomain}.selldesk.com</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                onClick={handleStartOver}
                variant="outline"
                className="rounded-xl font-bold cursor-pointer"
              >
                <RotateCcw className="size-4 mr-1.5" />
                <span>Create Another Store</span>
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 rounded-xl font-bold shadow-md cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Centered Frosted Glass Form Container */
          <div
            className="w-full max-w-xl rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-xl backdrop-blur-md"
            onBlur={syncDraftToStore}
          >
            {/* Step 1: Store Identity */}
            {currentStep === 1 && (
              <Step1StoreIdentity form={form} onNext={handleNext} />
            )}

            {/* Step 2: Business Insights */}
            {currentStep === 2 && (
              <Step2BusinessInsights
                form={form}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {/* Step 3: Branding & Assets */}
            {currentStep === 3 && (
              <Step3BrandingAssets
                form={form}
                onBack={handleBack}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
