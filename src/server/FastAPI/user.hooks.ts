import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";
import type { 
  UserResponse, 
  UserPublic, 
  UserUpdateRequest,
  UserStats 
} from "../../types/user.types";

// ==================== USER QUERIES ====================

// ✅ Mevcut kullanıcıyı getir (users/me)
export const useCurrentUser = () => {
  return useQuery<UserResponse, Error>({
    queryKey: ["user", "current"],
    queryFn: async () => {
      try {
        // 🔴 DÜZELT: "/apio/users/me" → "/api/users/me"
        const response = await apiClient.get<UserResponse>("/api/users/me");
        
        // ✅ response varsa döndür
        if (!response) {
          throw new Error("No data received");
        }
        
        return response;
      } catch (error) {
        console.error("❌ useCurrentUser error:", error);
        throw error; // React Query'e hatayı fırlat
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};


// ✅ Public user profile getir (users/{id}/public)
export const useUserPublicProfile = (userId: string) => {
  return useQuery<UserPublic, Error>({
    queryKey: ["user", "public", userId],
    queryFn: async () => {
      return await apiClient.get<UserPublic>(`/api/users/${userId}/public`);
    },
    enabled: !!userId, // userId varsa çalış
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

// ✅ User statistics getir (users/me/stats)
export const useUserStats = () => {
  return useQuery<UserStats, Error>({
    queryKey: ["user", "stats"],
    queryFn: async () => {
      return await apiClient.get<UserStats>("/api/users/me/stats");
    },
    staleTime: 1 * 60 * 1000, // 1 dakika
  });
};

// ✅ User preferences getir (users/me/preferences)
export const useUserPreferences = () => {
  return useQuery<Record<string, unknown>, Error>({
    queryKey: ["user", "preferences"],
    queryFn: async () => {
      const response = await apiClient.get<{ preferences: Record<string, unknown> }>(
        "/api/users/me/preferences"
      );
      return response.preferences;
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

// ==================== USER MUTATIONS ====================

// ✅ Profil güncelle (PUT /users/me)
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse, Error, UserUpdateRequest>({
    mutationFn: async (data: UserUpdateRequest) => {
      const response = await apiClient.put<UserResponse>("/api/users/me", data);
      return response;
    },
    onSuccess: (updatedUser) => {
      // Cache'i güncelle
      queryClient.setQueryData(["user", "current"], updatedUser);
      queryClient.setQueryData(["user", "current"], (old: UserResponse | undefined) => {
        if (!old) return updatedUser;
        return {
          ...old,
          ...updatedUser,
        };
      });
      queryClient.invalidateQueries({ queryKey: ["user", "preferences"] });
      queryClient.invalidateQueries({ queryKey: ["user", "stats"] });
    },
  });
};

export const useBecomeSeller = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{
    message: string; 
    user_id: string; 
    new_role: string;
    seller_since?: string;
  }, Error, void>({
    mutationFn: async () => {
      return await apiClient.post<{
        message: string; 
        user_id: string; 
        new_role: string;
        seller_since?: string;
      }>("/users/me/become-seller");
    },
    onSuccess: () => {
      // User cache'ini invalidate et
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
      queryClient.invalidateQueries({ queryKey: ["user", "stats"] });
    },
  });
};

// ✅ Preferences güncelle (PUT /users/me/preferences)
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{
    message: string; 
    preferences: Record<string, unknown>;
  }, Error, Record<string, unknown>>({
    mutationFn: async (preferences: Record<string, unknown>) => {
      return await apiClient.put<{
        message: string; 
        preferences: Record<string, unknown>;
      }>("/api/users/me/preferences", { preferences });
    },
    onSuccess: (data) => {
      // Preferences cache'ini güncelle
      queryClient.setQueryData(["user", "preferences"], data.preferences);
      
      // Current user cache'ini invalidate et (preferences değişti)
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
};

// ✅ Hesabı sil (DELETE /users/me)
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{
    message: string; 
    user_id: string; 
    email: string;
  }, Error, void>({
    mutationFn: async () => {
      return await apiClient.delete<{
        message: string; 
        user_id: string; 
        email: string;
      }>("/api/users/me");
    },
    onSuccess: () => {
      // Tüm user ve auth cache'lerini temizle
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["auth"] });
    },
  });
};


// ==================== DATABASE STATS HOOKS ====================

export interface DatabaseStats {
  timestamp: string;
  database: string;
  statistics: {
    users: {
      total: number;
      active: number;
      inactive: number;
      sellers: number;
      admins: number;
      regular: number;
    };
    growth: {
      last_7_days: number;
      active_percentage: number;
    };
    auth_providers: {
      google: number;
      apple: number;
      email: number;
      unknown: number;
    };
  };
}

// ✅ Database statistics getir (/db/stats)
export const useDatabaseStats = () => {
  return useQuery<DatabaseStats, Error>({
    queryKey: ["database", "stats"],
    queryFn: async () => {
      return await apiClient.get<DatabaseStats>("/db/stats");
    },
    staleTime: 30 * 1000, // 30 saniye
    retry: 2,
  });
};

// ✅ Database health check (basit versiyon)