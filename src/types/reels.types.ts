// ==================== REELS TYPES ====================

/**
 * Reels video modeli
 */
export interface Reels {
  id: string;
  user_id: string;
  product_id: string;
  video_url: string;
  thumbnail_url: string;
  caption: string;
  duration: number;
  views: number;
  likes: number;
  comment_count: number;
  share_count: number;
  status: number; // 1: active, 0: deleted
  created_at: string;
  updated_at: string;
}

/**
 * Reels yorum modeli
 */
export interface ReelsComment {
  id: string;
  reels_id: string;
  user_id: string;
  parent_id: string | null;
  comment: string;
  like_count: number;
  status: number;
  created_at: string;
}

/**
 * Kullanıcı modeli (takip için)
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'seller' | 'admin';
  created_at: string;
}

// ==================== API REQUEST TYPES ====================

/**
 * Reels yükleme isteği (multipart/form-data)
 */
export interface UploadReelsRequest {
  product_id: string;
  caption?: string;
  video: File;
}

/**
 * Yorum ekleme isteği
 */
export interface AddCommentRequest {
  comment: string;
  parent_id?: string;
}

// ==================== API RESPONSE TYPES ====================

/**
 * Reels yükleme yanıtı
 */
export interface UploadReelsResponse {
  message: string;
  reels: Reels;
}

/**
 * Reels feed yanıtı
 */
export interface ReelsFeedResponse {
  reels: Reels[];
  limit: number;
  offset: number;
}

/**
 * Tek reels yanıtı
 */
export interface ReelsResponse {
  reels: Reels;
}

/**
 * Kullanıcı reels'leri yanıtı
 */
export interface UserReelsResponse {
  reels: Reels[];
  count: number;
}

/**
 * Yorum listesi yanıtı
 */
export interface ReelsCommentsResponse {
  comments: ReelsComment[];
  count: number;
}

/**
 * Yorum ekleme yanıtı
 */
export interface AddCommentResponse {
  message: string;
  comment: ReelsComment;
}

/**
 * Beğeni yanıtı
 */
export interface LikeResponse {
  message: string;
}

// ==================== XP TYPES ====================

/**
 * XP kuralı
 */
export interface XPRule {
  action_type: string;
  base_xp: number;
  daily_limit: number;
  cooldown_seconds: number;
  description: string;
}

/**
 * Benim XP yanıtı
 */
export interface MyXPResponse {
  user_id: string;
  total_xp: number;
  level: number;
  next_level_xp: number;
  xp_needed: number;
}

/**
 * Leaderboard girişi
 */
export interface XPLeaderboardEntry {
  user_id: string;
  name: string;
  email: string;
  total_xp: number;
  level: number;
}

/**
 * Leaderboard yanıtı
 */
export interface XPLeaderboardResponse {
  leaderboard: XPLeaderboardEntry[];
  count: number;
}

/**
 * XP kuralları yanıtı
 */
export interface XPRulesResponse {
  rules: XPRule[];
}

// ==================== FOLLOW TYPES ====================

/**
 * Takipçi/Takip edilen kullanıcı
 */
export interface FollowUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

/**
 * Takipçi listesi yanıtı
 */
export interface FollowersResponse {
  followers: FollowUser[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Takip edilenler yanıtı
 */
export interface FollowingResponse {
  following: FollowUser[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Takip sayıları yanıtı
 */
export interface FollowCountsResponse {
  follower_count: number;
  following_count: number;
}

/**
 * Takip durumu yanıtı
 */
export interface IsFollowingResponse {
  is_following: boolean;
  follower_id: string;
  following_id: string;
}

/**
 * Takip işlemi yanıtı
 */
export interface FollowActionResponse {
  message: string;
}

// ==================== COMPETITION TYPES ====================

/**
 * Yarışma modeli
 */
export interface Competition {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: number; // 1: upcoming, 2: active, 3: ended
  prize_description: string;
  created_by: string | null;
  created_at: string;
}

/**
 * Yarışma sıralama girişi
 */
export interface CompetitionLeaderboardEntry {
  competition_id: string;
  user_id: string;
  total_xp: number;
  rank: number;
  prize_given: boolean;
}

/**
 * Yarışma sıralaması yanıtı
 */
export interface CompetitionLeaderboardResponse {
  competition_id: string;
  leaderboard: CompetitionLeaderboardEntry[];
  count: number;
}

/**
 * Aktif yarışma yanıtı
 */
export interface ActiveCompetitionResponse {
  competition: Competition;
}

/**
 * Yarışma sırası yanıtı
 */
export interface MyCompetitionRankResponse {
  competition_id: string;
  user_id: string;
  rank: number;
}

// ==================== TYPE GUARDS ====================

export const isReels = (obj: unknown): obj is Reels => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'user_id' in obj &&
    'video_url' in obj
  );
};

export const isReelsArray = (obj: unknown): obj is Reels[] => {
  return Array.isArray(obj) && obj.every(isReels);
};

// ==================== ENUMS ====================

export const ReelsStatus = {
  ACTIVE: 1,
  DELETED: 0,
} as const;

export type ReelsStatus = typeof ReelsStatus[keyof typeof ReelsStatus];

export const CompetitionStatus = {
  UPCOMING: 1,
  ACTIVE: 2,
  ENDED: 3,
} as const;

export type CompetitionStatus = typeof CompetitionStatus[keyof typeof CompetitionStatus];