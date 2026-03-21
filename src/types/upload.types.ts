export const FilePurpose = {
  PRODUCT_FILE: 'product_file',
  PRODUCT_IMAGE: 'product_image',
  PRODUCT_COVER: 'product_cover',
  SHOP_BANNER: 'shop_banner',
  SHOP_LOGO: 'shop_logo',
  USER_AVATAR: 'user_avatar',
  DESIGN_FILE: 'design_file',
  WEBSITE_FILE: 'website_file',
  DOCUMENT: 'document',
  OTHER: 'other'
} as const;

export type FilePurpose = typeof FilePurpose[keyof typeof FilePurpose];


export const FileStatus = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  FAILED: 'failed',
  PROCESSING: 'processing',
  DELETED: 'deleted'
} as const;

export type FileStatus = typeof FileStatus[keyof typeof FileStatus];

export const StorageProvider = {
  S3: 's3',
  MINIO: 'minio',
  CLOUDINARY: 'cloudinary',
  LOCAL: 'local'
} as const;

export type StorageProvider = typeof StorageProvider[keyof typeof StorageProvider];

// ==================== INTERFACES ====================

// Uploaded File
export interface UploadedFile {
  id: string;
  user_id: string;
  filename: string;
  s3_key: string;
  s3_url: string;
  file_size: number;
  mime_type: string;
  purpose: FilePurpose;
  uploaded_at: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
    public_id?: string;
    folder?: string;
    tags?: string[];
  };
  status: FileStatus;
  error?: string;
}

// File Upload Config
export interface UploadConfig {
  provider: StorageProvider;
  bucket: string;
  region: string;
  endpoint?: string;
  use_minio: boolean;
  use_ssl: boolean;
  max_file_size: number; // bytes
  allowed_types: number;
  s3_connected: boolean;
  db_connected: boolean;
}

// Upload Request
export interface UploadRequest {
  file: File;
  purpose?: FilePurpose;
  metadata?: {
    folder?: string;
    tags?: string[];
    transformation?: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: number;
    };
  };
}

// Upload Response
export interface UploadResponse {
  success: boolean;
  message: string;
  file: UploadedFile;
  preview: {
    url: string;
    direct: string;
  };
}

// Upload Progress
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  timeRemaining: number; // seconds
}

// User Files Request
export interface UserFilesRequest {
  user_id: string;
  limit?: number;
  offset?: number;
  purpose?: FilePurpose;
  mime_type?: string;
}

// User Files Response
export interface UserFilesResponse {
  success: boolean;
  count: number;
  files: UploadedFile[];
  total?: number;
  has_more: boolean;
}

// Delete File Request
export interface DeleteFileRequest {
  key: string;
  user_id: string;
}

// Delete File Response
export interface DeleteFileResponse {
  success: boolean;
  message: string;
  key: string;
}

// All Files Response (Admin)
export interface AllFilesResponse {
  success: boolean;
  count: number;
  files: UploadedFile[];
  total_size: number;
  by_purpose: Record<FilePurpose, number>;
  by_type: Record<string, number>;
}

// Upload Stats
export interface UploadStats {
  total_files: number;
  total_size: number; // bytes
  today_count: number;
  today_size: number;
  by_purpose: Record<FilePurpose, number>;
  by_mime_type: Record<string, number>;
  largest_file: {
    id: string;
    filename: string;
    size: number;
    uploaded_at: string;
  };
  recent_uploads: UploadedFile[];
}

// Health Check
export interface UploadHealth {
  service: string;
  status: 'healthy' | 'warning' | 'unhealthy';
  s3_connected: boolean;
  db_connected: boolean;
  config: UploadConfig;
  limits: {
    max_file_size: string; // "100 MB"
    allowed_types: number;
  };
}

// Quick Upload Response
export interface QuickUploadResponse {
  success: boolean;
  message: string;
  file: UploadedFile;
  url: string;
}

// File Preview Info
export interface FilePreview {
  url: string;
  thumbnail_url?: string;
  direct_url: string;
  embed_code?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // video/audio için
  pages?: number; // PDF için
}

// Batch Upload
export interface BatchUploadRequest {
  files: File[];
  purpose?: FilePurpose;
  folder?: string;
  tags?: string[];
}

