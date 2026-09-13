import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Setup & Onboarding | SellDesk",
  description: "Create and launch your online store in 3 simple steps.",
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">{children}</div>
  );
}
