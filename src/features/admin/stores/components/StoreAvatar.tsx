import React from "react";
import Image from "next/image";

export interface StoreAvatarProps {
  name: string;
  avatarUrl?: string | null;
}

export function StoreAvatar({ name, avatarUrl }: StoreAvatarProps) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={36}
        height={36}
        className="w-9 h-9 rounded-[10px] object-cover shrink-0"
        unoptimized
      />
    );
  }

  const clean = (name || "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const initials =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : clean.slice(0, 2).toUpperCase() || "SD";

  return (
    <div
      className="w-9 h-9 rounded-[10px] bg-admin-brand-soft text-admin-brand font-bold text-xs flex items-center justify-center shrink-0 select-none"
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
