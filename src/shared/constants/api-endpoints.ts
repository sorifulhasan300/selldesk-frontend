/**
 * API Endpoints Configuration for SellDesk
 * Centralized endpoint map contracts matching the NestJS backend routes.
 */

export const AUTH = {
  /**
   * Register/signup a new user account
   * POST /api/v1/auth/signup
   */
  REGISTER: "/auth/signup",

  /**
   * Alias for REGISTER
   */
  SIGNUP: "/auth/signup",

  /**
   * User login with email/phone & password
   * POST /api/v1/auth/login
   */
  LOGIN: "/auth/login",

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
   * Delete store workspace
   * DELETE /api/v1/stores/:storeId
   */
  DELETE: (storeId: string) => `/stores/${storeId}`,
} as const;

/**
 * Combined API Endpoints map
 */
export const API_ENDPOINTS = {
  AUTH,
  TENANTS,
} as const;

export default API_ENDPOINTS;
