import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from "../api/apiClient";
import type {
  ProductResponse,
  ProductDetailResponse,
  ProductPublic,
  ProductSeller,
  ProductAdminResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductSearchParams,
  ProductBulkUpdateRequest,
  ProductStats,
  ProductFilterOptions,
  ProductImportExportProgress,
} from "../types/product.types";
import { ProductStatus, ProductType } from "../types/product.types";
import axios from "axios";


export interface ProductFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  fileType: string;
  status: string;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
}


// ==================== STATE TYPES ====================
interface ProductState {
  // Products by ID cache
  productsById: {
    [productId: string]: ProductDetailResponse | null;
  };

  // Product details by ID (with shop info)
  productDetailsById: {
    [productId: string]: ProductDetailResponse | null;
  };

  // Products by slug cache
  productsBySlug: {
    [slug: string]: ProductDetailResponse | null;
  };

  // Seller products by shop ID
  sellerProducts: {
    [shopId: string]: ProductSeller[] | null;
  };

  // Shop products cache (public view)
  shopProducts: {
    [shopId: string]: ProductDetailResponse[] | null;
  };

  // Search results
  searchResults: {
    [queryKey: string]: ProductDetailResponse[] | null;
  };

  // Public marketplace products
  publicProducts: ProductPublic[] | null;

  // Admin products
  adminProducts: ProductAdminResponse[] | null;

  // Product categories
  categories: Array<{ id: string; name: string; product_count: number }> | null;

  // Product stats
  stats: ProductStats | null;

  // Filter options
  filterOptions: ProductFilterOptions | null;
    formData: Partial<ProductCreateRequest> | null;
  
  // ✅ YENİ - Seçili ürün
  selectedProduct: ProductResponse | null;

  // Import/export progress
  importExportProgress: {
    [taskId: string]: ProductImportExportProgress | null;
  };

  // Inventory data
  inventoryData: {
    [productId: string]: {
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
    } | null;
  };

  // Loading states
  loading: {
    fetchProduct: boolean;
    fetchProductBySlug: boolean;
    fetchSellerProducts: boolean;
    fetchShopProducts: boolean;
    searchProducts: boolean;
    fetchCategories: boolean;
    fetchStats: boolean;
    fetchFilterOptions: boolean;
    fetchAdminProducts: boolean;
    fetchInventory: boolean;
    createProduct: boolean;
    updateProduct: boolean;
    deleteProduct: boolean;
    publishProduct: boolean;
    archiveProduct: boolean;
    restoreProduct: boolean;
    updateInventory: boolean;
    setDiscount: boolean;
    removeDiscount: boolean;
    uploadImages: boolean;
    bulkUpdate: boolean;
    approveProduct: boolean;
    importExportProgress: boolean;
  };

  // Errors
  errors: {
    fetchProduct: string | null;
    fetchProductBySlug: string | null;
    fetchSellerProducts: string | null;
    fetchShopProducts: string | null;
    searchProducts: string | null;
    fetchCategories: string | null;
    fetchStats: string | null;
    fetchFilterOptions: string | null;
    fetchAdminProducts: string | null;
    fetchInventory: string | null;
    createProduct: string | null;
    updateProduct: string | null;
    deleteProduct: string | null;
    publishProduct: string | null;
    archiveProduct: string | null;
    restoreProduct: string | null;
    updateInventory: string | null;
    setDiscount: string | null;
    removeDiscount: string | null;
    uploadImages: string | null;
    bulkUpdate: string | null;
    approveProduct: string | null;
    importExportProgress: string | null;
  };

  // Current operations
  currentOperation: {
    type: string | null;
    productId: string | null;
    shopId: string | null;
  };
  filters: ProductFilters;
}

// ==================== INITIAL STATE ====================
const initialState: ProductState = {
  productsById: {},
  productDetailsById: {},
  productsBySlug: {},
  sellerProducts: {},
  shopProducts: {},
  searchResults: {},
  publicProducts: null,
  adminProducts: null,
  categories: null,
  stats: null,
  formData: null,
  selectedProduct: null,
  filterOptions: null,
  importExportProgress: {},
  inventoryData: {},
  loading: {
    fetchProduct: false,
    fetchProductBySlug: false,
    fetchSellerProducts: false,
    fetchShopProducts: false,
    searchProducts: false,
    fetchCategories: false,
    fetchStats: false,
    fetchFilterOptions: false,
    fetchAdminProducts: false,
    fetchInventory: false,
    createProduct: false,
    updateProduct: false,
    deleteProduct: false,
    publishProduct: false,
    archiveProduct: false,
    restoreProduct: false,
    updateInventory: false,
    setDiscount: false,
    removeDiscount: false,
    uploadImages: false,
    bulkUpdate: false,
    approveProduct: false,
    importExportProgress: false,
  },
  errors: {
    fetchProduct: null,
    fetchProductBySlug: null,
    fetchSellerProducts: null,
    fetchShopProducts: null,
    searchProducts: null,
    fetchCategories: null,
    fetchStats: null,
    fetchFilterOptions: null,
    fetchAdminProducts: null,
    fetchInventory: null,
    createProduct: null,
    updateProduct: null,
    deleteProduct: null,
    publishProduct: null,
    archiveProduct: null,
    restoreProduct: null,
    updateInventory: null,
    setDiscount: null,
    removeDiscount: null,
    uploadImages: null,
    bulkUpdate: null,
    approveProduct: null,
    importExportProgress: null,
  },
  currentOperation: {
    type: null,
    productId: null,
    shopId: null,
  },
  filters: {
  search: '',
  category: '',
  minPrice: 0,
  maxPrice: 1000,
  fileType: '',
  status: '',
  sortBy: 'newest',
},
};

