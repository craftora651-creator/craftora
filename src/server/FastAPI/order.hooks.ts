import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";
import type { 
  OrderResponse,
  OrderCustomer,
  OrderSeller,
  OrderCreateRequest,
  OrderStatusUpdateRequest,
  OrderRefundRequest,
  OrderFulfillmentRequest,
  OrderDeliveryConfirmation,
  OrderBulkActionRequest,
  OrderExportRequest,
  OrderSearchParams,
  OrderStats,
  ShopOrderStats,
  OrderStatus,
  OrderApiResponse,
  OrdersApiResponse,
  OrderStatsResponse,
  PaginatedOrderResponses,
  PaginatedOrderCustomers,
  PaginatedOrderSellers,
  OrderType,
  PaymentMethod,
  OrderUpdateRequest,
  FulfillmentStatus,
} from "../../types/order.types";

// ==================== ORDER QUERIES ====================

/**
 * Get current user's orders (as buyer)
 */
export const useMyOrders = (
  filters?: {
    status?: OrderStatus;
    shop_id?: string;
    date_from?: string;
    date_to?: string;
  },
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery<OrderCustomer[], Error>({
    queryKey: ["orders", "my", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.shop_id) params.append("shop_id", filters.shop_id);
      if (filters?.date_from) params.append("date_from", filters.date_from);
      if (filters?.date_to) params.append("date_to", filters.date_to);
      
      const url = `/api/orders/my${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<OrderCustomer[]>(url);
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 2 * 60 * 1000, // 2 dakika
    retry: 2,
  });
};

/**
 * Get orders for a specific shop (seller view)
 */
export const useShopOrders = (
  shopId: string,
  filters?: {
    status?: OrderStatus;
    fulfillment_status?: FulfillmentStatus;
    date_from?: string;
    date_to?: string;
  },
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<OrderSeller[], Error>({
    queryKey: ["orders", "shop", shopId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.fulfillment_status) params.append("fulfillment_status", filters.fulfillment_status);
      if (filters?.date_from) params.append("date_from", filters.date_from);
      if (filters?.date_to) params.append("date_to", filters.date_to);
      
      const url = `/api/orders/shop/${shopId}${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<OrderSeller[]>(url);
    },
    enabled: options?.enabled ?? !!shopId,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

/**
 * Get order by ID
 */
export const useOrder = (
  orderId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  }
) => {
  return useQuery<OrderResponse, Error>({
    queryKey: ["order", "detail", orderId],
    queryFn: async () => {
      return await apiClient.get<OrderResponse>(`/api/orders/${orderId}`);
    },
    enabled: options?.enabled ?? !!orderId,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 dakika
    retry: 1,
  });
};

/**
 * Get order downloads (digital products)
 */
export const useOrderDownloads = (
  orderId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<
    {
      order_id: string;
      order_number: string;
      digital_delivered: boolean;
      digital_delivered_at: string | null;
      downloads: Array<{
        product_id: string;
        product_name: string;
        file_url: string;
        file_name: string;
        downloads_used: number;
        downloads_remaining: number;
        download_limit: number;
        access_expires: string | null;
      }>;
    },
    Error
  >({
    queryKey: ["order", "downloads", orderId],
    queryFn: async () => {
      return await apiClient.get<{
        order_id: string;
        order_number: string;
        digital_delivered: boolean;
        digital_delivered_at: string | null;
        downloads: Array<{
          product_id: string;
          product_name: string;
          file_url: string;
          file_name: string;
          downloads_used: number;
          downloads_remaining: number;
          download_limit: number;
          access_expires: string | null;
        }>;
      }>(`/api/orders/${orderId}/downloads`);
    },
    enabled: options?.enabled ?? !!orderId,
  });
};

/**
 * Search orders (admin only)
 */
export const useSearchOrders = (
  searchParams: OrderSearchParams,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<OrderResponse[], Error>({
    queryKey: ["orders", "search", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Add search parameters
      if (searchParams.search) params.append("search", searchParams.search);
      if (searchParams.shop_id) params.append("shop_id", searchParams.shop_id);
      if (searchParams.customer_email) params.append("customer_email", searchParams.customer_email);
      if (searchParams.status) params.append("status", searchParams.status);
      if (searchParams.order_type) params.append("order_type", searchParams.order_type);
      if (searchParams.payment_status) params.append("payment_status", searchParams.payment_status);
      if (searchParams.fulfillment_status) params.append("fulfillment_status", searchParams.fulfillment_status);
      if (searchParams.payment_method) params.append("payment_method", searchParams.payment_method);
      if (searchParams.date_from) params.append("date_from", searchParams.date_from);
      if (searchParams.date_to) params.append("date_to", searchParams.date_to);
      if (searchParams.min_amount) params.append("min_amount", searchParams.min_amount.toString());
      if (searchParams.max_amount) params.append("max_amount", searchParams.max_amount.toString());
      if (searchParams.has_digital !== undefined) params.append("has_digital", searchParams.has_digital.toString());
      if (searchParams.has_physical !== undefined) params.append("has_physical", searchParams.has_physical.toString());
      if (searchParams.page) params.append("page", searchParams.page.toString());
      if (searchParams.limit) params.append("limit", searchParams.limit.toString());
      if (searchParams.sort_by) params.append("sort_by", searchParams.sort_by);
      if (searchParams.sort_order) params.append("sort_order", searchParams.sort_order);
      
      const url = `/api/orders/search${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<OrderResponse[]>(url);
    },
    enabled: options?.enabled ?? true,
  });
};

/**
 * Get sales statistics
 */
export const useSalesStatistics = (
  period: "day" | "week" | "month" | "year" = "month",
  shopId?: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<OrderStats | ShopOrderStats, Error>({
    queryKey: ["orders", "stats", period, shopId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("period", period);
      if (shopId) params.append("shop_id", shopId);
      
      const url = `/api/orders/stats/sales${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<OrderStats | ShopOrderStats>(url);
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

// ==================== ORDER MUTATIONS ====================

/**
 * Create order from cart
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation<OrderResponse, Error, OrderCreateRequest>({
    mutationFn: async (orderData: OrderCreateRequest) => {
      return await apiClient.post<OrderResponse>("/api/orders", orderData);
    },
    onSuccess: (createdOrder) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      
      // Add to cache
      queryClient.setQueryData<OrderCustomer[]>(
        ["orders", "my"],
        (old = []) => [createdOrder as OrderCustomer, ...old]
      );
      
      console.log(`Order created: ${createdOrder.order_number}`);
    },
    onError: (error) => {
      console.error("Error creating order:", error);
    },
  });
};

/**
 * Update order status (seller/admin only)
 */
export const useUpdateOrderStatus = (orderId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      order_id: string;
      order_number: string;
      old_status: string;
      new_status: string;
      updated_by: string;
      notes?: string;
    },
    Error,
    OrderStatusUpdateRequest
  >({
    mutationFn: async (statusUpdate: OrderStatusUpdateRequest) => {
      return await apiClient.put<{
        message: string;
        order_id: string;
        order_number: string;
        old_status: string;
        new_status: string;
        updated_by: string;
        notes?: string;
      }>(`/api/orders/${orderId}/status`, statusUpdate);
    },
    onSuccess: (response) => {
      // Update order cache
      queryClient.setQueryData<OrderResponse>(["order", "detail", orderId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: response.new_status as OrderStatus,
        };
      });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "shop"] });
      
      console.log(`Order status updated: ${response.order_number} (${response.old_status} -> ${response.new_status})`);
    },
    onError: (error) => {
      console.error("Error updating order status:", error);
    },
  });
};

/**
 * Fulfill order items (mark as shipped/fulfilled)
 */
export const useFulfillOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      order_id: string;
      order_number: string;
      fulfillment_status: string;
      tracking_number?: string;
      estimated_delivery_date?: string;
    },
    Error,
    OrderFulfillmentRequest
  >({
    mutationFn: async (fulfillmentData: OrderFulfillmentRequest) => {
      return await apiClient.post<{
        message: string;
        order_id: string;
        order_number: string;
        fulfillment_status: string;
        tracking_number?: string;
        estimated_delivery_date?: string;
      }>(`/api/orders/${orderId}/fulfill`, fulfillmentData);
    },
    onSuccess: (response) => {
      // Update order cache
      queryClient.setQueryData<OrderResponse>(["order", "detail", orderId], (old) => {
        if (!old) return old;
        return {
          ...old,
          fulfillment_status: response.fulfillment_status as FulfillmentStatus,
          tracking_number: response.tracking_number,
          estimated_delivery_date: response.estimated_delivery_date,
        };
      });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["orders", "shop"] });
      
      console.log(`Order fulfilled: ${response.order_number}`);
    },
    onError: (error) => {
      console.error("Error fulfilling order:", error);
    },
  });
};

