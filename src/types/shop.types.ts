export const ShopStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
} as const;
export type ShopStatus =
  typeof ShopStatus[keyof typeof ShopStatus];

export const SubscriptionStatus = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  PENDING: 'pending',
} as const;
export type SubscriptionStatus =
  typeof SubscriptionStatus[keyof typeof SubscriptionStatus];

export const ShopVisibility =  {
  PUBLIC : 'public',
  PRIVATE : 'private',
  UNLISTED : 'unlisted'
} as const;
export type ShopVisibility =
  typeof ShopVisibility[keyof typeof ShopVisibility];

export const ShopVerificationStatus = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;
export type ShopVerificationStatus =
  typeof ShopVerificationStatus[keyof typeof ShopVerificationStatus];


export const ShopPlan = {
  FREE : 'free',
  PRO : 'pro',
  ENTERPRISE : 'enterprise'
} as const;
export type ShopPlan =
  typeof ShopPlan[keyof typeof ShopPlan];

// ==================== COMMON ====================
export type Decimal = string | number;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: string;
  message: string;
  status_code: number;
  details?: Record<string, unknown>;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  [key: string]: unknown;
}

// ==================== CREATE/UPDATE TYPES ====================
// API'deki ShopCreate schema'sına göre
export interface ShopCreateRequest {
  shop_name: string;
  description: string | null;
  short_description?: string | null;
  slogan?: string | null;
  slug?: string;
  logo_url?: string | null;
  banner_url?: string | null;
  favicon_url?: string | null;
  theme_color?: string;
  accent_color?: string;
  primary_category: string;
  secondary_categories?: string[] | null;
  tags?: string[] | null;
  contact_email?: string | null;
  support_email?: string | null;
  phone?: string | null;
  website_url?: string | null;
  tax_number?: string | null;
  tax_office?: string | null;
}

// API'deki ShopUpdate schema'sına göre
export interface ShopUpdateRequest {
  description?: string | null;
  short_description?: string | null;
  slogan?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  favicon_url?: string | null;
  theme_color?: string;
  accent_color?: string;
  contact_email?: string | null;
  support_email?: string | null;
  phone?: string | null;
  website_url?: string | null;
  tax_number?: string | null;
  tax_office?: string | null;
  primary_category?: string | null;
  secondary_categories?: string[] | null;
  tags?: string[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  settings?: Record<string, unknown> | null;
}

// ==================== RESPONSE TYPES (Database Model'e göre) ====================
// Database model'deki tüm field'ları dahil edelim
export interface ShopResponse {
  // Core
  id: string;
  user_id: string;
  shop_name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  slogan: string | null;
  status: 'draft' | 'active' | 'suspended' | 'closed';
  // Visuals
  logo_url: string | null;
  banner_url: string | null;
  favicon_url: string | null;
  theme_color: string;
  accent_color: string;
  custom_css: string | null;
  
  // Subscription & Payment
  subscription_status: SubscriptionStatus;
  monthly_fee: Decimal;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  last_payment_date: string | null; // ISO string
  next_payment_due_date: string | null; // ISO string
  grace_period_end_date: string | null; // ISO string
  
  // Visibility & Status
  visibility: ShopVisibility;
  is_verified: boolean;
  is_featured: boolean;
  verification_requested_at: string | null; // ISO string
  verified_at: string | null; // ISO string
  
  // Contact
  contact_email: string | null;
  support_email: string | null;
  phone: string | null;
  website_url: string | null;
  
  // Business
  tax_number: string | null;
  tax_office: string | null;
  address: Record<string, unknown> | null;
  social_links: Record<string, unknown> | null;
  
  // Pause functionality
  is_paused: boolean;
  paused_at: string | null; // ISO string
  paused_until: string | null; // ISO string
  pause_reason: string | null;
  auto_resume_date: string | null; // ISO string
  
  // Statistics
  total_views: number;
  total_visitors: number;
  total_sales: number;
  total_revenue: Decimal;
  total_products: number;
  total_orders: number;
  average_rating: Decimal;
  review_count: number;
  
  // Category & Tags
  primary_category: string | null;
  secondary_categories: string[] | null;
  tags: string[] | null;
  
  // SEO
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  seo_friendly_url: string | null;
  
