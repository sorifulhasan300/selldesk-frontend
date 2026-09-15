import React from "react";
import Link from "next/link";

interface KpiMetric {
  label: string;
  value: string;
  delta: string;
  deltaType: "up" | "warn";
}

const KPI_METRICS: KpiMetric[] = [
  {
    label: "Total stores",
    value: "3,218",
    delta: "+6.2% this month",
    deltaType: "up",
  },
  {
    label: "Active stores",
    value: "2,944",
    delta: "+4.1%",
    deltaType: "up",
  },
  {
    label: "Monthly recurring revenue",
    value: "৳18,42,000",
    delta: "+9.7%",
    deltaType: "up",
  },
  {
    label: "New signups",
    value: "186",
    delta: "32 on trial",
    deltaType: "warn",
  },
];

interface BarData {
  month: string;
  trackHeight: number;
  fillPercent: number;
}

const REVENUE_BARS: BarData[] = [
  { month: "Apr", trackHeight: 70, fillPercent: 58 },
  { month: "May", trackHeight: 90, fillPercent: 64 },
  { month: "Jun", trackHeight: 80, fillPercent: 70 },
  { month: "Jul", trackHeight: 100, fillPercent: 74 },
  { month: "Aug", trackHeight: 95, fillPercent: 82 },
  { month: "Sep", trackHeight: 120, fillPercent: 92 },
];

interface StoreRecord {
  id: string;
  initials: string;
  name: string;
  subdomain: string;
  plan: string;
  status: "Active" | "Trial" | "Suspended";
  created: string;
  monthlyRevenue: string;
}

