// types/cart.types.ts

// Önce BaseTypes'ı tanımlayalım
export interface BaseSchema {
  id: string;
}

export interface TimestampSchema extends BaseSchema {
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse {
  items: unknown[];
  total: number;
  page: number;
  pages: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

// ==================== ENUMS ====================

// ==================== CART TYPES ====================

// helper (bir kere tanımlıysa tekrar yazmana gerek yok)
export type EnumLike<T extends Record<string, string>> =
  T[keyof T];

// ==================== CART STATUS ====================
export const CartStatus = {
  ACTIVE: 'active',
  ABANDONED: 'abandoned',
  CONVERTED: 'converted',
  EXPIRED: 'expired',
} as const;

export type CartStatus =
  EnumLike<typeof CartStatus>;

// ==================== CART CURRENCY ====================
export const CartCurrency = {
  USD: 'USD',
  EUR: 'EUR',
  TRY: 'TRY',
  GBP: 'GBP',
} as const;

export type CartCurrency =
  EnumLike<typeof CartCurrency>;

// ==================== CART ITEM TYPES ====================

export interface CartItemBase {
  product_id: string;
  variant_id?: string;
  quantity: number;
  variant_options?: Record<string, unknown>;
}

export type CartItemCreate = CartItemBase;

export interface CartItemUpdate {
  quantity: number;
}

export interface CartItemResponse extends TimestampSchema {
  id: string;
  cart_id: string;
  product_id: string;
  shop_id: string;
  variant_id?: string;
  
  // Product details (snapshot)
  product_name: string;
  product_slug: string;
  product_image_url?: string;
  product_type: 'digital' | 'physical';
  
  // Variant details
  variant_name?: string;
  variant_options: Record<string, unknown>;
  
  // Pricing (snapshot)
  unit_price: number;
  compare_at_price?: number;
  currency: CartCurrency;
  
  // Quantity
  quantity: number;
  max_quantity?: number;
  
  // Digital product info
  is_digital: boolean;
  download_available: boolean;
  
  // Inventory info
  in_stock: boolean;
  stock_quantity?: number;
  
  // Calculated fields
  line_total: number;
  
  // Helper properties (client-side)
  has_variant: boolean;
  is_available: boolean;
  discount_amount?: number;
  discount_percentage?: number;
}

// ==================== CART TYPES ====================

export interface CartBase {
  currency?: CartCurrency;
  coupon_code?: string;
  shipping_method?: string;
  shipping_address?: Record<string, unknown>;
}

export interface CartCreate {
  currency?: CartCurrency;
  coupon_code?: string;
  shipping_method?: string;
  shipping_address?: Record<string, unknown>;
  session_id?: string;
  user_id?: string;
}

export interface CartUpdate extends CartBase {
  coupon_code?: string;
  shipping_method?: string;
  shipping_address?: Record<string, unknown>;
}

export interface CartResponse extends TimestampSchema {
  id: string;
  cart_token: string;
  user_id?: string;
  session_id?: string;
  status: CartStatus;
  
  // Pricing
  subtotal: number;
  discount_total: number;
  tax_total: number;
  shipping_total: number;
  total: number;
  currency: CartCurrency;
  
  // Discounts
  coupon_code?: string;
  coupon_type?: string;
  coupon_value?: number;
  
  // Shipping
  shipping_method?: string;
  shipping_address?: Record<string, unknown>;
  requires_shipping: boolean;
  
  // Items
  items: CartItemResponse[];
  item_count: number;
  
  // Shop info
  shop_ids: string[];
  shop_count: number;
  
  // Product type info
  has_digital_items: boolean;
  has_physical_items: boolean;
  
  // Abandoned cart tracking
  abandoned_email_sent: boolean;
  abandoned_email_sent_at?: string;
  recovery_token?: string;
  
  // Timestamps
  last_activity_at: string;
  expires_at: string;
  converted_to_order_at?: string;
  
  // Helper properties (client-side)
  is_guest_cart: boolean;
  is_user_cart: boolean;
  is_expired: boolean;
  is_abandoned: boolean;
  discount_percentage?: number;
}

// ==================== CART ACTION TYPES ====================

export interface CartMergeRequest {
  session_cart_token: string;
  user_cart_token?: string;
}

export interface CartApplyCoupon {
  coupon_code: string;
}

export interface CartShippingUpdate {
  shipping_method: string;
  shipping_address: Record<string, unknown>;
}

export interface CartItemAdd {
  product_id: string;
  variant_id?: string;
  quantity: number;
  variant_options?: Record<string, unknown>;
}

export interface CartEstimateRequest {
  items: CartItemCreate[];
  coupon_code?: string;
  shipping_method?: string;
  shipping_address?: Record<string, unknown>;
}

export interface CartEstimateItem {
  product_id: string;
  item_total: number;
  tax_amount: number;
}

export interface CartEstimateResponse {
  subtotal: number;
  discount_total: number;
  tax_total: number;
  shipping_total: number;
  total: number;
  currency: CartCurrency;
  discount_percentage?: number;
  tax_rate: number;
  shipping_estimate?: Record<string, unknown>;
  items: CartEstimateItem[];
}

export interface CartCheckoutPreview {
  cart_id: string;
  payment_method: 'stripe' | 'paypal' | 'bank_transfer';
  save_payment_method: boolean;
  billing_address?: Record<string, unknown>;
  shipping_same_as_billing: boolean;
}

export interface CartRecoveryRequest {
  recovery_token: string;
  email?: string;
}

export interface CartBulkUpdate {
  cart_ids: string[];
  action: 'abandon' | 'recover' | 'expire' | 'convert';
  reason?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Type alias - daha temiz
export type CartApiResponse = ApiResponse<CartResponse>;
export type CartItemApiResponse = ApiResponse<CartItemResponse>;
export type CartEstimateApiResponse = ApiResponse<CartEstimateResponse>;
export type CartPreviewApiResponse = ApiResponse<CartPreviewData>;
export type CartBulkActionResponse = ApiResponse<CartBulkActionData>;

export interface CartPreviewData {
  cart: CartResponse;
  checkout_url: string;
  payment_intent?: string;
  requires_action?: boolean;
}

export interface PaginatedCartsResponse extends PaginatedResponse {
  items: CartResponse[];
}

export interface BulkActionResult {
  cart_id: string;
  cart_token: string;
  success: boolean;
  message?: string;
  error?: string;
}

export interface CartBulkActionData {
  action: string;
  total_carts: number;
  processed: number;
  successful: number;
  failed: number;
  results: BulkActionResult[];
}


// ==================== ERROR TYPES ====================

export interface CartError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

export interface CartValidationError {
  errors: CartError[];
  cart_id?: string;
  cart_token?: string;
}

// ==================== CLIENT-SIDE STATE TYPES ====================

export interface CartState {
  cart: CartResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  isSyncing: boolean;
  isCheckingOut: boolean;
}

export interface CartItemAddParams extends CartItemCreate {
  shop_id?: string;
  product_name?: string;
  unit_price?: number;
}

export interface CartItemUpdateParams {
  item_id: string;
  quantity: number;
}

export interface CartItemRemoveParams {
  item_id: string;
  cart_id?: string;
}

export interface CartCouponParams {
  coupon_code: string;
  cart_id?: string;
}

export interface CartShippingParams {
  shipping_method: string;
  shipping_address: Record<string, unknown>;
  cart_id?: string;
}

export interface CartCheckoutParams {
  cart_id: string;
  payment_method: 'stripe' | 'paypal' | 'bank_transfer';
  save_payment_method?: boolean;
  billing_address?: Record<string, unknown>;
  shipping_same_as_billing?: boolean;
  success_url: string;
  cancel_url: string;
}

// ==================== HOOK PARAMETER TYPES ====================

export interface UseCartOptions {
  autoSync?: boolean;
  syncInterval?: number;
  persistToLocalStorage?: boolean;
  localStorageKey?: string;
}

export interface UseCartItemOptions {
  optimisticUpdate?: boolean;
  showNotifications?: boolean;
}

export interface UseCartCheckoutOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  onRedirect?: (url: string) => void;
}

// ==================== EVENT TYPES ====================

export type CartEventType = 
  | 'item_added'
  | 'item_updated'
  | 'item_removed'
  | 'coupon_applied'
  | 'coupon_removed'
  | 'shipping_updated'
  | 'cart_merged'
  | 'cart_cleared'
  | 'checkout_started'
  | 'checkout_completed'
  | 'checkout_failed';

export interface CartEvent {
  type: CartEventType;
  cart_id: string;
  cart_token: string;
  timestamp: string;
  data: Record<string, unknown>;
  user_id?: string;
}

export interface CartAnalyticsEvent extends CartEvent {
  analytics_id: string;
  session_id: string;
  device_info: Record<string, unknown>;
  utm_params?: Record<string, unknown>;
}

// ==================== QUERY FILTER TYPES ====================

export interface CartFilters {
  status?: CartStatus;
  shop_id?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  has_digital?: boolean;
  has_physical?: boolean;
  min_total?: number;
  max_total?: number;
}

export interface CartSearchParams extends CartFilters {
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ==================== STATISTICS TYPES ====================

export interface DailyCartStat {
  date: string;
  carts_created: number;
  carts_converted: number;
  carts_abandoned: number;
  revenue: number;
}

export interface CartStats {
  period: string;
  total_carts: number;
  active_carts: number;
  abandoned_carts: number;
  converted_carts: number;
  conversion_rate: number;
  average_cart_value: number;
  total_revenue: number;
  recovered_revenue: number;
  abandoned_revenue: number;
  daily_stats: DailyCartStat[];
}

export interface ShopCartStats extends CartStats {
  shop_id: string;
  shop_name: string;
  shop_slug: string;
}

// ==================== MUTATION RESULT TYPES ====================

export interface CartItemMutationResult {
  item: CartItemResponse;
  cart: CartResponse;
  operation: 'add' | 'update' | 'remove';
  success: boolean;
  message: string;
}

export interface CartCouponMutationResult {
  cart: CartResponse;
  coupon_applied: boolean;
  discount_amount: number;
  discount_percentage?: number;
  message: string;
}

export interface CartShippingMutationResult {
  cart: CartResponse;
  shipping_updated: boolean;
  shipping_cost: number;
  shipping_method: string;
  estimated_delivery?: string;
  message: string;
}

export interface CartCheckoutMutationResult {
  cart: CartResponse;
  checkout_url: string;
  payment_intent_id?: string;
  requires_action?: boolean;
  success: boolean;
  order_id?: string;
  message: string;
}

// ==================== HOOK RETURN TYPES ====================

export interface UseCartReturn {
  // State
  cart: CartResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  
  // Cart operations
  addItem: (params: CartItemAddParams) => Promise<CartItemMutationResult>;
  updateItem: (params: CartItemUpdateParams) => Promise<CartItemMutationResult>;
  removeItem: (params: CartItemRemoveParams) => Promise<CartItemMutationResult>;
  clearCart: () => Promise<CartResponse>;
  syncCart: () => Promise<CartResponse>;
  
  // Coupon operations
  applyCoupon: (params: CartCouponParams) => Promise<CartCouponMutationResult>;
  removeCoupon: () => Promise<CartCouponMutationResult>;
  
  // Shipping operations
  updateShipping: (params: CartShippingParams) => Promise<CartShippingMutationResult>;
  
  // Checkout
  startCheckout: (params: CartCheckoutParams) => Promise<CartCheckoutMutationResult>;
  
  // Helpers
  itemCount: number;
  cartTotal: number;
  hasDigitalItems: boolean;
  hasPhysicalItems: boolean;
  isGuestCart: boolean;
  isExpired: boolean;
  
  // Refetch
  refetch: () => void;
}

// ==================== LOCAL STORAGE TYPES ====================

export interface LocalCartItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  added_at: string;
}

export interface LocalCartStorage {
  cart_id: string;
  cart_token: string;
  items: LocalCartItem[];
  last_updated: string;
  expires_at: string;
}