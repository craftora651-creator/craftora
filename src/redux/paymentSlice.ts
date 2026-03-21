// store/slices/paymentSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';
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
  PaymentCustomer,
  PaymentStatus,
  SubscriptionPlan,
  Currency,
  PaymentProvider,
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  CancelSubscriptionRequest,
  CancelSubscriptionResponse,
  BankTransferRequest,
  BankTransferResponse,
  PaymentListParams,
  PaginatedPayments,
  PaymentCard,
  TEST_CARDS
} from '../types/payment.types';
import { PaymentMethod } from "../types/payment.types";

// ==================== STATE TYPES ====================
interface PaymentState {
  // Data
  config: PaymentConfig | null;
  health: PaymentHealth | null;
  stats: PaymentStats | null;
  plans: SubscriptionPlanDetails[];
  bankInfo: BankInfo | null;
  
  // Payment Intents
  paymentIntents: PaymentIntent[];
  currentPaymentIntent: PaymentIntent | null;
  
  // Charges
  charges: PaymentCharge[];
  paginatedCharges: PaginatedPayments | null;
  
  // Subscriptions
  subscriptions: UserSubscription[];
  userSubscriptions: Record<string, UserSubscription>; // user_id -> subscription
  currentSubscription: UserSubscription | null;
  
  // Invoices
  invoices: Invoice[];
  userInvoices: Record<string, Invoice[]>; // user_id -> invoices
  
  // Customers
  customers: PaymentCustomer[];
  
  // UI State
  loading: boolean;
  processing: boolean;
  error: string | null;
  
  // Payment Flow
  checkoutStep: 'plan' | 'payment' | 'confirmation' | 'complete';
  selectedPlan: SubscriptionPlanDetails | null;
  selectedPaymentMethod: PaymentMethod;
  paymentForm: {
    card_number: string;
    card_expiry: string;
    card_cvc: string;
    card_holder: string;
    save_card: boolean;
  };
  
  // Filters
  filter: PaymentListParams;
  
  // 3DS/Redirect Flow
  requiresAction: boolean;
  actionUrl: string | null;
  pollingPaymentId: string | null;
}

// ==================== INITIAL STATE ====================
const initialState: PaymentState = {
  // Data
  config: null,
  health: null,
  stats: null,
  plans: [],
  bankInfo: null,
  
  // Payment Intents
  paymentIntents: [],
  currentPaymentIntent: null,
  
  // Charges
  charges: [],
  paginatedCharges: null,
  
  // Subscriptions
  subscriptions: [],
  userSubscriptions: {},
  currentSubscription: null,
  
  // Invoices
  invoices: [],
  userInvoices: {},
  
  // Customers
  customers: [],
  
  // UI State
  loading: false,
  processing: false,
  error: null,
  
  // Payment Flow
  checkoutStep: 'plan',
  selectedPlan: null,
  selectedPaymentMethod: PaymentMethod.CREDIT_CARD,
  paymentForm: {
    card_number: '',
    card_expiry: '',
    card_cvc: '',
    card_holder: '',
    save_card: false,
  },
  
  // Filters
  filter: {
    page: 1,
    limit: 20,
  },
  
  // 3DS/Redirect Flow
  requiresAction: false,
  actionUrl: null,
  pollingPaymentId: null,
};

// ==================== ASYNC THUNKS ====================

/**
 * Payment config getir
 */
export const fetchPaymentConfig = createAsyncThunk<
  PaymentConfig,
  void,
  { rejectValue: string }
>('payment/fetchConfig', async (_, { rejectWithValue }) => {
  try {
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
  } catch (error: any) {
    return rejectWithValue(error.message || 'Payment config yüklenemedi');
  }
});

/**
 * Payment health check
 */
export const fetchPaymentHealth = createAsyncThunk<
  PaymentHealth,
  void,
  { rejectValue: string }
>('payment/fetchHealth', async (_, { rejectWithValue }) => {
  try {
    return await apiClient.goGet<PaymentHealth>('/payment/health');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Health check yapılamadı');
  }
});

/**
 * Payment stats getir
 */
export const fetchPaymentStats = createAsyncThunk<
  PaymentStats,
  void,
  { rejectValue: string }
>('payment/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.goGet<PaymentStats>('/payment/stats');
    return response;
  } catch (error: any) {
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
});

/**
 * Abonelik planlarını getir
 */
export const fetchSubscriptionPlans = createAsyncThunk<
  SubscriptionPlanDetails[],
  void,
  { rejectValue: string }
