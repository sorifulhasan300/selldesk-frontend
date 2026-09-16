"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink,
  RefreshCw,
  Clock,
  Ban,
  CheckCircle2,
} from "lucide-react";
import type { AdminStoreItem } from "../types/stores.types";

export interface StoreRowActionsProps {
  store: AdminStoreItem;
  onExtendTrial: (store: AdminStoreItem) => void;
  onToggleStatus: (store: AdminStoreItem) => void;
  onSwitchContext: (storeId: string) => void;
}

export function StoreRowActions({
  store,
  onExtendTrial,
  onToggleStatus,
  onSwitchContext,
}: StoreRowActionsProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isSuspended =
    store.status === "Suspended" || store.status === "Disabled";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-7 h-7 flex items-center justify-center rounded-[6px] text-admin-text-soft hover:text-admin-text hover:bg-admin-bg/60 transition-colors text-base font-bold select-none cursor-pointer"
        aria-label={`Actions for ${store.storeName}`}
      >
        ⋯
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-48 bg-admin-surface border border-admin-line rounded-[12px] shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95">
          <Link
            href={`/admin/stores/${store.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2 text-[13px] text-admin-text hover:bg-admin-bg/60 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-admin-text-soft" />
            <span>View Details</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSwitchContext(store.id);
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-[13px] text-admin-text hover:bg-admin-bg/60 transition-colors text-left cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-admin-text-soft" />
            <span>Switch Context</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onExtendTrial(store);
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-[13px] text-admin-text hover:bg-admin-bg/60 transition-colors text-left cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-admin-text-soft" />
            <span>Extend Trial</span>
          </button>

          <div className="border-t border-admin-line my-1" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onToggleStatus(store);
            }}
            className={`w-full flex items-center gap-2 px-3.5 py-2 text-[13px] text-left cursor-pointer hover:bg-admin-bg/60 transition-colors ${
              isSuspended ? "text-admin-green" : "text-admin-red"
            }`}
          >
            {isSuspended ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-admin-green" />
                <span>Activate Store</span>
              </>
            ) : (
              <>
                <Ban className="w-3.5 h-3.5 text-admin-red" />
                <span>Suspend Store</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
