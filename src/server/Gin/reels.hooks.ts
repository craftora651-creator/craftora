import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/apiClient';
import type {
  Reels,
  ReelsComment,
  ReelsFeedResponse,
  UserReelsResponse,
  ReelsResponse,
  ReelsCommentsResponse,
  AddCommentResponse,
  LikeResponse,
  MyXPResponse,
  XPLeaderboardResponse,
  XPRulesResponse,
  FollowersResponse,
  FollowingResponse,
  FollowCountsResponse,
  IsFollowingResponse,
  FollowActionResponse,
  CompetitionLeaderboardResponse,
  ActiveCompetitionResponse,
  MyCompetitionRankResponse,
} from '../../types/reels.types';

// ==================== QUERY KEYS ====================
export const reelsKeys = {
  all: ['reels'] as const,
  feed: (limit?: number, offset?: number) => [...reelsKeys.all, 'feed', { limit, offset }] as const,
  reelsByUser: (userId: string) => [...reelsKeys.all, 'user', userId] as const,
  reelsById: (id: string) => [...reelsKeys.all, id] as const,
  comments: (reelsId: string) => [...reelsKeys.all, 'comments', reelsId] as const,
  
  xp: {
    me: ['xp', 'me'] as const,
    leaderboard: (limit?: number) => ['xp', 'leaderboard', { limit }] as const,
    rules: ['xp', 'rules'] as const,
  },
  
  follow: {
    followers: (userId: string, limit?: number, offset?: number) => 
      ['follow', 'followers', userId, { limit, offset }] as const,
    following: (userId: string, limit?: number, offset?: number) => 
      ['follow', 'following', userId, { limit, offset }] as const,
    counts: (userId: string) => ['follow', 'counts', userId] as const,
    status: (followerId: string, followingId: string) => 
      ['follow', 'status', followerId, followingId] as const,
  },
  
  competition: {
    active: ['competition', 'active'] as const,
    leaderboard: (competitionId: string, limit?: number) => 
      ['competition', 'leaderboard', competitionId, { limit }] as const,
    myRank: (competitionId: string) => ['competition', 'my-rank', competitionId] as const,
  },
};

// ==================== REELS HOOKS ====================

/**
 * Ana akış (random sıralama)
 */
export const useReelsFeed = (limit: number = 10, offset: number = 0) => {
  return useQuery({
    queryKey: reelsKeys.feed(limit, offset),
    queryFn: async () => {
      const response = await apiClient.goGet<ReelsFeedResponse>(
        `/api/reels/feed?limit=${limit}&offset=${offset}`
      );
      return response.reels;
    },
    staleTime: 1000 * 60, // 1 dakika
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Sonsuz kaydırma için infinite query
 */

export const useInfiniteReelsFeed = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: [...reelsKeys.feed(), 'infinite'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.goGet<ReelsFeedResponse>(
        `/api/reels/feed?limit=${limit}&offset=${pageParam}`
      );
      return {
        reels: response.reels,
        nextOffset: pageParam + limit,
        hasMore: response.reels.length === limit,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextOffset : undefined,
  });
};

/**
 * Kullanıcının reels'leri
 */

export const useUserReels = (userId: string) => {
  return useQuery({
    queryKey: reelsKeys.reelsByUser(userId),
    queryFn: async () => {
      console.log("🔄 Fetching reels for user:", userId);
      const response = await apiClient.goGet<UserReelsResponse>(
        `/api/reels/user/${userId}`
      );
      console.log("📦 Fetched reels count:", response.reels?.length || 0);
      return response.reels || [];
    },
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

/**
 * Tek reels getir
 */
export const useReelsById = (id: string) => {
  return useQuery({
    queryKey: reelsKeys.reelsById(id),
    queryFn: async () => {
      const response = await apiClient.goGet<ReelsResponse>(
        `/api/reels/${id}`
      );
      return response.reels;
    },
    enabled: !!id,
    staleTime: 1000 * 30,
  });
};

/**
 * Reels yükleme
 */

export const useUploadReels = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      product_id, 
      caption, 
      video, 
      thumbnail, 
      userId 
    }: { 
      product_id: string; 
      caption?: string; 
      video: File;
      thumbnail?: File;  // ← TİP EKLENDİ
      userId: string;
    }) => {
      const formData = new FormData();
      formData.append('product_id', product_id);
      if (caption) formData.append('caption', caption);
      formData.append('video', video);
      if (thumbnail) formData.append('thumbnail', thumbnail);
      formData.append('user_id', userId);
      
      const response = await apiClient.goPost<{ message: string; reels: Reels }>(
        '/api/reels/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.reels;
    },
    onSuccess: (newReels, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: reelsKeys.reelsByUser(variables.userId),
      });
      
      queryClient.setQueryData<Reels[]>(
        reelsKeys.reelsByUser(variables.userId),
        (old) => old ? [newReels, ...old] : [newReels]
      );
      
      queryClient.invalidateQueries({ queryKey: reelsKeys.feed() });
    },
  });
};

