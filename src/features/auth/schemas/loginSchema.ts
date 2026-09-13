import { z } from "zod";

/**
 * Login Form Zod Validation Schema
 * Supports authentication via email or mobile phone number.
 */
export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .trim()
    .min(1, { message: "Email or phone number is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().default(false).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Initial / Default Login Form Values
 */
export const defaultLoginValues: LoginFormData = {
  emailOrPhone: "",
  password: "",
  rememberMe: false,
};
