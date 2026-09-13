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
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
  otp: z
    .string()
    .trim()
    .length(6, { message: "Verification code must be 6 digits" })
    .regex(OTP_REGEX, {
      message: "Verification code must contain digits only",
    }),
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
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

export type ResendOtpFormData = z.infer<typeof resendOtpSchema>;
