"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Settings, RotateCw } from "lucide-react";

export interface StoresToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  planFilter: string;
  onPlanChange: (plan: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function StoresToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  planFilter,
  onPlanChange,
  onRefresh,
  isRefreshing = false,
}: StoresToolbarProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
      if (planRef.current && !planRef.current.contains(e.target as Node)) {
        setPlanOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statuses = [
    { label: "All Statuses", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Trial", value: "Trial" },
    { label: "Suspended", value: "Suspended" },
  ];

  const plans = [
    { label: "All Plans", value: "all" },
    { label: "Free", value: "Free" },
    { label: "Pro", value: "Pro" },
    { label: "Business", value: "Business" },
  ];

  const currentStatusLabel =
    statuses.find((s) => s.value.toLowerCase() === statusFilter.toLowerCase())
      ?.label || "Status";

  const currentPlanLabel =
    plans.find((p) => p.value.toLowerCase() === planFilter.toLowerCase())
      ?.label || "Plan";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-4">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] border border-admin-line bg-admin-surface w-full sm:w-[280px] md:w-[310px] shadow-2xs">
          <Search className="w-4 h-4 text-admin-text-soft shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by store, owner, or domain..."
            className="w-full bg-transparent border-none outline-none text-[13px] text-admin-text placeholder:text-admin-text-soft"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => setStatusOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-admin-line bg-admin-surface text-[13px] text-admin-text hover:bg-admin-bg/60 transition-colors shadow-2xs cursor-pointer"
          >
            <span>
              {statusFilter !== "all" ? currentStatusLabel : "Status"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-admin-text-soft" />
          </button>
          {statusOpen && (
            <div className="absolute left-0 mt-1.5 w-36 bg-admin-surface border border-admin-line rounded-[10px] shadow-lg py-1 z-20">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => {
                    onStatusChange(s.value);
                    setStatusOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-[13px] text-left hover:bg-admin-bg/60 transition-colors ${
                    statusFilter.toLowerCase() === s.value.toLowerCase()
                      ? "text-admin-brand font-semibold"
                      : "text-admin-text"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Plan Dropdown */}
        <div className="relative" ref={planRef}>
          <button
            type="button"
            onClick={() => setPlanOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-admin-line bg-admin-surface text-[13px] text-admin-text hover:bg-admin-bg/60 transition-colors shadow-2xs cursor-pointer"
          >
            <span>{planFilter !== "all" ? currentPlanLabel : "Plan"}</span>
            <ChevronDown className="w-3.5 h-3.5 text-admin-text-soft" />
          </button>
          {planOpen && (
            <div className="absolute left-0 mt-1.5 w-36 bg-admin-surface border border-admin-line rounded-[10px] shadow-lg py-1 z-20">
              {plans.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => {
                    onPlanChange(p.value);
                    setPlanOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-[13px] text-left hover:bg-admin-bg/60 transition-colors ${
                    planFilter.toLowerCase() === p.value.toLowerCase()
                      ? "text-admin-brand font-semibold"
                      : "text-admin-text"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Icon Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-[10px] border border-admin-line bg-admin-surface text-admin-text-soft hover:text-admin-text hover:bg-admin-bg/60 transition-colors shadow-2xs cursor-pointer"
          aria-label="Table settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="w-8 h-8 flex items-center justify-center rounded-[10px] border border-admin-line bg-admin-surface text-admin-text-soft hover:text-admin-text hover:bg-admin-bg/60 transition-colors shadow-2xs cursor-pointer"
          aria-label="Refresh table"
        >
          <RotateCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin text-admin-brand" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
