"use client";

import React from "react";
import { Search, X, RotateCw, Filter } from "lucide-react";

export interface AuditLogFiltersProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  onClearSearch: () => void;
  onSubmitSearch: () => void;
  isSearching: boolean;
  actionFilter: string;
  onActionChange: (action: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  targetTypeFilter: string;
  onTargetTypeChange: (targetType: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onResetFilters: () => void;
}

const ACTION_OPTIONS = [
  { value: "ALL", label: "All Actions" },
  { value: "STORE_STATUS_UPDATE", label: "Store Status Update" },
  { value: "STAFF_ACCOUNT_CREATE", label: "Staff Account Create" },
  { value: "USER_ROLE_UPDATE", label: "User Role Update" },
  { value: "USER_STATUS_UPDATE", label: "User Status Update" },
  { value: "SUBSCRIPTION_PLAN_UPDATE", label: "Plan Update" },
  { value: "SUBSCRIPTION_PAYMENT_APPROVE", label: "Payment Approve" },
  { value: "STORE_SWITCH", label: "Store Switch" },
];

const TARGET_TYPE_OPTIONS = [
  { value: "ALL", label: "All Targets" },
  { value: "Store", label: "Store" },
  { value: "User", label: "User" },
  { value: "Plan", label: "Plan" },
  { value: "SubscriptionPayment", label: "Payment" },
];

export function AuditLogFilters({
  searchValue,
  onSearchChange,
  onClearSearch,
  onSubmitSearch,
  isSearching,
  actionFilter,
  onActionChange,
  statusFilter,
  onStatusChange,
  targetTypeFilter,
  onTargetTypeChange,
  onRefresh,
  isRefreshing,
  onResetFilters,
}: AuditLogFiltersProps) {
  const hasActiveFilters =
    searchValue.trim() !== "" ||
    actionFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    targetTypeFilter !== "ALL";

  return (
    <div className="p-4 border-b border-admin-line flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="w-4 h-4 text-admin-text-soft absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmitSearch()}
            placeholder="Search action, actor, target..."
            className="w-full pl-9 pr-8 py-1.5 rounded-[10px] bg-admin-bg border border-admin-line text-[13px] text-admin-text placeholder:text-admin-text-soft focus:outline-hidden focus:border-admin-brand"
          />
          {searchValue && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-admin-text-soft hover:text-admin-text cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={actionFilter}
          onChange={(e) => onActionChange(e.target.value)}
          aria-label="Filter by action"
          className="px-3 py-1.5 rounded-[10px] bg-admin-bg border border-admin-line text-[13px] text-admin-text focus:outline-hidden focus:border-admin-brand cursor-pointer"
        >
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={targetTypeFilter}
          onChange={(e) => onTargetTypeChange(e.target.value)}
          aria-label="Filter by target type"
          className="px-3 py-1.5 rounded-[10px] bg-admin-bg border border-admin-line text-[13px] text-admin-text focus:outline-hidden focus:border-admin-brand cursor-pointer"
        >
          {TARGET_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by status"
          className="px-3 py-1.5 rounded-[10px] bg-admin-bg border border-admin-line text-[13px] text-admin-text focus:outline-hidden focus:border-admin-brand cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-admin-brand hover:text-admin-brand/80 px-2 py-1 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        {isSearching && (
          <span className="text-xs text-admin-text-soft animate-pulse">
            Filtering...
          </span>
        )}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-[10px] bg-admin-bg border border-admin-line text-admin-text hover:bg-admin-line/50 transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh audit logs"
        >
          <RotateCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin text-admin-brand" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
