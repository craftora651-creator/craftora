import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";
import type { 
  ShopResponse, 
  ShopPublic, 
  ShopCreateRequest, 
  ShopUpdateRequest,
  ShopSearchParams,
  ShopDetailResponse,
  ShopAdminResponse,
  ShopStats,
  ShopSettingsResponse,
  AdminSuspendRequest,  // Kullanılacak
  ShopMessageResponse,  // Kullanılacak
  ShopDeleteResponse,
  ShopPublishResponse,
  ShopSuspendResponse,
  ShopActivateResponse,
  ShopLogoUploadResponse,
  ShopSettingsUpdateResponse,
  AdminApproveResponse,
  AdminSuspendResponse
} from "../../types/shop.types";

// ==================== SHOP QUERIES ====================

// ✅ Get current user's shops
export const useMyShops = () => {
  return useQuery<ShopResponse[], Error>({
    queryKey: ["shops", "my"],
    queryFn: async () => {
      return await apiClient.get<ShopResponse[]>("/api/shops/my");
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// ✅ Get shop by ID (public)
export const useShopById = (shopId: string, enabled: boolean = true) => {
  return useQuery<ShopDetailResponse, Error>({
    queryKey: ["shops", shopId],
    queryFn: async () => {
      return await apiClient.get<ShopDetailResponse>(`/api/shops/${shopId}`);
    },
    enabled: enabled && !!shopId,
    staleTime: 3 * 60 * 1000,
  });
};

// ✅ Get shop by slug (public marketplace)
export const useShopBySlug = (slug: string, enabled: boolean = true) => {
  return useQuery<ShopDetailResponse, Error>({
    queryKey: ["shops", "slug", slug],
    queryFn: async () => {
      return await apiClient.get<ShopDetailResponse>(`/api/shops/public/${slug}`);
    },
    enabled: enabled && !!slug,
    staleTime: 3 * 60 * 1000,
  });
};

// ✅ Get shop settings (owner only)
export const useShopSettings = (shopId: string) => {
  return useQuery<ShopSettingsResponse, Error>({
    queryKey: ["shops", shopId, "settings"],
    queryFn: async () => {
      return await apiClient.get<ShopSettingsResponse>(`/api/shops/${shopId}/settings`);
    },
    enabled: !!shopId,
    staleTime: 2 * 60 * 1000,
  });
};

// ✅ Get shop statistics (owner only)
export const useShopStats = (shopId: string) => {
  return useQuery<ShopStats, Error>({
    queryKey: ["shops", shopId, "stats"],
    queryFn: async () => {
      return await apiClient.get<ShopStats>(`/api/shops/${shopId}/stats`);
    },
    enabled: !!shopId,
    staleTime: 1 * 60 * 1000,
  });
};

// ✅ List public shops (marketplace)
export const usePublicShops = (params?: ShopSearchParams) => {
  return useQuery<ShopDetailResponse[], Error>({
    queryKey: ["shops", "public", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const url = `/api/shops/public/list${queryParams.toString() ? `?${queryParams}` : ''}`;
      return await apiClient.get<ShopDetailResponse[]>(url);
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ✅ Infinite scroll for public shops
export const useInfinitePublicShops = (params?: Omit<ShopSearchParams, 'page' | 'limit'>) => {
  const limit = 20;
  
  return useInfiniteQuery({
    queryKey: ["shops", "public", "infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams({
        page: pageParam.toString(),
        limit: limit.toString(),
      });
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const url = `/api/shops/public/list?${queryParams}`;
      const response = await apiClient.get<ShopPublic[]>(url);
      return {
        data: response,
        page: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return lastPage.data.length === limit ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== SHOP MUTATIONS ====================

// ✅ Create shop
export const useCreateShop = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ShopResponse, Error, ShopCreateRequest>({
    mutationFn: async (shopData: ShopCreateRequest) => {
      return await apiClient.post<ShopResponse>("/api/shops", shopData);
    },
    onSuccess: (newShop) => {
      queryClient.setQueryData<ShopResponse[]>(["shops", "my"], (old = []) => {
        return [newShop, ...old];
      });
      
      queryClient.setQueryData(["shops", newShop.id], newShop);
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
};

// ✅ Update shop
export const useUpdateShop = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ShopResponse, Error, { shopId: string; data: ShopUpdateRequest }>({
    mutationFn: async ({ shopId, data }) => {
      return await apiClient.put<ShopResponse>(`/api/shops/${shopId}`, data);
    },
    onSuccess: (updatedShop, { shopId }) => {
      queryClient.setQueryData(["shops", shopId], updatedShop);
      
      queryClient.setQueryData<ShopResponse[]>(["shops", "my"], (old = []) => {
        return old.map(shop => 
          shop.id === shopId ? updatedShop : shop
        );
      });
      
      queryClient.invalidateQueries({ queryKey: ["shops", "public"] });
    },
  });
};

// ✅ Delete shop (soft delete - close)
export const useDeleteShop = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ShopDeleteResponse, Error, string>({
    mutationFn: async (shopId: string) => {
      return await apiClient.delete<ShopDeleteResponse>(`/api/shops/${shopId}`);
    },
    onSuccess: (response, shopId) => {
      queryClient.setQueryData<ShopResponse[]>(["shops", "my"], (old = []) => {
        return old.filter(shop => shop.id !== shopId);
      });
      
      queryClient.removeQueries({ queryKey: ["shops", shopId] });
      queryClient.removeQueries({ queryKey: ["shops", shopId, "settings"] });
      queryClient.removeQueries({ queryKey: ["shops", shopId, "stats"] });
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
};

// ✅ Publish shop (draft → active)
export const usePublishShop = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ShopPublishResponse, Error, string>({
    mutationFn: async (shopId: string) => {
      return await apiClient.post<ShopPublishResponse>(`/api/shops/${shopId}/publish`);
    },
    onSuccess: (response, shopId) => {
      queryClient.setQueryData<ShopResponse>(["shops", shopId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: 'active',
          is_approved: true,
          published_at: new Date().toISOString(),
        };
      });
      
      queryClient.setQueryData<ShopResponse[]>(["shops", "my"], (old = []) => {
        return old.map(shop => 
          shop.id === shopId 
            ? { ...shop, status: 'active', is_approved: true, published_at: new Date().toISOString() }
            : shop
        );
      });
    },
  });
};

// ✅ Suspend shop (owner) - ShopSuspendResponse kullanarak
export const useSuspendShop = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ShopSuspendResponse, Error, string>({
    mutationFn: async (shopId: string) => {
      return await apiClient.post<ShopSuspendResponse>(`/api/shops/${shopId}/suspend`);
    },
    onSuccess: (response: ShopMessageResponse, shopId) => { // ShopMessageResponse tipinde
      queryClient.setQueryData<ShopResponse>(["shops", shopId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: 'suspended',
          suspended_at: new Date().toISOString(),
        };
      });
    },
  });
};

// ✅ Activate shop (from suspended)
export const useActivateShop = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ShopActivateResponse, Error, string>({
    mutationFn: async (shopId: string) => {
      return await apiClient.post<ShopActivateResponse>(`/api/shops/${shopId}/activate`);
    },
    onSuccess: (response: ShopMessageResponse, shopId) => { // ShopMessageResponse tipinde
      queryClient.setQueryData<ShopResponse>(["shops", shopId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: 'active',
          suspended_at: null,
        };
      });
    },
  });
};

// ✅ Update shop settings
export const useUpdateShopSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ShopSettingsUpdateResponse, Error, { shopId: string; settings: Record<string, unknown> }>({
    mutationFn: async ({ shopId, settings }) => {
      return await apiClient.put<ShopSettingsUpdateResponse>(`/api/shops/${shopId}/settings`, settings);
    },
    onSuccess: (response, { shopId }) => {
      queryClient.setQueryData(["shops", shopId, "settings"], response);
      
      queryClient.setQueryData<ShopResponse>(["shops", shopId], (old) => {
        if (!old) return old;
        return {
          ...old,
          settings: { ...old.settings, ...response.settings },
        };
      });
    },
  });
};

// ✅ Upload shop logo
export const useUploadShopLogo = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ShopLogoUploadResponse, Error, { shopId: string; file: File }>({
    mutationFn: async ({ shopId, file }) => {
      const formData = new FormData();
      formData.append("file", file);
      
      return await apiClient.post<ShopLogoUploadResponse>(`/api/shops/${shopId}/logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response, { shopId }) => {
      queryClient.setQueryData<ShopResponse>(["shops", shopId], (old) => {
        if (!old) return old;
        return {
          ...old,
          logo_url: response.logo_url,
        };
      });
      
      queryClient.setQueryData<ShopResponse[]>(["shops", "my"], (old = []) => {
        return old.map(shop => 
          shop.id === shopId 
            ? { ...shop, logo_url: response.logo_url }
            : shop
        );
      });
      
      queryClient.invalidateQueries({ queryKey: ["shops", "public"] });
    },
  });
};

// ==================== ADMIN HOOKS ====================

// ✅ Admin: List all shops
export const useAdminShops = (params?: ShopSearchParams) => {
  return useQuery<ShopAdminResponse[], Error>({
    queryKey: ["shops", "admin", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      
      const url = `/api/shops/admin/list${queryParams.toString() ? `?${queryParams}` : ''}`;
      return await apiClient.get<ShopAdminResponse[]>(url);
    },
    staleTime: 2 * 60 * 1000,
  });
};

// ✅ Admin: Approve shop
export const useAdminApproveShop = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AdminApproveResponse, Error, string>({
    mutationFn: async (shopId: string) => {
      return await apiClient.post<AdminApproveResponse>(`/api/shops/admin/${shopId}/approve`);
    },
    onSuccess: (response: ShopMessageResponse, shopId) => { // ShopMessageResponse tipinde
      queryClient.invalidateQueries({ queryKey: ["shops", "admin"] });
      
      queryClient.setQueryData<ShopAdminResponse>(["shops", shopId], (old) => {
        if (!old) return old;
        return {
          ...old,
          is_approved: true,
          status: 'active',
          published_at: new Date().toISOString(),
        };
      });
    },
  });
};

// ✅ Admin: Suspend shop - AdminSuspendRequest kullanarak
export const useAdminSuspendShop = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AdminSuspendResponse, Error, { shopId: string; data: AdminSuspendRequest }>({
    mutationFn: async ({ shopId, data }) => {
      return await apiClient.post<AdminSuspendResponse>(`/api/shops/admin/${shopId}/suspend`, data);
    },
    onSuccess: (response: AdminSuspendResponse & ShopMessageResponse, { shopId }) => {
      queryClient.invalidateQueries({ queryKey: ["shops", "admin"] });
      
      queryClient.setQueryData<ShopAdminResponse>(["shops", shopId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: 'suspended',
          suspended_at: new Date().toISOString(),
          suspension_reason: response.reason,
        };
      });
    },
  });
};

// ==================== UTILITY HOOKS ====================

// ✅ Check if user owns shop
export const useIsShopOwner = (shopId: string) => {
  const { data: shops } = useMyShops();
  return shops?.some(shop => shop.id === shopId) || false;
};

// ✅ Get shop by ID with owner check
export const useShopWithOwnerCheck = (shopId: string) => {
  const shopQuery = useShopById(shopId);
  const isOwner = useIsShopOwner(shopId);
  
  const shopData = shopQuery.data as ShopResponse | undefined;
  
  return {
    ...shopQuery,
    isOwner,
    canEdit: isOwner && (shopData?.status === 'draft' || shopData?.status === 'active'),
  };
};

// ✅ Shop status management helper
export const useShopStatus = (shopId: string) => {
  const { data: shop } = useShopById(shopId);
  
  const shopData = shop as ShopResponse | undefined;
  
  const canPublish = shopData?.status === 'draft';
  const canSuspend = shopData?.status === 'active';
  const canActivate = shopData?.status === 'suspended';
  const canDelete = shopData?.status !== 'closed';
  
  return {
    shop: shopData,
    canPublish,
    canSuspend,
    canActivate,
    canDelete,
    isActive: shopData?.status === 'active',
    isDraft: shopData?.status === 'draft',
    isSuspended: shopData?.status === 'suspended',
    isClosed: shopData?.status === 'closed',
  };
};

// ✅ Generic shop message handler (ShopMessageResponse için)
// shop.hooks.ts'de düzeltme:
export const useShopMessageHandler = () => {
  const queryClient = useQueryClient();
  
  return (response: ShopMessageResponse, shopId: string) => {
    if (response.status) {
      // Type guard ile status'u kontrol edelim
      const validStatuses = ['draft', 'active', 'suspended', 'closed'] as const;
      console.log(validStatuses);
      type ShopStatusType = typeof validStatuses[number];
      const status = response.status as ShopStatusType;
      queryClient.setQueryData<ShopResponse>(["shops", shopId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: status, 
        };
      });
    }
  };
};