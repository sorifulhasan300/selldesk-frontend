"use client";

import { useState, useEffect, useCallback } from "react";
import { type PlanPackage } from "../types/plan.types";
import { fetchSubscriptionPlansAction } from "../actions/planActions";

export function useSubscriptionPlans(packageId?: string) {
  const [plans, setPlans] = useState<PlanPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanPackage | null>(null);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchSubscriptionPlansAction();
      if (res.success && res.plans.length > 0) {
        setPlans(res.plans);
        if (packageId) {
          const match = res.plans.find((p) => p.id === packageId);
          if (match) setSelectedPlan(match);
        }
      } else {
        setError(res.error || "No active subscription plans found.");
      }
    } catch {
      setError("Unable to load subscription plans.");
    } finally {
      setIsLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    let isCancelled = false;

    const execute = async () => {
      try {
        const res = await fetchSubscriptionPlansAction();
        if (isCancelled) return;
        if (res.success && res.plans.length > 0) {
          setPlans(res.plans);
          if (packageId) {
            const match = res.plans.find((p) => p.id === packageId);
            if (match) setSelectedPlan(match);
          }
        } else {
          setError(res.error || "No active subscription plans found.");
        }
      } catch {
        if (!isCancelled) setError("Unable to load subscription plans.");
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    execute();

    return () => {
      isCancelled = true;
    };
  }, [packageId]);

  return {
    plans,
    isLoading,
    error,
    selectedPlan,
    setSelectedPlan,
    reloadPlans: loadPlans,
  };
}
