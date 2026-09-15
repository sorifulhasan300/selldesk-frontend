"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Star,
  ShieldCheck,
} from "lucide-react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Background Decorative Ambient Glows */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 size-[500px] rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 size-[550px] rounded-full bg-secondary/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/3 size-[350px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Branding Showcase & Value Proposition (Hidden on mobile, visible on lg+) */}
          <div className="hidden flex-col justify-between space-y-8 lg:col-span-6 lg:flex xl:col-span-7">
            {/* Top Logo */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 font-sans font-bold text-2xl tracking-tight text-foreground group"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
                  <ShoppingBag className="size-5.5" />
                </div>
                <span>
                  Sell<span className="text-primary">Desk</span>
                </span>
              </Link>
            </div>

            {/* Value Proposition Hero Content */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl xl:text-5xl leading-tight">
                Welcome back to{" "}
                <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
                  SellDesk
                </span>
              </h1>

              <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
                Log in to your SellDesk merchant portal to seamlessly manage
                sales, orders, courier deliveries, and inventory from one
                unified workspace.
              </p>

              {/* High-Converting Feature Highlights */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span>
                    One-click order processing & automated invoice generation
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span>
                    Automated courier dispatch with RedX, Steadfast, and
                    Paperfly
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span>
                    Real-time sales analytics and automated payment
                    reconciliation
                  </span>
                </div>
              </div>
            </div>

            {/* Merchant Social Proof Card */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-md shadow-xs">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary border-2 border-background">
                    RJ
                  </div>
                  <div className="inline-flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground border-2 border-background">
                    TC
                  </div>
                  <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground border-2 border-background">
                    AK
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-primary" />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    Trusted by <strong className="font-bold">5,000+</strong>{" "}
                    ambitious merchants
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Frosted Glass Form Card */}
          <div className="w-full lg:col-span-6 xl:col-span-5">
            <div className="mx-auto max-w-md">
              {/* Mobile / Tablet Header Logo (Visible only on < lg) */}
              <div className="mb-6 flex flex-col items-center text-center lg:hidden">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-sans font-bold text-2xl tracking-tight text-foreground"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                    <ShoppingBag className="size-5" />
                  </div>
                  <span>
                    Sell<span className="text-primary">Desk</span>
                  </span>
                </Link>
              </div>

              {/* Main Frosted Glass Card */}
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/85 p-6 sm:p-8 shadow-xl backdrop-blur-xl transition-all duration-300">
                {/* Header Info */}
                <div className="mb-6 space-y-2 text-center sm:text-left">
                  {/* Trust Badge Banner */}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-secondary/80 px-3 py-1 text-[11px] font-semibold text-primary">
                    <ShieldCheck className="size-3" />
                    <span>Secure Merchant Portal</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground pt-1">
                    Sign in to your account
                  </h2>
                </div>

                {/* Login Form Slot */}
                {children}

                {/* Bottom Redirection Link */}
                <div className="mt-6 border-t border-border/60 pt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-primary hover:underline transition-colors"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>

              {/* Bottom Copyright and Security Assurance */}
              <div className="mt-6 text-center text-xs text-muted-foreground/80">
                <p>
                  © {new Date().getFullYear()} SellDesk. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
