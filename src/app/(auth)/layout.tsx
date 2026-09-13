import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { cn } from "@/lib/utils";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});

export const metadata: Metadata = {
  title: "অ্যাকাউন্ট রেজিস্ট্রেশন ও সাইন-আপ | SellDesk",
  description:
    "SellDesk এ ১০ দিনের ফ্রি ট্রায়াল সহ আপনার নিজস্ব অনলাইন স্টোর শুরু করুন। কোনো ক্রেডিট কার্ডের প্রয়োজন নেই।",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground font-bengali antialiased",
        hindSiliguri.variable,
      )}
    >
      {children}
    </div>
  );
}
