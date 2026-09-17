"use client";

import React, { useState, useMemo, useCallback } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StoresToolbar } from "./StoresToolbar";
import { StoresPagination } from "./StoresPagination";
import { getStoreColumns } from "./store-columns";
import { useAdminStores } from "../hooks/use-admin-stores";
import { useStoreActions } from "../hooks/use-store-actions";
import { exportStoresToCsv } from "../utils/export-csv";
import type { AdminStoreItem } from "../types/stores.types";

export function StoresManagementTable() {
  const {
    stores,
    meta,
    isLoading,
    isFetching,
    isSearching,
    refetch,
    query,
    searchInput,
    setSearchInput,
    handleImmediateSearch,
    handleClearSearch,
    setStatus,
    setPlan,
    setPage,
    setLimit,
    toggleSort,
  } = useAdminStores();

  const { updateStatus, switchContext } = useStoreActions();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectRow = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(stores.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleStatus = useCallback(
    (store: AdminStoreItem) => {
      const isSuspendedOrDisabled =
        store.status?.toUpperCase() === "SUSPENDED" ||
        store.status?.toUpperCase() === "DISABLED";
      const nextStatus = isSuspendedOrDisabled ? "ACTIVE" : "SUSPENDED";
      updateStatus({ id: store.id, status: nextStatus });
    },
    [updateStatus],
  );

  const handleExportCsv = () => {
    const toExport =
      selectedIds.size > 0
        ? stores.filter((s) => selectedIds.has(s.id))
        : stores;
    exportStoresToCsv(toExport);
  };

  const columns = useMemo(
    () =>
      getStoreColumns({
        onExtendTrial: () => {},
        onToggleStatus: handleToggleStatus,
        onSwitchContext: (id) => switchContext(id),
      }),
    [handleToggleStatus, switchContext],
  );

  const totalStores = meta?.total ?? stores.length;

  return (
    <div className="space-y-4">
      {/* Top Page Title & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl font-bold text-admin-text tracking-tight">
            Stores
          </h1>
          <p className="text-[13px] text-admin-text-soft mt-0.5">
            {totalStores.toLocaleString()} stores across the platform
          </p>
        </div>

        <div className="items-center">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-full border border-admin-line bg-admin-surface text-admin-text hover:bg-admin-bg/60 text-[13px] font-medium transition-colors shadow-2xs cursor-pointer"
          >
            Export
          </button>
        </div>
      </div>

      {/* Main Table Card Surface */}
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-2xs overflow-hidden">
        <StoresToolbar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onClearSearch={handleClearSearch}
          onSubmitSearch={handleImmediateSearch}
          isSearching={isSearching}
          statusFilter={query.status || "all"}
          onStatusChange={setStatus}
          planFilter={query.plan || "all"}
          onPlanChange={setPlan}
          onRefresh={refetch}
          isRefreshing={isFetching}
        />

        <DataTable
          data={stores}
          columns={columns}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          loadingRowsCount={query.limit || 6}
          emptyMessage={
            query.search ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-admin-text">
                  No stores found matching &ldquo;{query.search}&rdquo;
                </p>
                <p className="text-xs text-admin-text-soft mt-1 max-w-sm">
                  Try checking for typos or searching with different keywords (store name, owner name, email, or domain).
                </p>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-3 px-3.5 py-1.5 text-xs font-medium text-admin-brand bg-admin-brand-soft/40 hover:bg-admin-brand-soft rounded-lg transition-colors cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            ) : (
              "No stores found."
            )
          }
          enableRowSelection
          selectedRowIds={selectedIds}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          sortBy={query.sortBy}
          sortOrder={query.sortOrder}
          onSortChange={toggleSort}
        />

        <StoresPagination
          meta={meta}
          rowsPerPage={query.limit || 6}
          onRowsPerPageChange={setLimit}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
