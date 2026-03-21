// redux/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';
import type { 
  UserResponse, 
  UserPublic, 
  UserStats 
} from '../types/user.types';
import axios from 'axios';

// ==================== STATE TYPES ====================
interface UserState {
  // Current user (detailed)
  currentUser: UserResponse | null;
  
  // Public users cache
  publicUsers: {
    [userId: string]: UserPublic | null;
  };
  
  // User stats
  stats: UserStats | null;
  
  // Loading states
  loading: {
    currentUser: boolean;
    publicUser: boolean;
    stats: boolean;
    updateProfile: boolean;
    becomeSeller: boolean;
  };
  
  // Errors
  errors: {
    currentUser: string | null;
    publicUser: string | null;
    stats: string | null;
    updateProfile: string | null;
    becomeSeller: string | null;
  };
}

// ==================== INITIAL STATE ====================
const initialState: UserState = {
  currentUser: null,
  publicUsers: {},
  stats: null,
  loading: {
    currentUser: false,
    publicUser: false,
    stats: false,
    updateProfile: false,
    becomeSeller: false,
  },
  errors: {
    currentUser: null,
    publicUser: null,
    stats: null,
    updateProfile: null,
    becomeSeller: null,
  },
};

// ==================== ASYNC THUNKS ====================

// ✅ Fetch current user (detailed)
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get<UserResponse>('/users/me');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch user'
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch user');
    }
  }
);

// ✅ Fetch public user profile
export const fetchPublicUser = createAsyncThunk(
  'user/fetchPublicUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await apiClient.get<UserPublic>(`/users/${userId}/public`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch public user'
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch public user');
    }
  }
);

// ✅ Fetch user stats
export const fetchUserStats = createAsyncThunk(
  'user/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.get<UserStats>('/users/me/stats');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to fetch user stats'
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch user stats');
    }
  }
);

// ✅ Update user profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: {
    full_name?: string;
    avatar_url?: string;
    phone?: string;
    bio?: string;
    website?: string;
    location?: string;
    language?: string;
    timezone?: string;
    currency?: string;
    email_notifications?: boolean;
    push_notifications?: boolean;
    marketing_emails?: boolean;
  }, { rejectWithValue }) => {
    try {
      return await apiClient.put<UserResponse>('/users/me', data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to update profile'
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update profile');
    }
  }
);

// ✅ Become seller
export const becomeSeller = createAsyncThunk(
  'user/becomeSeller',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{
        message: string; 
        user_id: string; 
        new_role: string;
        seller_since?: string;
      }>('/users/me/become-seller');
      
      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to become seller'
        );
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to become seller');
    }
  }
);

// ==================== SLICE ====================
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Manual updates
    setCurrentUser: (state, action: PayloadAction<UserResponse>) => {
      state.currentUser = action.payload;
    },
    updateUserField: (
      state, 
      action: PayloadAction<{ field: keyof UserResponse; value: unknown }>
    ) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          [action.payload.field]: action.payload.value,
        };
      }
    },
    clearUserErrors: (state) => {
      state.errors = {
        currentUser: null,
        publicUser: null,
        stats: null,
        updateProfile: null,
        becomeSeller: null,
      };
    },
    clearPublicUser: (state, action: PayloadAction<string>) => {
      delete state.publicUsers[action.payload];
    },
    clearAllPublicUsers: (state) => {
      state.publicUsers = {};
    },
    clearStats: (state) => {
      state.stats = null;
    },
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    // ==================== FETCH CURRENT USER ====================
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading.currentUser = true;
      state.errors.currentUser = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading.currentUser = false;
      state.currentUser = action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading.currentUser = false;
      state.errors.currentUser = action.payload as string;
    });

    // ==================== FETCH PUBLIC USER ====================
    builder.addCase(fetchPublicUser.pending, (state) => {
      state.loading.publicUser = true;
      state.errors.publicUser = null;
    });
    builder.addCase(fetchPublicUser.fulfilled, (state, action) => {
      state.loading.publicUser = false;
      state.publicUsers[action.meta.arg] = action.payload;
    });
    builder.addCase(fetchPublicUser.rejected, (state, action) => {
      state.loading.publicUser = false;
      state.errors.publicUser = action.payload as string;
      // Store null for failed fetches
      state.publicUsers[action.meta.arg] = null;
    });

    // ==================== FETCH USER STATS ====================
    builder.addCase(fetchUserStats.pending, (state) => {
      state.loading.stats = true;
      state.errors.stats = null;
    });
    builder.addCase(fetchUserStats.fulfilled, (state, action) => {
      state.loading.stats = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchUserStats.rejected, (state, action) => {
      state.loading.stats = false;
      state.errors.stats = action.payload as string;
    });

    // ==================== UPDATE PROFILE ====================
    builder.addCase(updateProfile.pending, (state) => {
      state.loading.updateProfile = true;
      state.errors.updateProfile = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading.updateProfile = false;
      state.currentUser = action.payload;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading.updateProfile = false;
      state.errors.updateProfile = action.payload as string;
    });

    // ==================== BECOME SELLER ====================
    builder.addCase(becomeSeller.pending, (state) => {
      state.loading.becomeSeller = true;
      state.errors.becomeSeller = null;
    });
    builder.addCase(becomeSeller.fulfilled, (state, action) => {
      state.loading.becomeSeller = false;
      // Update current user role
      if (state.currentUser) {
        state.currentUser.role = 'seller';
        state.currentUser.seller_since = action.payload.seller_since || new Date().toISOString();
        state.currentUser.is_seller = true;
      }
    });
    builder.addCase(becomeSeller.rejected, (state, action) => {
      state.loading.becomeSeller = false;
      state.errors.becomeSeller = action.payload as string;
    });
  },
});

export const {
  setCurrentUser,
  updateUserField,
  clearUserErrors,
  clearPublicUser,
  clearAllPublicUsers,
  clearStats,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;