/**
 * Mark order as delivered (buyer only)
 */
export const useMarkOrderDelivered = (orderId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      order_id: string;
      order_number: string;
      fulfillment_status: string;
      delivered_at: string;
    },
    Error,
    OrderDeliveryConfirmation
  >({
    mutationFn: async (deliveryData: OrderDeliveryConfirmation) => {
      return await apiClient.post<{
        message: string;
        order_id: string;
        order_number: string;
        fulfillment_status: string;
        delivered_at: string;
      }>(`/api/orders/${orderId}/deliver`, deliveryData);
    },
    onSuccess: (response) => {
      // Update order cache
      queryClient.setQueryData<OrderResponse>(["order", "detail", orderId], (old) => {
        if (!old) return old;
        return {
          ...old,
          fulfillment_status: FulfillmentStatus.DELIVERED,
        };
      });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
      
      console.log(`Order marked as delivered: ${response.order_number}`);
    },
    onError: (error) => {
      console.error("Error marking order as delivered:", error);
    },
  });
};

/**
 * Refund order
 */
export const useRefundOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      message: string;
      order_id: string;
      order_number: string;
      refund_amount: number;
      total_refunded: number;
      remaining_balance: number;
      order_status: string;
      refund_reason: string;
    },
    Error,
    OrderRefundRequest
  >({
    mutationFn: async (refundData: OrderRefundRequest) => {
      return await apiClient.post<{
        message: string;
        order_id: string;
        order_number: string;
        refund_amount: number;
        total_refunded: number;
        remaining_balance: number;
        order_status: string;
        refund_reason: string;
      }>(`/api/orders/${orderId}/refund`, refundData);
    },
    onSuccess: (response) => {
      // Update order cache
      queryClient.setQueryData<OrderResponse>(["order", "detail", orderId], (old) => {
        if (!old) return old;
        return {
          ...old,
          status: response.order_status as OrderStatus,
          refund_amount: response.total_refunded,
          refund_reason: response.refund_reason,
        };
      });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "shop"] });
      
      console.log(`Order refunded: ${response.order_number}, amount: $${response.refund_amount}`);
    },
    onError: (error) => {
      console.error("Error refunding order:", error);
    },
  });
};

