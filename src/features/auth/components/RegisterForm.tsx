"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  registerSchema,
  type RegisterFormData,
  defaultRegisterValues,
} from "../schemas/registerSchema";
import { signUpAction } from "../actions/authActions";
import { useAuthStore } from "../hooks/useAuthStore";
import { useOnboardingStore } from "@/features/onboarding/hooks/useOnboardingStorage";
import { DEFAULT_PACKAGES } from "@/features/plans/types/plan.types";
import { RegisterPlanBadge } from "./RegisterPlanBadge";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    formData: onboardingData,
    setPackage,
    setFormData,
  } = useOnboardingStore();
  const queryPlanId = searchParams.get("plan");

  // Synchronize plan from query param or fallback to free-trial
  useEffect(() => {
    const targetPlanId =
      queryPlanId || onboardingData.packageId || "free-trial";
    if (
      !onboardingData.packageId ||
      (queryPlanId && onboardingData.packageId !== queryPlanId)
    ) {
      const matched =
        DEFAULT_PACKAGES.find((p) => p.id === targetPlanId) ||
        DEFAULT_PACKAGES[0];
      setPackage(matched.id, matched.name, matched.price);
    }
  }, [queryPlanId, onboardingData.packageId, setPackage]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegisterValues,
    mode: "onTouched",
  });

  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        const result = await signUpAction(data);
        if (!result.success) {
          toast.error("Registration failed", {
            description: result.error || result.message,
          });
          return;
        }

        if (result.user) {
          setSession({
            user: result.user,
            tokens: { accessToken: "", refreshToken: "" },
            isAuthenticated: false,
            createdAt: new Date().toISOString(),
          });
        }

        setFormData({ storePhone: data.phone });
        toast.success("Account created successfully!", {
          description:
            "A 6-digit verification code has been sent to your email.",
        });
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } catch (err) {
        toast.error("Registration failed", {
          description: err instanceof Error ? err.message : "Unexpected error",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <RegisterPlanBadge
        packageName={onboardingData.packageName}
        packagePrice={onboardingData.packagePrice}
      />

      {/* Full Name */}
      <div className="space-y-1">
        <label
          htmlFor="fullName"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]"
        >
          <User className="size-3.5 text-[#7C5CFC]" /> Full Name *
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="e.g. Ariful Islam"
          autoComplete="name"
          disabled={isPending}
          {...register("fullName")}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0F172A] shadow-2xs transition-all placeholder:text-[#94A3B8] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#7C5CFC] ${errors.fullName ? "border-red-500" : "border-[#E2E8F0]"}`}
        />
        {errors.fullName && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="size-3" />
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]"
        >
          <Mail className="size-3.5 text-[#7C5CFC]" /> Email Address *
        </label>
        <input
          id="email"
          type="email"
          placeholder="example@selldesk.com"
          autoComplete="email"
          disabled={isPending}
          {...register("email")}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0F172A] shadow-2xs transition-all placeholder:text-[#94A3B8] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#7C5CFC] ${errors.email ? "border-red-500" : "border-[#E2E8F0]"}`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="size-3" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label
          htmlFor="phone"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]"
        >
          <Phone className="size-3.5 text-[#7C5CFC]" /> Mobile Number *
        </label>
        <div className="flex rounded-xl border border-[#E2E8F0] bg-white shadow-2xs focus-within:ring-2 focus-within:ring-[#7C5CFC]">
          <span className="flex items-center gap-1 rounded-l-xl border-r border-[#E2E8F0] bg-[#F8F9FC] px-3 text-xs font-medium text-[#64748B]">
            🇧🇩 +88
          </span>
          <input
            id="phone"
            type="tel"
            placeholder="017XXXXXXXX"
            autoComplete="tel"
            disabled={isPending}
            {...register("phone")}
            className="w-full bg-transparent px-3 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-hidden"
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="size-3" />
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0F172A]"
        >
          <Lock className="size-3.5 text-[#7C5CFC]" /> Password *
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            disabled={isPending}
            {...register("password")}
            className={`w-full rounded-xl border bg-white pl-3.5 pr-10 py-2.5 text-sm text-[#0F172A] shadow-2xs transition-all placeholder:text-[#94A3B8] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#7C5CFC] ${errors.password ? "border-red-500" : "border-[#E2E8F0]"}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            tabIndex={-1}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="size-3" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2.5 cursor-pointer pt-1">
        <input
          type="checkbox"
          disabled={isPending}
          {...register("agreeTerms")}
          className="mt-0.5 size-4 rounded-sm border-[#CBD5E1] accent-[#7C5CFC] cursor-pointer"
        />
        <span className="text-xs text-[#64748B] leading-relaxed">
          I agree to SellDesk&apos;s{" "}
          <a href="#" className="font-semibold text-[#7C5CFC] hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="font-semibold text-[#7C5CFC] hover:underline">
            Privacy Policy
          </a>
          .
        </span>
      </label>
      {errors.agreeTerms && (
        <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>
      )}

      {/* Strict Pill CTA Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium pl-6 pr-1.5 py-1.5 rounded-full inline-flex items-center justify-between transition-transform active:scale-95 disabled:opacity-60 cursor-pointer shadow-sm"
        >
          <span className="text-sm font-semibold">
            {isPending ? "Creating Account..." : "Create Account & Continue"}
          </span>
          <span className="w-8 h-8 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center shadow-xs">
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#64748B]">
        <ShieldCheck className="size-3.5 text-[#7C5CFC]" />
        <span>Your data is encrypted and secure</span>
      </div>
    </form>
  );
}
