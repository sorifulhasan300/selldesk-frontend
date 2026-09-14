"use client";

import React, { useEffect, useState } from "react";
import {
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { checkSubdomainAvailabilityAction } from "../actions/subdomainActions";
import { cn } from "@/lib/utils";

export interface SubdomainInputFieldProps {
  value: string;
  onChange: (val: string) => void;
  onManualEdit?: () => void;
  error?: string;
  disabled?: boolean;
  storeName?: string;
  onSyncWithStoreName?: () => void;
}

export function SubdomainInputField({
  value,
  onChange,
  onManualEdit,
  error,
  disabled = false,
  storeName,
  onSyncWithStoreName,
}: SubdomainInputFieldProps) {
  const [subStatus, setSubStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [subMessage, setSubMessage] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(async () => {
      const clean = value.trim().toLowerCase();
      if (!clean || clean.length < 3) {
        if (!isCancelled) {
          setSubStatus("idle");
          setSubMessage("");
        }
        return;
      }

      if (!isCancelled) setSubStatus("checking");
      try {
        const res = await checkSubdomainAvailabilityAction(clean);
        if (!isCancelled) {
          setSubStatus(res.available ? "available" : "taken");
          setSubMessage(res.message || "");
        }
      } catch {
        if (!isCancelled) setSubStatus("idle");
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onManualEdit) onManualEdit();
    // Sanitize in real time: lowercase alphanumeric and hyphens
    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    onChange(clean);
  };

  return (
    <div className="space-y-1.5">
      {/* Label and Inline Availability Badge */}
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="subDomain"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]"
        >
          <Globe className="size-3.5 text-[#7C5CFC]" />
          <span>Subdomain *</span>
        </label>

        {/* Animated Inline Status Badge */}
        <div className="flex items-center gap-1.5">
          {subStatus === "checking" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-2.5 py-0.5 text-[11px] font-medium text-[#64748B] shadow-2xs animate-pulse">
              <Loader2 className="size-3 animate-spin text-[#7C5CFC]" />
              <span>Checking...</span>
            </span>
          )}

          {subStatus === "available" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 shadow-2xs animate-in fade-in zoom-in-95 duration-200">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Available</span>
            </span>
          )}

          {subStatus === "taken" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 shadow-2xs animate-in fade-in zoom-in-95 duration-200">
              <XCircle className="size-3.5 text-rose-600" />
              <span>Subdomain Taken</span>
            </span>
          )}

          {onSyncWithStoreName && storeName && (
            <button
              type="button"
              onClick={onSyncWithStoreName}
              title="Re-sync with store name"
              className="inline-flex items-center gap-1 text-[10px] text-[#7C5CFC] hover:underline font-medium cursor-pointer ml-1"
            >
              <RefreshCw className="size-2.5" />
              <span>Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Group with .selldesk.com suffix */}
      <div
        className={cn(
          "flex w-full items-center rounded-xl border bg-white shadow-2xs transition-colors overflow-hidden",
          subStatus === "available" &&
            "border-emerald-300 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/25",
          subStatus === "taken" || error
            ? "border-red-300 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-400/25"
            : "border-[#E2E8F0] focus-within:border-[#7C5CFC] focus-within:ring-2 focus-within:ring-[#7C5CFC]/25",
        )}
      >
        <input
          id="subDomain"
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="e.g. dhaka-lifestyle"
          disabled={disabled}
          maxLength={30}
          className="w-full bg-transparent px-3.5 py-2.5 font-mono text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-hidden disabled:opacity-60"
        />
        <div className="flex shrink-0 items-center border-l border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 font-mono text-xs font-semibold text-[#64748B] select-none">
          .selldesk.com
        </div>
      </div>

      {/* Helper and Error Messages */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="size-3" />
          <span>{error}</span>
        </p>
      )}
      {!error && subMessage && subStatus === "taken" && (
        <p className="text-xs text-rose-500 flex items-center gap-1">
          <AlertCircle className="size-3" />
          <span>{subMessage}</span>
        </p>
      )}
      {!error && subStatus === "idle" && (
        <p className="text-[11px] text-[#64748B]">
          Your free storefront web address. Use 3-30 letters, numbers, or
          hyphens.
        </p>
      )}
    </div>
  );
}
