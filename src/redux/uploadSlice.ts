// store/slices/uploadSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';
import type {
  UploadedFile,
  UploadConfig,
  UploadHealth,
  UploadStats,
  FilePurpose,
  FileStatus,
  UploadResponse,
  UserFilesResponse,
  AllFilesResponse,
  DeleteFileResponse,
  QuickUploadResponse,
  BatchUploadResponse
} from '../types/upload.types';

// ==================== STATE TYPES ====================

interface UploadState {
  files: UploadedFile[];
  userFiles: Record<string, UploadedFile[]>; // user_id -> files
  config: UploadConfig | null;
  health: UploadHealth | null;
  stats: UploadStats | null;
  loading: boolean;
  uploading: boolean;
  error: string | null;
  selectedFiles: File[];
  uploadProgress: Record<string, number>; // file name -> progress %
  currentUploads: Array<{
    id: string;
    filename: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
  }>;
  filter: {
    purpose?: FilePurpose;
    status?: FileStatus;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

// ==================== INITIAL STATE ====================

const initialState: UploadState = {
  files: [],
  userFiles: {},
  config: null,
  health: null,
  stats: null,
  loading: false,
  uploading: false,
  error: null,
  selectedFiles: [],
  uploadProgress: {},
  currentUploads: [],
  filter: {},
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 20,
};

// ==================== ASYNC THUNKS ====================

export const fetchUploadConfig = createAsyncThunk<
  UploadConfig,
  void,
  { rejectValue: string }
>('upload/fetchConfig', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.goGet<{ config: UploadConfig }>('/upload/config');
    return response.config;
  } catch (error: unknown) {  // 👈 any yerine unknown
    // unknown tipini kontrol et
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Upload config yüklenemedi');
  }
});

export const fetchUploadHealth = createAsyncThunk<
  UploadHealth,
  void,
  { rejectValue: string }
>('upload/fetchHealth', async (_, { rejectWithValue }) => {
  try {
    return await apiClient.goGet<UploadHealth>('/upload/health');
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Health check yapılamadı');
  }
});

export const fetchUploadStats = createAsyncThunk<
  UploadStats,
  void,
  { rejectValue: string }
>('upload/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const allFiles = await apiClient.goGet<AllFilesResponse>('/upload/all', { 
      params: { limit: 1000 } 
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const stats = allFiles.files.reduce((acc, file) => {
      acc.total_files++;
      acc.total_size += file.file_size;
      const uploadDate = new Date(file.uploaded_at);
      if (uploadDate >= today) {
        acc.today_count++;
        acc.today_size += file.file_size;
      }
      acc.by_purpose[file.purpose] = (acc.by_purpose[file.purpose] || 0) + 1;
      const mimeType = file.mime_type.split('/')[0];
      acc.by_mime_type[mimeType] = (acc.by_mime_type[mimeType] || 0) + 1;
      if (file.file_size > (acc.largest_file?.size || 0)) {
        acc.largest_file = {
          id: file.id,
          filename: file.filename,
          size: file.file_size,
          uploaded_at: file.uploaded_at,
        };
      }
      if (acc.recent_uploads.length < 5) {
        acc.recent_uploads.push(file);
      }
      return acc;
    }, {
      total_files: 0,
      total_size: 0,
      today_count: 0,
      today_size: 0,
      by_purpose: {} as Record<FilePurpose, number>,
      by_mime_type: {} as Record<string, number>,
      largest_file: {
        id: '',
        filename: '',
        size: 0,
        uploaded_at: '',
      },
      recent_uploads: [] as UploadedFile[],
    });
    
    return stats;
  } catch (error: unknown) {
    if(error instanceof Error){
      return rejectWithValue(error.message);
    }
    return rejectWithValue('İstatistikler yüklenemedi');
  }
});

export const fetchAllFiles = createAsyncThunk<
  UploadedFile[],
  { limit?: number; refresh?: boolean },
  { rejectValue: string }
