// pages/CraftoraShops.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaPlay, FaGem, FaSearch, FaTrophy, FaUser } from 'react-icons/fa';
import styles from '../css/Medya.module.css'; // Medya'nın CSS'ini kullan

import Header from '../app/Header';
import Hero from '../app/Hero';
import Featured from '../app/Featured'
import Deal from '../app/Deal'
import Winners from '../app/Winners';
import Testimonials from '../app/Testimonials'
import Footer from '../app/Footer';

const CraftoraShops: React.FC = () => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [activeNav, setActiveNav] = useState('home'); // home aktif
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleSearch = () => {
        setSearchActive(!searchActive);
        if (!searchActive) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    };

    // Alt navigasyon itemları (Medya ile aynı)
    const bottomNavItems = [
        { id: 'home', icon: <FaHome />, label: 'Home', path: '/craftora-shops' },
        { id: 'reels', icon: <FaPlay />, label: 'Reels', path: '/medya' },
        { id: 'craftoraShop', icon: <FaGem />, label: 'CraftoraShop', path: '/medya' },
        { id: 'search', icon: <FaSearch />, label: 'Search', isSearch: true },
        { id: 'competition', icon: <FaTrophy />, label: 'Competition', path: '/competition' },
        { id: 'profile', icon: <FaUser />, label: 'Profile', path: '/profile' },
    ];

    const colors = isDarkMode ? {
        bg: '#121212',
        surface: '#1e1e1e',
        surface2: '#2a2a2a',
        text: '#eeeeee',
        textSecondary: '#a0a0a0',
        border: '#2a2a2a',
        primary: '#e07c5c',
        primaryDark: '#c96b4d',
        primaryLight: '#f5a07c',
    } : {
        bg: '#ffffff',
        surface: '#f5f5f5',
        surface2: '#e8e8e8',
        text: '#1a1a1a',
        textSecondary: '#666666',
        border: '#dddddd',
        primary: '#e07c5c',
        primaryDark: '#c96b4d',
        primaryLight: '#f5a07c',
    };

    return (
        <div style={{
            backgroundColor: colors.bg,
            color: colors.text,
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            minHeight: '100vh',
            overflowX: 'hidden',
            paddingBottom: '80px' // Sidebar için alt boşluk
        }}>
            <Header colors={colors} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
            <Hero colors={colors} isDarkMode={isDarkMode} />
            <Featured colors={colors} isDarkMode={isDarkMode} />
            <Deal colors={colors} isDarkMode={isDarkMode} />
            <Winners colors={colors} isDarkMode={isDarkMode} />
            <Testimonials colors={colors} isDarkMode={isDarkMode} />
            <Footer colors={colors} isDarkMode={isDarkMode} />

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
        </div>
    );
};

export default CraftoraShops;