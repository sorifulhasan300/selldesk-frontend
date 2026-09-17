import React from "react";

export interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * SellDesk Admin Page-Level Header
 * Standardized title, subtitle, and action controls container for admin sub-routes.
 */
export function AdminPageHeader({
  title,
  subtitle,
  children,
  className = "",
}: AdminPageHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 ${className}`}
    >
      <div>
        <h1 className="text-[22px] font-bold text-[#1C1A2E] m-0 mb-1 tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-[#77738C] mt-0.5">{subtitle}</p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-3.5 flex-wrap">{children}</div>
      )}
    </div>
  );
}

export default AdminPageHeader;
