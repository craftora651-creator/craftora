import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaHeart,
    FaShare,
    FaUser,
    FaRegHeart,
    FaShoppingBag,
    FaBookmark,
    FaRegBookmark,
    FaChevronRight,
    FaArrowLeft,
} from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { useUserReels } from '../server/Gin/reels.hooks';

interface VideoPlayerProps {
    colors?: {
        bg: string;
        surface: string;
        border: string;
        text: string;
        textSecondary: string;
        primary: string;
        primaryDark: string;
    };
}

const VideoPlayer = ({ colors }: VideoPlayerProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [videos, setVideos] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedStates, setLikedStates] = useState<boolean[]>([]);
    const [savedStates, setSavedStates] = useState<boolean[]>([]);
    const [followingStates, setFollowingStates] = useState<boolean[]>([]);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    
    const containerRef = useRef<HTMLDivElement>(null);

    const theme = colors || {
        bg: '#121212',
        surface: '#1e1e1e',
        border: '#2a2a2a',
        text: '#eeeeee',
        textSecondary: '#a0a0a0',
        primary: '#e07c5c',
        primaryDark: '#c96b4d',
    };

    const TEST_USER_ID = "2bd9cafe-4677-4ff3-a34d-5d966cff6a65";
    const { data: apiVideos, isLoading } = useUserReels(TEST_USER_ID);

    // Videoları API'den yükle
    useEffect(() => {
        if (apiVideos && apiVideos.length > 0) {
            const formattedVideos = apiVideos.map((video: any) => ({
                id: video.id,
                productId: video.product_id,
                productName: video.product_name || 'Ürün',
                productImage: video.product_image || '',
                videoUrl: video.video_url,
                thumbnailUrl: video.thumbnail_url,
                description: video.caption,
                productPrice: video.product_price || 199,
                originalPrice: video.original_price,
                stats: {
                    views: video.views || 0,
                    likes: video.likes || 0,
                    comments: video.comment_count || 0,
                    shares: video.share_count || 0,
                    sales: 0
                },
                user: {
                    id: video.user_id,
                    name: video.user_name || 'Kullanıcı',
                    username: video.user_username || '@kullanici',
                    avatar: video.user_avatar || '',
                    isVerified: video.user_is_verified || false
                },
                createdAt: video.created_at
            }));

            setVideos(formattedVideos);
            const index = formattedVideos.findIndex((v: any) => v.id === id);
            setCurrentIndex(index >= 0 ? index : 0);
            setLikedStates(new Array(formattedVideos.length).fill(false));
            setSavedStates(new Array(formattedVideos.length).fill(false));
            setFollowingStates(new Array(formattedVideos.length).fill(false));
        }
    }, [apiVideos, id]);

    // Mouse wheel ile kaydırma
    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (e.deltaY > 0) {
            if (currentIndex < videos.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        } else if (e.deltaY < 0) {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [currentIndex, videos.length]);

    // Touch ile kaydırma
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const diff = touchStart - touchEnd;

        if (diff > 30) {
            if (currentIndex < videos.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        } else if (diff < -30) {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    const handleLike = (index: number) => {
        const newLiked = [...likedStates];
        newLiked[index] = !newLiked[index];
        setLikedStates(newLiked);
        
        // TODO: API'ye like gönder
    };

    const handleSave = (index: number) => {
        const newSaved = [...savedStates];
        newSaved[index] = !newSaved[index];
        setSavedStates(newSaved);
    };

    const handleFollow = (index: number) => {
        const newFollowing = [...followingStates];
        newFollowing[index] = !newFollowing[index];
        setFollowingStates(newFollowing);
    };

    const currentVideo = videos[currentIndex];
    const isLiked = likedStates[currentIndex];
    const isSaved = savedStates[currentIndex];
    const isFollowing = followingStates[currentIndex];

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: theme.text }}>Yükleniyor...</div>
            </div>
        );
    }

    if (!currentVideo || videos.length === 0) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: theme.text }}>Video bulunamadı...</div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: theme.bg, 
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Geri Butonu */}
            <button 
                onClick={() => navigate(-1)} 
                style={{ 
                    position: 'absolute', 
                    top: 20, 
                    left: 20, 
                    zIndex: 20, 
                    background: 'rgba(0,0,0,0.5)', 
                    border: 'none', 
                    borderRadius: 30, 
                    width: 40, 
                    height: 40, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer',
                    color: 'white'
                }}
            >
                <FaArrowLeft size={20} />
            </button>

            {/* TikTok Tarzı Video Kaydırma Alanı */}
            <div
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    height: '100vh',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {videos.map((video, index) => (
                    <div
                        key={video.id}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            transform: `translateY(${(index - currentIndex) * 100}%)`,
                            transition: 'transform 0.3s ease-out',
                        }}
                    >
                        {/* Video Arkaplan */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${video.thumbnailUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))'
                            }} />
                        </div>

                        {/* Video Player */}
                        {index === currentIndex && (
                            <video
                                src={video.videoUrl}
                                autoPlay
                                loop
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        )}

                        {/* Sol Alt - Ürün Bilgisi */}
                        <div style={{
                            position: 'absolute',
                            bottom: 100,
                            left: 16,
                            zIndex: 10,
                            maxWidth: '70%'
                        }}>
                            <div style={{
                                display: 'inline-block',
                                background: theme.primary,
                                padding: '4px 12px',
                                borderRadius: 20,
                                fontSize: 11,
                                fontWeight: 600,
                                color: 'white',
                                marginBottom: 12
                            }}>
                                🔥 {video.productName}
                            </div>
                            <h2 style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: 'white',
                                margin: '0 0 8px 0',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                                {video.productName}
                            </h2>
                            <p style={{
                                fontSize: 13,
                                color: 'rgba(255,255,255,0.9)',
                                margin: '0 0 12px 0',
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            }}>
                                {video.description || 'Amazing product! Check it out now.'}
                            </p>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12
                            }}>
                                <span style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: 'white'
                                }}>
                                    ${video.productPrice || 199}
                                </span>
                                {video.originalPrice && (
                                    <span style={{
                                        fontSize: 14,
                                        textDecoration: 'line-through',
                                        color: 'rgba(255,255,255,0.6)'
                                    }}>
                                        ${video.originalPrice}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Sağ Aksiyon Butonları */}
                        <div style={{
                            position: 'absolute',
                            bottom: 100,
                            right: 16,
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 24
                        }}>
                            {/* Takip Et */}
                            <div style={{ textAlign: 'center' }} onClick={() => handleFollow(index)}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 4,
                                    cursor: 'pointer'
                                }}>
                                    <FaUser size={22} color={isFollowing ? theme.primary : 'white'} />
                                </div>
                                <span style={{ fontSize: 11, color: 'white' }}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </span>
                            </div>

                            {/* Beğen */}
                            <div style={{ textAlign: 'center' }} onClick={() => handleLike(index)}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 4,
                                    cursor: 'pointer'
                                }}>
                                    {isLiked ? <FaHeart size={22} color="#ef4444" /> : <FaRegHeart size={22} color="white" />}
                                </div>
                                <span style={{ fontSize: 11, color: 'white' }}>{video.stats?.likes || 0}</span>
                            </div>

                            {/* Kaydet */}
                            <div style={{ textAlign: 'center' }} onClick={() => handleSave(index)}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 4,
                                    cursor: 'pointer'
                                }}>
                                    {isSaved ? <FaBookmark size={22} color={theme.primary} /> : <FaRegBookmark size={22} color="white" />}
                                </div>
                                <span style={{ fontSize: 11, color: 'white' }}>Save</span>
                            </div>

                            {/* Paylaş */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 4,
                                    cursor: 'pointer'
                                }}>
                                    <FaShare size={22} color="white" />
                                </div>
                                <span style={{ fontSize: 11, color: 'white' }}>Share</span>
                            </div>

                            {/* Daha Fazla */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 4,
                                    cursor: 'pointer'
                                }}>
                                    <BsThreeDots size={22} color="white" />
                                </div>
                                <span style={{ fontSize: 11, color: 'white' }}>More</span>
                            </div>
                        </div>

                        {/* Alt Butonlar */}
                        <div style={{
                            position: 'absolute',
                            bottom: 20,
                            left: 16,
                            right: 16,
                            zIndex: 10,
                            display: 'flex',
                            gap: 12
                        }}>
                            <button style={{
                                flex: 1,
                                padding: '12px',
                                background: theme.primary,
                                border: 'none',
                                borderRadius: 30,
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 14,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                cursor: 'pointer'
                            }}>
                                <FaShoppingBag size={16} />
                                BUY NOW
                            </button>
                            <button style={{
                                flex: 1,
                                padding: '12px',
                                background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(8px)',
                                border: 'none',
                                borderRadius: 30,
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 14,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                cursor: 'pointer'
                            }}>
                                Ürüne Git
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPlayer;