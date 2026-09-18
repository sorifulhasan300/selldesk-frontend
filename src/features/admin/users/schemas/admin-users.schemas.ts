import { z } from "zod";

export const createStaffSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(["SUPER_ADMIN", "SUPER_STAFF"], {
    message: "Staff role must be either SUPER_ADMIN or SUPER_STAFF",
  }),
});

export type CreateStaffFormData = z.infer<typeof createStaffSchema>;

export const defaultCreateStaffValues: CreateStaffFormData = {
  name: "",
  email: "",
  password: "",
  role: "SUPER_STAFF",
};

export const updateRoleSchema = z.object({
  role: z.enum(
    [
      "SUPER_ADMIN",
      "SUPER_STAFF",
      "STORE_OWNER",
      "STORE_MANAGER",
      "STORE_STAFF",
    ],
    {
      message: "Please select a valid role",
    },
  ),
});

export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
