export type StoreOperationalStatus =
  | "Active"
  | "Trial"
  | "Suspended"
  | "Disabled";

export interface StoreOwner {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface AdminStoreItem {
  id: string;
  storeName: string;
  subDomain: string;
  status: StoreOperationalStatus;
  isTrial: boolean;
  trialEndDate?: string | null;
  subscriptionStatus?: string;
  productType?: string;
  owner?: StoreOwner | null;
  currentPlan: string;
  ordersCount: number;
  monthlyRevenue: number;
  createdAt: string;
}

export interface AdminStoresQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  plan?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdminStoresMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AdminStoresResponse {
  data: AdminStoreItem[];
  meta: AdminStoresMeta;
}
