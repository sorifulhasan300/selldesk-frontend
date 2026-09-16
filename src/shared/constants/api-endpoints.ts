/**
 * API Endpoints Configuration for SellDesk
 * Centralized endpoint map contracts matching the NestJS backend routes.
 */

export const AUTH = {
  /**
   * Register/signup a new user account (Primary: /stores/auth/signup, Fallback: /auth/signup)
   */
  REGISTER: "/stores/auth/signup",
  SIGNUP: "/stores/auth/signup",
  FALLBACK_SIGNUP: "/auth/signup",

  /**
   * User login with credentials (Primary: /stores/auth/login, Fallback: /auth/login)
   */
  LOGIN: "/stores/auth/login",
  FALLBACK_LOGIN: "/auth/login",

  /**
   * Revoke active refresh token & session
   * POST /api/v1/auth/logout
   */
  LOGOUT: "/auth/logout",

  /**
   * Fetch current authenticated user profile
   * GET /api/v1/auth/me
   */
  ME: "/auth/me",

  /**
   * Exchange refresh token for new access tokens
   * POST /api/v1/auth/refresh
   */
  REFRESH: "/auth/refresh",

  /**
   * Verify email address with 6-digit OTP
   * POST /api/v1/auth/verify-email
   */
  VERIFY_EMAIL: "/auth/verify-email",

  /**
   * Resend verification OTP to user email
   * POST /api/v1/auth/resend-otp
   */
  RESEND_OTP: "/auth/resend-otp",
} as const;

export const TENANTS = {
  /**
   * Provision a new store/tenant workspace
   * POST /api/v1/stores
   */
  CREATE: "/stores",

  /**
   * Check if a tenant subdomain is available
   * GET /api/v1/stores/check-subdomain?subdomain=:subdomain
   */
  CHECK_SUBDOMAIN: "/stores/check-subdomain",

  /**
   * Retrieve all stores owned or managed by current authenticated user
   * GET /api/v1/stores/my-stores
   */
  GET_MY_TENANT: "/stores/my-stores",

  /**
   * Switch active store context
   * POST /api/v1/stores/switch/:storeId
   */
  SWITCH: (storeId: string) => `/stores/switch/${storeId}`,

  /**
   * Retrieve specific store details by ID
   * GET /api/v1/stores/:storeId
   */
  GET_BY_ID: (storeId: string) => `/stores/${storeId}`,

  /**
   * Update store settings / details
   * PATCH /api/v1/stores/:storeId
   */
  UPDATE: (storeId: string) => `/stores/${storeId}`,

  /**
   * Dedicated media update endpoint for store logo and banner assets
   * PATCH /api/v1/stores/:storeId/media
   */
  UPDATE_MEDIA: (storeId: string) => `/stores/${storeId}/media`,

  /**
   * Delete store workspace
   * DELETE /api/v1/stores/:storeId
   */
  DELETE: (storeId: string) => `/stores/${storeId}`,
} as const;

export const UPLOAD = {
  /**
   * Upload single image file to Cloudinary tenant folder
   * POST /api/v1/upload/single?folder=:folder
   */
  SINGLE: (folder?: string) =>
    folder
      ? `/upload/single?folder=${encodeURIComponent(folder)}`
      : "/upload/single",

  /**
   * Upload public image (e.g. user avatar during registration)
   * POST /api/v1/upload/public?folder=:folder
   */
  PUBLIC: (folder?: string) =>
    folder
      ? `/upload/public?folder=${encodeURIComponent(folder)}`
      : "/upload/public",

  /**
   * Upload multiple image files
   * POST /api/v1/upload/multiple?folder=:folder
   */
  MULTIPLE: (folder?: string) =>
    folder
      ? `/upload/multiple?folder=${encodeURIComponent(folder)}`
      : "/upload/multiple",
} as const;

export const SUBSCRIPTIONS = {
  /**
   * List all active SaaS subscription plans
   * GET /api/v1/subscriptions/plans
   */
  PLANS: "/subscriptions/plans",

  /**
   * Get current active subscription
   * GET /api/v1/subscriptions/current
   */
  CURRENT: "/subscriptions/current",
} as const;

export const ADMIN = {
  ANALYTICS: {
    /**
     * Super Admin Dashboard Overview KPIs, charts & recent stores
     * GET /api/v1/admin/analytics/overview?timeframe=week|month|year
     */
    OVERVIEW: (timeframe?: "week" | "month" | "year") =>
      timeframe
        ? `/admin/analytics/overview?timeframe=${timeframe}`
        : "/admin/analytics/overview",
  },
  STORES: {
    /**
     * Super Admin Stores list with pagination, search, status, plan, sorting
     * GET /api/v1/admin/stores
     */
    LIST: "/admin/stores",
    STATUS: (id: string) => `/admin/stores/${id}/status`,
    EXTEND_TRIAL: (id: string) => `/admin/stores/${id}/extend-trial`,
    SWITCH: (id: string) => `/admin/stores/${id}/switch`,
  },
} as const;

/**
 * Combined API Endpoints map
 */
export const API_ENDPOINTS = {
  AUTH,
  TENANTS,
  UPLOAD,
  SUBSCRIPTIONS,
  ADMIN,
} as const;

export default API_ENDPOINTS;
