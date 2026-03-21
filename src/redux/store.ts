// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import uploadReducer from './uploadSlice';
import shopReducer from './shopSlice';
import paymentReducer from './paymentSlice';
import emailReducer from './emailSlice';
import analyticsReducer from './analyticsSlice'; // ← YENİ! (yolu kontrol et)
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    upload: uploadReducer,
    shop: shopReducer,
    payment: paymentReducer,
    email: emailReducer,
    analytics: analyticsReducer, // ← YENİ!
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>(); // ← BUNU EKLE!