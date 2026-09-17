"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import {
  planFormSchema,
  type PlanFormData,
  defaultPlanValues,
} from "../schemas/plan.schema";
import type {
  AdminPlanItem,
  CreatePlanDTO,
  UpdatePlanDTO,
} from "../types/billing.types";
import { PlanFormFields } from "./PlanFormFields";

export interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  planToEdit?: AdminPlanItem | null;
  onSubmit: (data: CreatePlanDTO | UpdatePlanDTO) => Promise<void>;
  isSubmitting?: boolean;
}

export function PlanFormModal({
  isOpen,
  onClose,
  planToEdit,
  onSubmit,
  isSubmitting = false,
}: PlanFormModalProps) {
  const isEditing = Boolean(planToEdit);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema) as never,
    defaultValues: defaultPlanValues,
  });

  const isUnlimitedProduct = useWatch({
    control,
    name: "isUnlimitedProduct",
    defaultValue: false,
  });

  useEffect(() => {
    if (planToEdit) {
      reset({
        name: planToEdit.name,
        price: planToEdit.price,
        durationDays: planToEdit.durationDays,
        productLimit: planToEdit.productLimit ?? 0,
        isUnlimitedProduct: planToEdit.isUnlimitedProduct,
        staffLimit: planToEdit.staffLimit ?? 2,
        freeOrders: planToEdit.freeOrders,
        extraOrderRate: planToEdit.extraOrderRate,
        maxLandingPages: planToEdit.maxLandingPages,
        featuresInput: (planToEdit.features || []).join(", "),
        isActive: planToEdit.isActive,
      });
    } else reset(defaultPlanValues);
  }, [planToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: PlanFormData) => {
    const features = (data.featuresInput || "")
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const basePayload = {
      name: data.name.trim(),
      price: Number(data.price),
      durationDays: Number(data.durationDays),
      isUnlimitedProduct: Boolean(data.isUnlimitedProduct),
      productLimit: data.isUnlimitedProduct
        ? undefined
        : Number(data.productLimit),
      staffLimit: Number(data.staffLimit),
      freeOrders: Number(data.freeOrders),
      extraOrderRate: Number(data.extraOrderRate),
      maxLandingPages: Number(data.maxLandingPages),
      features,
    };

    if (isEditing) {
      await onSubmit({ ...basePayload, isActive: data.isActive });
    } else {
      await onSubmit(basePayload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-line">
          <h2 className="text-lg font-bold text-admin-text">
            {isEditing ? "Edit SaaS Plan" : "Create New SaaS Plan"}
          </h2>
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
          className="flex-1 overflow-y-auto p-6 space-y-4 text-[13px]"
        >
          <PlanFormFields
            register={register}
            errors={errors}
            isUnlimitedProduct={isUnlimitedProduct}
          />
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-admin-line">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-[8px] bg-admin-bg text-admin-text hover:bg-admin-line/60 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[8px] bg-admin-brand hover:bg-admin-brand-dark text-white font-semibold shadow-xs cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? "Save Changes" : "Create Plan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
