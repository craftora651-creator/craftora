// hooks/upload.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from "../../api/apiClient";
import { FilePurpose } from '../../types/upload.types';
import type {
  UploadedFile,
  UploadConfig,
  UploadResponse,
  UserFilesResponse,
  AllFilesResponse,
  UploadHealth,
  QuickUploadResponse,
  DeleteFileResponse,
  UploadStats,
  BatchUploadResponse,
} from '../../types/upload.types';

// ==================== QUERY KEYS ====================
export const uploadKeys = {
  all: ['upload'] as const,
  config: () => [...uploadKeys.all, 'config'] as const,
  health: () => [...uploadKeys.all, 'health'] as const,
  stats: () => [...uploadKeys.all, 'stats'] as const,
  
  // User files
  userFiles: (userId: string) => [...uploadKeys.all, 'user', userId] as const,
  userFilesByPurpose: (userId: string, purpose?: FilePurpose) => 
    [...uploadKeys.userFiles(userId), { purpose }] as const,
  
  // All files (admin)
  allFiles: () => [...uploadKeys.all, 'all'] as const,
  
  // Single file
  file: (fileId: string) => [...uploadKeys.all, 'file', fileId] as const,
  fileByKey: (key: string) => [...uploadKeys.all, 'file-by-key', key] as const,
};

// ==================== API FONKSİYONLARI ====================

/**
 * Upload config getir
 */
const getUploadConfigAPI = async (): Promise<UploadConfig> => {
  const response = await apiClient.goGet<{ config: UploadConfig }>('/upload/config');
  return response.config;
};

/**
 * Upload health check
 */
const getUploadHealthAPI = async (): Promise<UploadHealth> => {
  const response = await apiClient.goGet<UploadHealth>('/upload/health');
  return response;
};

/**
 * Upload istatistikleri
 */
const getUploadStatsAPI = async (): Promise<UploadStats> => {
  // Backend'de stats endpoint'i yoksa, all files'dan hesapla
  const allFiles = await apiClient.goGet<AllFilesResponse>('/upload/all', { params: { limit: 1000 } });
  
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
    
    // By purpose
    acc.by_purpose[file.purpose] = (acc.by_purpose[file.purpose] || 0) + 1;
    
    // By mime type
    const mimeType = file.mime_type.split('/')[0];
    acc.by_mime_type[mimeType] = (acc.by_mime_type[mimeType] || 0) + 1;
    
    // Largest file
    if (file.file_size > (acc.largest_file?.size || 0)) {
      acc.largest_file = {
        id: file.id,
        filename: file.filename,
        size: file.file_size,
        uploaded_at: file.uploaded_at,
      };
    }
    
    // Recent uploads (last 5)
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
};

/**
 * Dosya yükle
 */
