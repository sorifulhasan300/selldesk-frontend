"use client";

import React from "react";
import type { AdminStoreDetails } from "../../types/stores.types";

export interface StoreSubscriptionCardProps {
  subscription: AdminStoreDetails["subscription"];
  onManage?: () => void;
}

export function StoreSubscriptionCard({
  subscription,
  onManage,
}: StoreSubscriptionCardProps) {
  const planName = subscription?.planName || "Pro Plan";
  const summary =
    subscription?.summary || "৳1,999 / month · renews Oct 12, 2026";

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[18px] p-6 shadow-2xs">
      <div className="text-[11px] font-bold text-admin-text-soft tracking-wider uppercase mb-3">
        Subscription
      </div>

      <div className="bg-admin-brand-soft/70 rounded-[14px] p-4 flex flex-col justify-between">
        <div>
          <div className="font-bold text-admin-text text-[15px]">
            {planName}
          </div>
          <div className="text-[12.5px] text-admin-brand font-medium mt-1 mb-4">
            {summary}
          </div>
        </div>

        <button
          type="button"
          onClick={onManage}
          className="w-full py-2.5 px-4 rounded-[12px] bg-admin-brand hover:bg-admin-brand-dark text-white text-[13px] font-semibold transition-colors shadow-xs cursor-pointer text-center"
        >
          Manage subscription
        </button>
      </div>
    </div>
  );
}
