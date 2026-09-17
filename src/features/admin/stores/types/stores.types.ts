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

export interface MetricCardValue {
  value: number;
  formatted?: string;
  change: number;
}

export interface MonthlyRevenuePoint {
  month: string;
  year: number;
  revenue: number;
  orders: number;
}

export interface RecentOrderItem {
  id: string;
  orderNumber: string;
  invoiceNo: string;
  customer: {
    id: string | null;
    name: string;
    email: string;
    phone: string | null;
  };
  paymentStatus: string;
  paymentBadge: string;
  orderStatus: string;
  date: string;
  createdAt: string;
  amount: number;
  formattedAmount: string;
}

export interface StoreTag {
  verified: boolean;
  highVolume: boolean;
  courier: string | null;
}

export interface AdminStoreDetails {
  id: string;
  storeName: string;
  subDomain: string;
  status: StoreOperationalStatus | string;
  isTrial: boolean;
  trialEndDate?: string | null;
  subscriptionStatus?: string;
  productType?: string;
  industryCategory?: string | null;
  storePhone?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  createdAt: string;
  currentPlan: string;

  header: {
    id: string;
    storeName: string;
    subDomain: string;
    domainUrl: string;
    status: string;
    initials: string;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    planSummary: string;
    joinedDate: string;
    createdAt: string;
  };

  overview: {
    metrics: {
      totalOrders: MetricCardValue;
      totalRevenue: MetricCardValue;
      customers: MetricCardValue;
      avgOrderValue: MetricCardValue;
      totalProducts: number;
      totalCategories: number;
      totalMembers: number;
    };
    revenueChart: MonthlyRevenuePoint[];
    recentOrders: RecentOrderItem[];
  };

  owner: {
    id: string | null;
    name: string;
    role: string;
    email: string;
    phone: string;
    avatarUrl?: string | null;
    initials: string;
    joinedAt?: string;
  } | null;

  storeInfo: {
    domain: string;
    subDomain: string;
    category: string;
    region: string;
    createdAt: string;
    formattedCreated: string;
    lastActive: string;
    lastActiveAt: string;
    tags: StoreTag;
  };

  subscription: {
    planName: string;
    price: number;
    billingCycle: string;
    status: string;
    isTrial: boolean;
    trialEndDate?: string | null;
    renewsAt: string | null;
    summary: string;
  };

  metrics: {
    totalOrders: number;
    totalRevenue: number;
    customers: number;
    avgOrderValue: number;
    totalProducts: number;
    totalCategories: number;
    totalMembers: number;
  };
  revenueChart: MonthlyRevenuePoint[];
  recentOrders: RecentOrderItem[];
}
