"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { fetchSubscriptionPayments } from "../api/payments.api";
import type {
  PaymentStatusFilter,
  SubscriptionPaymentItem,
} from "../types/payment.types";

export function useAdminPayments() {
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, flushSearch, isDebouncing] = useDebounce(
    searchInput,
    400,
  );
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    data: allPayments = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["admin", "subscriptions", "payments", statusFilter],
    queryFn: () => fetchSubscriptionPayments(statusFilter),
    staleTime: 30 * 1000,
  });

  const handleImmediateSearch = useCallback(() => {
    flushSearch(searchInput);
  }, [flushSearch, searchInput]);

  const toggleSort = useCallback((columnId: string) => {
    setSortBy((prev) => {
      if (prev === columnId) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        return columnId;
      }
      setSortOrder("desc");
      return columnId;
    });
  }, []);

  const filteredPayments = useMemo(() => {
    let result = [...allPayments];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter((p) => {
        const storeName = p.store?.storeName?.toLowerCase() ?? "";
        const subDomain = p.store?.subDomain?.toLowerCase() ?? "";
        const trxId = p.transactionId?.toLowerCase() ?? "";
        const planName = p.plan?.name?.toLowerCase() ?? "";
        const method = p.paymentMethod?.toLowerCase() ?? "";
        const note = p.note?.toLowerCase() ?? "";
        return (
          storeName.includes(q) ||
          subDomain.includes(q) ||
          trxId.includes(q) ||
          planName.includes(q) ||
          method.includes(q) ||
          note.includes(q)
        );
      });
    }

    result.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      if (sortBy === "amount") {
        valA = a.amount;
        valB = b.amount;
      } else if (sortBy === "store") {
        valA = a.store?.storeName || "";
        valB = b.store?.storeName || "";
      } else if (sortBy === "plan") {
        valA = a.plan?.name || "";
        valB = b.plan?.name || "";
      } else if (sortBy === "status") {
        valA = a.status;
        valB = b.status;
      } else {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [allPayments, debouncedSearch, sortBy, sortOrder]);

  return {
    payments: filteredPayments,
    allPayments,
    isLoading,
    isFetching,
    refetch,
    searchInput,
    setSearchInput,
    isDebouncing,
    handleImmediateSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    toggleSort,
  };
}
