// ==================== ORDER TYPES ====================

// helper (projede bir kere tanımlaman yeterli)
export type EnumLike<T extends Record<string, string>> =
  T[keyof T];

// ==================== ORDER STATUS ====================
export const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  FAILED: "failed",
} as const;

export type OrderStatus =
  EnumLike<typeof OrderStatus>;

// ==================== ORDER TYPE ====================
export const OrderType = {
  DIGITAL: "digital",
  PHYSICAL: "physical",
  MIXED: "mixed",
  SUBSCRIPTION: "subscription",
} as const;

export type OrderType =
  EnumLike<typeof OrderType>;

// ==================== PAYMENT METHOD ====================
export const PaymentMethod = {
  CREDIT_CARD: "credit_card",
  BANK_TRANSFER: "bank_transfer",
  PAYPAL: "paypal",
  STRIPE: "stripe",
  APPLE_PAY: "apple_pay",
  GOOGLE_PAY: "google_pay",
  CASH_ON_DELIVERY: "cash_on_delivery",
} as const;

export type PaymentMethod =
  EnumLike<typeof PaymentMethod>;

// ==================== FULFILLMENT STATUS ====================
export const FulfillmentStatus = {
  UNFULFILLED: "unfulfilled",
  PARTIALLY_FULFILLED: "partially_fulfilled",
  FULFILLED: "fulfilled",
  DELIVERED: "delivered",
  RETURNED: "returned",
} as const;

export type FulfillmentStatus =
  EnumLike<typeof FulfillmentStatus>;


// ==================== ADDRESS INTERFACES ====================

export interface Address {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  postal_code: string;
  phone?: string;
  company?: string;
  is_default?: boolean;
}

export interface BillingAddress extends Address {
  tax_id?: string;
  vat_number?: string;
}

export interface ShippingAddress extends Address {
  delivery_instructions?: string;
  access_code?: string;
  safe_place?: string;
}

// ==================== ORDER ITEM INTERFACES ====================

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  product_type: string;
  variant_id?: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  tax_amount: number;
  tax_rate: number;
  discount_amount: number;
  image_url?: string;
  sku?: string;
  is_digital: boolean;
  download_url?: string;
  download_expires_at?: string;
  download_count: number;
  download_limit: number;
  fulfilled_quantity: number;
  refunded_quantity: number;
  notes?: string;
}

export interface OrderItemFulfillment {
  item_id: string;
  quantity: number;
  tracking_number?: string;
  carrier?: string;
  shipped_at?: string;
  delivered_at?: string;
}

// ==================== STATUS LOG INTERFACES ====================

export interface OrderStatusLog {
  id: string;
  order_id: string;
  old_status: OrderStatus;
  new_status: OrderStatus;
  notes?: string;
  changed_by?: string;
  created_at: string;
}

// ==================== PAYMENT INTERFACES ====================

export interface PaymentDetails {
  payment_intent_id?: string;
  charge_id?: string;
  customer_id?: string;
  receipt_url?: string;
  payment_method_details?: Record<string, unknown>;
  captured: boolean;
  capture_method: string;
  setup_future_usage?: string;
}

// ==================== ORDER REQUEST TYPES ====================

export interface OrderBaseRequest {
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  customer_notes?: string;
  billing_address: BillingAddress;
  shipping_same_as_billing: boolean;
  shipping_address?: ShippingAddress;
  payment_method: PaymentMethod;
}

export interface OrderCreateRequest extends OrderBaseRequest {
  cart_id: string;
  save_billing_address?: boolean;
  save_shipping_address?: boolean;
  accept_terms?: boolean;
  marketing_consent?: boolean;
}

export interface OrderUpdateRequest {
  status?: OrderStatus;
  fulfillment_status?: FulfillmentStatus;
  shipping_method?: string;
  tracking_number?: string;
  estimated_delivery_date?: string;
  fulfillment_notes?: string;
  digital_delivered?: boolean;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  notes?: string;
  notify_customer?: boolean;
}

export interface OrderRefundRequest {
  refund_amount: number;
  refund_reason: string;
  notify_customer?: boolean;
  refund_shipping?: boolean;
  restock_items?: boolean;
}

export interface OrderFulfillmentRequest {
  items: Array<{
    item_id: string;
    quantity: number;
  }>;
  tracking_number?: string;
  shipping_provider?: string;
  estimated_delivery_date?: string;
  notes?: string;
  notify_customer?: boolean;
}

