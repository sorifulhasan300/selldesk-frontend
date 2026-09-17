import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentsManagementView } from "@/features/admin/payments";

export const metadata: Metadata = {
  title: "Subscription Payments",
  description:
    "View transaction history and manage manual subscription payment approvals.",
};

function PaymentsPageSkeleton() {
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

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<PaymentsPageSkeleton />}>
      <PaymentsManagementView />
    </Suspense>
  );
}
