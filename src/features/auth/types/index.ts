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
