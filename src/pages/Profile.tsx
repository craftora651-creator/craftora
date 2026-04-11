// Profile.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useUserReels, useDeleteReels } from '../server/Gin/reels.hooks';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../server/FastAPI/user.hooks';
import {
    FaCog,
    FaPlus,
    FaPlay,
    FaShoppingBag,
    FaHome,
    FaUser,
    FaSearch,
    FaGem,
    FaTrophy,
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import styles from '../css/Medya.module.css';
import Settings from './Settings'; // Settings componentini import et
import VideoUploader from './VideoUploader';  // ✅ EKLE

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('videos');
    const [activeNav, setActiveNav] = useState('profile');
    const [searchActive, setSearchActive] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isVideoUploaderOpen, setIsVideoUploaderOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<any>(null);
    const { data: user, isLoading } = useCurrentUser();
    const { mutate: deleteReels } = useDeleteReels();
    const userId = user?.id || '';
    const { data: apiVideos, refetch: refetchVideos } = useUserReels(userId);
    const avatarUrl = user?.avatar_url;
    const fullName = user?.full_name || 'Kullanıcı';
    const email = user?.email;
    const isVerified = user?.is_verified || false;
    const userRole = user?.role;

    const videos = apiVideos?.map((video: any) => ({
        id: video.id,
        productId: video.product_id,
        productName: video.product_name || 'Ürün',
        productImage: '',
        videoUrl: video.video_url,
        thumbnailUrl: video.thumbnail_url,
        description: video.caption,
        hashtags: [],
        stats: {
            views: video.views || 0,
            likes: video.likes || 0,
            comments: video.comment_count || 0,
            shares: video.share_count || 0,
            sales: 0
        },
        user: {
            id: video.user_id,
            name: fullName,           // ✅ userData.name yerine
            username: email,          // ✅ userData.username yerine
            avatar: avatarUrl,        // ✅ userData.avatar yerine
            isVerified: isVerified    // ✅ userData.isVerified yerine
        },
        createdAt: video.created_at
    })) || [];



    const handleDeleteVideo = (video: any, e: React.MouseEvent) => {
        e.stopPropagation(); // Video tıklamasını engelle
        setVideoToDelete(video);
        setShowDeleteModal(true);
    };

    const confirmDeleteVideo = () => {
        if (!videoToDelete) return;
        deleteReels(videoToDelete.id, {
            onSuccess: () => {
                refetchVideos(); // sadece refetch yeterli
                setShowDeleteModal(false);
                setVideoToDelete(null);
            },
        });
    };



    useEffect(() => {
        if (apiVideos && apiVideos.length > 0) {
            console.log("🔍 İLK VİDEO:", apiVideos[0]);
            console.log("🔍 thumbnail_url:", apiVideos[0].thumbnail_url);
        }
    }, [apiVideos]);

    const handleVideoClick = (video: any) => {
        navigate(`/video/${video.id}`, { state: { video } });
    };

    const toggleSearch = () => {
        setSearchActive(!searchActive);
        if (!searchActive) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    const bottomNavItems = [
        { id: 'home', icon: <FaHome />, label: 'Home', path: '/craftora-shops' },
        { id: 'reels', icon: <FaPlay />, label: 'Reels', path: '/medya' },
        { id: 'craftoraShop', icon: <FaGem />, label: 'CraftoraShop', path: '/medya' },
        { id: 'search', icon: <FaSearch />, label: 'Search', isSearch: true },
        { id: 'competition', icon: <FaTrophy />, label: 'Competition', path: '/competition' },
        { id: 'profile', icon: <FaUser />, label: 'Profile', path: '/profile' },
    ];

    // Renkler - DARK TEMA
    const colors = {
        bg: '#121212',
        surface: '#1e1e1e',
        surface2: '#2a2a2a',
        text: '#eeeeee',
        textSecondary: '#a0a0a0',
        border: '#2a2a2a',
        primary: '#e07c5c',
        primaryDark: '#c96b4d',
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: colors.bg,
            color: colors.text,
            fontFamily: "'Space Grotesk', sans-serif",
            paddingBottom: '80px'
        }}>
            {/* Üst Bar - Medya'daki gibi logo solda, arama iconu yok? Medya'da arama bottomNav'da */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: colors.bg,
                borderBottom: `1px solid ${colors.border}`,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    background: `linear-gradient(135deg, #ffffff, ${colors.primary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    CRAFT<span style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>ORA</span>
                </div>
                <button
                    onClick={() => setIsSettingsOpen(true)}  // BUNU EKLE
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.text,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 8,
                        borderRadius: '50%',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = colors.surface2}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <FaCog size={22} />
                </button>
            </div>

            {/* Arama Modalı */}
            {searchActive && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 250,
                    background: 'rgba(0,0,0,0.95)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: 100
                }}>
                    <div style={{ width: '90%', maxWidth: 600 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            padding: '20px 24px',
                            borderBottom: `1px solid ${colors.border}`,
                            background: colors.surface,
                            borderRadius: 32
                        }}>
                            <FaSearch style={{ color: colors.primary, fontSize: 20 }} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search products, brands, styles..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: 18,
                                    color: colors.text,
                                    outline: 'none'
                                }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button onClick={toggleSearch} style={{
                                background: 'none',
                                border: 'none',
                                color: colors.textSecondary,
                                cursor: 'pointer',
                                fontSize: 20
                            }}>✕</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profil İçeriği - minik boşluklar (12px) */}
            <div style={{ padding: '20px 12px' }}>
                {/* Avatar ve İsim */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    marginBottom: 24
                }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundImage: `url(${avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=${colors.primary.replace('#', '')}&color=fff&size=80`})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: `3px solid ${colors.primary}`
                    }} />
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{fullName}</h2>
                            {isVerified && <MdVerified size={20} color={colors.primary} />}
                        </div>
                        <p style={{ color: colors.textSecondary, margin: '4px 0 8px', fontSize: 14 }}>{email}</p>
                        <p style={{ fontSize: 14, color: colors.textSecondary }}>
                            {userRole === 'seller' ? '👑 Satıcı Hesabı' : '👤 Kullanıcı Hesabı'}
                        </p>
                    </div>
                </div>

                {/* Premium Plan Butonu - KALDIR (backend yok) */}
                {/* Video Ekle Butonu - sadece seller için */}
                {userRole === 'seller' && (
                    <button
                        onClick={() => setIsVideoUploaderOpen(true)}
                        style={{
                            width: 'auto',
                            minWidth: 180,
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            color: 'white',
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: 'pointer',
                            marginBottom: 24
                        }}>
                        <FaPlus size={14} />
                        Yeni Video Ekle
                    </button>
                )}

                {/* VideoUploader */}
                {isVideoUploaderOpen && (
                    <VideoUploader
                        isOpen={isVideoUploaderOpen}
                        onClose={() => setIsVideoUploaderOpen(false)}
                        onSuccess={() => {
                            refetchVideos();
                            setIsVideoUploaderOpen(false);
                        }}
                        colors={colors}
                        userId={userId}
                    />
                )}

                {/* İstatistikler - şimdilik 0 göster */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    gap: 16,
                    padding: '20px 0',
                    borderTop: `1px solid ${colors.border}`,
                    borderBottom: `1px solid ${colors.border}`,
                    marginBottom: 24
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>0</div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Takipçi</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>0</div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Mağaza Ziyaretçisi</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>0</div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Değerlendirme</div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: 32,
                    borderBottom: `1px solid ${colors.border}`,
                    marginBottom: 20
                }}>
                    {['videos', 'liked', 'saved'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '12px 0',
                                fontSize: 15,
                                fontWeight: activeTab === tab ? 600 : 400,
                                color: activeTab === tab ? colors.primary : colors.textSecondary,
                                cursor: 'pointer',
                                borderBottom: activeTab === tab ? `2px solid ${colors.primary}` : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab === 'videos' && 'Videolar'}
                            {tab === 'liked' && 'Beğenilenler'}
                            {tab === 'saved' && 'Kaydedilenler'}
                        </button>
                    ))}
                </div>

                {/* Video Grid - Responsive: telefon 2, tablet 4, bilgisayar 5 */}
                {/* Video Grid - Responsive */}
                <div className="profile-video-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 4,
                    backgroundColor: 'transparent'
                }}>
                    {videos.length === 0 ? (
                        // ✅ Hiç video yoksa gösterilecek alan
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: 60,
                            backgroundColor: colors.surface,
                            borderRadius: 16,
                            margin: '20px 0'
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>📹</div>
                            <div style={{ color: colors.text, marginBottom: 8 }}>Henüz video yok</div>
                            <div style={{ color: colors.textSecondary, fontSize: 13 }}>Yeni video eklemek için + butonuna tıkla</div>
                        </div>
                    ) : (
                        videos.map((video) => (
                            <div
                                key={video.id}
                                onClick={() => handleVideoClick(video)}
                                style={{
                                    position: 'relative',
                                    aspectRatio: '9/16',
                                    backgroundImage: `url(${video.thumbnailUrl || video.videoUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: 'transparent', // ✅ SİYAH YOK!
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    borderRadius: 0  // Köşeleri düz, grid ile uyumlu
                                }}
                            >
                                <button
                                    onClick={(e) => handleDeleteVideo(video, e)}
                                    style={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        width: 28,
                                        height: 28,
                                        borderRadius: 14,
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                        backdropFilter: 'blur(4px)',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 10,
                                        fontSize: 14
                                    }}
                                >
                                    🗑️
                                </button>
                                {/* Video varsa göster, yoksa placeholder */}
                                {!video.thumbnailUrl && !video.videoUrl && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: colors.surface,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FaPlay size={24} color={colors.textSecondary} />
                                    </div>
                                )}

                                {/* İzlenme Sayısı */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: 20,
                                    padding: '4px 8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    zIndex: 2
                                }}>
                                    <FaPlay size={10} color="white" />
                                    <span style={{ fontSize: 11, color: 'white' }}>
                                        {video.stats?.views?.toLocaleString() || 0}
                                    </span>
                                </div>

                                {/* Satış Sayısı */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: 8,
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: 20,
                                    padding: '4px 8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    zIndex: 2
                                }}>
                                    <FaShoppingBag size={10} color={colors.primary} />
                                    <span style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>
                                        {video.stats?.sales || 0}
                                    </span>
                                </div>

                                {/* Ürün Adı */}
                                <div style={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: 20,
                                    padding: '4px 8px',
                                    fontSize: 10,
                                    color: 'white',
                                    maxWidth: 'calc(100% - 60px)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    zIndex: 2
                                }}>
                                    {video.productName}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Responsive Grid Ayarları */}
                <style>{`
          @media (min-width: 600px) {
            .profile-video-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (min-width: 900px) {
            .profile-video-grid {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }
          @media (min-width: 1200px) {
            .profile-video-grid {
              grid-template-columns: repeat(5, 1fr) !important;
            }
          }
          @media (min-width: 1600px) {
            .profile-video-grid {
              grid-template-columns: repeat(6, 1fr) !important;
            }
          }
        `}</style>
            </div>

            {/* ===== ALT NAVIGASYON (Medya ile aynı) ===== */}
            <div className={`${styles.bottomNav}`}>
                <div className={styles.bottomLogo}>
                    CRAFT<span>ORA</span>
                </div>

                <div className={styles.bottomNavItems}>
                    {bottomNavItems.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.bottomNavItem} ${activeNav === item.id ? styles.bottomNavItemActive : ''} ${item.isSearch ? styles.bottomNavSearch : ''}`}
                            onClick={() => {
                                if (item.isSearch) {
                                    navigate('/search');
                                } else if (item.path) {
                                    setActiveNav(item.id);
                                    navigate(item.path);
                                } else {
                                    setActiveNav(item.id);
                                }
                            }}
                        >
                            <span className={styles.bottomNavIcon}>{item.icon}</span>
                            <span className={styles.bottomNavLabel}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            {isSettingsOpen && (
                <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            )}
            {/* Silme Onay Modalı */}
            {showDeleteModal && videoToDelete && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20
                }}>
                    <div style={{
                        backgroundColor: colors.surface,
                        borderRadius: 24,
                        maxWidth: 400,
                        width: '100%',
                        padding: 24
                    }}>
                        <h3 style={{ color: colors.text, margin: '0 0 12px 0' }}>🗑️ Videoyu Sil</h3>
                        <p style={{ color: colors.textSecondary, marginBottom: 24 }}>
                            "<strong>{videoToDelete.productName}</strong>" videosunu silmek istediğinize emin misiniz?
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: 'transparent',
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 30,
                                    color: colors.text,
                                    cursor: 'pointer'
                                }}
                            >
                                İptal
                            </button>
                            <button
                                onClick={confirmDeleteVideo}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#ef4444',
                                    border: 'none',
                                    borderRadius: 30,
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Evet, Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Profile;