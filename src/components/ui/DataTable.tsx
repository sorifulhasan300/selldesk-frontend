"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface ColumnDef<TData, TValue = unknown> {
  id: string;
  header:
    | React.ReactNode
    | ((props: { column: ColumnDef<TData, TValue> }) => React.ReactNode);
  accessorKey?: keyof TData;
  accessorFn?: (row: TData) => TValue;
  cell?: (props: {
    row: TData;
    value: TValue;
    index: number;
  }) => React.ReactNode;
  enableSorting?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  width?: string;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  keyExtractor: (row: TData) => string;
  isLoading?: boolean;
  loadingRowsCount?: number;
  emptyMessage?: string | React.ReactNode;
  enableRowSelection?: boolean;
  selectedRowIds?: Set<string>;
  onSelectRow?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (columnId: string) => void;
}

export function DataTable<TData>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  loadingRowsCount = 6,
  emptyMessage = "No records found.",
  enableRowSelection = false,
  selectedRowIds = new Set(),
  onSelectRow,
  onSelectAll,
  sortBy,
  sortOrder = "desc",
  onSortChange,
}: DataTableProps<TData>) {
  const allSelected =
    data.length > 0 &&
    data.every((row) => selectedRowIds.has(keyExtractor(row)));
  const isIndeterminate =
    data.some((row) => selectedRowIds.has(keyExtractor(row))) && !allSelected;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-admin-line">
            {enableRowSelection && (
              <th className="w-12 px-5 py-3.5">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="w-4 h-4 rounded-[4px] border-admin-line text-admin-brand focus:ring-admin-brand cursor-pointer accent-admin-brand"
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sortBy === col.id;
              return (
                <th
                  key={col.id}
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-4 py-3.5 text-[11.5px] font-semibold text-admin-text-soft uppercase tracking-wider select-none ${
                    col.enableSorting
                      ? "cursor-pointer hover:text-admin-text"
                      : ""
                  } ${col.headerClassName || ""}`}
                  onClick={() => col.enableSorting && onSortChange?.(col.id)}
                >
                  <div className="flex items-center gap-1">
                    <span>
                      {typeof col.header === "function"
                        ? col.header({ column: col })
                        : col.header}
                    </span>
                    {col.enableSorting && isSorted && (
                      <span className="text-admin-brand shrink-0">
                        {sortOrder === "asc" ? (
                          <ChevronUp className="w-3.5 h-3.5 inline" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 inline" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: loadingRowsCount }).map((_, rIndex) => (
              <tr
                key={rIndex}
                className="border-b border-admin-line animate-pulse"
              >
                {enableRowSelection && (
                  <td className="px-5 py-4">
                    <div className="w-4 h-4 rounded-[4px] bg-admin-line" />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.id} className="px-4 py-4">
                    <div className="h-4 bg-admin-line rounded-[6px] w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                className="px-5 py-12 text-center text-[13.5px] text-admin-text-soft"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const rowId = keyExtractor(row);
              const isSelected = selectedRowIds.has(rowId);
              const isLast = index === data.length - 1;

              return (
                <tr
                  key={rowId}
                  className={`transition-colors ${
                    isLast ? "" : "border-b border-admin-line"
                  } ${
                    isSelected
                      ? "bg-admin-brand-soft/40"
                      : "hover:bg-admin-bg/40"
                  }`}
                >
                  {enableRowSelection && (
                    <td className="w-12 px-5 py-3.5">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${rowId}`}
                        checked={isSelected}
                        onChange={(e) => onSelectRow?.(rowId, e.target.checked)}
                        className="w-4 h-4 rounded-[4px] border-admin-line text-admin-brand focus:ring-admin-brand cursor-pointer accent-admin-brand"
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const cellValue = col.accessorFn
                      ? col.accessorFn(row)
                      : col.accessorKey
                        ? (row[col.accessorKey] as unknown)
                        : undefined;

                    return (
                      <td
                        key={col.id}
                        className={`px-4 py-3.5 text-[13px] ${
                          col.cellClassName || ""
                        }`}
                      >
                        {col.cell
                          ? col.cell({ row, value: cellValue, index })
                          : (cellValue as React.ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
