"use client";

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import React, { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 5 minutes data freshness (enables instant navigation between dashboard pages)
        staleTime: 5 * 60 * 1000,
        // Keep unused data in memory cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Prevent jarring refetches on window/tab focus
        refetchOnWindowFocus: false,
        // Retry failed queries once before throwing error state
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client to prevent cross-request state leakage
    return makeQueryClient();
  } else {
    // Browser: create a single shared query client instance if one doesn't exist
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Global TanStack Query Provider for SellDesk
 * Configures application-wide caching, stale times, and garbage collection.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // NOTE: Avoid useState when initializing queryClient if suspense is used during SSR,
  // getQueryClient() ensures the singleton pattern works consistently.
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryProvider;
