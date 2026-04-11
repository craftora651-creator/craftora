// types/video.types.ts
export interface MockVideo {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  videoUrl: string;
  thumbnailUrl: string;      // Kapak fotoğrafı
  description: string;
  hashtags: string[];
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  createdAt: string;
}