import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminUsersTable } from "@/features/admin/users";

export const metadata: Metadata = {
  title: "Users & Staff Management | SellDesk Admin",
  description:
    "Manage platform staff, store owners, roles, account permissions, and safeguards.",
};

function UsersTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-48 bg-admin-line rounded-[10px]" />
      <div className="h-[400px] w-full bg-admin-surface border border-admin-line rounded-[18px]" />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <AdminUsersTable />
    </Suspense>
  );
}
