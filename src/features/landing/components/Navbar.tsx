"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common";

const NAV_LINKS = [
  { label: "ফিচার", href: "#features" },
  { label: "প্রাইসিং", href: "/pricing" },
  { label: "রিভিউ", href: "#reviews" },
  { label: "পোর্টফোলিও", href: "#portfolio" },
  { label: "প্রশ্নোত্তর", href: "#faq" },
] as const;

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md font-bengali">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Logo priority size="md" />

          {/* Center Desktop Navigation Links */}
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-sm font-bold text-foreground hover:bg-muted",
              )}
            >
              লগইন
            </Link>
            <Link
              href="/plans"
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-medium pl-4 pr-1 py-1 rounded-full inline-flex items-center gap-2 transition-transform active:scale-95 shadow-xs"
            >
              <span>এখনি শুরু করুন</span>
              <span className="w-6 h-6 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="মেনু খুলুন"
            aria-expanded={isOpen}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Overlay (Darkened Scrim outside header) */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[90] bg-foreground/45 backdrop-blur-xs transition-opacity duration-300 md:hidden",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      {/* Mobile Full-Height Opaque Drawer (Whole Screen Top to Bottom with Bold Typography) */}
      <aside
        aria-label="মোবাইল মেনু ড্রয়ার"
        className={cn(
          "fixed inset-y-0 left-0 top-0 bottom-0 z-[100] flex h-screen h-[100dvh] w-72 sm:w-80 flex-col justify-between border-r border-border bg-card p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden font-bengali",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-border">
            <Logo size="sm" onClick={() => setIsOpen(false)} />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="মেনু বন্ধ করুন"
              className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <nav className="mt-5 flex flex-col space-y-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3.5 py-2.5 text-base font-bold text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-5 border-t border-border flex flex-col gap-3">
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full justify-center text-sm font-bold",
            )}
          >
            লগইন
          </Link>
          <Link
            href="/plans"
            onClick={() => setIsOpen(false)}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-medium pl-6 pr-1.5 py-1.5 rounded-full inline-flex items-center justify-between transition-transform active:scale-95 shadow-xs"
          >
            <span>এখনি শুরু করুন</span>
            <span className="w-8 h-8 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
