/**
 * Tenant / Store domain types for SellDesk
 * Aligned with backend Store Prisma schema
 */

export type ProductType = "PHYSICAL" | "DIGITAL" | "BOTH";
export type StoreStatus = "ACTIVE" | "SUSPENDED";

export interface Tenant {
  id: string;
  storeName: string;
  subDomain: string;
  productType?: ProductType | string;
  sellingStatus?: string | null;
  currentRevenue?: string | null;
  industryCategory?: string | null;
  storePhone?: string | null;
  logoUrl?: string | null;
  logoPublicId?: string | null;
  bannerUrl?: string | null;
  bannerPublicId?: string | null;
  isCustomerAuthEnabled?: boolean;
  status?: StoreStatus | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export type TenantSummary = Pick<
  Tenant,
  "id" | "storeName" | "subDomain" | "logoUrl" | "status"
>;
