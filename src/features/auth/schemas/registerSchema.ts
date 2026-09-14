import { z } from "zod";

/**
 * Bangladeshi phone number regex pattern
 * Matches: 013XXXXXXXX to 019XXXXXXXX (11 digits total)
 */
export const BD_PHONE_REGEX = /^(?:01|1)[3-9]\d{8}$/;

/**
 * Registration Form Zod Validation Schema
 */
export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  phone: z.string().trim().regex(BD_PHONE_REGEX, {
    message: "Please enter a valid mobile number (e.g., 17XXXXXXXX)",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter (A-Z)",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter (a-z)",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number (0-9)",
    }),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
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