// ==================== ASYNC THUNKS ====================

// ✅ Fetch product by ID
export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      return await apiClient.get<ProductDetailResponse>(
        `/products/${productId}`,
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch product",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch product");
    }
  },
);

// ✅ Fetch product by slug
export const fetchProductBySlug = createAsyncThunk(
  "product/fetchProductBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      return await apiClient.get<ProductDetailResponse>(
        `/products/slug/${slug}`,
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch product",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch product");
    }
  },
);

// ✅ Fetch seller products
export const fetchSellerProducts = createAsyncThunk(
  "product/fetchSellerProducts",
  async (shopId: string, { rejectWithValue }) => {
    try {
      return await apiClient.get<ProductSeller[]>(`/products/seller/${shopId}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch seller products",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch seller products");
    }
  },
);

// ✅ Fetch shop products (public)
export const fetchShopProducts = createAsyncThunk(
  "product/fetchShopProducts",
  async (
    {
      shopId,
      filters,
    }: {
      shopId: string;
      filters?: {
        status?: ProductStatus;
        category?: string;
        min_price?: number;
        max_price?: number;
      };
    },
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.min_price)
        params.append("min_price", filters.min_price.toString());
      if (filters?.max_price)
        params.append("max_price", filters.max_price.toString());

      const url = `/products/shop/${shopId}${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<ProductDetailResponse[]>(url);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch shop products",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch shop products");
    }
  },
);

// ✅ Search products
export const searchProducts = createAsyncThunk(
  "product/searchProducts",
  async (searchParams: ProductSearchParams, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (searchParams.search) params.append("q", searchParams.search);
      if (searchParams.shop_id) params.append("shop_id", searchParams.shop_id);
      if (searchParams.category)
        params.append("category", searchParams.category);
      if (searchParams.min_price)
        params.append("min_price", searchParams.min_price.toString());
      if (searchParams.max_price)
        params.append("max_price", searchParams.max_price.toString());
      if (searchParams.min_rating)
        params.append("min_rating", searchParams.min_rating.toString());
      if (searchParams.product_type)
        params.append("product_type", searchParams.product_type);
      if (searchParams.is_digital !== undefined)
        params.append("is_digital", searchParams.is_digital.toString());
      if (searchParams.in_stock_only) params.append("in_stock_only", "true");
      if (searchParams.is_featured !== undefined)
        params.append("is_featured", searchParams.is_featured.toString());
      if (searchParams.is_best_seller !== undefined)
        params.append("is_best_seller", searchParams.is_best_seller.toString());
      if (searchParams.is_new_arrival !== undefined)
        params.append("is_new_arrival", searchParams.is_new_arrival.toString());
      if (searchParams.tags) params.append("tags", searchParams.tags.join(","));
      if (searchParams.date_from)
        params.append("date_from", searchParams.date_from);
      if (searchParams.date_to) params.append("date_to", searchParams.date_to);
      if (searchParams.sort_by) params.append("sort_by", searchParams.sort_by);
      if (searchParams.page)
        params.append("page", searchParams.page.toString());
      if (searchParams.limit)
        params.append("limit", searchParams.limit.toString());

      const url = `/products/public/search${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<ProductDetailResponse[]>(url);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to search products",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to search products");
    }
  },
);

// ✅ Fetch categories
export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get<
        Array<{ id: string; name: string; product_count: number }>
      >("/products/public/categories");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch categories",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch categories");
    }
  },
);

// ✅ Fetch product stats
export const fetchProductStats = createAsyncThunk(
  "product/fetchProductStats",
  async ({ shopId }: { shopId?: string }, { rejectWithValue }) => {
    try {
      const url = shopId
        ? `/products/stats?shop_id=${shopId}`
        : "/products/stats";
      return await apiClient.get<ProductStats>(url);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch product stats",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch product stats");
    }
  },
);

// ✅ Fetch filter options
export const fetchFilterOptions = createAsyncThunk(
  "product/fetchFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get<ProductFilterOptions>(
        "/products/filter-options",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch filter options",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch filter options");
    }
  },
);

// ✅ Fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  "product/fetchAdminProducts",
  async (searchParams: ProductSearchParams, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (searchParams.search) params.append("q", searchParams.search);
      if (searchParams.status) params.append("status", searchParams.status);
      if (searchParams.shop_id) params.append("shop_id", searchParams.shop_id);
      if (searchParams.page)
        params.append("page", searchParams.page.toString());
      if (searchParams.limit)
        params.append("limit", searchParams.limit.toString());
      if (searchParams.sort_by) params.append("sort_by", searchParams.sort_by);

      const url = `/products/admin/list${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<ProductAdminResponse[]>(url);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch admin products",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch admin products");
    }
  },
);

