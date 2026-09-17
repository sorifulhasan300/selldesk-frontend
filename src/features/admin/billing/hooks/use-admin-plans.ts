"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchAdminPlans } from "../api/billing.api";
import type { AdminPlanItem, PlanStatusFilter } from "../types/billing.types";

export function useAdminPlans() {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<PlanStatusFilter>("ALL");
  const [sortBy, setSortBy] = useState<string>("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [debouncedSearch, flushSearch, isDebouncing] = useDebounce(
    searchInput,
    400,
  );

  const {
    data: rawPlans = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<AdminPlanItem[]>({
    queryKey: ["admin", "subscriptions", "plans"],
    queryFn: () => fetchAdminPlans(true),
    staleTime: 60 * 1000,
  });

  const filteredPlans = useMemo(() => {
    let result = [...rawPlans];

    if (statusFilter === "ACTIVE") {
      result = result.filter((p) => p.isActive);
    } else if (statusFilter === "INACTIVE") {
      result = result.filter((p) => !p.isActive);
    }

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.features?.some((f) => f.toLowerCase().includes(q)),
      );
    }

    result.sort((a, b) => {
      const fieldA = a[sortBy as keyof AdminPlanItem];
      const fieldB = b[sortBy as keyof AdminPlanItem];
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      const strA = String(fieldA ?? "").toLowerCase();
      const strB = String(fieldB ?? "").toLowerCase();
      return sortOrder === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });

    return result;
  }, [rawPlans, statusFilter, debouncedSearch, sortBy, sortOrder]);

  const toggleSort = useCallback((columnId: string) => {
    setSortBy((prev) => {
      if (prev === columnId) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortOrder("asc");
      return columnId;
    });
  }, []);

  const handleImmediateSearch = useCallback(() => {
    flushSearch(searchInput);
  }, [flushSearch, searchInput]);

  return {
    plans: filteredPlans,
    allPlans: rawPlans,
    isLoading,
    isFetching,
    refetch,
    searchInput,
    setSearchInput,
    debouncedSearch,
    isDebouncing,
    handleImmediateSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    toggleSort,
  };
}
