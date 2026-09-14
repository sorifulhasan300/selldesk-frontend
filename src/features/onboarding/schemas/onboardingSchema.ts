import { z } from "zod";
export * from "../types/plan.types";

export const BD_PHONE_REGEX = /^(?:01|1)[3-9]\d{8}$/;
export const SUBDOMAIN_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const PRODUCT_TYPES = ["PHYSICAL", "DIGITAL", "BOTH"] as const;
export const SELLING_STATUSES = [
  "JUST_STARTING",
  "ALREADY_SELLING",
  "START_SOON",
] as const;
export const REVENUE_TIERS = [
  "NO_REVENUE",
  "REVENUE_0_10K",
  "REVENUE_10K_50K",
  "REVENUE_50K_100K",
  "REVENUE_100K_PLUS",
] as const;

export const step1PackageSchema = z.object({
  packageId: z.string().trim().optional().or(z.literal("")),
  selectedPackageId: z.string().trim().optional().or(z.literal("")),
  packageName: z.string().optional(),
  packagePrice: z.number().optional(),
});

export const step2AccountSchema = z.object({
  fullName: z
    .string()
    .trim()
    .max(50, { message: "Full name cannot exceed 50 characters" })
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val.trim().length === 0 || val.trim().length >= 2,
      { message: "Full name must be at least 2 characters long" },
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val.trim().length === 0) return true;
        return z.string().email().safeParse(val).success;
      },
      { message: "Please enter a valid email address" },
    ),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val.trim().length === 0) return true;
        const clean = val.replace(/[\s-]/g, "");
        return /^(?:\+?880|880|0)?1[3-9]\d{8}$|^\+?[1-9]\d{8,14}$/.test(clean);
      },
      {
        message: "Please enter a valid mobile number (e.g. 017XXXXXXXX)",
      },
    ),
  password: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || val.length === 0 || val.length >= 8, {
      message: "Password must be at least 8 characters long",
    }),
});

export const step3StoreSchema = z.object({
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
  storePhone: z
    .string()
    .trim()
    .min(10, { message: "Phone number is too short" })
    .max(20, { message: "Phone number is too long" })
    .refine(
      (val) => {
        const clean = val.replace(/[\s-]/g, "");
        return /^(?:\+?880|880|0)?1[3-9]\d{8}$|^\+?[1-9]\d{8,14}$/.test(clean);
      },
      {
        message: "Please enter a valid mobile number (e.g. 017XXXXXXXX)",
      },
    ),
  productType: z.enum(PRODUCT_TYPES, {
    error: "Please select a product type",
  }),
  sellingStatus: z.enum(SELLING_STATUSES).optional(),
  currentRevenue: z.enum(REVENUE_TIERS).optional(),
  industryCategory: z.string().trim().max(50).optional(),
  logo: z.string().optional().or(z.literal("")),
  banner: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  logoPublicId: z.string().optional().or(z.literal("")),
  bannerUrl: z.string().optional().or(z.literal("")),
  bannerPublicId: z.string().optional().or(z.literal("")),
});

export const onboardingFormSchema = step1PackageSchema
  .merge(step2AccountSchema.partial())
  .merge(step3StoreSchema);

export type Step1PackageFormData = z.infer<typeof step1PackageSchema>;
export type Step2AccountFormData = z.infer<typeof step2AccountSchema>;
export type Step3StoreFormData = z.infer<typeof step3StoreSchema>;
export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;

export type ProductType = (typeof PRODUCT_TYPES)[number];
export type SellingStatus = (typeof SELLING_STATUSES)[number];
export type CurrentRevenueTier = (typeof REVENUE_TIERS)[number];

export function generateSubdomainSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

export const defaultOnboardingValues: OnboardingFormData = {
  packageId: "free-trial",
  selectedPackageId: "free-trial",
  packageName: "Free Trial",
  packagePrice: 0,
  fullName: "",
  email: "",
  phone: "",
  password: "",
  storeName: "",
  subDomain: "",
  storePhone: "",
  productType: "PHYSICAL",
  sellingStatus: "JUST_STARTING",
  currentRevenue: "NO_REVENUE",
  industryCategory: "Fashion & Apparel",
  logo: "",
  banner: "",
  logoUrl: "",
  logoPublicId: "",
  bannerUrl: "",
  bannerPublicId: "",
};
