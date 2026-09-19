"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export interface AuditLogJsonViewerProps {
  data: Record<string, unknown> | null | undefined;
  title?: string;
}

export function AuditLogJsonViewer({
  data,
  title = "Payload & Details",
}: AuditLogJsonViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="p-4 rounded-[12px] bg-admin-bg/50 border border-admin-line text-[12.5px] text-admin-text-soft italic">
        No additional payload details recorded for this event.
      </div>
    );
  }

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API unavailable
    }
  };

  return (
    <div className="rounded-[12px] border border-admin-line bg-[#1E1E2E] text-[#CDD6F4] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <span className="text-[11.5px] font-mono font-medium text-slate-300">
          {title}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
          title="Copy JSON to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto max-h-[300px] text-[12px] font-mono leading-relaxed">
        <pre className="whitespace-pre">{jsonString}</pre>
      </div>
    </div>
  );
}
