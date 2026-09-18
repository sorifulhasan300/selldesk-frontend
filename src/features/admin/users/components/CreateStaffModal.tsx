"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, UserPlus } from "lucide-react";
import {
  createStaffSchema,
  type CreateStaffFormData,
  defaultCreateStaffValues,
} from "../schemas/admin-users.schemas";
import type { CreateAdminStaffDTO } from "../types/admin-users.types";
import { CreateStaffFields } from "./CreateStaffFields";

export interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdminStaffDTO) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function CreateStaffModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateStaffModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: defaultCreateStaffValues,
  });

  useEffect(() => {
    if (isOpen) reset(defaultCreateStaffValues);
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CreateStaffFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch {
      // Handled by hook error notification
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-line">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-admin-brand" />
            <h2 className="text-base font-bold text-admin-text">
              Add Central Staff
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
          <CreateStaffFields register={register} errors={errors} />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-admin-line">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-[8px] bg-admin-bg text-admin-text hover:bg-admin-line/60 font-medium text-[13px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[8px] bg-admin-brand hover:bg-admin-brand-dark text-white font-semibold text-[13px] shadow-xs cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Create Staff</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
