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
  const [overrideTimeframe, setOverrideTimeframe] =
    useState<AdminAnalyticsTimeframe | null>(null);
  const [prevInitialTimeframe, setPrevInitialTimeframe] =
    useState<AdminAnalyticsTimeframe>(initialTimeframe);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // If initialTimeframe changed externally (e.g. from URL searchParams), reset override
  if (initialTimeframe !== prevInitialTimeframe) {
    setPrevInitialTimeframe(initialTimeframe);
    setOverrideTimeframe(null);
  }

  const effectiveTimeframe = overrideTimeframe ?? initialTimeframe;

  const fetchOverview = useCallback(
    async (tf: AdminAnalyticsTimeframe = effectiveTimeframe) => {
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
    [effectiveTimeframe],
  );

  useEffect(() => {
    let isCancelled = false;

    const execute = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const response = await getAdminAnalyticsOverview(effectiveTimeframe);
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
  }, [effectiveTimeframe]);

  const refetch = useCallback(async () => {
    await fetchOverview(effectiveTimeframe);
  }, [fetchOverview, effectiveTimeframe]);

  return {
    data,
    isLoading,
    isError,
    error,
    timeframe: effectiveTimeframe,
    setTimeframe: setOverrideTimeframe,
    refetch,
  };
}
