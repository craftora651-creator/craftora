// hooks/payment.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import type {
  PaymentIntent,
  PaymentCharge,
  SubscriptionPlanDetails,
  UserSubscription,
  BankInfo,
  PaymentConfig,
  PaymentHealth,
  PaymentStats,
  Invoice,
  PaymentWebhook,
  PaymentCustomer,
  PaymentCard,
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  CancelSubscriptionRequest,
  CancelSubscriptionResponse,
  UpdateSubscriptionRequest,
  BankTransferRequest,
  BankTransferResponse,
  TestWebhookRequest,
  TestWebhookResponse,
  PaymentListParams,
  PaginatedPayments,
  PaymentMethod,
  PaymentStatus,
  SubscriptionPlan,
  Currency,
  PaymentProvider,
  WebhookEventType,
  formatCurrency,
  getPlanDisplayName,
  TEST_CARDS
} from '../types/payment.types';

// ==================== QUERY KEYS ====================
export const paymentKeys = {
  all: ['payment'] as const,
  config: () => [...paymentKeys.all, 'config'] as const,
  health: () => [...paymentKeys.all, 'health'] as const,
  stats: () => [...paymentKeys.all, 'stats'] as const,
  
  // Plans
  plans: () => [...paymentKeys.all, 'plans'] as const,
  plan: (planId: string) => [...paymentKeys.plans(), planId] as const,
  
  // Payment Intents
  paymentIntents: () => [...paymentKeys.all, 'intents'] as const,
  paymentIntent: (id: string) => [...paymentKeys.paymentIntents(), id] as const,
  
  // Charges
  charges: () => [...paymentKeys.all, 'charges'] as const,
  charge: (id: string) => [...paymentKeys.charges(), id] as const,
  
  // Subscriptions
  subscriptions: () => [...paymentKeys.all, 'subscriptions'] as const,
  subscription: (id: string) => [...paymentKeys.subscriptions(), id] as const,
  userSubscription: (userId: string) => [...paymentKeys.subscriptions(), 'user', userId] as const,
  
  // Invoices
  invoices: () => [...paymentKeys.all, 'invoices'] as const,
  invoice: (id: string) => [...paymentKeys.invoices(), id] as const,
  userInvoices: (userId: string) => [...paymentKeys.invoices(), 'user', userId] as const,
  
  // Bank Info
  bankInfo: () => [...paymentKeys.all, 'bank'] as const,
  
  // Webhooks
  webhooks: () => [...paymentKeys.all, 'webhooks'] as const,
  webhook: (id: string) => [...paymentKeys.webhooks(), id] as const,
  
  // Customers
  customers: () => [...paymentKeys.all, 'customers'] as const,
  customer: (id: string) => [...paymentKeys.customers(), id] as const,
  
  // Test
  test: () => [...paymentKeys.all, 'test'] as const,
};

// ==================== API FONKSİYONLARI ====================

/**
 * Payment config getir
 */
const getPaymentConfigAPI = async (): Promise<PaymentConfig> => {
  const response = await apiClient.goGet<{ config: PaymentConfig }>('/payment/config');
  return response.config || {
    mode: 'test',
    provider: PaymentProvider.TEST,
    has_secret_key: false,
    has_webhook: false,
    db_connected: false,
    supported_methods: [PaymentMethod.CREDIT_CARD],
    default_currency: Currency.TRY,
    test_mode: true
  };
};

/**
 * Payment health check
 */
const getPaymentHealthAPI = async (): Promise<PaymentHealth> => {
  const response = await apiClient.goGet<PaymentHealth>('/payment/health');
  return response;
};

/**
 * Payment istatistikleri
 */
const getPaymentStatsAPI = async (): Promise<PaymentStats> => {
  try {
    const response = await apiClient.goGet<PaymentStats>('/payment/stats');
    return response;
  } catch {
    // Fallback stats
    return {
      total_payments: 0,
      total_revenue: 0,
      today_payments: 0,
      today_revenue: 0,
      monthly_revenue: 0,
      yearly_revenue: 0,
      by_plan: {} as Record<SubscriptionPlan, number>,
      by_status: {} as Record<PaymentStatus, number>,
      by_method: {} as Record<PaymentMethod, number>,
      by_currency: {} as Record<Currency, number>,
      active_subscriptions: 0,
      expiring_soon: 0,
      recent_payments: [],
      top_customers: []
    };
  }
};

/**
 * Abonelik planlarını getir
 */