// ✅ Fetch inventory data
export const fetchInventory = createAsyncThunk(
  "product/fetchInventory",
  async (productId: string, { rejectWithValue }) => {
    try {
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
      }>(`/products/${productId}/inventory`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch inventory",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch inventory");
    }
  },
);

// ✅ Create product
// ✅ Create product (HEM JSON HEM FORMDATA DESTEKLER)
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData: ProductCreateRequest | FormData, { rejectWithValue }) => {
    try {
      // FormData mı yoksa JSON mı kontrol et
      const isFormData = productData instanceof FormData;
      
      const config = isFormData 
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
        
      return await apiClient.post<ProductResponse>("/products", productData, config);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to create product",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to create product");
    }
  },
);

// ✅ Update product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (
    {
      productId,
      updateData,
    }: { productId: string; updateData: ProductUpdateRequest },
    { rejectWithValue },
  ) => {
    try {
      return await apiClient.put<ProductResponse>(
        `/products/${productId}`,
        updateData,
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update product",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update product");
    }
  },
);

// ✅ Delete product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (
    {
      productId,
      permanent = false,
    }: { productId: string; permanent?: boolean },
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams();
      if (permanent) params.append("permanent", "true");

      const url = `/products/${productId}${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.delete<{
        message: string;
        product_id: string;
        product_name: string;
        permanent: boolean;
        deleted_by: string;
      }>(url);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to delete product",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to delete product");
    }
  },
);

// ✅ Publish product
export const publishProduct = createAsyncThunk(
  "product/publishProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        status: string;
        requires_approval: boolean;
        is_approved: boolean;
      }>(`/products/${productId}/publish`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to publish product",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to publish product");
    }
  },
);

// ✅ Archive product
export const archiveProduct = createAsyncThunk(
  "product/archiveProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        status: string;
      }>(`/products/${productId}/archive`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to archive product",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to archive product");
    }
  },
);

// ✅ Restore product
export const restoreProduct = createAsyncThunk(
  "product/restoreProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        status: string;
      }>(`/products/${productId}/restore`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to restore product",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to restore product");
    }
  },
);

// ✅ Update inventory
export const updateInventory = createAsyncThunk(
  "product/updateInventory",
  async (
    {
      productId,
      quantityChange,
      reason = "manual_update",
    }: {
      productId: string;
      quantityChange: number;
      reason?: string;
    },
    { rejectWithValue },
  ) => {
    try {
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
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update inventory",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update inventory");
    }
  },
);

// ✅ Set discount
export const setDiscount = createAsyncThunk(
  "product/setDiscount",
  async (
    {
      productId,
      discountPercent,
      startsAt,
      endsAt,
    }: {
      productId: string;
      discountPercent: number;
      startsAt?: string;
      endsAt?: string;
    },
    { rejectWithValue },
  ) => {
    try {
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
      }>(`/products/${productId}/discount`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to set discount",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to set discount");
    }
  },
);

// ✅ Remove discount
export const removeDiscount = createAsyncThunk(
  "product/removeDiscount",
  async (productId: string, { rejectWithValue }) => {
    try {
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        is_on_sale: boolean;
      }>(`/products/${productId}/discount/remove`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to remove discount",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to remove discount");
    }
  },
);

// ✅ Upload product images
export const uploadProductImages = createAsyncThunk(
  "product/uploadProductImages",
  async (
    {
      productId,
      files,
      setAsFeatured,
    }: {
      productId: string;
      files: File[];
      setAsFeatured?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      if (setAsFeatured !== undefined)
        formData.append("set_as_featured", setAsFeatured.toString());

      return await apiClient.post<{
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
      }>(`/products/${productId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to upload images",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to upload images");
    }
  },
);

// ✅ Bulk update products
export const bulkUpdateProducts = createAsyncThunk(
  "product/bulkUpdateProducts",
  async (bulkUpdateData: ProductBulkUpdateRequest, { rejectWithValue }) => {
    try {
      return await apiClient.post<{
        message: string;
        updated_count: number;
        fields_updated: string[];
      }>("/products/bulk/update", bulkUpdateData);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to bulk update products",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to bulk update products");
    }
  },
);

