import { z } from "zod";

export const approvePaymentSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    message: "Status must be either APPROVED or REJECTED",
  }),
  note: z.string().max(500, "Note cannot exceed 500 characters").optional(),
});

export type ApprovePaymentFormData = z.infer<typeof approvePaymentSchema>;
