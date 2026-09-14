"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  OnboardingFormData,
  defaultOnboardingValues,
} from "../schemas/onboardingSchema";

interface OnboardingState {
  currentStep: number;
  formData: OnboardingFormData;
  setStep: (step: number) => void;
  setPackage: (
    packageId: string,
    packageName?: string,
    packagePrice?: number,
  ) => void;
  setFormData: (data: Partial<OnboardingFormData>) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: defaultOnboardingValues,
      setStep: (step: number) => set({ currentStep: step }),
      setPackage: (packageId, packageName, packagePrice) =>
        set((state) => ({
          formData: {
            ...state.formData,
            packageId,
            selectedPackageId: packageId,
            ...(packageName !== undefined && { packageName }),
            ...(packagePrice !== undefined && { packagePrice }),
          },
        })),
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetOnboarding: () =>
        set({
          currentStep: 1,
          formData: defaultOnboardingValues,
        }),
    }),
    {
      name: "selldesk_onboarding_v4",
    },
  ),
);

const emptySubscribe = () => () => {};
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
