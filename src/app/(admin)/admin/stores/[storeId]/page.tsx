import React from "react";
import type { Metadata } from "next";
import { StoreDetailsView } from "@/features/admin/stores";

export const metadata: Metadata = {
  title: "Store Details",
  description:
    "View and manage merchant store details, metrics, orders, and owner profile.",
};

interface StorePageProps {
  params: Promise<{
    storeId: string;
  }>;
}

export default async function StorePage({ params }: StorePageProps) {
  const { storeId } = await params;
  return <StoreDetailsView storeId={storeId} />;
}
