import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

// Public Landing Page Bengali Font: Optimized for zero layout shift (CLS = 0)
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});

export const metadata: Metadata = {
  title: "SellDesk - আধুনিক মাল্টি-টেন্যান্ট ইকমার্স প্ল্যাটফর্ম",
  description:
    "আপনার নিজস্ব ব্র্যান্ডের অনলাইন স্টোর তৈরি ও পরিচালনা করুন একটি শক্তিশালী প্ল্যাটফর্ম থেকেই।",
};

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "min-h-full flex flex-col font-bengali antialiased",
        hindSiliguri.variable,
      )}
    >
      <div className="flex min-h-screen flex-col">{children}</div>
    </div>
  );
}
