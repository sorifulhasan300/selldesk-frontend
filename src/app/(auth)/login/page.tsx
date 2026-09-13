import type { Metadata } from "next";
import { LoginLayout, LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "লগইন করুন | SellDesk",
  description:
    "SellDesk এ নিরাপদে আপনার অ্যাকাউন্টে লগইন করুন এবং আপনার অনলাইন স্টোরের যাবতীয় সেলস, প্রোডাক্ট ও অর্ডার সহজে পরিচালনা করুন।",
};

export default function LoginPage() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}
