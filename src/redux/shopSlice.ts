import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from "../api/apiClient";
import type {
  ShopResponse,
  ShopPublic,
  ShopCreateRequest,
  ShopUpdateRequest,
  ShopDetailResponse,
  ShopAdminResponse,
  ShopStats,
  ShopSettingsResponse,
  ShopSearchParams,
} from "../types/shop.types";
import axios from "axios";

// ==================== STATE TYPES ====================
interface ShopState {
  // My shops
  myShops: ShopResponse[];

  // Single shop cache
  shops: {
    [shopId: string]: ShopDetailResponse | null;
  };

  // Public shops cache
  publicShops: ShopPublic[];
  publicShopsPagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  } | null;

  // Admin shops
  adminShops: ShopAdminResponse[];

  // Shop settings cache
  shopSettings: {
    [shopId: string]: ShopSettingsResponse | null;
  };

  // Shop stats cache
  shopStats: {
    [shopId: string]: ShopStats | null;
  };

  // Loading states
  loading: {
    myShops: boolean;
    shopById: boolean;
    publicShops: boolean;
    adminShops: boolean;
    shopSettings: boolean;
    shopStats: boolean;
    createShop: boolean;
    updateShop: boolean;
    deleteShop: boolean;
    publishShop: boolean;
    suspendShop: boolean;
    activateShop: boolean;
    updateSettings: boolean;
    uploadLogo: boolean;
  };

  // Errors
  errors: {
    myShops: string | null;
    shopById: string | null;
    publicShops: string | null;
    adminShops: string | null;
    shopSettings: string | null;
    shopStats: string | null;
    createShop: string | null;
    updateShop: string | null;
    deleteShop: string | null;
    publishShop: string | null;
    suspendShop: string | null;
    activateShop: string | null;
    updateSettings: string | null;
    uploadLogo: string | null;
  };
}

// ==================== INITIAL STATE ====================
const initialState: ShopState = {
  myShops: [],
  shops: {},
  publicShops: [],
  publicShopsPagination: null,
  adminShops: [],
  shopSettings: {},
  shopStats: {},

  loading: {
    myShops: false,
    shopById: false,
    publicShops: false,
    adminShops: false,
    shopSettings: false,
    shopStats: false,
    createShop: false,
    updateShop: false,
    deleteShop: false,
    publishShop: false,
    suspendShop: false,
    activateShop: false,
    updateSettings: false,
    uploadLogo: false,
  },

  errors: {
    myShops: null,
    shopById: null,
    publicShops: null,
    adminShops: null,
    shopSettings: null,
    shopStats: null,
    createShop: null,
    updateShop: null,
    deleteShop: null,
    publishShop: null,
    suspendShop: null,
    activateShop: null,
    updateSettings: null,
    uploadLogo: null,
  },
};

// ==================== ASYNC THUNKS ====================

// ✅ Get current user's shops
export const fetchMyShops = createAsyncThunk(
  "shop/fetchMyShops",
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get<ShopResponse[]>("/shops/my");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch your shops",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch your shops");
    }
  },
);

// ✅ Get shop by ID
export const fetchShopById = createAsyncThunk(
  "shop/fetchShopById",
  async (shopId: string, { rejectWithValue }) => {
    try {
      return await apiClient.get<ShopDetailResponse>(`/shops/${shopId}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch shop",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch shop");
    }
  },
);

// ✅ Get shop by slug
export const fetchShopBySlug = createAsyncThunk(
  "shop/fetchShopBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      return await apiClient.get<ShopDetailResponse>(`/shops/public/${slug}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch shop",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch shop");
    }
  },
);

// ✅ Get shop settings
export const fetchShopSettings = createAsyncThunk(
  "shop/fetchShopSettings",
  async (shopId: string, { rejectWithValue }) => {
    try {
      return await apiClient.get<ShopSettingsResponse>(
        `/shops/${shopId}/settings`,
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch shop settings",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch shop settings");
    }
  },
);

// ✅ Get shop stats
export const fetchShopStats = createAsyncThunk(
  "shop/fetchShopStats",
  async (shopId: string, { rejectWithValue }) => {
    try {
      return await apiClient.get<ShopStats>(`/shops/${shopId}/stats`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch shop stats",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch shop stats");
    }
  },
);

