// hooks/cj.hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import { toast } from 'react-hot-toast';

// ==================== TYPES ====================

// CJ API Response Types
export interface CJApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Product Types
export interface CJProduct {
  supplier: 'cj';
  supplier_product_id: string;
  name: string;
  description: string;
  price: number;
  compare_price: number | null;
  currency: 'USD';
  images: string[];
  categories: string[];
  variants: CJVariant[];
  shipping_methods: CJShippingMethod[];
  stock_status: 'in_stock' | 'out_of_stock' | 'pre_order';
  product_url: string;
  weight: number | null;
  size: string | null;
}

export interface CJVariant {
  name: string;
  values: string[];
}

export interface CJShippingMethod {
  method: string;
  price: number;
  currency: string;
  estimated_days: string;
  from_location: string;
}

// Search Types
export interface CJSearchParams {
  query: string;
  page?: number;
  limit?: number;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'relevance' | 'price_asc' | 'price_desc' | 'newest';
}

export interface CJSearchResult {
  supplier_product_id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock_status: 'in_stock' | 'out_of_stock';
}

export interface CJSearchResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  products: CJSearchResult[];
}

// Import Types
export interface CJImportRequest {
  supplier_product_id: string;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  images: string[];
  variants: CJVariant[];
  shipping_methods: CJShippingMethod[];
  shop_id: string;
  markup_percent?: number;
}

export interface CJImportResponse {
  success: boolean;
  message: string;
  product_id: string;
  product_name: string;
}

// Account Connection Types
export interface CJConnectRequest {
  cj_email: string;
  cj_password: string;
}

export interface CJConnectResponse {
  success: boolean;
  message: string;
  connected_at: string;
}

export interface CJStatusResponse {
  connected: boolean;
  email: string | null;
  connected_at: string | null;
  last_sync: string | null;
}

export interface CJDisconnectResponse {
  success: boolean;
  message: string;
}

// Sync Types
export interface CJSyncResponse {
  success: boolean;
  message: string;
  last_sync: string;
}

// Shipping Types
export interface CJShippingRequest {
  product_id: string;
  country?: string;
}

// ==================== HOOKS ====================

/**
 * CJ'den URL ile ürün getir
 */
export const useFetchCJProduct = () => {
  return useMutation<CJProduct, Error, { url: string }>({
    mutationFn: async ({ url }) => {
      const response = await apiClient.post<{ product: CJProduct }>(
        '/api/cj/fetch-product',
        { url }
      );
      
      if (!response.product) {
        throw new Error('Ürün bulunamadı');
      }
      
      return response.product;
    },
    onError: (error) => {
      toast.error(error.message || 'Ürün getirilemedi');
    }
  });
};

/**
 * CJ ürününü mağazaya import et
 */
export const useImportCJProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CJImportResponse, Error, CJImportRequest>({
    mutationFn: async (productData) => {
      const response = await apiClient.post<CJImportResponse>(
        '/api/cj/import-product', 
        productData
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Import başarısız');
      }
      
      return response;
    },
    onSuccess: (data) => {
      // Ürün listesini güncelle
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`"${data.product_name}" mağazaya eklendi!`);
    },
    onError: (error) => {
      toast.error(error.message || 'Ürün import edilemedi');
    }
  });
};

/**
 * CJ'de ürün ara
 */
export const useSearchCJProducts = () => {
  return useMutation<CJSearchResponse, Error, CJSearchParams>({
    mutationFn: async (params) => {
      const response = await apiClient.get<CJSearchResponse>('/api/cj/search', {
        params: {
          query: params.query,
          page: params.page || 1,
          limit: params.limit || 20,
          category_id: params.category_id,
          min_price: params.min_price,
          max_price: params.max_price,
          sort_by: params.sort_by || 'relevance'
        }
      });
      
      return response;
    }
  });
};

/**
 * CJ hesap bağlantı durumunu getir
 */
export const useCJStatus = () => {
  return useQuery<CJStatusResponse>({
    queryKey: ['cj', 'status'],
    queryFn: async () => {
      const response = await apiClient.get<CJStatusResponse>('/api/cj/status');
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
    retry: 1
  });
};

/**
 * CJ hesabı bağla
 */
export const useConnectCJ = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CJConnectResponse, Error, CJConnectRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.post<CJConnectResponse>('/api/cj/connect', data);
      
      if (!response.success) {
        throw new Error(response.message || 'Bağlantı başarısız');
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cj', 'status'] });
      toast.success('CJ hesabı başarıyla bağlandı!');
    },
    onError: (error) => {
      toast.error(error.message || 'CJ bağlantı hatası');
    }
  });
};

/**
 * CJ hesap bağlantısını kes
 */
export const useDisconnectCJ = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CJDisconnectResponse, Error>({
    mutationFn: async () => {
      const response = await apiClient.post<CJDisconnectResponse>('/api/cj/disconnect');
      
      if (!response.success) {
        throw new Error(response.message || 'Bağlantı kesilemedi');
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cj', 'status'] });
      // CJ ile ilgili diğer cache'leri temizle
      queryClient.removeQueries({ queryKey: ['cj', 'search'] });
      toast.success('CJ bağlantısı kesildi');
    },
    onError: (error) => {
      toast.error(error.message || 'Bağlantı kesilemedi');
    }
  });
};

/**
 * CJ ürünlerini senkronize et
 */
export const useSyncCJProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CJSyncResponse, Error>({
    mutationFn: async () => {
      const response = await apiClient.post<CJSyncResponse>('/api/cj/sync');
      
      if (!response.success) {
        throw new Error(response.message || 'Senkronizasyon başarısız');
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cj', 'status'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Ürünler senkronize edildi!');
    },
    onError: (error) => {
      toast.error(error.message || 'Senkronizasyon hatası');
    }
  });
};

/**
 * Ürün için kargo seçeneklerini getir
 */
export const useCJShipping = () => {
  return useMutation<CJShippingMethod[], Error, CJShippingRequest>({
    mutationFn: async ({ product_id, country = 'US' }) => {
      const response = await apiClient.get<{ shipping_methods: CJShippingMethod[] }>(
        `/api/cj/shipping/${product_id}`,
        { params: { country } }
      );
      
      return response.shipping_methods;
    }
  });
};

// ==================== UTILITY TYPES ====================

// Form tipleri (frontend'de kullanılacak)
export interface CJImportFormValues {
  url: string;
  shop_id: string;
  markup_percent: number;
  selected_variants?: string[];
  selected_shipping?: string[];
}

export interface CJSearchFormValues {
  query: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: CJSearchParams['sort_by'];
}