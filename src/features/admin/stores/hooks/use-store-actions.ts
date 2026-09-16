"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  updateAdminStoreStatus,
  extendAdminStoreTrial,
  switchAdminStoreContext,
} from "../api/stores.api";
import { setClientStoreId } from "@/shared/lib/api/token";

export function useStoreActions() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateAdminStoreStatus(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
      toast.success(`Store status updated to ${status}`);
    },
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || "Failed to update store status");
    },
  });

  const extendTrialMutation = useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) =>
      extendAdminStoreTrial(id, days),
    onSuccess: (_, { days }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
      toast.success(`Trial period extended by ${days} days`);
    },
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || "Failed to extend trial period");
    },
  });

  const switchContextMutation = useMutation({
    mutationFn: (id: string) => switchAdminStoreContext(id),
    onSuccess: (_data: unknown, storeId: string) => {
      setClientStoreId(storeId);
      toast.success("Switched to store context successfully");
      router.push("/dashboard");
    },
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || "Failed to switch store context");
    },
  });

  return {
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    extendTrial: extendTrialMutation.mutate,
    isExtendingTrial: extendTrialMutation.isPending,
    switchContext: switchContextMutation.mutate,
    isSwitchingContext: switchContextMutation.isPending,
  };
}
