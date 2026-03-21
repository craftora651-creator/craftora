// ==================== AUTH TYPES ====================

// TokenResponse - POST /auth/refresh response (sadece token'lar)
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;      // sadece ID
  email: string;        // sadece email
  role: string;         // sadece role
  is_verified: boolean;
  is_active: boolean;
  auth_provider: string;
}

// UserMinimal - Detaylı user bilgisi
export interface UserMinimal {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'seller' | 'admin';
  is_seller: boolean;
}

// AuthResponse - POST /auth/google, /auth/apple response (user object ile)
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserMinimal;      // ✅ Detaylı user object
  is_new_user: boolean;
}

// GoogleAuthRequest - POST /auth/google request
export interface GoogleAuthRequest {
  id_token: string;
  access_token?: string;
}

// AppleAuthRequest - POST /auth/apple request
export interface AppleAuthRequest {
  identity_token: string;
  authorization_code?: string;
  user?: Record<string, unknown>;
}

// LogoutRequest - POST /auth/logout request
export interface LogoutRequest {
  token?: string;
}

// RefreshTokenRequest - POST /auth/refresh request
export interface RefreshTokenRequest {
  refresh_token: string;
}