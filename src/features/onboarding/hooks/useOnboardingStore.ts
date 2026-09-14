"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  OnboardingFormData,
  defaultOnboardingValues,
} from "../schemas/onboardingSchema";

export const ONBOARDING_STORAGE_KEY = "selldesk_onboarding_draft_v2";

/**
 * Checks if a value is serializable to JSON/localStorage.
 * Rejects DOM File, Blob, function, symbol, etc.
 */
export function isSerializableValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return true;
  }
  if (
    typeof window !== "undefined" &&
    (value instanceof File || value instanceof Blob)
  ) {
    return false;
  }
  if (typeof value === "function" || typeof value === "symbol") {
    return false;
  }
  return true;
}

/**
 * Converts a DOM File to a base64 Data URL for persistent offline preview.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("FileReader result is not a string"));
      }
    };
    reader.onerror = () =>
      reject(reader.error || new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Strips non-serializable objects (DOM Files, Blobs) and preserves valid strings (data URLs, Cloudinary URLs).
 */
export function sanitizeFormData(
  data: Partial<OnboardingFormData> | Record<string, unknown>,
): Partial<OnboardingFormData> {
  if (!data || typeof data !== "object") return {};

  const clean: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(data)) {
    if (val === undefined) continue;

    // Do NOT persist raw DOM File or Blob objects directly
    if (
      typeof window !== "undefined" &&
      (val instanceof File || val instanceof Blob)
    ) {
      continue;
    }

    if (typeof val === "function" || typeof val === "symbol") {
      continue;
    }

    clean[key] = val;
  }

  return clean as Partial<OnboardingFormData>;
}

export interface StoredDraftPayload {
  currentStep?: number;
  isSubdomainManuallyEdited?: boolean;
  formData?: Partial<OnboardingFormData>;
}

/**
 * Safely reads and parses the onboarding draft from localStorage.
 * Handles both Zustand persist wrapper format and raw draft objects,
 * with migration fallback for older storage keys.
 */
export function getStoredOnboardingDraft(): StoredDraftPayload | null {
  if (typeof window === "undefined") return null;

  try {
    let raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);

    // Legacy migration fallback if primary key does not exist
    if (!raw) {
      const legacyKeys = [
        "selldesk_onboarding_v4",
        "selldesk_onboarding_v3",
        "selldesk_onboarding_draft",
      ];
      for (const legKey of legacyKeys) {
        const legacyVal = localStorage.getItem(legKey);
        if (legacyVal) {
          raw = legacyVal;
          try {
            localStorage.setItem(ONBOARDING_STORAGE_KEY, legacyVal);
            localStorage.removeItem(legKey);
          } catch {
            // Storage quota safe
          }
          break;
        }
      }
    }

    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    // Zustand persist wrapper { state: { currentStep, formData, ... }, version: ... }
    if ("state" in parsed && parsed.state && typeof parsed.state === "object") {
      return {
        currentStep:
          typeof parsed.state.currentStep === "number"
            ? parsed.state.currentStep
            : undefined,
        isSubdomainManuallyEdited: Boolean(
          parsed.state.isSubdomainManuallyEdited,
        ),
        formData: parsed.state.formData
          ? sanitizeFormData(parsed.state.formData)
          : undefined,
      };
    }

    // Direct draft format
    const { currentStep, isSubdomainManuallyEdited, ...formData } = parsed;
    return {
      currentStep: typeof currentStep === "number" ? currentStep : undefined,
      isSubdomainManuallyEdited: Boolean(isSubdomainManuallyEdited),
      formData: sanitizeFormData(formData),
    };
  } catch (err) {
    console.warn("Failed to read onboarding draft from localStorage:", err);
    return null;
  }
}

/**
 * Safely writes the onboarding draft to localStorage under selldesk_onboarding_draft_v2.
 * Protected against QuotaExceededError.
 */
