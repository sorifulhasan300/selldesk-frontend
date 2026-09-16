import React, { Suspense } from "react";
import type { Metadata } from "next";
import { StoresManagementTable } from "@/features/admin/stores";

export const metadata: Metadata = {
  title: "Stores Management",
  description:
    "Monitor, filter, and manage all multi-tenant stores on the SellDesk platform.",
};

function StoresTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-48 bg-admin-line rounded-[10px]" />
      <div className="h-[400px] w-full bg-admin-surface border border-admin-line rounded-[18px]" />
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<StoresTableSkeleton />}>
      <StoresManagementTable />
    </Suspense>
  );
}
