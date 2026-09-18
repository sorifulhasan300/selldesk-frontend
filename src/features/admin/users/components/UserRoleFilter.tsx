"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface UserRoleFilterProps {
  roleFilter: string;
  onRoleChange: (role: string) => void;
}

const ROLES = [
  { label: "All Roles", value: "all" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
  { label: "Super Staff", value: "SUPER_STAFF" },
];

export function UserRoleFilter({
  roleFilter,
  onRoleChange,
}: UserRoleFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentRoleLabel =
    ROLES.find((r) => r.value.toLowerCase() === roleFilter.toLowerCase())
      ?.label || "Role";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-admin-line bg-admin-surface text-[13px] text-admin-text hover:bg-admin-bg/60 transition-colors shadow-2xs cursor-pointer"
      >
        <span>{roleFilter !== "all" ? currentRoleLabel : "Role"}</span>
        <ChevronDown className="w-3.5 h-3.5 text-admin-text-soft" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-40 bg-admin-surface border border-admin-line rounded-[10px] shadow-lg py-1 z-20">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => {
                onRoleChange(r.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-1.5 text-[13px] text-left hover:bg-admin-bg/60 transition-colors ${
                roleFilter.toLowerCase() === r.value.toLowerCase()
                  ? "text-admin-brand font-semibold"
                  : "text-admin-text"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
