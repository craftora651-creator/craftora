import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/apiClient";
import type {
  CartResponse,
  CartItemAdd,
  CartItemUpdate,
  CartItemResponse,
  CartCheckoutPreview,
  CartEstimateResponse,
  CartEstimateRequest,
  CartCheckoutParams
} from "../../types/cart.types";

// ==================== CART QUERIES ====================

/**
 * Get current user's cart
 */
export const useCart = (options?: {
  enabled?: boolean;
  staleTime?: number;
}) => {
  return useQuery<CartResponse, Error>({
    queryKey: ["cart", "current"],
    queryFn: async () => {
      return await apiClient.get<CartResponse>("/api/carts/my");
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 30 * 1000, // 30 saniye
    retry: 2,
  });
};

/**
 * Get checkout preview
 */
export const useCheckoutPreview = (
  shippingAddress?: Record<string, unknown>,
  couponCode?: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<CartCheckoutPreview, Error>({
    queryKey: ["cart", "checkout", "preview", { shippingAddress, couponCode }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (couponCode) params.append("coupon_code", couponCode);
      if (shippingAddress) {
        params.append("shipping_address", JSON.stringify(shippingAddress));
      }

      const url = `/api/carts/checkout/preview${params.toString() ? `?${params.toString()}` : ""}`;
      return await apiClient.get<CartCheckoutPreview>(url);
    },
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000, // 1 dakika
  });
};

// ==================== CART ITEM MUTATIONS ====================

/**
 * Add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, CartItemAdd>({
    mutationFn: async (itemData: CartItemAdd) => {
      return await apiClient.post<CartResponse>("/api/carts/items", itemData);
    },
    onSuccess: (updatedCart) => {
      // Update cart cache
      queryClient.setQueryData(["cart", "current"], updatedCart);
      
      // Invalidate checkout preview
      queryClient.invalidateQueries({ queryKey: ["cart", "checkout", "preview"] });
      
      // Optimistic update for product listings
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      console.log(`Added to cart: ${updatedCart.item_count} items`);
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
    },
  });
};

/**
 * Update cart item quantity
 */
export const useUpdateCartItem = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, CartItemUpdate>({
    mutationFn: async (itemUpdate: CartItemUpdate) => {
      return await apiClient.put<CartResponse>(`/api/carts/items/${productId}`, itemUpdate);
    },
    onSuccess: (updatedCart) => {
      // Update cart cache
      queryClient.setQueryData(["cart", "current"], updatedCart);
      
      // Invalidate checkout preview
      queryClient.invalidateQueries({ queryKey: ["cart", "checkout", "preview"] });
      
      console.log(`Cart item updated: ${productId}`);
    },
    onError: (error) => {
      console.error("Error updating cart item:", error);
    },
  });
};

/**
 * Remove item from cart
 */
export const useRemoveFromCart = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error>({
    mutationFn: async () => {
      return await apiClient.delete<CartResponse>(`/api/carts/items/${productId}`);
    },
    onSuccess: (updatedCart) => {
      // Update cart cache
      queryClient.setQueryData(["cart", "current"], updatedCart);
      
      // Invalidate checkout preview
      queryClient.invalidateQueries({ queryKey: ["cart", "checkout", "preview"] });
      
      // Remove item from product cache
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      
      console.log(`Removed from cart: ${productId}`);
    },
    onError: (error) => {
      console.error("Error removing from cart:", error);
    },
  });
};

/**
 * Clear entire cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error>({
    mutationFn: async () => {
      return await apiClient.delete<CartResponse>("/api/carts");
    },
    onSuccess: (clearedCart) => {
      // Update cart cache
      queryClient.setQueryData(["cart", "current"], clearedCart);
      
      // Invalidate checkout preview
      queryClient.invalidateQueries({ queryKey: ["cart", "checkout", "preview"] });
      
      // Invalidate all product caches
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      console.log("Cart cleared");
    },
    onError: (error) => {
      console.error("Error clearing cart:", error);
    },
  });
};

// ==================== CART UTILITY MUTATIONS ====================

/**
 * Merge guest cart with user cart
 */