// ✅ List public shops
export const fetchPublicShops = createAsyncThunk(
  "shop/fetchPublicShops",
  async (params: ShopSearchParams | undefined, { rejectWithValue }) => {
    // undefined olarak belirt
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }

      const url = `/shops/public/list${queryParams.toString() ? `?${queryParams}` : ""}`;
      return await apiClient.get<ShopDetailResponse[]>(url);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch public shops",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch public shops");
    }
  },
);

// ✅ Create shop
export const createShop = createAsyncThunk(
  "shop/createShop",
  async (data: ShopCreateRequest, { rejectWithValue }) => {
    try {
      return await apiClient.post<ShopResponse>("/shops", data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to create shop",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to create shop");
    }
  },
);

// ✅ Update shop
export const updateShop = createAsyncThunk(
  "shop/updateShop",
  async (
    { shopId, data }: { shopId: string; data: ShopUpdateRequest },
    { rejectWithValue },
  ) => {
    try {
      return await apiClient.put<ShopResponse>(`/shops/${shopId}`, data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update shop",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update shop");
    }
  },
);

// ✅ Delete shop
export const deleteShop = createAsyncThunk(
  "shop/deleteShop",
  async (shopId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete<{
        message: string;
        shop_id: string;
        shop_name: string;
        status: string;
      }>(`/shops/${shopId}`);
      return { ...response, shopId };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to delete shop",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to delete shop");
    }
  },
);

// ✅ Publish shop
export const publishShop = createAsyncThunk(
  "shop/publishShop",
  async (shopId: string, { rejectWithValue }) => {
    try {
      return await apiClient.post<{
        message: string;
        shop_id: string;
        shop_name: string;
        status: string;
        is_approved: boolean;
      }>(`/shops/${shopId}/publish`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to publish shop",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to publish shop");
    }
  },
);

// ✅ Suspend shop
export const suspendShop = createAsyncThunk(
  "shop/suspendShop",
  async (shopId: string, { rejectWithValue }) => {
    try {
      return await apiClient.post<{
        message: string;
        shop_id: string;
        shop_name: string;
        status: string;
        suspended_at: string;
      }>(`/shops/${shopId}/suspend`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to suspend shop",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to suspend shop");
    }
  },
);

// ✅ Activate shop
export const activateShop = createAsyncThunk(
  "shop/activateShop",
  async (shopId: string, { rejectWithValue }) => {
    try {
      return await apiClient.post<{
        message: string;
        shop_id: string;
        shop_name: string;
        status: string;
      }>(`/shops/${shopId}/activate`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to activate shop",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to activate shop");
    }
  },
);

// ✅ Update shop settings
export const updateShopSettings = createAsyncThunk(
  "shop/updateShopSettings",
  async (
    { shopId, settings }: { shopId: string; settings: Record<string, unknown> },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.put<{
        message: string;
        shop_id: string;
        settings: Record<string, unknown>;
      }>(`/shops/${shopId}/settings`, settings);
      return { ...response, shopId };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update shop settings",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update shop settings");
    }
  },
);

