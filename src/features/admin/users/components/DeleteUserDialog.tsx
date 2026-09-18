"use client";

import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import type { AdminUserItem } from "../types/admin-users.types";

export interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserItem | null;
  onConfirm: () => Promise<unknown>;
  isDeleting?: boolean;
}

export function DeleteUserDialog({
  isOpen,
  onClose,
  user,
  onConfirm,
  isDeleting = false,
}: DeleteUserDialogProps) {
  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    try {
      await onConfirm();
      onClose();
    } catch {
      // Handled by hook notification
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-line">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-admin-red-soft/30 flex items-center justify-center text-admin-red">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-admin-text">
              Delete User Account
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
        <div className="p-6 space-y-4 text-[13px]">
          <p className="text-admin-text">
            Are you sure you want to permanently delete the user{" "}
            <span className="font-bold text-admin-text">{user.name}</span> (
            <span className="text-admin-text-soft">{user.email}</span>)?
          </p>

          <div className="p-3.5 rounded-[10px] bg-admin-red-soft/20 border border-admin-red-soft text-admin-red text-[12px] space-y-1">
            <p className="font-semibold">Important Safeguards:</p>
            <ul className="list-disc list-inside space-y-0.5 text-admin-red/90">
              <li>You cannot delete your own logged-in account.</li>
              <li>The last remaining Super Admin cannot be removed.</li>
              <li>
                Users with recorded expenses or financial records cannot be
                deleted.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-admin-line bg-admin-bg/30">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-[8px] bg-admin-surface border border-admin-line text-admin-text hover:bg-admin-bg font-medium text-[13px] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-admin-red hover:bg-admin-red/90 text-white font-semibold text-[13px] shadow-xs cursor-pointer"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Delete User</span>
          </button>
        </div>
      </div>
    </div>
  );
}
