"use client";

import React from "react";
import { X, Receipt, CheckCircle } from "lucide-react";
import type { SubscriptionPaymentItem } from "../types/payment.types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { PaymentSummaryInfo } from "./PaymentSummaryInfo";
import { formatDisplayDate } from "@/features/admin/analytics/utils/formatters";

export interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: SubscriptionPaymentItem | null;
  onOpenApprove?: (payment: SubscriptionPaymentItem) => void;
}

export function PaymentDetailsModal({
  isOpen,
  onClose,
  payment,
  onOpenApprove,
}: PaymentDetailsModalProps) {
  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-line">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-admin-brand" />
            <h2 className="text-base font-bold text-admin-text">
              Payment Transaction Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[8px] text-admin-text-soft hover:text-admin-text hover:bg-admin-bg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-admin-text-soft block">
              Payment Status
            </span>
            <PaymentStatusBadge status={payment.status} />
          </div>

          <PaymentSummaryInfo payment={payment} />

          <div className="bg-admin-bg p-3 rounded-[10px] border border-admin-line space-y-1.5 text-[12.5px]">
            <div className="flex justify-between">
              <span className="text-admin-text-soft">Created At</span>
              <span className="text-admin-text">
                {formatDisplayDate(payment.createdAt)}
              </span>
            </div>
            {payment.approver && (
              <div className="flex justify-between">
                <span className="text-admin-text-soft">Processed By</span>
                <span className="text-admin-text font-medium">
                  {payment.approver.name} ({payment.approver.email})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-admin-line bg-admin-bg/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] bg-admin-surface border border-admin-line text-admin-text hover:bg-admin-bg font-medium text-[13px] cursor-pointer"
          >
            Close
          </button>
          {payment.status === "PENDING" && onOpenApprove && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenApprove(payment);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-admin-green text-white font-semibold text-[13px] shadow-xs cursor-pointer hover:bg-admin-green/90"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Review & Approve</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
