// store/slices/analyticsSlice.ts
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';
import type { RootState } from '../redux/store';
import type {
  AnalyticsPeriod,
  DashboardResponse,
  TrafficSourcesResponse,
  RankingResponse,
} from '../types/analytics.types';

// ==================== STATE TYPES ====================
export interface AnalyticsState {
  dashboard: {
    [key in AnalyticsPeriod]?: DashboardResponse;
  };
  traffic: {
    [key in AnalyticsPeriod]?: TrafficSourcesResponse;
  };
  ranking: RankingResponse | null;
  loading: {
    dashboard: boolean;
    traffic: boolean;
    ranking: boolean;
    tracking: boolean;
  };
  error: {
    dashboard: string | null;
    traffic: string | null;
    ranking: string | null;
    tracking: string | null;
  };
  selectedPeriod: AnalyticsPeriod;
  lastUpdated: {
    dashboard: number | null;
    traffic: number | null;
    ranking: number | null;
  };
}

// ==================== INITIAL STATE ====================
const initialState: AnalyticsState = {
  dashboard: {},
  traffic: {},
  ranking: null,
  loading: {
    dashboard: false,
    traffic: false,
    ranking: false,
    tracking: false,
  },
  error: {
    dashboard: null,
    traffic: null,
    ranking: null,
    tracking: null,
  },
  selectedPeriod: '30d',
  lastUpdated: {
    dashboard: null,
    traffic: null,
    ranking: null,
  },
};

// ==================== BASE SELECTORS ====================
const selectDashboardState = (state: RootState) => state.analytics.dashboard;
const selectSelectedPeriodState = (state: RootState) => state.analytics.selectedPeriod;
const selectRankingState = (state: RootState) => state.analytics.ranking;

// ==================== MEMOIZED SELECTORS ====================
export const selectDashboard = createSelector(
  [selectDashboardState, selectSelectedPeriodState],
  (dashboard, period) => dashboard[period]
);

export const selectTrafficSourcesResponse = createSelector(
  [selectDashboardState, selectSelectedPeriodState],
  (dashboard, period) => dashboard[period]?.traffic
);

export const selectTrafficSources = createSelector(
  [selectTrafficSourcesResponse],
  (traffic) => traffic?.sources || {}
);

export const selectDeviceDistribution = createSelector(
  [selectTrafficSourcesResponse],
  (traffic) => traffic?.devices || { mobile: 0, desktop: 0, tablet: 0 }
);

export const selectTopProducts = createSelector(
  [selectDashboard],
  (dashboard) => dashboard?.top_products || []
);

export const selectChartData = createSelector(
  [selectDashboard],
  (dashboard) => dashboard?.sales_by_day || []
);

export const selectSourceDistribution = createSelector(
  [selectTrafficSources],
  (sources) => sources
);

export const selectAnalyticsSummary = createSelector(
  [selectDashboard, selectRankingState],
  (dashboard, ranking) => {
    if (!dashboard) return null;
    return {
      revenue: dashboard.overview.total_revenue,
      orders: dashboard.overview.total_orders,
      customers: dashboard.overview.total_customers,
      conversion: dashboard.overview.conversion_rate,
      visitors: dashboard.traffic.unique_visitors,
      rank: ranking?.world_rank ?? 0,
      topPercent: ranking?.top_percent ?? 0,
    };
  }
);

export const selectTopSource = createSelector(
  [selectSourceDistribution],
  (sources) => {
    let topSource = 'direct';
    let topCount = 0;
    
    for (const [source, count] of Object.entries(sources)) {
      if (count > topCount) {
        topCount = count;
        topSource = source;
      }
    }
    
    return { source: topSource, count: topCount };
  }
);

export const selectHasData = createSelector(
  [selectDashboard],
  (dashboard) => !!dashboard && dashboard.traffic.total_visitors > 0
);

export const selectHasSales = createSelector(
  [selectDashboard],
  (dashboard) => !!dashboard && dashboard.overview.total_orders > 0
);

// ==================== SIMPLE SELECTORS ====================
export const selectAnalytics = (state: RootState): AnalyticsState => state.analytics;
export const selectSelectedPeriod = (state: RootState): AnalyticsPeriod => state.analytics.selectedPeriod;
export const selectRanking = (state: RootState): RankingResponse | null => state.analytics.ranking;
export const selectAnalyticsLoading = (state: RootState) => state.analytics.loading;
export const selectDashboardLoading = (state: RootState): boolean => state.analytics.loading.dashboard;
export const selectTrafficLoading = (state: RootState): boolean => state.analytics.loading.traffic;
export const selectRankingLoading = (state: RootState): boolean => state.analytics.loading.ranking;
export const selectTrackingLoading = (state: RootState): boolean => state.analytics.loading.tracking;
export const selectAnalyticsError = (state: RootState) => state.analytics.error;
export const selectDashboardError = (state: RootState): string | null => state.analytics.error.dashboard;
export const selectTrafficError = (state: RootState): string | null => state.analytics.error.traffic;
export const selectRankingError = (state: RootState): string | null => state.analytics.error.ranking;
export const selectTrackingError = (state: RootState): string | null => state.analytics.error.tracking;
export const selectLastUpdated = (state: RootState) => state.analytics.lastUpdated;

export const selectDashboardByPeriod = (period: AnalyticsPeriod) => 
  (state: RootState): DashboardResponse | undefined => 
    state.analytics.dashboard[period];

// ==================== ASYNC THUNKS ====================
export const fetchAnalyticsDashboard = createAsyncThunk<
  DashboardResponse,
  AnalyticsPeriod,
  { rejectValue: string }
