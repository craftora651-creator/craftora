// Medya.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    FaHeart,
    FaShare,
    FaPlay,
    FaHome,
    FaCompass,
    FaCog,
    FaUser,
    FaRegHeart,
    FaStar,
    FaRegStar,
    FaMusic,
    FaShoppingBag,
    FaBookmark,
    FaRegBookmark,
    FaSearch,
    FaGem,
    FaTrophy,
    FaChevronRight,
} from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import styles from '../css/Medya.module.css';

// Video verileri - TikTok tarzı dikey kaydırma için
const videoData = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=687&auto=format&fit=crop',
        title: 'Emerald Silk Gala Dress',
        desc: 'Handcrafted from premium mulberry silk. Featuring a backless design and a fluid silhouette.',
        price: 249,
        originalPrice: 580,
        audio: 'Original Audio - Premium Boutique',
        likes: '2.5K',
        followers: '12.5K',
    },
    {
        id: 2,
        image: 'https://images.wallpaperscraft.com/image/single/code_programming_monitor_209719_938x1668.jpg',
        title: 'Ruby Red Velvet Gown',
        desc: 'Luxurious velvet fabric with a dramatic train. Perfect for red carpet events.',
        price: 399,
        originalPrice: 890,
        audio: 'Velvet Dreams - Fashion Edit',
        likes: '3.2K',
        followers: '8.7K',
    },
    {
        id: 3,
        image: 'https://i.pinimg.com/originals/5c/6a/e2/5c6ae27f61bfe6716568bf86aea46b8f.jpg',
        title: 'Sapphire Blue Cocktail',
        desc: 'Stunning sapphire blue dress with intricate beadwork. Ideal for parties and events.',
        price: 299,
        originalPrice: 650,
        audio: 'Blue Magic - Runway Mix',
        likes: '4.1K',
        followers: '15.2K',
    },
];

