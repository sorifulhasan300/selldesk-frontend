import * as React from "react";
import Link from "next/link";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardPreview } from "./DashboardPreview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-24 font-bengali bg-gradient-to-b from-secondary/40 via-secondary/15 to-background">
      {/* 1. Subtle Top Divider Glow */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

      {/* 2. Dual Aurora Glow Orbs for Depth & Warmth */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[520px] w-[850px] -translate-x-1/2 rounded-full bg-gradient-to-b from-secondary via-primary/10 to-transparent blur-3xl opacity-80" />
      <div className="pointer-events-none absolute top-1/4 -right-20 -z-10 h-[380px] w-[380px] rounded-full bg-secondary/70 blur-3xl opacity-60" />

      {/* 3. Square Box Grid ("কোট ঘর" ছক কাটা প্যাটার্ন) */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full stroke-primary/15 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_35%,#000_70%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_80%_60%_at_50%_35%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hero-grid-pattern"
            width={44}
            height={44}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 44V.5H44" fill="none" strokeWidth="1" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#hero-grid-pattern)"
        />
      </svg>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Pill Badge, Headline, Subtitle, CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Secondary Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary-foreground/15 bg-secondary/80 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-secondary-foreground shadow-xs backdrop-blur-xs">
              <span className="flex size-2 rounded-full bg-primary animate-pulse" />
              <span>অল-ইন-ওয়ান স্মার্ট ই-কমার্স প্ল্যাটফর্ম</span>
              <Sparkles className="size-3.5 text-primary" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.2]">
              পুরো অনলাইন ব্যবসা চালান{" "}
              <span className="text-primary block mt-1">এক প্ল্যাটফর্মে</span>
            </h1>

            <p className="text-base sm:text-lg font-semibold leading-relaxed text-muted-foreground max-w-xl mx-auto lg:mx-0">
              ওয়েবসাইট তৈরি করা থেকে শুরু করে পণ্য সোর্সিং, মার্কেটিং, অর্ডার,
              ইনভেন্টরি, কুরিয়ার ও হিসাব-নিকাশ — আপনার পুরো ই-কমার্স ব্যবসা
              পরিচালনা করুন এক প্ল্যাটফর্মে।
            </p>

            {/* Action Buttons: Primary & Secondary */}
            <div className="flex flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="tel:+8801700000000"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "rounded-lg px-6 text-sm font-bold border border-border/70 hover:bg-secondary/80 shadow-xs transition-colors",
                )}
              >
                কল করুন
                <Phone className="size-4 ml-1.5" />
              </Link>

              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "rounded-lg px-7 text-sm font-bold shadow-xs",
                )}
              >
                শুরু করুন
                <ArrowRight className="size-4 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: High-Fidelity Dashboard Mockup with Secondary Backdrop */}
          <div className="relative lg:col-span-6">
            {/* Multi-layered ambient glow behind dashboard frame */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-secondary via-primary/15 to-secondary/80 blur-2xl opacity-80" />
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