>('payment/fetchPlans', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.goGet<{ plans: Record<string, any> }>('/payment/plans');
    
    // Object'i array'e çevir ve formatla
    const plans = Object.values(response.plans || {}).map(plan => ({
      ...plan,
      display_name: plan.name || 'Plan',
      price_formatted: `₺${(plan.price / 100).toFixed(2)}`,
    }));
    
    return plans as SubscriptionPlanDetails[];
  } catch (error: any) {
    return rejectWithValue(error.message || 'Planlar yüklenemedi');
  }
});

/**
 * Banka bilgilerini getir
 */
export const fetchBankInfo = createAsyncThunk<
  BankInfo,
  void,
  { rejectValue: string }
>('payment/fetchBankInfo', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.goGet<{ bank_info: BankInfo }>('/payment/bank');
    return response.bank_info || {
      bank_name: 'Test Bank',
      account_name: 'Test Account',
      iban: 'TR00 0000 0000 0000 0000 0000 00',
      account_number: '0000-0000-0000',
      currency: Currency.TRY
    };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Banka bilgileri yüklenemedi');
  }
});

/**
 * Payment intent oluştur
 */
export const createPaymentIntent = createAsyncThunk<
  CreatePaymentIntentResponse,
  CreatePaymentIntentRequest,
  { rejectValue: string }
