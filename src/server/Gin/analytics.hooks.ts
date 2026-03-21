// hooks/analytics.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import type {
  AnalyticsPeriod,
  DashboardResponse,
  TrafficSourcesResponse,
  RankingResponse,
  TrackShopViewRequest,
  TrackProductViewRequest,
  TrackingResponse,
  TestDataResponse,
} from '../../types/analytics.types';

// ==================== QUERY KEYS ====================
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (period: AnalyticsPeriod) => [...analyticsKeys.all, 'dashboard', period] as const,
  traffic: (period: AnalyticsPeriod) => [...analyticsKeys.all, 'traffic', period] as const,
  ranking: () => [...analyticsKeys.all, 'ranking'] as const,
  test: () => [...analyticsKeys.all, 'test'] as const,
};

// ==================== API FONKSİYONLARI ====================
/**
 * Dashboard verilerini getir
 */
const getDashboardAPI = async (period: AnalyticsPeriod): Promise<DashboardResponse> => {
  return apiClient.getAnalyticsDashboard(period);
};

/**
 * Trafik kaynaklarını getir
 */
const getTrafficSourcesAPI = async (period: AnalyticsPeriod): Promise<TrafficSourcesResponse> => {
  return apiClient.getTrafficSources(period);
};

/**
 * Sıralama bilgilerini getir
 */
const getRankingAPI = async (): Promise<RankingResponse> => {
  return apiClient.getRanking();
};

/**
 * Test verisi ekle
 */
const addTestDataAPI = async (): Promise<TestDataResponse> => {
  return apiClient.addAnalyticsTestData();
};

// ==================== REACT QUERY HOOKS ====================

/**
 * Dashboard verilerini getir
 */
export const useAnalyticsDashboard = (period: AnalyticsPeriod = '30d') => {
  return useQuery<DashboardResponse, Error>({
    queryKey: analyticsKeys.dashboard(period),
    queryFn: () => getDashboardAPI(period),
    staleTime: 1000 * 60 * 5, // 5 dakika
    refetchOnWindowFocus: true,
  });
};

/**
 * Trafik kaynaklarını getir
 */
export const useTrafficSources = (period: AnalyticsPeriod = '30d') => {
  return useQuery<TrafficSourcesResponse, Error>({
    queryKey: analyticsKeys.traffic(period),
    queryFn: () => getTrafficSourcesAPI(period),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });
};

/**
 * Sıralama bilgilerini getir
 */
export const useRanking = () => {
  return useQuery<RankingResponse, Error>({
    queryKey: analyticsKeys.ranking(),
    queryFn: getRankingAPI,
    staleTime: 1000 * 60 * 10, // 10 dakika
  });
};

/**
 * Test verisi ekle (development)
 */
export const useAddTestData = () => {
  const queryClient = useQueryClient();

  return useMutation<TestDataResponse, Error>({
    mutationFn: addTestDataAPI,
    onSuccess: (data) => {
      console.log('✅ Test data added:', data);
      // Test verisi eklenince dashboard'u güncelle
      queryClient.invalidateQueries({ queryKey: analyticsKeys.dashboard('30d') });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.dashboard('90d') });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.dashboard('12m') });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.dashboard('24m') });
    },
  });
};

// ==================== TRACKING MUTATIONS ====================

/**
 * Mağaza görüntülenme kaydı (public)
 */
export const useTrackShopView = () => {
  return useMutation<TrackingResponse, Error, TrackShopViewRequest>({
    mutationFn: (data) => apiClient.trackShopView(data),
    onSuccess: (data, variables) => {
      console.log(`✅ Shop view tracked: ${variables.shop_id} from ${variables.referrer_source || 'unknown'}`);
    },
    onError: (error) => {
      console.error('❌ Track shop view failed:', error);
    },
  });
};

/**
 * Ürün görüntülenme kaydı (public)
 */
export const useTrackProductView = () => {
  return useMutation<TrackingResponse, Error, TrackProductViewRequest>({
    mutationFn: (data) => apiClient.trackProductView(data),
    onSuccess: (data, variables) => {
      console.log(`✅ Product view tracked: ${variables.product_id} in shop ${variables.shop_id}`);
    },
    onError: (error) => {
      console.error('❌ Track product view failed:', error);
    },
  });
};

