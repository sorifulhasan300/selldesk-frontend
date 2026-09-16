import type { AdminStoreItem } from "../types/stores.types";

export function exportStoresToCsv(
  stores: AdminStoreItem[],
  filename = "selldesk-stores.csv",
): void {
  if (!stores || stores.length === 0) return;

  const headers = [
    "Store Name",
    "Subdomain",
    "Owner Name",
    "Owner Email",
    "Plan",
    "Status",
    "Orders",
    "Monthly Revenue (BDT)",
    "Created Date",
  ];

  const rows = stores.map((s) => [
    `"${(s.storeName || "").replace(/"/g, '""')}"`,
    `"${(s.subDomain || "").replace(/"/g, '""')}"`,
    `"${(s.owner?.name || "").replace(/"/g, '""')}"`,
    `"${(s.owner?.email || "").replace(/"/g, '""')}"`,
    `"${(s.currentPlan || "").replace(/"/g, '""')}"`,
    `"${s.status}"`,
    s.ordersCount ?? 0,
    s.monthlyRevenue ?? 0,
    `"${s.createdAt || ""}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n",
  );
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
