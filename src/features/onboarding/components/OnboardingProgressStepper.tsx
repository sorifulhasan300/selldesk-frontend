"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, ChevronRight, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OnboardingProgressStepperProps {
  currentStep?: number;
}

interface StepItem {
  number: number;
  label: string;
  path: string;
}

export const ONBOARDING_STEPS: StepItem[] = [
  { number: 1, label: "Select Plan", path: "/plans" },
  { number: 2, label: "Account Register", path: "/register" },
  { number: 3, label: "Verify Email", path: "/verify-email" },
  { number: 4, label: "Store Setup", path: "/onboarding" },
];

export function OnboardingProgressStepper({
  currentStep,
}: OnboardingProgressStepperProps) {
  const pathname = usePathname();

  // Determine current step from prop or pathname
  const activeStep = React.useMemo(() => {
    if (
      typeof currentStep === "number" &&
      currentStep >= 1 &&
      currentStep <= 4
    ) {
      return currentStep;
    }
    if (pathname.includes("/plans")) return 1;
    if (pathname.includes("/register")) return 2;
    if (pathname.includes("/verify-email")) return 3;
    if (pathname.includes("/onboarding")) return 4;
    return 1;
  }, [currentStep, pathname]);

  const activeStepData =
    ONBOARDING_STEPS.find((s) => s.number === activeStep) ||
    ONBOARDING_STEPS[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-sm sm:text-base text-[#0F172A] hover:opacity-85 transition-opacity select-none"
        >
          <div className="flex size-7.5 items-center justify-center rounded-lg bg-[#7C5CFC] text-white shadow-2xs">
            <ShoppingBag className="size-4" />
          </div>
          <span>
            Sell<span className="text-[#7C5CFC]">Desk</span>
          </span>
        </Link>

        {/* Center: Desktop Pill Stepper */}
        <nav
          aria-label="Onboarding Progress"
          className="hidden md:flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-1 shadow-2xs"
        >
          {ONBOARDING_STEPS.map((step, idx) => {
            const isCompleted = step.number < activeStep;
            const isActive = step.number === activeStep;
            const isUpcoming = step.number > activeStep;

            return (
              <React.Fragment key={step.number}>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-1 text-xs transition-all duration-200",
                    isActive &&
                      "bg-[#7C5CFC] text-white font-semibold shadow-xs ring-2 ring-[#7C5CFC]/20",
                    isCompleted &&
                      "bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60",
                    isUpcoming && "text-[#94A3B8] font-normal",
                  )}
                >
                  {isCompleted && (
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                  )}

                  {isActive && (
                    <span className="inline-flex items-center justify-center rounded-full bg-white/25 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white tracking-wider">
                      [ {step.number} / 4 ]
                    </span>
                  )}

                  {isUpcoming && (
                    <span className="flex size-4.5 items-center justify-center rounded-full bg-[#E2E8F0] text-[10px] font-mono font-semibold text-[#64748B]">
                      {step.number}
                    </span>
                  )}

                  <span className="whitespace-nowrap">{step.label}</span>
                </div>

                {idx < ONBOARDING_STEPS.length - 1 && (
                  <ChevronRight className="size-3.5 text-[#CBD5E1] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Mobile / Tablet Compact Step Pill */}
        <div className="flex md:hidden items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 px-2.5 py-1 text-xs font-semibold text-[#7C5CFC]">
            <span className="font-mono text-[11px] font-bold">
              [ {activeStep} / 4 ]
            </span>
            <span className="truncate max-w-[120px] xs:max-w-none text-[11px]">
              {activeStepData.label}
            </span>
          </div>

          {/* Mini 4-dot / bar visual progress */}
          <div className="flex items-center gap-1">
            {ONBOARDING_STEPS.map((s) => (
              <span
                key={s.number}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  s.number < activeStep && "bg-emerald-500",
                  s.number === activeStep && "w-3 bg-[#7C5CFC]",
                  s.number > activeStep && "bg-[#CBD5E1]",
                )}
              />
            ))}
          </div>
        </div>

        {/* Right: Assistance / Status Pill */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            Store Onboarding
          </span>
        </div>
      </div>
    </header>
  );
}
