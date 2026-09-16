"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export interface AdminAnalyticsErrorProps {
  message?: string | null;
  onRetry: () => void;
}

export function AdminAnalyticsError({
  message = "Failed to load dashboard metrics.",
  onRetry,
}: AdminAnalyticsErrorProps) {
  return (
    <div className="bg-admin-surface border border-admin-line rounded-[16px] p-6 shadow-2xs my-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-admin-red-soft flex items-center justify-center text-admin-red shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[14.5px] font-semibold text-admin-text">
            Unable to load analytics data
          </h4>
          <p className="text-[12.5px] text-admin-text-soft mt-0.5">
            {message ||
              "An unexpected error occurred while communicating with the server."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-[8px] bg-admin-brand text-white hover:opacity-90 transition-opacity cursor-pointer shrink-0"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Retry
      </button>
    </div>
  );
}
