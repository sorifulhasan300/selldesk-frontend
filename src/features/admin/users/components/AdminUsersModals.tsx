"use client";

import React from "react";
import { CreateStaffModal } from "./CreateStaffModal";
import { EditRoleModal } from "./EditRoleModal";
import { UserDetailsModal } from "./UserDetailsModal";
import { DeleteUserDialog } from "./DeleteUserDialog";
import type {
  AdminUserItem,
  AdminUserRole,
  CreateAdminStaffDTO,
} from "../types/admin-users.types";

export interface AdminUsersModalsProps {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  onCreateStaff: (data: CreateAdminStaffDTO) => Promise<unknown>;
  isCreatingStaff: boolean;

  roleUser: AdminUserItem | null;
  onCloseRole: () => void;
  onUpdateRole: (role: AdminUserRole) => Promise<unknown>;
  isUpdatingRole: boolean;

  detailsUser: AdminUserItem | null;
  onCloseDetails: () => void;

  deleteUser: AdminUserItem | null;
  onCloseDelete: () => void;
  onConfirmDelete: () => Promise<unknown>;
  isDeletingUser: boolean;
}

export function AdminUsersModals({
  isCreateOpen,
  onCloseCreate,
  onCreateStaff,
  isCreatingStaff,
  roleUser,
  onCloseRole,
  onUpdateRole,
  isUpdatingRole,
  detailsUser,
  onCloseDetails,
  deleteUser,
  onCloseDelete,
  onConfirmDelete,
  isDeletingUser,
}: AdminUsersModalsProps) {
  return (
    <>
      <CreateStaffModal
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        onSubmit={onCreateStaff}
        isSubmitting={isCreatingStaff}
      />

      <EditRoleModal
        isOpen={Boolean(roleUser)}
        onClose={onCloseRole}
        user={roleUser}
        onSubmit={onUpdateRole}
        isSubmitting={isUpdatingRole}
      />

      <UserDetailsModal
        isOpen={Boolean(detailsUser)}
        onClose={onCloseDetails}
        user={detailsUser}
      />

      <DeleteUserDialog
        isOpen={Boolean(deleteUser)}
        onClose={onCloseDelete}
        user={deleteUser}
        onConfirm={onConfirmDelete}
        isDeleting={isDeletingUser}
      />
    </>
  );
}