export interface OrderDeliveryConfirmation {
  delivered_at: string;
  delivery_notes?: string;
  customer_signature?: string;
  delivery_proof?: Array<Record<string, unknown>>;
}

export interface OrderBulkActionRequest {
  order_ids: string[];
  action: 'fulfill' | 'ship' | 'complete' | 'cancel' | 'refund' | 'update_status' | 'export_labels';
  data?: Record<string, unknown>;
  reason?: string;
  notify_customers?: boolean;
}

export interface OrderExportRequest {
  format: 'csv' | 'json' | 'excel';
  fields?: string[];
  filters?: Record<string, unknown>;
  include_items?: boolean;
  include_customer?: boolean;
  include_payment?: boolean;
}

// ==================== ORDER SEARCH PARAMS ====================

export interface OrderSearchParams {
  search?: string;
  shop_id?: string;
  customer_email?: string;
  status?: OrderStatus;
  order_type?: OrderType;
  payment_status?: string;
  fulfillment_status?: FulfillmentStatus;
  payment_method?: PaymentMethod;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  has_digital?: boolean;
  has_physical?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'order_total' | 'customer_name';
  sort_order?: 'asc' | 'desc';
}

// ==================== ORDER RESPONSE TYPES ====================

export interface OrderResponse {
  id: string;
  order_number: string;
  shop_id: string;
  buyer_id?: string;
  cart_id?: string;
  
  // Status
  status: OrderStatus;
  order_type: OrderType;
  fulfillment_status: FulfillmentStatus;
  
  // Customer info
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  customer_notes?: string;
  
  // Addresses
  billing_address: BillingAddress;
  shipping_address: ShippingAddress;
  shipping_same_as_billing: boolean;
  
  // Pricing
  items_subtotal: number;
  discount_total: number;
  tax_total: number;
  shipping_total: number;
  platform_fee: number;
  seller_payout: number;
  order_total: number;
  currency: string;
  
  // Discount
  coupon_code?: string;
  coupon_type?: string;
  coupon_value?: number;
  
  // Payment
  payment_method?: PaymentMethod;
  payment_status: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  stripe_customer_id?: string;
  paid_at?: string;
  payment_due_date?: string;
  
  // Shipping
  requires_shipping: boolean;
  shipping_method?: string;
  shipping_provider?: string;
  tracking_number?: string;
  estimated_delivery_date?: string;
  
  // Fulfillment
  fulfillment_notes?: string;
  digital_delivered: boolean;
  digital_delivered_at?: string;
  
  // Refund
  refund_reason?: string;
  refund_amount: number;
  refunded_at?: string;
  
  // Risk & Fraud
  fraud_score: number;
  fraud_checked: boolean;
  fraud_checked_at?: string;
  high_risk: boolean;
  manual_review_required: boolean;
  
  // Metadata
  metadata: Record<string, unknown>;
  
  // Email status
  email_confirmation_sent: boolean;
  email_confirmation_sent_at?: string;
  email_shipping_sent: boolean;
  email_shipping_sent_at?: string;
  email_delivered_sent: boolean;
  email_delivered_sent_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  
  // Items
  items: OrderItem[];
  item_count: number;
  
  // Status logs
  status_logs: OrderStatusLog[];
  
  // Helper properties (computed on frontend)
  is_paid: boolean;
  is_completed: boolean;
  is_cancelled: boolean;
  is_refunded: boolean;
  is_refundable: boolean;
  days_since_creation: number;
  payment_overdue: boolean;
  risk_level: string;
  net_amount: number;
}

export interface OrderCustomer extends OrderResponse {
  shop_name?: string;
  shop_slug?: string;
  shop_logo_url?: string;
  shop_is_verified: boolean;
  
  // Customer-specific info
  can_cancel: boolean;
  cancel_deadline?: string;
  can_request_refund: boolean;
  refund_deadline?: string;
  can_download_digital: boolean;
  download_urls?: Array<{
    name: string;
    url: string;
    expires_at?: string;
    download_count: number;
    download_limit: number;
  }>;
  can_review: boolean;
  review_deadline?: string;
  has_reviewed: boolean;
}

export interface OrderSeller extends OrderResponse {
  buyer_email: string;
  buyer_name?: string;
  buyer_has_account: boolean;
  buyer_account_id?: string;
  buyer_total_orders: number;
  buyer_is_verified: boolean;
  
