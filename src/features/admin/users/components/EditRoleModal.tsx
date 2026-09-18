"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import {
  updateRoleSchema,
  type UpdateRoleFormData,
} from "../schemas/admin-users.schemas";
import type { AdminUserItem, AdminUserRole } from "../types/admin-users.types";

export interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserItem | null;
  onSubmit: (role: AdminUserRole) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function EditRoleModal({
  isOpen,
  onClose,
  user,
  onSubmit,
  isSubmitting = false,
}: EditRoleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateRoleFormData>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: { role: user?.role || "STORE_STAFF" },
  });

  const selectedRole = useWatch({ control, name: "role" });

  useEffect(() => {
    if (user) {
      reset({ role: user.role });
    }
  }, [user, reset]);

  if (!isOpen || !user) return null;

  const handleFormSubmit = async (data: UpdateRoleFormData) => {
    try {
      await onSubmit(data.role as AdminUserRole);
      onClose();
    } catch {
      // Handled by hook notification
    }
  };

  const isDemotingSuperAdmin =
    user.role === "SUPER_ADMIN" && selectedRole !== "SUPER_ADMIN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-line">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-admin-brand" />
            <h2 className="text-base font-bold text-admin-text">Change Role</h2>
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
          <div className="p-3 rounded-[10px] bg-admin-bg/60 border border-admin-line text-[13px]">
            <p className="font-semibold text-admin-text">{user.name}</p>
            <p className="text-admin-text-soft text-[12px]">{user.email}</p>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-admin-text mb-1">
              Select New System Role
            </label>
            <select
              {...register("role")}
              className="w-full px-3 py-2 bg-admin-surface border border-admin-line rounded-[8px] text-[13px] text-admin-text focus:outline-hidden focus:border-admin-brand"
            >
              <option value="SUPER_ADMIN">
                Super Admin (Central Platform)
              </option>
              <option value="SUPER_STAFF">
                Super Staff (Central Operations)
              </option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="STORE_MANAGER">Store Manager</option>
              <option value="STORE_STAFF">Store Staff</option>
            </select>
            {errors.role && (
              <p className="text-admin-red text-[11px] mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {isDemotingSuperAdmin && (
            <div className="flex items-start gap-2 p-3 rounded-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[12px]">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Demoting a Super Admin requires at least one other active Super
                Admin to remain on the platform.
              </span>
            </div>
          )}

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
              <span>Update Role</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