/**
 * Reels beğen
 */
export const useLikeReels = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reelsId: string) => {
      const response = await apiClient.goPost<LikeResponse>(
        `/api/reels/${reelsId}/like`,
        {}
      );
      return response;
    },
    onSuccess: (_, reelsId) => {
      // Tek reels cache'ini güncelle
      queryClient.setQueryData<Reels>(
        reelsKeys.reelsById(reelsId),
        (old) => old ? { ...old, likes: old.likes + 1 } : old
      );
      
      // Feed'deki reels'leri güncelle
      queryClient.setQueriesData<Reels[]>(
        { queryKey: reelsKeys.feed() },
        (old) => old?.map(reels => 
          reels.id === reelsId ? { ...reels, likes: reels.likes + 1 } : reels
        )
      );
      
      // XP'yi yenile
      queryClient.invalidateQueries({ queryKey: reelsKeys.xp.me });
    },
  });
};

/**
 * Reels beğeni kaldır
 */
export const useUnlikeReels = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reelsId: string) => {
      const response = await apiClient.delete<LikeResponse>(
        `/api/reels/${reelsId}/like`
      );
      return response;
    },
    onSuccess: (_, reelsId) => {
      // Tek reels cache'ini güncelle
      queryClient.setQueryData<Reels>(
        reelsKeys.reelsById(reelsId),
        (old) => old ? { ...old, likes: Math.max(0, old.likes - 1) } : old
      );
      
      // Feed'deki reels'leri güncelle
      queryClient.setQueriesData<Reels[]>(
        { queryKey: reelsKeys.feed() },
        (old) => old?.map(reels => 
          reels.id === reelsId ? { ...reels, likes: Math.max(0, reels.likes - 1) } : reels
        )
      );
    },
  });
};

/**
 * Yorum ekle
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reelsId, comment, parentId }: { 
      reelsId: string; 
      comment: string; 
      parentId?: string;
    }) => {
      const response = await apiClient.goPost<AddCommentResponse>(
        `/api/reels/${reelsId}/comment`,
        { comment, parent_id: parentId }
      );
      return response.comment;
    },
    onSuccess: (newComment, { reelsId }) => {
      // Yorumları cache'e ekle
      queryClient.setQueryData<ReelsComment[]>(
        reelsKeys.comments(reelsId),
        (old) => old ? [...old, newComment] : [newComment]
      );
      
      // Reels comment_count güncelle
      queryClient.setQueryData<Reels>(
        reelsKeys.reelsById(reelsId),
        (old) => old ? { ...old, comment_count: old.comment_count + 1 } : old
      );
      
      // XP'yi yenile
      queryClient.invalidateQueries({ queryKey: reelsKeys.xp.me });
    },
  });
};

/**
 * Yorumları getir
 */
export const useReelsComments = (reelsId: string, limit: number = 50) => {
  return useQuery({
    queryKey: [...reelsKeys.comments(reelsId), { limit }],
    queryFn: async () => {
      const response = await apiClient.goGet<ReelsCommentsResponse>(
        `/api/reels/${reelsId}/comments?limit=${limit}`
      );
      return response.comments;
    },
    enabled: !!reelsId,
    staleTime: 1000 * 30,
  });
};

// ==================== XP HOOKS ====================

/**
 * Benim XP'm
 */
export const useMyXP = () => {
  return useQuery({
    queryKey: reelsKeys.xp.me,
    queryFn: async () => {
      const response = await apiClient.goGet<MyXPResponse>('/api/xp/me');
      return response;
    },
    staleTime: 1000 * 30,
  });
};

/**
 * Leaderboard
 */
export const useXPLeaderboard = (limit: number = 50) => {
  return useQuery({
    queryKey: reelsKeys.xp.leaderboard(limit),
    queryFn: async () => {
      const response = await apiClient.goGet<XPLeaderboardResponse>(
        `/api/xp/leaderboard?limit=${limit}`
      );
      return response.leaderboard;
    },
    staleTime: 1000 * 60,
  });
};

