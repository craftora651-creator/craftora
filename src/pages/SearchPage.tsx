// pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaTimes, FaHistory, FaFire, FaHome, FaPlay, FaGem, FaTrophy, FaUser } from 'react-icons/fa';
import styles from '../css/Medya.module.css';

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([
        'silk dress', 'evening gown', 'macbook pro', 'iphone 15', 'sony headphones'
    ]);
    const [trendingSearches] = useState([
        { term: 'Emerald Silk Dress', count: '12.5K', icon: '👗' },
        { term: 'MacBook Pro M3', count: '8.2K', icon: '💻' },
        { term: 'iPhone 15 Pro', count: '15.3K', icon: '📱' },
        { term: 'Sony WH-1000XM5', count: '5.1K', icon: '🎧' },
        { term: 'iPad Air', count: '4.8K', icon: '📱' },
    ]);
    const [isDarkMode] = useState(true);

    const allProducts = [
        { id: 1, name: 'Emerald Silk Gala Dress', category: 'Giyim', price: 249, image: '👗', store: 'CraftoraShop' },
        { id: 2, name: 'MacBook Pro M3', category: 'Elektronik', price: 1299, image: '💻', store: 'TechStore' },
        { id: 3, name: 'iPhone 15 Pro', category: 'Telefon', price: 1199, image: '📱', store: 'AppleStore' },
        { id: 4, name: 'Sony WH-1000XM5', category: 'Kulaklık', price: 299, image: '🎧', store: 'SonyStore' },
        { id: 5, name: 'iPad Air 5', category: 'Tablet', price: 599, image: '📱', store: 'AppleStore' },
    ];

    // Enter tuşuna basınca veya input değişince anlık arama (opsiyonel)
    useEffect(() => {
        if (searchQuery.length > 0) {
            const timer = setTimeout(() => {
                performSearch(searchQuery);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const performSearch = async (query: string) => {
        if (!query.trim()) return;
        
        setIsLoading(true);
        
        // 1 saniye bekle (loading efekti için)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const results = allProducts.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setIsLoading(false);
        
        // Son aramalara ekle
        if (query.trim() && !recentSearches.includes(query)) {
            setRecentSearches([query, ...recentSearches.slice(0, 4)]);
        }
    };

    const handleSearchButtonClick = () => {
        if (searchQuery.trim()) {
            performSearch(searchQuery);
            setSearchParams({ q: searchQuery });
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            performSearch(searchQuery);
            setSearchParams({ q: searchQuery });
        }
    };

    const handleRecentClick = (term: string) => {
        setSearchQuery(term);
        performSearch(term);
        setSearchParams({ q: term });
    };

    const handleTrendingClick = (term: string) => {
        setSearchQuery(term);
        performSearch(term);
        setSearchParams({ q: term });
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSearchParams({});
    };

    const colors = {
        bg: '#121212',
        surface: '#1e1e1e',
        surface2: '#2a2a2a',
        text: '#eeeeee',
        textSecondary: '#a0a0a0',
        border: '#2a2a2a',
        primary: '#e07c5c',
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: colors.bg,
            color: colors.text,
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            paddingBottom: '80px'
        }}>
            {/* Loading Overlay */}
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        border: `3px solid ${colors.surface2}`,
                        borderTop: `3px solid ${colors.primary}`,
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}

            {/* Header */}
            <div style={{
                position: 'sticky',
                top: 0,
                backgroundColor: colors.bg,
                borderBottom: `1px solid ${colors.border}`,
                padding: '12px 16px',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: colors.text,
                            cursor: 'pointer',
                            padding: 8,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <FaArrowLeft size={20} />
                    </button>

                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: colors.surface2,
                        borderRadius: 30,
                        padding: '4px 4px 4px 16px',
                        border: `1px solid ${searchQuery ? colors.primary : 'transparent'}`
                    }}>
                        <FaSearch style={{ color: colors.textSecondary, fontSize: 18 }} />
                        <input
                            autoFocus
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ürün, marka veya mağaza ara..."
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                padding: '12px 0',
                                color: colors.text,
                                fontSize: 16,
                                outline: 'none'
                            }}
                        />
                        {searchQuery && (
                            <button onClick={clearSearch} style={{ background: 'none', border: 'none', color: colors.textSecondary, cursor: 'pointer', padding: 8 }}>
                                <FaTimes size={16} />
                            </button>
                        )}
                        {/* ARA BUTONU */}
                        <button
                            onClick={handleSearchButtonClick}
                            disabled={!searchQuery.trim()}
                            style={{
                                background: searchQuery.trim() ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` : colors.surface,
                                border: 'none',
                                borderRadius: 30,
                                padding: '8px 20px',
                                color: searchQuery.trim() ? 'white' : colors.textSecondary,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: searchQuery.trim() ? 'pointer' : 'not-allowed',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Ara
                        </button>
                    </div>
                </div>
            </div>

            {/* İçerik */}
            <div style={{ padding: '16px' }}>
                {searchQuery.length === 0 && !isLoading && searchResults.length === 0 ? (
                    <>
                        {recentSearches.length > 0 && (
                            <div style={{ marginBottom: 32 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>Son Aramalar</span>
                                    <button onClick={() => setRecentSearches([])} style={{ background: 'none', border: 'none', color: colors.textSecondary, fontSize: 12, cursor: 'pointer' }}>Temizle</button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                    {recentSearches.map((term, i) => (
                                        <div key={i} onClick={() => handleRecentClick(term)} style={{ background: colors.surface2, padding: '8px 16px', borderRadius: 30, cursor: 'pointer' }}>
                                            <span style={{ fontSize: 13, color: colors.text }}>{term}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <FaFire style={{ color: colors.primary }} />
                                <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>Popüler Aramalar</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {trendingSearches.map((item, i) => (
                                    <div key={i} onClick={() => handleTrendingClick(item.term)} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: colors.surface, borderRadius: 16, cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontSize: 18 }}>{item.icon}</span>
                                            <div>
                                                <div style={{ fontSize: 14, color: colors.text }}>{item.term}</div>
                                                <div style={{ fontSize: 11, color: colors.textSecondary }}>{item.count} arama</div>
                                            </div>
                                        </div>
                                        <FaFire style={{ color: colors.primary }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    !isLoading && (
                        <>
                            <div style={{ marginBottom: 16 }}>
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>{searchResults.length} sonuç bulundu</span>
                            </div>
                            {searchResults.length > 0 ? (
                                searchResults.map(product => (
                                    <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 12, background: colors.surface, borderRadius: 16, marginBottom: 12, cursor: 'pointer' }}>
                                        <div style={{ width: 60, height: 60, background: `${colors.primary}20`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{product.image}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{product.name}</div>
                                            <div style={{ fontSize: 12, color: colors.textSecondary }}>{product.store}</div>
                                        </div>
                                        <div style={{ fontSize: 18, fontWeight: 700, color: colors.primary }}>${product.price}</div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: 40, color: colors.textSecondary }}>
                                    <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                                    <div>"{searchQuery}" için sonuç bulunamadı</div>
                                </div>
                            )}
                        </>
                    )
                )}
            </div>

            {/* BottomNav */}
            <div className={`${styles.bottomNav}`}>
                <div className={styles.bottomLogo}>CRAFT<span style={{ color: colors.primary }}>ORA</span></div>
                <div className={styles.bottomNavItems}>
                    <div className={styles.bottomNavItem} onClick={() => navigate('/craftora-shops')}><span className={styles.bottomNavIcon}><FaHome /></span><span className={styles.bottomNavLabel}>Home</span></div>
                    <div className={styles.bottomNavItem} onClick={() => navigate('/medya')}><span className={styles.bottomNavIcon}><FaPlay /></span><span className={styles.bottomNavLabel}>Reels</span></div>
                    <div className={styles.bottomNavItem} onClick={() => navigate('/medya')}><span className={styles.bottomNavIcon}><FaGem /></span><span className={styles.bottomNavLabel}>CraftoraShop</span></div>
                    <div className={`${styles.bottomNavItem} ${styles.bottomNavItemActive}`}><span className={styles.bottomNavIcon}><FaSearch /></span><span className={styles.bottomNavLabel}>Search</span></div>
                    <div className={styles.bottomNavItem} onClick={() => navigate('/competition')}><span className={styles.bottomNavIcon}><FaTrophy /></span><span className={styles.bottomNavLabel}>Competition</span></div>
                    <div className={styles.bottomNavItem} onClick={() => navigate('/profile')}><span className={styles.bottomNavIcon}><FaUser /></span><span className={styles.bottomNavLabel}>Profile</span></div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;