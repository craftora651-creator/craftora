// src/server/Gin/theme.ts
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import type { 
  ActiveThemeResponse, 
  ThemeListResponse,
  Section,
  CreateSectionRequest,
  UpdateSectionRequest,
  Page,
  CreatePageRequest,
  UpdatePageRequest,
  Menu,
  UpdateMenuRequest,
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  Media,
  UploadMediaRequest,
  UIState
} from '../../types/theme.types';

// ==================== AXIOS INSTANCE ====================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8082',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - JWT token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== ZUSTAND STORE (UI STATE) ====================
// src/server/Gin/theme.ts

// ==================== ZUSTAND STORE (UI STATE) ====================
export const useUIStore = create<UIState>((set) => ({
  isEditMode: false,
  activeSectionId: null,
  sidebarOpen: false,
  isLoading: false,
  error: null,
  
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  
  setActiveSection: (id: number) => set({ 
    activeSectionId: id, 
    sidebarOpen: true 
  }),
  
  closeSidebar: () => set({ 
    sidebarOpen: false, 
    activeSectionId: null 
  }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),
  
  clearError: () => set({ error: null }),
}));

// ==================== TEMA API'LERİ ====================

// 1. Aktif tema ayarlarını getir
export const useActiveTheme = (shopId: string) => {
  return useQuery({
    queryKey: ['activeTheme', shopId],
    queryFn: async () => {
      const { data } = await api.get<ActiveThemeResponse>(`/api/shop/theme?shop_id=${shopId}`);
      return data;
    },
    enabled: !!shopId,
    staleTime: 5 * 60 * 1000, // 5 dakika cache
  });
};

// 2. Satın alınan temaları listele
export const usePurchasedThemes = () => {
  return useQuery({
    queryKey: ['purchasedThemes'],
    queryFn: async () => {
      const { data } = await api.get<ThemeListResponse[]>('/api/shop/themes');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 3. Tema satın al
export const usePurchaseTheme = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (themeCode: string) => {
      const { data } = await api.post('/api/shop/themes/purchase', { theme_code: themeCode });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchasedThemes'] });
    },
  });
};

// 4. Temayı aktif et
export const useActivateTheme = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (themeId: number) => {
      const { data } = await api.post('/api/shop/themes/activate', { theme_id: themeId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchasedThemes'] });
      queryClient.invalidateQueries({ queryKey: ['activeTheme'] });
    },
  });
};

// 5. Tema ayarlarını güncelle
export const useUpdateThemeSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Record<string, unknown>) => {
      const { data } = await api.put('/api/shop/theme/settings', { updates });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeTheme'] });
    },
  });
};

// ==================== BÖLÜM API'LERİ ====================

// 1. Tüm bölümleri getir
export const useSections = (pageId?: number) => {
  return useQuery({
    queryKey: ['sections', pageId],
    queryFn: async () => {
      const url = pageId ? `/api/shop/sections?page_id=${pageId}` : '/api/shop/sections';
      const { data } = await api.get<Section[]>(url);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// 2. Tek bölüm getir
export const useSection = (id: number) => {
  return useQuery({
    queryKey: ['section', id],
    queryFn: async () => {
      const { data } = await api.get<Section>(`/api/shop/sections/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// 3. Bölüm oluştur
export const useCreateSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (section: CreateSectionRequest) => {
      const { data } = await api.post('/api/shop/sections', section);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};

// 4. Bölüm güncelle
export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: UpdateSectionRequest }) => {
      const { data } = await api.put(`/api/shop/sections/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};

// 5. Bölüm sil
export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/api/shop/sections/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};

// 6. Bölüm sıralamasını güncelle
export const useReorderSections = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderIds: number[]) => {
      const { data } = await api.put('/api/shop/sections/reorder', { order_ids: orderIds });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
};

// ==================== SAYFA API'LERİ ====================

export const usePages = () => {
  return useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { data } = await api.get<Page[]>('/api/shop/pages');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePageBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: async () => {
      const { data } = await api.get<Page>(`/api/shop/pages/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (page: CreatePageRequest) => {
      const { data } = await api.post('/api/shop/pages', page);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: UpdatePageRequest }) => {
      const { data } = await api.put(`/api/shop/pages/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/api/shop/pages/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
};

// ==================== MENÜ API'LERİ ====================

export const useMenus = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: async () => {
      const { data } = await api.get<Menu[]>('/api/shop/menus');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMenuByLocation = (location: string) => {
  return useQuery({
    queryKey: ['menu', location],
    queryFn: async () => {
      const { data } = await api.get<Menu>(`/api/shop/menus/${location}`);
      return data;
    },
    enabled: !!location,
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: UpdateMenuRequest }) => {
      const { data } = await api.put(`/api/shop/menus/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

// ==================== BLOG API'LERİ ====================

export const usePosts = (onlyPublished: boolean = false, limit: number = 10, offset: number = 0) => {
  return useQuery({
    queryKey: ['posts', onlyPublished, limit, offset],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (onlyPublished) params.append('published', 'true');
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());
      const { data } = await api.get<Post[]>(`/api/shop/posts?${params.toString()}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data } = await api.get<Post>(`/api/shop/posts/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: CreatePostRequest) => {
      const { data } = await api.post('/api/shop/posts', post);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: UpdatePostRequest }) => {
      const { data } = await api.put(`/api/shop/posts/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/api/shop/posts/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// ==================== MEDYA API'LERİ ====================

export const useMediaList = (limit: number = 20, offset: number = 0) => {
  return useQuery({
    queryKey: ['media', limit, offset],
    queryFn: async () => {
      const { data } = await api.get<Media[]>(`/api/shop/media?limit=${limit}&offset=${offset}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (media: UploadMediaRequest) => {
      const { data } = await api.post('/api/shop/media/upload', media);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/shop/media/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
};

// ==================== TEMA BAŞLATMA API'SI ====================
// Yeni mağaza oluşturulduğunda tema başlatmak için

export const useInitializeShopTheme = () => {
  return useMutation({
    mutationFn: async (shopId: string) => {
      const { data } = await api.post('/api/shop/theme/initialize', { shop_id: shopId });
      return data;
    },
  });
};

// ==================== CUSTOM HOOK ====================
export const useTheme = (shopId: string) => {
  const activeTheme = useActiveTheme(shopId);
  const sections = useSections();
  const menus = useMenus();
  const pages = usePages();
  const ui = useUIStore();
  
  return {
    settings: activeTheme.data?.settings,
    themeCode: activeTheme.data?.theme_code,
    sections: sections.data,
    menus: menus.data,
    pages: pages.data,
    isLoading: activeTheme.isLoading || sections.isLoading || menus.isLoading,
    error: activeTheme.error?.message || sections.error?.message,
    isEditMode: ui.isEditMode,
    toggleEditMode: ui.toggleEditMode,
    setActiveSection: ui.setActiveSection,
    closeSidebar: ui.closeSidebar,
  };
};


// src/server/Gin/theme.ts - en alta ekle

