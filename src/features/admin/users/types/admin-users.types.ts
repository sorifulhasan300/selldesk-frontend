export type AdminUserRole =
  | "SUPER_ADMIN"
  | "SUPER_STAFF"
  | "STORE_OWNER"
  | "STORE_MANAGER"
  | "STORE_STAFF";

export type AdminStaffRole = "SUPER_ADMIN" | "SUPER_STAFF";

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  role: AdminUserRole;
  createdAt: string;
  _count: {
    stores: number;
  };
}

export interface AdminUsersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: AdminUserRole | "ALL" | string;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface AdminUsersResponse {
  items: AdminUserItem[];
  meta: AdminUsersMeta;
}

export interface AdminUserStoreMembership {
  role: string;
  isActive: boolean;
  store: {
    id: string;
    storeName: string;
    subDomain: string;
    status: string;
  };
}

export interface AdminUserDetails extends Omit<AdminUserItem, "_count"> {
  stores: AdminUserStoreMembership[];
}

export interface CreateAdminStaffDTO {
  name: string;
  email: string;
  password: string;
  role: AdminStaffRole;
}

export interface UpdateUserRoleDTO {
  role: AdminUserRole;
}

export interface UpdateUserStatusDTO {
  isActive: boolean;
}
