"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/common";
import {
  LayoutDashboard,
  Store,
  CreditCard,
  Receipt,
  Headphones,
  BarChart3,
  Users,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";

export interface NavItemConfig {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const MAIN_MENU_ITEMS: NavItemConfig[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Stores", href: "/admin/stores", icon: Store },
  {
    label: "Subscriptions & Billing",
    href: "/admin/billing",
    icon: CreditCard,
  },
  { label: "Payments", href: "/admin/payments", icon: Receipt },
  { label: "Support Tickets", href: "/admin/support", icon: Headphones },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

export const SYSTEM_MENU_ITEMS: NavItemConfig[] = [
  { label: "Team & Permissions", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

/**
 * SellDesk Admin Sidebar (Light)
 * Pixel-perfect match with the SellDesk Admin Light HTML/CSS specification.
 */
export function AdminSidebar({
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isItemActive = (item: NavItemConfig) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const renderNavGroup = (items: NavItemConfig[]) => (
    <nav className="flex flex-col gap-[2px] mb-[22px]">
      {items.map((item) => {
        const active = isItemActive(item);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onCloseMobile && onCloseMobile()}
            className={`flex items-center gap-[11px] px-3 py-2.5 rounded-[10px] text-[14px] transition-all no-underline ${
              active
                ? "bg-[#7C5CFC] text-white font-semibold shadow-xs"
                : "text-[#77738C] hover:bg-[#F6F5FB] hover:text-[#1C1A2E]"
            }`}
          >
            <Icon
              className={`w-[18px] h-[18px] shrink-0 transition-opacity ${
                active ? "text-white opacity-100" : "opacity-35"
              }`}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const sidebarContent = (
    <aside
      className="bg-[#FFFFFF] border-r border-[#E9E7F3] px-4 pt-[22px] pb-4 flex flex-col h-screen sticky top-0 w-[250px] shrink-0 select-none overflow-y-auto"
      style={{ minHeight: "100vh" }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-[26px] px-2">
        <Logo href="/admin" size="md" priority onClick={onCloseMobile} />

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full text-[#77738C] hover:bg-[#F6F5FB] transition-colors cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category: Main Menu */}
      <div className="text-[11.5px] uppercase tracking-[0.03em] text-[#77738C] px-3 pt-1.5 pb-2 font-normal">
        Main Menu
      </div>
      {renderNavGroup(MAIN_MENU_ITEMS)}

      {/* Category: System */}
      <div className="text-[11.5px] uppercase tracking-[0.03em] text-[#77738C] px-3 pt-1.5 pb-2 font-normal">
        System
      </div>
      {renderNavGroup(SYSTEM_MENU_ITEMS)}

      {/* Spacer pushes bottom card to footer */}
      <div className="flex-1" />

      {/* Bottom Side Card: Platform update */}
      <div className="bg-[#F0ECFF] rounded-[14px] p-4 mt-auto">
        <div className="text-[13.5px] font-semibold text-[#1C1A2E] mb-1">
          Platform update
        </div>
        <div className="text-[12px] text-[#77738C] leading-[1.6] mb-3">
          A new payment gateway has been added — let store owners know.
        </div>
        <button
          type="button"
          className="w-full bg-[#7C5CFC] hover:bg-[#5C3FE0] text-white border-none rounded-full py-[9px] text-[13px] font-semibold transition-colors cursor-pointer shadow-xs"
        >
          View details
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block w-[250px] shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </div>

      {/* Mobile Modal Drawer with Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-50 h-full w-[250px] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
