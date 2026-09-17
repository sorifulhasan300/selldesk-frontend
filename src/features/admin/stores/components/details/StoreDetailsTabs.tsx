"use client";

import React from "react";

export type StoreDetailTab =
  | "overview"
  | "orders"
  | "products"
  | "billing"
  | "activity";

export interface StoreDetailsTabsProps {
  activeTab: StoreDetailTab;
  onTabChange: (tab: StoreDetailTab) => void;
}

const TABS: { id: StoreDetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "products", label: "Products" },
  { id: "billing", label: "Billing" },
  { id: "activity", label: "Activity log" },
];

export function StoreDetailsTabs({
  activeTab,
  onTabChange,
}: StoreDetailsTabsProps) {
  return (
    <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-none">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-1.5 rounded-[10px] text-[13px] font-medium transition-all select-none cursor-pointer whitespace-nowrap ${
              isActive
                ? "bg-admin-brand text-white shadow-xs font-semibold"
                : "text-admin-text-soft hover:text-admin-text hover:bg-admin-surface/70"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