  // Seller-specific info
  can_fulfill: boolean;
  can_ship: boolean;
  can_mark_delivered: boolean;
  can_cancel: boolean;
  can_refund: boolean;
  can_update_tracking: boolean;
  
  // Financial info
  payout_status: string;
  payout_amount?: number;
  payout_date?: string;
  payout_method?: string;
  
  // Shop info
  shop_currency: string;
  shop_timezone: string;
  shop_notification_email?: string;
  shop_support_email?: string;
}

export interface OrderAdmin extends OrderResponse {
  shop_name: string;
  shop_owner_id: string;
  shop_owner_email: string;
  shop_status: string;
  buyer_full_name?: string;
  buyer_created_at?: string;
  buyer_last_order_at?: string;
  
  // Admin-specific info
  can_modify: boolean;
  can_force_refund: boolean;
  can_view_payment_details: boolean;
  can_view_fraud_details: boolean;
  fraud_details?: Record<string, unknown>;
  payment_details?: PaymentDetails;
  
  // Platform info
  platform_fee_percentage: number;
  platform_fee_fixed: number;
  tax_collected: number;
  tax_rate: number;
}

// ==================== ORDER STATISTICS TYPES ====================

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  conversion_rate: number;
  
  // Status breakdown
  status_counts: Record<OrderStatus, number>;
  
  // Payment breakdown
  payment_method_counts: Record<PaymentMethod, number>;
  
  // Time-based stats
  daily_stats: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  
  monthly_stats: Array<{
    month: string;
    orders: number;
    revenue: number;
    growth: number;
  }>;
  
  // Top products
  top_products: Array<{
    product_id: string;
    product_name: string;
    quantity_sold: number;
    revenue: number;
  }>;
  
  // Customer stats
  repeat_customers: number;
  new_customers: number;
  top_customers: Array<{
    customer_id: string;
    customer_email: string;
    customer_name?: string;
    order_count: number;
    total_spent: number;
  }>;
}

export interface ShopOrderStats extends OrderStats {
  shop_id: string;
  shop_name: string;
  fulfillment_stats: {
    average_fulfillment_time: number;
    on_time_delivery_rate: number;
    return_rate: number;
  };
  refund_stats: {
    refund_count: number;
    refund_rate: number;
    average_refund_amount: number;
  };
}

// ==================== PAGINATION & RESPONSE TYPES ====================

export interface PaginatedOrders<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export type PaginatedOrderResponses = PaginatedOrders<OrderResponse>;
export type PaginatedOrderCustomers = PaginatedOrders<OrderCustomer>;
export type PaginatedOrderSellers = PaginatedOrders<OrderSeller>;
export type PaginatedOrderAdmins = PaginatedOrders<OrderAdmin>;

export interface OrderApiResponse<T = OrderResponse> {
  success: boolean;
  data: T;
  message?: string;
}

export interface OrdersApiResponse<T = OrderResponse> {
  success: boolean;
  data: PaginatedOrders<T>;
  message?: string;
}

export interface OrderStatsResponse {
  success: boolean;
  data: OrderStats | ShopOrderStats;
  message?: string;
}

// ==================== EXPORT & IMPORT TYPES ====================

export interface OrderExportData {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  download_url?: string;
  estimated_completion_time?: string;
  created_at: string;
  completed_at?: string;
}

export interface OrderImportData {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  total_records: number;
  processed_records: number;
  successful_records: number;
  failed_records: number;
  errors?: string[];
  created_at: string;
  completed_at?: string;
}

// ==================== NOTIFICATION TYPES ====================

export interface OrderNotification {
  id: string;
  order_id: string;
  order_number: string;
  type: 'status_change' | 'payment_received' | 'shipped' | 'delivered' | 'refund' | 'review_reminder';
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// ==================== HELPER TYPES ====================

export interface OrderTimelineEvent {
  id: string;
  type: 'order_created' | 'payment_received' | 'status_changed' | 'item_fulfilled' | 'shipped' | 'delivered' | 'refund_issued';
  title: string;
  description?: string;
  timestamp: string;
  user_id?: string;
  user_name?: string;
  metadata?: Record<string, unknown>;
}

export interface OrderSummary {
  order_id: string;
  order_number: string;
  shop_id: string;
  shop_name: string;
  customer_email: string;
  customer_name?: string;
  status: OrderStatus;
  order_total: number;
  currency: string;
  item_count: number;
  created_at: string;
  requires_shipping: boolean;
  is_paid: boolean;
  is_digital: boolean;
  is_physical: boolean;
}