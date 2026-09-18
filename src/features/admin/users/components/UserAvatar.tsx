"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}

export function UserAvatar({
  name,
  avatarUrl,
  className = "w-8 h-8",
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (str: string): string => {
    if (!str) return "U";
    const parts = str.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  if (avatarUrl && !imgError) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={32}
        height={32}
        unoptimized
        onError={() => setImgError(true)}
        className={`${className} rounded-full object-cover border border-admin-line shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full bg-admin-brand/10 text-admin-brand flex items-center justify-center font-bold text-xs shrink-0 select-none border border-admin-brand/20`}
    >
      {getInitials(name)}
    </div>
  );
}
