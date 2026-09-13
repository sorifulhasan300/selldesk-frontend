"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tenant } from "../types";
import {
  setClientStoreId,
  setClientTenantSubdomain,
} from "@/shared/lib/api/token";

export interface TenantStoreState {
  currentTenant: Tenant | null;
  isTenantLoaded: boolean;
}

export interface TenantStoreActions {
  /**
   * Set the active tenant context and sync store ID & subdomain headers/cookies.
   */
  setTenant: (tenant: Tenant | null) => void;

  /**
   * Clear active tenant context and remove tenant cookies/storage.
   */
  clearTenant: () => void;
}

export type TenantStore = TenantStoreState & TenantStoreActions;

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      currentTenant: null,
      isTenantLoaded: false,

      setTenant: (tenant: Tenant | null) => {
        if (tenant) {
          setClientStoreId(tenant.id);
          setClientTenantSubdomain(tenant.subDomain);
        } else {
          setClientStoreId(null);
          setClientTenantSubdomain(null);
        }

        set({
          currentTenant: tenant,
          isTenantLoaded: Boolean(tenant),
        });
      },

      clearTenant: () => {
        setClientStoreId(null);
        setClientTenantSubdomain(null);

        set({
          currentTenant: null,
          isTenantLoaded: false,
        });
      },
    }),
    {
      name: "selldesk_tenant_store_v1",
      partialize: (state) => ({
        currentTenant: state.currentTenant,
        isTenantLoaded: state.isTenantLoaded,
      }),
    },
  ),
);

export default useTenantStore;
