import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";
import type {
  CacheItem,
  RequestConfig,
  ApiResponse,
  AuthResponse,
  User,
  CustomInternalAxiosRequestConfig,
  CustomAxiosRequestConfig,
} from "../types/types";

import type {
  FileUploadResponse,
  UploadedFilesListResponse,
  FilePurpose,
  DeleteFileResponse,
} from "../types/types";

import type {
  AnalyticsPeriod,
  DashboardResponse,
  TrafficSourcesResponse,
  RankingResponse,
  TrackShopViewRequest,
  TrackProductViewRequest,
  TrackingResponse,
} from "../types/analytics.types"; // ← YENİ!

class ApiClient {
  private fastApiClient: AxiosInstance;
  private goClient: AxiosInstance;
  private analyticsClient: AxiosInstance;
  private cache: Map<string, CacheItem> = new Map();
  private readonly DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

  constructor() {
    // FastAPI client - PORT 9003
    this.fastApiClient = axios.create({
      baseURL: import.meta.env.VITE_FASTAPI_URL ?? "http://localhost:9004",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Go client - PORT 8082
    this.goClient = axios.create({
      baseURL: import.meta.env.VITE_GO_URL ?? "http://localhost:8082",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    this.analyticsClient = axios.create({
      baseURL: import.meta.env.VITE_ANALYTICS_URL ?? "http://localhost:8083",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  // ==================== PRIVATE METHODS ====================
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  private setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  private removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  }

  private setupInterceptors(): void {
    // ✅ DÜZELTME: CustomInternalAxiosRequestConfig kullan
    const requestInterceptor = (
      config: CustomInternalAxiosRequestConfig,
    ): CustomInternalAxiosRequestConfig => {
      const customConfig = config as CustomInternalAxiosRequestConfig & {
        skipAuth?: boolean;
      };
      if (!customConfig.skipAuth) {
        const token = this.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    };

    // Response interceptor - Handle errors
    // DOĞRU:
    const responseInterceptor = (response: AxiosResponse) => response;
    type RetryConfig = CustomInternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const errorInterceptor = async (error: unknown) => {
      // Axios error değilse direkt fırlat
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as RetryConfig;

      // Token expired (401) and not a retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refresh_token");

          if (refreshToken) {
            const response = await this.goClient.post<{ token: string }>(
              "/service/auth/refresh",
              { refresh_token: refreshToken },
            );
            const newToken = response.data.token;
            this.setToken(newToken);
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.fastApiClient(originalRequest);
          }
        } catch (refreshError: unknown) {
          console.error("Token refresh failed:", refreshError);
          this.removeToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error);
    };
    this.fastApiClient.interceptors.request.use(requestInterceptor);
    this.goClient.interceptors.request.use(requestInterceptor);
    this.analyticsClient.interceptors.request.use(requestInterceptor);
    this.fastApiClient.interceptors.response.use(
      responseInterceptor,
      errorInterceptor,
    );
    this.goClient.interceptors.response.use(
      responseInterceptor,
      errorInterceptor,
    );
    this.analyticsClient.interceptors.response.use(
      // ← YENİ!
      responseInterceptor,
      errorInterceptor,
    );
  }

  // ==================== CACHE METHODS ====================
  private getCacheKey(config: Partial<RequestConfig>): string {
    const { url = "", method = "GET", params, data } = config;
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if cache expired
    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  private setToCache<T>(key: string, data: T, expiresIn?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: expiresIn || this.DEFAULT_CACHE_DURATION,
    });
  }

  // ==================== PUBLIC API METHODS ====================

  // ----- FASTAPI METHODS -----
  async get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    const cacheKey = this.getCacheKey({ ...config, method: "GET", url });
    const useCache = config?.useCache ?? true;

    // Try cache first
    if (useCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached !== null) {
        console.log(`[CACHE HIT] ${url}`);
        return cached;
      }
    }

    // Make request
    const axiosConfig = { ...config } as AxiosRequestConfig;
    const response = await this.fastApiClient.get<T>(url, axiosConfig);
    console.log(`📡 GET ${url}:`, response.data);
    if (response.data === undefined || response.data === null) {
      throw new Error(`Empty response from ${url}`);
    }
    if (Array.isArray(response.data)) {
      return response.data as T;
    }
    if (response.data !== null && typeof response.data === "object") {
      const responseObj = response.data as unknown as Record<string, unknown>;
      if ("success" in responseObj) {
        const apiResponse = responseObj as {
          success: boolean;
          data?: T;
          message?: string;
        };
        if (!apiResponse.success) {
          throw new Error(apiResponse.message || "API error");
        }
        const responseData =
          apiResponse.data !== undefined
            ? apiResponse.data
            : (response.data as T);
        if (useCache && response.status === 200) {
          this.setToCache(cacheKey, responseData, config?.cacheDuration);
        }
        return responseData;
      }
    }
    if (useCache && response.status === 200) {
      this.setToCache(cacheKey, response.data, config?.cacheDuration);
    }
    return response.data as T;
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const axiosConfig = { ...config } as AxiosRequestConfig;
    const response = await this.fastApiClient.post<T>(url, data, axiosConfig); // ✅ ApiResponse<T> DEĞİL!

    console.log(`📡 POST ${url}:`, response.data);
    this.invalidateCache(url);
    return response.data;
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const axiosConfig = { ...config } as AxiosRequestConfig;
    const response = await this.fastApiClient.put<T>(url, data, axiosConfig); // ✅ ApiResponse<T> DEĞİL!

    console.log(`📡 PUT ${url}:`, response.data);
    this.invalidateCache(url);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    const axiosConfig = { ...config } as AxiosRequestConfig;
    const response = await this.fastApiClient.delete<T>(url, axiosConfig);
    console.log(`📡 DELETE ${url}:`, response.data);
    this.invalidateCache(url);

    return response.data;
  }

  // ----- GO SERVICE METHODS -----
  async goGet<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    const axiosConfig = { ...config } as AxiosRequestConfig;
    const response = await this.goClient.get<ApiResponse<T>>(url, axiosConfig);
    return response.data.data;
  }

  async goPost<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const axiosConfig = { ...config } as AxiosRequestConfig;
    const response = await this.goClient.post<T>(url, data, axiosConfig);

    console.log(`📡 goPost ${url}:`, response.data); // Log ekle!

    return response.data; // ✅ DOĞRU!
  }

  // ----- AUTH METHODS -----
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.fastApiClient.post<ApiResponse<AuthResponse>>(
      "/api/auth/login",
      { email, password },
      { skipAuth: true } as CustomAxiosRequestConfig,
    );

    const { access_token, refresh_token, user } = response.data.data; // ✅ token → access_token!

    // Store tokens
    this.setToken(access_token); // ✅ token → access_token!

    if (typeof window !== "undefined") {
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data.data;
  }

  // ----- GOOGLE AUTH -----
  async googleAuth(idToken: string): Promise<AuthResponse> {
  try {
    const response = await this.fastApiClient.post<AuthResponse>(
      "/api/auth/google",
      { id_token: idToken },
      { skipAuth: true } as CustomAxiosRequestConfig,
    );

    // ✅ Token'ı kaydet!
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      console.log("✅ Token kaydedildi!");
    }

    return response.data;
  } catch (error) {
    console.error("Google auth error:", error);
    throw error;
  }
}

