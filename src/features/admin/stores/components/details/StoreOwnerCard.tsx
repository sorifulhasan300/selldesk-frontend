"use client";

import React from "react";
import Image from "next/image";
import type { AdminStoreDetails } from "../../types/stores.types";

export interface StoreOwnerCardProps {
  owner: AdminStoreDetails["owner"];
  onSendMessage?: () => void;
}

export function StoreOwnerCard({ owner, onSendMessage }: StoreOwnerCardProps) {
  const initials =
    owner?.initials ||
    (owner?.name ? owner.name.slice(0, 2).toUpperCase() : "RH");
  const name = owner?.name || "Rafiul Hasan";
  const role = owner?.role || "Owner · Admin";
  const email = owner?.email || "rafiul@nabinfashion.com";
  const phone = owner?.phone || "+880 1712-345678";

  return (
    <div className="bg-admin-surface border border-admin-line rounded-[18px] p-6 shadow-2xs">
      <div className="text-[11px] font-bold text-admin-text-soft tracking-wider uppercase mb-4">
        Store owner
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 min-w-11 rounded-[12px] bg-admin-brand-soft text-admin-brand flex items-center justify-center font-bold text-sm select-none overflow-hidden">
          {owner?.avatarUrl ? (
            <Image
              src={owner.avatarUrl}
              alt={name}
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div>
          <div className="font-bold text-admin-text text-[14px] leading-snug">
            {name}
          </div>
          <div className="text-[12px] text-admin-text-soft">{role}</div>
        </div>
      </div>

      <div className="space-y-3 text-[13px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-admin-text-soft">Email</span>
          <a
            href={`mailto:${email}`}
            className="font-medium text-admin-brand hover:underline truncate max-w-[200px]"
          >
            {email}
          </a>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-admin-text-soft">Phone</span>
          <span className="font-medium text-admin-text">{phone}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSendMessage}
        className="w-full mt-5 py-2.5 px-4 rounded-[12px] border border-admin-line bg-admin-surface hover:bg-admin-bg/60 text-admin-text text-[13px] font-medium transition-colors shadow-2xs cursor-pointer text-center"
      >
        Send message
      </button>
    </div>
  );
}
