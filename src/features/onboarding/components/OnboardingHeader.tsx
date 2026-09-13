"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_LABELS: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: "Store Identity",
    subtitle: "Basic Info & Subdomain",
  },
  2: {
    title: "Business Details",
    subtitle: "Products & Sales Structure",
  },
  3: {
    title: "Branding Assets",
    subtitle: "Logo & Banner Assets",
  },
};

export function OnboardingHeader({
  currentStep,
  totalSteps = 3,
}: OnboardingHeaderProps) {
  const activeMeta = STEP_LABELS[currentStep] || STEP_LABELS[1];
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-3 sm:py-4">
        {/* Centered Minimal SellDesk Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-sans font-bold text-lg sm:text-xl tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <ShoppingBag className="size-4 sm:size-5" />
          </div>
          <span>
            Sell<span className="text-primary">Desk</span>
          </span>
        </Link>

        {/* Step Progress Info */}
        <div className="mt-3 flex w-full max-w-md flex-col items-center">
          <div className="flex w-full items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-muted-foreground">
              Step {currentStep} of {totalSteps}:{" "}
              <strong className="font-semibold text-foreground">
                {activeMeta.title}
              </strong>
            </span>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {progressPercent}%
            </span>
          </div>

          {/* Minimal Progress Bar */}
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Onboarding progress: ${progressPercent}%`}
          >
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step Indicator Nodes */}
          <div className="mt-2.5 flex w-full justify-between px-1">
            {[1, 2, 3].map((step) => {
              const isCompleted = step < currentStep;
              const isCurrent = step === currentStep;

              return (
                <div key={step} className="flex items-center gap-1.5 text-xs">
                  <div
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full text-[10px] font-semibold transition-all duration-300 font-mono",
                      isCompleted &&
                        "bg-primary text-primary-foreground shadow-2xs",
                      isCurrent &&
                        "border-2 border-primary bg-background text-primary ring-2 ring-primary/20",
                      !isCompleted &&
                        !isCurrent &&
                        "border border-border/80 bg-muted text-muted-foreground",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-3 stroke-[2.5]" />
                    ) : (
                      step
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden sm:inline text-xs transition-colors",
                      isCurrent
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {STEP_LABELS[step]?.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
