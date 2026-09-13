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
  setFormData: (data: Partial<OnboardingFormData>) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: defaultOnboardingValues,
      setStep: (step: number) => set({ currentStep: step }),
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
      name: "selldesk_onboarding_draft_v2",
    },
  ),
);

// React 19 / Next.js safe hydration detection without cascading render warnings
const emptySubscribe = () => () => {};
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
