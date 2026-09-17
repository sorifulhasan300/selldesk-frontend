"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAdminPlan, updateAdminPlan } from "../api/billing.api";
import type { CreatePlanDTO, UpdatePlanDTO } from "../types/billing.types";

export function usePlanMutations() {
  const queryClient = useQueryClient();

  const invalidatePlans = () => {
    queryClient.invalidateQueries({
      queryKey: ["admin", "subscriptions", "plans"],
    });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreatePlanDTO) => createAdminPlan(payload),
    onSuccess: (data) => {
      invalidatePlans();
      toast.success(`Plan "${data.name}" created successfully`);
    },
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || "Failed to create plan");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlanDTO }) =>
      updateAdminPlan(id, payload),
    onSuccess: (data) => {
      invalidatePlans();
      toast.success(`Plan "${data.name}" updated successfully`);
    },
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || "Failed to update plan");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateAdminPlan(id, { isActive }),
    onSuccess: (data) => {
      invalidatePlans();
      const statusText = data.isActive ? "activated" : "deactivated";
      toast.success(`Plan "${data.name}" ${statusText}`);
    },
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || "Failed to update plan status");
    },
  });

  return {
    createPlan: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updatePlan: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    togglePlanStatus: toggleStatusMutation.mutateAsync,
    isTogglingStatus: toggleStatusMutation.isPending,
  };
}
