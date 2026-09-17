"use client";

import React from "react";
import { Search, Plus, RotateCw, X, Clock } from "lucide-react";
import type { PlanStatusFilter } from "../types/billing.types";

export interface BillingPlansToolbarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  onImmediateSearch: () => void;
  onClearSearch: () => void;
  isDebouncing: boolean;
  statusFilter: PlanStatusFilter;
  onStatusFilterChange: (status: PlanStatusFilter) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onCreatePlan: () => void;
  onOpenExtendTrial: () => void;
}

export function BillingPlansToolbar({
  searchInput,
  onSearchChange,
  onImmediateSearch,
  onClearSearch,
  isDebouncing,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  isRefreshing,
  onCreatePlan,
  onOpenExtendTrial,
}: BillingPlansToolbarProps) {
  const filterTabs: { label: string; value: PlanStatusFilter }[] = [
    { label: "All Plans", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Left side: Search & Status Filters */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        <div className="relative min-w-[220px] max-w-[340px] flex-1">
          <Search className="w-4 h-4 text-admin-text-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onImmediateSearch()}
            placeholder="Search plans by name or feature..."
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

        {/* Status segmented tabs */}
        <div className="flex items-center bg-admin-bg p-1 rounded-[10px] border border-admin-line">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusFilterChange(tab.value)}
              className={`px-3 py-1 text-[12px] font-medium rounded-[7px] transition-all cursor-pointer ${
                statusFilter === tab.value
                  ? "bg-admin-surface text-admin-brand shadow-2xs font-semibold"
                  : "text-admin-text-soft hover:text-admin-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-[10px] bg-admin-surface border border-admin-line text-admin-text-soft hover:text-admin-text hover:bg-admin-bg transition-colors cursor-pointer"
          title="Refresh plans list"
        >
          <RotateCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin text-admin-brand" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={onOpenExtendTrial}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-admin-surface border border-admin-line text-[13px] font-medium text-admin-text hover:bg-admin-bg hover:border-admin-brand/40 transition-all cursor-pointer"
        >
          <Clock className="w-4 h-4 text-admin-gold" />
          <span>Extend Trial</span>
        </button>

        <button
          type="button"
          onClick={onCreatePlan}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-admin-brand hover:bg-admin-brand-dark text-white text-[13px] font-semibold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Plan</span>
        </button>
      </div>
    </div>
  );
}
