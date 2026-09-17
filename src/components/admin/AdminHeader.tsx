"use client";

import React from "react";
import { Search, Bell, Mail, Menu } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export interface AdminHeaderProps {
  onToggleMobileSidebar?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

/**
 * SellDesk Admin Header & Topbar (Light)
 * Top-level persistent navigation bar for platform search, notifications, and user avatar.
 */
export function AdminHeader({
  onToggleMobileSidebar,
  searchValue,
  onSearchChange,
}: AdminHeaderProps) {
  const { user } = useAuthStore();

  // Derive initial letters for user avatar fallback (defaults to RA per spec)
  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "RA";

  return (
    <header className="w-full">
      {/* ---------- TOPBAR ---------- */}
      <div className="flex items-center justify-between gap-5 mb-[26px]">
        {/* Search Bar */}
        <div className="flex-1 max-w-[360px] flex items-center gap-2.5 bg-white border border-[#E9E7F3] rounded-full px-4 py-2.5 text-sm text-[#77738C] shadow-2xs">
          <Search className="w-4 h-4 shrink-0 text-[#77738C]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search stores, owners, or invoices..."
            className="w-full bg-transparent border-none outline-none text-sm text-[#1C1A2E] placeholder:text-[#77738C]"
          />
        </div>

        {/* Topbar Right Icons & User Avatar */}
        <div className="flex items-center gap-3.5">
          {/* Mobile Sidebar Hamburger Button */}
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="md:hidden w-[38px] h-[38px] rounded-full bg-white border border-[#E9E7F3] flex items-center justify-center text-[#1C1A2E] hover:bg-[#F6F5FB] transition-colors cursor-pointer shadow-2xs"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {/* Notifications Button with Red Indicator Dot */}
          <button
            type="button"
            className="w-[38px] h-[38px] rounded-full bg-white border border-[#E9E7F3] flex items-center justify-center relative cursor-pointer hover:bg-[#F6F5FB] transition-colors shadow-2xs"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 text-[#1C1A2E]" />
            <span
              className="absolute top-2 right-[9px] w-[7px] h-[7px] rounded-full bg-[#D8484A]"
              aria-hidden="true"
            />
          </button>

          {/* Messages Button */}
          <button
            type="button"
            className="w-[38px] h-[38px] rounded-full bg-white border border-[#E9E7F3] flex items-center justify-center relative cursor-pointer hover:bg-[#F6F5FB] transition-colors shadow-2xs"
            aria-label="View messages"
          >
            <Mail className="w-4 h-4 text-[#1C1A2E]" />
          </button>

          {/* User Initials Avatar */}
          <div
            className="w-[38px] h-[38px] rounded-full bg-[#F0ECFF] text-[#5C3FE0] font-bold text-[13.5px] flex items-center justify-center shadow-2xs select-none"
            title={user?.name || "Admin"}
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
