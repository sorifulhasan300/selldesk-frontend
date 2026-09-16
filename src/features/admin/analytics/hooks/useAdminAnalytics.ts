"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminAnalyticsOverview } from "../service/analyticsService";
import type {
  AdminAnalyticsOverviewResponse,
  AdminAnalyticsTimeframe,
} from "../types/analytics.types";
import { apiClient } from "@/shared/lib/api/client";

export interface UseAdminAnalyticsReturn {
  data: AdminAnalyticsOverviewResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  timeframe: AdminAnalyticsTimeframe;
  setTimeframe: (timeframe: AdminAnalyticsTimeframe) => void;
  refetch: () => Promise<void>;
  isFetching: boolean;
}

/**
 * Custom React Hook for Super Admin Analytics Overview
 * Powered by TanStack Query v5 with 5-minute caching and zero-reload instant navigation.
 */
export function useAdminAnalytics(
  initialTimeframe: AdminAnalyticsTimeframe = "month",
): UseAdminAnalyticsReturn {
  const [overrideTimeframe, setOverrideTimeframe] =
    useState<AdminAnalyticsTimeframe | null>(null);
  const [prevInitialTimeframe, setPrevInitialTimeframe] =
    useState<AdminAnalyticsTimeframe>(initialTimeframe);

  // If initialTimeframe changed externally (e.g. from URL searchParams), reset override
  if (initialTimeframe !== prevInitialTimeframe) {
    setPrevInitialTimeframe(initialTimeframe);
    setOverrideTimeframe(null);
  }

  const effectiveTimeframe = overrideTimeframe ?? initialTimeframe;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: queryRefetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin", "analytics", "overview", effectiveTimeframe],
    queryFn: () => getAdminAnalyticsOverview(effectiveTimeframe),
    staleTime: 5 * 60 * 1000, // 5 minutes cache freshness for instant back/forward navigation
  });

  const refetch = useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

  const errorMessage = error
    ? apiClient.getErrorMessage(error) ||
      error.message ||
      "Failed to load admin analytics overview."
    : null;

  return {
    data: data ?? null,
    isLoading,
    isError,
    error: errorMessage,
    timeframe: effectiveTimeframe,
    setTimeframe: setOverrideTimeframe,
    refetch,
    isFetching,
  };
}
