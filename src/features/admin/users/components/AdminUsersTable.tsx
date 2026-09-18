"use client";

import React, { useState, useMemo, useCallback } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useAdminUsers } from "../hooks/use-admin-users";
import { useAdminUserActions } from "../hooks/use-admin-user-actions";
import { getUserColumns } from "./admin-user-columns";
import { AdminUsersToolbar } from "./AdminUsersToolbar";
import { AdminUsersPagination } from "./AdminUsersPagination";
import { AdminUsersModals } from "./AdminUsersModals";
import type { AdminUserItem } from "../types/admin-users.types";

export function AdminUsersTable() {
  const currentUser = useAuthStore((state) => state.user);
  const {
    users,
    meta,
    isLoading,
    isFetching,
    isSearching,
    refetch,
    query,
    searchInput,
    setSearchInput,
    handleImmediateSearch,
    handleClearSearch,
    setRole,
    setPage,
    setLimit,
    toggleSort,
  } = useAdminUsers();

  const {
    createStaffAsync,
    isCreatingStaff,
    updateRoleAsync,
    isUpdatingRole,
    updateStatus,
    deleteUserAsync,
    isDeletingUser,
  } = useAdminUserActions();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [roleUser, setRoleUser] = useState<AdminUserItem | null>(null);
  const [detailsUser, setDetailsUser] = useState<AdminUserItem | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUserItem | null>(null);

  const handleToggleStatus = useCallback(
    (user: AdminUserItem) => {
      updateStatus({ id: user.id, isActive: !user.isActive });
    },
    [updateStatus],
  );

  const columns = useMemo(
    () =>
      getUserColumns({
        currentUserId: currentUser?.id,
        onViewDetails: (user) => setDetailsUser(user),
        onChangeRole: (user) => setRoleUser(user),
        onToggleStatus: handleToggleStatus,
        onDelete: (user) => setDeleteUser(user),
      }),
    [currentUser?.id, handleToggleStatus],
  );

  const totalUsers = meta?.total ?? users.length;

  return (
    <div className="space-y-4">
      {/* Title & Stats */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold text-admin-text tracking-tight">
          Users &amp; Staff
        </h1>
        <p className="text-[13px] text-admin-text-soft mt-0.5">
          {totalUsers.toLocaleString()} users across the SellDesk ecosystem
        </p>
      </div>

      {/* Main Table Card */}
      <div className="bg-admin-surface border border-admin-line rounded-[18px] shadow-2xs overflow-hidden">
        <AdminUsersToolbar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onClearSearch={handleClearSearch}
          onSubmitSearch={handleImmediateSearch}
          isSearching={isSearching}
          roleFilter={query.role || "all"}
          onRoleChange={setRole}
          onRefresh={refetch}
          isRefreshing={isFetching}
          onOpenCreateStaff={() => setIsCreateOpen(true)}
        />

        <DataTable
          data={users}
          columns={columns}
          keyExtractor={(row) => row.id}
          isLoading={isLoading}
          loadingRowsCount={query.limit || 10}
          emptyMessage="No users found matching current filters."
          sortBy={query.sortBy}
          sortOrder={query.sortOrder}
          onSortChange={(colId) =>
            toggleSort(colId as "name" | "email" | "createdAt")
          }
        />

        <AdminUsersPagination
          meta={meta}
          rowsPerPage={query.limit || 10}
          onRowsPerPageChange={setLimit}
          onPageChange={setPage}
        />
      </div>

      {/* Modals & Dialogs */}
      <AdminUsersModals
        isCreateOpen={isCreateOpen}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCreateStaff={createStaffAsync}
        isCreatingStaff={isCreatingStaff}
        roleUser={roleUser}
        onCloseRole={() => setRoleUser(null)}
        onUpdateRole={async (role) => {
          if (roleUser) {
            await updateRoleAsync({ id: roleUser.id, role });
          }
        }}
        isUpdatingRole={isUpdatingRole}
        detailsUser={detailsUser}
        onCloseDetails={() => setDetailsUser(null)}
        deleteUser={deleteUser}
        onCloseDelete={() => setDeleteUser(null)}
        onConfirmDelete={async () => {
          if (deleteUser) {
            await deleteUserAsync(deleteUser.id);
          }
        }}
        isDeletingUser={isDeletingUser}
      />
    </div>
  );
}