>('upload/fetchAllFiles', async ({ limit = 100, refresh }, { rejectWithValue }) => {
  try {
    const params: Record<string, unknown> = { limit };
    if (refresh) {
      params._t = Date.now(); // Cache kırmak için timestamp ekle
    }
    const response = await apiClient.goGet<AllFilesResponse>('/upload/all', {
      params,
    });
    return response.files || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Dosyalar yüklenemedi');
  }
});


export const fetchUserFiles = createAsyncThunk<
  UploadedFile[],
  { userId: string; limit?: number },
  { rejectValue: string }
>('upload/fetchUserFiles', async ({ userId, limit = 50 }, { rejectWithValue }) => {
  try {
    const response = await apiClient.goGet<UserFilesResponse>(`/upload/user/${userId}`, {
      params: { limit },
    });
    return response.files || [];
  } catch (error: unknown) {
    if(error instanceof Error){
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Kullanici dosyalari yüklenemedi');
  }
});


export const uploadFile = createAsyncThunk<
  UploadResponse,
  { file: File; userId: string; purpose?: FilePurpose; metadata?: Record<string, unknown> },
  { rejectValue: string }
>('upload/uploadFile', async ({ file, userId, purpose, metadata }, { rejectWithValue, dispatch }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    if (purpose) {
      formData.append('purpose', purpose);
    }
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    dispatch(uploadSlice.actions.updateUploadProgress({
      filename: file.name,
      progress: 0,
      status: 'uploading',
    }));
    const response = await apiClient.goPost<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        
        dispatch(uploadSlice.actions.updateUploadProgress({
          filename: file.name,
          progress,
          status: 'uploading',
        }));
      },
    });
    dispatch(uploadSlice.actions.updateUploadProgress({
      filename: file.name,
      progress: 100,
      status: 'success',
    }));
    return response;
  } catch (error: unknown) {
    if(error instanceof Error){
      return rejectWithValue(error.message)
    }
    dispatch(uploadSlice.actions.updateUploadProgress({
      filename: file.name,
      progress: 0,
      status: 'error',
    }));
    return rejectWithValue('Dosya yüklenemedi');
  }
});

/**
 * Hızlı upload
 */
export const quickUpload = createAsyncThunk<
  QuickUploadResponse,
  File,
  { rejectValue: string }
>('upload/quickUpload', async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.goPost<QuickUploadResponse>('/upload/quick', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
  } catch (error: unknown) {
    if(error instanceof Error){
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Hizli upload başarisiz');
  }
});

export const batchUpload = createAsyncThunk<
  BatchUploadResponse,
  { files: File[]; userId: string; purpose?: FilePurpose },
  { rejectValue: string }
>('upload/batchUpload', async ({ files, userId, purpose }, { rejectWithValue, dispatch }) => {
  
  // Helper: error'dan message çıkarma
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Bilinmeyen hata';
  };

  try {
    const results = [];
    for (const file of files) {
      dispatch(uploadSlice.actions.updateUploadProgress({
        filename: file.name,
        progress: 0,
        status: 'uploading',
      }));
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', userId);
        if (purpose) {
          formData.append('purpose', purpose);
        }
        const response = await apiClient.goPost<UploadResponse>('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        results.push({
          file,
          success: true,
          result: response.file,
        });
        dispatch(uploadSlice.actions.updateUploadProgress({
          filename: file.name,
          progress: 100,
          status: 'success',
        }));
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        results.push({
          file,
          success: false,
          error: errorMessage,
        });
        dispatch(uploadSlice.actions.updateUploadProgress({
          filename: file.name,
          progress: 0,
          status: 'error',
        }));
      }
    }
    const successful = results.filter(r => r.success).length;
    return {
      success: successful === files.length,
      message: `Batch upload completed: ${successful}/${results.length} successful`,
      results,
      total: results.length,
      successful,
      failed: results.length - successful,
    };
    
  } catch (error: unknown) {  // 👈 any -> unknown
    const errorMessage = getErrorMessage(error);
    return rejectWithValue(errorMessage || 'Batch upload başarısız');
  }
});


const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Bilinmeyen hata';
};
export const deleteFile = createAsyncThunk<
  DeleteFileResponse,
  { key: string; userId: string },
  { rejectValue: string }
