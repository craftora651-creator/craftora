import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";
import type{ 
  AuthResponse,
  GoogleAuthRequest,
  AppleAuthRequest,
  TokenResponse,
  RefreshTokenRequest,
  LogoutRequest
} from "../../types/auth.types";
import type { UserResponse } from "../../types/user.types"; // ✅ EKLEDİK

// ==================== AUTH QUERIES ====================

// ✅ Google login URL'sini getir
// ✅ Google login URL'sini getir
export const useGoogleLoginUrl = () => {
  return useQuery<string, Error>({
    queryKey: ["auth", "google", "url"],
    queryFn: async () => {
      // Backend'den Google OAuth URL'ini al
      const response = await apiClient.get<{ url: string }>("/api/auth/google/login");
      return response.url;  // ✅ Backend'den gelen gerçek URL!
    },
    enabled: false, // Manuel tetikleme
    staleTime: Infinity,
  });
};

// ✅ Current user info (auth/me) - GÜNCELLENDİ
export const useAuthMe = () => {
  return useQuery<UserResponse, Error>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      return await apiClient.get<UserResponse>("/auth/me");
    },
    staleTime: 2 * 60 * 1000, // 2 dakika
    retry: false, // Auth hatasında retry yapma
  });
};

// ==================== AUTH MUTATIONS ====================

// ✅ Google login
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthResponse, Error, GoogleAuthRequest>({
    mutationFn: async (data: GoogleAuthRequest) => {
      // ✅ DOĞRUDAN apiClient.googleAuth KULLAN!
      return await apiClient.googleAuth(data.id_token);
    },
    onSuccess: (data) => {
      console.log('✅ Google login success:', data);
      queryClient.removeQueries({ queryKey: ["auth"] });
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
    onError: (error) => {
      console.error('❌ Google login error:', error);
    }
  });
};

// ✅ Apple login
export const useAppleLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AuthResponse, Error, AppleAuthRequest>({
    mutationFn: async (data: AppleAuthRequest) => {
      return await apiClient.post<AuthResponse>("/auth/apple", data);
    },
    onSuccess: () => {
      // Auth ve user cache'lerini temizle
      queryClient.removeQueries({ queryKey: ["auth"] });
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
};

// ✅ Token refresh
export const useRefreshToken = () => {
  return useMutation<TokenResponse, Error, RefreshTokenRequest>({
    mutationFn: async (data: RefreshTokenRequest) => {
      return await apiClient.post<TokenResponse>("/auth/refresh", data);
    },
  });
};

// ✅ Logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ message: string }, Error, LogoutRequest>({
    mutationFn: async (data?: LogoutRequest) => {
      return await apiClient.post<{ message: string }>("/auth/logout", data || {});
    },     onSuccess: () => {
      // Tüm cache'leri temizle
      queryClient.clear();
      
      // Local storage temizle
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    },
    onSettled: () => {
      // Her durumda login sayfasına yönlendir
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });
};