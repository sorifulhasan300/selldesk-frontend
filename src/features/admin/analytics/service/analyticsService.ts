import { apiClient } from "@/shared/lib/api/client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import type {
  AdminAnalyticsOverviewResponse,
  AdminAnalyticsTimeframe,
} from "../types/analytics.types";

/**
 * Fallback prototype data for smooth local dev / offline resilience
 */
export const FALLBACK_ADMIN_ANALYTICS: AdminAnalyticsOverviewResponse = {
  kpis: {
    totalStores: {
      value: 3218,
      percentage: 6.2,
      isPositive: true,
      label: "Total stores",
    },
    activeStores: {
      value: 2944,
      percentage: 4.1,
      isPositive: true,
      label: "Active stores",
    },
    monthlyRecurringRevenue: {
      value: 1842000,
      currency: "BDT",
      formatted: "৳18,42,000",
      percentage: 9.7,
      isPositive: true,
      label: "Monthly recurring revenue",
    },
    newSignups: {
      value: 186,
      onTrial: 32,
      label: "New signups",
    },
  },
  revenueGrowth: {
    currency: "BDT",
    period: "last_6_months",
    chartData: [
      { month: "Apr", revenue: 58000, target: 100000 },
      { month: "May", revenue: 64000, target: 100000 },
      { month: "Jun", revenue: 70000, target: 100000 },
      { month: "Jul", revenue: 74000, target: 100000 },
      { month: "Aug", revenue: 82000, target: 100000 },
      { month: "Sep", revenue: 92000, target: 100000 },
    ],
  },
  planDistribution: {
    total: 3218,
    plans: [
      { name: "Pro", count: 1866, percentage: 58, color: "var(--brand)" },
      { name: "Business", count: 644, percentage: 20, color: "var(--gold)" },
      { name: "Free", count: 708, percentage: 22, color: "var(--line)" },
    ],
  },
  recentStores: [
    {
      id: "store-1",
      name: "Nabin Fashion",
      subdomain: "nabinfashion.selldesk.com",
      avatar: "NF",
      plan: "Pro — Monthly",
      status: "Active",
      createdAt: "2026-07-12T00:00:00.000Z",
      monthlyRevenue: 4900,
    },
    {
      id: "store-2",
      name: "Rangmohol Craft",
      subdomain: "rangmohol.selldesk.com",
      avatar: "RC",
      plan: "Business — Yearly",
      status: "Active",
      createdAt: "2026-08-03T00:00:00.000Z",
      monthlyRevenue: 12400,
    },
    {
      id: "store-3",
      name: "Taza Bazar",
      subdomain: "tazabazar.selldesk.com",
      avatar: "TB",
      plan: "Free plan",
      status: "Trial",
      createdAt: "2026-08-29T00:00:00.000Z",
      monthlyRevenue: 0,
    },
    {
      id: "store-4",
      name: "Gadget Hub",
      subdomain: "gadgethub.selldesk.com",
      avatar: "GH",
      plan: "Pro — Monthly",
      status: "Suspended",
      createdAt: "2026-06-15T00:00:00.000Z",
      monthlyRevenue: 2100,
    },
    {
      id: "store-5",
      name: "Home Decor BD",
      subdomain: "homedecorbd.selldesk.com",
      avatar: "HD",
      plan: "Business — Monthly",
      status: "Active",
      createdAt: "2026-09-09T00:00:00.000Z",
      monthlyRevenue: 8750,
    },
  ],
};

/**
 * Super Admin Analytics Service
 * Connects to GET /api/v1/admin/analytics/overview
 * Gracefully falls back to prototype data if backend is offline in development
 */
export async function getAdminAnalyticsOverview(
  timeframe: AdminAnalyticsTimeframe = "month",
): Promise<AdminAnalyticsOverviewResponse> {
  const endpoint = API_ENDPOINTS.ADMIN.ANALYTICS.OVERVIEW(timeframe);

  try {
    const response =
      await apiClient.get<AdminAnalyticsOverviewResponse>(endpoint);
    if (response && response.kpis) {
      return response;
    }
    return FALLBACK_ADMIN_ANALYTICS;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[AdminAnalyticsService] Backend unreachable at ${endpoint}. Using prototype fallback.`,
        error,
      );
      return FALLBACK_ADMIN_ANALYTICS;
    }
    throw error;
  }
}
