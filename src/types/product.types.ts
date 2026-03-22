// ==================== PRODUCT TYPES ====================

// helper (istersen ayrı dosyaya da alabilirsin)
export type EnumLike<T extends Record<string, string>> =
  T[keyof T];

// ==================== PRODUCT STATUS ====================
export const ProductStatus = {
  DRAFT: "draft",
  PENDING: "pending",
  PUBLISHED: "published",
  SOLD_OUT: "sold_out",
  ARCHIVED: "archived",
  DELETED: "deleted",
} as const;

export type ProductStatus =
  EnumLike<typeof ProductStatus>;

// ==================== PRODUCT TYPE ====================
export const ProductType = {
  DIGITAL: "digital",
  PHYSICAL: "physical",
  SERVICE: "service",
} as const;

export type ProductType =
  EnumLike<typeof ProductType>;

// ==================== CURRENCY ====================
export const Currency = {
  USD: "USD",
  TRY: "TRY",
  EUR: "EUR",
  GBP: "GBP",
} as const;

export type Currency =
  EnumLike<typeof Currency>;

// ==================== FILE TYPE ====================
export const FileType = {
  PDF: "pdf",
  VIDEO: "video",
  AUDIO: "audio",
  ARCHIVE: "archive",
  IMAGE: "image",
  DOCUMENT: "document",
  SOFTWARE: "software",
  OTHER: "other",
} as const;

export type FileType =
  EnumLike<typeof FileType>;

// ==================== FULFILLMENT TYPE ====================
export const FulfillmentType = {
  AUTO: "auto",
  MANUAL: "manual",
  DRIP: "drip",
} as const;

export type FulfillmentType =
  EnumLike<typeof FulfillmentType>;

// ==================== PRODUCT SCHEMAS ====================

// Dimensions interface for physical products
export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: 'cm' | 'inch' | 'm';
}

// Product metadata interface
export interface ProductMetadata {
  source?: string;
  quality_score?: number;
  ai_generated?: boolean;
  content_verified?: boolean;
  last_scanned_at?: string | null;
  [key: string]: unknown; // For additional metadata fields
}

// Review interface for product detail
export interface ProductReview {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  rating: number;
  title: string | null;
  comment: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string | null;
}

// Question/Answer interface
export interface ProductQA {
  id: string;
  question: string;
  answer: string | null;
  asked_by: string;
  answered_by: string | null;
  created_at: string;
  answered_at: string | null;
  helpful_count: number;
}

// Downloadable file interface
export interface DownloadableFile {
  id: string;
  name: string;
  url: string;
  type: FileType;
  size: number;
  download_count: number;
  created_at: string;
  expires_at: string | null;
}

// Warranty information interface
export interface WarrantyInfo {
  duration_months: number;
  type: 'manufacturer' | 'seller' | 'none';
  description: string | null;
  contact_info: string | null;
}

// Variant option interface
export interface VariantOption {
  name: string;
  value: string;
}

// Product variant interface
export interface ProductVariant {
  id: string;
  product_id: string;
  option1_name?: string;
  option1_value?: string;
  option2_name?: string;
  option2_value?: string;
  option3_name?: string;
  option3_value?: string;
  sku?: string;
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  stock_quantity: number;
  weight?: number;
  image_url?: string;
  purchase_count: number;
  created_at: string;
  updated_at: string | null;
}

// Related product interface
export interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  current_price: number;
  feature_image_url: string | null;
  is_in_stock: boolean;
}

// ==================== PRODUCT REQUEST TYPES ====================

// Base product request
export interface ProductBaseRequest {
  name: string;
  description?: string;
  short_description?: string;
  base_price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  product_type: ProductType;
  currency: Currency;
  primary_category?: string;
  secondary_categories?: string[];
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
}

// Create product request
// Create product request
// Create product request
// product.types.ts

// Create product request - API'nin beklediği formatta tamamen yeniden yaz
export interface ProductCreateRequest {
  // ===== ZORUNLU ALANLAR =====
  name: string;
  base_price: number;
  product_type: "physical" | "digital" | "service";
  shop_id: string;
  
  // ===== OPSİYONEL ALANLAR =====
  description?: string;
  short_description?: string;
  compare_at_price?: number;
  cost_per_item?: number;
  status?: "draft" | "pending" | "published" | "sold_out" | "archived" | "deleted";
  primary_category?: string;
  secondary_categories?: string[];
  tags?: string[];
  
  // SEO
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  slug?: string;
  
  // Digital product specific
  file_url?: string;
  file_name?: string;
  file_type?: "pdf" | "video" | "audio" | "archive" | "image" | "document" | "software" | "other";
  file_size?: number;
  download_limit?: number;
  access_duration_days?: number;
  watermark_enabled?: boolean;
  drm_enabled?: boolean;
  
