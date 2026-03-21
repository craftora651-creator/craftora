// ==================== PAYMENT PROVIDER ====================

export const PaymentProvider = {
  STRIPE: 'stripe',
  CRAFTPAY: 'craftpay',
  BANK_TRANSFER: 'bank_transfer',
  TEST: 'test'
} as const;

export type PaymentProvider =
  typeof PaymentProvider[keyof typeof PaymentProvider];


// ==================== PAYMENT METHOD ====================

export const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  CRYPTOCURRENCY: 'cryptocurrency',
  MANUAL: 'manual'
} as const;

export type PaymentMethod =
  typeof PaymentMethod[keyof typeof PaymentMethod];


// ==================== PAYMENT STATUS ====================

export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled',
  REFUNDED: 'refunded',
  REQUIRES_ACTION: 'requires_action',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_CAPTURE: 'requires_capture'
} as const;

export type PaymentStatus =
  typeof PaymentStatus[keyof typeof PaymentStatus];


// ==================== SUBSCRIPTION PLAN ====================

export const SubscriptionPlan = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  PREMIUM: 'premium',
  BUSINESS: 'business',
  ENTERPRISE: 'enterprise'
} as const;

export type SubscriptionPlan =
  typeof SubscriptionPlan[keyof typeof SubscriptionPlan];


// ==================== BILLING PERIOD ====================

export const BillingPeriod = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime'
} as const;

export type BillingPeriod =
  typeof BillingPeriod[keyof typeof BillingPeriod];


// ==================== CURRENCY ====================

export const Currency = {
  TRY: 'TRY',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP'
} as const;

export type Currency =
  typeof Currency[keyof typeof Currency];


// ==================== WEBHOOK EVENT TYPE ====================

export const WebhookEventType = {
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_FAILED: 'payment_intent.failed',
  CHARGE_SUCCEEDED: 'charge.succeeded',
  CHARGE_FAILED: 'charge.failed',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_DELETED: 'subscription.deleted',
  CUSTOMER_CREATED: 'customer.created',
  INVOICE_PAID: 'invoice.paid',
  TEST: 'test'
} as const;

export type WebhookEventType =
  typeof WebhookEventType[keyof typeof WebhookEventType];

// ==================== INTERFACES ====================

// Core Payment Types
export interface PaymentCard {
  number: string;
  exp_month: number;
  exp_year: number;
  cvc: string;
  card_holder: string;
  brand?: string;
  last4?: string;
  country?: string;
}

export interface PaymentAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}

// Payment Intent (Stripe/Payment Gateway)
export interface PaymentIntent {
  id: string;
  client_secret?: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  payment_method?: PaymentMethod;
  payment_method_id?: string;
  customer_id?: string;
  customer_email?: string;
  customer_name?: string;
  description?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  last_payment_error?: string;
  invoice_id?: string;
  subscription_id?: string;
  billing_address?: PaymentAddress;
  receipt_url?: string;
}

// Charge (Completed Payment)
export interface PaymentCharge {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  payment_intent_id: string;
  customer_id: string;
  customer_email: string;
  description?: string;
  fee?: number;
  net_amount?: number;
  receipt_url?: string;
  statement_descriptor?: string;
  created_at: string;
  paid_at?: string;
  refunded_at?: string;
  metadata: Record<string, unknown>;
}

// Subscription Plan Details
export interface SubscriptionPlanDetails {
  id: string;
  name: SubscriptionPlan;
  display_name: string;
  description: string;
  price: number;
  price_formatted: string;
  currency: Currency;
  period: BillingPeriod;
  features: string[];
  max_uploads?: number;
  max_file_size?: number;
  api_access: boolean;
  priority_support: boolean;
  custom_domain: boolean;
  analytics: boolean;
  is_popular?: boolean;
  is_featured?: boolean;
  trial_days?: number;
  monthly_price?: number; // Yıllık plan için aylık breakdown
  yearly_discount?: number; // Yıllık indirim yüzdesi
}

