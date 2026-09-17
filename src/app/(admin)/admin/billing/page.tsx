import React, { Suspense } from "react";
import type { Metadata } from "next";
import { BillingManagementView } from "@/features/admin/billing";

export const metadata: Metadata = {
  title: "Subscriptions & Plans",
  description:
    "Manage platform SaaS pricing packages, tier limits, and merchant store trials.",
};

function BillingPageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-9 w-64 bg-admin-line rounded-[10px]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-admin-surface border border-admin-line rounded-[14px]"
          />
        ))}
      </div>
      <div className="h-[420px] w-full bg-admin-surface border border-admin-line rounded-[18px]" />
    </div>
  );
}

export default function AdminBillingPage() {
  return (
    <Suspense fallback={<BillingPageSkeleton />}>
      <BillingManagementView />
    </Suspense>
  );
}
