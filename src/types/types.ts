// api/types.ts
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse as AuthResponseType, UserMinimal as UserMinimalType } from '../types/auth.types';

// ==================== CORE TYPES ====================

export interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  useCache?: boolean;
  cacheDuration?: number;
  _retry?: boolean;
}

export interface RequestConfig extends Omit<AxiosRequestConfig, 'headers'> {
  skipAuth?: boolean;
  useCache?: boolean;
  cacheDuration?: number;
  headers?: Record<string, string>;
}

// ==================== USER & AUTH ====================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'seller' | 'user';
  is_seller: boolean;
  created_at: string;
  updated_at: string;
}

export type AuthResponse = AuthResponseType;
export type UserMinimal = UserMinimalType;

// ==================== API RESPONSE ====================

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
  useCache?: boolean;
  cacheDuration?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

// ==================== CACHE ====================

export interface CacheItem<T = unknown> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

// ========== YENİ EKLENEN: DOSYA YÜKLEME TİPLERİ ==========

// ========== DOSYA YÜKLEME TİPLERİ ==========

export type FilePurpose = 
  | "product_file"     // Dijital ürün dosyası
  | "product_image"    // Ürün görseli
  | "product_gallery"  // Ürün galerisi
  | "shop_logo"        // Mağaza logosu
  | "shop_banner"      // Mağaza banner'ı
  | "user_avatar"      // Kullanıcı avatarı
  | "design_file"      // Tasarım dosyası
  | "website_file"     // Web sitesi dosyası
  | "document"         // Doküman
  | "other";           // Diğer

// ✅ HEPSİ EXPORT - aynı isimde başka bir şey yok
export interface UploadedFileInfo {
  id: string;
  user_id: string;
  filename: string;
  s3_key: string;
  s3_url: string;
  file_size: number;
  mime_type: string;
  purpose: FilePurpose;
  uploaded_at: string;
}

export interface FileUploadResponse {
  success: boolean;
  message?: string;
  file: UploadedFileInfo;  // ✅ Aynı dosyada export edilmiş
}

export interface UploadedFilesListResponse {
  success: boolean;
  count: number;
  files: UploadedFileInfo[];  // ✅ Aynı dosyada export edilmiş
}

export interface DeleteFileResponse {
  success: boolean;
  message: string;
  key: string;
}