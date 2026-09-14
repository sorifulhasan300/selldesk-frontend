"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles } from "lucide-react";

export function PlanHeader() {
  return (
    <div className="text-center space-y-4 max-w-2xl mx-auto">
      {/* Brand logo */}
      <div className="flex justify-center pb-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans font-bold text-2xl tracking-tight text-[#0F172A]"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#7C5CFC] text-white shadow-xs">
            <ShoppingBag className="size-5" />
          </div>
          <span>
            Sell<span className="text-[#7C5CFC]">Desk</span>
          </span>
        </Link>
      </div>

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-[#7C5CFC]/10 px-3.5 py-1 text-xs font-semibold text-[#7C5CFC]">
        <Sparkles className="size-3.5" />
        <span>Step 1: Choose Your Plan</span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A]">
        Simple, Transparent Pricing
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
        Select the plan that fits your business scale. You can test drive free
        for 14 days or upgrade anytime as your sales grow.
      </p>
    </div>
  );
}