  async logout(): Promise<void> {
    try {
      await this.fastApiClient.post("/api/auth/logout");
    } finally {
      this.removeToken();
      this.clearCache();
    }
  }

  async getCurrentUser(): Promise<User> {
    return await this.get<User>("/api/users/me");
  }

  // ==================== ANALYTICS PUBLIC METHODS (tracking - no auth) ====================

  /**
   * Mağaza görüntülenme kaydı (public - skipAuth)
   */
  async trackShopView(data: TrackShopViewRequest): Promise<TrackingResponse> {
    try {
      const response = await this.analyticsClient.post<TrackingResponse>(
        "/api/v1/track/shop-view",
        data,
        { skipAuth: true } as CustomAxiosRequestConfig,
      );
      return response.data;
    } catch (error) {
      console.error("❌ Track shop view failed:", error);
      throw error;
    }
  }

  /**
   * Ürün görüntülenme kaydı (public - skipAuth)
   */
  async trackProductView(
    data: TrackProductViewRequest,
  ): Promise<TrackingResponse> {
    try {
      const response = await this.analyticsClient.post<TrackingResponse>(
        "/api/v1/track/product-view",
        data,
        { skipAuth: true } as CustomAxiosRequestConfig,
      );
      return response.data;
    } catch (error) {
      console.error("❌ Track product view failed:", error);
      throw error;
    }
  }

