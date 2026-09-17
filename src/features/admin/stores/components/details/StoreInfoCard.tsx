"use client";

import React from "react";
import type { AdminStoreDetails } from "../../types/stores.types";

export interface StoreInfoCardProps {
  storeInfo: AdminStoreDetails["storeInfo"];
}

export function StoreInfoCard({ storeInfo }: StoreInfoCardProps) {
  const domain = storeInfo?.domain || "nabinfashion.selldesk.com";
  const category = storeInfo?.category || "Fashion & apparel";
  const region = storeInfo?.region || "Dhaka, Bangladesh";
  const created = storeInfo?.formattedCreated || "Jul 12, 2026";
  const lastActive = storeInfo?.lastActive || "2 hours ago";

  const tags = storeInfo?.tags;
  const isVerified = tags?.verified ?? true;
  const isHighVolume = tags?.highVolume ?? true;
  const courier = tags?.courier || "Pathao";

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[18px] p-6 shadow-2xs">
      <div className="text-[11px] font-bold text-admin-text-soft tracking-wider uppercase mb-4">
        Store info
      </div>

      <div className="space-y-3.5 text-[13px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-admin-text-soft">Domain</span>
          <a
            href={`https://${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-admin-brand hover:underline truncate max-w-[200px]"
          >
            {domain}
          </a>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-admin-text-soft">Category</span>
          <span className="font-medium text-admin-text">{category}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-admin-text-soft">Region</span>
          <span className="font-medium text-admin-text">{region}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-admin-text-soft">Created</span>
          <span className="font-medium text-admin-text">{created}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-admin-text-soft">Last active</span>
          <span className="font-medium text-admin-text">{lastActive}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-admin-line/60 flex flex-wrap items-center gap-2">
        {isVerified && (
          <span className="px-3 py-1 rounded-full border border-admin-line bg-admin-bg/50 text-admin-text-soft text-[11.5px] font-medium">
            Verified
          </span>
        )}
        {isHighVolume && (
          <span className="px-3 py-1 rounded-full border border-admin-line bg-admin-bg/50 text-admin-text-soft text-[11.5px] font-medium">
            High volume
          </span>
        )}
        <span className="px-3 py-1 rounded-full border border-admin-line bg-admin-bg/50 text-admin-text-soft text-[11.5px] font-medium">
          Courier: {courier}
        </span>
      </div>
    </div>
  );
}
