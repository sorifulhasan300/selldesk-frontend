"use client";

import React, { useState, useTransition, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  Camera,
  X,
} from "lucide-react";
import {
  registerSchema,
  type RegisterFormData,
  defaultRegisterValues,
} from "../schemas/registerSchema";
import { signUpAction } from "../actions/authActions";
import { uploadImageAction } from "@/shared/actions/uploadActions";
import { useAuthStore } from "../hooks/useAuthStore";
import { useOnboardingStore } from "@/features/onboarding/hooks/useOnboardingStorage";

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultRegisterValues,
    mode: "onTouched",
  });

  const avatarUrl = useWatch({ control, name: "avatarUrl" });
  const isSubmitting = isPending || isUploadingAvatar;

  // Handle single profile picture upload to /api/v1/upload/public?folder=avatars
  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type and file size (max 5MB)
    if (!file.type.startsWith("image/")) {
      toast.error("ভুল ফাইল ফরম্যাট", {
        description:
          "অনুগ্রহ করে একটি ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("ফাইল সাইজ অত্যন্ত বড়", {
        description: "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারে।",
      });
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("file", file);

      const uploadResult = await uploadImageAction(formData, {
        folder: "avatars",
        isPublic: true,
      });

      if (uploadResult.success && uploadResult.data) {
        setValue("avatarUrl", uploadResult.data.url, { shouldValidate: true });
        setValue("avatarPublicId", uploadResult.data.publicId, {
          shouldValidate: true,
        });
        toast.success("প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে!");
      } else {
        toast.error("ছবি আপলোড ব্যর্থ হয়েছে", {
          description: uploadResult.error || uploadResult.message,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ছবি আপলোড করা যায়নি";
      toast.error("ছবি আপলোড ব্যর্থ হয়েছে", { description: msg });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = () => {
    setValue("avatarUrl", "", { shouldValidate: true });
    setValue("avatarPublicId", "", { shouldValidate: true });
  };

  // Submit handler calling Next.js 15 signUpAction inside startTransition
  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        const result = await signUpAction(data);

        if (!result.success) {
          toast.error("রেজিস্ট্রেশন ব্যর্থ হয়েছে", {
            description:
              result.error ||
              result.message ||
              "রেজিস্ট্রেশন প্রক্রিয়া সম্পন্ন করা সম্ভব হয়নি। আবার চেষ্টা করুন।",
          });
          return;
        }

        // Save user registration draft info in reactive store
        if (result.user) {
          setSession({
            user: result.user,
            tokens: {
              accessToken: "",
              refreshToken: "",
            },
            isAuthenticated: false,
            createdAt: new Date().toISOString(),
          });
        }

        // Pre-fill phone in onboarding draft store for seamless merchant UX
        useOnboardingStore.getState().setFormData({
          storePhone: data.phone,
        });

        toast.success(result.message || "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", {
          description: "আপনার ইমেইলে ৬ ডিজিটের ওটিপি (OTP) কোড পাঠানো হয়েছে।",
        });

        // Navigate to email verification route
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "রেজিস্ট্রেশন প্রক্রিয়া সম্পন্ন করা সম্ভব হয়নি। আবার চেষ্টা করুন।";
        toast.error("রেজিস্ট্রেশন ব্যর্থ হয়েছে", {
          description: errorMessage,
        });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 font-bengali"
    >
      {/* Profile Avatar Upload Section */}
      <div className="flex flex-col items-center justify-center pb-2">
        <div className="relative group">
          <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary/40 bg-muted/50 shadow-xs transition-all hover:border-primary">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="size-full object-cover"
              />
            ) : isUploadingAvatar ? (
              <Loader2 className="size-6 animate-spin text-primary" />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Camera className="size-6 text-muted-foreground/80 group-hover:text-primary transition-colors" />
                <span className="text-[10px] mt-0.5 font-medium">ছবি দিন</span>
              </div>
            )}
          </div>

          {/* Remove Avatar Button */}
          {avatarUrl && !isSubmitting && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 transition-colors"
              title="ছবি মুছে ফেলুন"
            >
              <X className="size-3" />
            </button>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={isSubmitting}
            onChange={handleAvatarFileChange}
            className="hidden"
            id="avatarFileInput"
          />

          {/* Trigger Button */}
          {!avatarUrl && !isUploadingAvatar && (
            <label
              htmlFor="avatarFileInput"
              className="absolute inset-0 cursor-pointer rounded-full"
              title="প্রোফাইল ছবি নির্বাচন করুন"
            />
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          প্রোফাইল ছবি (ঐচ্ছিক)
        </p>
      </div>

      {/* Full Name Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="fullName"
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground"
        >
          <User className="size-3.5 text-primary" />
          আপনার সম্পূর্ণ নাম <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            id="fullName"
            type="text"
            placeholder="যেমন: আরিফুল ইসলাম"
            autoComplete="name"
            disabled={isSubmitting}
            {...register("fullName")}
            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-2xs transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:opacity-60 ${
              errors.fullName
                ? "border-destructive focus-visible:ring-destructive/30"
                : "border-border hover:border-border/80"
            }`}
          />
        </div>
        {errors.fullName && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.fullName.message}</span>
          </p>
        )}
      </div>

      {/* Email Field */}
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
            autoComplete="email"
            disabled={isSubmitting}
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

      {/* Phone Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="phone"
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground"
        >
          <Phone className="size-3.5 text-primary" />
          মোবাইল নম্বর <span className="text-destructive">*</span>
        </label>
        <div className="relative flex rounded-xl border border-border bg-background shadow-2xs transition-all duration-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-ring">
          <span className="flex items-center gap-1 rounded-l-xl border-r border-border bg-muted/40 px-3 text-xs font-medium text-muted-foreground select-none">
            <span
              className="text-sm leading-none"
              role="img"
              aria-label="Bangladesh Flag"
            >
              🇧🇩
            </span>
            <span className="font-mono text-xs">+88</span>
          </span>
          <input
            id="phone"
            type="tel"
            placeholder="017XXXXXXXX"
            autoComplete="tel"
            disabled={isSubmitting}
            {...register("phone")}
            className={`w-full bg-transparent px-3 py-2.5 font-mono text-sm tracking-tight text-foreground placeholder:text-muted-foreground focus:outline-hidden tabular-nums disabled:opacity-60 ${
              errors.phone ? "text-destructive" : ""
            }`}
          />
        </div>
        {errors.phone && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.phone.message}</span>
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground"
        >
          <Lock className="size-3.5 text-primary" />
          পাসওয়ার্ড <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="কমপক্ষে ৮ অক্ষরের শক্তিশালী পাসওয়ার্ড"
            autoComplete="new-password"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground focus:outline-hidden transition-colors cursor-pointer"
            aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          কমপক্ষে ৮ অক্ষর, বড় হাতের (A-Z), ছোট হাতের (a-z) অক্ষর ও সংখ্যা (0-9)
          থাকতে হবে
        </p>
        {errors.password && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.password.message}</span>
          </p>
        )}
      </div>

      {/* Terms & Conditions Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            disabled={isSubmitting}
            {...register("agreeTerms")}
            className="mt-0.5 size-4 rounded-sm border-border text-primary focus:ring-primary focus:ring-offset-background accent-primary cursor-pointer transition-colors"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            আমি SellDesk এর{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-medium text-primary hover:underline"
            >
              শর্তাবলী
            </a>{" "}
            এবং{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-medium text-primary hover:underline"
            >
              গোপনীয়তা নীতি
            </a>{" "}
            মেনে নিচ্ছি।
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{errors.agreeTerms.message}</span>
          </p>
        )}
      </div>

      {/* Primary CTA Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>একাউন্ট তৈরি করুন 🚀</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      {/* Trust Guarantee Note */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5 text-primary" />
        <span>আপনার সমস্ত তথ্য সম্পূর্ণ এনক্রিপ্টেড এবং নিরাপদ</span>
      </div>
    </form>
  );
}