>('upload/deleteFile', async ({ key, userId }, { rejectWithValue }) => {
  try {
    const response = await apiClient.delete<DeleteFileResponse>(`/upload/${key}`, {
      params: { user_id: userId },
    });
    return response;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error) || 'Dosya silinemedi');
  }
});

// ==================== SLICE ====================
const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    // File selection
    addSelectedFiles: (state, action: PayloadAction<File[]>) => {
      state.selectedFiles = [...state.selectedFiles, ...action.payload];
    },
    
    removeSelectedFile: (state, action: PayloadAction<number>) => {
      state.selectedFiles = state.selectedFiles.filter((_, index) => index !== action.payload);
    },
    
    clearSelectedFiles: (state) => {
      state.selectedFiles = [];
    },
    
    // Upload progress
    updateUploadProgress: (state, action: PayloadAction<{
      filename: string;
      progress: number;
      status: 'pending' | 'uploading' | 'success' | 'error';
    }>) => {
      const { filename, progress, status } = action.payload;
      
      state.uploadProgress[filename] = progress;
      
      const existingUpload = state.currentUploads.find(u => u.filename === filename);
      if (existingUpload) {
        existingUpload.progress = progress;
        existingUpload.status = status;
      } else {
        state.currentUploads.push({
          id: `upload-${Date.now()}`,
          filename,
          progress,
          status,
        });
      }
      
      // Remove completed uploads after 3 seconds
      if (status === 'success' || status === 'error') {
        setTimeout(() => {
          state.currentUploads = state.currentUploads.filter(u => u.filename !== filename);
          delete state.uploadProgress[filename];
        }, 3000);
      }
    },
    
    clearUploadProgress: (state) => {
      state.currentUploads = [];
      state.uploadProgress = {};
    },
    
    // Filters
    setFilter: (state, action: PayloadAction<Partial<UploadState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
      state.currentPage = 1;
    },
    
    clearFilter: (state) => {
      state.filter = {};
      state.currentPage = 1;
    },
    
    // Pagination
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    },
    
    // Optimistic updates
    addFileOptimistically: (state, action: PayloadAction<{
      userId: string;
      file: Omit<UploadedFile, 'id' | 'uploaded_at'>;
    }>) => {
      const optimisticFile: UploadedFile = {
        ...action.payload.file,
        id: `temp-${Date.now()}`,
        uploaded_at: new Date().toISOString(),
        status: 'uploading',
      };
      
      // Add to user files
      if (!state.userFiles[action.payload.userId]) {
        state.userFiles[action.payload.userId] = [];
      }
      state.userFiles[action.payload.userId].unshift(optimisticFile);
      
      // Add to all files
      state.files.unshift(optimisticFile);
    },
    
    updateFileStatus: (state, action: PayloadAction<{
      tempId: string;
      status: FileStatus;
      error?: string;
    }>) => {
      const { tempId, status, error } = action.payload;
      
      // Update in user files
      Object.keys(state.userFiles).forEach(userId => {
        state.userFiles[userId] = state.userFiles[userId].map(file => 
          file.id === tempId 
            ? { ...file, status, error }
            : file
        );
      });
      
      // Update in all files
      state.files = state.files.map(file => 
        file.id === tempId 
          ? { ...file, status, error }
          : file
      );
    },
    
    removeTempFile: (state, action: PayloadAction<string>) => {
      const tempId = action.payload;
      
      // Remove from user files
      Object.keys(state.userFiles).forEach(userId => {
        state.userFiles[userId] = state.userFiles[userId].filter(file => file.id !== tempId);
      });
      
      // Remove from all files
      state.files = state.files.filter(file => file.id !== tempId);
    },
  },
  
  extraReducers: (builder) => {
    // ===== fetchUploadConfig =====
    builder.addCase(fetchUploadConfig.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(fetchUploadConfig.fulfilled, (state, action) => {
      state.loading = false;
      state.config = action.payload;
    });
    
    builder.addCase(fetchUploadConfig.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Config yüklenemedi';
    });
    
    // ===== fetchUploadHealth =====
    builder.addCase(fetchUploadHealth.fulfilled, (state, action) => {
      state.health = action.payload;
    });
    
    // ===== fetchUploadStats =====
    builder.addCase(fetchUploadStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
    
    // ===== fetchAllFiles =====
    builder.addCase(fetchAllFiles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(fetchAllFiles.fulfilled, (state, action) => {
      state.loading = false;
      state.files = action.payload;
    });
    
    builder.addCase(fetchAllFiles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Dosyalar yüklenemedi';
    });
    
    // ===== fetchUserFiles =====
    builder.addCase(fetchUserFiles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(fetchUserFiles.fulfilled, (state, action) => {
      state.loading = false;
      const userId = action.meta.arg.userId;
      state.userFiles[userId] = action.payload;
    });
    
    builder.addCase(fetchUserFiles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Kullanıcı dosyaları yüklenemedi';
    });
    
    // ===== uploadFile =====
    builder.addCase(uploadFile.pending, (state) => {
      state.uploading = true;
      state.error = null;
    });
    
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      state.uploading = false;
      
      const { userId, file } = action.meta.arg;
      const uploadedFile = action.payload.file;
      
      // Update user files
      if (state.userFiles[userId]) {
        // Replace temp file with real one or add new
        const tempIndex = state.userFiles[userId].findIndex(f => 
          f.filename === file.name && f.status === 'uploading'
        );
        
        if (tempIndex !== -1) {
          state.userFiles[userId][tempIndex] = uploadedFile;
        } else {
          state.userFiles[userId].unshift(uploadedFile);
        }
      }
      
      // Update all files
      const allTempIndex = state.files.findIndex(f => 
        f.filename === file.name && f.status === 'uploading'
      );
      
      if (allTempIndex !== -1) {
        state.files[allTempIndex] = uploadedFile;
      } else {
        state.files.unshift(uploadedFile);
      }
      
      // Remove from selected files
      state.selectedFiles = state.selectedFiles.filter(f => f.name !== file.name);
    });
    
    builder.addCase(uploadFile.rejected, (state, action) => {
      state.uploading = false;
      state.error = action.payload || 'Upload başarısız';
      
      // Mark temp file as failed
      const { file } = action.meta.arg;
      Object.keys(state.userFiles).forEach(userId => {
        state.userFiles[userId] = state.userFiles[userId].map(f => 
          f.filename === file.name && f.status === 'uploading'
            ? { ...f, status: 'failed', error: action.payload }
            : f
        );
      });
      
      state.files = state.files.map(f => 
        f.filename === file.name && f.status === 'uploading'
          ? { ...f, status: 'failed', error: action.payload }
          : f
      );
    });
    
    // ===== batchUpload =====
    builder.addCase(batchUpload.pending, (state) => {
      state.uploading = true;
      state.error = null;
    });
    
    builder.addCase(batchUpload.fulfilled, (state, action) => {
      state.uploading = false;
      
      // Remove successful files from selected
      const successfulFiles = action.payload.results
        .filter(r => r.success)
        .map(r => r.file.name);
      
      state.selectedFiles = state.selectedFiles.filter(
        file => !successfulFiles.includes(file.name)
      );
    });
    
    builder.addCase(batchUpload.rejected, (state, action) => {
      state.uploading = false;
      state.error = action.payload || 'Batch upload başarısız';
    });
    
    // ===== deleteFile =====
    builder.addCase(deleteFile.fulfilled, (state, action) => {
      const { key, userId } = action.meta.arg;
      
      // Remove from user files
      if (state.userFiles[userId]) {
        state.userFiles[userId] = state.userFiles[userId].filter(
          file => file.s3_key !== key
        );
      }
      
      // Remove from all files
      state.files = state.files.filter(file => file.s3_key !== key);
    });
    
    builder.addCase(deleteFile.rejected, (state, action) => {
      state.error = action.payload || 'Dosya silinemedi';
    });
    
    // ===== quickUpload =====
    builder.addCase(quickUpload.fulfilled, (state, action) => {
      const uploadedFile = action.payload.file;
      
      // Add to all files
      state.files.unshift(uploadedFile);
    });
  },
});

