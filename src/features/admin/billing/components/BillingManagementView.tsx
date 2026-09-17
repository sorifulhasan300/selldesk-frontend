"use client";

import React, { useState, useCallback } from "react";
import { useAdminPlans } from "../hooks/use-admin-plans";
import { usePlanMutations } from "../hooks/use-plan-mutations";
import { BillingKpiCards } from "./BillingKpiCards";
import { BillingPlansToolbar } from "./BillingPlansToolbar";
import { BillingPlansTable } from "./BillingPlansTable";
import { PlanFormModal } from "./PlanFormModal";
import { ExtendTrialModal } from "./ExtendTrialModal";
import type {
  AdminPlanItem,
  CreatePlanDTO,
  UpdatePlanDTO,
} from "../types/billing.types";

export function BillingManagementView() {
  const {
    plans,
    allPlans,
    isLoading,
    isFetching,
    refetch,
    searchInput,
    setSearchInput,
    isDebouncing,
    handleImmediateSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    toggleSort,
  } = useAdminPlans();

  const { createPlan, updatePlan, togglePlanStatus, isCreating, isUpdating } =
    usePlanMutations();

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<AdminPlanItem | null>(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);

  const handleOpenCreatePlan = () => {
    setPlanToEdit(null);
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = useCallback((plan: AdminPlanItem) => {
    setPlanToEdit(plan);
    setIsPlanModalOpen(true);
  }, []);

  const handleToggleStatus = useCallback(
    (plan: AdminPlanItem) => {
      togglePlanStatus({ id: plan.id, isActive: !plan.isActive });
    },
    [togglePlanStatus],
  );

  const handleSavePlan = async (payload: CreatePlanDTO | UpdatePlanDTO) => {
    if (planToEdit) {
      await updatePlan({
        id: planToEdit.id,
        payload: payload as UpdatePlanDTO,
      });
    } else {
      await createPlan(payload as CreatePlanDTO);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <div>
          <h1 className="text-2xl font-bold text-admin-text tracking-tight">
            Subscriptions & Plans
          </h1>
          <p className="text-[13px] text-admin-text-soft mt-0.5">
            Configure platform SaaS packages, pricing tiers, limits, and store
            trials
          </p>
        </div>
      </div>

      <BillingKpiCards plans={allPlans} isLoading={isLoading} />

      <BillingPlansToolbar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onImmediateSearch={handleImmediateSearch}
        onClearSearch={() => setSearchInput("")}
        isDebouncing={isDebouncing}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        onCreatePlan={handleOpenCreatePlan}
        onOpenExtendTrial={() => setIsExtendModalOpen(true)}
      />

      <BillingPlansTable
        plans={plans}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={toggleSort}
        onEditPlan={handleOpenEditPlan}
        onToggleStatus={handleToggleStatus}
      />

      <PlanFormModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        planToEdit={planToEdit}
        onSubmit={handleSavePlan}
        isSubmitting={isCreating || isUpdating}
      />

      <ExtendTrialModal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
      />
    </div>
  );
}
