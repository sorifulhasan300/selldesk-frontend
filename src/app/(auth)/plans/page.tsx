import type { Metadata } from "next";
import { PlanSelectionView } from "@/features/plans";

export const metadata: Metadata = {
  title: "Choose Your Subscription Plan | SellDesk",
  description:
    "Select the best commerce subscription plan for your store. 14-day free trial, no credit card required.",
};

export default function PlansPage() {
  return <PlanSelectionView />;
}
