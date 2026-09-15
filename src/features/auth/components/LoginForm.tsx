"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  loginSchema,
  type LoginFormData,
  defaultLoginValues,
} from "../schemas/loginSchema";
import { loginAction } from "../actions/authActions";
import { useAuthStore } from "../hooks/useAuthStore";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
    mode: "onTouched",
  });

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      try {
        const result = await loginAction(data);

        // 1. Check if action failed
        if (!result.success) {
          // Check if failure is due to unverified email address
          if (result.requiresVerification && result.email) {
            toast.warning("Email verification required", {
              description:
                result.message ||
                "Your account is not verified yet. Please verify using the OTP sent to your email.",
            });
            router.push(
              `/verify-email?email=${encodeURIComponent(result.email)}`,
            );
            return;
          }

          toast.error("Login failed", {
            description:
              result.message ||
              result.error ||
              "Invalid email/phone or password. Please try again.",
          });
          return;
        }

        // 2. Synchronize active session with client-side reactive store
        if (result.user) {
          setAuth(result.user);
        }

        // 3. User feedback toast
        toast.success(result.message || "Login successful!", {
          description: result.hasStore
            ? "Redirecting to dashboard..."
            : "Redirecting to store setup...",
        });

        // 4. Resolve destination and navigate immediately
        const destination =
          result.redirectTo || (result.hasStore ? "/dashboard" : "/onboarding");

        router.push(destination);
        router.refresh();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to complete login. Please try again.";

        toast.error("Login Error", {
          description: errorMessage,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Email or Phone Number Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="emailOrPhone"
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground"
        >
          <Mail className="size-3.5 text-primary" />
          <span>Email or Phone Number</span>
          <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            id="emailOrPhone"
            type="text"
            placeholder="example@selldesk.com or 017XXXXXXXX"
            autoComplete="username email tel"
            disabled={isPending}
            {...register("emailOrPhone")}
            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-2xs transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:opacity-60 ${
              errors.emailOrPhone
                ? "border-destructive focus-visible:ring-destructive/30"
                : "border-border hover:border-border/80"
            }`}
          />
        </div>
        {errors.emailOrPhone && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.emailOrPhone.message}</span>
          </p>
        )}
      </div>

      {/* Password Field with Toggle Show/Hide */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="flex items-center gap-1.5 text-xs font-semibold text-foreground"
          >
            <Lock className="size-3.5 text-primary" />
            <span>Password</span>
            <span className="text-destructive">*</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary hover:underline transition-colors cursor-pointer"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isPending}
            {...register("password")}
            className={`w-full rounded-xl border bg-background pl-3.5 pr-10 py-2.5 text-sm text-foreground shadow-2xs transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:opacity-60 ${
              errors.password
                ? "border-destructive focus-visible:ring-destructive/30"
                : "border-border hover:border-border/80"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            disabled={isPending}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground focus:outline-hidden transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.password.message}</span>
          </p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            disabled={isPending}
            {...register("rememberMe")}
            className="size-4 rounded-sm border-border text-primary focus:ring-primary focus:ring-offset-background accent-primary cursor-pointer transition-colors"
          />
          <span className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Remember me
          </span>
        </label>
      </div>

      {/* Primary CTA Submit Button with Micro-interactions */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      {/* Trust & Security Guarantee Badge */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5 text-primary" />
        <span>All your data is fully encrypted and secure</span>
      </div>
    </form>
  );
}
