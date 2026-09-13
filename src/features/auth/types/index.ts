export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  isEmailVerified?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
  isAuthenticated: boolean;
  createdAt: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  tokens?: AuthTokens;
}

/**
 * Uploaded asset metadata returned from Cloudinary upload endpoints
 */
export interface UploadedAsset {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
}

/**
 * Standard Result contract for Next.js Server Actions
 */
export interface AuthActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  user?: AuthUser;
  token?: string;
  tokens?: AuthTokens;
  hasStore?: boolean;
  redirectTo?: string;
  requiresVerification?: boolean;
  email?: string;
  error?: string;
  errors?: Record<string, string[]>;
}
