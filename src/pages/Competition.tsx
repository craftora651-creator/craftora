// pages/Competition.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaHome, FaPlay, FaGem, FaSearch, FaTrophy, FaUser, FaCrown, FaMedal, 
    FaStar, FaFire, FaGift, FaClock, FaUsers, FaArrowRight, FaBolt, 
    FaRocket, FaAward, FaChartLine, FaCoins, FaEye, FaShoppingCart, 
    FaComment, FaStore, FaBox, FaCheckCircle, FaSpinner, FaTrendingUp, 
    FaCalendarAlt 
} from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import styles from '../css/Medya.module.css';

const Competition: React.FC = () => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [activeNav, setActiveNav] = useState('competition');
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('mart');
    const [animateXP, setAnimateXP] = useState(false);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [showAllMonths, setShowAllMonths] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Kullanıcı XP verileri
    const userXP = 8450;
    const userRank = 7;
    const userAvatar = '👨‍💻';
    const userName = 'Ahmet Yılmaz';
    const userNextLevelXp = 10000;
    const xpPercentage = (userXP / userNextLevelXp) * 100;

    // TOP 5 Liderlik Tablosu (Sadece 5 kişi, animasyonlu)
    const topLeaderboard = [
        { id: 1, name: 'Ahmet Yılmaz', avatar: '👨‍💻', xp: 12450, role: 'seller', verified: true, trend: '+234', level: 'Efsanevi', badge: '👑', prize: '🏆' },
        { id: 2, name: 'Zeynep Kaya', avatar: '👩‍🎨', xp: 9820, role: 'user', verified: true, trend: '+189', level: 'Usta', badge: '⭐', prize: '🥈' },
        { id: 3, name: 'Mehmet Demir', avatar: '👨‍🏫', xp: 8150, role: 'seller', verified: true, trend: '+312', level: 'Usta', badge: '⭐', prize: '🥉' },
        { id: 4, name: 'Elif Yıldız', avatar: '👩‍🔬', xp: 6320, role: 'user', verified: true, trend: '+98', level: 'Çırak', badge: '✨', prize: '🎁' },
        { id: 5, name: 'Can Öztürk', avatar: '👨‍🎤', xp: 5450, role: 'seller', verified: false, trend: '+156', level: 'Çırak', badge: '✨', prize: '🎁' },
    ];

    // XP Kazanma Yolları (Daha görsel)
    const xpWays = [
        { icon: '📹', title: 'Video İzle', xp: 2, color: '#e07c5c', bg: 'linear-gradient(135deg, #e07c5c20, #e07c5c05)', action: 'İzle ve XP Kazan' },
        { icon: '🛒', title: 'Alışveriş Yap', xp: 5, color: '#10b981', bg: 'linear-gradient(135deg, #10b98120, #10b98105)', action: 'Hemen Alışveriş Yap' },
        { icon: '✍️', title: 'Yorum Yaz', xp: 3, color: '#f59e0b', bg: 'linear-gradient(135deg, #f59e0b20, #f59e0b05)', action: 'Yorum Yap ve Kazan' },
        { icon: '🏪', title: 'Ürün Ekle', xp: 10, color: '#8b5cf6', bg: 'linear-gradient(135deg, #8b5cf620, #8b5cf605)', action: 'Satıcı Ol, Ürün Ekle' },
        { icon: '💰', title: 'Satış Yap', xp: 15, color: '#ef4444', bg: 'linear-gradient(135deg, #ef444420, #ef444405)', action: 'Satış Yap, XP Kazan' },
        { icon: '⭐', title: 'Mağaza Puanı', xp: 5, color: '#06b6d4', bg: 'linear-gradient(135deg, #06b6d420, #06b6d405)', action: 'Mağazanı Yükselt' },
    ];

    // Geçen Ayın Kazananları (5 kişi)
    const lastMonthWinners = [
        { id: 1, name: 'Ali Yılmaz', avatar: '👨‍💻', prize: 'MacBook Pro M3', prizeIcon: '💻', prizeValue: '$1.299', rank: 1 },
        { id: 2, name: 'Ayşe Demir', avatar: '👩‍🎨', prize: 'iPhone 15 Pro', prizeIcon: '📱', prizeValue: '$1.099', rank: 2 },
        { id: 3, name: 'Mehmet Kaya', avatar: '👨‍🏫', prize: 'Sony WH-1000XM5', prizeIcon: '🎧', prizeValue: '$399', rank: 3 },
        { id: 4, name: 'Fatma Yıldız', avatar: '👩‍🔬', prize: 'iPad Air', prizeIcon: '📱', prizeValue: '$599', rank: 4 },
        { id: 5, name: 'Caner Öztürk', avatar: '👨‍🎤', prize: 'PS5 Slim', prizeIcon: '🎮', prizeValue: '$499', rank: 5 },
    ];

    // Tüm Aylar
    const allMonths = [
        { id: 'mart', name: 'Mart 2025', winners: lastMonthWinners },
        { id: 'subat', name: 'Şubat 2025', winners: lastMonthWinners.map(w => ({ ...w, name: w.name + ' (Şubat)' })) },
        { id: 'ocak', name: 'Ocak 2025', winners: lastMonthWinners.map(w => ({ ...w, name: w.name + ' (Ocak)' })) },
        { id: 'aralik', name: 'Aralık 2024', winners: lastMonthWinners.map(w => ({ ...w, name: w.name + ' (Aralık)' })) },
        { id: 'kasim', name: 'Kasım 2024', winners: lastMonthWinners.map(w => ({ ...w, name: w.name + ' (Kasım)' })) },
    ];

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        setAnimateXP(true);
        setTimeout(() => setAnimateXP(false), 500);
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

    const getRankDisplay = (index: number) => {
        if (index === 0) return { icon: <FaCrown style={{ color: '#FFD700', fontSize: 24 }} />, glow: '#FFD700', bg: 'linear-gradient(135deg, #FFD70020, #FFA50010)' };
        if (index === 1) return { icon: <FaMedal style={{ color: '#C0C0C0', fontSize: 22 }} />, glow: '#C0C0C0', bg: 'linear-gradient(135deg, #C0C0C020, #A0A0A010)' };
        if (index === 2) return { icon: <FaMedal style={{ color: '#CD7F32', fontSize: 22 }} />, glow: '#CD7F32', bg: 'linear-gradient(135deg, #CD7F3220, #B8733310)' };
        return null;
    };

    return (
        <div style={{
            backgroundColor: colors.bg,
            color: colors.text,
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            minHeight: '100vh',
            overflowX: 'hidden',
            paddingBottom: '80px'
        }}>
            <style>{`
                @keyframes starTwinkle {
                    0%, 100% { opacity: 0.1; transform: scale(0.8); }
                    50% { opacity: 0.5; transform: scale(1.5); }
                }
                @keyframes xpPulse {
                    0% { transform: scale(1); text-shadow: none; }
                    50% { transform: scale(1.1); color: #FFD700; text-shadow: 0 0 15px #FFD700; }
                    100% { transform: scale(1); text-shadow: none; }
                }
                @keyframes floatGlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes shimmer {
                    0% { left: -100%; }
                    20% { left: 100%; }
                    100% { left: 100%; }
                }
                @keyframes progressFill {
                    from { width: 0%; }
                    to { width: ${xpPercentage}%; }
                }
                @keyframes glowPulse {
                    0%, 100% { box-shadow: 0 0 5px ${colors.primary}40; }
                    50% { box-shadow: 0 0 20px ${colors.primary}80; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes winnerGlow {
                    0%, 100% { box-shadow: 0 0 0 0 ${colors.primary}40; }
                    50% { box-shadow: 0 0 0 10px ${colors.primary}20; }
                }
                .star-twinkle {
                    animation: starTwinkle 3s ease-in-out infinite;
                }
                .xp-animate {
                    animation: xpPulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .float-glow {
                    animation: floatGlow 3s ease-in-out infinite;
                }
                .progress-bar-fill {
                    animation: progressFill 1s ease-out;
                }
                .btn-transition {
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .btn-transition:hover {
                    transform: translateY(-3px) scale(1.02);
                }
                .card-hover {
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .card-hover:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 20px 40px ${colors.primary}30;
                }
                .top-rank-card {
                    animation: slideUp 0.6s ease-out;
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .top-rank-card:hover {
                    transform: translateY(-10px) scale(1.05);
                }
                .winner-card {
                    animation: winnerGlow 2s infinite;
                    transition: all 0.3s ease;
                }
                .winner-card:hover {
                    transform: translateY(-5px) scale(1.05);
                }
            `}</style>

            {/* Dekoratif Yıldızlar */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="star-twinkle"
                        style={{
                            position: 'absolute',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            background: `radial-gradient(circle, ${colors.primary}, transparent)`,
                            borderRadius: '50%',
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: 0.3
                        }}
                    />
                ))}
            </div>

            {/* ===== HEADER - YENİ TASARIM ===== */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: colors.surface,
                borderBottom: `1px solid ${colors.border}`,
                padding: '12px 20px',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16
                }}>
                    {/* SOL - Logo ve Başlık */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="float-glow" style={{
                            width: 40,
                            height: 40,
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                            boxShadow: `0 4px 15px ${colors.primary}40`
                        }}>
                            🏆
                        </div>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>XP Yarışması</div>
                            <div style={{ fontSize: 10, color: colors.textSecondary }}>Mart 2025</div>
                        </div>
                    </div>

                    {/* ORTA - Progress Bar (Seviye Atlamana Kalan) */}
                    <div style={{
                        flex: 1,
                        maxWidth: 380,
                        minWidth: 220,
                        background: colors.surface2,
                        borderRadius: 40,
                        padding: '8px 18px',
                        border: `1px solid ${colors.primary}20`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 11, color: colors.textSecondary }}>🏅 Seviye Atlamana Kalan</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: colors.primary }}>
                                {userXP.toLocaleString()} / {userNextLevelXp.toLocaleString()}
                            </span>
                        </div>
                        <div style={{
                            height: 6,
                            background: colors.surface,
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}>
                            <div className="progress-bar-fill" style={{
                                width: `${xpPercentage}%`,
                                height: '100%',
                                background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
                                borderRadius: 3,
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                    animation: 'shimmer 2s infinite'
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* SAĞ - Kullanıcı + Butonlar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: `${colors.primary}15`,
                            borderRadius: 40,
                            padding: '4px 12px 4px 8px',
                            border: `1px solid ${colors.primary}30`
                        }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryLight}10)`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18
                            }}>
                                {userAvatar}
                            </div>
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: colors.text }}>{userName}</div>
                                <div style={{ fontSize: 9, color: colors.textSecondary }}>Sıra #{userRank}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/medya')}
                            className="btn-transition"
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                                border: 'none',
                                padding: '8px 18px',
                                borderRadius: 40,
                                color: 'white',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            <FaBolt size={12} /> Kazan
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className="btn-transition"
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: colors.surface2,
                                border: `1px solid ${colors.border}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: 16
                            }}
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Ana İçerik */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
                
                {/* Hero Bölümü */}
                <div style={{ textAlign: 'center', marginBottom: 50 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primaryLight}05)`,
                        padding: '10px 28px',
                        borderRadius: 60,
                        marginBottom: 24,
                        border: `1px solid ${colors.primary}30`
                    }}>
                        <FaFire style={{ color: colors.primary, fontSize: 18 }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: colors.primary, letterSpacing: 2 }}>MART AYI YARIŞMASI</span>
                        <FaRocket style={{ color: colors.primary, fontSize: 18 }} />
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(32px, 6vw, 52px)',
                        fontWeight: 800,
                        color: colors.text,
                        marginBottom: 16,
                        lineHeight: 1.1
                    }}>
                        En çok <span style={{ color: colors.primary, position: 'relative', display: 'inline-block' }}>
                            XP toplayanlar
                            <span style={{
                                position: 'absolute',
                                bottom: 4,
                                left: 0,
                                right: 0,
                                height: 8,
                                background: `${colors.primary}40`,
                                borderRadius: 4,
                                zIndex: -1
                            }} />
                        </span> kazanıyor!
                    </h1>
                    <p style={{
                        fontSize: 16,
                        color: colors.textSecondary,
                        maxWidth: 550,
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Craftora'da aktif ol, XP topla ve harika ödüllerin sahibi ol!
                    </p>
                </div>

                {/* Ödüller - 3 Büyük Ödül */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 20,
                    marginBottom: 50,
                    flexWrap: 'wrap'
                }}>
                    {[
                        { rank: '2.', title: 'İkincilik', prize: 'iPhone 15 Pro', value: '$1.099', icon: '📱', color: '#C0C0C0', bg: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)' },
                        { rank: '1.', title: 'Birincilik', prize: 'MacBook Pro M3', value: '$1.299', icon: '💻', color: '#FFD700', bg: 'linear-gradient(135deg, #FFD700, #FFA500)' },
                        { rank: '3.', title: 'Üçüncülük', prize: 'Sony WH-1000XM5', value: '$399', icon: '🎧', color: '#CD7F32', bg: 'linear-gradient(135deg, #CD7F32, #B87333)' },
                    ].map((prize, idx) => (
                        <div key={idx} className="card-hover" style={{
                            flex: 1,
                            minWidth: 160,
                            maxWidth: 220,
                            textAlign: 'center',
                            padding: '28px 16px',
                            background: isDarkMode ? colors.surface : '#ffffff',
                            borderRadius: 32,
                            border: `1px solid ${colors.border}`,
                            order: idx === 0 ? 1 : idx === 1 ? 0 : 2,
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {idx === 1 && <div style={{
                                position: 'absolute',
                                top: -20,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: 50,
                                opacity: 0.1
                            }}>👑</div>}
                            <div style={{
                                width: 70,
                                height: 70,
                                background: prize.bg,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 36,
                                margin: '0 auto 16px',
                                boxShadow: `0 10px 25px ${prize.color}40`
                            }}>
                                {prize.icon}
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: prize.color, marginBottom: 4 }}>{prize.rank} {prize.title}</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: colors.text, marginBottom: 8 }}>{prize.prize}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: colors.primary }}>{prize.value}</div>
                        </div>
                    ))}
                </div>

                {/* 2x XP Banner */}
                <div className="card-hover" style={{
                    background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primaryLight}05)`,
                    borderRadius: 24,
                    padding: '16px 24px',
                    marginBottom: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                    border: `1px solid ${colors.primary}30`,
                    cursor: 'pointer'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24
                        }}>
                            <FaBolt style={{ color: 'white' }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, color: colors.text, fontSize: 16 }}>Hafta Sonu 2x XP Fırsatı!</div>
                            <div style={{ fontSize: 13, color: colors.textSecondary }}>Cumartesi & Pazar tüm işlemlerden 2 kat XP kazan!</div>
                        </div>
                    </div>
                    <span style={{
                        background: colors.primary,
                        padding: '6px 18px',
                        borderRadius: 30,
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}>
                        <FaClock size={12} /> Cumartesi'ye 2 gün
                    </span>
                </div>

                {/* TOP 5 Liderlik Tablosu - ANİMASYONLU */}
                <div style={{ marginBottom: 50 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FaTrophy style={{ color: colors.primary }} /> TOP 5 Liderler
                        </h2>
                        <div style={{ fontSize: 12, color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <FaClock size={12} /> Her saat güncellenir
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {topLeaderboard.map((user, index) => {
                            const rankStyle = getRankDisplay(index);
                            return (
                                <div
                                    key={user.id}
                                    className="top-rank-card"
                                    onMouseEnter={() => setHoveredRow(user.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px 20px',
                                        background: rankStyle?.bg || (isDarkMode ? colors.surface : '#ffffff'),
                                        borderRadius: 20,
                                        border: `1px solid ${hoveredRow === user.id ? colors.primary : colors.border}`,
                                        boxShadow: hoveredRow === user.id ? `0 10px 25px ${colors.primary}20` : 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 80 }}>
                                        {rankStyle?.icon || <span style={{ fontSize: 18, fontWeight: 700, color: colors.textSecondary }}>#{index + 1}</span>}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                                        <div style={{
                                            width: 50,
                                            height: 50,
                                            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryLight}10)`,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 26,
                                            border: rankStyle?.glow ? `2px solid ${rankStyle.glow}` : 'none'
                                        }}>
                                            {user.avatar}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                <span style={{ fontWeight: 700, fontSize: 16, color: colors.text }}>{user.name}</span>
                                                {user.verified && <MdVerified size={14} color={colors.primary} />}
                                                <span style={{
                                                    fontSize: 10,
                                                    background: `${colors.primary}15`,
                                                    padding: '3px 10px',
                                                    borderRadius: 20,
                                                    color: colors.primary,
                                                    fontWeight: 600
                                                }}>{user.level}</span>
                                            </div>
                                            <div style={{ fontSize: 12, color: colors.textSecondary }}>
                                                {user.role === 'seller' ? '🛒 Satıcı' : '👤 Müşteri'}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 24, fontWeight: 800, color: colors.primary }}>
                                            {user.xp.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#4CAF50', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                                            <span style={{ fontSize: 12, color: '#4CAF50' }}>📈 {user.trend}</span>
                                        </div>
                                    </div>

                                    {index < 3 && (
                                        <div style={{
                                            marginLeft: 12,
                                            fontSize: 24
                                        }}>
                                            {user.prize}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* XP Nasıl Kazanılır? - GÖRSEL */}
                <div style={{ marginBottom: 50 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.text, marginBottom: 28, textAlign: 'center' }}>
                        <FaCoins style={{ display: 'inline', marginRight: 8, color: colors.primary }} /> XP Nasıl Kazanılır?
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: 20
                    }}>
                        {xpWays.map((way, i) => (
                            <div
                                key={i}
                                className="card-hover"
                                style={{
                                    background: way.bg,
                                    borderRadius: 24,
                                    padding: 20,
                                    textAlign: 'center',
                                    border: `1px solid ${colors.border}`,
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate('/medya')}
                            >
                                <div style={{
                                    width: 60,
                                    height: 60,
                                    background: `${way.color}20`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 32,
                                    margin: '0 auto 12px'
                                }}>
                                    {way.icon}
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 4 }}>{way.title}</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: way.color, marginBottom: 8 }}>+{way.xp} XP</div>
                                <div style={{ fontSize: 11, color: colors.textSecondary }}>{way.action}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Geçen Ayın Kazananları */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 16,
                        marginBottom: 28
                    }}>
                        <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FaGift style={{ color: colors.primary }} /> Geçen Ayın Kazananları
                        </h2>
                        <button
                            onClick={() => setShowAllMonths(!showAllMonths)}
                            className="btn-transition"
                            style={{
                                background: 'transparent',
                                border: `1px solid ${colors.primary}`,
                                padding: '8px 20px',
                                borderRadius: 40,
                                color: colors.primary,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            <FaCalendarAlt size={12} /> {showAllMonths ? 'Gizle' : 'Tüm Ayları Göster'}
                        </button>
                    </div>

                    {/* Tüm Aylar */}
                    {showAllMonths && (
                        <div style={{ marginBottom: 30 }}>
                            {allMonths.map(month => (
                                <div key={month.id} style={{ marginBottom: 32 }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.primary, marginBottom: 16, borderLeft: `3px solid ${colors.primary}`, paddingLeft: 12 }}>{month.name}</h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                        gap: 16
                                    }}>
                                        {month.winners.map(winner => (
                                            <div key={winner.id} className="winner-card" style={{
                                                background: isDarkMode ? colors.surface : '#ffffff',
                                                borderRadius: 20,
                                                padding: 16,
                                                textAlign: 'center',
                                                border: `1px solid ${colors.border}`,
                                                position: 'relative'
                                            }}>
                                                {winner.rank === 1 && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: 20 }}>👑</div>}
                                                <div style={{
                                                    width: 55,
                                                    height: 55,
                                                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryLight}10)`,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 28,
                                                    margin: '0 auto 8px'
                                                }}>
                                                    {winner.avatar}
                                                </div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{winner.name}</div>
                                                <div style={{ fontSize: 11, color: colors.textSecondary }}>{winner.prizeIcon} {winner.prize}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Sadece Geçen Ay (Şubat) */}
                    {!showAllMonths && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                            gap: 20
                        }}>
                            {lastMonthWinners.map((winner, idx) => (
                                <div key={winner.id} className="winner-card" style={{
                                    background: isDarkMode ? colors.surface : '#ffffff',
                                    borderRadius: 24,
                                    padding: 20,
                                    textAlign: 'center',
                                    border: `1px solid ${colors.border}`,
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}>
                                    {idx === 0 && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontSize: 24 }}>👑</div>}
                                    <div style={{
                                        width: 70,
                                        height: 70,
                                        background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryLight}10)`,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 34,
                                        margin: '0 auto 12px',
                                        border: idx === 0 ? `2px solid #FFD700` : 'none'
                                    }}>
                                        {winner.avatar}
                                    </div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{winner.name}</div>
                                    <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>{winner.prizeIcon} {winner.prize}</div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.primary, marginTop: 8 }}>{winner.prizeValue}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA Butonu */}
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <button
                        onClick={() => navigate('/medya')}
                        className="btn-transition"
                        style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                            border: 'none',
                            padding: '16px 48px',
                            borderRadius: 60,
                            color: 'white',
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 12,
                            boxShadow: `0 10px 25px ${colors.primary}40`
                        }}
                    >
                        <FaRocket size={18} /> Hemen XP Toplamaya Başla! <FaArrowRight />
                    </button>
                </div>
            </div>

            {/* ===== ALT NAVIGASYON ===== */}
            <div className={`${styles.bottomNav}`}>
                <div className={styles.bottomLogo} style={{ color: isDarkMode ? '#ffffff' : '#1a1a1a' }}>
                    CRAFT<span style={{ color: colors.primary }}>ORA</span>
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

export default Competition;