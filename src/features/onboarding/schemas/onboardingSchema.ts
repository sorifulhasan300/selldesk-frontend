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
 * Step 1: Store Identity Schema (স্টোরের প্রাথমিক তথ্য)
 */
export const step1Schema = z.object({
  storeName: z
    .string()
    .trim()
    .min(3, { message: "স্টোরের নাম অন্তত ৩ অক্ষরের হতে হবে" })
    .max(50, { message: "স্টোরের নাম সর্বোচ্চ ৫০ অক্ষরের হতে পারে" }),
  subDomain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, { message: "সাবডোমেন অন্তত ৩ অক্ষরের হতে হবে" })
    .max(30, { message: "সাবডোমেন সর্বোচ্চ ৩০ অক্ষরের হতে পারে" })
    .regex(SUBDOMAIN_REGEX, {
      message:
        "সাবডোমেনে শুধু ছোট হাতের ইংরেজি অক্ষর, সংখ্যা এবং মাঝে হাইফেন (-) ব্যবহার করা যাবে",
    }),
  storePhone: z.string().trim().regex(BD_PHONE_REGEX, {
    message: "সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01704319458)",
  }),
});

/**
 * Step 2: Business Insights Schema (ব্যবসার বিবরণ)
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
    error: "অনুগ্রহ করে প্রোডাক্টের ধরণ নির্বাচন করুন",
  }),
  sellingStatus: z.enum(SELLING_STATUSES, {
    error: "আপনার বর্তমান বিক্রির অবস্থা নির্বাচন করুন",
  }),
  currentRevenue: z.enum(REVENUE_TIERS, {
    error: "বর্তমান মাসিক আয়ের সীমা নির্বাচন করুন",
  }),
  industryCategory: z
    .string()
    .trim()
    .min(2, { message: "ইন্ডাস্ট্রি ক্যাটাগরি লিখুন বা নির্বাচন করুন" })
    .max(50, { message: "ক্যাটাগরির নাম সর্বোচ্চ ৫০ অক্ষরের হতে পারে" }),
});

/**
 * Step 3: Branding & Assets Schema (ব্র্যান্ডিং মিডিয়া - Optional/Skipable)
 */
export const step3Schema = z.object({
  logoUrl: z
    .string()
    .trim()
    .url({ message: "সঠিক লোগো URL দিন" })
    .optional()
    .or(z.literal("")),
  logoPublicId: z.string().optional().or(z.literal("")),
  bannerUrl: z
    .string()
    .trim()
    .url({ message: "সঠিক ব্যানার URL দিন" })
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
