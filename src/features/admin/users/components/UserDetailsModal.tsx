"use client";

import React from "react";
import {
  X,
  Store,
  CheckCircle2,
  XCircle,
  Calendar,
  Shield,
} from "lucide-react";
import { formatDisplayDate } from "@/features/admin/analytics/utils/formatters";
import type { AdminUserItem } from "../types/admin-users.types";
import { useAdminUserDetails } from "../hooks/use-admin-user-details";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserAvatar } from "./UserAvatar";
import { UserStoreList } from "./UserStoreList";

export interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserItem | null;
}

export function UserDetailsModal({
  isOpen,
  onClose,
  user,
}: UserDetailsModalProps) {
  const { data: details, isLoading } = useAdminUserDetails(
    isOpen ? user?.id : null,
  );

  if (!isOpen || !user) return null;

  const totalStores = details?.stores?.length ?? user._count?.stores ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-line shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-admin-brand" />
            <h2 className="text-base font-bold text-admin-text">
              User Details &amp; Store Memberships
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[13px]">
          {/* User profile card */}
          <div className="flex items-center gap-3.5 p-4 rounded-[12px] bg-admin-bg/50 border border-admin-line">
            <UserAvatar
              name={user.name}
              avatarUrl={user.avatarUrl}
              className="w-12 h-12 text-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-admin-text text-base truncate">
                  {user.name}
                </span>
                <UserRoleBadge role={user.role} />
              </div>
              <p className="text-admin-text-soft text-[12.5px] truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-4 mt-2 text-[12px] text-admin-text-soft">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDisplayDate(user.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  {user.isEmailVerified ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600">
                      <XCircle className="w-3.5 h-3.5" /> Unverified
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Associated Stores Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-admin-text flex items-center gap-1.5">
                <Store className="w-4 h-4 text-admin-brand" />
                <span>Associated Store Memberships</span>
              </h3>
              <span className="text-xs text-admin-text-soft font-medium">
                {totalStores} total
              </span>
            </div>

            <UserStoreList isLoading={isLoading} stores={details?.stores} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-admin-line bg-admin-bg/30 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] bg-admin-surface border border-admin-line text-admin-text hover:bg-admin-bg font-medium text-[13px] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
