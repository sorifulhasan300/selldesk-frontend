/**
 * SellDesk Super Admin Analytics Types & Data Contracts
 * Corresponds to NestJS backend DTOs (selldesk-backend/src/app/analytics/dto/admin-analytics.dto.ts)
 */

export type AdminAnalyticsTimeframe = "week" | "month" | "year";

export interface AnalyticsKpiMetric {
  value: number;
  percentage: number;
  isPositive: boolean;
  label: string;
}

export interface AnalyticsMrrMetric {
  value: number;
  currency: string;
  formatted: string;
  percentage: number;
  isPositive: boolean;
  label: string;
}

export interface AnalyticsNewSignupsMetric {
  value: number;
  onTrial: number;
  label: string;
}

export interface RevenueGrowthChartItem {
  month: string;
  revenue: number;
  target: number;
}

export interface RevenueGrowthData {
  currency: string;
  period: string;
  chartData: RevenueGrowthChartItem[];
}

export interface PlanItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PlanDistributionData {
  total: number;
  plans: PlanItem[];
}

export interface RecentStoreItem {
  id: string;
  name: string;
  subdomain: string;
  avatar: string;
  plan: string;
  status: "Active" | "Trial" | "Suspended" | string;
  createdAt: string;
  monthlyRevenue: number;
}

export interface AdminAnalyticsOverviewResponse {
  kpis: {
    totalStores: AnalyticsKpiMetric;
    activeStores: AnalyticsKpiMetric;
    monthlyRecurringRevenue: AnalyticsMrrMetric;
    newSignups: AnalyticsNewSignupsMetric;
  };
  revenueGrowth: RevenueGrowthData;
  planDistribution: PlanDistributionData;
  recentStores: RecentStoreItem[];
}