// ✅ Upload shop logo
export const uploadShopLogo = createAsyncThunk(
  "shop/uploadShopLogo",
  async (
    { shopId, file }: { shopId: string; file: File },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<{
        message: string;
        shop_id: string;
        logo_url: string;
        filename: string;
        content_type: string;
        size: number;
      }>(`/shops/${shopId}/logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { ...response, shopId };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to upload logo",
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to upload logo");
    }
  },
);

// ==================== SLICE ====================
const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    // Manual updates
    setMyShops: (state, action: PayloadAction<ShopResponse[]>) => {
      state.myShops = action.payload;
    },
    setShop: (
      state,
      action: PayloadAction<{ shopId: string; shop: ShopDetailResponse }>,
    ) => {
      state.shops[action.payload.shopId] = action.payload.shop;
    },
    updateShopField: (
      state,
      action: PayloadAction<{ shopId: string; field: string; value: unknown }>,
    ) => {
      const { shopId, field, value } = action.payload;
      if (state.shops[shopId]) {
        state.shops[shopId] = {
          ...state.shops[shopId]!,
          [field]: value,
        };
      }
    },
    clearShopErrors: (state) => {
      state.errors = {
        myShops: null,
        shopById: null,
        publicShops: null,
        adminShops: null,
        shopSettings: null,
        shopStats: null,
        createShop: null,
        updateShop: null,
        deleteShop: null,
        publishShop: null,
        suspendShop: null,
        activateShop: null,
        updateSettings: null,
        uploadLogo: null,
      };
    },
    clearShopCache: (state, action: PayloadAction<string>) => {
      const shopId = action.payload;
      delete state.shops[shopId];
      delete state.shopSettings[shopId];
      delete state.shopStats[shopId];
    },
    clearAllShopCache: (state) => {
      state.shops = {};
      state.shopSettings = {};
      state.shopStats = {};
      state.publicShops = [];
      state.publicShopsPagination = null;
    },
    resetShopState: () => initialState,
  },
  extraReducers: (builder) => {
    // ==================== FETCH MY SHOPS ====================
    builder.addCase(fetchMyShops.pending, (state) => {
      state.loading.myShops = true;
      state.errors.myShops = null;
    });
    builder.addCase(fetchMyShops.fulfilled, (state, action) => {
      state.loading.myShops = false;
      state.myShops = action.payload;
    });
    builder.addCase(fetchMyShops.rejected, (state, action) => {
      state.loading.myShops = false;
      state.errors.myShops = action.payload as string;
    });

    // ==================== FETCH SHOP BY ID ====================
    builder.addCase(fetchShopById.pending, (state) => {
      state.loading.shopById = true;
      state.errors.shopById = null;
    });
    builder.addCase(fetchShopById.fulfilled, (state, action) => {
      state.loading.shopById = false;
      state.shops[action.meta.arg] = action.payload;
    });
    builder.addCase(fetchShopById.rejected, (state, action) => {
      state.loading.shopById = false;
      state.errors.shopById = action.payload as string;
    });

    // ==================== FETCH SHOP SETTINGS ====================
    builder.addCase(fetchShopSettings.fulfilled, (state, action) => {
      state.shopSettings[action.meta.arg] = action.payload;
    });

    // ==================== FETCH SHOP STATS ====================
    builder.addCase(fetchShopStats.fulfilled, (state, action) => {
      state.shopStats[action.meta.arg] = action.payload;
    });

    // ==================== FETCH PUBLIC SHOPS ====================
    builder.addCase(fetchPublicShops.pending, (state) => {
      state.loading.publicShops = true;
      state.errors.publicShops = null;
    });
    builder.addCase(fetchPublicShops.fulfilled, (state, action) => {
      state.loading.publicShops = false;
      state.publicShops = action.payload as ShopPublic[];
    });
    builder.addCase(fetchPublicShops.rejected, (state, action) => {
      state.loading.publicShops = false;
      state.errors.publicShops = action.payload as string;
    });

    // ==================== CREATE SHOP ====================
    builder.addCase(createShop.pending, (state) => {
      state.loading.createShop = true;
      state.errors.createShop = null;
    });
    builder.addCase(createShop.fulfilled, (state, action) => {
      state.loading.createShop = false;
      state.myShops = [action.payload, ...state.myShops];
      state.shops[action.payload.id] = action.payload;
    });
    builder.addCase(createShop.rejected, (state, action) => {
      state.loading.createShop = false;
      state.errors.createShop = action.payload as string;
    });

    // ==================== UPDATE SHOP ====================
    builder.addCase(updateShop.pending, (state) => {
      state.loading.updateShop = true;
      state.errors.updateShop = null;
    });
    builder.addCase(updateShop.fulfilled, (state, action) => {
      state.loading.updateShop = false;
      const { shopId } = action.meta.arg;
      state.shops[shopId] = action.payload;

      // Update in my shops list
      state.myShops = state.myShops.map((shop) =>
        shop.id === shopId ? action.payload : shop,
      );
    });
    builder.addCase(updateShop.rejected, (state, action) => {
      state.loading.updateShop = false;
      state.errors.updateShop = action.payload as string;
    });

    // ==================== DELETE SHOP ====================
    builder.addCase(deleteShop.pending, (state) => {
      state.loading.deleteShop = true;
      state.errors.deleteShop = null;
    });
    builder.addCase(deleteShop.fulfilled, (state, action) => {
      state.loading.deleteShop = false;
      const { shopId } = action.payload;

      // Remove from my shops
      state.myShops = state.myShops.filter((shop) => shop.id !== shopId);

      // Remove from cache
      delete state.shops[shopId];
      delete state.shopSettings[shopId];
      delete state.shopStats[shopId];
    });
    builder.addCase(deleteShop.rejected, (state, action) => {
      state.loading.deleteShop = false;
      state.errors.deleteShop = action.payload as string;
    });

    // ==================== PUBLISH SHOP ====================
    builder.addCase(publishShop.pending, (state) => {
      state.loading.publishShop = true;
      state.errors.publishShop = null;
    });
    builder.addCase(publishShop.fulfilled, (state, action) => {
      state.loading.publishShop = false;
      const shopId = action.meta.arg;

      if (state.shops[shopId]) {
        state.shops[shopId] = {
          ...state.shops[shopId]!,
          status: "active",
          is_approved: true,
          published_at: new Date().toISOString(),
        } as ShopDetailResponse;
      }

      // Update in my shops
      state.myShops = state.myShops.map((shop) =>
        shop.id === shopId
          ? {
              ...shop,
              status: "active",
              is_approved: true,
              published_at: new Date().toISOString(),
            }
          : shop,
      );
    });
    builder.addCase(publishShop.rejected, (state, action) => {
      state.loading.publishShop = false;
      state.errors.publishShop = action.payload as string;
    });

    // ==================== SUSPEND SHOP ====================
    builder.addCase(suspendShop.pending, (state) => {
      state.loading.suspendShop = true;
      state.errors.suspendShop = null;
    });
    builder.addCase(suspendShop.fulfilled, (state, action) => {
      state.loading.suspendShop = false;
      const shopId = action.meta.arg;

      if (state.shops[shopId]) {
        state.shops[shopId] = {
          ...state.shops[shopId]!,
          status: "active",
          is_approved: true,
          published_at: new Date().toISOString(),
        } as ShopDetailResponse;
      }
    });
    builder.addCase(suspendShop.rejected, (state, action) => {
      state.loading.suspendShop = false;
      state.errors.suspendShop = action.payload as string;
    });

    // ==================== ACTIVATE SHOP ====================
    builder.addCase(activateShop.pending, (state) => {
      state.loading.activateShop = true;
      state.errors.activateShop = null;
    });
    builder.addCase(activateShop.fulfilled, (state, action) => {
      state.loading.activateShop = false;
      const shopId = action.meta.arg;

      if (state.shops[shopId]) {
        state.shops[shopId] = {
          ...state.shops[shopId]!,
          status: "active",
          suspended_at: null,
        } as ShopDetailResponse;
      }
    });
    builder.addCase(activateShop.rejected, (state, action) => {
      state.loading.activateShop = false;
      state.errors.activateShop = action.payload as string;
    });

    // ==================== UPDATE SHOP SETTINGS ====================
    builder.addCase(updateShopSettings.fulfilled, (state, action) => {
      const { shopId, settings } = action.payload;

      // Update shop settings cache
      const currentShopSettings = state.shopSettings[shopId];
      state.shopSettings[shopId] = {
        shop_id: shopId,
        settings: {
          ...(currentShopSettings?.settings || {}),
          ...settings,
        },
        metadata: currentShopSettings?.metadata || {},
      };

      // Update shop cache
      if (state.shops[shopId]) {
        state.shops[shopId] = {
          ...state.shops[shopId]!,
          settings: { ...state.shops[shopId]!.settings, ...settings },
        } as ShopDetailResponse;
      }
    });

    // ==================== UPLOAD SHOP LOGO ====================
    builder.addCase(uploadShopLogo.fulfilled, (state, action) => {
      const { shopId, logo_url } = action.payload;

      // Update shop cache
      if (state.shops[shopId]) {
        state.shops[shopId] = {
          ...state.shops[shopId]!,
          logo_url,
        } as ShopDetailResponse;
      }

      // Update in my shops
      state.myShops = state.myShops.map((shop) =>
        shop.id === shopId ? { ...shop, logo_url } : shop,
      );
    });
  },
});

export const {
  setMyShops,
  setShop,
  updateShopField,
  clearShopErrors,
  clearShopCache,
  clearAllShopCache,
  resetShopState,
} = shopSlice.actions;

export default shopSlice.reducer;
