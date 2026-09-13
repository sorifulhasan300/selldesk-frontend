"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Star,
} from "lucide-react";

interface RegisterLayoutProps {
  children: React.ReactNode;
}

export function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground font-bengali">
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
          {/* Left Column: Branding Showcase & Social Proof (Hidden on mobile, visible on lg+) */}
          <div className="hidden flex-col justify-between space-y-8 lg:col-span-6 lg:flex xl:col-span-7">
            {/* Top Logo */}
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 font-sans font-bold text-2xl tracking-tight text-foreground"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <ShoppingBag className="size-5.5" />
                </div>
                <span>
                  Sell<span className="text-primary">Desk</span>
                </span>
              </Link>
            </div>

            {/* Value Proposition Hero Content */}
            <div className="space-y-6">
              {/* Trust Badge Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary/60 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-xs">
                <Sparkles className="size-3.5" />
                <span>১০ দিনের ফ্রি ট্রায়াল - কোনো ক্রেডিট কার্ড লাগবে না</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl xl:text-5xl leading-tight">
                আপনার স্বপ্নের অনলাইন স্টোর শুরু করুন{" "}
                <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">
                  মাত্র ২ মিনিটে
                </span>
              </h1>

              <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
                কোনো কোডিং বা টেকনিক্যাল জ্ঞান ছাড়াই আপনার ব্যবসার জন্য একটি প্রফেশনাল ই-কমার্স ওয়েবসাইট গড়ে তুলুন।
              </p>

              {/* High-Converting Feature Highlights */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span>বিকাশ, নগদ ও কার্ডে তাৎক্ষণিক পেমেন্ট গেটওয়ে ইন্টিগ্রেশন</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span>রেডেক্স, স্টেডফাস্ট ও পেপারফ্লাই কুরিয়ার অটো-বুকিং সুবিধা</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span>ফাস্ট সুপার-অপ্টিমাইজড স্টোরফ্রন্ট এবং ফ্রি সাবডোমেন</span>
                </div>
              </div>
            </div>

            {/* Merchant Social Proof Card */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-md shadow-xs">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary border-2 border-background">
                    রফিক
                  </div>
                  <div className="inline-flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground border-2 border-background">
                    তাসনিম
                  </div>
                  <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground border-2 border-background">
                    আহমেদ
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-primary" />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    <strong className="font-bold">৫,০০০+</strong> সফল উদ্যোক্তার আস্থার প্রতীক
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
                    <Sparkles className="size-3" />
                    <span>১০ দিনের ফ্রি ট্রায়াল - কোনো ক্রেডিট কার্ড লাগবে না</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground pt-1">
                    নতুন অ্যাকাউন্ট তৈরি করুন
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    আপনার প্রাথমিক তথ্য দিন এবং মাত্র কয়েক সেকেন্ডে স্টোর শুরু করুন।
                  </p>
                </div>

                {/* Registration Form */}
                {children}

                {/* Bottom Redirection Link */}
                <div className="mt-6 border-t border-border/60 pt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    ইতিমধ্যেই অ্যাকাউন্ট আছে?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-primary hover:underline transition-colors"
                    >
                      লগইন করুন
                    </Link>
                  </p>
                </div>
              </div>

              {/* Bottom Copyright and Security Assurance */}
              <div className="mt-6 text-center text-xs text-muted-foreground/80">
                <p>© {new Date().getFullYear()} SellDesk. সর্বস্বত্ব সংরক্ষিত।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