const RECENT_STORES: StoreRecord[] = [
  {
    id: "store-1",
    initials: "NF",
    name: "Nabin Fashion",
    subdomain: "nabinfashion.selldesk.com",
    plan: "Pro — Monthly",
    status: "Active",
    created: "Jul 12, 2026",
    monthlyRevenue: "৳4,900",
  },
  {
    id: "store-2",
    initials: "RC",
    name: "Rangmohol Craft",
    subdomain: "rangmohol.selldesk.com",
    plan: "Business — Yearly",
    status: "Active",
    created: "Aug 03, 2026",
    monthlyRevenue: "৳12,400",
  },
  {
    id: "store-3",
    initials: "TB",
    name: "Taza Bazar",
    subdomain: "tazabazar.selldesk.com",
    plan: "Free plan",
    status: "Trial",
    created: "Aug 29, 2026",
    monthlyRevenue: "৳0",
  },
  {
    id: "store-4",
    initials: "GH",
    name: "Gadget Hub",
    subdomain: "gadgethub.selldesk.com",
    plan: "Pro — Monthly",
    status: "Suspended",
    created: "Jun 15, 2026",
    monthlyRevenue: "৳2,100",
  },
  {
    id: "store-5",
    initials: "HD",
    name: "Home Decor BD",
    subdomain: "homedecorbd.selldesk.com",
    plan: "Business — Monthly",
    status: "Active",
    created: "Sep 09, 2026",
    monthlyRevenue: "৳8,750",
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-[18px]">
      {/* ---------- 4. OVERVIEW KPI GRID ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-[18px]">
        {KPI_METRICS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border border-[#E9E7F3] rounded-[16px] p-[18px] shadow-2xs"
          >
            <div className="text-[13px] text-[#77738C] mb-2.5 font-normal">
              {kpi.label}
            </div>
            <div className="text-[24px] font-bold text-[#1C1A2E] leading-tight">
              {kpi.value}
            </div>
            <span
              className={`text-[12px] mt-2 inline-block px-2.5 py-0.5 rounded-full font-semibold ${
                kpi.deltaType === "up"
                  ? "bg-[#E6F7EF] text-[#1E9A6C]"
                  : "bg-[#FBF1DF] text-[#C98A2C]"
              }`}
            >
              {kpi.delta}
            </span>
          </div>
        ))}
      </div>

      {/* ---------- 5. CHARTS & ANALYTICS ROW ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mb-[18px]">
        {/* Revenue Bar Chart Panel (1.6fr) */}
        <div className="bg-white border border-[#E9E7F3] rounded-[16px] p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[18px]">
            <div className="text-[14.5px] font-semibold text-[#1C1A2E]">
              Revenue growth — last 6 months
            </div>
            <div className="text-[12px] text-[#77738C]">Amounts in BDT</div>
          </div>

          <div className="flex items-end gap-3.5 h-[120px] pt-2">
            {REVENUE_BARS.map((bar) => (
              <div
                key={bar.month}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
              >
                <div
                  className="w-full rounded-t-[6px] rounded-b-[3px] bg-[#F0ECFF] relative overflow-hidden transition-all group"
                  style={{ height: `${bar.trackHeight}px` }}
                >
                  <i
                    className="absolute bottom-0 left-0 right-0 bg-[#7C5CFC] rounded-t-[6px] rounded-b-[3px] transition-all not-italic"
                    style={{ height: `${bar.fillPercent}%` }}
                  />
                </div>
                <div className="text-[11.5px] text-[#77738C] select-none">
                  {bar.month}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution Donut Panel (1fr) */}
        <div className="bg-white border border-[#E9E7F3] rounded-[16px] p-5 shadow-2xs flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between mb-[18px]">
            <div className="text-[14.5px] font-semibold text-[#1C1A2E]">
              Plan distribution
            </div>
          </div>

          <div className="flex flex-col items-center">
            {/* Donut Chart: 132x132 conic-gradient */}
            <div
              className="w-[132px] h-[132px] rounded-full flex items-center justify-center mb-4 shadow-xs"
              style={{
                background:
                  "conic-gradient(#7C5CFC 0% 58%, #C98A2C 58% 78%, #E9E7F3 78% 100%)",
              }}
            >
              {/* Inner Circle: 92x92 white surface */}
              <span className="w-[92px] h-[92px] rounded-full bg-white flex flex-col items-center justify-center shadow-2xs select-none">
                <b className="text-[20px] font-bold text-[#1C1A2E] leading-tight">
                  58%
                </b>
                <small className="text-[11px] text-[#77738C] leading-none mt-0.5 font-medium">
                  Pro plan
                </small>
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="flex items-center justify-center gap-4 mt-4 select-none">
            <div className="flex items-center gap-[7px] text-[12.5px] text-[#77738C]">
              <span className="w-[9px] h-[9px] rounded-full bg-[#7C5CFC] shrink-0" />
              <span>Pro</span>
            </div>
            <div className="flex items-center gap-[7px] text-[12.5px] text-[#77738C]">
              <span className="w-[9px] h-[9px] rounded-full bg-[#C98A2C] shrink-0" />
              <span>Business</span>
            </div>
            <div className="flex items-center gap-[7px] text-[12.5px] text-[#77738C]">
              <span className="w-[9px] h-[9px] rounded-full bg-[#E9E7F3] shrink-0" />
              <span>Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- 6. RECENT STORES TABLE PANEL ---------- */}
      <div className="bg-white border border-[#E9E7F3] rounded-[16px] overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[#E9E7F3]">
          <div className="text-[14.5px] font-semibold text-[#1C1A2E]">
            Recent stores
          </div>
          <Link
            href="/admin/stores"
            className="text-[13px] font-semibold text-[#5C3FE0] hover:underline transition-colors"
          >
            View all stores →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FBFAFE]">
                <th className="text-left text-[12px] text-[#77738C] font-medium px-5 py-3 border-b border-[#E9E7F3] uppercase tracking-[0.02em]">
                  Store
                </th>
                <th className="text-left text-[12px] text-[#77738C] font-medium px-5 py-3 border-b border-[#E9E7F3] uppercase tracking-[0.02em]">
                  Plan
                </th>
                <th className="text-left text-[12px] text-[#77738C] font-medium px-5 py-3 border-b border-[#E9E7F3] uppercase tracking-[0.02em]">
                  Status
                </th>
                <th className="text-left text-[12px] text-[#77738C] font-medium px-5 py-3 border-b border-[#E9E7F3] uppercase tracking-[0.02em]">
                  Created
                </th>
                <th className="text-left text-[12px] text-[#77738C] font-medium px-5 py-3 border-b border-[#E9E7F3] uppercase tracking-[0.02em]">
                  Monthly revenue
                </th>
                <th className="w-10 px-5 py-3 border-b border-[#E9E7F3]" />
              </tr>
            </thead>
            <tbody>
              {RECENT_STORES.map((store, index) => {
                const isLast = index === RECENT_STORES.length - 1;

                return (
                  <tr
                    key={store.id}
                    className="hover:bg-[#FDFDFE] transition-colors"
                  >
                    {/* Store Cell */}
                    <td
                      className={`px-5 py-3.5 text-[13.5px] ${
                        isLast ? "border-b-0" : "border-b border-[#E9E7F3]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[9px] bg-[#F0ECFF] text-[#5C3FE0] flex items-center justify-center font-bold text-[12.5px] shrink-0">
                          {store.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-[#1C1A2E] leading-tight">
                            {store.name}
                          </div>
                          <div className="text-[12px] text-[#77738C] leading-snug">
                            {store.subdomain}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Plan Cell */}
                    <td
                      className={`px-5 py-3.5 text-[13px] text-[#77738C] ${
                        isLast ? "border-b-0" : "border-b border-[#E9E7F3]"
                      }`}
                    >
                      {store.plan}
                    </td>

                    {/* Status Badge Cell */}
                    <td
                      className={`px-5 py-3.5 ${
                        isLast ? "border-b-0" : "border-b border-[#E9E7F3]"
                      }`}
                    >
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${
                          store.status === "Active"
                            ? "bg-[#E6F7EF] text-[#1E9A6C]"
                            : store.status === "Trial"
                              ? "bg-[#FBF1DF] text-[#C98A2C]"
                              : "bg-[#FCEBEB] text-[#D8484A]"
                        }`}
                      >
                        {store.status}
                      </span>
                    </td>

                    {/* Created Date Cell */}
                    <td
                      className={`px-5 py-3.5 text-[13.5px] text-[#1C1A2E] ${
                        isLast ? "border-b-0" : "border-b border-[#E9E7F3]"
                      }`}
                    >
                      {store.created}
                    </td>

                    {/* Monthly Revenue Cell */}
                    <td
                      className={`px-5 py-3.5 text-[13.5px] font-semibold text-[#1C1A2E] ${
                        isLast ? "border-b-0" : "border-b border-[#E9E7F3]"
                      }`}
                    >
                      {store.monthlyRevenue}
                    </td>

                    {/* Row Menu Actions */}
                    <td
                      className={`px-5 py-3.5 text-center ${
                        isLast ? "border-b-0" : "border-b border-[#E9E7F3]"
                      }`}
                    >
                      <button
                        type="button"
                        className="text-[#77738C] hover:text-[#1C1A2E] cursor-pointer text-base font-bold select-none p-1 rounded hover:bg-[#F6F5FB] transition-colors"
                        aria-label={`Actions for ${store.name}`}
                      >
                        ⋯
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
