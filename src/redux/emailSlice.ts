// store/slices/emailSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';
import type {
  SendEmailRequest,
  SendEmailResponse,
  EmailLog,
  EmailConfig,
  EmailStats,
  EmailStatus,
  EmailTemplate
} from '../types/email.types';

// ==================== STATE TYPES ====================
interface EmailState {
  logs: EmailLog[];
  config: EmailConfig | null;
  stats: EmailStats | null;
  loading: boolean;
  error: string | null;
  sending: boolean;
  currentPage: number;
  totalPages: number;
  filter: {
    status?: EmailStatus;
    template?: EmailTemplate;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

// ==================== INITIAL STATE ====================
const initialState: EmailState = {
  logs: [],
  config: null,
  stats: null,
  loading: false,
  error: null,
  sending: false,
  currentPage: 1,
  totalPages: 1,
  filter: {},
};

// ==================== ASYNC THUNKS ====================

/**
 * Email log'larını getir
 */
export const fetchEmailLogs = createAsyncThunk<
  EmailLog[],
  { limit?: number; page?: number; refresh?: boolean },
  { rejectValue: string }
>('email/fetchLogs', async ({ limit = 20, page = 1, refresh = false }, { rejectWithValue }) => {
  try {
    const params = { limit, page };
    const response = await apiClient.goGet<{ logs: EmailLog[]; count: number }>('/email/logs', { params });
    return response.logs || [];
  } catch (error: any) {
    return rejectWithValue(error.message || 'Email logları yüklenemedi');
  }
});

/**
 * Email gönder
 */
export const sendEmail = createAsyncThunk<
  SendEmailResponse,
  SendEmailRequest,
  { rejectValue: string }
>('email/sendEmail', async (emailData, { rejectWithValue }) => {
  try {
    return await apiClient.goPost<SendEmailResponse>('/email/send', emailData);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Email gönderilemedi');
  }
});

/**
 * Test email gönder
 */
export const sendTestEmail = createAsyncThunk<
  SendEmailResponse,
  void,
  { rejectValue: string }
>('email/sendTestEmail', async (_, { rejectWithValue }) => {
  try {
    return await apiClient.goGet<SendEmailResponse>('/email/test');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Test email gönderilemedi');
  }
});

/**
 * Gerçek test gönder
 */
export const sendRealTest = createAsyncThunk<
  SendEmailResponse,
  void,
  { rejectValue: string }
>('email/sendRealTest', async (_, { rejectWithValue }) => {
  try {
    return await apiClient.goGet<SendEmailResponse>('/email/real-test');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Gerçek test gönderilemedi');
  }
});

/**
 * Email config getir
 */
export const fetchEmailConfig = createAsyncThunk<
  EmailConfig,
  void,
  { rejectValue: string }
>('email/fetchConfig', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.goGet<{ config: EmailConfig }>('/email/real-test');
    return response.config || {
      host: 'unknown',
      port: '0',
      username: 'unknown',
      from: 'unknown',
      mode: 'test',
      db_connected: false
    };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Email config yüklenemedi');
  }
});

/**
 * Email istatistiklerini getir
 */
export const fetchEmailStats = createAsyncThunk<
  EmailStats,
  void,
  { rejectValue: string }
>('email/fetchStats', async (_, { rejectWithValue }) => {
  try {
    // Backend'de stats endpoint'i yoksa, log'lardan hesapla
    const logs = await apiClient.goGet<{ logs: EmailLog[] }>('/email/logs', { params: { limit: 1000 } });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = logs.logs.reduce((acc, log) => {
      if (log.status === 'sent') acc.total_sent++;
      if (log.status === 'failed') acc.total_failed++;
      
      const sentDate = new Date(log.sent_at);
      if (sentDate >= today) acc.today_count++;
      
      if (!acc.last_sent || sentDate > new Date(acc.last_sent)) {
        acc.last_sent = log.sent_at;
      }
      
      return acc;
    }, {
      total_sent: 0,
      total_failed: 0,
      today_count: 0,
      last_sent: '',
    });
    
    const total = stats.total_sent + stats.total_failed;
    return {
      ...stats,
      success_rate: total > 0 ? (stats.total_sent / total) * 100 : 0,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || 'İstatistikler yüklenemedi');
  }
});

