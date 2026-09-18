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
import { fetchAdminUsers } from "../api/admin-users.api";
import type { AdminUsersQuery } from "../types/admin-users.types";

export function useAdminUsers() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlSearch = searchParams.get("search") || "";
  const urlRole = searchParams.get("role") || "all";
  const urlPage = Number(searchParams.get("page")) || 1;
  const urlLimit = Number(searchParams.get("limit")) || 10;
  const urlSortBy =
    (searchParams.get("sortBy") as "name" | "email" | "createdAt") ||
    "createdAt";
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
        if (val === undefined || val === null || val === "" || val === "all") {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });
      const qs = params.toString();
      const targetUrl = qs ? `${pathname}?${qs}` : pathname;
      startTransition(() => {
        router.replace(targetUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    const currentUrlTrimmed = (searchParams.get("search") || "").trim();
    if (trimmed !== currentUrlTrimmed) {
      lastSyncedSearchRef.current = trimmed;
      updateUrlParams({ search: trimmed, page: 1 });
    }
  }, [debouncedSearch, searchParams, updateUrlParams]);

  const handleImmediateSearch = useCallback(() => {
    flushSearch(searchInput);
  }, [flushSearch, searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    flushSearch("");
  }, [flushSearch]);

  const query: AdminUsersQuery = useMemo(() => {
    const trimmedSearch = debouncedSearch.trim();
    const currentUrlTrimmed = (searchParams.get("search") || "").trim();
    const effectivePage = trimmedSearch !== currentUrlTrimmed ? 1 : urlPage;
    return {
      page: effectivePage,
      limit: urlLimit,
      search: trimmedSearch,
      role: urlRole,
      sortBy: urlSortBy,
      sortOrder: urlSortOrder,
    };
  }, [
    urlPage,
    urlLimit,
    debouncedSearch,
    urlRole,
    urlSortBy,
    urlSortOrder,
    searchParams,
  ]);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => fetchAdminUsers(query),
    placeholderData: keepPreviousData,
    staleTime: 30000,
  });

  return {
    users: data?.items || [],
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
    setRole: (role: string) => updateUrlParams({ role, page: 1 }),
    setPage: (page: number) => updateUrlParams({ page }),
    setLimit: (limit: number) => updateUrlParams({ limit, page: 1 }),
    toggleSort: (columnId: "name" | "email" | "createdAt") => {
      const nextOrder =
        urlSortBy === columnId && urlSortOrder === "asc" ? "desc" : "asc";
      updateUrlParams({ sortBy: columnId, sortOrder: nextOrder });
    },
  };
}
