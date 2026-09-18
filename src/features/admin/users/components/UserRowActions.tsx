"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  ShieldCheck,
  UserX,
  UserCheck,
  Trash2,
} from "lucide-react";
import type { AdminUserItem } from "../types/admin-users.types";

export interface UserRowActionsProps {
  user: AdminUserItem;
  isCurrentUser: boolean;
  onViewDetails: (user: AdminUserItem) => void;
  onChangeRole: (user: AdminUserItem) => void;
  onToggleStatus: (user: AdminUserItem) => void;
  onDelete: (user: AdminUserItem) => void;
}

export function UserRowActions({
  user,
  isCurrentUser,
  onViewDetails,
  onChangeRole,
  onToggleStatus,
  onDelete,
}: UserRowActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1.5 rounded-[8px] text-admin-text-soft hover:text-admin-text hover:bg-admin-bg transition-colors cursor-pointer"
        aria-label="User actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-admin-surface border border-admin-line rounded-[12px] shadow-lg py-1.5 z-30 text-[13px] animate-in fade-in">
          {isCurrentUser && (
            <div className="px-3 py-1 text-[11px] font-semibold text-admin-brand uppercase tracking-wider border-b border-admin-line/50 mb-1">
              Current User (Self)
            </div>
          )}

          <button
            type="button"
            onClick={() => handleAction(() => onViewDetails(user))}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-admin-text hover:bg-admin-bg/70 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-admin-text-soft" />
            <span>View Details</span>
          </button>

          {!isCurrentUser ? (
            <>
              <button
                type="button"
                onClick={() => handleAction(() => onChangeRole(user))}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-admin-text hover:bg-admin-bg/70 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-admin-text-soft" />
                <span>Change Role</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(() => onToggleStatus(user))}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-admin-text hover:bg-admin-bg/70 transition-colors cursor-pointer"
              >
                {user.isActive ? (
                  <>
                    <UserX className="w-4 h-4 text-amber-500" />
                    <span>Suspend User</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>Activate User</span>
                  </>
                )}
              </button>

              <div className="my-1 border-t border-admin-line/50" />

              <button
                type="button"
                onClick={() => handleAction(() => onDelete(user))}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-admin-red hover:bg-admin-red-soft/30 transition-colors cursor-pointer font-medium"
              >
                <Trash2 className="w-4 h-4 text-admin-red" />
                <span>Delete Account</span>
              </button>
            </>
          ) : (
            <div className="px-3 py-1.5 text-[11px] text-admin-text-soft italic">
              Self-actions are disabled for security
            </div>
          )}
        </div>
      )}
    </div>
  );
}
