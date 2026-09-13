import { z } from "zod";

/**
 * Bangladeshi phone number regex pattern
 * Matches: 013XXXXXXXX to 019XXXXXXXX (11 digits total)
 */
export const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

/**
 * Registration Form Zod Validation Schema
 */
export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: "আপনার সম্পূর্ণ নাম লিখুন" })
    .max(50, { message: "নাম সর্বোচ্চ ৫০ অক্ষরের হতে পারে" }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "সঠিক ইমেইল এড্রেস দিন" })
    .email({ message: "সঠিক ইমেইল এড্রেস দিন" }),
  phone: z.string().trim().regex(BD_PHONE_REGEX, {
    message: "সঠিক বাংলাদেশী মোবাইল নম্বর দিন",
  }),
  password: z
    .string()
    .min(8, { message: "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে" }),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "শর্তাবলী গ্রহণ করা আবশ্যক",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Initial / Default Form Values
 */
export const defaultRegisterValues: RegisterFormData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  agreeTerms: false,
};
