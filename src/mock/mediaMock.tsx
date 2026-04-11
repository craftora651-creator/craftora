// mock/mediaMock.ts
import { Video, Comment } from '../types/media.types';

export const mockVideos: Video[] = [
  {
    id: '1',
    productId: 'prod_001',
    productName: 'Nike Air Max 270',
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    description: '🔥 Yeni sezonun en şık spor ayakkabısı! #Nike #AirMax #Style',
    hashtags: ['Nike', 'AirMax', 'Style', 'Sneaker'],
    status: 'published',
    stats: {
      views: 12500,
      likes: 3400,
      comments: 128,
      shares: 456
    },
    user: {
      id: 'user_001',
      name: 'Emma Watson',
      username: '@emmawatson',
      avatar: 'https://images.unsplash.com/photo-1494790108777-466d5eb9166c?w=100',
      isVerified: true
    },
    createdAt: new Date('2024-03-20'),
    publishedAt: new Date('2024-03-20')
  },
  {
    id: '2',
    productId: 'prod_002',
    productName: 'Ultimate UI Kit',
    productImage: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400',
    description: '✨ Tasarım dünyasında devrim! #UI #UX #Design',
    hashtags: ['UI', 'UX', 'Design', 'WebDesign'],
    status: 'published',
    stats: {
      views: 28400,
      likes: 8900,
      comments: 342,
      shares: 1234
    },
    user: {
      id: 'user_002',
      name: 'John Doe',
      username: '@johndoe',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      isVerified: false
    },
    createdAt: new Date('2024-03-18'),
    publishedAt: new Date('2024-03-18')
  }
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    videoId: '1',
    userId: 'user_003',
    userName: 'Alice',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    text: 'Harika görünüyor! Nereden alabilirim?',
    likes: 45,
    createdAt: new Date()
  }
];