export const useMergeCarts = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; merged_items: number; totals: Record<string, number> },
    Error,
    { guestCart: Record<string, unknown>[] }
  >({
    mutationFn: async ({ guestCart }) => {
      return await apiClient.post<{
        message: string;
        merged_items: number;
        totals: Record<string, number>;
      }>("/api/carts/merge", { guest_cart: guestCart });
    },
    onSuccess: (data) => {
      // Invalidate cart cache to reload merged cart
      queryClient.invalidateQueries({ queryKey: ["cart", "current"] });
      
      console.log(`Carts merged: ${data.merged_items} items`);
    },
    onError: (error) => {
      console.error("Error merging carts:", error);
    },
  });
};

/**
 * Apply coupon to cart
 */
export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, { couponCode: string }>({
    mutationFn: async ({ couponCode }) => {
      return await apiClient.post<CartResponse>("/api/carts/coupon", { coupon_code: couponCode });
    },
    onSuccess: (updatedCart) => {
      // Update cart cache
      queryClient.setQueryData(["cart", "current"], updatedCart);
      
      // Invalidate checkout preview
      queryClient.invalidateQueries({ queryKey: ["cart", "checkout", "preview"] });
      
      console.log(`Coupon applied: ${updatedCart.coupon_code}`);
    },
    onError: (error) => {
      console.error("Error applying coupon:", error);
    },
  });
};

/**
 * Remove coupon from cart
 */
export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error>({
    mutationFn: async () => {
      return await apiClient.delete<CartResponse>("/api/carts/coupon");
    },
    onSuccess: (updatedCart) => {
      // Update cart cache
      queryClient.setQueryData(["cart", "current"], updatedCart);
      
      // Invalidate checkout preview
      queryClient.invalidateQueries({ queryKey: ["cart", "checkout", "preview"] });
      
      console.log("Coupon removed");
    },
    onError: (error) => {
      console.error("Error removing coupon:", error);
    },
  });
};

// ==================== CART ESTIMATION ====================

/**
 * Estimate cart totals
 */
export const useEstimateCart = () => {
  return useMutation<CartEstimateResponse, Error, CartEstimateRequest>({
    mutationFn: async (estimateRequest: CartEstimateRequest) => {
      return await apiClient.post<CartEstimateResponse>("/api/carts/estimate", estimateRequest);
    },
    onError: (error) => {
      console.error("Error estimating cart:", error);
    },
  });
};

// ==================== CHECKOUT MUTATIONS ====================

/**
 * Start checkout process
 */
export const useStartCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { checkout_url: string; payment_intent_id?: string; requires_action?: boolean },
    Error,
    CartCheckoutParams
  >({
    mutationFn: async (checkoutParams: CartCheckoutParams) => {
      return await apiClient.post<{
        checkout_url: string;
        payment_intent_id?: string;
        requires_action?: boolean;
      }>("/api/carts/checkout/start", checkoutParams);
    },
    onSuccess: (data) => {
      // Invalidate cart cache (cart will be converted)
      queryClient.invalidateQueries({ queryKey: ["cart", "current"] });
      
      // Invalidate order queries
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      
      console.log("Checkout started, redirecting to:", data.checkout_url);
      
      // Handle redirect if needed
      if (data.checkout_url && typeof window !== "undefined") {
        window.location.href = data.checkout_url;
      }
    },
    onError: (error) => {
      console.error("Error starting checkout:", error);
    },
  });
};

// ==================== CART RECOVERY ====================

/**
 * Recover abandoned cart
 */
export const useRecoverCart = () => {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, Error, { recoveryToken: string; email?: string }>({
    mutationFn: async ({ recoveryToken, email }) => {
      return await apiClient.post<CartResponse>("/api/carts/recover", {
        recovery_token: recoveryToken,
        email,
      });
    },
    onSuccess: (recoveredCart) => {
      // Update cart cache
      queryClient.setQueryData(["cart", "current"], recoveredCart);
      
      console.log("Cart recovered:", recoveredCart.cart_token);
    },
    onError: (error) => {
      console.error("Error recovering cart:", error);
    },
  });
};

// ==================== COMPOSED CART HOOK ====================

/**
 * Comprehensive cart management hook
 */
