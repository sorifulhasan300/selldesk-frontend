"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchSubscriptionPayments } from "../api/payments.api";
import type {
  PaymentStatusFilter,
  SubscriptionPaymentsQuery,
} from "../types/payment.types";

export function useAdminPayments() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, flushSearch, isDebouncing] = useDebounce(
    searchInput,
    400,
  );
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Track debounced search and status to automatically reset page to 1
  const prevSearchRef = useRef(debouncedSearch);
  const prevStatusRef = useRef(statusFilter);

  useEffect(() => {
    if (
      debouncedSearch !== prevSearchRef.current ||
      statusFilter !== prevStatusRef.current
    ) {
      prevSearchRef.current = debouncedSearch;
      prevStatusRef.current = statusFilter;
      setPage(1);
    }
  }, [debouncedSearch, statusFilter]);

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleSetStatusFilter = useCallback(
    (newStatus: PaymentStatusFilter) => {
      setStatusFilter(newStatus);
      setPage(1);
    },
    [],
  );

  const handleImmediateSearch = useCallback(() => {
    flushSearch(searchInput);
  }, [flushSearch, searchInput]);

  const toggleSort = useCallback((columnId: string) => {
    const sortField = columnId === "method" ? "paymentMethod" : columnId;
    setSortBy((prev) => {
      if (prev === sortField) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        return sortField;
      }
      setSortOrder("desc");
      return sortField;
    });
  }, []);

  const query: SubscriptionPaymentsQuery = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch.trim() || undefined,
      status: statusFilter,
      sortBy,
      sortOrder,
    }),
    [page, limit, debouncedSearch, statusFilter, sortBy, sortOrder],
  );

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["admin", "subscriptions", "payments", query],
    queryFn: () => fetchSubscriptionPayments(query),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  return {
    payments: data?.data ?? [],
    meta: data?.meta,
    stats: data?.stats,
    isLoading,
    isFetching,
    refetch,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    searchInput,
    setSearchInput,
    isDebouncing,
    handleImmediateSearch,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    sortBy,
    sortOrder,
    toggleSort,
  };
}
