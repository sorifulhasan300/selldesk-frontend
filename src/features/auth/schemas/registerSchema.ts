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
    .min(8, { message: "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে" })
    .regex(/[A-Z]/, {
      message: "পাসওয়ার্ডে অন্তত একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে",
    })
    .regex(/[a-z]/, {
      message: "পাসওয়ার্ডে অন্তত একটি ছোট হাতের অক্ষর (a-z) থাকতে হবে",
    })
    .regex(/[0-9]/, {
      message: "পাসওয়ার্ডে অন্তত একটি সংখ্যা (0-9) থাকতে হবে",
    }),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "শর্তাবলী গ্রহণ করা আবশ্যক",
  }),
  avatarUrl: z.string().optional().or(z.literal("")),
  avatarPublicId: z.string().optional().or(z.literal("")),
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
  avatarUrl: "",
  avatarPublicId: "",
};
