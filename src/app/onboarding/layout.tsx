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
  title: "স্টোর সেটআপ ও অনবোর্ডিং | SellDesk",
  description: "সহজ ৩টি ধাপে আপনার নিজস্ব অনলাইন স্টোর তৈরি ও শুরু করুন।",
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground",
        hindSiliguri.variable,
      )}
    >
      {children}
    </div>
  );
}
