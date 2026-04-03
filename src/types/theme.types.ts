// src/types/theme.ts

// ==================== TEMA ====================
export interface Theme {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  preview_image: string | null;
  thumbnail: string | null;
  version: string;
  is_active: boolean;
  default_settings: ThemeSettings;
  created_at: string;
  updated_at: string;
}

export interface StoreTheme {
  id: number;
  shop_id: string;
  theme_id: number;
  is_active: boolean;
  settings: ThemeSettings;
  purchased_at: string;
  activated_at: string | null;
  updated_at: string;
}

// GENİŞLETİLMİŞ ThemeSettings - Tüm mağaza ayarlarını içerir
export interface ThemeSettings {
  // ===== TEMA GÖRÜNÜM AYARLARI =====
  colors: {
    primary: string;
    accent: string;
    background: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: string;
  };
  customCss: string;
  customJs: string;
  
  // ===== MAĞAZA BİLGİLERİ =====
  shop_name?: string;
  shop_description?: string;
  shop_rating?: string;
  
  // ===== HERO BÖLÜMÜ =====
  hero_title?: string;
  hero_subtitle?: string;
  hero_button_text?: string;
  hero_button2_text?: string;
  
  // ===== İSTATİSTİKLER =====
  stats?: Array<{ value: string; label: string }>;
  
  // ===== NEDEN CRAFTORA? ÖZELLİKLERİ =====
  features?: Array<{ icon: string; title: string; description: string }>;
  
  // ===== FOOTER =====
  footer_about?: string;
  show_why_section?: boolean;
  
  // ===== MEDYA =====
  logo_url?: string;
  banner_url?: string;
  
  // ===== POPÜLER ÜRÜNLER =====
  selected_products?: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    sales: number;
  }>;
  
  // ===== BLOG YAZILARI =====
  blog_posts?: Array<{
    id: number;
    title: string;
    content: string;
    image: string;
    date: string;
    author: string;
  }>;
  
  // ===== HAKKIMIZDA SAYFASI =====
  about_content?: {
    title: string;
    description: string;
    mainText: string;
    visionText: string;
  };
}

export interface ActiveThemeResponse {
  theme_code: string;
  settings: ThemeSettings;
}

export interface ThemeListResponse {
  id: number;
  theme_id: number;
  theme_code: string;
  theme_name: string;
  preview_image: string | null;
  is_active: boolean;
  purchased_at: string;
}

// ==================== BÖLÜM ====================
export interface Section {
  id: number;
  shop_id: string;
  page_id: number | null;
  section_type: 'hero' | 'featured_products' | 'blog_list' | 'newsletter' | 'custom_html';
  title: string | null;
  content: SectionContent;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export type SectionContent = 
  | HeroContent
  | FeaturedProductsContent
  | BlogListContent
  | NewsletterContent
  | CustomHtmlContent;

export interface HeroContent {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl?: string;
  imagePosition?: 'left' | 'right';
}

export interface FeaturedProductsContent {
  title: string;
  productIds: string[];
  layout: 'grid' | 'list';
  columns: number;
  limit: number;
}

export interface BlogListContent {
  title: string;
  limit: number;
  showExcerpt: boolean;
}

export interface NewsletterContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface CustomHtmlContent {
  html: string;
}

export interface CreateSectionRequest {
  page_id?: number | null;
  section_type: string;
  title?: string | null;
  content: SectionContent;
}

export interface UpdateSectionRequest {
  title?: string | null;
  content?: SectionContent;
  is_visible?: boolean;
}

export interface ReorderSectionsRequest {
  order_ids: number[];
}

// ==================== SAYFA ====================
export interface Page {
  id: number;
  shop_id: string;
  slug: string;
  title: string;
  is_homepage: boolean;
  seo_title: string | null;
  seo_description: string | null;
  sections_order: number[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePageRequest {
  slug: string;
  title: string;
  is_homepage?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  sections_order?: number[];
  is_published?: boolean;
}

export interface UpdatePageRequest {
  title?: string;
  is_homepage?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  sections_order?: number[];
  is_published?: boolean;
}

// ==================== MENÜ ====================
export interface MenuItem {
  id: string;
  title: string;
  url: string;
  order: number;
  target?: '_blank' | '_self';
  icon?: string;
  children?: MenuItem[];
}

export interface Menu {
  id: number;
  shop_id: string;
  name: string;
  location: 'header' | 'footer' | 'sidebar';
  items: MenuItem[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateMenuRequest {
  name?: string;
  items?: MenuItem[];
  is_active?: boolean;
}

// ==================== BLOG ====================
export interface Post {
  id: number;
  shop_id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
  author_name: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  tags?: string[];
  author_name?: string | null;
  is_published?: boolean;
}

export interface UpdatePostRequest {
  title?: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  tags?: string[];
  author_name?: string | null;
  is_published?: boolean;
}

// ==================== MEDYA ====================
export interface Media {
  id: string;
  shop_id: string;
  filename: string;
  url: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  alt_text?: string;
  created_at: string;
}

export interface UploadMediaRequest {
  filename: string;
  url: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  alt_text?: string;
}

// ==================== UI STATE ====================
export interface UIState {
  isEditMode: boolean;
  activeSectionId: number | null;
  sidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;
  toggleEditMode: () => void;
  setActiveSection: (id: number) => void;
  closeSidebar: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}