export function setStoredOnboardingDraft(
  formData: Partial<OnboardingFormData>,
  currentStep?: number,
  isSubdomainManuallyEdited?: boolean,
): void {
  if (typeof window === "undefined") return;

  try {
    const cleanFormData = sanitizeFormData(formData);
    const payload = {
      state: {
        currentStep: currentStep ?? 1,
        isSubdomainManuallyEdited: Boolean(isSubdomainManuallyEdited),
        formData: cleanFormData,
      },
      version: 0,
    };
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    // If QuotaExceededError occurs (e.g. huge base64 preview), try omitting images in storage
    try {
      const fallbackFormData = { ...sanitizeFormData(formData) };
      if (
        fallbackFormData.logoUrl &&
        fallbackFormData.logoUrl.startsWith("data:")
      ) {
        delete fallbackFormData.logoUrl;
      }
      if (
        fallbackFormData.bannerUrl &&
        fallbackFormData.bannerUrl.startsWith("data:")
      ) {
        delete fallbackFormData.bannerUrl;
      }
      const fallbackPayload = {
        state: {
          currentStep: currentStep ?? 1,
          isSubdomainManuallyEdited: Boolean(isSubdomainManuallyEdited),
          formData: fallbackFormData,
        },
        version: 0,
      };
      localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify(fallbackPayload),
      );
    } catch {
      console.warn("Failed to write onboarding draft to localStorage:", err);
    }
  }
}

/**
 * Clears the onboarding draft from localStorage and purges legacy keys.
 */
export function clearOnboardingDraft(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    localStorage.removeItem("selldesk_onboarding_v4");
    localStorage.removeItem("selldesk_onboarding_v3");
    localStorage.removeItem("selldesk_onboarding_draft");
  } catch (err) {
    console.warn("Failed to clear onboarding draft from localStorage:", err);
  }
}

export interface OnboardingState {
  currentStep: number;
  isSubdomainManuallyEdited: boolean;
  formData: OnboardingFormData;
  setStep: (step: number) => void;
  setIsSubdomainManuallyEdited: (isEdited: boolean) => void;
  setPackage: (
    packageId: string,
    packageName?: string,
    packagePrice?: number,
  ) => void;
  setFormData: (data: Partial<OnboardingFormData>) => void;
  resetOnboarding: () => void;
  clearDraft: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      isSubdomainManuallyEdited: false,
      formData: defaultOnboardingValues,
      setStep: (step: number) => set({ currentStep: step }),
      setIsSubdomainManuallyEdited: (isEdited: boolean) =>
        set({ isSubdomainManuallyEdited: isEdited }),
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
          formData: {
            ...state.formData,
            ...sanitizeFormData(data),
          },
        })),
      resetOnboarding: () => {
        clearOnboardingDraft();
        set({
          currentStep: 1,
          isSubdomainManuallyEdited: false,
          formData: defaultOnboardingValues,
        });
      },
      clearDraft: () => {
        clearOnboardingDraft();
        set({
          currentStep: 1,
          isSubdomainManuallyEdited: false,
          formData: defaultOnboardingValues,
        });
      },
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        isSubdomainManuallyEdited: state.isSubdomainManuallyEdited,
        formData: sanitizeFormData(state.formData) as OnboardingFormData,
      }),
    },
  ),
);

const emptySubscribe = () => () => {};

/**
 * SSR hydration guard for Next.js App Router components.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Convenience hook providing unified access to the onboarding store,
 * persistence helpers, and client hydration status.
 */
export function useOnboardingStorage() {
  const isHydrated = useIsHydrated();
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const isSubdomainManuallyEdited = useOnboardingStore(
    (s) => s.isSubdomainManuallyEdited,
  );
  const formData = useOnboardingStore((s) => s.formData);
  const setStep = useOnboardingStore((s) => s.setStep);
  const setIsSubdomainManuallyEdited = useOnboardingStore(
    (s) => s.setIsSubdomainManuallyEdited,
  );
  const setPackage = useOnboardingStore((s) => s.setPackage);
  const setFormData = useOnboardingStore((s) => s.setFormData);
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);
  const clearDraft = useOnboardingStore((s) => s.clearDraft);

  return {
    isHydrated,
    currentStep,
    isSubdomainManuallyEdited,
    formData,
    setStep,
    setIsSubdomainManuallyEdited,
    setPackage,
    setFormData,
    resetOnboarding,
    clearDraft,
    getStoredDraft: getStoredOnboardingDraft,
    setStoredDraft: setStoredOnboardingDraft,
    clearStoredDraft: clearOnboardingDraft,
  };
}
