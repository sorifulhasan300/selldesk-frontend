"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import type { AdminUserStoreMembership } from "../types/admin-users.types";

export interface UserStoreListProps {
  isLoading: boolean;
  stores?: AdminUserStoreMembership[];
}

export function UserStoreList({ isLoading, stores }: UserStoreListProps) {
  if (isLoading) {
    return (
      <div className="py-8 flex items-center justify-center text-admin-text-soft gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-admin-brand" />
        <span>Loading store associations...</span>
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="py-6 text-center text-admin-text-soft border border-dashed border-admin-line rounded-[10px]">
        No active store memberships linked to this account.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
      {stores.map((membership, idx) => (
        <div
          key={`${membership.store?.id || idx}`}
          className="flex items-center justify-between p-3 rounded-[10px] bg-admin-surface border border-admin-line text-[12.5px]"
        >
          <div>
            <p className="font-semibold text-admin-text">
              {membership.store?.storeName || "Unnamed Store"}
            </p>
            <p className="text-admin-text-soft text-[11px]">
              {membership.store?.subDomain}.selldesk.com
            </p>
          </div>
          <div className="text-right space-y-0.5">
            <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-admin-brand/10 text-admin-brand border border-admin-brand/20">
              {membership.role}
            </span>
            <p className="text-[11px] text-admin-text-soft capitalize">
              Store: {membership.store?.status || "ACTIVE"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
