"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAdminStoreDetails } from "../../hooks/use-admin-store-details";
import { useStoreActions } from "../../hooks/use-store-actions";
import { StoreDetailsBreadcrumb } from "./StoreDetailsBreadcrumb";
import { StoreDetailsHeader } from "./StoreDetailsHeader";
import { StoreDetailsTabs, type StoreDetailTab } from "./StoreDetailsTabs";
import { StoreDetailsKpiGrid } from "./StoreDetailsKpiGrid";
import { StoreDetailsRevenueChart } from "./StoreDetailsRevenueChart";
import { StoreDetailsRecentOrders } from "./StoreDetailsRecentOrders";
import { StoreOwnerCard } from "./StoreOwnerCard";
import { StoreInfoCard } from "./StoreInfoCard";
import { StoreSubscriptionCard } from "./StoreSubscriptionCard";
import { StoreDetailsSkeleton } from "./StoreDetailsSkeleton";

export interface StoreDetailsViewProps {
  storeId: string;
}

export function StoreDetailsView({ storeId }: StoreDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<StoreDetailTab>("overview");
  const {
    data: store,
    isLoading,
    isError,
    refetch,
  } = useAdminStoreDetails(storeId);
  const { switchContext, updateStatus } = useStoreActions();

  const handleToggleStatus = useCallback(() => {
    if (!store) return;
    const current = store.header.status || store.status;
    const nextStatus =
      current.toUpperCase() === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    updateStatus({ id: store.id, status: nextStatus });
  }, [store, updateStatus]);

  const handleMessageOwner = useCallback(() => {
    if (store?.owner?.email) {
      window.location.href = `mailto:${store.owner.email}`;
    } else {
      toast.info("No email address available for the store owner");
    }
  }, [store]);

  if (isLoading) return <StoreDetailsSkeleton />;

  if (isError || !store) {
    return (
      <div className="bg-admin-surface border border-admin-line rounded-[18px] p-8 text-center max-w-md mx-auto my-12 shadow-2xs">
        <h2 className="text-lg font-bold text-admin-text mb-2">
          Store Not Found
        </h2>
        <p className="text-[13px] text-admin-text-soft mb-5">
          Unable to load store details for ID &ldquo;{storeId}&rdquo;.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/admin/stores"
            className="px-4 py-2 rounded-full border border-admin-line text-[13px] font-medium text-admin-text hover:bg-admin-bg/60 transition-colors"
          >
            Back to stores
          </Link>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-full bg-admin-brand text-white text-[13px] font-semibold hover:bg-admin-brand-dark transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <StoreDetailsBreadcrumb storeName={store.header.storeName} />

      <StoreDetailsHeader
        store={store}
        onSwitchContext={() => switchContext(store.id)}
        onToggleStatus={handleToggleStatus}
        onMessageOwner={handleMessageOwner}
      />

      <StoreDetailsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <StoreDetailsKpiGrid metrics={store.overview.metrics} />
            <StoreDetailsRevenueChart data={store.overview.revenueChart} />
            <StoreDetailsRecentOrders orders={store.overview.recentOrders} />
          </div>

          {/* Right Sidebar Area */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <StoreOwnerCard
              owner={store.owner}
              onSendMessage={handleMessageOwner}
            />
            <StoreInfoCard storeInfo={store.storeInfo} />
            <StoreSubscriptionCard subscription={store.subscription} />
          </div>
        </div>
      )}

      {activeTab !== "overview" && (
        <div className="bg-admin-surface border border-admin-line rounded-[18px] p-8 text-center shadow-2xs">
          <p className="text-[13.5px] text-admin-text-soft">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} records for{" "}
            <span className="font-semibold text-admin-text">
              {store.storeName}
            </span>{" "}
            are synchronized.
          </p>
        </div>
      )}
    </div>
  );
}
