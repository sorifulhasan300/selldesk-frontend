"use client";

import React, { useState, useCallback } from "react";
import { useAdminPayments } from "../hooks/use-admin-payments";
import { useApprovePayment } from "../hooks/use-approve-payment";
import { PaymentsKpiCards } from "./PaymentsKpiCards";
import { PaymentsToolbar } from "./PaymentsToolbar";
import { PaymentsTable } from "./PaymentsTable";
import { ApprovePaymentModal } from "./ApprovePaymentModal";
import { PaymentDetailsModal } from "./PaymentDetailsModal";
import type { SubscriptionPaymentItem } from "../types/payment.types";

export function PaymentsManagementView() {
  const {
    payments,
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
  } = useAdminPayments();

  const { approveOrReject, isProcessing } = useApprovePayment();

  const [reviewPayment, setReviewPayment] =
    useState<SubscriptionPaymentItem | null>(null);
  const [detailsPayment, setDetailsPayment] =
    useState<SubscriptionPaymentItem | null>(null);

  const pendingCount = allPayments.filter((p) => p.status === "PENDING").length;

  const handleOpenReview = useCallback((payment: SubscriptionPaymentItem) => {
    setReviewPayment(payment);
  }, []);

  const handleOpenDetails = useCallback((payment: SubscriptionPaymentItem) => {
    setDetailsPayment(payment);
  }, []);

  const handleApproveOrRejectAction = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    note?: string,
  ) => {
    await approveOrReject({ id, payload: { status, note } });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <div>
          <h1 className="text-2xl font-bold text-admin-text tracking-tight">
            Subscription Payments
          </h1>
          <p className="text-[13px] text-admin-text-soft mt-0.5">
            Monitor merchant subscription transactions, payment history, and
            verify manual payments
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <PaymentsKpiCards payments={allPayments} isLoading={isLoading} />

      {/* Toolbar */}
      <PaymentsToolbar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onImmediateSearch={handleImmediateSearch}
        onClearSearch={() => setSearchInput("")}
        isDebouncing={isDebouncing}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        pendingCount={pendingCount}
      />

      {/* Table */}
      <PaymentsTable
        payments={payments}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={toggleSort}
        onReviewPayment={handleOpenReview}
        onViewDetails={handleOpenDetails}
      />

      {/* Approve / Reject Modal */}
      <ApprovePaymentModal
        isOpen={Boolean(reviewPayment)}
        onClose={() => setReviewPayment(null)}
        payment={reviewPayment}
        onApproveOrReject={handleApproveOrRejectAction}
        isProcessing={isProcessing}
      />

      {/* Details Modal */}
      <PaymentDetailsModal
        isOpen={Boolean(detailsPayment)}
        onClose={() => setDetailsPayment(null)}
        payment={detailsPayment}
        onOpenApprove={handleOpenReview}
      />
    </div>
  );
}
