"use client";

import React from "react";
import type { AdminUsersMeta } from "../types/admin-users.types";

export interface AdminUsersPaginationProps {
  meta?: AdminUsersMeta;
  rowsPerPage: number;
  onRowsPerPageChange: (limit: number) => void;
  onPageChange: (page: number) => void;
}

export function AdminUsersPagination({
  meta,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
}: AdminUsersPaginationProps) {
  if (!meta) return null;

  const { page, total, totalPages, hasPrevPage, hasNextPage } = meta;
  const startRecord = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const endRecord = Math.min(page * rowsPerPage, total);

  const renderPagePills = () => {
    const pills: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pills.push(i);
    } else {
      pills.push(1);
      if (page > 3) pills.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pills.includes(i)) pills.push(i);
      }

      if (page < totalPages - 2) pills.push("...");
      if (!pills.includes(totalPages)) pills.push(totalPages);
    }

    return pills.map((p, idx) => {
      if (typeof p === "string") {
        return (
          <span
            key={`dots-${idx}`}
            className="text-admin-text-soft text-[13px] px-0.5 select-none"
          >
            ...
          </span>
        );
      }
      const isActive = p === page;
      return (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-7 h-7 rounded-[8px] text-[13px] font-medium flex items-center justify-center transition-colors cursor-pointer ${
            isActive
              ? "bg-admin-brand text-white font-semibold shadow-xs"
              : "text-admin-text-soft hover:text-admin-text hover:bg-admin-bg/60"
          }`}
        >
          {p}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 border-t border-admin-line text-[13px] text-admin-text-soft select-none">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="rounded-[8px] border border-admin-line bg-admin-surface px-2 py-1 text-[13px] text-admin-text outline-hidden cursor-pointer hover:border-admin-brand/40 transition-colors"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="font-medium text-admin-text-soft">
        Showing {startRecord}–{endRecord} of {total.toLocaleString()}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
          className="px-2 py-1 text-[13px] text-admin-text-soft hover:text-admin-text disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          &lt; Prev
        </button>

        {renderPagePills()}

        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className="px-2 py-1 text-[13px] text-admin-text-soft hover:text-admin-text disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}
