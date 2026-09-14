export interface BackendPlan {
  id: string;
  name: string;
  price: number;
  durationDays?: number;
  productLimit?: number | null;
  isUnlimitedProduct?: boolean;
  staffLimit?: number | null;
  freeOrders?: number;
  extraOrderRate?: number;
  maxLandingPages?: number;
  features?: string[] | string;
  isActive?: boolean;
}

export interface PlanPackage {
  id: string;
  name: string;
  badge?: string;
  price: number;
  priceDisplay: string;
  billingPeriod: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export const DEFAULT_PACKAGES: PlanPackage[] = [
  {
    id: "free-trial",
    name: "Free Trial",
    badge: "[ 14-DAY TRIAL ]",
    price: 0,
    priceDisplay: "Free",
    billingPeriod: "for 14 days",
    description:
      "Ideal for testing features and setting up your store catalog.",
    features: [
      "50 Products catalog limit",
      "2 Staff manager accounts",
      "Online storefront hosting",
      "Basic sales & order analytics",
      "Manual order intake & tracking",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    badge: "[ STARTER ]",
    price: 490,
    priceDisplay: "৳ 490",
    billingPeriod: "/ month",
    description: "Essential commerce toolkit for small growing businesses.",
    features: [
      "200 Products catalog limit",
      "3 Staff accounts",
      "POS cash register module",
      "Automated SMS order updates",
      "Coupons & promo code engine",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    badge: "[ POPULAR ]",
    price: 990,
    priceDisplay: "৳ 990",
    billingPeriod: "/ month",
    popular: true,
    description: "Full-scale commerce platform for high-volume retailers.",
    features: [
      "1,000 Products catalog limit",
      "10 Staff management seats",
      "Advanced revenue & inventory analytics",
      "Courier API integration (Pathao, Steadfast)",
      "Expense tracking & ledger bookkeeping",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: "[ ENTERPRISE ]",
    price: 2990,
    priceDisplay: "৳ 2,990",
    billingPeriod: "/ year",
    description: "Maximum capacity, custom domain, and dedicated support.",
    features: [
      "Unlimited products & categories",
      "50 Staff management seats",
      "Custom domain connection with SSL",
      "Priority merchant onboarding & SLA",
      "Dedicated account manager",
    ],
  },
];

const FEATURE_LABEL_MAP: Record<string, string> = {
  basic_analytics: "Basic sales & order analytics",
  advanced_analytics: "Advanced revenue & inventory analytics",
  online_store: "Online storefront hosting",
  manual_order_intake: "Manual order intake & tracking",
  pos_integration: "POS cash register module",
  sms_notifications: "Automated SMS order updates",
  coupons: "Coupons & promo code engine",
  expense_tracking: "Expense tracking & ledger bookkeeping",
  multi_staff_management: "Multi-staff permission management",
  custom_domain: "Custom domain connection with SSL",
  unlimited_products: "Unlimited products & catalog storage",
  priority_support: "Priority merchant onboarding & 24/7 SLA",
};

export function transformBackendPlanToPackage(plan: BackendPlan): PlanPackage {
  const isFree = plan.price === 0 || plan.name.toLowerCase().includes("trial");
  const isPro =
    plan.name.toLowerCase().includes("pro") ||
    plan.name.toLowerCase().includes("popular");
  const isEnterprise = plan.name.toLowerCase().includes("enterprise");
  const isStarter = plan.name.toLowerCase().includes("starter");

  let badge = `[ ${plan.name.toUpperCase()} ]`;
  if (isFree) badge = `[ ${plan.durationDays || 14}-DAY TRIAL ]`;
  else if (isPro) badge = "[ POPULAR ]";
  else if (isEnterprise) badge = "[ ENTERPRISE ]";
  else if (isStarter) badge = "[ STARTER ]";

  const priceDisplay = isFree
    ? "Free"
    : `৳ ${Number(plan.price).toLocaleString("en-BD")}`;
  const billingPeriod = isFree
    ? `for ${plan.durationDays || 14} days`
    : plan.durationDays && plan.durationDays >= 360
      ? "/ year"
      : "/ month";

  let description = "Standard commerce subscription package.";
  if (isFree)
    description =
      "Ideal for testing features and setting up your store catalog.";
  else if (isStarter)
    description = "Essential commerce toolkit for small growing businesses.";
  else if (isPro)
    description = "Full-scale commerce platform for high-volume retailers.";
  else if (isEnterprise)
    description = "Maximum capacity, custom domain, and dedicated support.";

  const featureList: string[] = [];
  if (plan.isUnlimitedProduct || plan.productLimit === null) {
    featureList.push("Unlimited products & categories");
  } else if (plan.productLimit) {
    featureList.push(
      `${plan.productLimit.toLocaleString()} Products catalog limit`,
    );
  }

  if (plan.staffLimit) {
    featureList.push(`${plan.staffLimit} Staff management seats`);
  }

  let rawFeatures: string[] = [];
  if (Array.isArray(plan.features)) {
    rawFeatures = plan.features;
  } else if (typeof plan.features === "string") {
    try {
      const parsed = JSON.parse(plan.features);
      if (Array.isArray(parsed)) rawFeatures = parsed;
    } catch {
      rawFeatures = plan.features
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  for (const feat of rawFeatures) {
    const cleanLabel = FEATURE_LABEL_MAP[feat] || feat.replace(/_/g, " ");
    if (
      !featureList.some((f) =>
        f.toLowerCase().includes(cleanLabel.toLowerCase()),
      )
    ) {
      featureList.push(cleanLabel);
    }
  }

  if (featureList.length === 0) {
    featureList.push("Online storefront hosting", "Standard order processing");
  }

  return {
    id: plan.id,
    name: plan.name,
    badge,
    price: plan.price,
    priceDisplay,
    billingPeriod,
    description,
    features: featureList,
    popular: isPro,
  };
}
