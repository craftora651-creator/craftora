// Profile.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaCog,
    FaPlus,
    FaPlay,
    FaEye,
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


const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('videos');
    const [activeNav, setActiveNav] = useState('profile');
    const [searchActive, setSearchActive] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const toggleSearch = () => {
        setSearchActive(!searchActive);
        if (!searchActive) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    const userData = {
        name: 'Emma Watson',
        username: '@emmawatson',
        bio: 'Fashion lover | Content Creator | Craftora Ambassador ✨',
        avatar: 'https://images.unsplash.com/photo-1494790108777-466d5eb9166c?w=150&h=150&fit=crop',
        followers: '12.5K',
        shopVisitors: '8.2K',
        reviews: '156',
        isVerified: true,
        isPremium: true
    };

    const videos = [
        { id: 1, thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&h=400&fit=crop', views: '12.5K', sales: 42 },
        { id: 2, thumbnail: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=300&h=400&fit=crop', views: '8.2K', sales: 28 },
        { id: 3, thumbnail: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=300&h=400&fit=crop', views: '15.3K', sales: 67 },
        { id: 4, thumbnail: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=300&h=400&fit=crop', views: '5.1K', sales: 19 },
        { id: 5, thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&h=400&fit=crop', views: '22.4K', sales: 103 },
        { id: 6, thumbnail: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=300&h=400&fit=crop', views: '9.8K', sales: 34 },
        { id: 7, thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&h=400&fit=crop', views: '7.2K', sales: 51 },
        { id: 8, thumbnail: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=300&h=400&fit=crop', views: '11.5K', sales: 78 },
        { id: 9, thumbnail: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=300&h=400&fit=crop', views: '6.8K', sales: 23 },
    ];

    // Alt navigasyon itemları (Medya ile aynı)
    // Profile.tsx - Aynı sıralama
    const bottomNavItems = [
        { id: 'home', icon: <FaHome />, label: 'Home', path: '/medya' },
        { id: 'reels', icon: <FaPlay />, label: 'Reels', path: '/medya' },
        { id: 'craftoraShop', icon: <FaGem />, label: 'CraftoraShop', path: '/medya' },
        { id: 'search', icon: <FaSearch />, label: 'Search', isSearch: true },
        { id: 'competition', icon: <FaTrophy />, label: 'Competition', path: '/medya' },
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
                        backgroundImage: `url(${userData.avatar})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: `3px solid ${colors.primary}`
                    }} />
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{userData.name}</h2>
                            {userData.isVerified && <MdVerified size={20} color={colors.primary} />}
                        </div>
                        <p style={{ color: colors.textSecondary, margin: '4px 0 8px', fontSize: 14 }}>{userData.username}</p>
                        <p style={{ fontSize: 14, color: colors.textSecondary }}>{userData.bio}</p>
                    </div>
                </div>

                {/* Premium Plan Butonu */}
                {!userData.isPremium && (
                    <div style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                        borderRadius: 16,
                        padding: '12px 20px',
                        marginBottom: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <div style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>✨ Premium Plan</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Video ekleme ve daha fazlası</div>
                        </div>
                        <button style={{
                            background: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: 30,
                            fontWeight: 600,
                            fontSize: 13,
                            color: colors.primary,
                            cursor: 'pointer'
                        }}>
                            Yükselt
                        </button>
                    </div>
                )}

                {/* Premium kullanıcı için Video Ekle Butonu - küçültüldü */}
                {userData.isPremium && (
                    <button style={{
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

                {/* İstatistikler */}
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
                        <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>{userData.followers}</div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Takipçi</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>{userData.shopVisitors}</div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Mağaza Ziyaretçisi</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>{userData.reviews}</div>
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
                <div className="profile-video-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 4,
                    backgroundColor: colors.border
                }}>
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            style={{
                                position: 'relative',
                                aspectRatio: '9/16',
                                backgroundImage: `url(${video.thumbnail})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                cursor: 'pointer'
                            }}
                        >
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
                                gap: 6
                            }}>
                                <FaPlay size={10} color="white" />
                                <span style={{ fontSize: 11, color: 'white' }}>{video.views}</span>
                            </div>
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
                                gap: 4
                            }}>
                                <FaShoppingBag size={10} color={colors.primary} />
                                <span style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>{video.sales}</span>
                            </div>
                        </div>
                    ))}
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
                                    toggleSearch();
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
        </div>
        
    );
};

export default Profile;