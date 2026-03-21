// types/common.types.ts

// ==================== BASE TYPES ====================

// Temel API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp?: number;
}

// Paginated Response
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  message?: string;
}

// Error Response
export interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
  code?: string;
  status?: number;
}

// ==================== REQUEST CONFIG ====================

export interface RequestConfig {
  useCache?: boolean;
  cacheDuration?: number;
  skipAuth?: boolean;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

// ==================== CACHE ====================

export interface CacheItem {
  data: unknown;
  timestamp: number;
  expiresIn: number;
}

// ==================== USER BASE ====================

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'premium' | 'business' | 'pro';
  avatar?: string;
  created_at?: string;
}

// ==================== STATUS TYPES ====================

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export type EmailStatus = 'sent' | 'failed' | 'pending' | 'queued';

export type PaymentStatus = 
  | 'requires_payment_method' 
  | 'requires_confirmation' 
  | 'requires_action' 
  | 'processing' 
  | 'requires_capture' 
  | 'canceled' 
  | 'succeeded';

export type SubscriptionStatus = 'active' | 'expired' | 'canceled' | 'pending';

// ==================== UTILITY TYPES ====================

export interface Timestamps {
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface DateRange {
  start_date: string;
  end_date: string;
}

// ==================== ENUMS ====================

// ==================== EMAIL & SUBSCRIPTION TYPES ====================

// helper (projede zaten varsa tekrar yazma)
export type EnumLike<T extends Record<string, string>> =
  T[keyof T];

// ==================== EMAIL TEMPLATE ====================
export const EmailTemplate = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password_reset',
  INVOICE: 'invoice',
  NOTIFICATION: 'notification',
  CUSTOM: 'custom',
  TEST: 'test',
} as const;

export type EmailTemplate =
  EnumLike<typeof EmailTemplate>;

// ==================== SUBSCRIPTION PLAN ====================
export const SubscriptionPlan = {
  FREE: 'free',
  PREMIUM: 'premium',
  BUSINESS: 'business',
  PRO: 'pro',
} as const;

export type SubscriptionPlan =
  EnumLike<typeof SubscriptionPlan>;

// ==================== PERIOD ====================
export const Period = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export type Period =
  EnumLike<typeof Period>;

// ==================== CURRENCY ====================
export const Currency = {
  TRY: 'TRY',
  USD: 'USD',
  EUR: 'EUR',
} as const;

export type Currency =
  EnumLike<typeof Currency>;