/**
 * XP kuralları
 */
export const useXPRules = () => {
  return useQuery({
    queryKey: reelsKeys.xp.rules,
    queryFn: async () => {
      const response = await apiClient.goGet<XPRulesResponse>('/api/xp/rules');
      return response.rules;
    },
    staleTime: 1000 * 60 * 10, // 10 dakika
  });
};

// ==================== FOLLOW HOOKS ====================

/**
 * Takip et
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.goPost<FollowActionResponse>(
        `/api/follow/${userId}`,
        {}
      );
      return response;
    },
    onSuccess: (_, userId) => {
      // Takipçi sayılarını güncelle
      queryClient.invalidateQueries({ queryKey: reelsKeys.follow.counts(userId) });
      queryClient.invalidateQueries({ queryKey: ['follow', 'status'] });
    },
  });
};

/**
 * Takipten çık
 */
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.delete<FollowActionResponse>(
        `/api/follow/${userId}`
      );
      return response;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: reelsKeys.follow.counts(userId) });
      queryClient.invalidateQueries({ queryKey: ['follow', 'status'] });
    },
  });
};

/**
 * Takip durumu
 */
export const useIsFollowing = (followingId: string) => {
  return useQuery({
    queryKey: reelsKeys.follow.status('me', followingId),
    queryFn: async () => {
      const response = await apiClient.goGet<IsFollowingResponse>(
        `/api/follow/status/${followingId}`
      );
      return response.is_following;
    },
    enabled: !!followingId,
  });
};

/**
 * Takipçiler
 */
export const useFollowers = (userId: string, limit: number = 20, offset: number = 0) => {
  return useQuery({
    queryKey: reelsKeys.follow.followers(userId, limit, offset),
    queryFn: async () => {
      const response = await apiClient.goGet<FollowersResponse>(
        `/api/follow/followers?limit=${limit}&offset=${offset}`
      );
      return response.followers;
    },
    enabled: !!userId,
    staleTime: 1000 * 30,
  });
};

/**
 * Takip edilenler
 */
export const useFollowing = (userId: string, limit: number = 20, offset: number = 0) => {
  return useQuery({
    queryKey: reelsKeys.follow.following(userId, limit, offset),
    queryFn: async () => {
      const response = await apiClient.goGet<FollowingResponse>(
        `/api/follow/following?limit=${limit}&offset=${offset}`
      );
      return response.following;
    },
    enabled: !!userId,
    staleTime: 1000 * 30,
  });
};

/**
 * Takip sayıları
 */
export const useFollowCounts = (userId: string) => {
  return useQuery({
    queryKey: reelsKeys.follow.counts(userId),
    queryFn: async () => {
      const response = await apiClient.goGet<FollowCountsResponse>(
        '/api/follow/counts'
      );
      return {
        followerCount: response.follower_count,
        followingCount: response.following_count,
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 30,
  });
};

// ==================== COMPETITION HOOKS ====================

/**
 * Aktif yarışma
 */
export const useActiveCompetition = () => {
  return useQuery({
    queryKey: reelsKeys.competition.active,
    queryFn: async () => {
      try {
        const response = await apiClient.goGet<ActiveCompetitionResponse>(
          '/api/competitions/active'
        );
        return response.competition;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60,
  });
};

/**
 * Yarışma sıralaması
 */
export const useCompetitionLeaderboard = (competitionId: string, limit: number = 100) => {
  return useQuery({
    queryKey: reelsKeys.competition.leaderboard(competitionId, limit),
    queryFn: async () => {
      const response = await apiClient.goGet<CompetitionLeaderboardResponse>(
        `/api/competitions/${competitionId}/leaderboard?limit=${limit}`
      );
      return response.leaderboard;
    },
    enabled: !!competitionId,
    staleTime: 1000 * 30,
  });
};

/**
 * Yarışmadaki sıram
 */
export const useMyCompetitionRank = (competitionId: string) => {
  return useQuery({
    queryKey: reelsKeys.competition.myRank(competitionId),
    queryFn: async () => {
      try {
        const response = await apiClient.goGet<MyCompetitionRankResponse>(
          `/api/competitions/${competitionId}/my-rank`
        );
        return response.rank;
      } catch {
        return null;
      }
    },
    enabled: !!competitionId,
  });
};

export const useDeleteReels = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (reelsId: string) => {
            // 🎯 Artık apiClient.goDelete kullan
            const response = await apiClient.goDelete<{ message: string }>(`/api/reels/${reelsId}`);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reelsKeys.all });
        },
    });
};