const uploadFileAPI = async (formData: FormData): Promise<UploadResponse> => {
  const response = await apiClient.goPost<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

/**
 * Hızlı upload
 */
const quickUploadAPI = async (file: File): Promise<QuickUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.goPost<QuickUploadResponse>('/upload/quick', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

/**
 * Kullanıcı dosyalarını getir
 */
const getUserFilesAPI = async (userId: string, limit = 50): Promise<UploadedFile[]> => {
  const response = await apiClient.goGet<UserFilesResponse>(`/upload/user/${userId}`, {
    params: { limit },
  });
  return response.files || [];
};

/**
 * Tüm dosyaları getir (admin)
 */
const getAllFilesAPI = async (limit = 100): Promise<UploadedFile[]> => {
  const response = await apiClient.goGet<AllFilesResponse>('/upload/all', {
    params: { limit },
  });
  return response.files || [];
};

const deleteFileAPI = async (key: string, userId: string): Promise<DeleteFileResponse> => {
  const response = await apiClient.delete<DeleteFileResponse>(`/upload/${key}`, {
    params: { user_id: userId },
  });
  return response;
};

export const batchUploadAPI = async (files: File[], purpose?: FilePurpose): Promise<BatchUploadResponse> => {
  const formData = new FormData();
  
  // Her dosyayı ekle
  files.forEach((file) => {
    formData.append(`files`, file);
  });
  
  if (purpose) {
    formData.append('purpose', purpose);
  }
  
  // Özel batch endpoint'i yoksa, tek tek yükle
  const results = [];
  for (const file of files) {
    try {
      const singleFormData = new FormData();
      singleFormData.append('file', file);
      if (purpose) {
        singleFormData.append('purpose', purpose);
      }
      singleFormData.append('user_id', 'batch-upload');
      
      const result = await uploadFileAPI(singleFormData);
      results.push({
        file,
        success: true,
        result: result.file,
      });
    } catch (error) {
      results.push({
        file,
        success: false,
        error: (error as Error).message,
      });
    }
  }
  
  return {
    success: results.every(r => r.success),
    message: `Batch upload completed: ${results.filter(r => r.success).length}/${results.length} successful`,
    results,
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
  };
};

// ==================== REACT QUERY HOOKS ====================

/**
 * Upload config getir
 */
export const useUploadConfig = () => {
  return useQuery<UploadConfig, Error>({
    queryKey: uploadKeys.config(),
    queryFn: getUploadConfigAPI,
    staleTime: 1000 * 60 * 10, // 10 dakika
  });
};

/**
 * Upload health check
 */
export const useUploadHealth = () => {
  return useQuery<UploadHealth, Error>({
    queryKey: uploadKeys.health(),
    queryFn: getUploadHealthAPI,
    refetchInterval: 1000 * 60 * 5, // 5 dakikada bir kontrol et
  });
};

/**
 * Upload istatistikleri
 */
export const useUploadStats = () => {
  return useQuery<UploadStats, Error>({
    queryKey: uploadKeys.stats(),
    queryFn: getUploadStatsAPI,
    staleTime: 1000 * 60 * 2, // 2 dakika
  });
};

/**
 * Kullanıcı dosyalarını getir
 */
export const useUserFiles = (userId: string, limit = 50) => {
  return useQuery<UploadedFile[], Error>({
    queryKey: uploadKeys.userFiles(userId),
    queryFn: () => getUserFilesAPI(userId, limit),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 dakika
  });
};

/**
 * Tüm dosyaları getir (admin)
 */
export const useAllFiles = (limit = 100) => {
  return useQuery<UploadedFile[], Error>({
    queryKey: [...uploadKeys.allFiles(), { limit }],
    queryFn: () => getAllFilesAPI(limit),
    staleTime: 1000 * 60 * 2, // 2 dakika
  });
};

/**
 * Dosya yükleme mutation'ı
 */
// Önce bir tip tanımla (upload.types.ts dosyana ekle)
export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Hook'u güncelle
export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation<UploadResponse, Error, {
    file: File;
    userId: string;
    purpose?: FilePurpose;
    metadata?: Record<string, JsonValue>;  // 👈 İşte bu çok daha iyi!
  }>({
    mutationFn: async ({ file, userId, purpose, metadata }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      
      if (purpose) {
        formData.append('purpose', purpose);
      }
      
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }
      
      return uploadFileAPI(formData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: uploadKeys.userFiles(variables.userId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: uploadKeys.allFiles() 
      });
      queryClient.invalidateQueries({ 
        queryKey: uploadKeys.stats() 
      });
    },
  });
};

/**
 * Hızlı upload mutation'ı
 */
export const useQuickUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<QuickUploadResponse, Error, File>({
    mutationFn: quickUploadAPI,
    onSuccess: () => {
      // Tüm listeleri güncelle
      queryClient.invalidateQueries({ queryKey: uploadKeys.allFiles() });
      queryClient.invalidateQueries({ queryKey: uploadKeys.stats() });
    },
  });
};

/**
 * Dosya silme mutation'ı
 */
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteFileResponse, Error, {
    key: string;
    userId: string;
  }>({
    mutationFn: ({ key, userId }) => deleteFileAPI(key, userId),
    
    onSuccess: (_, variables) => {
      // MEVCUT KODUN + EKLENTİLER
      
      // 1. Cache'den direkt çıkar (invalidate yerine setQueryData)
      queryClient.setQueryData<UploadedFile[]>(
        uploadKeys.userFiles(variables.userId),
        (oldData) => oldData?.filter(file => file.s3_key !== variables.key)
      );
      
      queryClient.setQueryData<UploadedFile[]>(
        uploadKeys.allFiles(),
        (oldData) => oldData?.filter(file => file.s3_key !== variables.key)
      );
      
      // 2. Stats invalidate
      queryClient.invalidateQueries({ 
        queryKey: uploadKeys.stats() 
      });
      
      // 3. Dosya cache'ini temizle (zaten yapmışsın)
      queryClient.removeQueries({ 
        queryKey: uploadKeys.fileByKey(variables.key) 
      });

      // 4. Başarı mesajı
      console.log(`✅ Dosya silindi: ${variables.key}`);
    },
    
    onError: (error, variables) => {
      console.error(`❌ Silme hatası: ${variables.key}`, error);
      // toast.error('Dosya silinemedi');
    },
  });
};

/**
 * Batch upload mutation'ı
 */
