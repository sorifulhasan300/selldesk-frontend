"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/api/errors";
import {
  createAdminStaff,
  updateAdminUserRole,
  updateAdminUserStatus,
  deleteAdminUser,
} from "../api/admin-users.api";
import type {
  AdminUserRole,
  CreateAdminStaffDTO,
} from "../types/admin-users.types";

export function useAdminUserActions() {
  const queryClient = useQueryClient();

  const createStaffMutation = useMutation({
    mutationFn: (payload: CreateAdminStaffDTO) => createAdminStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Central staff member created successfully");
    },
    onError: (err: unknown) => {
      toast.error(
        getApiErrorMessage(err, "Failed to create central staff member"),
      );
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: AdminUserRole }) =>
      updateAdminUserRole(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User role updated successfully");
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, "Failed to update user role"));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateAdminUserStatus(id, { isActive }),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success(
        isActive
          ? "User account activated successfully"
          : "User account suspended successfully",
      );
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, "Failed to update account status"));
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User account deleted successfully");
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, "Failed to delete user account"));
    },
  });

  return {
    createStaff: createStaffMutation.mutate,
    createStaffAsync: createStaffMutation.mutateAsync,
    isCreatingStaff: createStaffMutation.isPending,

    updateRole: updateRoleMutation.mutate,
    updateRoleAsync: updateRoleMutation.mutateAsync,
    isUpdatingRole: updateRoleMutation.isPending,

    updateStatus: updateStatusMutation.mutate,
    updateStatusAsync: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,

    deleteUser: deleteUserMutation.mutate,
    deleteUserAsync: deleteUserMutation.mutateAsync,
    isDeletingUser: deleteUserMutation.isPending,
  };
}
