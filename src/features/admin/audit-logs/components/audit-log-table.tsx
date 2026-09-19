"use client";

import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { useAdminAuditLogs } from "../hooks/use-admin-audit-logs";
import { getAuditLogColumns } from "./audit-log-columns";
import { AuditLogFilters } from "./audit-log-filters";
import { AuditLogPagination } from "./audit-log-pagination";
import { AuditLogDetailsModal } from "./audit-log-details-modal";
import type { AuditLog, AuditLogSortBy } from "../types/audit-log.types";

export function AuditLogTable() {
  const {
    logs,
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
    setAction,
    setTargetType,
    setStatus,
    setPage,
    setLimit,
    toggleSort,
    resetFilters,
  } = useAdminAuditLogs();

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const columns = useMemo(
    () => getAuditLogColumns({ onViewDetails: (log) => setSelectedLog(log) }),
    [],
  );

  const totalLogs = meta?.total ?? logs.length;

  return (
    <div className="space-y-4">
      {/* Title & Stats */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-admin-text tracking-tight">
          Audit Logs
        </h1>
        <p className="text-[13px] text-admin-text-soft mt-0.5">
          {totalLogs.toLocaleString()} recorded administrative actions and
          security events
        </p>
      </div>

      {/* Main Table Card */}
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-2xs overflow-hidden">
        <AuditLogFilters
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onClearSearch={handleClearSearch}
          onSubmitSearch={handleImmediateSearch}
          isSearching={isSearching}
          actionFilter={query.action || "ALL"}
          onActionChange={setAction}
          targetTypeFilter={query.targetType || "ALL"}
          onTargetTypeChange={setTargetType}
          statusFilter={query.status || "ALL"}
          onStatusChange={setStatus}
          onRefresh={refetch}
          isRefreshing={isFetching}
          onResetFilters={resetFilters}
        />

        <DataTable
          data={logs}
          columns={columns}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          loadingRowsCount={query.limit || 10}
          emptyMessage="No audit logs found matching your filters."
          sortBy={query.sortBy}
          sortOrder={query.sortOrder}
          onSortChange={(colId) => toggleSort(colId as AuditLogSortBy)}
        />

        <AuditLogPagination
          meta={meta}
          rowsPerPage={query.limit || 10}
          onRowsPerPageChange={setLimit}
          onPageChange={setPage}
        />
      </div>

      {/* Details Inspection Modal */}
      <AuditLogDetailsModal
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </div>
  );
}
