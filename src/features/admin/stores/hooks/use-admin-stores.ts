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
import { fetchAdminStores } from "../api/stores.api";
import type { AdminStoresQuery } from "../types/stores.types";

export function useAdminStores() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlSearch = searchParams.get("search") || "";
  const urlStatus = searchParams.get("status") || "all";
  const urlPlan = searchParams.get("plan") || "all";
  const urlPage = Number(searchParams.get("page")) || 1;
  const urlLimit = Number(searchParams.get("limit")) || 6;
  const urlSortBy = searchParams.get("sortBy") || "createdAt";
  const urlSortOrder =
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  // Raw search input directly controlled by the user's keystrokes
  const [searchInput, setSearchInput] = useState(urlSearch);

  // 400ms debounce hook with instant flush capability
  const [debouncedSearch, flushSearch, isDebouncing] = useDebounce(
    searchInput,
    400,
  );

  // Track the search string synced to URL so internal URL updates don't clobber active typing
  const lastSyncedSearchRef = useRef<string>(urlSearch);

  // Synchronize searchInput when external URL changes (e.g. browser back/forward buttons)
  useEffect(() => {
    if (urlSearch !== lastSyncedSearchRef.current) {
      lastSyncedSearchRef.current = urlSearch;
      setSearchInput(urlSearch);
      flushSearch(urlSearch);
    }
  }, [urlSearch, flushSearch]);

  const updateUrlParams = useCallback(
    (updates: Partial<AdminStoresQuery>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "" || val === "all") {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });

      const newQueryString = params.toString();
      const targetUrl = newQueryString
        ? `${pathname}?${newQueryString}`
        : pathname;

      startTransition(() => {
        router.replace(targetUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  // Sync debounced search to URL query parameter with router.replace (prevents history spam)
  useEffect(() => {
    const trimmedDebounced = debouncedSearch.trim();
    const currentUrlTrimmed = (searchParams.get("search") || "").trim();

    if (trimmedDebounced !== currentUrlTrimmed) {
      lastSyncedSearchRef.current = trimmedDebounced;
      updateUrlParams({ search: trimmedDebounced, page: 1 });
    }
  }, [debouncedSearch, searchParams, updateUrlParams]);

  // Submit search immediately (e.g. on Enter key press)
  const handleImmediateSearch = useCallback(() => {
    flushSearch(searchInput);
  }, [flushSearch, searchInput]);

  // Clear search immediately
  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    flushSearch("");
  }, [flushSearch]);

  const query: AdminStoresQuery = useMemo(() => {
    const trimmedSearch = debouncedSearch.trim();
    const currentUrlTrimmed = (searchParams.get("search") || "").trim();
    // If search term just changed, reset effective page to 1
    const effectivePage = trimmedSearch !== currentUrlTrimmed ? 1 : urlPage;

    return {
      page: effectivePage,
      limit: urlLimit,
      search: trimmedSearch,
      status: urlStatus,
      plan: urlPlan,
      sortBy: urlSortBy,
      sortOrder: urlSortOrder,
    };
  }, [
    urlPage,
    urlLimit,
    debouncedSearch,
    urlStatus,
    urlPlan,
    urlSortBy,
    urlSortOrder,
    searchParams,
  ]);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["admin", "stores", query],
    queryFn: () => fetchAdminStores(query),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });

  return {
    stores: data?.data || [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isSearching: isDebouncing || isFetching,
    error,
    refetch,
    query,
    searchInput,
    setSearchInput,
    handleImmediateSearch,
    handleClearSearch,
    setStatus: (status: string) => updateUrlParams({ status, page: 1 }),
    setPlan: (plan: string) => updateUrlParams({ plan, page: 1 }),
    setPage: (page: number) => updateUrlParams({ page }),
    setLimit: (limit: number) => updateUrlParams({ limit, page: 1 }),
    toggleSort: (columnId: string) => {
      const nextOrder =
        urlSortBy === columnId && urlSortOrder === "asc" ? "desc" : "asc";
      updateUrlParams({ sortBy: columnId, sortOrder: nextOrder });
    },
  };
}
