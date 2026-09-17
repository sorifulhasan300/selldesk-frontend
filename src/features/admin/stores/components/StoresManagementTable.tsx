"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
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
    refetch,
    query,
    searchInput,
    setSearchInput,
    setStatus,
    setPlan,
    setPage,
    setLimit,
    toggleSort,
  } = useAdminStores();

  const { updateStatus, switchContext } = useStoreActions();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [trialStore, setTrialStore] = useState<AdminStoreItem | null>(null);

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
        onExtendTrial: (store) => setTrialStore(store),
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

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-full border border-admin-line bg-admin-surface text-admin-text hover:bg-admin-bg/60 text-[13px] font-medium transition-colors shadow-2xs cursor-pointer"
          >
            Export
          </button>

          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-full bg-admin-brand text-white hover:bg-admin-brand-dark text-[13px] font-semibold transition-colors shadow-xs"
          >
            New store +
          </Link>
        </div>
      </div>

      {/* Main Table Card Surface */}
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-2xs overflow-hidden">
        <StoresToolbar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          statusFilter={query.status || "all"}
          onStatusChange={setStatus}
          planFilter={query.plan || "all"}
          onPlanChange={setPlan}
          onRefresh={refetch}
          isRefreshing={isLoading}
        />

        <DataTable
          data={stores}
          columns={columns}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          loadingRowsCount={query.limit || 6}
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
