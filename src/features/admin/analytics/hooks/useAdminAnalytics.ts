"use client";

import { useState, useEffect, useCallback } from "react";
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
}

/**
 * Custom React Hook for Super Admin Analytics Overview
 * Provides client-side data fetching, timeframe filtering, and zero-reload refetching.
 */
export function useAdminAnalytics(
  initialTimeframe: AdminAnalyticsTimeframe = "month",
): UseAdminAnalyticsReturn {
  const [data, setData] = useState<AdminAnalyticsOverviewResponse | null>(null);
  const [timeframe, setTimeframe] =
    useState<AdminAnalyticsTimeframe>(initialTimeframe);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(
    async (tf: AdminAnalyticsTimeframe = timeframe) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const response = await getAdminAnalyticsOverview(tf);
        setData(response);
      } catch (err) {
        setIsError(true);
        const errMsg = apiClient.getErrorMessage(err);
        setError(errMsg || "Failed to load admin analytics overview.");
      } finally {
        setIsLoading(false);
      }
    },
    [timeframe],
  );

  useEffect(() => {
    let isCancelled = false;

    const execute = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const response = await getAdminAnalyticsOverview(timeframe);
        if (!isCancelled) {
          setData(response);
        }
      } catch (err) {
        if (!isCancelled) {
          setIsError(true);
          const errMsg = apiClient.getErrorMessage(err);
          setError(errMsg || "Failed to load admin analytics overview.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    execute();

    return () => {
      isCancelled = true;
    };
  }, [timeframe]);

  const refetch = useCallback(async () => {
    await fetchOverview(timeframe);
  }, [fetchOverview, timeframe]);

  return {
    data,
    isLoading,
    isError,
    error,
    timeframe,
    setTimeframe,
    refetch,
  };
}
