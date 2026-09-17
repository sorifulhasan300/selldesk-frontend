"use client";

import React from "react";
import Link from "next/link";

export interface StoreDetailsBreadcrumbProps {
  storeName: string;
}

export function StoreDetailsBreadcrumb({
  storeName,
}: StoreDetailsBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-[13px] text-admin-text-soft font-normal mb-5"
    >
      <Link
        href="/admin/stores"
        className="hover:text-admin-text transition-colors"
      >
        Stores
      </Link>
      <span className="text-admin-text-soft/60 select-none">/</span>
      <span className="font-semibold text-admin-text truncate max-w-[300px]">
        {storeName}
      </span>
    </nav>
  );
}
