// types/analytics.types.ts

// ==================== PERIOD TYPES ====================
export type AnalyticsPeriod = '7d' | '30d' | '90d' | '12m' | '24m';

// ==================== DATE RANGE ====================
export interface DateRange {
  start_date: string;  // ISO format (2026-01-20T00:00:00Z)
  end_date: string;    // ISO format
  period: AnalyticsPeriod;
  days: number;        // Kaç günlük (7,30,90,365,730)
}

// ==================== DASHBOARD OVERVIEW ====================
export interface AnalyticsOverview {
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  avg_order_value: number;
  conversion_rate: number;
}

// ==================== DAILY SALES ====================
export interface DailySale {
  date: string;        // YYYY-MM-DD formatı
  orders: number;
  revenue: number;
}

// ==================== TOP PRODUCTS ====================
export interface TopProduct {
  product_id: string;
  product_name: string;
  quantity: number;
  revenue: number;
}

// ==================== TRAFFIC ====================
export interface TrafficSources {
  [source: string]: number;  // craftora: 10, instagram: 6, tiktok: 2, etc.
}

export interface TrafficDevices {
  mobile: number;
  desktop: number;
  tablet: number;
  [key: string]: number;     // future-proof için
}

export interface TrafficStats {
  total_visitors: number;
  unique_visitors: number;
  sources: TrafficSources;
  devices: TrafficDevices;
}

// ==================== RANKING ====================
export interface Ranking {
  world_rank: number;      // Dünya sıralaması
  total_shops: number;     // Toplam mağaza sayısı
  top_percent: number;     // % kaçlık dilimde
}

// ==================== DASHBOARD RESPONSE ====================
export interface DashboardResponse {
  shop_id: string;
  shop_name: string;
  period: AnalyticsPeriod;
  date_range: DateRange;
  overview: AnalyticsOverview;
  sales_by_day: DailySale[];
  top_products: TopProduct[];
  traffic: TrafficStats;
  ranking: Ranking;
}

// ==================== TRAFFIC SOURCES ====================
export interface TrafficSource {
  source: string;
  visits: number;
  unique_visitors: number;
}

export interface TrafficSourcesResponse {
  shop_id: string;
  period: AnalyticsPeriod;
  sources: TrafficSource[];
}

// ==================== RANKING RESPONSE ====================
export interface RankingResponse {
  shop_id: string;
  world_rank: number;
  total_shops: number;
  revenue: number;
  top_percent: number;
}

// ==================== TRACKING ====================
export interface TrackShopViewRequest {
  shop_id: string;
  session_id?: string;
  referrer_source?: string;
  referrer_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  device_type?: 'mobile' | 'desktop' | 'tablet' | string;
}

export interface TrackProductViewRequest {
  product_id: string;
  shop_id: string;
  session_id?: string;
}

export interface TrackingResponse {
  success: boolean;
  message: string;
}

// ==================== YEARLY COMPARISON (opsiyonel) ====================
export interface YearlyComparison {
  current_year: number;
  previous_year: number;
  revenue: {
    current: number;
    previous: number;
    growth_percentage: number;
  };
  orders: {
    current: number;
    previous: number;
    growth_percentage: number;
  };
  customers: {
    current: number;
    previous: number;
    growth_percentage: number;
  };
}

// ==================== EXPORT ALL ====================
