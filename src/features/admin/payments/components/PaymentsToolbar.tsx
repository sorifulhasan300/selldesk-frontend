"use client";

import React from "react";
import { Search, RotateCw, X } from "lucide-react";
import type { PaymentStatusFilter } from "../types/payment.types";

export interface PaymentsToolbarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  onImmediateSearch: () => void;
  onClearSearch: () => void;
  isDebouncing: boolean;
  statusFilter: PaymentStatusFilter;
  onStatusFilterChange: (status: PaymentStatusFilter) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  pendingCount?: number;
}

export function PaymentsToolbar({
  searchInput,
  onSearchChange,
  onImmediateSearch,
  onClearSearch,
  isDebouncing,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  isRefreshing,
  pendingCount = 0,
}: PaymentsToolbarProps) {
  const filterTabs: {
    label: string;
    value: PaymentStatusFilter;
    badge?: number;
  }[] = [
    { label: "All Payments", value: "ALL" },
    { label: "Pending", value: "PENDING", badge: pendingCount },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Left: Search input & Status segmented tabs */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        <div className="relative min-w-[220px] max-w-[340px] flex-1">
          <Search className="w-4 h-4 text-admin-text-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onImmediateSearch()}
            placeholder="Search by store, trx ID, or plan..."
            className="w-full pl-9 pr-8 py-2 bg-admin-surface border border-admin-line rounded-[10px] text-[13px] text-admin-text placeholder:text-admin-text-soft focus:outline-hidden focus:border-admin-brand focus:ring-1 focus:ring-admin-brand/30 transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-admin-text-soft hover:text-admin-text p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isDebouncing && (
          <span className="text-[12px] text-admin-text-soft animate-pulse hidden sm:inline">
            Searching...
          </span>
        )}

        <div className="flex items-center bg-admin-bg p-1 rounded-[10px] border border-admin-line">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusFilterChange(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-1 text-[12px] font-medium rounded-[7px] transition-all cursor-pointer ${
                statusFilter === tab.value
                  ? "bg-admin-surface text-admin-brand shadow-2xs font-semibold"
                  : "text-admin-text-soft hover:text-admin-text"
              }`}
            >
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    statusFilter === tab.value
                      ? "bg-admin-brand-soft text-admin-brand"
                      : "bg-admin-gold-soft text-admin-gold"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Refresh button */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-[10px] bg-admin-surface border border-admin-line text-admin-text-soft hover:text-admin-text hover:bg-admin-bg transition-colors cursor-pointer"
          title="Refresh payments list"
        >
          <RotateCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin text-admin-brand" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
