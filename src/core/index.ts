/**
 * SellDesk Core Infrastructure Modules
 * Centralized entry point for shared constants, contracts, providers, and global stores.
 */

// API Constants
export * from "@/shared/constants/api-endpoints";

// API Response Contracts & Types
export * from "@/shared/types/api";

// Providers & Notification Utilities
export { ToastProvider, toast } from "@/shared/providers/ToastProvider";
export type { ToastProviderProps } from "@/shared/providers/ToastProvider";

// Core Stores
export { useAuthStore } from "@/features/auth/stores/useAuthStore";
export type {
  AuthStore,
  AuthStoreState,
  AuthStoreActions,
} from "@/features/auth/stores/useAuthStore";

export { useTenantStore } from "@/features/tenant/stores/useTenantStore";
export type {
  TenantStore,
  TenantStoreState,
  TenantStoreActions,
} from "@/features/tenant/stores/useTenantStore";
export type {
  Tenant,
  TenantSummary,
  ProductType,
  StoreStatus,
} from "@/features/tenant/types";
