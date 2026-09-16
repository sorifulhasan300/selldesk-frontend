"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { SuperAdminGuard } from "./SuperAdminGuard";
import { PLATFORM_ADMIN_ROLES } from "@/config/admin-routes";

export interface AdminShellProps {
  children: React.ReactNode;
}

/**
 * SellDesk Super Admin Unified Layout Shell (Light Theme)
 *
 * Implements the 250px sticky sidebar with #F6F5FB main background surface
 * conforming to the SellDesk Admin Dashboard specification.
 */
export function AdminShell({ children }: AdminShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <SuperAdminGuard allowedRoles={PLATFORM_ADMIN_ROLES}>
      <div className="min-h-screen bg-[#F6F5FB] text-[#1C1A2E] font-sans antialiased flex">
        {/* Navigation Sidebar */}
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Core Administrative Surface */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F6F5FB] overflow-y-auto">
          <main className="flex-1 px-4 py-6 md:px-8 md:pt-6 md:pb-15 w-full">
            <React.Suspense fallback={null}>
              <AdminHeader
                onToggleMobileSidebar={() =>
                  setMobileSidebarOpen((prev) => !prev)
                }
              />
            </React.Suspense>
            {children}
          </main>
        </div>
      </div>
    </SuperAdminGuard>
  );
}

export default AdminShell;
