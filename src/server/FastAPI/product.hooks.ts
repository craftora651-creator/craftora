import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";
import type { 
  ProductResponse,
  ProductDetailResponse,
  ProductSeller,
  ProductInventoryData,
  ProductAdminResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductSearchParams,
  ProductBulkUpdateRequest,
  ProductStats,
  ProductFilterOptions,
  ProductImportExportProgress,
} from "../../types/product.types";

import { ProductStatus, ProductType } from "../../types/product.types";

// ==================== PRODUCT QUERIES ====================

/**
 * Get current user's products (seller view)
 */
export const useMyProducts = (
  shopId?: string,
  status?: ProductStatus,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery<ProductResponse[], Error>({
    queryKey: ["products", "my", { shopId, status }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (shopId) params.append("shop_id", shopId);
      if (status) params.append("status", status);
      
      const url = `/api/products/my${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<ProductResponse[]>(url);
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 2 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Get products for a specific shop (public view)
 */
export const useShopProducts = (
  shopId: string,
  filters?: {
    status?: ProductStatus;
    category?: string;
    min_price?: number;
    max_price?: number;
  }
) => {
  return useQuery<ProductDetailResponse[], Error>({
    queryKey: ["products", "shop", shopId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.min_price) params.append("min_price", filters.min_price.toString());
      if (filters?.max_price) params.append("max_price", filters.max_price.toString());
      
      const url = `/api/products/shop/${shopId}${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<ProductDetailResponse[]>(url);
    },
    enabled: !!shopId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get product by ID
 */
export const useProduct = (
  productId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery<ProductDetailResponse, Error>({
    queryKey: ["product", "detail", productId],
    queryFn: async () => {
      return await apiClient.get<ProductDetailResponse>(`/api/products/${productId}`);
    },
    enabled: options?.enabled ?? !!productId,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Get product by slug
 */
export const useProductBySlug = (
  slug: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery<ProductDetailResponse, Error>({
    queryKey: ["product", "slug", slug],
    queryFn: async () => {
      return await apiClient.get<ProductDetailResponse>(`/api/products/slug/${slug}`);
    },
    enabled: options?.enabled ?? !!slug,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Search products in marketplace (public endpoint)
 */
export const useSearchProducts = (
  searchParams: ProductSearchParams,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<ProductDetailResponse[], Error>({
    queryKey: ["products", "search", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Add search parameters
      if (searchParams.search) params.append("q", searchParams.search);
      if (searchParams.shop_id) params.append("shop_id", searchParams.shop_id);
      if (searchParams.category) params.append("category", searchParams.category);
      if (searchParams.min_price) params.append("min_price", searchParams.min_price.toString());
      if (searchParams.max_price) params.append("max_price", searchParams.max_price.toString());
      if (searchParams.min_rating) params.append("min_rating", searchParams.min_rating.toString());
      if (searchParams.product_type) params.append("product_type", searchParams.product_type);
      if (searchParams.is_digital !== undefined) params.append("is_digital", searchParams.is_digital.toString());
      if (searchParams.in_stock_only) params.append("in_stock_only", "true");
      if (searchParams.is_featured !== undefined) params.append("is_featured", searchParams.is_featured.toString());
      if (searchParams.is_best_seller !== undefined) params.append("is_best_seller", searchParams.is_best_seller.toString());
      if (searchParams.is_new_arrival !== undefined) params.append("is_new_arrival", searchParams.is_new_arrival.toString());
      if (searchParams.tags) params.append("tags", searchParams.tags.join(","));
      if (searchParams.date_from) params.append("date_from", searchParams.date_from);
      if (searchParams.date_to) params.append("date_to", searchParams.date_to);
      if (searchParams.sort_by) params.append("sort_by", searchParams.sort_by);
      if (searchParams.page) params.append("page", searchParams.page.toString());
      if (searchParams.limit) params.append("limit", searchParams.limit.toString());
      
      const url = `/api/products/public/search${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<ProductDetailResponse[]>(url);
    },
    enabled: options?.enabled ?? true,
  });
};

/**
 * Get product categories (public)
 */
export const useProductCategories = () => {
  return useQuery<
    Array<{ id: string; name: string; product_count: number }>,
    Error
  >({
    queryKey: ["products", "categories"],
    queryFn: async () => {
      return await apiClient.get<Array<{ id: string; name: string; product_count: number }>>(
        "/api/products/public/categories"
      );
    },
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Get product inventory
 */
export const useProductInventory = (
  productId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<
    {
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
    },
    Error
  >({
    queryKey: ["product", "inventory", productId],
    queryFn: async () => {
      return await apiClient.get<{
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
      }>(`/api/products/${productId}/inventory`);
    },
    enabled: options?.enabled ?? !!productId,
    staleTime: 30 * 1000,
  });
};

// ==================== PRODUCT MUTATIONS ====================

/**
 * Create a new product
 */
// useCreateProduct hook'unu şöyle düzelt:




export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductResponse, Error, ProductCreateRequest>({
    mutationFn: async (productData) => {
      const response = await apiClient.post<ProductResponse>(
        "/api/products/",
        productData
      );

      // response zaten ProductResponse
      console.log(response.id);
      console.log(response.name);

      return response; // ✅ direkt dön
    },

    onSuccess: (createdProduct) => {
      if (!createdProduct?.id) return;

      queryClient.invalidateQueries({ queryKey: ["products", "my"] });

      if (createdProduct.shop_id) {
        queryClient.invalidateQueries({
          queryKey: ["products", "shop", createdProduct.shop_id],
        });
      }
    },
  });
};
/**
 * Update product
 */
export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<ProductResponse, Error, ProductUpdateRequest>({
    mutationFn: async (updateData: ProductUpdateRequest) => {
      return await apiClient.put<ProductResponse>(`/api/products/${productId}`, updateData);
    },
    onSuccess: (updatedProduct) => {
      // Update all relevant caches
      queryClient.setQueryData<ProductResponse>(["product", "detail", productId], updatedProduct);
      queryClient.setQueryData<ProductResponse>(["product", "slug", updatedProduct.slug], updatedProduct);
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["products", "my"] });
      queryClient.invalidateQueries({ queryKey: ["products", "shop", updatedProduct.shop_id] });
      queryClient.invalidateQueries({ queryKey: ["products", "search"] });
      
      // Update in my products list
      queryClient.setQueryData<ProductResponse[]>(
        ["products", "my", { shopId: updatedProduct.shop_id }],
        (old = []) =>
          old.map((product) =>
            product.id === productId ? { ...product, ...updatedProduct } : product
          )
      );
      
      console.log(`Product updated: ${updatedProduct.name}`);
    },
    onError: (error) => {
      console.error("Error updating product:", error);
    },
  });
};

/**
 * Delete product
 */
/**
 * Delete product
 */

/**
 * Bulk delete products (toplu silme)
 */
/**
 * Bulk delete products (toplu silme)
 */
export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      deleted_count: number;
      deleted_ids: string[];
    },
    Error,
    { product_ids: string[]; permanent?: boolean }
  >({
    mutationFn: async ({ product_ids, permanent = false }) => {
      if (!product_ids || product_ids.length === 0) {
        throw new Error("En az bir ürün ID'si gerekli");
      }
      
      const params = new URLSearchParams();
      if (permanent) params.append("permanent", "true");
      
      // BACKEND'DE TOPLU SİLME YOKSA, TEK TEK SİL!
      console.log("⚠️ Toplu silme endpoint'i yok, tek tek siliniyor...", product_ids);
      
      // Tek tek sil
      const results = await Promise.allSettled(
        product_ids.map(id => 
          apiClient.delete(`/api/products/${id}${params.toString() ? `?${params.toString()}` : ""}`)
        )
      );
      
      const deleted_ids: string[] = [];
      const errors: any[] = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          deleted_ids.push(product_ids[index]);
        } else {
          errors.push({ id: product_ids[index], error: result.reason });
        }
      });
      
      if (errors.length > 0) {
        console.error("❌ Bazı ürünler silinemedi:", errors);
        throw new Error(`${errors.length} ürün silinemedi`);
      }
      
      return {
        message: `${deleted_ids.length} ürün silindi`,
        deleted_count: deleted_ids.length,
        deleted_ids
      };
    },
    onSuccess: (response) => {
      console.log(`✅ ${response.deleted_count} ürün silindi`);
      
      // Tüm ürün listelerini yenile
      queryClient.invalidateQueries({ 
        queryKey: ["products"], 
        refetchType: 'all' 
      });
      
      // Özellikle "my" products'u temizle
      queryClient.invalidateQueries({ 
        queryKey: ["products", "my"], 
        refetchType: 'all' 
      });
      
      // Tek tek silinen ürünlerin cache'lerini temizle
      response.deleted_ids.forEach(id => {
        queryClient.removeQueries({ queryKey: ["product", "detail", id] });
      });
    },
    onError: (error) => {
      console.error("❌ Toplu silme hatası:", error);
    },
  });
};

export const useDeleteProduct = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      product_id: string;
      product_name: string;
      permanent: boolean;
      deleted_by: string;
    },
    Error,
    { permanent?: boolean }
  >({
    mutationFn: async ({ permanent = false }) => {
      if (!productId) {
        throw new Error("Product ID is required");
      }
      
      const params = new URLSearchParams();
      if (permanent) params.append("permanent", "true");
      
      const url = `/api/products/${productId}${params.toString() ? `?${params.toString()}` : ""}`;
      console.log("🗑️ Silme isteği atılıyor:", url);
      
      const response = await apiClient.delete<{
        message: string;
        product_id: string;
        product_name: string;
        permanent: boolean;
        deleted_by: string;
      }>(url);
      
      console.log("🗑️ Silme cevabı:", response);
      return response;
    },
    onSuccess: (response) => {
      if (!response) {
        console.error("❌ Silme cevabı boş!");
        return;
      }
      
      console.log("✅ Silme başarılı:", response);
      
      // 🔴 TÜM ÜRÜN CACHE'LERİNİ TEMİZLE!
      queryClient.removeQueries({ queryKey: ["product", "detail", productId] });
      
      // "products" ile başlayan TÜM query'leri geçersiz kıl
      queryClient.invalidateQueries({ 
        queryKey: ["products"], 
        refetchType: 'all' 
      });
      
      // Özellikle "my" products'u temizle
      queryClient.invalidateQueries({ 
        queryKey: ["products", "my"], 
        refetchType: 'all' 
      });
      
      // Cache'i komple temizle (opsiyonel)
      queryClient.clear();
      
      console.log(`✅ Product deleted: ${productId}, message: ${response.message}`);
    },
    onError: (error) => {
      console.error("❌ Error deleting product:", error);
    },
  });
};


/**
 * Publish product
 */
export const usePublishProduct = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      product_id: string;
      product_name: string;
      status: string;
      requires_approval: boolean;
      is_approved: boolean;
    },
    Error
  >({
    mutationFn: async () => {
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        status: string;
        requires_approval: boolean;
        is_approved: boolean;
      }>(`/products/${productId}/publish`);
    },
    onSuccess: (response) => {
      // Update product cache
      queryClient.setQueryData<ProductResponse>(["product", "detail", productId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: ProductStatus.PUBLISHED,
          is_approved: response.is_approved,
          requires_approval: response.requires_approval,
          published_at: new Date().toISOString(),
        };
      });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["products", "my"] });
      queryClient.invalidateQueries({ queryKey: ["products", "shop"] });
      
      console.log(`Product published: ${response.product_name}`);
    },
    onError: (error) => {
      console.error("Error publishing product:", error);
    },
  });
};

/**
 * Archive product
 */
export const useArchiveProduct = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      product_id: string;
      product_name: string;
      status: string;
    },
    Error
  >({
    mutationFn: async () => {
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        status: string;
      }>(`/products/${productId}/archive`);
    },
    onSuccess: (response) => {
      // Update product cache
      queryClient.setQueryData<ProductResponse>(["product", "detail", productId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: ProductStatus.ARCHIVED,
        };
      });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["products", "my"] });
      queryClient.invalidateQueries({ queryKey: ["products", "shop"] });
      
      console.log(`Product archived: ${response.product_name}`);
    },
    onError: (error) => {
      console.error("Error archiving product:", error);
    },
  });
};

/**
 * Restore archived product
 */
export const useRestoreProduct = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      product_id: string;
      product_name: string;
      status: string;
    },
    Error
  >({
    mutationFn: async () => {
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        status: string;
      }>(`/products/${productId}/restore`);
    },
    onSuccess: (response) => {
      // Update product cache
      queryClient.setQueryData<ProductResponse>(["product", "detail", productId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: ProductStatus.PUBLISHED,
        };
      });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["products", "my"] });
      queryClient.invalidateQueries({ queryKey: ["products", "shop"] });
      
      console.log(`Product restored: ${response.product_name}`);
    },
    onError: (error) => {
      console.error("Error restoring product:", error);
    },
  });
};

/**
 * Update inventory
 */
export const useUpdateInventory = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      product_id: string;
      product_name: string;
      old_quantity: number;
      new_quantity: number;
      change: number;
      reason: string;
      is_low_stock: boolean;
    },
    Error,
    { quantityChange: number; reason?: string }
  >({
    mutationFn: async ({ quantityChange, reason = "manual_update" }) => {
      const formData = new FormData();
      formData.append("quantity_change", quantityChange.toString());
      formData.append("reason", reason);
      
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        old_quantity: number;
        new_quantity: number;
        change: number;
        reason: string;
        is_low_stock: boolean;
      }>(`/products/${productId}/inventory/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      // Update product cache
      queryClient.setQueryData<ProductResponse>(["product", "detail", productId], (old) => {
        if (!old) return old;
        return {
          ...old,
          stock_quantity: response.new_quantity,
          is_low_stock: response.is_low_stock,
          last_restocked_at: response.change > 0 ? new Date().toISOString() : old.last_restocked_at,
        };
      });
      
      // Update inventory cache - TYPE-SAFE VERSION
      queryClient.setQueryData<ProductInventoryData>(
        ["product", "inventory", productId],
        (old: ProductInventoryData | undefined) => {
          // Eğer cache'te data yoksa, response'dan yeni bir object oluştur
          if (!old) {
            return {
              product_id: response.product_id,
              product_name: response.product_name,
              product_type: ProductType.PHYSICAL, // Varsayılan olarak PHYSICAL, response'dan almak daha iyi
              stock_quantity: response.new_quantity,
              low_stock_threshold: 5, // Varsayılan değer
              is_in_stock: response.new_quantity > 0,
              is_low_stock: response.is_low_stock,
              allows_backorder: false, // Varsayılan değer
              last_restocked_at: response.change > 0 ? new Date().toISOString() : null,
              last_sold_at: null, // Varsayılan değer
              purchase_count: 0, // Varsayılan değer
              cart_add_count: 0, // Varsayılan değer
            };
          }
          
          // Cache'te data varsa, sadece değişen alanları güncelle
          return {
            ...old,
            stock_quantity: response.new_quantity,
            is_low_stock: response.is_low_stock,
            last_restocked_at: response.change > 0 ? new Date().toISOString() : old.last_restocked_at,
          };
        }
      );
      
      console.log(`Inventory updated: ${response.product_name} (${response.old_quantity} -> ${response.new_quantity})`);
    },
    onError: (error) => {
      console.error("Error updating inventory:", error);
    },
  });
};


/**
 * Set discount on product
 */
export const useSetDiscount = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      product_id: string;
      product_name: string;
      base_price: number;
      compare_at_price: number | null;
      discount_percent: number;
      is_on_sale: boolean;
      sale_starts_at: string | null;
      sale_ends_at: string | null;
    },
    Error,
    {
      discountPercent: number;
      startsAt?: string;
      endsAt?: string;
    }
  >({
    mutationFn: async ({ discountPercent, startsAt, endsAt }) => {
      const formData = new FormData();
      formData.append("discount_percent", discountPercent.toString());
      if (startsAt) formData.append("starts_at", startsAt);
      if (endsAt) formData.append("ends_at", endsAt);
      
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        base_price: number;
        compare_at_price: number | null;
        discount_percent: number;
        is_on_sale: boolean;
        sale_starts_at: string | null;
        sale_ends_at: string | null;
      }>(`/api/products/${productId}/discount`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      // Update product cache
      queryClient.setQueryData<ProductResponse>(["product", "detail", productId], (old) => {
        if (!old) return old;
        return {
          ...old,
          is_on_sale: response.is_on_sale,
          sale_starts_at: response.sale_starts_at,
          sale_ends_at: response.sale_ends_at,
          compare_at_price: response.compare_at_price,
        };
      });
      
      console.log(`Discount set: ${response.product_name} (${response.discount_percent}%)`);
    },
    onError: (error) => {
      console.error("Error setting discount:", error);
    },
  });
};

/**
 * Remove discount from product
 */
export const useRemoveDiscount = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      product_id: string;
      product_name: string;
      is_on_sale: boolean;
    },
    Error
  >({
    mutationFn: async () => {
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        is_on_sale: boolean;
      }>(`/api/products/${productId}/discount/remove`);
    },
    onSuccess: (response) => {
      // Update product cache
      queryClient.setQueryData<ProductResponse>(["product", "detail", productId], (old) => {
        if (!old) return old;
        return {
          ...old,
          is_on_sale: false,
          sale_starts_at: null,
          sale_ends_at: null,
        };
      });
      
      console.log(`Discount removed: ${response.product_name}`);
    },
    onError: (error) => {
      console.error("Error removing discount:", error);
    },
  });
};

/**
 * Upload product images
 */
export const useUploadProductImages = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      product_id: string;
      product_name: string;
      feature_image_url: string | null;
      image_gallery: string[] | null;
      uploaded_files: Array<{
        filename: string;
        content_type: string;
        size: number;
        url: string;
      }>;
    },
    Error,
    {
      files: File[];
      setAsFeatured?: number;
    }
  >({
    mutationFn: async ({ files, setAsFeatured }) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      if (setAsFeatured !== undefined) {
        formData.append("set_as_featured", setAsFeatured.toString());
      }
      
      // ✅ response'u al ve direkt döndür
      const response = await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        feature_image_url: string | null;
        image_gallery: string[] | null;
        uploaded_files: Array<{
          filename: string;
          content_type: string;
          size: number;
          url: string;
        }>;
      }>(`/api/products/${productId}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("📸 Upload response:", response); // Debug için
      return response; // ✅ response'u döndür
    },
    onSuccess: (response) => {
      console.log("✅ Upload success:", response); // Debug için
      
      // Update product cache
      queryClient.setQueryData<ProductResponse>(["product", "detail", productId], (old) => {
        if (!old) return old;
        return {
          ...old,
          feature_image_url: response.feature_image_url || undefined,
          image_gallery: response.image_gallery || old.image_gallery,
        };
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["product", "detail", productId] });
      
      console.log(`✅ ${response.uploaded_files?.length || 0} images uploaded for ${response.product_name}`);
    },
    onError: (error) => {
      console.error("❌ Error uploading images:", error);
    },
  });
};


/**
 * Bulk update products
 */
export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      updated_count: number;
      fields_updated: string[];
    },
    Error,
    ProductBulkUpdateRequest
  >({
    mutationFn: async (bulkUpdateData) => {
      return await apiClient.post<{
        message: string;
        updated_count: number;
        fields_updated: string[];
      }>("/api/products/bulk/update", bulkUpdateData);
    },
    onSuccess: (response) => {
      // Invalidate all product queries since we don't know which ones were updated
      queryClient.invalidateQueries({ queryKey: ["products", "my"] });
      queryClient.invalidateQueries({ queryKey: ["products", "shop"] });
      queryClient.invalidateQueries({ queryKey: ["products", "search"] });
      
      console.log(`Bulk update completed: ${response.updated_count} products updated`);
    },
    onError: (error) => {
      console.error("Error bulk updating products:", error);
    },
  });
};

// ==================== ADMIN PRODUCT HOOKS ====================

/**
 * List all products (admin only)
 */
export const useAdminProducts = (
  searchParams: ProductSearchParams,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<ProductAdminResponse[], Error>({
    queryKey: ["products", "admin", "list", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Add search parameters
      if (searchParams.search) params.append("q", searchParams.search);
      if (searchParams.status) params.append("status", searchParams.status);
      if (searchParams.shop_id) params.append("shop_id", searchParams.shop_id);
      if (searchParams.page) params.append("page", searchParams.page.toString());
      if (searchParams.limit) params.append("limit", searchParams.limit.toString());
      if (searchParams.sort_by) params.append("sort_by", searchParams.sort_by);
      
      const url = `/api/products/admin/list${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<ProductAdminResponse[]>(url);
    },
    enabled: options?.enabled ?? true,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Approve product (admin only)
 */
export const useApproveProductAdmin = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      product_id: string;
      product_name: string;
      approved_by: string;
      approved_at: string;
    },
    Error
  >({
    mutationFn: async () => {
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        approved_by: string;
        approved_at: string;
      }>(`/api/products/admin/${productId}/approve`);
    },
    onSuccess: (response) => {
      // Update admin products list
      queryClient.invalidateQueries({ queryKey: ["products", "admin", "list"] });
      
      // Also update the specific product cache
      queryClient.setQueryData<ProductResponse>(["product", "detail", productId], (old) => {
        if (!old) return old;
        return {
          ...old,
          is_approved: true,
          status: ProductStatus.PUBLISHED,
          published_at: response.approved_at,
        };
      });
      
      console.log(`Product approved by admin: ${response.product_name}`);
    },
    onError: (error) => {
      console.error("Error approving product as admin:", error);
    },
  });
};

// ==================== HELPER HOOKS ====================

/**
 * Get product statistics for dashboard
 */
export const useProductStats = (shopId?: string) => {
  return useQuery<ProductStats, Error>({
    queryKey: ["products", "stats", shopId],
    queryFn: async () => {
      const url = shopId ? `/api/products/stats?shop_id=${shopId}` : "/products/stats";
      return await apiClient.get<ProductStats>(url);
    },
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Get filter options for product search
 */
export const useProductFilterOptions = () => {
  return useQuery<ProductFilterOptions, Error>({
    queryKey: ["products", "filter-options"],
    queryFn: async () => {
      return await apiClient.get<ProductFilterOptions>("/api/products/filter-options");
    },
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Track import/export progress
 */
export const useImportExportProgress = (taskId: string) => {
  return useQuery<ProductImportExportProgress, Error>({
    queryKey: ["products", "import-export", "progress", taskId],
    queryFn: async () => {
      return await apiClient.get<ProductImportExportProgress>(
        `/api/products/import-export/progress/${taskId}`
      );
    },
    refetchInterval: (query) => {
      // Type-safe versiyon
      const data = query.state.data;
      if (data?.status === "processing") {
        return 2000;
      }
      return false;
    },
    enabled: !!taskId,
  });
};


// 1. Seller dashboard'da kullanıcının tüm ürünlerini getirirken kullanabiliriz:
export const useSellerProducts = (
  shopId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery<ProductSeller[], Error>({
    queryKey: ["products", "seller", shopId],
    queryFn: async () => {
      return await apiClient.get<ProductSeller[]>(`/api/products/seller/${shopId}`);
    },
    enabled: options?.enabled ?? !!shopId,
    staleTime: options?.staleTime ?? 2 * 60 * 1000,
  });
};

// 2. Tek bir ürünün seller view'ını getirmek için:
export const useSellerProduct = (
  productId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<ProductSeller, Error>({
    queryKey: ["product", "seller", productId],
    queryFn: async () => {
      return await apiClient.get<ProductSeller>(`/api/products/${productId}/seller`);
    },
    enabled: options?.enabled ?? !!productId,
  });
};

// 3. Seller dashboard için stats hook'u:
export const useSellerProductStats = (shopId: string) => {
  return useQuery<
    {
      total_products: number;
      published_products: number;
      draft_products: number;
      archived_products: number;
      total_revenue: number;
      total_sales: number;
      low_stock_products: number;
      out_of_stock_products: number;
    },
    Error
  >({
    queryKey: ["products", "seller", "stats", shopId],
    queryFn: async () => {
      return await apiClient.get<{
        total_products: number;
        published_products: number;
        draft_products: number;
        archived_products: number;
        total_revenue: number;
        total_sales: number;
        low_stock_products: number;
        out_of_stock_products: number;
      }>(`/api/products/seller/${shopId}/stats`);
    },
    enabled: !!shopId,
  });
};

export const useSellerTopProducts = (
  shopId: string,
  limit: number = 10,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<ProductSeller[], Error>({
    queryKey: ["products", "seller", "top", shopId, limit],
    queryFn: async () => {
      return await apiClient.get<ProductSeller[]>(
        `/api/products/seller/${shopId}/top?limit=${limit}`
      );
    },
    enabled: options?.enabled ?? !!shopId,
  });
};

// 5. Seller'ın stok uyarıları:
export const useSellerStockAlerts = (shopId: string) => {
  return useQuery<ProductSeller[], Error>({
    queryKey: ["products", "seller", "alerts", shopId],
    queryFn: async () => {
      return await apiClient.get<ProductSeller[]>(
        `/api/products/seller/${shopId}/alerts/stock`
      );
    },
    enabled: !!shopId,
  });
};

// 6. Seller ürün arama hook'u:
export const useSellerSearchProducts = (
  shopId: string,
  filters: {
    search?: string;
    status?: ProductStatus;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    lowStockOnly?: boolean;
    outOfStockOnly?: boolean;
  },
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<ProductSeller[], Error>({
    queryKey: ["products", "seller", "search", shopId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append("q", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice) params.append("min_price", filters.minPrice.toString());
      if (filters.maxPrice) params.append("max_price", filters.maxPrice.toString());
      if (filters.lowStockOnly) params.append("low_stock_only", "true");
      if (filters.outOfStockOnly) params.append("out_of_stock_only", "true");
      
      const url = `/products/seller/${shopId}/search${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<ProductSeller[]>(url);
    },
    enabled: options?.enabled ?? !!shopId,
  });
};

// product.hooks.ts - EN ALTA ŞUNU EKLE:

// ==================== DİJİTAL ÜRÜN MUTASYONLARI (FORM DATA) ====================

/**
 * Create a new digital product with file upload (FormData)
 */
export const useCreateDigitalProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ProductResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      return await apiClient.post<ProductResponse>("/api/products/digital", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (createdProduct) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["products", "my"] });
      queryClient.invalidateQueries({ queryKey: ["products", "shop", createdProduct.shop_id] });
      queryClient.invalidateQueries({ queryKey: ["shop", "stats", createdProduct.shop_id] });
      
      // Add to cache
      queryClient.setQueryData<ProductResponse[]>(
        ["products", "my", { shopId: createdProduct.shop_id }],
        (old = []) => [createdProduct, ...old]
      );
      
      console.log(`✅ Dijital ürün oluşturuldu: ${createdProduct.name}`);
    },
    onError: (error) => {
      console.error("❌ Dijital ürün oluşturulamadı:", error);
    },
  });
};

/**
 * Update a digital product with file upload (FormData)
 */
export const useUpdateDigitalProduct = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<ProductResponse, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      return await apiClient.put<ProductResponse>(`/api/products/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (updatedProduct) => {
      // Update all relevant caches
      queryClient.setQueryData<ProductResponse>(["product", "detail", productId], updatedProduct);
      queryClient.setQueryData<ProductResponse>(["product", "slug", updatedProduct.slug], updatedProduct);
      queryClient.invalidateQueries({ queryKey: ["products", "my"] });
      queryClient.invalidateQueries({ queryKey: ["products", "shop", updatedProduct.shop_id] });
      queryClient.invalidateQueries({ queryKey: ["products", "search"] });
      console.log(`✅ Dijital ürün güncellendi: ${updatedProduct.name}`);
    },
    onError: (error) => {
      console.error("❌ Dijital ürün güncellenemedi:", error);
    },
  });
};

// ==================== COMBINED HOOKS ====================

/**
 * Hook for product management with all common operations
 */
export const useProductManagement = (productId: string) => {
  const productQuery = useProduct(productId);
  const inventoryQuery = useProductInventory(productId);
  const updateMutation = useUpdateProduct(productId);
  const deleteMutation = useDeleteProduct(productId);
  const publishMutation = usePublishProduct(productId);
  const archiveMutation = useArchiveProduct(productId);
  const restoreMutation = useRestoreProduct(productId);
  const updateInventoryMutation = useUpdateInventory(productId);
  const setDiscountMutation = useSetDiscount(productId);
  const removeDiscountMutation = useRemoveDiscount(productId);
  const uploadImagesMutation = useUploadProductImages(productId);
  
  return {
    // Queries
    product: productQuery.data,
    isLoading: productQuery.isLoading,
    isError: productQuery.isError,
    error: productQuery.error,
    inventory: inventoryQuery.data,
    isInventoryLoading: inventoryQuery.isLoading,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    publishProduct: publishMutation.mutate,
    archiveProduct: archiveMutation.mutate,
    restoreProduct: restoreMutation.mutate,
    updateInventory: updateInventoryMutation.mutate,
    setDiscount: setDiscountMutation.mutate,
    removeDiscount: removeDiscountMutation.mutate,
    uploadImages: uploadImagesMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isPublishing: publishMutation.isPending,
    isArchiving: archiveMutation.isPending,
    isRestoring: restoreMutation.isPending,
    isUpdatingInventory: updateInventoryMutation.isPending,
    isSettingDiscount: setDiscountMutation.isPending,
    isRemovingDiscount: removeDiscountMutation.isPending,
    isUploadingImages: uploadImagesMutation.isPending,
    refetch: productQuery.refetch,
    refetchInventory: inventoryQuery.refetch,
  };
};