// ==================== COMPOSED HOOKS ====================

/**
 * Dashboard'u tüm verileriyle birlikte getir (birden fazla query)
 */
export const useFullAnalytics = (period: AnalyticsPeriod = '30d') => {
  const dashboard = useAnalyticsDashboard(period);
  const traffic = useTrafficSources(period);
  const ranking = useRanking();
  
  // Debug logs (istersen silebilirsin)
  console.log('🔍 Dashboard data:', dashboard.data);
  console.log('🔍 Traffic data:', traffic.data);
  console.log('🔍 Ranking data:', ranking.data);

  return {
    // TEK BİR DATA OBJESİ - ÖNERİLEN
    data: {
      dashboard: dashboard.data,
      traffic: traffic.data,
      ranking: ranking.data,
    },
    // Loading states
    isLoading: dashboard.isLoading || traffic.isLoading || ranking.isLoading,
    isFetching: dashboard.isFetching || traffic.isFetching || ranking.isFetching,
    // Error states
    isError: dashboard.isError || traffic.isError || ranking.isError,
    error: dashboard.error || traffic.error || ranking.error,
    // Refetch
    refetchAll: () => {
      dashboard.refetch();
      traffic.refetch();
      ranking.refetch();
    },
  };
};

/**
 * Belirli bir tarih aralığı için analytics verilerini getir
 */
export const useAnalyticsByPeriod = (period: AnalyticsPeriod = '30d') => {
  const { data: dashboard, isLoading, isError, error } = useAnalyticsDashboard(period);

  return {
    data: dashboard,
    isLoading,
    isError,
    error,
    
    // Özet bilgiler
    summary: dashboard ? {
      revenue: dashboard.overview.total_revenue,
      orders: dashboard.overview.total_orders,
      customers: dashboard.overview.total_customers,
      conversion: dashboard.overview.conversion_rate,
      visitors: dashboard.traffic.unique_visitors,
    } : null,
    
    // Grafik için formatlanmış veri
    chartData: dashboard?.sales_by_day.map(day => ({
      date: day.date,
      value: day.revenue,
      orders: day.orders,
    })) || [],
    
    // Kaynak dağılımı
    sources: dashboard?.traffic.sources || {},
    
    // Cihaz dağılımı
    devices: dashboard?.traffic.devices || {},
    
    // Sıralama
    rank: dashboard?.ranking,
  };
};

// ==================== UTILITY HOOKS ====================

/**
 * Conversion rate hesapla (yüzde)
 */
export const useConversionRate = (period: AnalyticsPeriod = '30d') => {
  const { data: dashboard } = useAnalyticsDashboard(period);
  
  if (!dashboard) return 0;
  
  const { total_orders, unique_visitors } = dashboard.overview;
  if (unique_visitors === 0) return 0;
  
  return (total_orders / unique_visitors) * 100;
};

/**
 * En popüler kaynağı bul
 */
export const useTopTrafficSource = (period: AnalyticsPeriod = '30d') => {
  const { data: dashboard } = useAnalyticsDashboard(period);
  
  if (!dashboard) return null;
  
  const sources = dashboard.traffic.sources;
  let topSource = 'direct';
  let topCount = 0;
  
  Object.entries(sources).forEach(([source, count]) => {
    if (count > topCount) {
      topCount = count;
      topSource = source;
    }
  });
  
  return { source: topSource, count: topCount };
};

/**
 * Büyüme yüzdesi (önceki döneme göre)
 */
export const useGrowthPercentage = (currentPeriod: AnalyticsPeriod, previousPeriod: AnalyticsPeriod) => {
  const { data: current } = useAnalyticsDashboard(currentPeriod);
  const { data: previous } = useAnalyticsDashboard(previousPeriod);
  
  if (!current || !previous) return null;
  
  const currentRevenue = current.overview.total_revenue;
  const previousRevenue = previous.overview.total_revenue;
  
  if (previousRevenue === 0) return 100;
  
  const growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  
  return {
    revenue: growth,
    orders: ((current.overview.total_orders - previous.overview.total_orders) / previous.overview.total_orders) * 100,
    customers: ((current.overview.total_customers - previous.overview.total_customers) / previous.overview.total_customers) * 100,
  };
};