  // ==================== ANALYTICS PROTECTED METHODS (JWT required) ====================

  /**
   * Dashboard verilerini getir (JWT required)
   */
  async getAnalyticsDashboard(
    period: AnalyticsPeriod = "30d",
  ): Promise<DashboardResponse> {
    try {
      const response = await this.analyticsClient.get<DashboardResponse>(
        `/api/v1/analytics/dashboard?period=${period}`,
      );
      return response.data;
    } catch (error) {
      console.error("❌ Get analytics dashboard failed:", error);
      throw error;
    }
  }

  /**
   * Trafik kaynaklarını getir (JWT required)
   */
  async getTrafficSources(
    period: AnalyticsPeriod = "30d",
  ): Promise<TrafficSourcesResponse> {
    try {
      const response = await this.analyticsClient.get<TrafficSourcesResponse>(
        `/api/v1/analytics/traffic/sources?period=${period}`,
      );
      return response.data;
    } catch (error) {
      console.error("❌ Get traffic sources failed:", error);
      throw error;
    }
  }

  /**
   * Sıralama bilgilerini getir (JWT required)
   */
  async getRanking(): Promise<RankingResponse> {
    try {
      const response = await this.analyticsClient.get<RankingResponse>(
        "/api/v1/analytics/ranking",
      );
      return response.data;
    } catch (error) {
      console.error("❌ Get ranking failed:", error);
      throw error;
    }
  }

  /**
   * Test verisi ekle (development için - public)
   * NOT: Backend'den gelen response tipi belli değilse Record<string, unknown> kullan
   */
  async addAnalyticsTestData(): Promise<Record<string, unknown>> {
    try {
      const response = await this.analyticsClient.get<Record<string, unknown>>(
        "/test/data",
        { skipAuth: true } as CustomAxiosRequestConfig,
      );
      return response.data;
    } catch (error) {
      console.error("❌ Add test data failed:", error);
      throw error;
    }
  }

  async uploadFile(
    file: File,
    userId: string,
    purpose: FilePurpose = "product_file",
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);
    formData.append("purpose", purpose);

    const response = await this.goClient.post<FileUploadResponse>(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  async uploadMultipleFiles(
    files: File[],
    userId: string,
    purpose: FilePurpose = "product_image",
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, userId, purpose),
    );

    const results = await Promise.all(uploadPromises);
    return results.map((r) => r.file.s3_url);
  }

  async getUserFiles(
    userId: string,
    limit: number = 50,
  ): Promise<UploadedFilesListResponse> {
    return await this.goGet<UploadedFilesListResponse>(
      `/upload/user/${userId}?limit=${limit}`,
    );
  }

  async deleteFile(
    fileKey: string,
    userId: string,
  ): Promise<DeleteFileResponse> {
    return await this.goClient
      .delete<DeleteFileResponse>(`/upload/${fileKey}?user_id=${userId}`)
      .then((res) => res.data);
  }

  async quickUpload(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.goClient.post<FileUploadResponse>(
      "/upload/quick",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  }

  // ==================== CACHE MANAGEMENT ====================
  invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const [key] of this.cache.entries()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const apiClient = new ApiClient();
