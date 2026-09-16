"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Bell, Mail, Menu, Plus } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export type TimeRange = "week" | "month" | "year";

export interface AdminHeaderProps {
  onToggleMobileSidebar?: () => void;
  title?: string;
  subtitle?: string;
  showActionArea?: boolean;
  activeRange?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
  onNewStore?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

/**
 * SellDesk Admin Header & Topbar (Light)
 * Pixel-perfect match with the SellDesk Admin Light HTML/CSS specification.
 */
export function AdminHeader({
  onToggleMobileSidebar,
  title = "Dashboard Overview",
  showActionArea = true,
  activeRange: controlledRange,
  onRangeChange,
  onNewStore,
  searchValue,
  onSearchChange,
}: AdminHeaderProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlTimeframe = searchParams.get("timeframe") as TimeRange | null;
  const validUrlRange: TimeRange | null =
    urlTimeframe === "week" ||
    urlTimeframe === "month" ||
    urlTimeframe === "year"
      ? urlTimeframe
      : null;

  const [internalRange, setInternalRange] = useState<TimeRange>("month");
  const selectedRange =
    controlledRange !== undefined
      ? controlledRange
      : (validUrlRange ?? internalRange);

  const handleRangeSelect = (range: TimeRange) => {
    if (onRangeChange) {
      onRangeChange(range);
    } else {
      setInternalRange(range);
      const params = new URLSearchParams(searchParams.toString());
      params.set("timeframe", range);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

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

      {/* ---------- ACTION AREA / PAGE HEAD ---------- */}
      {showActionArea && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[22px] font-bold text-[#1C1A2E] m-0 mb-1 tracking-tight leading-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3.5 flex-wrap">
            {/* Time Toggle Group */}
            <div className="flex bg-white border border-[#E9E7F3] rounded-full p-[3px] shadow-2xs">
              <button
                type="button"
                onClick={() => handleRangeSelect("week")}
                className={`px-4 py-[7px] text-[13px] rounded-full transition-all cursor-pointer ${
                  selectedRange === "week"
                    ? "bg-[#7C5CFC] text-white font-semibold shadow-xs"
                    : "text-[#77738C] hover:text-[#1C1A2E] font-medium"
                }`}
              >
                This week
              </button>
              <button
                type="button"
                onClick={() => handleRangeSelect("month")}
                className={`px-4 py-[7px] text-[13px] rounded-full transition-all cursor-pointer ${
                  selectedRange === "month"
                    ? "bg-[#7C5CFC] text-white font-semibold shadow-xs"
                    : "text-[#77738C] hover:text-[#1C1A2E] font-medium"
                }`}
              >
                This month
              </button>
              <button
                type="button"
                onClick={() => handleRangeSelect("year")}
                className={`px-4 py-[7px] text-[13px] rounded-full transition-all cursor-pointer ${
                  selectedRange === "year"
                    ? "bg-[#7C5CFC] text-white font-semibold shadow-xs"
                    : "text-[#77738C] hover:text-[#1C1A2E] font-medium"
                }`}
              >
                This year
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default AdminHeader;