export const useCartManagement = () => {
  const cartQuery = useCart();
  
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = (productId: string) => useUpdateCartItem(productId);
  const removeFromCartMutation = (productId: string) => useRemoveFromCart(productId);
  const clearCartMutation = useClearCart();
  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();
  const startCheckoutMutation = useStartCheckout();

  return {
    // Cart data
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,
    
    // Cart statistics
    itemCount: cartQuery.data?.item_count || 0,
    cartTotal: cartQuery.data?.total || 0,
    hasItems: (cartQuery.data?.item_count || 0) > 0,
    hasDigitalItems: cartQuery.data?.has_digital_items || false,
    hasPhysicalItems: cartQuery.data?.has_physical_items || false,
    shopCount: cartQuery.data?.shop_count || 0,
    
    // Cart actions
    addToCart: addToCartMutation.mutate,
    updateCartItem: updateCartItemMutation,
    removeFromCart: removeFromCartMutation,
    clearCart: clearCartMutation.mutate,
    applyCoupon: applyCouponMutation.mutate,
    removeCoupon: removeCouponMutation.mutate,
    startCheckout: startCheckoutMutation.mutate,
    
    // Mutation states
    isAdding: addToCartMutation.isPending,
    isUpdatingItem: false, // Would need tracking per item
    isRemoving: false, // Would need tracking per item
    isClearing: clearCartMutation.isPending,
    isApplyingCoupon: applyCouponMutation.isPending,
    isRemovingCoupon: removeCouponMutation.isPending,
    isCheckingOut: startCheckoutMutation.isPending,
    
    // Refetch
    refetchCart: cartQuery.refetch,
  };
};

/**
 * Hook for specific cart item operations
 */
export const useCartItem = (productId: string) => {
  const cartQuery = useCart();
  
  const updateMutation = useUpdateCartItem(productId);
  const removeMutation = useRemoveFromCart(productId);

  // Find item in cart
  const cartItem = cartQuery.data?.items?.find(
    (item) => item.product_id === productId
  );

  return {
    // Item data
    item: cartItem,
    isInCart: !!cartItem,
    quantity: cartItem?.quantity || 0,
    lineTotal: cartItem?.line_total || 0,
    
    // Item actions
    updateQuantity: (quantity: number) => {
      if (quantity < 1) {
        removeMutation.mutate();
      } else {
        updateMutation.mutate({ quantity });
      }
    },
    removeFromCart: () => removeMutation.mutate(),
    
    // Mutation states
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};

// ==================== LOCAL STORAGE HELPERS ====================

/**
 * Get guest cart from localStorage
 */
export const getGuestCart = (): Record<string, unknown>[] => {
  if (typeof window === "undefined") return [];
  
  const guestCart = localStorage.getItem("guest_cart");
  return guestCart ? JSON.parse(guestCart) : [];
};

/**
 * Save guest cart to localStorage
 */
export const saveGuestCart = (cartItems: Record<string, unknown>[]): void => {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("guest_cart", JSON.stringify(cartItems));
};

/**
 * Clear guest cart from localStorage
 */
export const clearGuestCart = (): void => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("guest_cart");
};

/**
 * Hook for guest cart management
 */
export const useGuestCart = () => {
  const queryClient = useQueryClient();

  const getCart = () => {
    return getGuestCart();
  };

  const addToCart = (itemData: Record<string, unknown>) => {
    const currentCart = getGuestCart();
    
    // Check if item already exists
    const existingIndex = currentCart.findIndex(
      (item) => item.product_id === itemData.product_id
    );
    
    let newCart;
    if (existingIndex >= 0) {
      // Update quantity
      newCart = [...currentCart];
      const newQuantity = (newCart[existingIndex].quantity as number) + (itemData.quantity as number);
      newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQuantity };
    } else {
      // Add new item
      newCart = [...currentCart, { ...itemData, added_at: new Date().toISOString() }];
    }
    
    saveGuestCart(newCart);
    queryClient.invalidateQueries({ queryKey: ["guestCart"] });
    
    return newCart;
  };

  const removeFromCart = (productId: string) => {
    const currentCart = getGuestCart();
    const newCart = currentCart.filter((item) => item.product_id !== productId);
    
    saveGuestCart(newCart);
    queryClient.invalidateQueries({ queryKey: ["guestCart"] });
    
    return newCart;
  };

  const clearCart = () => {
    clearGuestCart();
    queryClient.invalidateQueries({ queryKey: ["guestCart"] });
    
    return [];
  };

  return {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    itemCount: getGuestCart().length,
  };
};