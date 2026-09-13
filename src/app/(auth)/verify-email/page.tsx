import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterLayout, VerifyEmailForm } from "@/features/auth";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "ইমেইল ভেরিফিকেশন | SellDesk",
  description: "আপনার SellDesk অ্যাকাউন্ট সক্রিয় করতে ইমেইল ভেরিফাই করুন।",
};

function VerifyEmailFallback() {
  return (
    <div className="flex h-48 items-center justify-center">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <RegisterLayout>
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailForm />
      </Suspense>
    </RegisterLayout>
  );
}