// ✅ Approve product (admin)
export const approveProductAdmin = createAsyncThunk(
  "product/approveProductAdmin",
  async (productId: string, { rejectWithValue }) => {
    try {
      return await apiClient.post<{
        message: string;
        product_id: string;
        product_name: string;
        approved_by: string;
        approved_at: string;
      }>(`/products/admin/${productId}/approve`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to approve product",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to approve product");
    }
  },
);

// ✅ Fetch import/export progress
export const fetchImportExportProgress = createAsyncThunk(
  "product/fetchImportExportProgress",
  async (taskId: string, { rejectWithValue }) => {
    try {
      return await apiClient.get<ProductImportExportProgress>(
        `/products/import-export/progress/${taskId}`,
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch import/export progress",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch import/export progress");
    }
  },
);

// ==================== SLICE ====================
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Clear errors
    clearProductErrors: (state) => {
      Object.keys(state.errors).forEach((key) => {
        state.errors[key as keyof typeof state.errors] = null;
      });
    },
    // productSlice.ts - reducers içine ekle:

// Save form draft
saveFormDraft: (state, action: PayloadAction<Partial<ProductCreateRequest>>) => {
  state.formData = action.payload;
},

// Clear form draft
clearFormDraft: (state) => {
  state.formData = null;
},

