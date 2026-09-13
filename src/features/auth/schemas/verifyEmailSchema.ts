import { z } from "zod";

/**
 * 6-Digit Verification OTP Regex Pattern
 */
export const OTP_REGEX = /^\d{6}$/;

/**
 * Email Verification Form Zod Validation Schema
 */
export const verifyEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "ইমেইল এড্রেস আবশ্যক" })
    .email({ message: "সঠিক ইমেইল এড্রেস দিন" }),
  otp: z
    .string()
    .trim()
    .length(6, { message: "ওটিপি কোডটি অবশ্যই ৬ ডিজিটের হতে হবে" })
    .regex(OTP_REGEX, { message: "ওটিপি শুধুমাত্র সংখ্যা (০-৯) হতে হবে" }),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

/**
 * Resend OTP Form Zod Validation Schema
 */
export const resendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "ইমেইল এড্রেস আবশ্যক" })
    .email({ message: "সঠিক ইমেইল এড্রেস দিন" }),
});

export type ResendOtpFormData = z.infer<typeof resendOtpSchema>;
