"use client";

import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  Copy,
  Check,
  Calendar,
  Globe,
  Monitor,
  User,
} from "lucide-react";
import type { AuditLog } from "../types/audit-log.types";
import { useAdminAuditLogDetails } from "../hooks/use-admin-audit-log-details";
import { AuditLogActionBadge } from "./audit-log-action-badge";
import { AuditLogStatusBadge } from "./audit-log-status-badge";
import { AuditLogJsonViewer } from "./audit-log-json-viewer";
import { formatAuditDateTime } from "../utils/audit-log-formatters";

export interface AuditLogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export function AuditLogDetailsModal({
  isOpen,
  onClose,
  log,
}: AuditLogDetailsModalProps) {
  const { data: fullLog } = useAdminAuditLogDetails(isOpen ? log?.id : null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !log) return null;
  const current = fullLog || log;
  const { formatted } = formatAuditDateTime(current.createdAt);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-line shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-admin-brand" />
            <div>
              <h2 className="text-base font-bold text-admin-text">
                Audit Log Entry
              </h2>
              <p className="text-[12px] text-admin-text-soft">
                Record ID: {current.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AuditLogStatusBadge status={current.status} />
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-[8px] text-admin-text-soft hover:text-admin-text hover:bg-admin-bg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-[13px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-[12px] bg-admin-bg/60 border border-admin-line space-y-1.5">
              <span className="text-[11px] font-semibold text-admin-text-soft uppercase">
                Action &amp; Target
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <AuditLogActionBadge action={current.action} />
                <span className="font-semibold text-admin-text">
                  {current.targetType}
                </span>
                {current.targetId && (
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(current.targetId!, "targetId")
                    }
                    className="inline-flex items-center gap-1 font-mono text-[11px] bg-admin-surface px-2 py-0.5 rounded border border-admin-line hover:border-admin-brand cursor-pointer"
                  >
                    <span>#{current.targetId.slice(0, 8)}</span>
                    {copiedField === "targetId" ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-admin-text-soft" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-[12px] bg-admin-bg/60 border border-admin-line space-y-1.5">
              <span className="text-[11px] font-semibold text-admin-text-soft uppercase">
                Actor
              </span>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-admin-text-soft shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-admin-text truncate">
                    {current.actor?.name || current.actorEmail || "System"}
                  </div>
                  <div className="text-[11.5px] text-admin-text-soft truncate">
                    {current.actor?.email || current.actorEmail || "Internal"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-[10px] bg-admin-bg/40 border border-admin-line">
              <div className="flex items-center gap-1 text-admin-text-soft text-[11px] font-medium uppercase mb-1">
                <Calendar className="w-3.5 h-3.5" /> <span>Timestamp</span>
              </div>
              <div className="text-admin-text font-medium text-[12px]">
                {formatted}
              </div>
            </div>

            <div className="p-3 rounded-[10px] bg-admin-bg/40 border border-admin-line">
              <div className="flex items-center gap-1 text-admin-text-soft text-[11px] font-medium uppercase mb-1">
                <Monitor className="w-3.5 h-3.5" /> <span>IP Address</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-admin-text text-[12px]">
                  {current.ipAddress || "Internal"}
                </span>
                {current.ipAddress && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(current.ipAddress!, "ip")}
                    className="text-admin-text-soft hover:text-admin-text p-0.5 cursor-pointer"
                  >
                    {copiedField === "ip" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 rounded-[10px] bg-admin-bg/40 border border-admin-line">
              <div className="flex items-center gap-1 text-admin-text-soft text-[11px] font-medium uppercase mb-1">
                <Globe className="w-3.5 h-3.5" /> <span>Store</span>
              </div>
              <div className="text-admin-text font-medium text-[12px] truncate">
                {current.store
                  ? `${current.store.storeName}`
                  : "Global / Platform"}
              </div>
            </div>
          </div>

          {current.userAgent && (
            <div className="p-3 rounded-[10px] bg-admin-bg/40 border border-admin-line text-[11.5px]">
              <span className="text-admin-text-soft block text-[11px] uppercase font-semibold mb-0.5">
                User Agent
              </span>
              <p className="font-mono text-admin-text break-all">
                {current.userAgent}
              </p>
            </div>
          )}

          <AuditLogJsonViewer data={current.details} />
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-admin-line bg-admin-bg/30 shrink-0">
          <button
            type="button"
            onClick={() => copyToClipboard(current.id, "logId")}
            className="inline-flex items-center gap-1.5 text-[12px] text-admin-text-soft hover:text-admin-text font-mono cursor-pointer"
          >
            {copiedField === "logId" ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy ID</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-[8px] bg-admin-surface border border-admin-line text-admin-text hover:bg-admin-bg font-medium text-[13px] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