const getSubscriptionPlansAPI = async (): Promise<SubscriptionPlanDetails[]> => {
  const response = await apiClient.goGet<{ plans: Record<string, SubscriptionPlanDetails> }>('/payment/plans');
  
  // Object'i array'e çevir
  return Object.values(response.plans || {}).map(plan => ({
    ...plan,
    display_name: getPlanDisplayName(plan.name as SubscriptionPlan),
    price_formatted: formatCurrency(plan.price, Currency.TRY)
  }));
};

/**
 * Banka bilgilerini getir
 */
const getBankInfoAPI = async (): Promise<BankInfo> => {
  const response = await apiClient.goGet<{ bank_info: BankInfo }>('/payment/bank');
  return response.bank_info || {
    bank_name: 'Test Bank',
    account_name: 'Test Account',
    iban: 'TR00 0000 0000 0000 0000 0000 00',
    account_number: '0000-0000-0000',
    currency: Currency.TRY
  };
};

/**
 * Payment intent oluştur
 */
const createPaymentIntentAPI = async (data: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> => {
  return apiClient.goPost<CreatePaymentIntentResponse>('/payment/create', data);
};

/**
 * Ödeme onayla
 */
const confirmPaymentAPI = async (data: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> => {
  return apiClient.goPost<ConfirmPaymentResponse>('/payment/confirm', data);
};

/**
 * Ödeme durumu getir
 */
const getPaymentStatusAPI = async (paymentId: string): Promise<PaymentIntent> => {
  const response = await apiClient.goGet<{ payment_intent: PaymentIntent }>(`/payment/status/${paymentId}`);
  return response.payment_intent;
};

/**
 * Abonelik oluştur
 */
const createSubscriptionAPI = async (data: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> => {
  return apiClient.goPost<CreateSubscriptionResponse>('/payment/subscribe', data);
};

/**
 * Abonelik iptal et
 */
const cancelSubscriptionAPI = async (data: CancelSubscriptionRequest): Promise<CancelSubscriptionResponse> => {
  return apiClient.goPost<CancelSubscriptionResponse>('/payment/subscription/cancel', data);
};

/**
 * Abonelik güncelle
 */
const updateSubscriptionAPI = async (data: UpdateSubscriptionRequest): Promise<UserSubscription> => {
  return apiClient.goPost<UserSubscription>('/payment/subscription/update', data);
};

/**
 * Banka transferi başlat
 */
const createBankTransferAPI = async (data: BankTransferRequest): Promise<BankTransferResponse> => {
  return apiClient.goPost<BankTransferResponse>('/payment/bank-transfer', data);
};

/**
 * Test webhook gönder
 */
const sendTestWebhookAPI = async (data: TestWebhookRequest): Promise<TestWebhookResponse> => {
  return apiClient.goPost<TestWebhookResponse>('/payment/test-webhook', data);
};

/**
 * Kullanıcının aboneliğini getir
 */
const getUserSubscriptionAPI = async (userId: string): Promise<UserSubscription | null> => {
  try {
    const response = await apiClient.goGet<{ subscription: UserSubscription }>(`/payment/user/${userId}/subscription`);
    return response.subscription || null;
  } catch {
    return null;
  }
};

/**
 * Kullanıcının faturalarını getir
 */
const getUserInvoicesAPI = async (userId: string): Promise<Invoice[]> => {
  try {
    const response = await apiClient.goGet<{ invoices: Invoice[] }>(`/payment/user/${userId}/invoices`);
    return response.invoices || [];
  } catch {
    return [];
  }
};

/**
 * Ödeme geçmişi getir
 */
const getPaymentHistoryAPI = async (params: PaymentListParams): Promise<PaginatedPayments> => {
  const response = await apiClient.goGet<PaginatedPayments>('/payment/history', { params });
  return response;
};

// ==================== REACT QUERY HOOKS ====================

/**
 * Payment config getir
 */
export const usePaymentConfig = () => {
  return useQuery<PaymentConfig, Error>({
    queryKey: paymentKeys.config(),
    queryFn: getPaymentConfigAPI,
    staleTime: 1000 * 60 * 10, // 10 dakika
  });
};

/**
 * Payment health check
 */
export const usePaymentHealth = () => {
  return useQuery<PaymentHealth, Error>({
    queryKey: paymentKeys.health(),
    queryFn: getPaymentHealthAPI,
    refetchInterval: 1000 * 60 * 5, // 5 dakikada bir kontrol
  });
};

/**
 * Payment istatistikleri
 */
export const usePaymentStats = () => {
  return useQuery<PaymentStats, Error>({
    queryKey: paymentKeys.stats(),
    queryFn: getPaymentStatsAPI,
    staleTime: 1000 * 60 * 2, // 2 dakika
  });
};

/**
 * Abonelik planlarını getir
 */
export const useSubscriptionPlans = () => {
  return useQuery<SubscriptionPlanDetails[], Error>({
    queryKey: paymentKeys.plans(),
    queryFn: getSubscriptionPlansAPI,
    staleTime: 1000 * 60 * 60, // 1 saat
  });
};

/**
 * Banka bilgilerini getir
 */
export const useBankInfo = () => {
  return useQuery<BankInfo, Error>({
    queryKey: paymentKeys.bankInfo(),
    queryFn: getBankInfoAPI,
    staleTime: 1000 * 60 * 60 * 24, // 24 saat
  });
};

/**
 * Kullanıcının aboneliğini getir
 */
export const useUserSubscription = (userId: string) => {
  return useQuery<UserSubscription | null, Error>({
    queryKey: paymentKeys.userSubscription(userId),
    queryFn: () => getUserSubscriptionAPI(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 dakika
  });
};

/**
 * Kullanıcının faturalarını getir
 */
export const useUserInvoices = (userId: string) => {
  return useQuery<Invoice[], Error>({
    queryKey: paymentKeys.userInvoices(userId),
    queryFn: () => getUserInvoicesAPI(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 dakika
  });
};

/**
 * Ödeme geçmişi getir
 */
export const usePaymentHistory = (params: PaymentListParams) => {
  return useQuery<PaginatedPayments, Error>({
    queryKey: [...paymentKeys.charges(), params],
    queryFn: () => getPaymentHistoryAPI(params),
    staleTime: 1000 * 60 * 2, // 2 dakika
    keepPreviousData: true,
  });
};

// ==================== MUTATIONS ====================

/**
 * Payment intent oluştur
 */
export const useCreatePaymentIntent = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePaymentIntentResponse, Error, CreatePaymentIntentRequest>({
    mutationFn: createPaymentIntentAPI,
    onSuccess: () => {
      // Stats'ı güncelle
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
    },
  });
};

/**
 * Ödeme onayla
 */
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<ConfirmPaymentResponse, Error, ConfirmPaymentRequest>({
    mutationFn: confirmPaymentAPI,
    onSuccess: (data) => {
      // Payment intent cache'ini güncelle
      if (data.payment_intent?.id) {
        queryClient.invalidateQueries({ 
          queryKey: paymentKeys.paymentIntent(data.payment_intent.id) 
        });
      }
      
      // Charges listesini güncelle
      queryClient.invalidateQueries({ queryKey: paymentKeys.charges() });
      
      // Stats'ı güncelle
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
    },
  });
};

/**
 * Ödeme durumu getir (polling ile)
 */
export const usePollPaymentStatus = (paymentId: string, enabled = true) => {
  return useQuery<PaymentIntent, Error>({
    queryKey: paymentKeys.paymentIntent(paymentId),
    queryFn: () => getPaymentStatusAPI(paymentId),
    enabled: !!paymentId && enabled,
    refetchInterval: (data) => {
      // Eğer ödeme pending ise 3 saniyede bir kontrol et
      if (data?.status === PaymentStatus.PENDING || 
          data?.status === PaymentStatus.PROCESSING ||
          data?.status === PaymentStatus.REQUIRES_ACTION) {
        return 3000;
      }
      // Diğer durumlarda polling yapma
      return false;
    },
    retry: false,
  });
};

/**
 * Abonelik oluştur
 */
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateSubscriptionResponse, Error, CreateSubscriptionRequest>({
    mutationFn: createSubscriptionAPI,
    onSuccess: (data, variables) => {
      // Kullanıcının abonelik bilgisini güncelle
      queryClient.invalidateQueries({ 
        queryKey: paymentKeys.userSubscription(variables.user_id) 
      });
      
      // Invoices'ı güncelle
      queryClient.invalidateQueries({ 
        queryKey: paymentKeys.userInvoices(variables.user_id) 
      });
      
      // Stats'ı güncelle
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
    },
  });
};

/**
 * Abonelik iptal et
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<CancelSubscriptionResponse, Error, CancelSubscriptionRequest>({
    mutationFn: cancelSubscriptionAPI,
    onSuccess: (data) => {
      // Subscription cache'ini güncelle
      if (data.subscription?.subscription_id) {
        queryClient.invalidateQueries({ 
          queryKey: paymentKeys.subscription(data.subscription.subscription_id) 
        });
      }
      
      // User subscription'ı güncelle
      if (data.subscription?.user_id) {
        queryClient.invalidateQueries({ 
          queryKey: paymentKeys.userSubscription(data.subscription.user_id) 
        });
      }
    },
  });
};

/**
 * Abonelik güncelle
 */
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<UserSubscription, Error, UpdateSubscriptionRequest>({
    mutationFn: updateSubscriptionAPI,
    onSuccess: (data) => {
      // Subscription cache'ini güncelle
      queryClient.invalidateQueries({ 
        queryKey: paymentKeys.subscription(data.subscription_id) 
      });
      
      // User subscription'ı güncelle
      queryClient.invalidateQueries({ 
        queryKey: paymentKeys.userSubscription(data.user_id) 
      });
    },
  });
};

/**
 * Banka transferi başlat
 */
export const useCreateBankTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<BankTransferResponse, Error, BankTransferRequest>({
    mutationFn: createBankTransferAPI,
    onSuccess: () => {
      // Payment intents listesini güncelle
      queryClient.invalidateQueries({ queryKey: paymentKeys.paymentIntents() });
    },
  });
};

