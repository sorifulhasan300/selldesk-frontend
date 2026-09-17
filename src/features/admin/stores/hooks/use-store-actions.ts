"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  updateAdminStoreStatus,
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
    switchContext: switchContextMutation.mutate,
    isSwitchingContext: switchContextMutation.isPending,
  };
}