/**
 * Bulk order actions
 */
export const useBulkOrderAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    {
      action: string;
      total_orders: number;
      processed: number;
      successful: number;
      failed: number;
      results: Array<{
        order_id: string;
        order_number: string;
        success: boolean;
        message?: string;
        error?: string;
      }>;
      notify_customers: boolean;
    },
    Error,
    OrderBulkActionRequest
  >({
    mutationFn: async (bulkAction: OrderBulkActionRequest) => {
      return await apiClient.post<{
        action: string;
        total_orders: number;
        processed: number;
        successful: number;
        failed: number;
        results: Array<{
          order_id: string;
          order_number: string;
          success: boolean;
          message?: string;
          error?: string;
        }>;
        notify_customers: boolean;
      }>("/api/orders/bulk/action", bulkAction);
    },
    onSuccess: (response) => {
      // Invalidate all order queries since we don't know which ones were updated
      queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "shop"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "search"] });
      
      console.log(`Bulk order action completed: ${response.action}, successful: ${response.successful}/${response.total_orders}`);
    },
    onError: (error) => {
      console.error("Error performing bulk order action:", error);
    },
  });
};

/**
 * Export orders
 */
export const useExportOrders = () => {
  return useMutation<
    {
      task_id: string;
      status: 'pending' | 'processing' | 'completed' | 'failed';
      download_url?: string;
      estimated_completion_time?: string;
    },
    Error,
    OrderExportRequest
  >({
    mutationFn: async (exportData: OrderExportRequest) => {
      return await apiClient.post<{
        task_id: string;
        status: 'pending' | 'processing' | 'completed' | 'failed';
        download_url?: string;
        estimated_completion_time?: string;
      }>("/api/orders/export", exportData);
    },
    onSuccess: (response) => {
      console.log(`Order export started: ${response.task_id}, status: ${response.status}`);
    },
    onError: (error) => {
      console.error("Error exporting orders:", error);
    },
  });
};

// ==================== ADMIN ORDER HOOKS ====================

/**
 * List all orders (admin only)
 */
