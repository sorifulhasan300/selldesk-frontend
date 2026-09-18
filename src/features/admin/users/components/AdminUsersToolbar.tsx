"use client";

import React from "react";
import { Search, RotateCw, X, Loader2, UserPlus } from "lucide-react";
import { UserRoleFilter } from "./UserRoleFilter";

export interface AdminUsersToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onSubmitSearch: () => void;
  isSearching?: boolean;
  roleFilter: string;
  onRoleChange: (role: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onOpenCreateStaff: () => void;
}

export function AdminUsersToolbar({
  searchValue,
  onSearchChange,
  onClearSearch,
  onSubmitSearch,
  isSearching = false,
  roleFilter,
  onRoleChange,
  onRefresh,
  isRefreshing = false,
  onOpenCreateStaff,
}: AdminUsersToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-4">
      {/* Left: Search & Role Filter */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-[10px] border border-admin-line bg-admin-surface w-full sm:w-[280px] md:w-[320px] shadow-2xs focus-within:ring-2 focus-within:ring-admin-brand/20 focus-within:border-admin-brand transition-all">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-admin-brand animate-spin shrink-0" />
          ) : (
            <Search className="w-4 h-4 text-admin-text-soft shrink-0" />
          )}
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmitSearch();
              } else if (e.key === "Escape") {
                e.preventDefault();
                onClearSearch();
              }
            }}
            placeholder="Search by name or email..."
            className="w-full bg-transparent border-none outline-hidden text-[13px] text-admin-text placeholder:text-admin-text-soft pr-1"
          />
          {searchValue ? (
            <button
              type="button"
              onClick={onClearSearch}
              title="Clear search (Esc)"
              aria-label="Clear search"
              className="p-0.5 text-admin-text-soft hover:text-admin-text hover:bg-admin-bg/80 rounded-full transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        <UserRoleFilter roleFilter={roleFilter} onRoleChange={onRoleChange} />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={onRefresh}
          className="w-8 h-8 flex items-center justify-center rounded-[10px] border border-admin-line bg-admin-surface text-admin-text-soft hover:text-admin-text hover:bg-admin-bg/60 transition-colors shadow-2xs cursor-pointer"
          aria-label="Refresh table"
        >
          <RotateCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin text-admin-brand" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={onOpenCreateStaff}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] bg-admin-brand hover:bg-admin-brand-dark text-white text-[13px] font-medium shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Central Staff</span>
        </button>
      </div>
    </div>
  );
}
