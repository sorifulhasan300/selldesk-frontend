export type AuditLogStatus = "SUCCESS" | "FAILED";

export interface ActorSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

export interface StoreSummary {
  id: string;
  storeName: string;
  subDomain: string;
  logoUrl?: string | null;
}

export interface AuditLog {
  id: string;
  storeId?: string | null;
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: AuditLogStatus;
  createdAt: string;
  updatedAt?: string;
  actor?: ActorSummary | null;
  store?: StoreSummary | null;
}

export interface AuditLogsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type AuditLogSortBy = "createdAt" | "action" | "targetType";
export type AuditLogSortOrder = "asc" | "desc";

export interface AuditLogsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  actorId?: string;
  storeId?: string;
  status?: AuditLogStatus | "ALL";
  startDate?: string;
  endDate?: string;
  sortBy?: AuditLogSortBy;
  sortOrder?: AuditLogSortOrder;
}

export interface AuditLogsResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: AuditLog[];
  meta: AuditLogsMeta;
}