// ==================== SLICE ====================
const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    // Sync actions
    setFilter: (state, action: PayloadAction<Partial<EmailState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
      state.currentPage = 1; // Filter değişince sayfayı resetle
    },
    
    clearFilter: (state) => {
      state.filter = {};
      state.currentPage = 1;
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    addLogOptimistically: (state, action: PayloadAction<Omit<EmailLog, 'id' | 'sent_at' | 'created_at'>>) => {
      const optimisticLog: EmailLog = {
        id: `temp-${Date.now()}`,
        ...action.payload,
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      state.logs.unshift(optimisticLog);
    },
    
    updateLogStatus: (state, action: PayloadAction<{ tempId: string; status: EmailStatus; error?: string }>) => {
      const index = state.logs.findIndex(log => log.id === action.payload.tempId);
      if (index !== -1) {
        state.logs[index].status = action.payload.status;
        if (action.payload.error) {
          state.logs[index].error = action.payload.error;
        }
      }
    },
    
    removeTempLog: (state, action: PayloadAction<string>) => {
      state.logs = state.logs.filter(log => !log.id.startsWith('temp-') || log.id !== action.payload);
    },
  },
  
  extraReducers: (builder) => {
    // ===== fetchEmailLogs =====
    builder.addCase(fetchEmailLogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(fetchEmailLogs.fulfilled, (state, action) => {
      state.loading = false;
      state.logs = action.payload;
    });
    
    builder.addCase(fetchEmailLogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Loglar yüklenemedi';
    });
    
    // ===== sendEmail =====
    builder.addCase(sendEmail.pending, (state) => {
      state.sending = true;
      state.error = null;
    });
    
    builder.addCase(sendEmail.fulfilled, (state, action) => {
      state.sending = false;
      // Optimistic eklenen log'u bul ve güncelle
      const tempIndex = state.logs.findIndex(log => log.id.startsWith('temp-'));
      if (tempIndex !== -1) {
        state.logs[tempIndex] = {
          ...state.logs[tempIndex],
          id: action.payload.log_id || `email-${Date.now()}`,
          status: 'sent',
        };
      }
    });
    
    builder.addCase(sendEmail.rejected, (state, action) => {
      state.sending = false;
      state.error = action.payload || 'Email gönderilemedi';
      
      // Optimistic log'u failed olarak güncelle
      const tempIndex = state.logs.findIndex(log => log.id.startsWith('temp-'));
      if (tempIndex !== -1) {
        state.logs[tempIndex].status = 'failed';
        state.logs[tempIndex].error = action.payload || 'Gönderim başarısız';
      }
    });
    
    // ===== sendTestEmail =====
    builder.addCase(sendTestEmail.pending, (state) => {
      state.sending = true;
    });
    
    builder.addCase(sendTestEmail.fulfilled, (state) => {
      state.sending = false;
    });
    
    builder.addCase(sendTestEmail.rejected, (state, action) => {
      state.sending = false;
      state.error = action.payload || 'Test email gönderilemedi';
    });
    
    // ===== sendRealTest =====
    builder.addCase(sendRealTest.pending, (state) => {
      state.sending = true;
    });
    
    builder.addCase(sendRealTest.fulfilled, (state) => {
      state.sending = false;
    });
    
    builder.addCase(sendRealTest.rejected, (state, action) => {
      state.sending = false;
      state.error = action.payload || 'Gerçek test gönderilemedi';
    });
    
    // ===== fetchEmailConfig =====
    builder.addCase(fetchEmailConfig.fulfilled, (state, action) => {
      state.config = action.payload;
    });
    
    // ===== fetchEmailStats =====
    builder.addCase(fetchEmailStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
  },
});

// ==================== EXPORTS ====================
export const {
  setFilter,
  clearFilter,
  setPage,
  clearError,
  addLogOptimistically,
  updateLogStatus,
  removeTempLog,
} = emailSlice.actions;

export default emailSlice.reducer;

// ==================== SELECTORS ====================
export const selectEmail = (state: { email: EmailState }) => state.email;
export const selectEmailLogs = (state: { email: EmailState }) => state.email.logs;
export const selectEmailConfig = (state: { email: EmailState }) => state.email.config;
export const selectEmailStats = (state: { email: EmailState }) => state.email.stats;
export const selectEmailLoading = (state: { email: EmailState }) => state.email.loading;
export const selectEmailSending = (state: { email: EmailState }) => state.email.sending;
export const selectEmailError = (state: { email: EmailState }) => state.email.error;
export const selectEmailFilter = (state: { email: EmailState }) => state.email.filter;
export const selectEmailPagination = (state: { email: EmailState }) => ({
  currentPage: state.email.currentPage,
  totalPages: state.email.totalPages,
});

/**
 * Filtrelenmiş email log'ları
 */
export const selectFilteredEmailLogs = (state: { email: EmailState }) => {
  const { logs, filter } = state.email;
  
  return logs.filter(log => {
    if (filter.status && log.status !== filter.status) return false;
    if (filter.template && log.template !== filter.template) return false;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        log.to_email.toLowerCase().includes(searchLower) ||
        log.subject.toLowerCase().includes(searchLower)
      );
    }
    
    if (filter.dateFrom) {
      const logDate = new Date(log.sent_at);
      const fromDate = new Date(filter.dateFrom);
      if (logDate < fromDate) return false;
    }
    
    if (filter.dateTo) {
      const logDate = new Date(log.sent_at);
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (logDate > toDate) return false;
    }
    
    return true;
  });
};

/**
 * Bugünkü email sayısı
 */
export const selectTodayEmailCount = (state: { email: EmailState }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return state.email.logs.filter(log => {
    const sentDate = new Date(log.sent_at);
    return sentDate >= today && log.status === 'sent';
  }).length;
};