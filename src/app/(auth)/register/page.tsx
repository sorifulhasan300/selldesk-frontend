import type { Metadata } from "next";
import { RegisterLayout, RegisterForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Create Account | SellDesk",
  description:
    "Create your free SellDesk account and start your online store with a 10-day free trial.",
};

export default function RegisterPage() {
  return (
    <RegisterLayout>
      <RegisterForm />
    </RegisterLayout>
  );
}
