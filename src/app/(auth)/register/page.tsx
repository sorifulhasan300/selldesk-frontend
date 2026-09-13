import type { Metadata } from "next";
import { RegisterLayout, RegisterForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "রেজিস্ট্রেশন করুন | SellDesk",
  description:
    "SellDesk এ বিনামূল্যে একাউন্ট খুলুন এবং ১০ দিনের ফ্রি ট্রায়াল সহ আপনার নিজস্ব অনলাইন স্টোর শুরু করুন।",
};

export default function RegisterPage() {
  return (
    <RegisterLayout>
      <RegisterForm />
    </RegisterLayout>
  );
}