export interface BatchUploadResponse {
  success: boolean;
  message: string;
  results: Array<{
    file: File;
    success: boolean;
    result?: UploadedFile;
    error?: string;
  }>;
  total: number;
  successful: number;
  failed: number;
}

// ==================== TYPE GUARDS ====================
export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

export const isVideoFile = (mimeType: string): boolean => {
  return mimeType.startsWith('video/');
};

export const isAudioFile = (mimeType: string): boolean => {
  return mimeType.startsWith('audio/');
};

export const isDocumentFile = (mimeType: string): boolean => {
  return [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ].includes(mimeType);
};

export const isArchiveFile = (mimeType: string): boolean => {
  return [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
  ].includes(mimeType);
};

export const isCodeFile = (mimeType: string): boolean => {
  return [
    'text/html',
    'text/css',
    'application/javascript',
    'text/javascript',
    'application/json',
    'application/xml',
  ].includes(mimeType);
};

// ==================== UTILITY TYPES ====================
export interface AllowedFileType {
  mime: string;
  extension: string;
  category: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'design' | 'other';
  max_size?: number; // bytes
}

export const ALLOWED_FILE_TYPES: AllowedFileType[] = [
  // Images
  { mime: 'image/jpeg', extension: '.jpg', category: 'image' },
  { mime: 'image/jpg', extension: '.jpg', category: 'image' },
  { mime: 'image/png', extension: '.png', category: 'image' },
  { mime: 'image/gif', extension: '.gif', category: 'image' },
  { mime: 'image/webp', extension: '.webp', category: 'image' },
  { mime: 'image/svg+xml', extension: '.svg', category: 'image' },
  
  // Documents
  { mime: 'application/pdf', extension: '.pdf', category: 'document' },
  
  // Archives
  { mime: 'application/zip', extension: '.zip', category: 'archive' },
  { mime: 'application/x-rar-compressed', extension: '.rar', category: 'archive' },
  { mime: 'application/x-7z-compressed', extension: '.7z', category: 'archive' },
  
  // Design Files
  { mime: 'application/json', extension: '.json', category: 'design' },
  { mime: 'application/xml', extension: '.xml', category: 'design' },
  { mime: 'application/octet-stream', extension: '.fig', category: 'design' },
  { mime: 'application/x-figma', extension: '.fig', category: 'design' },
  
  // Web Development
  { mime: 'text/html', extension: '.html', category: 'code' },
  { mime: 'text/css', extension: '.css', category: 'code' },
  { mime: 'application/javascript', extension: '.js', category: 'code' },
  { mime: 'text/javascript', extension: '.js', category: 'code' },
  
  // Office
  { mime: 'application/msword', extension: '.doc', category: 'document' },
  { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', extension: '.docx', category: 'document' },
  { mime: 'application/vnd.ms-excel', extension: '.xls', category: 'document' },
  { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', extension: '.xlsx', category: 'document' },
  { mime: 'application/vnd.ms-powerpoint', extension: '.ppt', category: 'document' },
  { mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', extension: '.pptx', category: 'document' },
  
  // Video
  { mime: 'video/mp4', extension: '.mp4', category: 'video' },
  { mime: 'video/webm', extension: '.webm', category: 'video' },
  { mime: 'video/quicktime', extension: '.mov', category: 'video' },
  
  // Audio
  { mime: 'audio/mpeg', extension: '.mp3', category: 'audio' },
  { mime: 'audio/wav', extension: '.wav', category: 'audio' },
  { mime: 'audio/ogg', extension: '.ogg', category: 'audio' },
];

// ==================== REQUEST/RESPONSE TYPES FOR API ====================
export interface ApiUploadRequest {
  purpose?: FilePurpose;
  user_id: string;
  metadata?: Record<string, unknown>;
}

export interface ApiUploadResponse {
  success: boolean;
  message: string;
  file: UploadedFile;
  preview: {
    url: string;
    direct: string;
  };
}

export interface ApiGetUserFilesParams {
  limit?: number;
  offset?: number;
  purpose?: FilePurpose;
  mime_type?: string;
}

export interface ApiDeleteFileParams {
  user_id: string;
}