>('payment/createIntent', async (data, { rejectWithValue }) => {
  try {
    return await apiClient.goPost<CreatePaymentIntentResponse>('/payment/create', data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Payment intent oluşturulamadı');
  }
});

/**
 * Ödeme onayla
 */
export const confirmPayment = createAsyncThunk<
  ConfirmPaymentResponse,
  ConfirmPaymentRequest,
  { rejectValue: string }
>('payment/confirmPayment', async (data, { rejectWithValue }) => {
  try {
    return await apiClient.goPost<ConfirmPaymentResponse>('/payment/confirm', data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ödeme onaylanamadı');
  }
});

/**
 * Ödeme durumu getir
 */
export const getPaymentStatus = createAsyncThunk<
  PaymentIntent,
  string,
  { rejectValue: string }
>('payment/getStatus', async (paymentId, { rejectWithValue }) => {
  try {
    const response = await apiClient.goGet<{ payment_intent: PaymentIntent }>(`/payment/status/${paymentId}`);
    return response.payment_intent;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ödeme durumu alınamadı');
  }
});

/**
 * Abonelik oluştur
 */
export const createSubscription = createAsyncThunk<
  CreateSubscriptionResponse,
  CreateSubscriptionRequest,
  { rejectValue: string }
>('payment/createSubscription', async (data, { rejectWithValue }) => {
  try {
    return await apiClient.goPost<CreateSubscriptionResponse>('/payment/subscribe', data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Abonelik oluşturulamadı');
  }
});

/**
 * Abonelik iptal et
 */
export const cancelSubscription = createAsyncThunk<
  CancelSubscriptionResponse,
  CancelSubscriptionRequest,
  { rejectValue: string }
>('payment/cancelSubscription', async (data, { rejectWithValue }) => {
  try {
    return await apiClient.goPost<CancelSubscriptionResponse>('/payment/subscription/cancel', data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Abonelik iptal edilemedi');
  }
});

/**
 * Kullanıcının aboneliğini getir
 */
export const fetchUserSubscription = createAsyncThunk<
  UserSubscription | null,
  string,
  { rejectValue: string }
>('payment/fetchUserSubscription', async (userId, { rejectWithValue }) => {
  try {
    const response = await apiClient.goGet<{ subscription: UserSubscription }>(`/payment/user/${userId}/subscription`);
    return response.subscription || null;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Abonelik bilgisi alınamadı');
  }
});

/**
 * Kullanıcının faturalarını getir
 */
export const fetchUserInvoices = createAsyncThunk<
  Invoice[],
  string,
  { rejectValue: string }
>('payment/fetchUserInvoices', async (userId, { rejectWithValue }) => {
  try {
    const response = await apiClient.goGet<{ invoices: Invoice[] }>(`/payment/user/${userId}/invoices`);
    return response.invoices || [];
  } catch (error: any) {
    return rejectWithValue(error.message || 'Faturalar yüklenemedi');
  }
});

/**
 * Ödeme geçmişi getir
 */
export const fetchPaymentHistory = createAsyncThunk<
  PaginatedPayments,
  PaymentListParams,
  { rejectValue: string }
>('payment/fetchHistory', async (params, { rejectWithValue }) => {
  try {
    const response = await apiClient.goGet<PaginatedPayments>('/payment/history', { params });
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Ödeme geçmişi yüklenemedi');
  }
});

/**
 * Banka transferi başlat
 */
export const createBankTransfer = createAsyncThunk<
  BankTransferResponse,
  BankTransferRequest,
  { rejectValue: string }
>('payment/createBankTransfer', async (data, { rejectWithValue }) => {
  try {
    return await apiClient.goPost<BankTransferResponse>('/payment/bank-transfer', data);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Banka transferi başlatılamadı');
  }
});

// ==================== SLICE ====================
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // UI Actions
    setCheckoutStep: (state, action: PayloadAction<PaymentState['checkoutStep']>) => {
      state.checkoutStep = action.payload;
    },
    
    selectPlan: (state, action: PayloadAction<SubscriptionPlanDetails>) => {
      state.selectedPlan = action.payload;
      state.checkoutStep = 'payment';
    },
    
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.selectedPaymentMethod = action.payload;
    },
    
    updatePaymentForm: (state, action: PayloadAction<Partial<PaymentState['paymentForm']>>) => {
      state.paymentForm = { ...state.paymentForm, ...action.payload };
    },
    
    resetPaymentForm: (state) => {
      state.paymentForm = initialState.paymentForm;
    },
    
    // Test card
    fillTestCard: (state, action: PayloadAction<keyof typeof TEST_CARDS>) => {
      const testCard = TEST_CARDS[action.payload];
      state.paymentForm = {
        card_number: testCard.number,
        card_expiry: `${testCard.exp_month.toString().padStart(2, '0')}/${testCard.exp_year.toString().slice(-2)}`,
        card_cvc: testCard.cvc,
        card_holder: testCard.card_holder,
        save_card: false,
      };
    },
    
    // 3DS Flow
    setRequiresAction: (state, action: PayloadAction<{ requires: boolean; url?: string }>) => {
      state.requiresAction = action.payload.requires;
      state.actionUrl = action.payload.url || null;
    },
    
    setPollingPaymentId: (state, action: PayloadAction<string | null>) => {
      state.pollingPaymentId = action.payload;
    },
    
    // Filters
    setFilter: (state, action: PayloadAction<Partial<PaymentListParams>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    
    clearFilter: (state) => {
      state.filter = initialState.filter;
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    },
    
    // Optimistic updates
    addPaymentIntentOptimistically: (state, action: PayloadAction<Omit<PaymentIntent, 'id' | 'created_at' | 'updated_at'>>) => {
      const optimisticIntent: PaymentIntent = {
        ...action.payload,
        id: `temp_${Date.now()}`,
        status: PaymentStatus.PENDING,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      state.paymentIntents.unshift(optimisticIntent);
      state.currentPaymentIntent = optimisticIntent;
    },
    
    updatePaymentIntentStatus: (state, action: PayloadAction<{ tempId: string; status: PaymentStatus; error?: string }>) => {
      const { tempId, status, error } = action.payload;
      
      // Update in payment intents array
      state.paymentIntents = state.paymentIntents.map(intent => 
        intent.id === tempId 
          ? { ...intent, status, error }
          : intent
      );
      
      // Update current payment intent
      if (state.currentPaymentIntent?.id === tempId) {
        state.currentPaymentIntent.status = status;
        if (error) {
          state.currentPaymentIntent.last_payment_error = error;
        }
      }
    },
    
    removeTempPaymentIntent: (state, action: PayloadAction<string>) => {
      state.paymentIntents = state.paymentIntents.filter(intent => intent.id !== action.payload);
    },
    
    // Reset checkout
    resetCheckout: (state) => {
      state.checkoutStep = 'plan';
      state.selectedPlan = null;
      state.selectedPaymentMethod = PaymentMethod.CREDIT_CARD;
      state.paymentForm = initialState.paymentForm;
      state.requiresAction = false;
      state.actionUrl = null;
      state.pollingPaymentId = null;
      state.currentPaymentIntent = null;
    },
    
    // Simulate payment (for testing)
    simulatePayment: (state, action: PayloadAction<{ amount: number; plan: SubscriptionPlan }>) => {
      const { amount, plan } = action.payload;
      
      const simulatedCharge: PaymentCharge = {
        id: `ch_sim_${Date.now()}`,
        amount: amount,
        currency: Currency.TRY,
        status: PaymentStatus.SUCCEEDED,
        payment_intent_id: `pi_sim_${Date.now()}`,
        customer_id: 'cus_test',
        customer_email: 'test@craftora.com',
        description: `Simulated payment for ${plan} plan`,
        fee: Math.floor(amount * 0.03), // %3 fee
        net_amount: amount - Math.floor(amount * 0.03),
        receipt_url: '/receipt/simulated',
        statement_descriptor: 'CRAFTORA*SIMULATED',
        created_at: new Date().toISOString(),
        paid_at: new Date().toISOString(),
        metadata: {
          simulated: true,
          plan: plan,
          test: true
        },
      };
      
      state.charges.unshift(simulatedCharge);
      
      // Update stats optimistically
      if (state.stats) {
        state.stats.total_payments += 1;
        state.stats.total_revenue += amount;
        state.stats.today_payments += 1;
        state.stats.today_revenue += amount;
        state.stats.monthly_revenue += amount;
        state.stats.yearly_revenue += amount;
        
        state.stats.by_plan[plan] = (state.stats.by_plan[plan] || 0) + 1;
        state.stats.by_status[PaymentStatus.SUCCEEDED] = (state.stats.by_status[PaymentStatus.SUCCEEDED] || 0) + 1;
        state.stats.by_method[PaymentMethod.CREDIT_CARD] = (state.stats.by_method[PaymentMethod.CREDIT_CARD] || 0) + 1;
        state.stats.by_currency[Currency.TRY] = (state.stats.by_currency[Currency.TRY] || 0) + 1;
      }
    },
  },
  
  extraReducers: (builder) => {
    // ===== fetchPaymentConfig =====
    builder.addCase(fetchPaymentConfig.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(fetchPaymentConfig.fulfilled, (state, action) => {
      state.loading = false;
      state.config = action.payload;
    });
    
    builder.addCase(fetchPaymentConfig.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Config yüklenemedi';
    });
    
    // ===== fetchPaymentHealth =====
    builder.addCase(fetchPaymentHealth.fulfilled, (state, action) => {
      state.health = action.payload;
    });
    
    // ===== fetchPaymentStats =====
    builder.addCase(fetchPaymentStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
    
    // ===== fetchSubscriptionPlans =====
    builder.addCase(fetchSubscriptionPlans.pending, (state) => {
      state.loading = true;
    });
    
    builder.addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
      state.loading = false;
      state.plans = action.payload;
    });
    
    builder.addCase(fetchSubscriptionPlans.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Planlar yüklenemedi';
    });
    
    // ===== fetchBankInfo =====
    builder.addCase(fetchBankInfo.fulfilled, (state, action) => {
      state.bankInfo = action.payload;
    });
    
    // ===== createPaymentIntent =====
    builder.addCase(createPaymentIntent.pending, (state) => {
      state.processing = true;
      state.error = null;
    });
    
    builder.addCase(createPaymentIntent.fulfilled, (state, action) => {
      state.processing = false;
      
      const paymentIntent = action.payload.payment_intent;
      
      // Optimistic intent'i gerçek intent ile değiştir
      const tempIndex = state.paymentIntents.findIndex(intent => intent.id.startsWith('temp_'));
      if (tempIndex !== -1) {
        state.paymentIntents[tempIndex] = paymentIntent;
      } else {
        state.paymentIntents.unshift(paymentIntent);
      }
      
      state.currentPaymentIntent = paymentIntent;
      
      // 3DS action gerekiyorsa
      if (action.payload.requires_action) {
        state.requiresAction = true;
        state.actionUrl = action.payload.next_action?.url || null;
        state.pollingPaymentId = paymentIntent.id;
      }
    });
    
    builder.addCase(createPaymentIntent.rejected, (state, action) => {
      state.processing = false;
      state.error = action.payload || 'Payment intent oluşturulamadı';
      
      // Optimistic intent'i failed olarak işaretle
      const tempIndex = state.paymentIntents.findIndex(intent => intent.id.startsWith('temp_'));
      if (tempIndex !== -1) {
        state.paymentIntents[tempIndex].status = PaymentStatus.FAILED;
        state.paymentIntents[tempIndex].last_payment_error = action.payload;
      }
    });
    
    // ===== confirmPayment =====
    builder.addCase(confirmPayment.pending, (state) => {
      state.processing = true;
    });
    
    builder.addCase(confirmPayment.fulfilled, (state, action) => {
      state.processing = false;
      
      const paymentIntent = action.payload.payment_intent;
      
      // Payment intent'i güncelle
      state.paymentIntents = state.paymentIntents.map(intent => 
        intent.id === paymentIntent.id ? paymentIntent : intent
      );
      
      if (state.currentPaymentIntent?.id === paymentIntent.id) {
        state.currentPaymentIntent = paymentIntent;
      }
      
      // Charge'ı ekle
      if (action.payload.charge) {
        state.charges.unshift(action.payload.charge);
      }
      
      // Checkout'u tamamla
      if (paymentIntent.status === PaymentStatus.SUCCEEDED) {
        state.checkoutStep = 'complete';
      }
    });
    
    builder.addCase(confirmPayment.rejected, (state, action) => {
      state.processing = false;
      state.error = action.payload || 'Ödeme onaylanamadı';
    });
    
    // ===== getPaymentStatus =====
    builder.addCase(getPaymentStatus.fulfilled, (state, action) => {
      const paymentIntent = action.payload;
      
      // Payment intent'i güncelle
      state.paymentIntents = state.paymentIntents.map(intent => 
        intent.id === paymentIntent.id ? paymentIntent : intent
      );
      
      if (state.currentPaymentIntent?.id === paymentIntent.id) {
        state.currentPaymentIntent = paymentIntent;
      }
      
      // Eğer ödeme başarılı olduysa polling'i durdur
      if (paymentIntent.status === PaymentStatus.SUCCEEDED) {
        state.pollingPaymentId = null;
        state.checkoutStep = 'complete';
      }
      
      // Eğer ödeme failed olduysa polling'i durdur
      if (paymentIntent.status === PaymentStatus.FAILED) {
        state.pollingPaymentId = null;
      }
    });
    
    // ===== createSubscription =====
    builder.addCase(createSubscription.pending, (state) => {
      state.processing = true;
    });
    
    builder.addCase(createSubscription.fulfilled, (state, action) => {
      state.processing = false;
      
      const subscription = action.payload.subscription;
      
      // Subscription'ı ekle
      state.subscriptions.push(subscription);
      state.userSubscriptions[subscription.user_id] = subscription;
      
      // Checkout'u tamamla
      state.checkoutStep = 'complete';
    });
    
    builder.addCase(createSubscription.rejected, (state, action) => {
      state.processing = false;
      state.error = action.payload || 'Abonelik oluşturulamadı';
    });
    
    // ===== cancelSubscription =====
    builder.addCase(cancelSubscription.fulfilled, (state, action) => {
      const subscription = action.payload.subscription;
      
      // Subscription'ı güncelle
      state.subscriptions = state.subscriptions.map(sub => 
        sub.subscription_id === subscription.subscription_id ? subscription : sub
      );
      
      if (state.userSubscriptions[subscription.user_id]) {
        state.userSubscriptions[subscription.user_id] = subscription;
      }
      
      if (state.currentSubscription?.subscription_id === subscription.subscription_id) {
        state.currentSubscription = subscription;
      }
    });
    
    // ===== fetchUserSubscription =====
    builder.addCase(fetchUserSubscription.fulfilled, (state, action) => {
      const subscription = action.payload;
      
      if (subscription) {
        state.userSubscriptions[subscription.user_id] = subscription;
        state.currentSubscription = subscription;
      }
    });
    
    // ===== fetchUserInvoices =====
    builder.addCase(fetchUserInvoices.fulfilled, (state, action) => {
      const userId = action.meta.arg;
      state.userInvoices[userId] = action.payload;
    });
    
    // ===== fetchPaymentHistory =====
    builder.addCase(fetchPaymentHistory.pending, (state) => {
      state.loading = true;
    });
    
    builder.addCase(fetchPaymentHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.paginatedCharges = action.payload;
      state.charges = action.payload.payments;
    });
    
    builder.addCase(fetchPaymentHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Ödeme geçmişi yüklenemedi';
    });
    
    // ===== createBankTransfer =====
    builder.addCase(createBankTransfer.fulfilled, (state, action) => {
      const paymentIntent = action.payload.payment_intent;
      
      state.paymentIntents.unshift(paymentIntent);
      state.currentPaymentIntent = paymentIntent;
      state.checkoutStep = 'complete';
    });
  },
});

