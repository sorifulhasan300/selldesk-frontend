"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  useAdminAnalytics,
  AdminAnalyticsSkeleton,
  AdminAnalyticsError,
  AdminKpiGrid,
  AdminRevenueChart,
  AdminPlanDistribution,
  AdminRecentStoresTable,
} from "@/features/admin/analytics";
import type { AdminAnalyticsTimeframe } from "@/features/admin/analytics";

function AdminOverviewContent() {
  const searchParams = useSearchParams();
  const rawTimeframe = searchParams.get("timeframe");
  const timeframe: AdminAnalyticsTimeframe =
    rawTimeframe === "week" || rawTimeframe === "year" ? rawTimeframe : "month";

  const { data, isLoading, isError, error, refetch } =
    useAdminAnalytics(timeframe);

  if (isLoading) {
    return <AdminAnalyticsSkeleton />;
  }

  if (isError && !data) {
    return <AdminAnalyticsError message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-[18px]">
      {/* Overview KPI Grid */}
      <AdminKpiGrid kpis={data?.kpis} />

      {/* Charts & Analytics Row (1.6fr : 1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mb-[18px]">
        <AdminRevenueChart revenueGrowth={data?.revenueGrowth} />
        <AdminPlanDistribution planDistribution={data?.planDistribution} />
      </div>

      {/* Recent Stores Table Panel */}
      <AdminRecentStoresTable recentStores={data?.recentStores} />
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<AdminAnalyticsSkeleton />}>
      <AdminOverviewContent />
    </Suspense>
  );
}
