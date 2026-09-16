"use client";

import {
  useState,
  useEffect,
  useTransition,
  useMemo,
  useCallback,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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

  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  const [searchInput, setSearchInput] = useState(urlSearch);

  if (prevUrlSearch !== urlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

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

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router],
  );

  // 300ms debounce on search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== urlSearch) {
        updateUrlParams({ search: searchInput, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, updateUrlParams]);

  const query: AdminStoresQuery = useMemo(
    () => ({
      page: urlPage,
      limit: urlLimit,
      search: urlSearch,
      status: urlStatus,
      plan: urlPlan,
      sortBy: urlSortBy,
      sortOrder: urlSortOrder,
    }),
    [urlPage, urlLimit, urlSearch, urlStatus, urlPlan, urlSortBy, urlSortOrder],
  );

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["admin", "stores", query],
    queryFn: () => fetchAdminStores(query),
    staleTime: 30000,
  });

  return {
    stores: data?.data || [],
    meta: data?.meta,
    isLoading: isLoading || isFetching,
    error,
    refetch,
    query,
    searchInput,
    setSearchInput,
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