  // Physical product specific
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "m" | "inch";
  };
  requires_shipping?: boolean;
  shipping_class?: string;
  
  // Inventory
  stock_quantity?: number;
  low_stock_threshold?: number;
  allows_backorder?: boolean;
  sku?: string;
  barcode?: string;
  
  // Media
  feature_image_url?: string;
  thumbnail_url?: string;
  video_url?: string;
  image_gallery?: string[];
  
  // Fulfillment
  fulfillment_type?: "auto" | "manual" | "drip";
  processing_time_days?: number;
  digital_delivery_method?: "instant" | "manual" | "drip";
  
  // Sale
  is_on_sale?: boolean;
  sale_starts_at?: string;
  sale_ends_at?: string;
}


// Update product request (partial)
export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  short_description?: string;
  base_price?: number;
  compare_at_price?: number;
  cost_per_item?: number;
  stock_quantity?: number;
  low_stock_threshold?: number;
  allows_backorder?: boolean;
  sku?: string;
  barcode?: string;
  download_limit?: number;
  access_duration_days?: number;
  weight?: number;
  dimensions?: ProductDimensions;
  requires_shipping?: boolean;
  shipping_class?: string;
  feature_image_url?: string;
  thumbnail_url?: string;
  video_url?: string;
  image_gallery?: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  status?: ProductStatus;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  is_on_sale?: boolean;
  sale_starts_at?: string;
  sale_ends_at?: string;
}

// Product search parameters
// types/product.types.ts içinde ProductSearchParams'ı güncelleyelim:
export interface ProductSearchParams {
  search?: string;
  shop_id?: string;
  shop_slug?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  product_type?: ProductType;
  is_digital?: boolean;
  in_stock_only?: boolean;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  tags?: string[];
  date_from?: string;
  date_to?: string;
  sort_by?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating' | 'sales';
  page?: number;
  limit?: number;
  // ✅ Eksik property'leri ekle:
  status?: ProductStatus; // Product status filter
  q?: string; // API'de search parametresi 'q' olarak geçiyor
  shopId?: string; // Alternatif yazım
  sort_order?: 'asc' | 'desc'; // Sorting direction
}

// Bulk product update request
export interface ProductBulkUpdateRequest {
  product_ids: string[];
  action: 'publish' | 'unpublish' | 'feature' | 'unfeature' | 'archive' | 'delete' | 'update_price' | 'update_stock';
  data?: Record<string, unknown>;
  reason?: string;
}

// Product import request
export interface ProductImportRequest {
  file_url: string;
  file_type: 'csv' | 'json' | 'excel';
  import_mode: 'create' | 'update' | 'upsert';
  mappings?: Record<string, string>;
  options?: Record<string, unknown>;
}

// Product export request
export interface ProductExportRequest {
  format: 'csv' | 'json' | 'excel';
  fields?: string[];
  filters?: Record<string, unknown>;
  include_variants?: boolean;
  include_images?: boolean;
}

// ==================== PRODUCT RESPONSE TYPES ====================

// Base product response
// types/product.types.ts içinde ProductResponse'u güncelle:
export interface ProductResponse {
  id: string;
  shop_id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  base_price: number;
  compare_at_price?: number | null;  // ✅ hem undefined hem null kabul et
  cost_per_item?: number;
  price_usd: number;
  price_try?: number;
  price_eur?: number;
  price_gbp?: number;
  currency: Currency;
  is_on_sale: boolean;
  sale_starts_at?: string | null;    // ✅ hem undefined hem null kabul et
  sale_ends_at?: string | null;      // ✅ hem undefined hem null kabul et
  sale_price?: number;
  discount_percentage?: number;
  product_type: ProductType;
  stock_quantity: number;
  low_stock_threshold: number;
  allows_backorder: boolean;
  sku?: string;
  barcode?: string;
  file_url?: string;
  file_name?: string;
  file_type?: FileType;
  file_size?: number;
  download_limit: number;
  access_duration_days?: number;
  watermark_enabled: boolean;
  drm_enabled: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
  requires_shipping: boolean;
  shipping_class?: string;
  primary_category?: string;
  secondary_categories?: string[];
  tags?: string[];
  feature_image_url?: string;
  thumbnail_url?: string;
  video_url?: string;
  image_gallery?: string[];
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  status: ProductStatus;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  requires_approval: boolean;
  is_approved: boolean;
  published_at?: string;
  fulfillment_type: FulfillmentType;
  processing_time_days: number;
  digital_delivery_method: string;
  view_count: number;
  unique_view_count: number;
  purchase_count: number;
  wishlist_count: number;
  cart_add_count: number;
  average_rating: number;
  review_count: number;
  refund_rate: number;
  platform_fee_percent: number;
  platform_fee_fixed: number;
  payout_amount?: number;
  metadata: ProductMetadata;
  last_sold_at?: string;
  last_restocked_at?: string;
  created_at: string;
  updated_at?: string;

