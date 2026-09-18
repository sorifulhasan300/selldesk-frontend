"use client";

import React from "react";

export interface UserStatusSwitchProps {
  isActive: boolean;
  isSelf: boolean;
  onToggle: () => void;
}

export function UserStatusSwitch({
  isActive,
  isSelf,
  onToggle,
}: UserStatusSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isSelf}
        onClick={onToggle}
        title={
          isSelf
            ? "Cannot alter your own status"
            : isActive
              ? "Click to suspend account"
              : "Click to activate account"
        }
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
          isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
        } ${isSelf ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            isActive ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <span
        className={`text-[12px] font-medium ${
          isActive ? "text-admin-text" : "text-admin-text-soft"
        }`}
      >
        {isActive ? "Active" : "Suspended"}
      </span>
    </div>
  );
}