export const useAdminOrders = (
  searchParams: OrderSearchParams,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<OrderResponse[], Error>({
    queryKey: ["orders", "admin", "list", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Add search parameters
      if (searchParams.search) params.append("search", searchParams.search);
      if (searchParams.shop_id) params.append("shop_id", searchParams.shop_id);
      if (searchParams.customer_email) params.append("customer_email", searchParams.customer_email);
      if (searchParams.status) params.append("status", searchParams.status);
      if (searchParams.order_type) params.append("order_type", searchParams.order_type);
      if (searchParams.payment_method) params.append("payment_method", searchParams.payment_method);
      if (searchParams.date_from) params.append("date_from", searchParams.date_from);
      if (searchParams.date_to) params.append("date_to", searchParams.date_to);
      if (searchParams.min_amount) params.append("min_amount", searchParams.min_amount.toString());
      if (searchParams.max_amount) params.append("max_amount", searchParams.max_amount.toString());
      if (searchParams.page) params.append("page", searchParams.page.toString());
      if (searchParams.limit) params.append("limit", searchParams.limit.toString());
      if (searchParams.sort_by) params.append("sort_by", searchParams.sort_by);
      
      const url = `/api/orders/admin/list${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<OrderResponse[]>(url);
    },
    enabled: options?.enabled ?? true,
    staleTime: 1 * 60 * 1000, // 1 dakika
  });
};

// ==================== HELPER HOOKS ====================

/**
 * Track export progress
 */
export const useExportProgress = (taskId: string) => {
  return useQuery<
    {
      task_id: string;
      status: 'pending' | 'processing' | 'completed' | 'failed';
      progress: number;
      download_url?: string;
      estimated_completion_time?: string;
      created_at: string;
      completed_at?: string;
    },
    Error
  >({
    queryKey: ["orders", "export", "progress", taskId],
    queryFn: async () => {
      return await apiClient.get<{
        task_id: string;
        status: 'pending' | 'processing' | 'completed' | 'failed';
        progress: number;
        download_url?: string;
        estimated_completion_time?: string;
        created_at: string;
        completed_at?: string;
      }>(`/api/orders/export/progress/${taskId}`);
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "processing") {
        return 2000; // Her 2 saniyede bir kontrol et
      }
      return false;
    },
    enabled: !!taskId,
  });
};

/**
 * Get order timeline/status history
 */
export const useOrderTimeline = (orderId: string) => {
  return useQuery<
    Array<{
      id: string;
      type: string;
      title: string;
      description?: string;
      timestamp: string;
      user_id?: string;
      user_name?: string;
      metadata?: Record<string, unknown>;
    }>,
    Error
  >({
    queryKey: ["order", "timeline", orderId],
    queryFn: async () => {
      const response = await apiClient.get<{
        status_logs: Array<{
          id: string;
          type: string;
          title: string;
          description?: string;
          timestamp: string;
          user_id?: string;
          user_name?: string;
          metadata?: Record<string, unknown>;
        }>;
      }>(`/api/orders/${orderId}/timeline`);
      return response.status_logs;
    },
    enabled: !!orderId,
  });
};

// ==================== COMBINED HOOKS ====================

/**
 * Hook for order management with all common operations
 */
export const useOrderManagement = (orderId: string) => {
  const orderQuery = useOrder(orderId);
  const downloadsQuery = useOrderDownloads(orderId);
  const timelineQuery = useOrderTimeline(orderId);
  
  const updateStatusMutation = useUpdateOrderStatus(orderId);
  const fulfillMutation = useFulfillOrder(orderId);
  const markDeliveredMutation = useMarkOrderDelivered(orderId);
  const refundMutation = useRefundOrder(orderId);
  
  return {
    // Queries
    order: orderQuery.data,
    isLoading: orderQuery.isLoading,
    isError: orderQuery.isError,
    error: orderQuery.error,
    
    downloads: downloadsQuery.data,
    isDownloadsLoading: downloadsQuery.isLoading,
    
    timeline: timelineQuery.data,
    isTimelineLoading: timelineQuery.isLoading,
    
    // Mutations
    updateStatus: updateStatusMutation.mutate,
    fulfillOrder: fulfillMutation.mutate,
    markDelivered: markDeliveredMutation.mutate,
    refundOrder: refundMutation.mutate,
    
    // Mutation states
    isUpdatingStatus: updateStatusMutation.isPending,
    isFulfilling: fulfillMutation.isPending,
    isMarkingDelivered: markDeliveredMutation.isPending,
    isRefunding: refundMutation.isPending,
    
    // Refetch
    refetchOrder: orderQuery.refetch,
    refetchDownloads: downloadsQuery.refetch,
    refetchTimeline: timelineQuery.refetch,
  };
};

/**
 * Hook for shop order management (seller view)
 */
export const useShopOrderManagement = (shopId: string) => {
  const ordersQuery = useShopOrders(shopId);
  const statsQuery = useSalesStatistics("month", shopId);
  
  const bulkActionMutation = useBulkOrderAction();
  
  return {
    // Queries
    orders: ordersQuery.data,
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    
    stats: statsQuery.data,
    isStatsLoading: statsQuery.isLoading,
    
    // Mutations
    bulkAction: bulkActionMutation.mutate,
    isPerformingBulkAction: bulkActionMutation.isPending,
    
    // Refetch
    refetchOrders: ordersQuery.refetch,
    refetchStats: statsQuery.refetch,
  };
};

// Export all hooks