// ==================== EXPORTS ====================
export const {
  // File selection
  addSelectedFiles,
  removeSelectedFile,
  clearSelectedFiles,
  
  // Upload progress
  updateUploadProgress,
  clearUploadProgress,
  
  // Filters
  setFilter,
  clearFilter,
  
  // Pagination
  setPage,
  setItemsPerPage,
  
  // Error handling
  clearError,
  
  // Optimistic updates
  addFileOptimistically,
  updateFileStatus,
  removeTempFile,
} = uploadSlice.actions;

export default uploadSlice.reducer;

// ==================== SELECTORS ====================
export const selectUpload = (state: { upload: UploadState }) => state.upload;
export const selectUploadConfig = (state: { upload: UploadState }) => state.upload.config;
export const selectUploadHealth = (state: { upload: UploadState }) => state.upload.health;
export const selectUploadStats = (state: { upload: UploadState }) => state.upload.stats;
export const selectAllFiles = (state: { upload: UploadState }) => state.upload.files;
export const selectUserFiles = (userId: string) => (state: { upload: UploadState }) => 
  state.upload.userFiles[userId] || [];
export const selectSelectedFiles = (state: { upload: UploadState }) => state.upload.selectedFiles;
export const selectCurrentUploads = (state: { upload: UploadState }) => state.upload.currentUploads;
export const selectUploadProgress = (state: { upload: UploadState }) => state.upload.uploadProgress;
export const selectUploadLoading = (state: { upload: UploadState }) => state.upload.loading;
export const selectUploading = (state: { upload: UploadState }) => state.upload.uploading;
export const selectUploadError = (state: { upload: UploadState }) => state.upload.error;
export const selectUploadFilter = (state: { upload: UploadState }) => state.upload.filter;