  // Settings & Analytics
  settings: Record<string, unknown>;
  analytics_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  
  // Timestamps
  created_at: string; // ISO string
  updated_at: string; // ISO string
  published_at: string | null; // ISO string
  last_sale_at: string | null; // ISO string
  last_restock_at: string | null; // ISO string
  
  // Computed properties (to_dict()'den geliyor)
  shop_plan?: ShopPlan;
  shop_status?: string; // 'active' | 'inactive' | 'suspended'
  is_active?: boolean;
  days_until_payment?: number | null;
  needs_payment?: boolean;
}

// API'deki ShopDetailResponse (GET /shops/{id}, GET /shops/public/{slug})
export interface ShopDetailResponse extends ShopResponse {
  // Ek field'lar buraya
  owner_name?: string | null;
  owner_email?: string | null;
  total_followers?: number;
  is_following?: boolean;
  rating_distribution?: Record<string, number>;
  product_categories?: string[];
  top_products?: Record<string, unknown>[];
  shipping_policies?: Record<string, unknown> | null;
  return_policy?: Record<string, unknown> | null;
  support_policy?: Record<string, unknown> | null;
}

// GET /shops/admin/list için
export interface ShopAdminResponse extends ShopResponse {
  // Admin-only fields
  owner_email?: string;
  suspension_reason?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  fraud_score?: number;
  manual_review_required?: boolean;
  review_notes?: string | null;
  is_platform_shop?: boolean;
}

// GET /shops/{id}/stats için
export interface ShopStats {
  shop_id: string;
  shop_name: string;
  status: string;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  created_at: string;
  published_at: string | null;
  is_approved: boolean;
  is_verified: boolean;
  plan?: string;
}

// GET /shops/{id}/settings için
export interface ShopSettingsResponse {
  shop_id: string;
  settings: Record<string, unknown>;
  metadata: Record<string, unknown>;
  plan?: string;
  subdomain?: string;
}

// ==================== REQUEST TYPES ====================
// GET /shops/public/list
export interface ShopSearchParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  category?: string;
  is_verified?: boolean;
}

// POST /shops/admin/{shopId}/suspend
export interface AdminSuspendRequest {
  reason: string;
}

// ==================== API RESPONSE WRAPPERS ====================
// For endpoints that return messages
export interface ShopMessageResponse {
  message: string;
  shop_id: string;
  shop_name: string;
  status?: string;
  [key: string]: unknown;
}

export interface ShopDeleteResponse extends ShopMessageResponse {
  status: 'closed';
}

export interface ShopPublishResponse extends ShopMessageResponse {
  status: 'active';
  is_approved: boolean;
}

export interface ShopSuspendResponse extends ShopMessageResponse {
  status: 'suspended';
  suspended_at: string;
}

export interface ShopActivateResponse extends ShopMessageResponse {
  status: 'active';
}

export interface ShopLogoUploadResponse {
  message: string;
  shop_id: string;
  logo_url: string;
  filename: string;
  content_type: string;
  size: number;
}

export interface ShopSettingsUpdateResponse {
  message: string;
  shop_id: string;
  settings: Record<string, unknown>;
}

export interface AdminApproveResponse extends ShopMessageResponse {
  approved_by: string;
  approved_at: string;
}

export interface AdminSuspendResponse extends ShopMessageResponse {
  suspended_by: string;
  suspended_at: string;
  reason: string;
}

// Public shop view (to_public_dict()'den)
export interface ShopPublic {
  id: string;
  shop_name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  slogan: string | null;
  logo_url: string | null;
  banner_url: string | null;
  theme_color: string;
  accent_color: string;
  is_verified: boolean;
  is_featured: boolean;
  contact_email: string | null;
  website_url: string | null;
  social_links: Record<string, unknown> | null;
  total_sales: number;
  total_products: number;
  average_rating: number;
  review_count: number;
  primary_category: string | null;
  secondary_categories: string[] | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  is_active: boolean;
}

// Minimal shop view (to_minimal_dict()'den)
export interface ShopMinimal {
  id: string;
  shop_name: string;
  slug: string;
  logo_url: string | null;
  is_verified: boolean;
  primary_category: string | null;
  average_rating: number;
  total_sales: number;
  is_active: boolean;
}