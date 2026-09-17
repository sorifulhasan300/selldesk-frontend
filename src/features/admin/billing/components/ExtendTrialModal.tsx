"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Clock } from "lucide-react";
import {
  extendTrialSchema,
  type ExtendTrialFormData,
  defaultExtendTrialValues,
} from "../schemas/plan.schema";
import { useExtendTrial } from "../hooks/use-extend-trial";

export interface ExtendTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStoreId?: string;
}

export function ExtendTrialModal({
  isOpen,
  onClose,
  defaultStoreId = "",
}: ExtendTrialModalProps) {
  const [targetStoreId, setTargetStoreId] = useState(defaultStoreId);
  const [storeIdError, setStoreIdError] = useState("");
  const { extendTrial, isExtending } = useExtendTrial();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExtendTrialFormData>({
    resolver: zodResolver(extendTrialSchema) as never,
    defaultValues: defaultExtendTrialValues,
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (data: ExtendTrialFormData) => {
    if (!targetStoreId.trim()) {
      setStoreIdError("Store ID is required");
      return;
    }
    setStoreIdError("");
    try {
      await extendTrial({
        storeId: targetStoreId.trim(),
        payload: {
          days: Number(data.days),
          reason: data.reason?.trim() || undefined,
        },
      });
      reset();
      onClose();
    } catch {
      // Error handled by hook toast
    }
  };

  const inputCls =
    "w-full px-3 py-2 bg-admin-surface border border-admin-line rounded-[8px] text-[13px] focus:outline-hidden focus:border-admin-brand";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-line">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-admin-gold" />
            <h2 className="text-base font-bold text-admin-text">
              Extend Store Trial
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

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-[13px] font-semibold text-admin-text mb-1">
              Store ID (UUID) *
            </label>
            <input
              type="text"
              value={targetStoreId}
              onChange={(e) => {
                setTargetStoreId(e.target.value);
                if (storeIdError) setStoreIdError("");
              }}
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              className={inputCls}
            />
            {storeIdError && (
              <p className="text-admin-red text-[11px] mt-1">{storeIdError}</p>
            )}
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-admin-text mb-1">
              Days to Extend *
            </label>
            <input type="number" {...register("days")} className={inputCls} />
            {errors.days && (
              <p className="text-admin-red text-[11px] mt-1">
                {errors.days.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-admin-text mb-1">
              Reason / Memo (Optional)
            </label>
            <textarea
              {...register("reason")}
              rows={2}
              placeholder="e.g. Customer requested extension via sales contact"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-admin-line">
            <button
              type="button"
              onClick={onClose}
              disabled={isExtending}
              className="px-4 py-2 rounded-[8px] bg-admin-bg text-admin-text hover:bg-admin-line/60 font-medium text-[13px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isExtending}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[8px] bg-admin-brand hover:bg-admin-brand-dark text-white font-semibold text-[13px] shadow-xs cursor-pointer"
            >
              {isExtending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Extend Trial</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
