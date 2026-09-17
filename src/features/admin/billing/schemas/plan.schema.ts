import { z } from "zod";

export const planFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Plan name is required" }),
  price: z.coerce
    .number()
    .min(0, { message: "Price must be greater than or equal to 0" }),
  durationDays: z.coerce
    .number()
    .int()
    .min(1, { message: "Duration must be at least 1 day" })
    .default(30),
  productLimit: z.coerce.number().int().min(0).optional().nullable(),
  isUnlimitedProduct: z.boolean().default(false),
  staffLimit: z.coerce
    .number()
    .int()
    .min(1, { message: "Staff limit must be at least 1" })
    .default(2),
  freeOrders: z.coerce
    .number()
    .int()
    .min(0, { message: "Free orders cannot be negative" })
    .default(500),
  extraOrderRate: z.coerce
    .number()
    .min(0, { message: "Extra order rate cannot be negative" })
    .default(2.0),
  maxLandingPages: z.coerce
    .number()
    .int()
    .min(0, { message: "Max landing pages cannot be negative" })
    .default(10),
  featuresInput: z.string().optional().default(""),
  isActive: z.boolean().default(true),
});

export type PlanFormData = z.infer<typeof planFormSchema>;

export const defaultPlanValues: PlanFormData = {
  name: "",
  price: 0,
  durationDays: 30,
  productLimit: 50,
  isUnlimitedProduct: false,
  staffLimit: 2,
  freeOrders: 500,
  extraOrderRate: 2.0,
  maxLandingPages: 10,
  featuresInput: "online_store, basic_analytics, manual_orders",
  isActive: true,
};

export const extendTrialSchema = z.object({
  days: z.coerce
    .number()
    .int()
    .min(1, { message: "Days must be at least 1" })
    .max(365, { message: "Days cannot exceed 365" }),
  reason: z.string().trim().optional(),
});

export type ExtendTrialFormData = z.infer<typeof extendTrialSchema>;

export const defaultExtendTrialValues: ExtendTrialFormData = {
  days: 7,
  reason: "",
};