// User Subscription
export interface UserSubscription {
  user_id: string;
  subscription_id: string;
  plan: SubscriptionPlan;
  billing_period: BillingPeriod;
  status: 'active' | 'expired' | 'canceled' | 'pending' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  auto_renew: boolean;
  payment_method?: PaymentMethod;
  last_payment_date?: string;
  next_payment_date?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Invoice
export interface Invoice {
  id: string;
  user_id: string;
  subscription_id?: string;
  payment_intent_id?: string;
  number: string;
  amount: number;
  currency: Currency;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  billing_period?: {
    start: string;
    end: string;
  };
  items: InvoiceItem[];
  tax?: number;
  discount?: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  invoice_pdf_url?: string;
  hosted_invoice_url?: string;
  created_at: string;
  due_date?: string;
  paid_at?: string;
  metadata?: Record<string, unknown>;
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
  unit_price: number;
  tax_rate?: number;
}

// Bank Info (Havale/EFT için)
export interface BankInfo {
  bank_name: string;
  account_name: string;
  iban: string;
  account_number: string;
  branch?: string;
  currency: Currency;
  qr_code_url?: string;
  reference_code?: string;
  instructions?: string;
  swift_code?: string;
  bank_logo_url?: string;
}

// Payment Webhook
export interface PaymentWebhook {
  id: string;
  event_id: string;
  event_type: WebhookEventType;
  source: PaymentProvider;
  data: Record<string, unknown>;
  processed: boolean;
  error?: string;
  received_at: string;
  processed_at?: string;
  raw_body?: string;
  signature?: string;
}

// Payment Config
export interface PaymentConfig {
  mode: 'test' | 'production';
  provider: PaymentProvider;
  has_secret_key: boolean;
  has_webhook: boolean;
  db_connected: boolean;
  supported_methods: PaymentMethod[];
  default_currency: Currency;
  test_mode: boolean;
  stripe_connected?: boolean;
  craftpay_mock?: boolean;
  bank_info?: BankInfo;
}

// Payment Health
export interface PaymentHealth {
  service: string;
  status: 'healthy' | 'warning' | 'unhealthy';
  config: PaymentConfig;
  message?: string;
  timestamp: string;
}

// Payment Stats
export interface PaymentStats {
  total_payments: number;
  total_revenue: number;
  today_payments: number;
  today_revenue: number;
  monthly_revenue: number;
  yearly_revenue: number;
  by_plan: Record<SubscriptionPlan, number>;
  by_status: Record<PaymentStatus, number>;
  by_method: Record<PaymentMethod, number>;
  by_currency: Record<Currency, number>;
  active_subscriptions: number;
  expiring_soon: number;
  recent_payments: PaymentCharge[];
  top_customers: Array<{
    customer_id: string;
    customer_email: string;
    total_spent: number;
    payment_count: number;
  }>;
}

// Payment Request/Response Types
export interface CreatePaymentIntentRequest {
  user_id: string;
  amount: number;
  currency: Currency;
  description: string;
  payment_method: PaymentMethod;
  customer_email: string;
  customer_name?: string;
  billing_address?: PaymentAddress;
  metadata?: Record<string, unknown>;
  return_url?: string;
  save_payment_method?: boolean;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  message: string;
  payment_intent: PaymentIntent;
  client_secret?: string;
  requires_action?: boolean;
  payment_method_types?: string[];
  next_action?: {
    type: string;
    url?: string;
  };
}

export interface ConfirmPaymentRequest {
  payment_intent_id: string;
  payment_method?: PaymentMethod;
  payment_method_id?: string;
  card?: PaymentCard;
  return_url?: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  message: string;
  payment_intent: PaymentIntent;
  charge?: PaymentCharge;
  receipt_url?: string;
  invoice_url?: string;
}

export interface GetPaymentStatusResponse {
  success: boolean;
  payment_intent: PaymentIntent;
  charge?: PaymentCharge;
  subscription?: UserSubscription;
  invoice?: Invoice;
}

export interface CreateSubscriptionRequest {
  user_id: string;
  plan_id: SubscriptionPlan;
  billing_period: BillingPeriod;
  payment_method: PaymentMethod;
  card?: PaymentCard;
  trial_days?: number;
  coupon_code?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateSubscriptionResponse {
  success: boolean;
  message: string;
  subscription: UserSubscription;
  payment_intent?: PaymentIntent;
  invoice?: Invoice;
  requires_action?: boolean;
  client_secret?: string;
}

export interface CancelSubscriptionRequest {
  subscription_id: string;
  cancel_at_period_end?: boolean;
  reason?: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  subscription: UserSubscription;
  canceled_at: string;
  will_end_at: string;
}

export interface UpdateSubscriptionRequest {
  subscription_id: string;
  plan_id?: SubscriptionPlan;
  billing_period?: BillingPeriod;
  payment_method?: PaymentMethod;
  card?: PaymentCard;
  metadata?: Record<string, unknown>;
}

// Webhook Types
export interface StripeWebhookData {
  id: string;
  type: WebhookEventType;
  data: {
    object: Record<string, unknown>;
  };
  created: number;
  livemode: boolean;
  api_version?: string;
  request?: {
    id?: string;
    idempotency_key?: string;
  };
}

export interface TestWebhookRequest {
  event_type: WebhookEventType;
  data?: Record<string, unknown>;
  user_id?: string;
  amount?: number;
  currency?: Currency;
}

export interface TestWebhookResponse {
  success: boolean;
  message: string;
  test_data: StripeWebhookData;
}

// Bank Transfer
export interface BankTransferRequest {
  user_id: string;
  amount: number;
  currency: Currency;
  description: string;
  receipt_image_url?: string;
  transaction_date: string;
  reference_number: string;
}

export interface BankTransferResponse {
  success: boolean;
  message: string;
  payment_intent: PaymentIntent;
  bank_info: BankInfo;
  instructions: string;
}

// Payment List/Filter
export interface PaymentListParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
  currency?: Currency;
  date_from?: string;
  date_to?: string;
  user_id?: string;
  search?: string;
}

export interface PaginatedPayments {
  payments: PaymentCharge[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Customer
export interface PaymentCustomer {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: PaymentAddress;
  payment_methods?: Array<{
    id: string;
    type: PaymentMethod;
    card?: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
    created_at: string;
  }>;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Coupon/Discount
export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  currency?: Currency;
  max_redemptions?: number;
  times_redeemed: number;
  valid_from: string;
  valid_until?: string;
  active: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Payment Link
export interface PaymentLink {
  id: string;
  url: string;
  amount: number;
  currency: Currency;
  description: string;
  metadata?: Record<string, unknown>;
  active: boolean;
  visits: number;
  conversions: number;
  created_at: string;
  expires_at?: string;
}

// ==================== UTILITY TYPES ====================
export interface PaymentFormData {
  card_number: string;
  card_expiry: string; // MM/YY
  card_cvc: string;
  card_holder: string;
  save_card: boolean;
  billing_address?: PaymentAddress;
}

export interface PaymentUIState {
  loading: boolean;
  processing: boolean;
  error: string | null;
  success: boolean;
  requires_action: boolean;
  action_url?: string;
  payment_intent?: PaymentIntent;
  subscription?: UserSubscription;
}

// Test Card Data
export const TEST_CARDS: Record<string, PaymentCard> = {
  visa_success: {
    number: '4242424242424242',
    exp_month: 12,
    exp_year: 2026,
    cvc: '123',
    card_holder: 'Test User',
    brand: 'visa'
  },
  mastercard_success: {
    number: '5555555555554444',
    exp_month: 12,
    exp_year: 2026,
    cvc: '123',
    card_holder: 'Test User',
    brand: 'mastercard'
  },
  amex_success: {
    number: '378282246310005',
    exp_month: 12,
    exp_year: 2026,
    cvc: '1234',
    card_holder: 'Test User',
    brand: 'amex'
  },
  failure: {
    number: '4000000000000002',
    exp_month: 12,
    exp_year: 2026,
    cvc: '123',
    card_holder: 'Test User',
    brand: 'visa'
  },
  requires_3ds: {
    number: '4000002500003155',
    exp_month: 12,
    exp_year: 2026,
    cvc: '123',
    card_holder: 'Test User',
    brand: 'visa'
  }
};

// Subscription Plan Features
export const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
  [SubscriptionPlan.FREE]: [
    '3 Mağaza',
    '50 Ürün',
    'Temel tema',
    'Email desteği',
    'Temel raporlar'
  ],
  [SubscriptionPlan.BASIC]: [
    '10 Mağaza',
    '500 Ürün',
    'Gelişmiş tema',
    'Öncelikli destek',
    'Detaylı raporlar',
    'Promosyon kuponları'
  ],
  [SubscriptionPlan.PRO]: [
    '50 Mağaza',
    '5000 Ürün',
    'Özel tema',
    '7/24 destek',
    'Gelişmiş analitik',
    'API erişimi',
    'Toplu ürün yükleme'
  ],
  [SubscriptionPlan.PREMIUM]: [
    'Sınırsız Mağaza',
    'Sınırsız Ürün',
    'Özel tasarım',
    'Dedike destek',
    'Kurumsal analitik',
    'Gelişmiş API',
    'Özel entegrasyonlar',
    'Özel eğitim'
  ],
  [SubscriptionPlan.BUSINESS]: [
    'Tüm Pro özellikler',
    'Öncelikli geliştirme',
    'Özel çözümler',
    'Dedike hesap yöneticisi',
    'Beyaz etiket çözümü'
  ],
  [SubscriptionPlan.ENTERPRISE]: [
    'Tüm Premium özellikler',
    'Kurumsal SLA',
    'Özel geliştirme',
    'On-premise kurulum',
    'Özel güvenlik'
  ]
};

// Currency Symbols
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.TRY]: '₺',
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£'
};

// Format currency
export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbol = CURRENCY_SYMBOLS[currency];
  
  if (currency === Currency.TRY) {
    // Turkish Lira format: ₺9,99
    return `${symbol}${(amount / 100).toFixed(2).replace('.', ',')}`;
  } else {
    // Other currencies: $9.99
    return `${symbol}${(amount / 100).toFixed(2)}`;
  }
};

// Get plan display name
export const getPlanDisplayName = (plan: SubscriptionPlan): string => {
  const names: Record<SubscriptionPlan, string> = {
    [SubscriptionPlan.FREE]: 'Ücretsiz',
    [SubscriptionPlan.BASIC]: 'Başlangıç',
    [SubscriptionPlan.PRO]: 'Profesyonel',
    [SubscriptionPlan.PREMIUM]: 'Premium',
    [SubscriptionPlan.BUSINESS]: 'İşletme',
    [SubscriptionPlan.ENTERPRISE]: 'Kurumsal'
  };
  return names[plan] || plan;
};

// Check if payment requires 3DS
export const requires3DS = (paymentMethod: PaymentMethod): boolean => {
  return [
    PaymentMethod.CREDIT_CARD,
    PaymentMethod.DEBIT_CARD
  ].includes(paymentMethod);
};