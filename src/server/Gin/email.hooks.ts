// hooks/email.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import type {
  SendEmailRequest,
  SendEmailResponse,
  EmailConfig,
  EmailLog,
  EmailStats,
  EmailLogsResponse
} from '../../types/email.types';

// ==================== QUERY KEYS ====================
export const emailKeys = {
  all: ['email'] as const,
  logs: () => [...emailKeys.all, 'logs'] as const,
  config: () => [...emailKeys.all, 'config'] as const,
  stats: () => [...emailKeys.all, 'stats'] as const,
  test: () => [...emailKeys.all, 'test'] as const,
};

// ==================== API FONKSİYONLARI (hooks içinde kullanılacak) ====================

/**
 * Custom email gönder
 */
const sendEmailAPI = async (data: SendEmailRequest): Promise<SendEmailResponse> => {
  return apiClient.goPost<SendEmailResponse>('/email/send', data);
};

/**
 * Test email'i gönder
 */
const sendTestEmailAPI = async (): Promise<SendEmailResponse> => {
  return apiClient.goGet<SendEmailResponse>('/email/test');
};

/**
 * Hızlı test
 */
const quickTestAPI = async (): Promise<SendEmailResponse> => {
  return apiClient.goGet<SendEmailResponse>('/email/quicktest');
};

/**
 * Gerçek test (damlamuahmmet1@gmail.com)
 */
const realTestAPI = async (): Promise<SendEmailResponse> => {
  return apiClient.goGet<SendEmailResponse>('/email/real-test');
};

/**
 * Email log'larını getir
 */
const getEmailLogsAPI = async (limit?: number): Promise<EmailLog[]> => {
  const params = limit ? { limit } : {};
  const response = await apiClient.goGet<EmailLogsResponse>('/email/logs', { params });
  return response.logs || [];
};

/**
 * Email config getir (real-test endpoint'inden çekiyoruz)
 */
const getEmailConfigAPI = async (): Promise<EmailConfig> => {
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
  } catch {
    return {
      host: 'unknown',
      port: '0',
      username: 'unknown',
      from: 'unknown',
      mode: 'test',
      db_connected: false
    };
  }
};

// ==================== REACT QUERY HOOKS ====================

/**
 * Email log'larını getir
 */
export const useEmailLogs = (limit?: number) => {
  return useQuery<EmailLog[], Error>({
    queryKey: [...emailKeys.logs(), { limit }],
    queryFn: () => getEmailLogsAPI(limit),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });
};

/**
 * Email config getir
 */
export const useEmailConfig = () => {
  return useQuery<EmailConfig, Error>({
    queryKey: emailKeys.config(),
    queryFn: getEmailConfigAPI,
    staleTime: 1000 * 60 * 10, // 10 dakika
  });
};

/**
 * Email gönderme mutation'ı
 */
export const useSendEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<SendEmailResponse, Error, SendEmailRequest>({
    mutationFn: sendEmailAPI,
    onSuccess: () => {
      // Email gönderildiğinde log'ları invalidate et
      queryClient.invalidateQueries({ queryKey: emailKeys.logs() });
    },
  });
};

/**
 * Test email gönderme
 */
export const useSendTestEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<SendEmailResponse, Error>({
    mutationFn: sendTestEmailAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.logs() });
    },
  });
};

/**
 * Hızlı test
 */
export const useQuickTest = () => {
  const queryClient = useQueryClient();

  return useMutation<SendEmailResponse, Error>({
    mutationFn: quickTestAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.logs() });
    },
  });
};

/**
 * Gerçek test
 */
export const useRealTest = () => {
  const queryClient = useQueryClient();

  return useMutation<SendEmailResponse, Error>({
    mutationFn: realTestAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.logs() });
    },
  });
};

/**
 * Email gönder (optimistic update ile)
 */
export const useSendEmailOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation<SendEmailResponse, Error, SendEmailRequest>({
    mutationFn: sendEmailAPI,
    
    // Optimistic update: API çağrısı başlamadan önce UI'ı güncelle
    onMutate: async (newEmail) => {
      // Önceki query'leri cancel et
      await queryClient.cancelQueries({ queryKey: emailKeys.logs() });

      // Önceki state'i kaydet
      const previousLogs = queryClient.getQueryData<EmailLog[]>(emailKeys.logs());

      // Optimistic olarak yeni log ekle
      const optimisticLog: EmailLog = {
        id: `temp-${Date.now()}`,
        user_id: 'current-user',
        to_email: newEmail.to,
        subject: newEmail.subject,
        template: 'custom',
        status: 'pending',
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      if (previousLogs) {
        queryClient.setQueryData<EmailLog[]>(
          emailKeys.logs(),
          [optimisticLog, ...previousLogs]
        );
      }

      return { previousLogs };
    },

    // Hata olursa eski state'e dön
    onError: (err, newEmail, context) => {
      if (context?.previousLogs) {
        queryClient.setQueryData<EmailLog[]>(emailKeys.logs(), context.previousLogs);
      }
    },

    // Başarılı olursa log'ları tekrar getir
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.logs() });
    },
  });
};

/**
 * Batch email gönder
 */
export const useSendBatchEmails = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SendEmailResponse[],
    Error,
    { emails: SendEmailRequest[] }
  >({
    mutationFn: async ({ emails }) => {
      const results: SendEmailResponse[] = [];
      for (const email of emails) {
        try {
          const result = await sendEmailAPI(email);
          results.push(result);
        } catch (error) {
          results.push({
            success: false,
            message: (error as Error).message,
            to: email.to,
            subject: email.subject,
          });
        }
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emailKeys.logs() });
    },
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Email istatistiklerini hesapla
 */
export const useEmailStats = () => {
  const { data: logs } = useEmailLogs();

  return useQuery<EmailStats, Error>({
    queryKey: emailKeys.stats(),
    queryFn: async () => {
      if (!logs || logs.length === 0) {
        return {
          total_sent: 0,
          total_failed: 0,
          success_rate: 0,
          last_sent: '',
          today_count: 0,
        };
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const stats = logs.reduce(
        (acc, log) => {
          if (log.status === 'sent') acc.total_sent++;
          if (log.status === 'failed') acc.total_failed++;
          
          const sentDate = new Date(log.sent_at);
          if (sentDate >= today) acc.today_count++;
          
          if (sentDate > new Date(acc.last_sent)) {
            acc.last_sent = log.sent_at;
          }
          
          return acc;
        },
        {
          total_sent: 0,
          total_failed: 0,
          today_count: 0,
          last_sent: '',
        }
      );

      const total = stats.total_sent + stats.total_failed;
      return {
        ...stats,
        success_rate: total > 0 ? (stats.total_sent / total) * 100 : 0,
      };
    },
    enabled: !!logs,
    staleTime: 1000 * 60, // 1 dakika
  });
};