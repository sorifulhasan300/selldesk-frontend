import { z } from "zod";

/**
 * Bangladeshi phone number regex pattern
 * Matches: 013XXXXXXXX to 019XXXXXXXX (11 digits total)
 */
export const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

/**
 * Subdomain regex pattern
 * Lowercase alphanumeric characters and hyphens only
 */
export const SUBDOMAIN_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Step 1: Store Identity Schema
 */
export const step1Schema = z.object({
  storeName: z
    .string()
    .trim()
    .min(3, { message: "Store name must be at least 3 characters long" })
    .max(50, { message: "Store name cannot exceed 50 characters" }),
  subDomain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, { message: "Subdomain must be at least 3 characters long" })
    .max(30, { message: "Subdomain cannot exceed 30 characters" })
    .regex(SUBDOMAIN_REGEX, {
      message:
        "Subdomain can only contain lowercase letters, numbers, and hyphens",
    }),
  storePhone: z.string().trim().regex(BD_PHONE_REGEX, {
    message:
      "Please enter a valid Bangladeshi mobile number (e.g., 017XXXXXXXX)",
  }),
});

/**
 * Step 2: Business Insights Schema
 */
export const PRODUCT_TYPES = ["PHYSICAL", "DIGITAL"] as const;
export const SELLING_STATUSES = ["NEWBIE", "ALREADY_SELLING"] as const;
export const REVENUE_TIERS = [
  "NO_REVENUE",
  "REVENUE_UNDER_10K",
  "REVENUE_10K_50K",
  "REVENUE_ABOVE_50K",
] as const;

export const step2Schema = z.object({
  productType: z.enum(PRODUCT_TYPES, {
    error: "Please select a product type",
  }),
  sellingStatus: z.enum(SELLING_STATUSES, {
    error: "Please select your current business stage",
  }),
  currentRevenue: z.enum(REVENUE_TIERS, {
    error: "Please select your estimated monthly revenue",
  }),
  industryCategory: z
    .string()
    .trim()
    .min(2, { message: "Please select or enter an industry category" })
    .max(50, { message: "Category name cannot exceed 50 characters" }),
});

/**
 * Step 3: Branding & Assets Schema (Optional / Skipable)
 */
export const step3Schema = z.object({
  logoUrl: z
    .string()
    .trim()
    .url({ message: "Please enter a valid logo URL" })
    .optional()
    .or(z.literal("")),
  logoPublicId: z.string().optional().or(z.literal("")),
  bannerUrl: z
    .string()
    .trim()
    .url({ message: "Please enter a valid banner URL" })
    .optional()
    .or(z.literal("")),
  bannerPublicId: z.string().optional().or(z.literal("")),
});

/**
 * Combined Complete Onboarding Form Schema
 */
export const onboardingFormSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

// TypeScript Inferred Types
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;

export type ProductType = (typeof PRODUCT_TYPES)[number];
export type SellingStatus = (typeof SELLING_STATUSES)[number];
export type CurrentRevenueTier = (typeof REVENUE_TIERS)[number];

/**
 * Helper to auto-suggest a clean subdomain from store name
 */
export function generateSubdomainSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word chars
    .replace(/[\s_-]+/g, "-") // collapse spaces and underscores to hyphens
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .slice(0, 30);
}

/**
 * Default initial form values
 */
export const defaultOnboardingValues: OnboardingFormData = {
  storeName: "",
  subDomain: "",
  storePhone: "",
  productType: "PHYSICAL",
  sellingStatus: "NEWBIE",
  currentRevenue: "NO_REVENUE",
  industryCategory: "",
  logoUrl: "",
  logoPublicId: "",
  bannerUrl: "",
  bannerPublicId: "",
};
