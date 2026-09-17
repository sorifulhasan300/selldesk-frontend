"use client";

import React, { useState } from "react";
import { X, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { SubscriptionPaymentItem } from "../types/payment.types";
import { PaymentSummaryInfo } from "./PaymentSummaryInfo";

export interface ApprovePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: SubscriptionPaymentItem | null;
  onApproveOrReject: (
    id: string,
    status: "APPROVED" | "REJECTED",
    note?: string,
  ) => Promise<void>;
  isProcessing: boolean;
}

export function ApprovePaymentModal({
  isOpen,
  onClose,
  payment,
  onApproveOrReject,
  isProcessing,
}: ApprovePaymentModalProps) {
  const [note, setNote] = useState("");

  if (!isOpen || !payment) return null;

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    await onApproveOrReject(payment.id, status, note);
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-line">
          <div>
            <h2 className="text-base font-bold text-admin-text">
              Review Subscription Payment
            </h2>
            <p className="text-[12px] text-admin-text-soft">
              Verify manual transaction details before approving or rejecting
            </p>
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
          <PaymentSummaryInfo payment={payment} />

          {/* Admin Note */}
          <div>
            <label className="block text-[13px] font-semibold text-admin-text mb-1">
              Admin Verification Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="e.g. Verified transaction via bKash statement"
              className="w-full px-3 py-2 bg-admin-surface border border-admin-line rounded-[8px] text-[13px] focus:outline-hidden focus:border-admin-brand resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2.5 px-6 py-4 border-t border-admin-line bg-admin-bg/30">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-[8px] bg-admin-surface border border-admin-line text-admin-text hover:bg-admin-bg font-medium text-[13px] cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAction("REJECTED")}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-admin-red-soft text-admin-red hover:bg-admin-red/20 font-semibold text-[13px] cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("APPROVED")}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-admin-green hover:bg-admin-green/90 text-white font-semibold text-[13px] shadow-xs cursor-pointer"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Approve Payment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
