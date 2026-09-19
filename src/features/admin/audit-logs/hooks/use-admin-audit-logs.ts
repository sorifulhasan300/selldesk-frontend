"use client";

import {
  useState,
  useEffect,
  useTransition,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchAdminAuditLogs } from "../api/audit-logs.api";
import type {
  AuditLogsQueryParams,
  AuditLogStatus,
  AuditLogSortBy,
} from "../types/audit-log.types";

export function useAdminAuditLogs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlSearch = searchParams.get("search") || "";
  const urlAction = searchParams.get("action") || "ALL";
  const urlTargetType = searchParams.get("targetType") || "ALL";
  const urlStatus = (searchParams.get("status") as AuditLogStatus) || "ALL";
  const urlPage = Number(searchParams.get("page")) || 1;
  const urlLimit = Number(searchParams.get("limit")) || 10;
  const urlSortBy =
    (searchParams.get("sortBy") as AuditLogSortBy) || "createdAt";
  const urlSortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [debouncedSearch, flushSearch, isDebouncing] = useDebounce(
    searchInput,
    400,
  );
  const lastSyncedSearchRef = useRef<string>(urlSearch);

  useEffect(() => {
    if (urlSearch !== lastSyncedSearchRef.current) {
      lastSyncedSearchRef.current = urlSearch;
      setSearchInput(urlSearch);
      flushSearch(urlSearch);
    }
  }, [urlSearch, flushSearch]);

  const updateUrlParams = useCallback(
    (updates: Record<string, string | number | undefined | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "" || val === "ALL") {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed !== (searchParams.get("search") || "").trim()) {
      lastSyncedSearchRef.current = trimmed;
      updateUrlParams({ search: trimmed, page: 1 });
    }
  }, [debouncedSearch, searchParams, updateUrlParams]);

  const query: AuditLogsQueryParams = useMemo(() => {
    const trimmedSearch = debouncedSearch.trim();
    const currentUrlTrimmed = (searchParams.get("search") || "").trim();
    return {
      page: trimmedSearch !== currentUrlTrimmed ? 1 : urlPage,
      limit: urlLimit,
      search: trimmedSearch,
      action: urlAction,
      targetType: urlTargetType,
      status: urlStatus,
      sortBy: urlSortBy,
      sortOrder: urlSortOrder,
    };
  }, [
    debouncedSearch,
    searchParams,
    urlPage,
    urlLimit,
    urlAction,
    urlTargetType,
    urlStatus,
    urlSortBy,
    urlSortOrder,
  ]);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["admin", "audit-logs", query],
    queryFn: () => fetchAdminAuditLogs(query),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });

  return {
    logs: data?.data || [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isSearching: isDebouncing || isFetching,
    error,
    refetch,
    query,
    searchInput,
    setSearchInput,
    handleImmediateSearch: useCallback(
      () => flushSearch(searchInput),
      [flushSearch, searchInput],
    ),
    handleClearSearch: useCallback(() => {
      setSearchInput("");
      flushSearch("");
    }, [flushSearch]),
    setAction: (action: string) => updateUrlParams({ action, page: 1 }),
    setTargetType: (targetType: string) =>
      updateUrlParams({ targetType, page: 1 }),
    setStatus: (status: string) => updateUrlParams({ status, page: 1 }),
    setPage: (page: number) => updateUrlParams({ page }),
    setLimit: (limit: number) => updateUrlParams({ limit, page: 1 }),
    toggleSort: (columnId: AuditLogSortBy) => {
      const nextOrder =
        urlSortBy === columnId && urlSortOrder === "asc" ? "desc" : "asc";
      updateUrlParams({ sortBy: columnId, sortOrder: nextOrder });
    },
    resetFilters: () => {
      setSearchInput("");
      flushSearch("");
      startTransition(() => router.replace(pathname, { scroll: false }));
    },
  };
}
