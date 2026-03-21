import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from "../api/apiClient";
import type {
  CartResponse,
  CartItemResponse,
  CartItemAdd,
  CartItemUpdate,
  CartApplyCoupon,
  CartShippingUpdate,
  CartCheckoutPreview,
  CartEstimateRequest,
  CartEstimateResponse,
  CartBulkUpdate,
  ApiResponse,
  CartSearchParams,
  CartStats,
  ShopCartStats,
  CartStatus,
  CartCurrency,
  CartState as CartStateType,
  CartItemCreate,
  CartMergeRequest,
  CartBulkActionResponse,
} from "../types/cart.types";
import axios from "axios";

// ==================== STATE TYPES ====================
interface CartState {
  // Current user's cart
  currentCart: CartResponse | null;
  
  // Carts by ID cache (for admin/seller)
  cartsById: {
    [cartId: string]: CartResponse | null;
  };
  
  // Carts by user ID (admin)
  cartsByUserId: {
    [userId: string]: CartResponse[] | null;
  };
  
  // Abandoned carts by shop ID
  abandonedCartsByShop: {
    [shopId: string]: CartResponse[] | null;
  };
  
  // Search results
  searchResults: {
    [queryKey: string]: CartResponse[] | null;
  };
  
  // Cart statistics
  stats: CartStats | null;
  
  // Shop cart statistics
  shopStats: {
    [shopId: string]: ShopCartStats | null;
  };
  
  // Cart estimate results
  estimates: {
    [estimateKey: string]: CartEstimateResponse | null;
  };
  
  // Checkout previews
  checkoutPreviews: {
    [cartId: string]: CartCheckoutPreview | null;
  };
  
  // Guest cart data (for cart merging)
  guestCart: {
    items: CartItemCreate[];
    session_id: string | null;
    last_updated: string | null;
  };
  
  // Loading states
  loading: {
    fetchCart: boolean;
    fetchCartById: boolean;
    fetchAbandonedCarts: boolean;
    fetchUserCarts: boolean;
    searchCarts: boolean;
    fetchCartStats: boolean;
    fetchShopCartStats: boolean;
    addItem: boolean;
    updateItem: boolean;
    removeItem: boolean;
    clearCart: boolean;
    applyCoupon: boolean;
    removeCoupon: boolean;
    updateShipping: boolean;
    getCheckoutPreview: boolean;
    mergeCarts: boolean;
    getEstimate: boolean;
    bulkUpdate: boolean;
    fetchAdminCarts: boolean;
  };
  
  // Errors
  errors: {
    fetchCart: string | null;
    fetchCartById: string | null;
    fetchAbandonedCarts: string | null;
    fetchUserCarts: string | null;
    searchCarts: string | null;
    fetchCartStats: string | null;
    fetchShopCartStats: string | null;
    addItem: string | null;
    updateItem: string | null;
    removeItem: string | null;
    clearCart: string | null;
    applyCoupon: string | null;
    removeCoupon: string | null;
    updateShipping: string | null;
    getCheckoutPreview: string | null;
    mergeCarts: string | null;
    getEstimate: string | null;
    bulkUpdate: string | null;
    fetchAdminCarts: string | null;
  };
  
  // Current operations
  currentOperation: {
    type: string | null;
    cartId: string | null;
    userId: string | null;
    shopId: string | null;
    productId: string | null;
  };
}

