"use client";

import React from "react";

export function AdminAnalyticsSkeleton() {
  return (
    <div className="space-y-[18px] animate-pulse">
      {/* 4 KPI Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-[18px]">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-admin-surface border border-admin-line rounded-[16px] p-[18px] shadow-2xs"
          >
            <div className="h-3.5 w-24 bg-admin-line rounded mb-3" />
            <div className="h-7 w-28 bg-admin-line rounded mb-2.5" />
            <div className="h-4 w-20 bg-admin-line rounded-full" />
          </div>
        ))}
      </div>

      {/* Charts & Analytics Row Skeleton (1.6fr : 1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mb-[18px]">
        {/* Bar Chart Skeleton */}
        <div className="bg-admin-surface border border-admin-line rounded-[16px] p-5 shadow-2xs flex flex-col justify-between h-[214px]">
          <div className="flex items-center justify-between">
            <div className="h-4 w-48 bg-admin-line rounded" />
            <div className="h-3 w-20 bg-admin-line rounded" />
          </div>
          <div className="flex items-end gap-3.5 h-[120px] pt-2">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
              >
                <div
                  className="w-full rounded-t-[6px] rounded-b-[3px] bg-admin-brand-soft/40"
                  style={{ height: `${40 + (idx % 4) * 20}px` }}
                />
                <div className="h-2.5 w-6 bg-admin-line rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart Skeleton */}
        <div className="bg-admin-surface border border-admin-line rounded-[16px] p-5 shadow-2xs flex flex-col justify-between items-center h-[214px]">
          <div className="w-full flex items-center justify-between">
            <div className="h-4 w-32 bg-admin-line rounded" />
          </div>
          <div className="w-[120px] h-[120px] rounded-full bg-admin-brand-soft/40 flex items-center justify-center">
            <div className="w-[84px] h-[84px] rounded-full bg-admin-surface" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="h-3 w-12 bg-admin-line rounded" />
            <div className="h-3 w-16 bg-admin-line rounded" />
            <div className="h-3 w-10 bg-admin-line rounded" />
          </div>
        </div>
      </div>

      {/* Recent Stores Table Skeleton */}
      <div className="bg-admin-surface border border-admin-line rounded-[16px] overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-admin-line">
          <div className="h-4 w-32 bg-admin-line rounded" />
          <div className="h-3 w-24 bg-admin-line rounded" />
        </div>
        <div className="p-5 space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 py-2 border-b border-admin-line/50 last:border-b-0"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[9px] bg-admin-brand-soft/50 shrink-0" />
                <div className="space-y-1">
                  <div className="h-3.5 w-28 bg-admin-line rounded" />
                  <div className="h-2.5 w-36 bg-admin-line rounded" />
                </div>
              </div>
              <div className="h-3.5 w-20 bg-admin-line rounded hidden sm:block" />
              <div className="h-5 w-16 bg-admin-line rounded-full" />
              <div className="h-3.5 w-20 bg-admin-line rounded hidden md:block" />
              <div className="h-3.5 w-16 bg-admin-line rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