  supplier_id?: string;
  supplier_name?: string;
  supplier_product_id?: string;
  
  // Computed properties
  is_available: boolean;
  is_in_stock: boolean;
  is_low_stock: boolean;
  current_price: number;
  is_digital: boolean;
  is_physical: boolean;
}



// Public product view (for marketplace)
export interface ProductPublic {
  id: string;
  shop_id: string;
  shop_slug?: string;
  shop_name?: string;
  name: string;
  slug: string;
  short_description?: string;
  current_price: number;
  base_price: number;
  currency: Currency;
  is_on_sale: boolean;
  discount_percentage?: number;
  product_type: ProductType;
  is_in_stock: boolean;
  is_low_stock: boolean;
  stock_quantity: number;
  feature_image_url?: string;
  image_gallery?: string[];
  average_rating: number;
  review_count: number;
  purchase_count: number;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  primary_category?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
  is_digital: boolean;
  download_limit?: number;
  access_duration_days?: number;
}

// Seller view of product
export interface ProductSeller extends ProductResponse {
  shop_is_active: boolean;
  shop_subscription_status?: string;
  variants_count: number;
  image_count: number;
  category_names?: string[];
  daily_sales: Record<string, number>;
  monthly_revenue: number;
  refund_count: number;
  refund_amount: number;
  needs_restock: boolean;
  restock_quantity?: number;
}

// Admin view of product
export interface ProductAdminResponse extends ProductResponse {
  shop_is_active: boolean;
  shop_subscription_status?: string;
  variants_count: number;
  image_count: number;
  category_names?: string[];
  daily_sales: Record<string, number>;
  monthly_revenue: number;
  refund_count: number;
  refund_amount: number;
  needs_restock: boolean;
  restock_quantity?: number;
  ai_generated_score?: number;
  content_moderation_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderation_notes?: string;
  moderated_by?: string;
  moderated_at?: string;
}

// Product detail response with additional fields
export interface ProductDetailResponse extends ProductResponse {
  shop_name?: string;
  shop_slug?: string;
  shop_is_verified: boolean;
  shop_rating: number;
  shop_total_sales: number;
  similar_products: RelatedProduct[];
  variants?: ProductVariant[];
  downloadable_files?: DownloadableFile[];
  related_accessories: RelatedProduct[];
  warranty_info?: WarrantyInfo;
  user_reviews?: ProductReview[];
  questions_answers?: ProductQA[];
}

// ==================== PAGINATION & RESPONSE TYPES ====================

// Paginated response wrapper
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Specific paginated responses
export type PaginatedProducts = PaginatedResponse<ProductResponse>;
export type PaginatedPublicProducts = PaginatedResponse<ProductPublic>;
export type PaginatedSellerProducts = PaginatedResponse<ProductSeller>;

// ==================== HELPER TYPES ====================

// Product filter options for UI
export interface ProductFilterOptions {
  categories: string[];
  price_range: { min: number; max: number };
  tags: string[];
  statuses: ProductStatus[];
  product_types: ProductType[];
}

// Product statistics
export interface ProductStats {
  total_products: number;
  published_products: number;
  total_views: number;
  total_sales: number;
  total_revenue: number;
  average_rating: number;
  top_selling_products: ProductPublic[];
  low_stock_products: ProductResponse[];
}

// Product form data (for UI forms)
export interface ProductFormData extends Omit<ProductCreateRequest, 'product_type' | 'currency'> {
  product_type?: ProductType;
  currency?: Currency;
  variant_options?: VariantOption[];
  variants?: Partial<ProductVariant>[];
}

// Product import/export progress
export interface ProductImportExportProgress {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  total_items: number;
  processed_items: number;
  errors?: string[];
  download_url?: string;
  created_at: string;
  completed_at?: string;
}

// ==================== API RESPONSE TYPES ====================

// API response for single product
export interface ProductApiResponse {
  success: boolean;
  data: ProductResponse | ProductPublic | ProductDetailResponse | ProductSeller | ProductAdminResponse;
  message?: string;
}

// API response for multiple products
export interface ProductsApiResponse {
  success: boolean;
  data: PaginatedProducts | PaginatedPublicProducts | PaginatedSellerProducts;
  message?: string;
}

// API response for product stats
export interface ProductStatsResponse {
  success: boolean;
  data: ProductStats;
  message?: string;
}

export interface ProductInventoryData {
  product_id: string;
  product_name: string;
  product_type: ProductType;
  stock_quantity: number;
  low_stock_threshold: number;
  is_in_stock: boolean;
  is_low_stock: boolean;
  allows_backorder: boolean;
  last_restocked_at: string | null;
  last_sold_at: string | null;
  purchase_count: number;
  cart_add_count: number;
}