/**
 * Filtrelenmiş dosyalar
 */
export const selectFilteredFiles = (state: { upload: UploadState }) => {
  const { files, filter } = state.upload;
  
  return files.filter(file => {
    if (filter.purpose && file.purpose !== filter.purpose) return false;
    if (filter.status && file.status !== filter.status) return false;
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        file.filename.toLowerCase().includes(searchLower) ||
        file.s3_key.toLowerCase().includes(searchLower)
      );
    }
    
    if (filter.dateFrom) {
      const uploadDate = new Date(file.uploaded_at);
      const fromDate = new Date(filter.dateFrom);
      if (uploadDate < fromDate) return false;
    }
    
    if (filter.dateTo) {
      const uploadDate = new Date(file.uploaded_at);
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (uploadDate > toDate) return false;
    }
    
    return true;
  });
};

/**
 * Paginated dosyalar
 */
export const selectPaginatedFiles = (state: { upload: UploadState }) => {
  const filteredFiles = selectFilteredFiles(state);
  const { currentPage, itemsPerPage } = state.upload;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    files: filteredFiles.slice(startIndex, endIndex),
    total: filteredFiles.length,
    page: currentPage,
    totalPages: Math.ceil(filteredFiles.length / itemsPerPage),
    hasNext: endIndex < filteredFiles.length,
    hasPrev: currentPage > 1,
  };
};

/**
 * Dosya istatistikleri (client-side)
 */
export const selectClientStats = (state: { upload: UploadState }) => {
  const files = state.upload.files;
  
  const stats = files.reduce((acc, file) => {
    acc.totalFiles++;
    acc.totalSize += file.file_size;
    
    const uploadDate = new Date(file.uploaded_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (uploadDate >= today) {
      acc.todayCount++;
      acc.todaySize += file.file_size;
    }
    
    // By purpose
    acc.byPurpose[file.purpose] = (acc.byPurpose[file.purpose] || 0) + 1;
    
    // By status
    acc.byStatus[file.status] = (acc.byStatus[file.status] || 0) + 1;
    
    return acc;
  }, {
    totalFiles: 0,
    totalSize: 0,
    todayCount: 0,
    todaySize: 0,
    byPurpose: {} as Record<FilePurpose, number>,
    byStatus: {} as Record<FileStatus, number>,
  });
  
  return stats;
};