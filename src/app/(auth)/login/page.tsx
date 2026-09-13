import type { Metadata } from "next";
import { LoginLayout, LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign In | SellDesk",
  description:
    "Sign in securely to your SellDesk merchant account to manage sales, products, and orders.",
};

export default function LoginPage() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}
