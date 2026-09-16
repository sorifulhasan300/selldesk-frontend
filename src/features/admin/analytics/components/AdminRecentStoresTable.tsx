"use client";

import React from "react";
import Link from "next/link";
import type { RecentStoreItem } from "../types/analytics.types";
import {
  formatBdtCurrency,
  getStoreInitials,
  formatDisplayDate,
} from "../utils/formatters";

export interface AdminRecentStoresTableProps {
  recentStores?: RecentStoreItem[];
}

export function AdminRecentStoresTable({
  recentStores = [],
}: AdminRecentStoresTableProps) {
  const stores = recentStores;

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[16px] overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between px-5 py-[18px] border-b border-admin-line">
        <div className="text-[14.5px] font-semibold text-admin-text">
          Recent stores
        </div>
        <Link
          href="/admin/stores"
          className="text-[13px] font-semibold text-admin-brand-dark hover:underline transition-colors"
        >
          View all stores →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-admin-bg/40">
              <th className="text-left text-[12px] text-admin-text-soft font-medium px-5 py-3 border-b border-admin-line uppercase tracking-[0.02em]">
                Store
              </th>
              <th className="text-left text-[12px] text-admin-text-soft font-medium px-5 py-3 border-b border-admin-line uppercase tracking-[0.02em]">
                Plan
              </th>
              <th className="text-left text-[12px] text-admin-text-soft font-medium px-5 py-3 border-b border-admin-line uppercase tracking-[0.02em]">
                Status
              </th>
              <th className="text-left text-[12px] text-admin-text-soft font-medium px-5 py-3 border-b border-admin-line uppercase tracking-[0.02em]">
                Created
              </th>
              <th className="text-left text-[12px] text-admin-text-soft font-medium px-5 py-3 border-b border-admin-line uppercase tracking-[0.02em]">
                Monthly revenue
              </th>
              <th className="w-10 px-5 py-3 border-b border-admin-line" />
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-[13px] text-admin-text-soft"
                >
                  No stores created yet.
                </td>
              </tr>
            ) : (
              stores.map((store, index) => {
                const isLast = index === stores.length - 1;
                const initials = store.avatar || getStoreInitials(store.name);
                const subdomainDisplay = store.subdomain.includes(".")
                  ? store.subdomain
                  : `${store.subdomain}.selldesk.com`;

                const statusClass =
                  store.status === "Active"
                    ? "bg-admin-green-soft text-admin-green"
                    : store.status === "Trial"
                      ? "bg-admin-gold-soft text-admin-gold"
                      : "bg-admin-red-soft text-admin-red";

                const revenueDisplay =
                  typeof store.monthlyRevenue === "number"
                    ? formatBdtCurrency(store.monthlyRevenue)
                    : store.monthlyRevenue;

                return (
                  <tr
                    key={store.id}
                    className="hover:bg-admin-bg/30 transition-colors"
                  >
                    {/* Store Cell */}
                    <td
                      className={`px-5 py-3.5 text-[13.5px] ${
                        isLast ? "border-b-0" : "border-b border-admin-line"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[9px] bg-admin-brand-soft text-admin-brand-dark flex items-center justify-center font-bold text-[12.5px] shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-admin-text leading-tight">
                            {store.name}
                          </div>
                          <div className="text-[12px] text-admin-text-soft leading-snug">
                            {subdomainDisplay}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Plan Cell */}
                    <td
                      className={`px-5 py-3.5 text-[13px] text-admin-text-soft ${
                        isLast ? "border-b-0" : "border-b border-admin-line"
                      }`}
                    >
                      {store.plan}
                    </td>

                    {/* Status Badge Cell */}
                    <td
                      className={`px-5 py-3.5 ${
                        isLast ? "border-b-0" : "border-b border-admin-line"
                      }`}
                    >
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${statusClass}`}
                      >
                        {store.status}
                      </span>
                    </td>

                    {/* Created Date Cell */}
                    <td
                      className={`px-5 py-3.5 text-[13.5px] text-admin-text ${
                        isLast ? "border-b-0" : "border-b border-admin-line"
                      }`}
                    >
                      {formatDisplayDate(store.createdAt)}
                    </td>

                    {/* Monthly Revenue Cell */}
                    <td
                      className={`px-5 py-3.5 text-[13.5px] font-semibold text-admin-text ${
                        isLast ? "border-b-0" : "border-b border-admin-line"
                      }`}
                    >
                      {revenueDisplay}
                    </td>

                    {/* Row Menu Actions */}
                    <td
                      className={`px-5 py-3.5 text-center ${
                        isLast ? "border-b-0" : "border-b border-admin-line"
                      }`}
                    >
                      <button
                        type="button"
                        className="text-admin-text-soft hover:text-admin-text cursor-pointer text-base font-bold select-none p-1 rounded hover:bg-admin-bg transition-colors"
                        aria-label={`Actions for ${store.name}`}
                      >
                        ⋯
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
