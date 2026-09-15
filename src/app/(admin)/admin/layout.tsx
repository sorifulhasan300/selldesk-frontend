import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    template: "%s | SellDesk Admin",
    default: "SellDesk Admin — Dashboard (Light)",
  },
  description:
    "SellDesk centralized administrative dashboard and multi-tenant store management.",
};

export interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * SellDesk Super Admin Layout
 *
 * Implements a dual-layer guard architecture:
 * 1. Server-Side Guard: Verifies authentication cookies before layout streaming.
 * 2. Client-Side Guard (SuperAdminGuard in AdminShell): Enforces RBAC permissions,
 *    role filtering, and dynamic unauthorized redirection.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Server-side authentication token pre-check
  const cookieStore = await cookies();
  const token =
    cookieStore.get("auth_token")?.value ||
    cookieStore.get("selldesk_access_token")?.value ||
    cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login?from=/admin");
  }

  return <AdminShell>{children}</AdminShell>;
}
