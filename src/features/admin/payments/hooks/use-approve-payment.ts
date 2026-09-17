"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveOrRejectSubscriptionPayment } from "../api/payments.api";
import type { ApprovePaymentDTO } from "../types/payment.types";

export function useApprovePayment() {
  const queryClient = useQueryClient();

  const invalidatePayments = () => {
    queryClient.invalidateQueries({
      queryKey: ["admin", "subscriptions", "payments"],
    });
  };

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApprovePaymentDTO }) =>
      approveOrRejectSubscriptionPayment(id, payload),
    onSuccess: (_, variables) => {
      invalidatePayments();
      const action =
        variables.payload.status === "APPROVED" ? "approved" : "rejected";
      toast.success(`Payment has been successfully ${action}`);
    },
    onError: (err: unknown) => {
      const message =
        (err as Error)?.message || "Failed to process payment status update";
      toast.error(message);
    },
  });

  return {
    approveOrReject: mutation.mutateAsync,
    isProcessing: mutation.isPending,
  };
}
