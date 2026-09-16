"use client";

import React, { useState } from "react";
import type { AdminStoreItem } from "../types/stores.types";

export interface ExtendTrialModalProps {
  store: AdminStoreItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (storeId: string, days: number) => void;
  isLoading?: boolean;
}

export function ExtendTrialModal({
  store,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ExtendTrialModalProps) {
  const [days, setDays] = useState(14);

  if (!isOpen || !store) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-admin-surface border border-admin-line rounded-[16px] w-full max-w-md p-6 shadow-xl">
        <h3 className="text-lg font-bold text-admin-text mb-1">
          Extend Trial Duration
        </h3>
        <p className="text-[13px] text-admin-text-soft mb-5">
          Select the number of days to extend the trial period for{" "}
          <strong className="text-admin-text font-semibold">
            {store.storeName}
          </strong>
          .
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`py-3 rounded-[10px] text-sm font-semibold border transition-all cursor-pointer ${
                days === d
                  ? "bg-admin-brand-soft border-admin-brand text-admin-brand"
                  : "bg-admin-bg/50 border-admin-line text-admin-text hover:border-admin-brand/40"
              }`}
            >
              +{d} Days
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-[10px] border border-admin-line text-admin-text-soft hover:text-admin-text hover:bg-admin-bg text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(store.id, days)}
            disabled={isLoading}
            className="px-5 py-2 rounded-[10px] bg-admin-brand text-white hover:bg-admin-brand-dark text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Extending..." : "Confirm Extension"}
          </button>
        </div>
      </div>
    </div>
  );
}