// ==================== INITIAL STATE ====================
const initialState: CartState = {
  currentCart: null,
  cartsById: {},
  cartsByUserId: {},
  abandonedCartsByShop: {},
  searchResults: {},
  stats: null,
  shopStats: {},
  estimates: {},
  checkoutPreviews: {},
  guestCart: {
    items: [],
    session_id: null,
    last_updated: null,
  },
  loading: {
    fetchCart: false,
    fetchCartById: false,
    fetchAbandonedCarts: false,
    fetchUserCarts: false,
    searchCarts: false,
    fetchCartStats: false,
    fetchShopCartStats: false,
    addItem: false,
    updateItem: false,
    removeItem: false,
    clearCart: false,
    applyCoupon: false,
    removeCoupon: false,
    updateShipping: false,
    getCheckoutPreview: false,
    mergeCarts: false,
    getEstimate: false,
    bulkUpdate: false,
    fetchAdminCarts: false,
  },
  errors: {
    fetchCart: null,
    fetchCartById: null,
    fetchAbandonedCarts: null,
    fetchUserCarts: null,
    searchCarts: null,
    fetchCartStats: null,
    fetchShopCartStats: null,
    addItem: null,
    updateItem: null,
    removeItem: null,
    clearCart: null,
    applyCoupon: null,
    removeCoupon: null,
    updateShipping: null,
    getCheckoutPreview: null,
    mergeCarts: null,
    getEstimate: null,
    bulkUpdate: null,
    fetchAdminCarts: null,
  },
  currentOperation: {
    type: null,
    cartId: null,
    userId: null,
    shopId: null,
    productId: null,
  },
};

// ==================== ASYNC THUNKS ====================

// ✅ Fetch current user's cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<CartResponse>>("/carts/my");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch cart"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch cart");
    }
  }
);

// ✅ Fetch cart by ID (admin)
export const fetchCartById = createAsyncThunk(
  "cart/fetchCartById",
  async (cartId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<CartResponse>>(`/carts/${cartId}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch cart"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch cart");
    }
  }
);

// ✅ Fetch abandoned carts
export const fetchAbandonedCarts = createAsyncThunk(
  "cart/fetchAbandonedCarts",
  async (
    { shopId, filters }: {
      shopId?: string;
      filters?: {
        date_from?: string;
        date_to?: string;
        min_total?: number;
        max_total?: number;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (shopId) params.append("shop_id", shopId);
      if (filters?.date_from) params.append("date_from", filters.date_from);
      if (filters?.date_to) params.append("date_to", filters.date_to);
      if (filters?.min_total !== undefined) params.append("min_total", filters.min_total.toString());
      if (filters?.max_total !== undefined) params.append("max_total", filters.max_total.toString());

      const url = `/carts/abandoned${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await apiClient.get<ApiResponse<CartResponse[]>>(url);
      return { data: response.data, shopId };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch abandoned carts"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch abandoned carts");
    }
  }
);

// ✅ Fetch user carts (admin)
export const fetchUserCarts = createAsyncThunk(
  "cart/fetchUserCarts",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<CartResponse[]>>(`/carts/user/${userId}`);
      return { data: response.data, userId };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch user carts"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch user carts");
    }
  }
);

// ✅ Search carts (admin)
export const searchCarts = createAsyncThunk(
  "cart/searchCarts",
  async (searchParams: CartSearchParams, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      if (searchParams.search) params.append("search", searchParams.search);
      if (searchParams.status) params.append("status", searchParams.status);
      if (searchParams.shop_id) params.append("shop_id", searchParams.shop_id);
      if (searchParams.user_id) params.append("user_id", searchParams.user_id);
      if (searchParams.date_from) params.append("date_from", searchParams.date_from);
      if (searchParams.date_to) params.append("date_to", searchParams.date_to);
      if (searchParams.has_digital !== undefined) params.append("has_digital", searchParams.has_digital.toString());
      if (searchParams.has_physical !== undefined) params.append("has_physical", searchParams.has_physical.toString());
      if (searchParams.min_total !== undefined) params.append("min_total", searchParams.min_total.toString());
      if (searchParams.max_total !== undefined) params.append("max_total", searchParams.max_total.toString());
      if (searchParams.page) params.append("page", searchParams.page.toString());
      if (searchParams.limit) params.append("limit", searchParams.limit.toString());
      if (searchParams.sort_by) params.append("sort_by", searchParams.sort_by);
      if (searchParams.sort_order) params.append("sort_order", searchParams.sort_order);

      const url = `/carts/search${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await apiClient.get<ApiResponse<CartResponse[]>>(url);
      return { data: response.data, params: searchParams };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to search carts"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to search carts");
    }
  }
);

// ✅ Fetch cart statistics
export const fetchCartStats = createAsyncThunk(
  "cart/fetchCartStats",
  async (
    { period = "month", shopId }: { period?: "day" | "week" | "month" | "year"; shopId?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("period", period);
      if (shopId) params.append("shop_id", shopId);

      const url = `/carts/stats${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await apiClient.get<ApiResponse<CartStats | ShopCartStats>>(url);
      return { data: response.data, shopId };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch cart statistics"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch cart statistics");
    }
  }
);

