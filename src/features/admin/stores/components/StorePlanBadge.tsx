import React from "react";

export interface StorePlanBadgeProps {
  plan: string;
}

export function StorePlanBadge({ plan }: StorePlanBadgeProps) {
  const normalized = (plan || "").toLowerCase();

  let dotColor = "text-admin-line";
  if (normalized.includes("pro")) {
    dotColor = "text-admin-brand";
  } else if (normalized.includes("business")) {
    dotColor = "text-admin-gold";
  }

  return (
    <div className="flex items-center gap-1.5 text-[13px] text-admin-text-soft">
      <span
        className={`text-[9px] leading-none shrink-0 ${dotColor}`}
        aria-hidden="true"
      >
        ●
      </span>
      <span>{plan}</span>
    </div>
  );
}