const Medya: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [likedStates, setLikedStates] = useState<boolean[]>(new Array(videoData.length).fill(false));
    const [savedStates, setSavedStates] = useState<boolean[]>(new Array(videoData.length).fill(false));
    const [followingStates, setFollowingStates] = useState<boolean[]>(new Array(videoData.length).fill(false));
    const [activeNav, setActiveNav] = useState('home');
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Mouse wheel ile kaydırma
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                // Aşağı kaydırma - sonraki video
                if (currentVideoIndex < videoData.length - 1) {
                    setCurrentVideoIndex(currentVideoIndex + 1);
                }
            } else if (e.deltaY < 0) {
                // Yukarı kaydırma - önceki video
                if (currentVideoIndex > 0) {
                    setCurrentVideoIndex(currentVideoIndex - 1);
                }
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [currentVideoIndex, videoData.length]);

    // Touch ile kaydırma (mobil için)
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const diff = touchStart - touchEnd;
        if (diff > 50) {
            // Yukarı kaydırma - sonraki video
            if (currentVideoIndex < videoData.length - 1) {
                setCurrentVideoIndex(currentVideoIndex + 1);
            }
        }
        if (diff < -50) {
            // Aşağı kaydırma - önceki video
            if (currentVideoIndex > 0) {
                setCurrentVideoIndex(currentVideoIndex - 1);
            }
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleSearch = () => {
        setSearchActive(!searchActive);
        if (!searchActive) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    const handleLike = (index: number) => {
        const newLiked = [...likedStates];
        newLiked[index] = !newLiked[index];
        setLikedStates(newLiked);
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

    const currentVideo = videoData[currentVideoIndex];
    const isLiked = likedStates[currentVideoIndex];
    const isSaved = savedStates[currentVideoIndex];
    const isFollowing = followingStates[currentVideoIndex];

    // Alt navigasyon itemları
    const bottomNavItems = [
        { id: 'home', icon: <FaHome />, label: 'Home' },
        { id: 'reels', icon: <FaPlay />, label: 'Reels' },
        { id: 'competition', icon: <FaTrophy />, label: 'Competition' },
        { id: 'craftoraShop', icon: <FaGem />, label: 'CraftoraShop' },
        { id: 'profile', icon: <FaUser />, label: 'Profile' },
        { id: 'settings', icon: <FaCog />, label: 'Settings' },
    ];

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.containerDark : styles.containerLight}`}>
            
            {/* ===== ARAMA ICONU VE DARK MODE ===== */}
            <div className={styles.topActions}>
                <button 
                    className={`${styles.searchBtn} ${searchActive ? styles.searchBtnActive : ''}`}
                    onClick={toggleSearch}
                >
                    <FaSearch />
                </button>
                <button 
                    className={styles.darkModeBtn}
                    onClick={toggleDarkMode}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>

            {/* ===== ARAMA MODALI ===== */}
            {searchActive && (
                <div className={`${styles.searchModal} ${isDarkMode ? styles.searchModalDark : styles.searchModalLight}`}>
                    <div className={styles.searchModalContent}>
                        <div className={styles.searchModalHeader}>
                            <FaSearch className={styles.searchModalIcon} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search products, brands, styles..."
                                className={styles.searchModalInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className={styles.searchModalClose} onClick={toggleSearch}>✕</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== TIKTOK TARZI VİDEO KAYDIRMA ALANI ===== */}
            <div 
                className={styles.videoContainer}
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {videoData.map((video, index) => (
                    <div 
                        key={video.id}
                        className={`${styles.videoSlide} ${index === currentVideoIndex ? styles.videoSlideActive : ''}`}
                        style={{
                            transform: `translateY(${(index - currentVideoIndex) * 100}%)`,
                        }}
                    >
                        {/* Video Arkaplan */}
                        <div 
                            className={styles.videoBackground}
                            style={{
                                backgroundImage: `url(${video.image})`,
                            }}
                        >
                            <div className={`${styles.videoOverlay} ${isDarkMode ? styles.videoOverlayDark : styles.videoOverlayLight}`} />
                        </div>

                        {/* Sol Alt - Ürün Bilgisi */}
                        <div className={styles.productInfo}>
                            <div className={styles.productBadge}>
                                <span className={styles.hotBadge}>🔥 HOT PICK</span>
                            </div>
                            <h2 className={styles.productTitle}>{video.title}</h2>
                            <p className={styles.productDesc}>{video.desc}</p>

                            <div className={styles.priceContainer}>
                                <span className={styles.currentPrice}>${video.price}.00</span>
                                <span className={styles.originalPrice}>${video.originalPrice}.00</span>
                                <span className={styles.discountBadge}>-{Math.round((1 - video.price/video.originalPrice) * 100)}%</span>
                            </div>

                            <div className={styles.audioInfo}>
                                <span className={styles.audioIcon}>
                                    <FaMusic />
                                </span>
                                <span>{video.audio}</span>
                                <MdVerified style={{ color: 'var(--color-primary)', marginLeft: '4px' }} />
                            </div>
                        </div>

                        {/* Sağ Aksiyon Butonları */}
                        <div className={styles.actionBar}>
                            <div className={styles.actionItem} onClick={() => handleFollow(currentVideoIndex)}>
                                <div className={styles.actionCircle}>
                                    <FaUser />
                                </div>
                                <span className={styles.actionCount}>{video.followers}</span>
                                <span className={styles.actionLabel}>{isFollowing ? 'Following' : 'Follow'}</span>
                            </div>

                            <div className={styles.actionItem} onClick={() => handleLike(currentVideoIndex)}>
                                <div className={`${styles.actionCircle} ${isLiked ? styles.actionCircleLiked : ''}`}>
                                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                                </div>
                                <span className={styles.actionCount}>{video.likes}</span>
                                <span className={styles.actionLabel}>Like</span>
                            </div>

                            <div className={styles.actionItem} onClick={() => handleSave(currentVideoIndex)}>
                                <div className={styles.actionCircle}>
                                    {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                                </div>
                                <span className={styles.actionLabel}>Save</span>
                            </div>

                            <div className={styles.actionItem}>
                                <div className={styles.actionCircle}>
                                    <FaShare />
                                </div>
                                <span className={styles.actionLabel}>Share</span>
                            </div>

                            <div className={styles.actionItem}>
                                <div className={styles.actionCircle}>
                                    <BsThreeDots />
                                </div>
                                <span className={styles.actionLabel}>More</span>
                            </div>
                        </div>

                        {/* Alt Butonlar - Buy Now + Ürüne Git (Sidebar'ın üstünde) */}
                        <div className={styles.bottomButtons}>
                            <div className={styles.buySection}>
                                <button className={styles.buyNowBtn}>
                                    <FaShoppingBag />
                                    BUY NOW
                                </button>
                                <button className={styles.goToProductBtn}>
                                    Ürüne Git
                                    <FaChevronRight />
                                </button>
                            </div>
                            <button className={styles.shareBtn}>
                                <FaShare />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== ALT NAVIGASYON + CRAFTORA LOGOSU ===== */}
            <div className={`${styles.bottomNav} ${isDarkMode ? styles.bottomNavDark : styles.bottomNavLight}`}>
                <div className={styles.bottomLogo}>
                    CRAFT<span>ORA</span>
                </div>
                
                <div className={styles.bottomNavItems}>
                    {bottomNavItems.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.bottomNavItem} ${activeNav === item.id ? styles.bottomNavItemActive : ''}`}
                            onClick={() => setActiveNav(item.id)}
                        >
                            <span className={styles.bottomNavIcon}>{item.icon}</span>
                            <span className={styles.bottomNavLabel}>{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.bottomNavPlaceholder}></div>
            </div>
        </div>
    );
};

export default Medya;