/**
 * Test webhook gönder
 */
export const useSendTestWebhook = () => {
  return useMutation<TestWebhookResponse, Error, TestWebhookRequest>({
    mutationFn: sendTestWebhookAPI,
  });
};

// ==================== OPTIMISTIC MUTATIONS ====================

/**
 * Optimistic payment intent oluştur
 */
export const useCreatePaymentIntentOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePaymentIntentResponse, Error, CreatePaymentIntentRequest>({
    mutationFn: createPaymentIntentAPI,
    
    onMutate: async (variables) => {
      // Önceki query'leri cancel et
      await queryClient.cancelQueries({ queryKey: paymentKeys.paymentIntents() });
      
      // Optimistic payment intent oluştur
      const optimisticIntent: PaymentIntent = {
        id: `temp_${Date.now()}`,
        amount: variables.amount,
        currency: variables.currency,
        status: PaymentStatus.PENDING,
        payment_method: variables.payment_method,
        customer_email: variables.customer_email,
        customer_name: variables.customer_name,
        description: variables.description,
        metadata: variables.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Önceki intents'ı al
      const previousIntents = queryClient.getQueryData<PaymentIntent[]>(paymentKeys.paymentIntents()) || [];
      
      // Optimistic intent'i ekle
      queryClient.setQueryData<PaymentIntent[]>(
        paymentKeys.paymentIntents(),
        [optimisticIntent, ...previousIntents]
      );
      
      return { optimisticIntent, previousIntents };
    },
    
    onError: (err, variables, context) => {
      // Hata olursa eski state'e dön
      if (context?.previousIntents) {
        queryClient.setQueryData<PaymentIntent[]>(
          paymentKeys.paymentIntents(),
          context.previousIntents
        );
      }
    },
    
    onSuccess: (data, variables, context) => {
      // Optimistic intent'i gerçek intent ile değiştir
      const currentIntents = queryClient.getQueryData<PaymentIntent[]>(paymentKeys.paymentIntents()) || [];
      
      const updatedIntents = currentIntents.map(intent => 
        intent.id === context?.optimisticIntent.id ? data.payment_intent : intent
      );
      
      queryClient.setQueryData<PaymentIntent[]>(
        paymentKeys.paymentIntents(),
        updatedIntents
      );
      
      // Stats'ı güncelle
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
    },
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Format currency hook
 */
export const useFormatCurrency = () => {
  return (amount: number, currency: Currency = Currency.TRY): string => {
    return formatCurrency(amount, currency);
  };
};

/**
 * Plan özellikleri hook
 */
export const usePlanFeatures = () => {
  const { data: plans } = useSubscriptionPlans();
  
  return (planId: SubscriptionPlan): string[] => {
    const plan = plans?.find(p => p.name === planId);
    return plan?.features || [];
  };
};

/**
 Test kartı bilgileri
 */
export const useTestCards = () => {
  return TEST_CARDS;
};

/**
 * Ödeme durumu renkleri
 */
export const usePaymentStatusColors = () => {
  return (status: PaymentStatus): { bg: string; text: string } => {
    const colors: Record<PaymentStatus, { bg: string; text: string }> = {
      [PaymentStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      [PaymentStatus.PROCESSING]: { bg: 'bg-blue-100', text: 'text-blue-800' },
      [PaymentStatus.SUCCEEDED]: { bg: 'bg-green-100', text: 'text-green-800' },
      [PaymentStatus.FAILED]: { bg: 'bg-red-100', text: 'text-red-800' },
      [PaymentStatus.CANCELED]: { bg: 'bg-gray-100', text: 'text-gray-800' },
      [PaymentStatus.REFUNDED]: { bg: 'bg-purple-100', text: 'text-purple-800' },
      [PaymentStatus.REQUIRES_ACTION]: { bg: 'bg-orange-100', text: 'text-orange-800' },
      [PaymentStatus.REQUIRES_CONFIRMATION]: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      [PaymentStatus.REQUIRES_CAPTURE]: { bg: 'bg-pink-100', text: 'text-pink-800' },
    };
    
    return colors[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };
};

/**
 * Abonelik durumu renkleri
 */
export const useSubscriptionStatusColors = () => {
  return (status: string): { bg: string; text: string } => {
    const colors: Record<string, { bg: string; text: string }> = {
      'active': { bg: 'bg-green-100', text: 'text-green-800' },
      'expired': { bg: 'bg-red-100', text: 'text-red-800' },
      'canceled': { bg: 'bg-gray-100', text: 'text-gray-800' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'past_due': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'trialing': { bg: 'bg-blue-100', text: 'text-blue-800' },
    };
    
    return colors[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };
};

/**
 * Payment simülasyonu
 */
export const usePaymentSimulation = () => {
  const createPayment = useCreatePaymentIntent();
  const confirmPayment = useConfirmPayment();
  
  const simulatePayment = async (
    amount: number,
    plan: SubscriptionPlan,
    card: PaymentCard = TEST_CARDS.visa_success
  ) => {
    try {
      // 1. Payment intent oluştur
      const intentResponse = await createPayment.mutateAsync({
        user_id: 'test_user',
        amount: amount,
        currency: Currency.TRY,
        description: `${getPlanDisplayName(plan)} Plan Payment`,
        payment_method: PaymentMethod.CREDIT_CARD,
        customer_email: 'test@craftora.com',
        customer_name: 'Test User',
        metadata: {
          plan: plan,
          test: true,
          simulated: true
        }
      });
      
      // 2. Ödemeyi onayla
      if (intentResponse.payment_intent.id) {
        const confirmResponse = await confirmPayment.mutateAsync({
          payment_intent_id: intentResponse.payment_intent.id,
          payment_method: PaymentMethod.CREDIT_CARD,
          card: card
        });
        
        return {
          success: true,
          intent: intentResponse.payment_intent,
          charge: confirmResponse.charge,
          receipt_url: confirmResponse.receipt_url
        };
      }
      
      return {
        success: false,
        error: 'Payment intent creation failed'
      };
      
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  };
  
  return { simulatePayment };
};

/**
 * Abonelik checkout işlemi
 */
export const useSubscriptionCheckout = () => {
  const createPayment = useCreatePaymentIntentOptimistic();
  const confirmPayment = useConfirmPayment();
  
  const checkout = async (
    userId: string,
    planId: SubscriptionPlan,
    period: 'monthly' | 'yearly',
    card: PaymentCard,
    customerEmail: string,
    customerName: string
  ) => {
    // Plan fiyatlarını hesapla (simülasyon)
    const planPrices: Record<SubscriptionPlan, number> = {
      [SubscriptionPlan.FREE]: 0,
      [SubscriptionPlan.BASIC]: 9900, // 99 TL
      [SubscriptionPlan.PRO]: 29900, // 299 TL
      [SubscriptionPlan.PREMIUM]: 99900, // 999 TL
      [SubscriptionPlan.BUSINESS]: 199900, // 1999 TL
      [SubscriptionPlan.ENTERPRISE]: 499900, // 4999 TL
    };
    
    const amount = planPrices[planId];
    
    try {
      // 1. Payment intent oluştur
      const intentResponse = await createPayment.mutateAsync({
        user_id: userId,
        amount: amount,
        currency: Currency.TRY,
        description: `${getPlanDisplayName(planId)} ${period} subscription`,
        payment_method: PaymentMethod.CREDIT_CARD,
        customer_email: customerEmail,
        customer_name: customerName,
        metadata: {
          plan: planId,
          period: period,
          subscription: true
        }
      });
      
      // 2. Ödemeyi onayla
      if (intentResponse.payment_intent.id) {
        const confirmResponse = await confirmPayment.mutateAsync({
          payment_intent_id: intentResponse.payment_intent.id,
          payment_method: PaymentMethod.CREDIT_CARD,
          card: card
        });
        
        return {
          success: true,
          intent: intentResponse.payment_intent,
          charge: confirmResponse.charge,
          receipt_url: confirmResponse.receipt_url,
          invoice_url: confirmResponse.invoice_url
        };
      }
      
      return {
        success: false,
        error: 'Payment intent creation failed'
      };
      
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  };
  
  return { checkout };
};