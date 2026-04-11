// types/user.types.ts
export interface UserBase {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  auth_provider: 'google' | 'apple' | 'email';
  role: 'user' | 'seller' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  created_at: string; // ISO string - ❗ NULL DEĞİL!
}

export interface UserResponse extends UserBase {
  phone_number: string | null;
  is_apple_user: boolean;
  is_google_user: boolean;
  email_verified: boolean;
  seller_since: string | null;
  shop_count: number;
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
  seller_verified: boolean;
  updated_at: string;
  last_login_at: string | null;
  last_active_at: string | null;
  verified_at: string | null;
  preferences: Record<string, unknown>;
  business_name?: string | null;
  tax_id?: string | null;
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
  is_seller: boolean;
  is_admin: boolean;
  display_name: string;
  account_age_days: number;
  shop_id?: string | null;
}

export interface UserPublic {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_seller: boolean;
  seller_since: string | null;
  shop_count: number;
  created_at: string;
  last_active_at: string | null;
}

export interface UserUpdateRequest {
  // Model ile UYUMLU alanlar:
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;  // ✅ phone değil, phone_number!
  
  // Diğer alanlar (SQL'de yoksa ekleme):
  bio?: string;
  website?: string;
  location?: string;
  
  // Preferences
  language?: string;
  timezone?: string;
  currency?: string;
  
  // Notifications
  email_notifications?: boolean;
  push_notifications?: boolean;
  marketing_emails?: boolean;
}

// UserResponse - status alanını kaldır (is_active var zaten)
export interface UserResponse extends UserBase {
  phone_number: string | null;
  is_apple_user: boolean;
  is_google_user: boolean;
  email_verified: boolean;
  // status kaldırıldı ❌
  seller_since: string | null;
  shop_count: number;
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
  seller_verified: boolean;
  updated_at: string;
  last_login_at: string | null;
  last_active_at: string | null;
  verified_at: string | null;
  preferences: Record<string, unknown>;
  business_name?: string | null;
  tax_id?: string | null;
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
  is_seller: boolean;
  is_admin: boolean;
  display_name: string;
  account_age_days: number;
  shop_id?: string | null;
}

export interface UserAdminResponse extends UserResponse {
  login_attempts: number;
  locked_until: string | null;
  two_factor_enabled: boolean;
  google_id: string | null;
  apple_id: string | null;
  apple_private_email: string | null;
  is_apple_provided_email: boolean;
  user_metadata: Record<string, unknown>;  // ✅ düzeltildi
  // created_by_ip ve last_ip_address - yoksa kaldır
}

export interface UserStats {
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  favorite_categories: string[];
  last_order_date: string | null;
  order_count_30d: number;
  spent_30d: number;
}