export const useBatchUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<BatchUploadResponse, Error, {
    files: File[];
    userId: string;
    purpose?: FilePurpose;
  }>({
    mutationFn: async ({ files, userId, purpose }) => {
      const results = [];
      const uploadPromises = files.map(async (file) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('user_id', userId);
          
          if (purpose) {
            formData.append('purpose', purpose);
          }
          
          const result = await uploadFileAPI(formData);
          return {
            file,
            success: true,
            result: result.file,
          };
        } catch (error) {
          return {
            file,
            success: false,
            error: (error as Error).message,
          };
        }
      });
      
      const uploadResults = await Promise.all(uploadPromises);
      results.push(...uploadResults);
      
      return {
        success: results.every(r => r.success),
        message: `Batch upload completed: ${results.filter(r => r.success).length}/${results.length} successful`,
        results,
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      };
    },
    onSuccess: (_, variables) => {
      // Tüm listeleri güncelle
      queryClient.invalidateQueries({ 
        queryKey: uploadKeys.userFiles(variables.userId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: uploadKeys.allFiles() 
      });
      queryClient.invalidateQueries({ 
        queryKey: uploadKeys.stats() 
      });
    },
  });
};

/**
 * Optimistic upload (UI hemen güncellenir)
 */
export const useOptimisticUpload = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UploadResponse, 
    Error, 
    {
      file: File;
      userId: string;
      purpose?: FilePurpose;
    },
    { previousFiles?: UploadedFile[]; optimisticFile?: UploadedFile }  // 👈 CONTEXT TİPİ EKLENDİ
  >({
    mutationFn: async ({ file, userId, purpose }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      
      if (purpose) {
        formData.append('purpose', purpose);
      }
      
      return uploadFileAPI(formData);
    },
    
    // Optimistic update: API çağrısı başlamadan önce UI'ı güncelle
    onMutate: async (variables) => {
      // Önceki query'leri cancel et
      await queryClient.cancelQueries({ 
        queryKey: uploadKeys.userFiles(variables.userId) 
      });
      
      // Önceki state'i kaydet
      const previousFiles = queryClient.getQueryData<UploadedFile[]>(
        uploadKeys.userFiles(variables.userId)
      );
      
      // Optimistic dosya oluştur
      const optimisticFile: UploadedFile = {
        id: `temp-${Date.now()}`,
        user_id: variables.userId,
        filename: variables.file.name,
        s3_key: `temp/${variables.file.name}`,
        s3_url: '',
        file_size: variables.file.size,
        mime_type: variables.file.type || 'application/octet-stream',
        purpose: variables.purpose || FilePurpose.OTHER,
        uploaded_at: new Date().toISOString(),
        status: 'uploading',
      };
      
      // Optimistic olarak listeye ekle
      if (previousFiles) {
        queryClient.setQueryData<UploadedFile[]>(
          uploadKeys.userFiles(variables.userId),
          [optimisticFile, ...previousFiles]
        );
      }
      
      return { previousFiles, optimisticFile };
    },
    
    // Hata olursa eski state'e dön
    onError: (err, variables, context) => {
      console.log(err);
      if (context?.previousFiles) {  // ✅ ŞİMDİ TANINIYOR
        queryClient.setQueryData<UploadedFile[]>(
          uploadKeys.userFiles(variables.userId),
          context.previousFiles
        );
      }
    },
    
    // Başarılı olursa veriyi gerçek veriyle değiştir
    onSuccess: (data, variables, context) => {
  const previousFiles = queryClient.getQueryData<UploadedFile[]>(
    uploadKeys.userFiles(variables.userId)
  );
  
  if (previousFiles && context?.optimisticFile) {
    // Optimistic dosyayı gerçek dosyayla değiştir
    const updatedFiles = previousFiles.map(file => 
      file.id === context.optimisticFile?.id ? data.file : file  // 👈 ?. ekledik
    );
    
    queryClient.setQueryData<UploadedFile[]>(
      uploadKeys.userFiles(variables.userId),
      updatedFiles
    );
  }
  
  // Diğer query'leri invalidate et
  queryClient.invalidateQueries({ queryKey: uploadKeys.allFiles() });
  queryClient.invalidateQueries({ queryKey: uploadKeys.stats() });
},
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Dosya boyutunu formatla
 */
export const useFormatFileSize = () => {
  return (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
};

/**
 * Dosya türü ikonu getir
 */
export const useFileIcon = () => {
  return (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel')) return '📊';
    if (mimeType.includes('powerpoint')) return '📈';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    if (mimeType.includes('javascript') || mimeType.includes('html') || mimeType.includes('css')) return '💻';
    if (mimeType.includes('json') || mimeType.includes('xml')) return '⚙️';
    return '📎';
  };
};