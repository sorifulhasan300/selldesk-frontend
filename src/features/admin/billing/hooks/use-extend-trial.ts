"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extendStoreTrial } from "../api/billing.api";
import type { ExtendTrialDTO } from "../types/billing.types";

export function useExtendTrial() {
  const queryClient = useQueryClient();

  const extendTrialMutation = useMutation({
    mutationFn: ({
      storeId,
      payload,
    }: {
      storeId: string;
      payload: ExtendTrialDTO;
    }) => extendStoreTrial(storeId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "subscriptions"] });
      toast.success(
        `Extended trial by ${variables.payload.days} days successfully`,
      );
    },
    onError: (err: unknown) => {
      toast.error((err as Error)?.message || "Failed to extend store trial");
    },
  });

  return {
    extendTrial: extendTrialMutation.mutateAsync,
    isExtending: extendTrialMutation.isPending,
  };
}
