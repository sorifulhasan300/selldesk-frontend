export type SubscriptionPaymentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PaymentStatusFilter = "ALL" | SubscriptionPaymentStatus;

export interface SubscriptionPaymentPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  productLimit?: number | null;
  isUnlimitedProduct?: boolean;
  staffLimit?: number | null;
  freeOrders?: number;
  extraOrderRate?: number;
  maxLandingPages?: number;
  features?: string[];
  isActive?: boolean;
}

export interface SubscriptionPaymentStore {
  id: string;
  storeName: string;
  subDomain: string;
}

export interface SubscriptionPaymentApprover {
  id: string;
  name: string;
  email: string;
}

export interface SubscriptionPaymentItem {
  id: string;
  storeId: string;
  subscriptionId: string;
  planId: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string | null;
  status: SubscriptionPaymentStatus;
  note?: string | null;
  approvedByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
  plan: SubscriptionPaymentPlan;
  store: SubscriptionPaymentStore;
  approver?: SubscriptionPaymentApprover | null;
}

export interface ApprovePaymentDTO {
  status: SubscriptionPaymentStatus;
  note?: string;
}
