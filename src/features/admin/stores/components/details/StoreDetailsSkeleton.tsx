"use client";

import React from "react";

export function StoreDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-36 bg-admin-line/70 rounded-full mb-5" />

      {/* Header skeleton */}
      <div className="bg-admin-surface border border-admin-line rounded-[20px] p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[16px] bg-admin-line/80" />
          <div className="space-y-2">
            <div className="h-6 w-44 bg-admin-line/80 rounded-md" />
            <div className="h-4 w-64 bg-admin-line/60 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 bg-admin-line/70 rounded-full" />
          <div className="h-9 w-16 bg-admin-line/70 rounded-full" />
          <div className="h-9 w-32 bg-admin-line/70 rounded-full" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-admin-brand/30 rounded-[10px]" />
        <div className="h-8 w-20 bg-admin-line/60 rounded-[10px]" />
        <div className="h-8 w-20 bg-admin-line/60 rounded-[10px]" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-admin-surface border border-admin-line rounded-[18px] p-5 h-28 flex flex-col justify-between"
              >
                <div className="h-3 w-16 bg-admin-line/60 rounded" />
                <div className="h-6 w-20 bg-admin-line/80 rounded" />
                <div className="h-4 w-12 bg-admin-line/50 rounded-full" />
              </div>
            ))}
          </div>

          <div className="bg-admin-surface border border-admin-line rounded-[18px] p-6 h-56 flex flex-col justify-between">
            <div className="h-4 w-40 bg-admin-line/80 rounded" />
            <div className="flex items-end gap-4 h-28">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-full bg-admin-line/40 rounded-[10px]"
                />
              ))}
            </div>
          </div>

          <div className="bg-admin-surface border border-admin-line rounded-[18px] p-6 h-64">
            <div className="h-4 w-32 bg-admin-line/80 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 bg-admin-line/30 rounded" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-admin-surface border border-admin-line rounded-[18px] p-6 h-48" />
          <div className="bg-admin-surface border border-admin-line rounded-[18px] p-6 h-64" />
          <div className="bg-admin-surface border border-admin-line rounded-[18px] p-6 h-40" />
        </div>
      </div>
    </div>
  );
}
