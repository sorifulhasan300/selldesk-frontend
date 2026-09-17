export interface AdminPlanItem {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  productLimit?: number | null;
  isUnlimitedProduct: boolean;
  staffLimit?: number | null;
  freeOrders: number;
  extraOrderRate: number;
  maxLandingPages: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    subscriptions?: number;
    stores?: number;
  };
}

export interface CreatePlanDTO {
  name: string;
  price: number;
  durationDays?: number;
  productLimit?: number;
  isUnlimitedProduct?: boolean;
  staffLimit?: number;
  freeOrders?: number;
  extraOrderRate?: number;
  maxLandingPages?: number;
  features?: string[];
}

export interface UpdatePlanDTO extends Partial<CreatePlanDTO> {
  isActive?: boolean;
}

export interface ExtendTrialDTO {
  days: number;
  reason?: string;
}

export type PlanStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export interface PlanFilterState {
  search: string;
  status: PlanStatusFilter;
  sortBy: string;
  sortOrder: "asc" | "desc";
}