// ✅ Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (itemData: CartItemAdd, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApiResponse<CartResponse>>("/carts/items", itemData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add item to cart"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to add item to cart");
    }
  }
);

// ✅ Update cart item
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { productId, updateData }: { productId: string; updateData: CartItemUpdate },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put<ApiResponse<CartResponse>>(
        `/carts/items/${productId}`,
        updateData
      );
      return { data: response.data, productId };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update cart item"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update cart item");
    }
  }
);

// ✅ Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete<ApiResponse<CartResponse>>(`/carts/items/${productId}`);
      return { data: response.data, productId };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to remove item from cart"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to remove item from cart");
    }
  }
);

// ✅ Clear cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete<ApiResponse<CartResponse>>("/carts");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to clear cart"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to clear cart");
    }
  }
);

// ✅ Apply coupon
export const applyCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async (couponData: CartApplyCoupon, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApiResponse<CartResponse>>("/carts/coupon", couponData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to apply coupon"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to apply coupon");
    }
  }
);

// ✅ Remove coupon
export const removeCoupon = createAsyncThunk(
  "cart/removeCoupon",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete<ApiResponse<CartResponse>>("/carts/coupon");
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to remove coupon"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to remove coupon");
    }
  }
);

// ✅ Update shipping
export const updateShipping = createAsyncThunk(
  "cart/updateShipping",
  async (shippingData: CartShippingUpdate, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<ApiResponse<CartResponse>>("/carts/shipping", shippingData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update shipping"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update shipping");
    }
  }
);