// Set selected product
setSelectedProduct: (state, action: PayloadAction<ProductResponse | null>) => {
  state.selectedProduct = action.payload;
},

    // Clear specific error
    clearError: (state, action: PayloadAction<keyof typeof state.errors>) => {
      state.errors[action.payload] = null;
    },

    // Set current operation
    setCurrentOperation: (
      state,
      action: PayloadAction<{
        type: string | null;
        productId?: string | null;
        shopId?: string | null;
      }>,
    ) => {
      state.currentOperation = {
        type: action.payload.type,
        productId: action.payload.productId || null,
        shopId: action.payload.shopId || null,
      };
    },

    // Clear current operation
    clearCurrentOperation: (state) => {
      state.currentOperation = { type: null, productId: null, shopId: null };
    },

    // Update product in cache
    updateProductInCache: (
      state,
      action: PayloadAction<{
        productId: string;
        updates: Partial<ProductResponse>;
      }>,
    ) => {
      const { productId, updates } = action.payload;

      // Update in productsById
      if (state.productsById[productId]) {
        state.productsById[productId] = {
          ...state.productsById[productId]!,
          ...updates,
        };
      }

      // Update in productDetailsById
      if (state.productDetailsById[productId]) {
        state.productDetailsById[productId] = {
          ...state.productDetailsById[productId]!,
          ...updates,
        };
      }

      // Update in productsBySlug if slug matches
      const product = state.productsById[productId];
      if (product && product.slug && state.productsBySlug[product.slug]) {
        state.productsBySlug[product.slug] = {
          ...state.productsBySlug[product.slug]!,
          ...updates,
        };
      }
    },

    // Remove product from cache
    removeProductFromCache: (state, action: PayloadAction<string>) => {
      const productId = action.payload;

      // Remove from productsById
      if (state.productsById[productId]) {
        delete state.productsById[productId];
      }

      // Remove from productDetailsById
      if (state.productDetailsById[productId]) {
        delete state.productDetailsById[productId];
      }

      // Remove from productsBySlug
      const product = state.productsById[productId];
      if (product && product.slug && state.productsBySlug[product.slug]) {
        delete state.productsBySlug[product.slug];
      }

      // Remove from inventoryData
      if (state.inventoryData[productId]) {
        delete state.inventoryData[productId];
      }
    },

    // Clear all product caches
    clearAllProductCaches: (state) => {
      state.productsById = {};
      state.productDetailsById = {};
      state.productsBySlug = {};
      state.sellerProducts = {};
      state.shopProducts = {};
      state.searchResults = {};
      state.inventoryData = {};
    },

    // Clear seller products cache
    clearSellerProducts: (state, action: PayloadAction<string>) => {
      const shopId = action.payload;
      if (state.sellerProducts[shopId]) {
        delete state.sellerProducts[shopId];
      }
    },

    // Clear shop products cache
    clearShopProducts: (state, action: PayloadAction<string>) => {
      const shopId = action.payload;
      if (state.shopProducts[shopId]) {
        delete state.shopProducts[shopId];
      }
    },

    // Clear search results
    clearSearchResults: (state, action: PayloadAction<string>) => {
      const queryKey = action.payload;
      if (state.searchResults[queryKey]) {
        delete state.searchResults[queryKey];
      }
    },

    // Clear all search results
    clearAllSearchResults: (state) => {
      state.searchResults = {};
    },

    // Reset product state
    resetProductState: () => initialState,
  },
  extraReducers: (builder) => {
    // Helper function to set loading and clear error
    const setLoading = (
      state: ProductState,
      loadingKey: keyof ProductState["loading"],
      errorKey: keyof ProductState["errors"],
    ) => {
      state.loading[loadingKey] = true;
      state.errors[errorKey] = null;
    };

    // Helper function to clear loading and set error
    const setError = (
      state: ProductState,
      loadingKey: keyof ProductState["loading"],
      errorKey: keyof ProductState["errors"],
      error: string,
    ) => {
      state.loading[loadingKey] = false;
      state.errors[errorKey] = error;
    };

    // Helper function to clear loading
    const clearLoading = (
      state: ProductState,
      loadingKey: keyof ProductState["loading"],
    ) => {
      state.loading[loadingKey] = false;
    };

    // ==================== FETCH PRODUCT ====================
    builder.addCase(fetchProduct.pending, (state) => {
      setLoading(state, "fetchProduct", "fetchProduct");
    });
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      clearLoading(state, "fetchProduct");
      const product = action.payload;
      state.productsById[product.id] = product;
      state.productDetailsById[product.id] = product;
      state.productsBySlug[product.slug] = product;
    });
    builder.addCase(fetchProduct.rejected, (state, action) => {
      setError(state, "fetchProduct", "fetchProduct", action.payload as string);
    });

    // ==================== FETCH PRODUCT BY SLUG ====================
    builder.addCase(fetchProductBySlug.pending, (state) => {
      setLoading(state, "fetchProductBySlug", "fetchProductBySlug");
    });
    builder.addCase(fetchProductBySlug.fulfilled, (state, action) => {
      clearLoading(state, "fetchProductBySlug");
      const product = action.payload;
      state.productsById[product.id] = product;
      state.productDetailsById[product.id] = product;
      state.productsBySlug[product.slug] = product;
    });
    builder.addCase(fetchProductBySlug.rejected, (state, action) => {
      setError(
        state,
        "fetchProductBySlug",
        "fetchProductBySlug",
        action.payload as string,
      );
    });

    // ==================== FETCH SELLER PRODUCTS ====================
    builder.addCase(fetchSellerProducts.pending, (state) => {
      setLoading(state, "fetchSellerProducts", "fetchSellerProducts");
    });
    builder.addCase(fetchSellerProducts.fulfilled, (state, action) => {
      clearLoading(state, "fetchSellerProducts");
      const shopId = action.meta.arg;
      state.sellerProducts[shopId] = action.payload;
    });
    builder.addCase(fetchSellerProducts.rejected, (state, action) => {
      setError(
        state,
        "fetchSellerProducts",
        "fetchSellerProducts",
        action.payload as string,
      );
    });

    // ==================== FETCH SHOP PRODUCTS ====================
    builder.addCase(fetchShopProducts.pending, (state) => {
      setLoading(state, "fetchShopProducts", "fetchShopProducts");
    });
    builder.addCase(fetchShopProducts.fulfilled, (state, action) => {
      clearLoading(state, "fetchShopProducts");
      const shopId = action.meta.arg.shopId;
      state.shopProducts[shopId] = action.payload;
    });
    builder.addCase(fetchShopProducts.rejected, (state, action) => {
      setError(
        state,
        "fetchShopProducts",
        "fetchShopProducts",
        action.payload as string,
      );
    });

    // ==================== SEARCH PRODUCTS ====================
    builder.addCase(searchProducts.pending, (state) => {
      setLoading(state, "searchProducts", "searchProducts");
    });
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      clearLoading(state, "searchProducts");
      const queryKey = JSON.stringify(action.meta.arg);
      state.searchResults[queryKey] = action.payload;
    });
    builder.addCase(searchProducts.rejected, (state, action) => {
      setError(
        state,
        "searchProducts",
        "searchProducts",
        action.payload as string,
      );
    });

    // ==================== FETCH CATEGORIES ====================
    builder.addCase(fetchCategories.pending, (state) => {
      setLoading(state, "fetchCategories", "fetchCategories");
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      clearLoading(state, "fetchCategories");
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      setError(
        state,
        "fetchCategories",
        "fetchCategories",
        action.payload as string,
      );
    });

    // ==================== FETCH PRODUCT STATS ====================
    builder.addCase(fetchProductStats.pending, (state) => {
      setLoading(state, "fetchStats", "fetchStats");
    });
    builder.addCase(fetchProductStats.fulfilled, (state, action) => {
      clearLoading(state, "fetchStats");
      state.stats = action.payload;
    });
    builder.addCase(fetchProductStats.rejected, (state, action) => {
      setError(state, "fetchStats", "fetchStats", action.payload as string);
    });

    // ==================== FETCH FILTER OPTIONS ====================
    builder.addCase(fetchFilterOptions.pending, (state) => {
      setLoading(state, "fetchFilterOptions", "fetchFilterOptions");
    });
    builder.addCase(fetchFilterOptions.fulfilled, (state, action) => {
      clearLoading(state, "fetchFilterOptions");
      state.filterOptions = action.payload;
    });
    builder.addCase(fetchFilterOptions.rejected, (state, action) => {
      setError(
        state,
        "fetchFilterOptions",
        "fetchFilterOptions",
        action.payload as string,
      );
    });

    // ==================== FETCH ADMIN PRODUCTS ====================
    builder.addCase(fetchAdminProducts.pending, (state) => {
      setLoading(state, "fetchAdminProducts", "fetchAdminProducts");
    });
    builder.addCase(fetchAdminProducts.fulfilled, (state, action) => {
      clearLoading(state, "fetchAdminProducts");
      state.adminProducts = action.payload;
    });
    builder.addCase(fetchAdminProducts.rejected, (state, action) => {
      setError(
        state,
        "fetchAdminProducts",
        "fetchAdminProducts",
        action.payload as string,
      );
    });

    // ==================== FETCH INVENTORY ====================
    builder.addCase(fetchInventory.pending, (state) => {
      setLoading(state, "fetchInventory", "fetchInventory");
    });
    builder.addCase(fetchInventory.fulfilled, (state, action) => {
      clearLoading(state, "fetchInventory");
      state.inventoryData[action.payload.product_id] = action.payload;
    });
    builder.addCase(fetchInventory.rejected, (state, action) => {
      setError(
        state,
        "fetchInventory",
        "fetchInventory",
        action.payload as string,
      );
    });

    // ==================== CREATE PRODUCT ====================
    builder.addCase(createProduct.pending, (state) => {
      setLoading(state, "createProduct", "createProduct");
      state.currentOperation = {
        type: "create",
        productId: null,
        shopId: null,
      };
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      clearLoading(state, "createProduct");
      state.currentOperation = { type: null, productId: null, shopId: null };
      const product = action.payload;

      const productDetail = product as ProductDetailResponse;

      state.productsById[productDetail.id] = productDetail;
      state.productDetailsById[productDetail.id] = productDetail;
      state.productsBySlug[productDetail.slug] = productDetail;
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      setError(
        state,
        "createProduct",
        "createProduct",
        action.payload as string,
      );
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== UPDATE PRODUCT ====================
    builder.addCase(updateProduct.pending, (state, action) => {
      setLoading(state, "updateProduct", "updateProduct");
      state.currentOperation = {
        type: "update",
        productId: action.meta.arg.productId, // ✅ action parametre olarak geldi
        shopId: null,
      };
    });


builder.addCase(updateProduct.fulfilled, (state, action) => {
  clearLoading(state, "updateProduct");
  state.currentOperation = { type: null, productId: null, shopId: null };
  const product = action.payload as ProductDetailResponse; // ✅ Cast yap
  state.productsById[product.id] = product;
  state.productDetailsById[product.id] = product;
  state.productsBySlug[product.slug] = product;
});

    builder.addCase(updateProduct.rejected, (state, action) => {
      setError(
        state,
        "updateProduct",
        "updateProduct",
        action.payload as string,
      );
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== DELETE PRODUCT ====================
    builder.addCase(deleteProduct.pending, (state, action) => {
  setLoading(state, "deleteProduct", "deleteProduct");
  state.currentOperation = {
    type: "delete",
    productId: action.meta.arg.productId, // ✅ action parametre olarak geldi
    shopId: null,
  };
});

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      clearLoading(state, "deleteProduct");
      state.currentOperation = { type: null, productId: null, shopId: null };
      const productId = action.meta.arg.productId;

      // Remove from all caches
      delete state.productsById[productId];
      delete state.productDetailsById[productId];
      delete state.inventoryData[productId];
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      setError(
        state,
        "deleteProduct",
        "deleteProduct",
        action.payload as string,
      );
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== PUBLISH PRODUCT ====================
    builder.addCase(publishProduct.pending, (state, action) => {
      setLoading(state, "publishProduct", "publishProduct");
      state.currentOperation = {
        type: "publish",
        productId: action.meta.arg,
        shopId: null,
      };
    });
    builder.addCase(publishProduct.fulfilled, (state, action) => {
      clearLoading(state, "publishProduct");
      state.currentOperation = { type: null, productId: null, shopId: null };
      const productId = action.meta.arg;

      // Update product status in cache
      if (state.productsById[productId]) {
        state.productsById[productId] = {
          ...state.productsById[productId]!,
          status: ProductStatus.PUBLISHED,
          is_approved: action.payload.is_approved,
          requires_approval: action.payload.requires_approval,
          published_at: new Date().toISOString(),
        };
      }
    });
    builder.addCase(publishProduct.rejected, (state, action) => {
      setError(
        state,
        "publishProduct",
        "publishProduct",
        action.payload as string,
      );
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== ARCHIVE PRODUCT ====================
    builder.addCase(archiveProduct.pending, (state, action) => {
      setLoading(state, "archiveProduct", "archiveProduct");
      state.currentOperation = {
        type: "archive",
        productId: action.meta.arg,
        shopId: null,
      };
    });
    builder.addCase(archiveProduct.fulfilled, (state, action) => {
      clearLoading(state, "archiveProduct");
      state.currentOperation = { type: null, productId: null, shopId: null };
      const productId = action.meta.arg;

      // Update product status in cache
      if (state.productsById[productId]) {
        state.productsById[productId] = {
          ...state.productsById[productId]!,
          status: ProductStatus.ARCHIVED,
        };
      }
    });
    builder.addCase(archiveProduct.rejected, (state, action) => {
      setError(
        state,
        "archiveProduct",
        "archiveProduct",
        action.payload as string,
      );
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== RESTORE PRODUCT ====================
    builder.addCase(restoreProduct.pending, (state, action) => {
      setLoading(state, "restoreProduct", "restoreProduct");
      state.currentOperation = {
        type: "restore",
        productId: action.meta.arg,
        shopId: null,
      };
    });
    builder.addCase(restoreProduct.fulfilled, (state, action) => {
      clearLoading(state, "restoreProduct");
      state.currentOperation = { type: null, productId: null, shopId: null };
      const productId = action.meta.arg;

      // Update product status in cache
      if (state.productsById[productId]) {
        state.productsById[productId] = {
          ...state.productsById[productId]!,
          status: ProductStatus.PUBLISHED,
        };
      }
    });
    builder.addCase(restoreProduct.rejected, (state, action) => {
      setError(
        state,
        "restoreProduct",
        "restoreProduct",
        action.payload as string,
      );
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== UPDATE INVENTORY ====================
    builder.addCase(updateInventory.pending, (state, action) => {
      setLoading(state, "updateInventory", "updateInventory");
      state.currentOperation = {
        type: "updateInventory",
        productId: action.meta.arg.productId,
        shopId: null,
      };
    });
    builder.addCase(updateInventory.fulfilled, (state, action) => {
      clearLoading(state, "updateInventory");
      state.currentOperation = { type: null, productId: null, shopId: null };
      const productId = action.meta.arg.productId;
      const response = action.payload;

      // Update inventory data
      if (state.inventoryData[productId]) {
        state.inventoryData[productId] = {
          ...state.inventoryData[productId]!,
          stock_quantity: response.new_quantity,
          is_low_stock: response.is_low_stock,
          last_restocked_at:
            response.change > 0
              ? new Date().toISOString()
              : state.inventoryData[productId]!.last_restocked_at,
        };
      }

      // Update product cache
      if (state.productsById[productId]) {
        state.productsById[productId] = {
          ...state.productsById[productId]!,
          stock_quantity: response.new_quantity,
          is_low_stock: response.is_low_stock,
          last_restocked_at:
            response.change > 0
              ? new Date().toISOString()
              : state.productsById[productId]!.last_restocked_at,
        };
      }
    });
    builder.addCase(updateInventory.rejected, (state, action) => {
      setError(
        state,
        "updateInventory",
        "updateInventory",
        action.payload as string,
      );
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== SET DISCOUNT ====================
    builder.addCase(setDiscount.pending, (state, action) => {
      setLoading(state, "setDiscount", "setDiscount");
      state.currentOperation = {
        type: "setDiscount",
        productId: action.meta.arg.productId,
        shopId: null,
      };
    });
    builder.addCase(setDiscount.fulfilled, (state, action) => {
      clearLoading(state, "setDiscount");
      state.currentOperation = { type: null, productId: null, shopId: null };
      const productId = action.meta.arg.productId;
      const response = action.payload;

      // Update product cache
      if (state.productsById[productId]) {
        state.productsById[productId] = {
          ...state.productsById[productId]!,
          is_on_sale: response.is_on_sale,
          sale_starts_at: response.sale_starts_at,
          sale_ends_at: response.sale_ends_at,
          compare_at_price: response.compare_at_price,
        };
      }
    });
    builder.addCase(setDiscount.rejected, (state, action) => {
      setError(state, "setDiscount", "setDiscount", action.payload as string);
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== REMOVE DISCOUNT ====================
    builder.addCase(removeDiscount.pending, (state, action) => {
      setLoading(state, "removeDiscount", "removeDiscount");
      state.currentOperation = {
        type: "removeDiscount",
        productId: action.meta.arg,
        shopId: null,
      };
    });
    builder.addCase(removeDiscount.fulfilled, (state, action) => {
      clearLoading(state, "removeDiscount");
      state.currentOperation = { type: null, productId: null, shopId: null };
      const productId = action.meta.arg;

      // Update product cache
      if (state.productsById[productId]) {
        state.productsById[productId] = {
          ...state.productsById[productId]!,
          is_on_sale: false,
          sale_starts_at: null,
          sale_ends_at: null,
        };
      }
    });
    builder.addCase(removeDiscount.rejected, (state, action) => {
      setError(
        state,
        "removeDiscount",
        "removeDiscount",
        action.payload as string,
      );
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== UPLOAD PRODUCT IMAGES ====================
    builder.addCase(uploadProductImages.pending, (state, action) => {
      setLoading(state, "uploadImages", "uploadImages");
      state.currentOperation = {
        type: "uploadImages",
        productId: action.meta.arg.productId,
        shopId: null,
      };
    });
    builder.addCase(uploadProductImages.fulfilled, (state, action) => {
      clearLoading(state, "uploadImages");
      state.currentOperation = { type: null, productId: null, shopId: null };
      const productId = action.meta.arg.productId;
      const response = action.payload;

      // Update product cache
      if (state.productsById[productId]) {
        state.productsById[productId] = {
          ...state.productsById[productId]!,
          feature_image_url: response.feature_image_url || undefined,
          image_gallery:
            response.image_gallery ||
            state.productsById[productId]!.image_gallery,
        };
      }
    });
    builder.addCase(uploadProductImages.rejected, (state, action) => {
      setError(state, "uploadImages", "uploadImages", action.payload as string);
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== BULK UPDATE PRODUCTS ====================
    builder.addCase(bulkUpdateProducts.pending, (state) => {
      setLoading(state, "bulkUpdate", "bulkUpdate");
      state.currentOperation = {
        type: "bulkUpdate",
        productId: null,
        shopId: null,
      };
    });
    builder.addCase(bulkUpdateProducts.fulfilled, (state) => {
      clearLoading(state, "bulkUpdate");
      state.currentOperation = { type: null, productId: null, shopId: null };
    });
    builder.addCase(bulkUpdateProducts.rejected, (state, action) => {
      setError(state, "bulkUpdate", "bulkUpdate", action.payload as string);
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== APPROVE PRODUCT ADMIN ====================
    builder.addCase(approveProductAdmin.pending, (state, action) => {
      setLoading(state, "approveProduct", "approveProduct");
      state.currentOperation = {
        type: "approve",
        productId: action.meta.arg,
        shopId: null,
      };
    });
    builder.addCase(approveProductAdmin.fulfilled, (state, action) => {
      clearLoading(state, "approveProduct");
      state.currentOperation = { type: null, productId: null, shopId: null };
      const productId = action.meta.arg;

      // Update product cache
      if (state.productsById[productId]) {
        state.productsById[productId] = {
          ...state.productsById[productId]!,
          is_approved: true,
          status: ProductStatus.PUBLISHED,
        };
      }
    });
    builder.addCase(approveProductAdmin.rejected, (state, action) => {
      setError(
        state,
        "approveProduct",
        "approveProduct",
        action.payload as string,
      );
      state.currentOperation = { type: null, productId: null, shopId: null };
    });

    // ==================== FETCH IMPORT/EXPORT PROGRESS ====================
    builder.addCase(fetchImportExportProgress.pending, (state) => {
      setLoading(state, "importExportProgress", "importExportProgress");
    });
    builder.addCase(fetchImportExportProgress.fulfilled, (state, action) => {
      clearLoading(state, "importExportProgress");
      const taskId = action.meta.arg;
      state.importExportProgress[taskId] = action.payload;
    });
    builder.addCase(fetchImportExportProgress.rejected, (state, action) => {
      setError(
        state,
        "importExportProgress",
        "importExportProgress",
        action.payload as string,
      );
    });
  },
});

export const {
  clearProductErrors,
  clearError,
  setCurrentOperation,
  clearCurrentOperation,
  updateProductInCache,
  removeProductFromCache,
  clearAllProductCaches,
  clearSellerProducts,
  clearShopProducts,
  clearSearchResults,
  clearAllSearchResults,
  resetProductState,
    saveFormDraft,        // ✅ YENİ
  clearFormDraft,       // ✅ YENİ
  setSelectedProduct, 
} = productSlice.actions;


// ==================== SELECTORS ====================
export const selectProductFormDraft = (state: { product: ProductState }) => state.product.formData;
export const selectSelectedProduct = (state: { product: ProductState }) => state.product.selectedProduct;
export const selectCurrentOperation = (state: { product: ProductState }) => state.product.currentOperation;
export const selectProductLoading = (state: { product: ProductState }) => state.product.loading;
export const selectProductErrors = (state: { product: ProductState }) => state.product.errors;

export default productSlice.reducer;
