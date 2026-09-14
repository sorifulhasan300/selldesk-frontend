import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterLayout, RegisterForm } from "@/features/auth";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Your Account | SellDesk",
  description:
    "Create your SellDesk account to launch your online store with your selected plan.",
};

function RegisterFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="size-6 animate-spin text-[#7C5CFC]" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <RegisterLayout>
      <Suspense fallback={<RegisterFallback />}>
        <RegisterForm />
      </Suspense>
    </RegisterLayout>
  );
}
