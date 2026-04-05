// components/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    colors: {
        primary: string;
        primaryDark: string;
        primaryLight: string;
        bg: string;
        surface: string;
        surface2: string;
        text: string;
        textSecondary: string;
        border: string;
    };
    isDarkMode?: boolean;
    onToggleDarkMode?: () => void;
}

const Header: React.FC<HeaderProps> = ({ colors, isDarkMode, onToggleDarkMode }) => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [cartCount] = useState(4);
    const [favCount] = useState(12);

    const menuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Ekran boyutu değişimini dinle
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserEmail(user.email || 'Kullanıcı');
                setIsLoggedIn(true);
            } catch (e) {
                console.error('User parse error:', e);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserEmail('');
        setIsUserMenuOpen(false);
        navigate('/');
    };

    // Logo rengi - light modda siyah, dark modda beyaz
    const logoTypographyColor = isDarkMode ? '#ffffff' : '#1a1a1a';
    const logoTypographyGradient = `linear-gradient(145deg, ${logoTypographyColor}, ${colors.primaryLight})`;

    return (
        <>
            {/* TOP BAR - SADECE DESKTOP */}
            <div style={{
                background: isScrolled ? colors.surface : colors.bg,
                borderBottom: `1px solid ${colors.border}`,
                padding: '10px 0',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 100,
                display: isMobile ? 'none' : 'block'
            }}>
                <div style={{
                    maxWidth: 1400,
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <a href="#" style={{ color: colors.textSecondary, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span>📍</span> Mağazalarımız
                        </a>
                        <a href="#" style={{ color: colors.textSecondary, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span>📦</span> Kargo Takibi
                        </a>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <span style={{ background: `rgba(224, 124, 92, 0.1)`, color: colors.primary, padding: '4px 12px', borderRadius: 30, fontSize: 11, fontWeight: 600 }}>
                            30 GÜN İADE
                        </span>
                        <span style={{ background: `rgba(224, 124, 92, 0.1)`, color: colors.primary, padding: '4px 12px', borderRadius: 30, fontSize: 11, fontWeight: 600 }}>
                            ÜCRETSİZ KARGO
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <button style={{ background: 'none', border: 'none', color: colors.textSecondary, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span>🌐</span> TR
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN HEADER */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 99,
                background: isScrolled ? colors.surface : colors.bg,
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${colors.border}`,
                padding: '15px 0',
                transition: 'all 0.3s ease'
            }}>
                <div style={{
                    maxWidth: 1400,
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    flexWrap: 'wrap'
                }}>
                    {/* LOGO - SOLDAAA */}
                    {/* LOGO - SOLDAAA */}
<div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
    <div style={{
        width: 45,
        height: 45,
        background: `linear-gradient(145deg, ${colors.primary}, ${colors.primaryDark})`,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 10px 25px rgba(224, 124, 92, 0.3)`
    }}>
        <span style={{ fontSize: 24, color: 'white' }}>✨</span>
    </div>
    
    {/* CRAFTORA YAZISI - Gradient'i kaldır, düz renk kullan */}
    <span style={{
        fontSize: 24,
        fontWeight: 800,
        color: isDarkMode ? '#ffffff' : '#1a1a1a',  // SADECE DÜZ RENK
        letterSpacing: '-0.5px'
    }}>
        CRAFT<span style={{ color: colors.primary }}>ORA</span>
    </span>
</div>

                    {/* SEARCH BAR - DESKTOP */}
                    <div style={{
                        flex: 1,
                        maxWidth: 500,
                        position: 'relative',
                        display: isMobile ? 'none' : 'block'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: colors.surface2,
                            border: `1px solid ${isSearchFocused ? colors.primary : colors.border}`,
                            borderRadius: 60,
                            padding: '4px',
                            transition: 'all 0.3s ease'
                        }}>
                            <input
                                type="text"
                                placeholder="Ürün, marka veya kategori ara..."
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '12px 20px',
                                    color: colors.text,
                                    fontSize: 14,
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <button style={{
                                background: `linear-gradient(145deg, ${colors.primary}, ${colors.primaryDark})`,
                                border: 'none',
                                borderRadius: 50,
                                padding: '8px 22px',
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}>
                                <span>🔍</span>
                            </button>
                        </div>
                    </div>

                    {/* SAĞ TARAF - Hamburger + USER ACTIONS (mobilde hamburger sağda) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        {/* USER ACTIONS - DESKTOP */}
                        {!isMobile && (
                            <>
                                <div style={{ position: 'relative', cursor: 'pointer' }}>
                                    <span style={{ fontSize: 24, color: colors.textSecondary }}>❤️</span>
                                    {favCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -8,
                                            background: colors.primary,
                                            color: 'white',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>{favCount}</span>
                                    )}
                                </div>

                                <div style={{ position: 'relative', cursor: 'pointer' }}>
                                    <span style={{ fontSize: 24, color: colors.textSecondary }}>🛒</span>
                                    {cartCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -8,
                                            background: colors.primary,
                                            color: 'white',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>{cartCount}</span>
                                    )}
                                </div>

                                {/* DARK MODE BUTTON */}
                                <div
                                    onClick={onToggleDarkMode}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        background: colors.surface2,
                                        border: `1px solid ${colors.border}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = colors.primary}
                                    onMouseLeave={(e) => e.currentTarget.style.background = colors.surface2}
                                >
                                    <span style={{ fontSize: 20 }}>
                                        {isDarkMode ? '☀️' : '🌙'}
                                    </span>
                                </div>

                                {/* Kullanıcı Menüsü */}
                                <div ref={menuRef} style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '8px 12px',
                                            borderRadius: 40,
                                            transition: 'all 0.3s ease',
                                            color: colors.textSecondary
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = colors.surface2}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span style={{ fontSize: 22 }}>👤</span>
                                        <span style={{ fontSize: 14 }}>Hesabım</span>
                                        <span style={{ fontSize: 14 }}>▼</span>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: 10,
                                            width: 280,
                                            background: colors.surface,
                                            border: `1px solid ${colors.border}`,
                                            borderRadius: 20,
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                            overflow: 'hidden',
                                            zIndex: 200
                                        }}>
                                            {isLoggedIn ? (
                                                <>
                                                    <div style={{
                                                        padding: 20,
                                                        borderBottom: `1px solid ${colors.border}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 12
                                                    }}>
                                                        <div style={{
                                                            width: 50,
                                                            height: 50,
                                                            background: colors.primary,
                                                            borderRadius: 25,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: 20,
                                                            color: 'white'
                                                        }}>
                                                            {userEmail.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: colors.text }}>{userEmail}</div>
                                                            <div style={{ fontSize: 12, color: colors.textSecondary }}>Üye</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ padding: '10px 0' }}>
                                                        <MenuItem onClick={() => navigate('/shop')} icon="🛍️" label="Craftora Shop" colors={colors} />
                                                        <MenuItem onClick={() => navigate('/admin')} icon="🏪" label="Mağazam" colors={colors} />
                                                        <MenuItem onClick={() => navigate('/favorites')} icon="❤️" label="Favorilerim" colors={colors} />
                                                        <MenuItem onClick={() => navigate('/orders')} icon="📦" label="Siparişlerim" colors={colors} />
                                                        <div style={{ height: 1, background: colors.border, margin: '10px 0' }} />
                                                        <MenuItem onClick={() => navigate('/settings')} icon="⚙️" label="Ayarlar" colors={colors} />
                                                        <MenuItem onClick={handleLogout} icon="🚪" label="Çıkış Yap" colors={colors} isLogout />
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ padding: '20px' }}>
                                                    <button
                                                        onClick={() => navigate('/login')}
                                                        style={{
                                                            width: '100%',
                                                            padding: '14px',
                                                            background: `linear-gradient(145deg, ${colors.primary}, ${colors.primaryDark})`,
                                                            border: 'none',
                                                            borderRadius: 40,
                                                            color: 'white',
                                                            fontWeight: 600,
                                                            fontSize: 14,
                                                            cursor: 'pointer',
                                                            marginBottom: 12
                                                        }}
                                                    >
                                                        Giriş Yap
                                                    </button>
                                                    <button
                                                        onClick={() => navigate('/register')}
                                                        style={{
                                                            width: '100%',
                                                            padding: '14px',
                                                            background: 'transparent',
                                                            border: `1px solid ${colors.border}`,
                                                            borderRadius: 40,
                                                            color: colors.text,
                                                            fontWeight: 600,
                                                            fontSize: 14,
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Kayıt Ol
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* HAMBURGER MENU BUTONU - SADECE MOBİL, SAĞDA */}
                        {isMobile && (
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                style={{
                                    display: 'flex',
                                    background: colors.surface2,
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: 12,
                                    width: 44,
                                    height: 44,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontSize: 24, color: colors.text }}>☰</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* MOBİL MENÜ (SIDEBAR) - SAĞDAN AÇILAN */}
            {isMobileMenuOpen && (
                <>
                    <div
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 1000
                        }}
                    />
                    <div
                        ref={mobileMenuRef}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '85%',
                            maxWidth: 320,
                            background: colors.surface,
                            zIndex: 1001,
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 20,
                            boxShadow: '-4px 0 30px rgba(0,0,0,0.3)',
                            overflowY: 'auto',
                            animation: 'slideInRight 0.3s ease'
                        }}
                    >
                        <style>{`
                            @keyframes slideInRight {
                                from { transform: translateX(100%); }
                                to { transform: translateX(0); }
                            }
                        `}</style>

                        {/* Mobil Menü Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>Menü</div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{
                                    background: colors.surface2,
                                    border: 'none',
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    fontSize: 18,
                                    cursor: 'pointer',
                                    color: colors.text
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Mobil Arama */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: colors.surface2,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 40,
                            padding: '8px 16px'
                        }}>
                            <span style={{ fontSize: 18, color: colors.textSecondary }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Ara..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '10px 12px',
                                    color: colors.text,
                                    fontSize: 14,
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Mobil Action Butonları */}
                        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
                            <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                                <span style={{ fontSize: 24, color: colors.textSecondary }}>❤️</span>
                                <div style={{ fontSize: 11, color: colors.textSecondary }}>Favori</div>
                            </div>
                            <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                                <span style={{ fontSize: 24, color: colors.textSecondary }}>🛒</span>
                                <div style={{ fontSize: 11, color: colors.textSecondary }}>Sepet</div>
                            </div>
                            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={onToggleDarkMode}>
                                <span style={{ fontSize: 24, color: colors.textSecondary }}>{isDarkMode ? '☀️' : '🌙'}</span>
                                <div style={{ fontSize: 11, color: colors.textSecondary }}>Tema</div>
                            </div>
                        </div>

                        {/* Mobil Kullanıcı Bilgisi */}
                        {isLoggedIn ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: colors.surface2, borderRadius: 16 }}>
                                    <div style={{
                                        width: 45,
                                        height: 45,
                                        background: colors.primary,
                                        borderRadius: 22,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 18,
                                        color: 'white'
                                    }}>
                                        {userEmail.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: colors.text }}>{userEmail}</div>
                                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Hesabım</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <MobileMenuItem onClick={() => { navigate('/shop'); setIsMobileMenuOpen(false); }} icon="🛍️" label="Craftora Shop" colors={colors} />
                                    <MobileMenuItem onClick={() => { navigate('/admin'); setIsMobileMenuOpen(false); }} icon="🏪" label="Mağazam" colors={colors} />
                                    <MobileMenuItem onClick={() => { navigate('/favorites'); setIsMobileMenuOpen(false); }} icon="❤️" label="Favorilerim" colors={colors} />
                                    <MobileMenuItem onClick={() => { navigate('/orders'); setIsMobileMenuOpen(false); }} icon="📦" label="Siparişlerim" colors={colors} />
                                    <MobileMenuItem onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }} icon="⚙️" label="Ayarlar" colors={colors} />
                                    <MobileMenuItem onClick={handleLogout} icon="🚪" label="Çıkış Yap" colors={colors} isLogout />
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <button
                                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                                    style={{
                                        padding: '14px',
                                        background: `linear-gradient(145deg, ${colors.primary}, ${colors.primaryDark})`,
                                        border: 'none',
                                        borderRadius: 40,
                                        color: 'white',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Giriş Yap
                                </button>
                                <button
                                    onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                                    style={{
                                        padding: '14px',
                                        background: 'transparent',
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: 40,
                                        color: colors.text,
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Kayıt Ol
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

const MenuItem: React.FC<{
    onClick: () => void;
    icon: string;
    label: string;
    colors: any;
    isLogout?: boolean;
}> = ({ onClick, icon, label, colors, isLogout }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: isLogout ? '#ff6b6b' : colors.text,
            backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surface2}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
    </div>
);

const MobileMenuItem: React.FC<{
    onClick: () => void;
    icon: string;
    label: string;
    colors: any;
    isLogout?: boolean;
}> = ({ onClick, icon, label, colors, isLogout }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: isLogout ? '#ff6b6b' : colors.text,
            backgroundColor: 'transparent',
            borderRadius: 12
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surface2}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 15, fontWeight: 500 }}>{label}</span>
    </div>
);

export default Header;