// ==================== EXPORTS ====================
export const {
  // UI Actions
  setCheckoutStep,
  selectPlan,
  setPaymentMethod,
  updatePaymentForm,
  resetPaymentForm,
  fillTestCard,
  
  // 3DS Flow
  setRequiresAction,
  setPollingPaymentId,
  
  // Filters
  setFilter,
  clearFilter,
  
  // Error handling
  clearError,
  
  // Optimistic updates
  addPaymentIntentOptimistically,
  updatePaymentIntentStatus,
  removeTempPaymentIntent,
  
  // Reset checkout
  resetCheckout,
  
  // Simulation
  simulatePayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;

// ==================== SELECTORS ====================
export const selectPayment = (state: { payment: PaymentState }) => state.payment;
export const selectPaymentConfig = (state: { payment: PaymentState }) => state.payment.config;
export const selectPaymentHealth = (state: { payment: PaymentState }) => state.payment.health;
export const selectPaymentStats = (state: { payment: PaymentState }) => state.payment.stats;
export const selectSubscriptionPlans = (state: { payment: PaymentState }) => state.payment.plans;
export const selectBankInfo = (state: { payment: PaymentState }) => state.payment.bankInfo;
export const selectPaymentIntents = (state: { payment: PaymentState }) => state.payment.paymentIntents;
export const selectCurrentPaymentIntent = (state: { payment: PaymentState }) => state.payment.currentPaymentIntent;
export const selectCharges = (state: { payment: PaymentState }) => state.payment.charges;
export const selectPaginatedCharges = (state: { payment: PaymentState }) => state.payment.paginatedCharges;
export const selectUserSubscription = (userId: string) => (state: { payment: PaymentState }) => 
  state.payment.userSubscriptions[userId] || null;
export const selectCurrentSubscription = (state: { payment: PaymentState }) => state.payment.currentSubscription;
export const selectUserInvoices = (userId: string) => (state: { payment: PaymentState }) => 
  state.payment.userInvoices[userId] || [];
export const selectPaymentLoading = (state: { payment: PaymentState }) => state.payment.loading;
export const selectPaymentProcessing = (state: { payment: PaymentState }) => state.payment.processing;
export const selectPaymentError = (state: { payment: PaymentState }) => state.payment.error;

// Checkout state
export const selectCheckoutStep = (state: { payment: PaymentState }) => state.payment.checkoutStep;
export const selectSelectedPlan = (state: { payment: PaymentState }) => state.payment.selectedPlan;
export const selectSelectedPaymentMethod = (state: { payment: PaymentState }) => state.payment.selectedPaymentMethod;
export const selectPaymentForm = (state: { payment: PaymentState }) => state.payment.paymentForm;
export const selectRequiresAction = (state: { payment: PaymentState }) => state.payment.requiresAction;
export const selectActionUrl = (state: { payment: PaymentState }) => state.payment.actionUrl;
export const selectPollingPaymentId = (state: { payment: PaymentState }) => state.payment.pollingPaymentId;

// Filters
export const selectPaymentFilter = (state: { payment: PaymentState }) => state.payment.filter;

// Utility selectors
export const selectActiveSubscriptions = (state: { payment: PaymentState }) => 
  state.payment.subscriptions.filter(sub => sub.status === 'active');

export const selectExpiringSubscriptions = (state: { payment: PaymentState }) => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return state.payment.subscriptions.filter(sub => {
    if (sub.status !== 'active') return false;
    
    const endDate = new Date(sub.current_period_end);
    return endDate <= nextWeek && endDate >= now;
  });
};

export const selectSuccessfulPayments = (state: { payment: PaymentState }) => 
  state.payment.charges.filter(charge => charge.status === PaymentStatus.SUCCEEDED);

export const selectTotalRevenue = (state: { payment: PaymentState }) => 
  state.payment.charges
    .filter(charge => charge.status === PaymentStatus.SUCCEEDED)
    .reduce((total, charge) => total + charge.amount, 0);

export const selectTodayRevenue = (state: { payment: PaymentState }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return state.payment.charges
    .filter(charge => {
      if (charge.status !== PaymentStatus.SUCCEEDED) return false;
      
      const paidDate = new Date(charge.paid_at || charge.created_at);
      return paidDate >= today;
    })
    .reduce((total, charge) => total + charge.amount, 0);
};

export const selectPlanByPrice = (price: number) => (state: { payment: PaymentState }) => 
  state.payment.plans.find(plan => plan.price === price);

export const selectPlanByName = (name: SubscriptionPlan) => (state: { payment: PaymentState }) => 
  state.payment.plans.find(plan => plan.name === name);