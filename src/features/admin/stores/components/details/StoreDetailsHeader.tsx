"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, MoreHorizontal } from "lucide-react";
import type { AdminStoreDetails } from "../../types/stores.types";

export interface StoreDetailsHeaderProps {
  store: AdminStoreDetails;
  onSwitchContext: () => void;
  onToggleStatus: () => void;
  onMessageOwner: () => void;
}

export function StoreDetailsHeader({
  store,
  onSwitchContext,
  onToggleStatus,
  onMessageOwner,
}: StoreDetailsHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { header } = store;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const isActive =
    header.status?.toUpperCase() === "ACTIVE" ||
    store.status?.toUpperCase() === "ACTIVE";

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[20px] p-6 shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="flex items-center gap-4.5 min-w-0">
        <div className="w-14 h-14 min-w-14 rounded-[16px] bg-admin-brand-soft text-admin-brand flex items-center justify-center font-bold text-lg select-none overflow-hidden">
          {header.logoUrl ? (
            <Image
              src={header.logoUrl}
              alt={header.storeName}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : (
            header.initials || "NF"
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-[22px] font-bold text-admin-text tracking-tight truncate">
              {header.storeName}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold ${
                isActive
                  ? "bg-admin-green-soft text-admin-green border border-admin-green/20"
                  : "bg-admin-red-soft text-admin-red border border-admin-red/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-admin-green" : "bg-admin-red"}`}
              />
              {isActive ? "Active" : "Suspended"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[13px] text-admin-text-soft mt-1 flex-wrap">
            <a
              href={
                header.domainUrl || `https://${header.subDomain}.selldesk.com`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-admin-brand font-medium hover:underline inline-flex items-center gap-0.5"
            >
              {header.subDomain}.selldesk.com
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <span className="text-admin-text-soft/40 select-none">·</span>
            <span>{header.planSummary || "Pro · Monthly"}</span>
            <span className="text-admin-text-soft/40 select-none">·</span>
            <span>{header.joinedDate}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap self-start md:self-center">
        <button
          type="button"
          onClick={onSwitchContext}
          className="px-4 py-2 rounded-full border border-admin-line bg-admin-surface text-admin-text hover:bg-admin-bg/60 text-[13px] font-medium transition-colors shadow-2xs cursor-pointer"
        >
          Login as store
        </button>

        <button
          type="button"
          className="px-4 py-2 rounded-full border border-admin-line bg-admin-surface text-admin-text hover:bg-admin-bg/60 text-[13px] font-medium transition-colors shadow-2xs cursor-pointer"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onMessageOwner}
          className="px-4 py-2 rounded-full bg-admin-brand hover:bg-admin-brand-dark text-white text-[13px] font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>Message owner</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-80" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full border border-admin-line bg-admin-surface text-admin-text-soft hover:text-admin-text hover:bg-admin-bg/60 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
            aria-label="More actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-admin-surface border border-admin-line rounded-[14px] shadow-lg py-1.5 z-30">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onToggleStatus();
                }}
                className={`w-full px-3.5 py-2 text-left text-[13px] font-medium transition-colors hover:bg-admin-bg/60 ${
                  isActive ? "text-admin-red" : "text-admin-green"
                }`}
              >
                {isActive ? "Suspend Store" : "Activate Store"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