>('analytics/fetchDashboard', async (period, { rejectWithValue }) => {
  try {
    const response = await apiClient.getAnalyticsDashboard(period);
    return response;
  } catch (error) {
    const err = error as Error;
    return rejectWithValue(err.message || 'Dashboard verileri yüklenemedi');
  }
});

export const fetchTrafficSources = createAsyncThunk<
  TrafficSourcesResponse,
  AnalyticsPeriod,
  { rejectValue: string }
>('analytics/fetchTraffic', async (period, { rejectWithValue }) => {
  try {
    const response = await apiClient.getTrafficSources(period);
    return response;
  } catch (error) {
    const err = error as Error;
    return rejectWithValue(err.message || 'Trafik kaynakları yüklenemedi');
  }
});

export const fetchRanking = createAsyncThunk<
  RankingResponse,
  void,
  { rejectValue: string }
>('analytics/fetchRanking', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.getRanking();
    return response;
  } catch (error) {
    const err = error as Error;
    return rejectWithValue(err.message || 'Sıralama bilgileri yüklenemedi');
  }
});

export const fetchAllAnalytics = createAsyncThunk<
  {
    dashboard: DashboardResponse;
    traffic: TrafficSourcesResponse;
    ranking: RankingResponse;
  },
  AnalyticsPeriod,
  { rejectValue: string }
>('analytics/fetchAll', async (period, { rejectWithValue }) => {
  try {
    const [dashboard, traffic, ranking] = await Promise.all([
      apiClient.getAnalyticsDashboard(period),
      apiClient.getTrafficSources(period),
      apiClient.getRanking(),
    ]);

    return { dashboard, traffic, ranking };
  } catch (error) {
    const err = error as Error;
    return rejectWithValue(err.message || 'Analytics verileri yüklenemedi');
  }
});

// ==================== SLICE ====================
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setSelectedPeriod: (state, action: PayloadAction<AnalyticsPeriod>) => {
      state.selectedPeriod = action.payload;
    },
    clearDashboard: (state) => {
      state.dashboard = {};
      state.lastUpdated.dashboard = null;
    },
    clearTraffic: (state) => {
      state.traffic = {};
      state.lastUpdated.traffic = null;
    },
    clearRanking: (state) => {
      state.ranking = null;
      state.lastUpdated.ranking = null;
    },
    clearAllAnalytics: (state) => {
      state.dashboard = {};
      state.traffic = {};
      state.ranking = null;
      state.lastUpdated = {
        dashboard: null,
        traffic: null,
        ranking: null,
      };
      state.error = {
        dashboard: null,
        traffic: null,
        ranking: null,
        tracking: null,
      };
    },
    setTrackingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.tracking = action.payload;
    },
    setTrackingError: (state, action: PayloadAction<string | null>) => {
      state.error.tracking = action.payload;
    },
    clearErrors: (state) => {
      state.error = {
        dashboard: null,
        traffic: null,
        ranking: null,
        tracking: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsDashboard.pending, (state) => {
        state.loading.dashboard = true;
        state.error.dashboard = null;
      })
      .addCase(fetchAnalyticsDashboard.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.dashboard[action.meta.arg] = action.payload;
        state.lastUpdated.dashboard = Date.now();
      })
      .addCase(fetchAnalyticsDashboard.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.error.dashboard = action.payload ?? 'Dashboard yüklenemedi';
      })
      .addCase(fetchTrafficSources.pending, (state) => {
        state.loading.traffic = true;
        state.error.traffic = null;
      })
      .addCase(fetchTrafficSources.fulfilled, (state, action) => {
        state.loading.traffic = false;
        state.traffic[action.meta.arg] = action.payload;
        state.lastUpdated.traffic = Date.now();
      })
      .addCase(fetchTrafficSources.rejected, (state, action) => {
        state.loading.traffic = false;
        state.error.traffic = action.payload ?? 'Trafik kaynakları yüklenemedi';
      })
      .addCase(fetchRanking.pending, (state) => {
        state.loading.ranking = true;
        state.error.ranking = null;
      })
      .addCase(fetchRanking.fulfilled, (state, action) => {
        state.loading.ranking = false;
        state.ranking = action.payload;
        state.lastUpdated.ranking = Date.now();
      })
      .addCase(fetchRanking.rejected, (state, action) => {
        state.loading.ranking = false;
        state.error.ranking = action.payload ?? 'Sıralama yüklenemedi';
      })
      .addCase(fetchAllAnalytics.pending, (state) => {
        state.loading.dashboard = true;
        state.loading.traffic = true;
        state.loading.ranking = true;
        state.error.dashboard = null;
        state.error.traffic = null;
        state.error.ranking = null;
      })
      .addCase(fetchAllAnalytics.fulfilled, (state, action) => {
        state.loading.dashboard = false;
        state.loading.traffic = false;
        state.loading.ranking = false;
        
        const period = action.meta.arg;
        state.dashboard[period] = action.payload.dashboard;
        state.traffic[period] = action.payload.traffic;
        state.ranking = action.payload.ranking;
        
        state.lastUpdated.dashboard = Date.now();
        state.lastUpdated.traffic = Date.now();
        state.lastUpdated.ranking = Date.now();
      })
      .addCase(fetchAllAnalytics.rejected, (state, action) => {
        state.loading.dashboard = false;
        state.loading.traffic = false;
        state.loading.ranking = false;
        state.error.dashboard = action.payload ?? 'Analytics verileri yüklenemedi';
        state.error.traffic = action.payload ?? 'Analytics verileri yüklenemedi';
        state.error.ranking = action.payload ?? 'Analytics verileri yüklenemedi';
      });
  },
});

// ==================== EXPORTS ====================
export const {
  setSelectedPeriod,
  clearDashboard,
  clearTraffic,
  clearRanking,
  clearAllAnalytics,
  setTrackingLoading,
  setTrackingError,
  clearErrors,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;