import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | SellDesk",
  description:
    "Launch your online store with a 10-day free trial on SellDesk. No credit card required.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {children}
    </div>
  );
}
