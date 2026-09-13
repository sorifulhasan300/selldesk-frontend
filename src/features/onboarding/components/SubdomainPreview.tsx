"use client";

import React, { useState } from "react";
import { Globe, Check, Copy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubdomainPreviewProps {
  subDomain: string;
  className?: string;
}

export function SubdomainPreview({
  subDomain,
  className,
}: SubdomainPreviewProps) {
  const [copied, setCopied] = useState(false);
  const cleanSubdomain = subDomain.trim().toLowerCase() || "yourstore";
  const fullDomain = `https://${cleanSubdomain}.selldesk.com`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullDomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy error
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-border/80 bg-secondary/40 px-3.5 py-2.5 transition-all duration-200 hover:border-primary/40 hover:bg-secondary/60 hover:shadow-xs",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-2xs border border-border/60">
          <Globe className="size-3.5" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-muted-foreground font-bengali flex items-center gap-1">
            <Sparkles className="size-3 text-primary" />
            আপনার স্টোরের সম্ভাব্য লাইভ লিংক
          </span>
          <div className="flex items-center text-xs sm:text-sm font-mono tracking-tight tabular-nums truncate select-all">
            <span className="text-muted-foreground">https://</span>
            <span className="font-semibold text-primary px-0.5">
              {cleanSubdomain}
            </span>
            <span className="text-foreground/80">.selldesk.com</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        title="লিংক কপি করুন"
        aria-label="সাবডোমেন লিংক কপি করুন"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground transition-all duration-150 hover:bg-background hover:text-primary active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring font-bengali shadow-2xs"
      >
        {copied ? (
          <>
            <Check className="size-3 text-primary" />
            <span className="text-[11px]">কপি হয়েছে!</span>
          </>
        ) : (
          <>
            <Copy className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[11px]">কপি</span>
          </>
        )}
      </button>
    </div>
  );
}
