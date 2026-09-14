"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Zap, Headphones } from "lucide-react";
import {
  type PlanPackage,
  type BillingCycle,
  DEFAULT_PACKAGES,
} from "../types/plan.types";
import { useSubscriptionPlans } from "@/features/onboarding/hooks/useSubscriptionPlans";
import { useOnboardingStore } from "@/features/onboarding/hooks/useOnboardingStorage";
import { PlanHeader } from "./PlanHeader";
import { PlanBillingToggle } from "./PlanBillingToggle";
import { PlanPricingCard } from "./PlanPricingCard";
import { OnboardingProgressStepper } from "@/features/onboarding/components/OnboardingProgressStepper";

export function PlanSelectionView() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const { plans, isLoading } = useSubscriptionPlans();
  const selectedPackageId = useOnboardingStore((s) => s.formData.packageId);
  const setPackage = useOnboardingStore((s) => s.setPackage);

  const displayPlans = plans.length > 0 ? plans : DEFAULT_PACKAGES;

  const handleSelectPlan = (plan: PlanPackage) => {
    // Store selected plan in Zustand onboarding store
    setPackage(plan.id, plan.name, plan.price);

    // Persist to cookie for cross-context resilience
    try {
      document.cookie = `selldesk_selected_plan=${encodeURIComponent(plan.id)}; path=/; max-age=604800; SameSite=Lax`;
    } catch {
      // safe fallback
    }

    // Redirect to registration step
    router.push(`/register?plan=${encodeURIComponent(plan.id)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A]">
      <OnboardingProgressStepper currentStep={1} />
      <div className="max-w-7xl mx-auto space-y-10 py-10 px-4 sm:px-6 lg:px-8">
        <PlanHeader />

        <PlanBillingToggle cycle={billingCycle} onChange={setBillingCycle} />

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {isLoading && plans.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-96 rounded-2xl border border-[#E2E8F0] bg-white p-6 animate-pulse space-y-4"
                >
                  <div className="h-6 w-1/2 bg-[#E2E8F0] rounded-md" />
                  <div className="h-4 w-3/4 bg-[#E2E8F0] rounded-md" />
                  <div className="h-10 w-2/3 bg-[#E2E8F0] rounded-md" />
                  <div className="h-px bg-[#E2E8F0] my-4" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-[#E2E8F0] rounded-md" />
                    <div className="h-4 w-5/6 bg-[#E2E8F0] rounded-md" />
                    <div className="h-4 w-4/6 bg-[#E2E8F0] rounded-md" />
                  </div>
                </div>
              ))
            : displayPlans.map((plan) => (
                <PlanPricingCard
                  key={plan.id}
                  plan={plan}
                  billingCycle={billingCycle}
                  isSelected={selectedPackageId === plan.id}
                  onSelect={handleSelectPlan}
                />
              ))}
        </div>

        {/* Trust Guarantees */}
        <div className="pt-8 border-t border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center space-y-1.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
              <ShieldCheck className="size-5" />
            </div>
            <h4 className="text-xs font-bold text-[#0F172A]">
              Zero Risk Guarantee
            </h4>
            <p className="text-[11px] text-[#64748B]">
              No credit card required for 14-day free trial.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-1.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
              <Zap className="size-5" />
            </div>
            <h4 className="text-xs font-bold text-[#0F172A]">
              Instant Store Setup
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Get your store live with custom subdomain in 2 minutes.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-1.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC]">
              <Headphones className="size-5" />
            </div>
            <h4 className="text-xs font-bold text-[#0F172A]">
              24/7 Merchant Support
            </h4>
            <p className="text-[11px] text-[#64748B]">
              Dedicated local onboarding assistance in English & Bengali.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