// ✅ Get checkout preview
export const getCheckoutPreview = createAsyncThunk(
  "cart/getCheckoutPreview",
  async (
    { shippingAddress, couponCode }: {
      shippingAddress?: Record<string, unknown>;
      couponCode?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (shippingAddress) {
        params.append("shipping_address", JSON.stringify(shippingAddress));
      }
      if (couponCode) {
        params.append("coupon_code", couponCode);
      }

      const url = `/carts/checkout/preview${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await apiClient.get<ApiResponse<CartCheckoutPreview>>(url);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to get checkout preview"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to get checkout preview");
    }
  }
);

// ✅ Merge carts (guest to user)
export const mergeCarts = createAsyncThunk(
  "cart/mergeCarts",
  async (mergeData: CartMergeRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApiResponse<CartResponse>>("/carts/merge", mergeData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to merge carts"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to merge carts");
    }
  }
);

// ✅ Get cart estimate
export const getCartEstimate = createAsyncThunk(
  "cart/getCartEstimate",
  async (estimateData: CartEstimateRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ApiResponse<CartEstimateResponse>>("/carts/estimate", estimateData);
      return { data: response.data, estimateData };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to get cart estimate"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to get cart estimate");
    }
  }
);

// ✅ Bulk update carts (admin)
export const bulkUpdateCarts = createAsyncThunk(
  "cart/bulkUpdateCarts",
  async (bulkData: CartBulkUpdate, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<CartBulkActionResponse>("/carts/bulk/action", bulkData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to bulk update carts"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to bulk update carts");
    }
  }
);

// ✅ Fetch admin carts
export const fetchAdminCarts = createAsyncThunk(
  "cart/fetchAdminCarts",
  async (searchParams: CartSearchParams, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      if (searchParams.search) params.append("search", searchParams.search);
      if (searchParams.status) params.append("status", searchParams.status);
      if (searchParams.shop_id) params.append("shop_id", searchParams.shop_id);
      if (searchParams.user_id) params.append("user_id", searchParams.user_id);
      if (searchParams.date_from) params.append("date_from", searchParams.date_from);
      if (searchParams.date_to) params.append("date_to", searchParams.date_to);
      if (searchParams.has_digital !== undefined) params.append("has_digital", searchParams.has_digital.toString());
      if (searchParams.has_physical !== undefined) params.append("has_physical", searchParams.has_physical.toString());
      if (searchParams.min_total !== undefined) params.append("min_total", searchParams.min_total.toString());
      if (searchParams.max_total !== undefined) params.append("max_total", searchParams.max_total.toString());
      if (searchParams.page) params.append("page", searchParams.page.toString());
      if (searchParams.limit) params.append("limit", searchParams.limit.toString());
      if (searchParams.sort_by) params.append("sort_by", searchParams.sort_by);
      if (searchParams.sort_order) params.append("sort_order", searchParams.sort_order);

      const url = `/carts/admin/list${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await apiClient.get<ApiResponse<CartResponse[]>>(url);
      return { data: response.data, params: searchParams };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch admin carts"
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch admin carts");
    }
  }
);

// ==================== SLICE ====================
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Clear errors
    clearCartErrors: (state) => {
      Object.keys(state.errors).forEach((key) => {
        state.errors[key as keyof typeof state.errors] = null;
      });
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
        cartId?: string | null;
        userId?: string | null;
        shopId?: string | null;
        productId?: string | null;
      }>
    ) => {
      state.currentOperation = {
        type: action.payload.type,
        cartId: action.payload.cartId || null,
        userId: action.payload.userId || null,
        shopId: action.payload.shopId || null,
        productId: action.payload.productId || null,
      };
    },

    // Clear current operation
    clearCurrentOperation: (state) => {
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    },

    // Update cart in cache
    updateCartInCache: (
      state,
      action: PayloadAction<{
        cartId: string;
        updates: Partial<CartResponse>;
      }>
    ) => {
      const { cartId, updates } = action.payload;

      // Update in cartsById
      if (state.cartsById[cartId]) {
        state.cartsById[cartId] = {
          ...state.cartsById[cartId]!,
          ...updates,
        };
      }

      // Update in current cart if it's the same cart
      if (state.currentCart?.id === cartId) {
        state.currentCart = {
          ...state.currentCart,
          ...updates,
        };
      }
    },

    // Remove cart from cache
    removeCartFromCache: (state, action: PayloadAction<string>) => {
      const cartId = action.payload;

      // Remove from cartsById
      if (state.cartsById[cartId]) {
        delete state.cartsById[cartId];
      }

      // Remove from current cart if it's the same cart
      if (state.currentCart?.id === cartId) {
        state.currentCart = null;
      }
    },

    // Clear all cart caches
    clearAllCartCaches: (state) => {
      state.cartsById = {};
      state.cartsByUserId = {};
      state.abandonedCartsByShop = {};
      state.searchResults = {};
      state.shopStats = {};
      state.estimates = {};
      state.checkoutPreviews = {};
    },

    // Clear abandoned carts cache for shop
    clearAbandonedCarts: (state, action: PayloadAction<string>) => {
      const shopId = action.payload;
      if (state.abandonedCartsByShop[shopId]) {
        delete state.abandonedCartsByShop[shopId];
      }
    },

    // Clear user carts cache
    clearUserCarts: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.cartsByUserId[userId]) {
        delete state.cartsByUserId[userId];
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

    // Clear checkout preview
    clearCheckoutPreview: (state, action: PayloadAction<string>) => {
      const cartId = action.payload;
      if (state.checkoutPreviews[cartId]) {
        delete state.checkoutPreviews[cartId];
      }
    },

    // Clear cart estimate
    clearCartEstimate: (state, action: PayloadAction<string>) => {
      const estimateKey = action.payload;
      if (state.estimates[estimateKey]) {
        delete state.estimates[estimateKey];
      }
    },

    // Update guest cart
    updateGuestCart: (
      state,
      action: PayloadAction<{
        items: CartItemCreate[];
        session_id?: string;
      }>
    ) => {
      state.guestCart.items = action.payload.items;
      if (action.payload.session_id) {
        state.guestCart.session_id = action.payload.session_id;
      }
      state.guestCart.last_updated = new Date().toISOString();
    },

    // Clear guest cart
    clearGuestCart: (state) => {
      state.guestCart = {
        items: [],
        session_id: null,
        last_updated: null,
      };
    },

    // Reset cart state
    resetCartState: () => initialState,
  },
  extraReducers: (builder) => {
    // Helper function to set loading and clear error
    const setLoading = (
      state: CartState,
      loadingKey: keyof CartState["loading"],
      errorKey: keyof CartState["errors"]
    ) => {
      state.loading[loadingKey] = true;
      state.errors[errorKey] = null;
    };

    // Helper function to clear loading and set error
    const setError = (
      state: CartState,
      loadingKey: keyof CartState["loading"],
      errorKey: keyof CartState["errors"],
      error: string
    ) => {
      state.loading[loadingKey] = false;
      state.errors[errorKey] = error;
    };

    // Helper function to clear loading
    const clearLoading = (
      state: CartState,
      loadingKey: keyof CartState["loading"]
    ) => {
      state.loading[loadingKey] = false;
    };

    // ==================== FETCH CART ====================
    builder.addCase(fetchCart.pending, (state) => {
      setLoading(state, "fetchCart", "fetchCart");
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      clearLoading(state, "fetchCart");
      state.currentCart = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      setError(state, "fetchCart", "fetchCart", action.payload as string);
    });

    // ==================== FETCH CART BY ID ====================
    builder.addCase(fetchCartById.pending, (state) => {
      setLoading(state, "fetchCartById", "fetchCartById");
    });
    builder.addCase(fetchCartById.fulfilled, (state, action) => {
      clearLoading(state, "fetchCartById");
      state.cartsById[action.payload.id] = action.payload;
    });
    builder.addCase(fetchCartById.rejected, (state, action) => {
      setError(state, "fetchCartById", "fetchCartById", action.payload as string);
    });

    // ==================== FETCH ABANDONED CARTS ====================
    builder.addCase(fetchAbandonedCarts.pending, (state) => {
      setLoading(state, "fetchAbandonedCarts", "fetchAbandonedCarts");
    });
    builder.addCase(fetchAbandonedCarts.fulfilled, (state, action) => {
      clearLoading(state, "fetchAbandonedCarts");
      const { data, shopId } = action.payload;
      if (shopId) {
        state.abandonedCartsByShop[shopId] = data;
      }
    });
    builder.addCase(fetchAbandonedCarts.rejected, (state, action) => {
      setError(state, "fetchAbandonedCarts", "fetchAbandonedCarts", action.payload as string);
    });

    // ==================== FETCH USER CARTS ====================
    builder.addCase(fetchUserCarts.pending, (state) => {
      setLoading(state, "fetchUserCarts", "fetchUserCarts");
    });
    builder.addCase(fetchUserCarts.fulfilled, (state, action) => {
      clearLoading(state, "fetchUserCarts");
      const { data, userId } = action.payload;
      state.cartsByUserId[userId] = data;
    });
    builder.addCase(fetchUserCarts.rejected, (state, action) => {
      setError(state, "fetchUserCarts", "fetchUserCarts", action.payload as string);
    });

    // ==================== SEARCH CARTS ====================
    builder.addCase(searchCarts.pending, (state) => {
      setLoading(state, "searchCarts", "searchCarts");
    });
    builder.addCase(searchCarts.fulfilled, (state, action) => {
      clearLoading(state, "searchCarts");
      const { data, params } = action.payload;
      const queryKey = JSON.stringify(params);
      state.searchResults[queryKey] = data;
    });
    builder.addCase(searchCarts.rejected, (state, action) => {
      setError(state, "searchCarts", "searchCarts", action.payload as string);
    });

    // ==================== FETCH CART STATS ====================
    builder.addCase(fetchCartStats.pending, (state) => {
      setLoading(state, "fetchCartStats", "fetchCartStats");
    });
    builder.addCase(fetchCartStats.fulfilled, (state, action) => {
      clearLoading(state, "fetchCartStats");
      const { data, shopId } = action.payload;
      
      if (shopId) {
        // Shop-specific stats
        state.shopStats[shopId] = data as ShopCartStats;
      } else {
        // Global stats
        state.stats = data as CartStats;
      }
    });
    builder.addCase(fetchCartStats.rejected, (state, action) => {
      setError(state, "fetchCartStats", "fetchCartStats", action.payload as string);
    });

    // ==================== ADD TO CART ====================
    builder.addCase(addToCart.pending, (state) => {
      setLoading(state, "addItem", "addItem");
      state.currentOperation = {
        type: "addItem",
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      clearLoading(state, "addItem");
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
      state.currentCart = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      setError(state, "addItem", "addItem", action.payload as string);
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });

    // ==================== UPDATE CART ITEM ====================
    builder.addCase(updateCartItem.pending, (state, action) => {
      setLoading(state, "updateItem", "updateItem");
      state.currentOperation = {
        type: "updateItem",
        cartId: null,
        userId: null,
        shopId: null,
        productId: action.meta.arg.productId,
      };
    });
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      clearLoading(state, "updateItem");
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
      state.currentCart = action.payload.data;
    });
    builder.addCase(updateCartItem.rejected, (state, action) => {
      setError(state, "updateItem", "updateItem", action.payload as string);
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });

    // ==================== REMOVE FROM CART ====================
    builder.addCase(removeFromCart.pending, (state, action) => {
      setLoading(state, "removeItem", "removeItem");
      state.currentOperation = {
        type: "removeItem",
        cartId: null,
        userId: null,
        shopId: null,
        productId: action.meta.arg,
      };
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      clearLoading(state, "removeItem");
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
      state.currentCart = action.payload.data;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      setError(state, "removeItem", "removeItem", action.payload as string);
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });

    // ==================== CLEAR CART ====================
    builder.addCase(clearCart.pending, (state) => {
      setLoading(state, "clearCart", "clearCart");
      state.currentOperation = {
        type: "clearCart",
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });
    builder.addCase(clearCart.fulfilled, (state, action) => {
      clearLoading(state, "clearCart");
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
      state.currentCart = action.payload;
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      setError(state, "clearCart", "clearCart", action.payload as string);
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });

    // ==================== APPLY COUPON ====================
    builder.addCase(applyCoupon.pending, (state) => {
      setLoading(state, "applyCoupon", "applyCoupon");
      state.currentOperation = {
        type: "applyCoupon",
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });
    builder.addCase(applyCoupon.fulfilled, (state, action) => {
      clearLoading(state, "applyCoupon");
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
      state.currentCart = action.payload;
    });
    builder.addCase(applyCoupon.rejected, (state, action) => {
      setError(state, "applyCoupon", "applyCoupon", action.payload as string);
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });

    // ==================== REMOVE COUPON ====================
    builder.addCase(removeCoupon.pending, (state) => {
      setLoading(state, "removeCoupon", "removeCoupon");
      state.currentOperation = {
        type: "removeCoupon",
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });
    builder.addCase(removeCoupon.fulfilled, (state, action) => {
      clearLoading(state, "removeCoupon");
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
      state.currentCart = action.payload;
    });
    builder.addCase(removeCoupon.rejected, (state, action) => {
      setError(state, "removeCoupon", "removeCoupon", action.payload as string);
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });

    // ==================== UPDATE SHIPPING ====================
    builder.addCase(updateShipping.pending, (state) => {
      setLoading(state, "updateShipping", "updateShipping");
      state.currentOperation = {
        type: "updateShipping",
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });
    builder.addCase(updateShipping.fulfilled, (state, action) => {
      clearLoading(state, "updateShipping");
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
      state.currentCart = action.payload;
    });
    builder.addCase(updateShipping.rejected, (state, action) => {
      setError(state, "updateShipping", "updateShipping", action.payload as string);
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });

    // ==================== GET CHECKOUT PREVIEW ====================
    builder.addCase(getCheckoutPreview.pending, (state) => {
      setLoading(state, "getCheckoutPreview", "getCheckoutPreview");
    });
    builder.addCase(getCheckoutPreview.fulfilled, (state, action) => {
      clearLoading(state, "getCheckoutPreview");
      const cartId = state.currentCart?.id;
      if (cartId) {
        state.checkoutPreviews[cartId] = action.payload;
      }
    });
    builder.addCase(getCheckoutPreview.rejected, (state, action) => {
      setError(state, "getCheckoutPreview", "getCheckoutPreview", action.payload as string);
    });

    // ==================== MERGE CARTS ====================
    builder.addCase(mergeCarts.pending, (state) => {
      setLoading(state, "mergeCarts", "mergeCarts");
      state.currentOperation = {
        type: "mergeCarts",
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });
    builder.addCase(mergeCarts.fulfilled, (state, action) => {
      clearLoading(state, "mergeCarts");
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
      state.currentCart = action.payload;
      // Clear guest cart after successful merge
      state.guestCart = {
        items: [],
        session_id: null,
        last_updated: null,
      };
    });
    builder.addCase(mergeCarts.rejected, (state, action) => {
      setError(state, "mergeCarts", "mergeCarts", action.payload as string);
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });

    // ==================== GET CART ESTIMATE ====================
    builder.addCase(getCartEstimate.pending, (state) => {
      setLoading(state, "getEstimate", "getEstimate");
    });
    builder.addCase(getCartEstimate.fulfilled, (state, action) => {
      clearLoading(state, "getEstimate");
      const { data, estimateData } = action.payload;
      const estimateKey = JSON.stringify(estimateData);
      state.estimates[estimateKey] = data;
    });
    builder.addCase(getCartEstimate.rejected, (state, action) => {
      setError(state, "getEstimate", "getEstimate", action.payload as string);
    });

    // ==================== BULK UPDATE CARTS ====================
    builder.addCase(bulkUpdateCarts.pending, (state) => {
      setLoading(state, "bulkUpdate", "bulkUpdate");
      state.currentOperation = {
        type: "bulkUpdate",
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });
    builder.addCase(bulkUpdateCarts.fulfilled, (state) => {
      clearLoading(state, "bulkUpdate");
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });
    builder.addCase(bulkUpdateCarts.rejected, (state, action) => {
      setError(state, "bulkUpdate", "bulkUpdate", action.payload as string);
      state.currentOperation = {
        type: null,
        cartId: null,
        userId: null,
        shopId: null,
        productId: null,
      };
    });

    // ==================== FETCH ADMIN CARTS ====================
    builder.addCase(fetchAdminCarts.pending, (state) => {
      setLoading(state, "fetchAdminCarts", "fetchAdminCarts");
    });
    builder.addCase(fetchAdminCarts.fulfilled, (state, action) => {
      clearLoading(state, "fetchAdminCarts");
      const { data, params } = action.payload;
      const queryKey = JSON.stringify(params);
      state.searchResults[queryKey] = data;
    });
    builder.addCase(fetchAdminCarts.rejected, (state, action) => {
      setError(state, "fetchAdminCarts", "fetchAdminCarts", action.payload as string);
    });
  },
});

export const {
  clearCartErrors,
  clearError,
  setCurrentOperation,
  clearCurrentOperation,
  updateCartInCache,
  removeCartFromCache,
  clearAllCartCaches,
  clearAbandonedCarts,
  clearUserCarts,
  clearSearchResults,
  clearAllSearchResults,
  clearCheckoutPreview,
  clearCartEstimate,
  updateGuestCart,
  clearGuestCart,
  resetCartState,
} = cartSlice.actions;

export default cartSlice.reducer;