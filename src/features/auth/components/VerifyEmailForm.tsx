"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  KeyRound,
  Loader2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  verifyEmailSchema,
  type VerifyEmailFormData,
} from "../schemas/verifyEmailSchema";
import { verifyEmailAction, resendOtpAction } from "../actions/authActions";
import { useAuthStore } from "../hooks/useAuthStore";

interface VerifyEmailFormProps {
  initialEmail?: string;
}

export function VerifyEmailForm({ initialEmail }: VerifyEmailFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);

  const queryEmail = searchParams.get("email") || initialEmail || "";

  const [countdown, setCountdown] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: queryEmail,
      otp: "",
    },
    mode: "onTouched",
  });

  const emailValue = useWatch({ control, name: "email" });
  const otpValue = useWatch({ control, name: "otp" });

  // Keep email synced with query parameter if available
  useEffect(() => {
    if (queryEmail && !emailValue) {
      setValue("email", queryEmail, { shouldValidate: true });
    }
  }, [queryEmail, emailValue, setValue]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle resend OTP code dispatch
  const handleResendOtp = async () => {
    if (!emailValue || countdown > 0 || isResending) return;

    try {
      setIsResending(true);
      const result = await resendOtpAction({ email: emailValue });

      if (result.success) {
        toast.success("নতুন ওটিপি কোড পাঠানো হয়েছে!", {
          description: `আপনার ${emailValue} ইমেইলের ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।`,
        });
        setCountdown(60);
      } else {
        toast.error("ওটিপি পুনরায় পাঠাতে সমস্যা হয়েছে", {
          description: result.error || result.message,
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "ওটিপি পুনরায় পাঠানো সম্ভব হয়নি";
      toast.error("ওটিপি পুনরায় পাঠাতে সমস্যা হয়েছে", { description: msg });
    } finally {
      setIsResending(false);
    }
  };

  // Submit OTP verification
  const onSubmit = (data: VerifyEmailFormData) => {
    startTransition(async () => {
      try {
        const result = await verifyEmailAction(data);

        if (!result.success) {
          toast.error("ওটিপি যাচাই ব্যর্থ হয়েছে", {
            description:
              result.error || result.message || "সঠিক ৬ ডিজিটের ওটিপি কোড দিন।",
          });
          return;
        }

        // Store active session in client store upon successful email verification
        if (result.user && result.tokens) {
          setSession({
            user: result.user,
            tokens: result.tokens,
            isAuthenticated: true,
            createdAt: new Date().toISOString(),
          });
        }

        toast.success("ইমেইল সফলভাবে ভেরিফাই হয়েছে! 🎉", {
          description: "আপনাকে স্টোর সেটআপ পেজে নিয়ে যাওয়া হচ্ছে...",
        });

        // Immediately route to onboarding for store creation
        router.push("/onboarding");
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "ওটিপি যাচাই সম্পন্ন করা সম্ভব হয়নি";
        toast.error("ভেরিফিকেশন ব্যর্থ হয়েছে", { description: msg });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 font-bengali"
    >
      {/* Visual Instruction Badge */}
      <div className="rounded-xl border border-primary/20 bg-secondary/30 p-3 text-center text-xs text-foreground/85">
        <div className="flex items-center justify-center gap-1.5 font-semibold text-primary mb-1">
          <Mail className="size-4" />
          <span>আপনার ইমেইলে ওটিপি কোড পাঠানো হয়েছে</span>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          আপনার ইনবক্স অথবা স্প্যাম (Spam/Junk) ফোল্ডার চেক করে ৬ ডিজিটের
          ভেরিফিকেশন কোডটি নিচে দিন।
        </p>
      </div>

      {/* Target Email Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground"
        >
          <Mail className="size-3.5 text-primary" />
          ইমেইল এড্রেস <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="example@selldesk.com"
            disabled={isPending}
            {...register("email")}
            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-2xs transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:opacity-60 ${
              errors.email
                ? "border-destructive focus-visible:ring-destructive/30"
                : "border-border hover:border-border/80"
            }`}
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.email.message}</span>
          </p>
        )}
      </div>

      {/* 6-Digit OTP Code Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="otp"
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground"
        >
          <KeyRound className="size-3.5 text-primary" />৬ ডিজিটের ওটিপি (OTP)
          কোড <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="------"
            autoComplete="one-time-code"
            disabled={isPending}
            {...register("otp")}
            className={`w-full rounded-xl border bg-background px-3.5 py-3 text-center font-mono text-2xl tracking-[0.4em] text-foreground shadow-2xs transition-all duration-200 placeholder:text-muted-foreground/40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent tabular-nums disabled:opacity-60 ${
              errors.otp
                ? "border-destructive focus-visible:ring-destructive/30"
                : "border-border hover:border-border/80"
            }`}
          />
        </div>
        {errors.otp && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.otp.message}</span>
          </p>
        )}
      </div>

      {/* Resend OTP Timer & Button */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>কোড পাননি?</span>
        {countdown > 0 ? (
          <span className="font-mono text-muted-foreground font-medium tabular-nums">
            পুনরায় পাঠান ({countdown}s)
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending || isPending}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline disabled:opacity-50 cursor-pointer"
          >
            {isResending ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>পাঠানো হচ্ছে...</span>
              </>
            ) : (
              <>
                <RotateCcw className="size-3" />
                <span>পুনরায় কোড পাঠান</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Primary Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending || !otpValue || otpValue.length !== 6}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>যাচাই করা হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>ইমেইল ভেরিফাই ও এগিয়ে যান</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      {/* Trust Guarantee Note */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5 text-primary" />
        <span>ইমেইল ভেরিফিকেশন আপনার স্টোরের নিরাপত্তা নিশ্চিত করে</span>
      </div>
    </form>
  );
}
