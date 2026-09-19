import { z } from "zod";

export const auditLogsQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  action: z.string().optional(),
  targetType: z.string().optional(),
  targetId: z.string().optional(),
  actorId: z.string().optional(),
  storeId: z.string().optional(),
  status: z.enum(["SUCCESS", "FAILED", "ALL"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(["createdAt", "action", "targetType"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type AuditLogsQueryInput = z.infer<typeof auditLogsQuerySchema>;
