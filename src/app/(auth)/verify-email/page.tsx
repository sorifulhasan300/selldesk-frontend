import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterLayout, VerifyEmailForm } from "@/features/auth";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email | SellDesk",
  description: "Verify your email address to activate your SellDesk account.",
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
