// components/Deal.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DealProps {
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
}

const Deal: React.FC<DealProps> = ({ colors, isDarkMode = true }) => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
    const [hoveredStore, setHoveredStore] = useState<number | null>(null);

    const topStores = [
        { id: 1, name: 'TechVerse', verified: true, rating: 4.9, reviews: 12453, sales: '154.2K', trend: '+24%', category: 'Elektronik', rank: 1 },
        { id: 2, name: 'GadgetHub', verified: true, rating: 4.8, reviews: 9876, sales: '98.7K', trend: '+18%', category: 'Aksesuar', rank: 2 },
        { id: 3, name: 'DigitalDream', verified: true, rating: 4.9, reviews: 7654, sales: '76.3K', trend: '+31%', category: 'Bilgisayar', rank: 3 },
        { id: 4, name: 'SoundWave', verified: false, rating: 4.7, reviews: 5432, sales: '52.1K', trend: '+15%', category: 'Ses Sistemleri', rank: 4 },
        { id: 5, name: 'GameStation', verified: true, rating: 4.8, reviews: 8765, sales: '87.9K', trend: '+42%', category: 'Oyun', rank: 5 }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return { hours: 23, minutes: 59, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    const getRankStyle = (rank: number) => {
        if (rank === 1) return { background: 'linear-gradient(145deg, #FFD700, #FFA500)', color: '#1a2a2a', fontSize: 24, width: 50, height: 50 };
        if (rank === 2) return { background: 'linear-gradient(145deg, #C0C0C0, #A0A0A0)', color: '#1a2a2a', fontSize: 22, width: 45, height: 45 };
        if (rank === 3) return { background: 'linear-gradient(145deg, #CD7F32, #B87333)', color: 'white', fontSize: 20, width: 45, height: 45 };
        return null;
    };

    return (
        <section style={{
            background: isDarkMode ? colors.bg : '#f8f9fa',
            padding: '100px 0',
            position: 'relative',
            overflow: 'hidden',
            borderTop: `1px solid ${colors.border}`,
            borderBottom: `1px solid ${colors.border}`
        }}>
            <style>{`
                @keyframes dealPulse {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.2); opacity: 0.5; }
                }
                @keyframes dealLightSweep {
                    0% { transform: translateX(-100%) rotate(-3deg); }
                    100% { transform: translateX(100%) rotate(-3deg); }
                }
                @keyframes dealBadgeFlash {
                    0%, 100% { border-color: rgba(255,107,107,0.4); box-shadow: 0 0 30px rgba(255,107,107,0.2); }
                    50% { border-color: rgba(255,107,107,0.8); box-shadow: 0 0 50px rgba(255,107,107,0.4); }
                }
                @keyframes dealLightning {
                    0%, 100% { opacity: 0.5; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes dealTimerDot {
                    0%, 100% { opacity: 0.5; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes dealStockPulse {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }
                @keyframes dealCompetitionShake {
                    0%, 100% { transform: rotate(5deg) scale(1); }
                    50% { transform: rotate(8deg) scale(1.05); }
                }
                @keyframes dealLivePulse {
                    0%, 100% { border-color: rgba(255,107,107,0.3); }
                    50% { border-color: rgba(255,107,107,0.8); }
                }
                @keyframes dealLiveDot {
                    0%, 100% { opacity: 0.5; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                .deal-card {
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .deal-card:hover {
                    transform: translateX(-10px) scale(1.02);
                }
            `}</style>

            {/* Işık Çizgileri */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: 0,
                width: '200%',
                height: 2,
                background: `linear-gradient(90deg, transparent, ${colors.primary}30, ${colors.primaryLight}30, transparent)`,
                transform: 'rotate(-3deg)',
                animation: 'dealLightSweep 15s linear infinite'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '30%',
                right: 0,
                width: '200%',
                height: 2,
                background: `linear-gradient(90deg, transparent, ${colors.primaryLight}30, ${colors.primary}30, transparent)`,
                transform: 'rotate(5deg)',
                animation: 'dealLightSweep 18s linear infinite reverse'
            }} />

            {/* Arka Plan Işıkları */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-20%',
                width: 800,
                height: 800,
                background: `radial-gradient(circle, ${colors.primary}15, transparent 70%)`,
                borderRadius: '50%',
                animation: 'dealPulse 8s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-50%',
                right: '-20%',
                width: 800,
                height: 800,
                background: `radial-gradient(circle, ${colors.primaryLight}10, transparent 70%)`,
                borderRadius: '50%',
                animation: 'dealPulse 10s ease-in-out infinite reverse'
            }} />

            <div style={{
                maxWidth: 1280,
                margin: '0 auto',
                padding: '0 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: 60,
                position: 'relative',
                zIndex: 10
            }}>
                {/* SOL TARAF - ÖZEL TEKLİF */}
                <div>
                    <div style={{
                        display: 'inline-block',
                        background: `rgba(255, 107, 107, 0.2)`,
                        backdropFilter: 'blur(10px)',
                        color: '#ff8a8a',
                        padding: '12px 28px',
                        borderRadius: 50,
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: 4,
                        marginBottom: 30,
                        border: `1px solid rgba(255,107,107,0.4)`,
                        animation: 'dealBadgeFlash 2s infinite'
                    }}>
                        ⚡ SON 23 SAAT ⚡
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(42px, 5vw, 64px)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: 25,
                        letterSpacing: '-0.02em',
                        color: colors.text
                    }}>
                        Bu haftanın <br />
                        <span style={{
                            background: `linear-gradient(145deg, #ff8a8a, #ff6b6b)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block',
                            position: 'relative'
                        }}>
                            süper fırsatı
                            <span style={{
                                position: 'absolute',
                                top: -20,
                                right: -40,
                                fontSize: 48,
                                animation: 'dealLightning 0.5s ease-in-out infinite'
                            }}>⚡</span>
                        </span>
                    </h2>

                    <p style={{
                        fontSize: 18,
                        lineHeight: 1.8,
                        color: colors.textSecondary,
                        marginBottom: 40,
                        maxWidth: 500
                    }}>
                        Sınırlı stok, kaçmaz fiyat! En popüler ürünlerde
                        %70'e varan indirim seni bekliyor.
                    </p>

                    {/* Countdown Timer */}
                   <div style={{
                    
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    backdropFilter: 'blur(15px)',
    border: `1px solid ${colors.border}`,
    borderRadius: 60,
    padding: 30,
    marginBottom: 40
}}>
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: colors.textSecondary,
        fontSize: 14,
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginBottom: 20
    }}>
        <span style={{
            width: 8,
            height: 8,
            background: '#ff6b6b',
            borderRadius: '50%',
            animation: 'dealTimerDot 1s infinite'
        }} />
        FIRSATIN BİTMESİNE
        <span style={{
            width: 8,
            height: 8,
            background: '#ff6b6b',
            borderRadius: '50%',
            animation: 'dealTimerDot 1s infinite 0.5s'
        }} />
    </div>
    <div style={{ display: 'flex', gap: 25, justifyContent: 'space-between' }}>
        {[
            { value: formatNumber(timeLeft.hours), label: 'SAAT' },
            { value: formatNumber(timeLeft.minutes), label: 'DAKİKA' },
            { value: formatNumber(timeLeft.seconds), label: 'SANİYE' }
        ].map((item, idx) => (
            <div key={idx} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                {idx < 2 && <span style={{
                    position: 'absolute',
                    right: -15,
                    top: 20,
                    fontSize: 36,
                    color: colors.textSecondary
                }}>:</span>}
                {/* DÜZELTİLEN KISIM - gradient kaldırıldı, düz renk kullanıldı */}
                <div style={{
                    fontSize: 56,
                    fontWeight: 800,
                    color: colors.text,  // gradient yerine düz renk
                    lineHeight: 1,
                    marginBottom: 8
                }}>{item.value}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary, letterSpacing: 2 }}>{item.label}</div>
            </div>
        ))}
    </div>
</div>

                    {/* Fırsat Ürünü */}
                    <div style={{
                        background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${colors.border}`,
                        borderRadius: 40,
                        padding: 30,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 30,
                        transition: 'all 0.4s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
                            e.currentTarget.style.borderColor = `${colors.primary}50`;
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
                            e.currentTarget.style.borderColor = colors.border;
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                        <div style={{
                            width: 120,
                            height: 120,
                            background: isDarkMode ? `linear-gradient(145deg, #1a3a3a, #0a2a2a)` : `linear-gradient(145deg, #e0e0e0, #d0d0d0)`,
                            borderRadius: 30,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 48,
                            transition: 'all 0.4s ease'
                        }}>
                            🎧
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: 24, fontWeight: 700, color: colors.text, marginBottom: 12 }}>Sony WH-1000XM5</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                                <span style={{ fontSize: 32, fontWeight: 800, color: '#ff8a8a' }}>$249</span>
                                <span style={{ fontSize: 20, color: colors.textSecondary, textDecoration: 'line-through' }}>$399</span>
                                <span style={{ background: '#ff6b6b', padding: '5px 12px', borderRadius: 30, fontSize: 12, fontWeight: 700, color: 'white' }}>-38%</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 100, height: 6, background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', borderRadius: 6, overflow: 'hidden' }}>
                                    <div style={{ width: '30%', height: '100%', background: `linear-gradient(90deg, #ff8a8a, #ff6b6b)`, animation: 'dealStockPulse 2s infinite' }} />
                                </div>
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>Stokta son 12 ürün!</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAĞ TARAF - POPÜLER MAĞAZALAR */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        background: 'linear-gradient(145deg, #FFD700, #FFA500)',
                        color: '#1a2a2a',
                        padding: '15px 25px',
                        borderRadius: 60,
                        fontSize: 16,
                        fontWeight: 800,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        transform: 'rotate(5deg)',
                        boxShadow: '0 15px 35px rgba(255,215,0,0.3)',
                        animation: 'dealCompetitionShake 3s ease-in-out infinite',
                        zIndex: 20
                    }}>
                        🏆 RAKİPLERİ EZİYORUZ
                    </div>

                    <h3 style={{
                        fontSize: 'clamp(28px, 3vw, 36px)',
                        fontWeight: 700,
                        color: colors.text,
                        marginBottom: 20,
                        letterSpacing: '-0.02em'
                    }}>
                        Bu ayın en <span style={{ color: '#FFD700', borderBottom: `3px solid #FFD700`, paddingBottom: 5 }}>popüler</span> mağazaları
                    </h3>

                    <p style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 1.6, marginBottom: 30 }}>
                        Binlerce satıcı arasından sıyrılan, müşterilerin en çok tercih ettiği mağazalar.
                    </p>

                    {/* Mağaza Listesi */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {topStores.map((store) => {
                            const rankStyle = getRankStyle(store.rank);
                            return (
                                <div
                                    key={store.id}
                                    className="deal-card"
                                    onMouseEnter={() => setHoveredStore(store.id)}
                                    onMouseLeave={() => setHoveredStore(null)}
                                    style={{
                                        background: hoveredStore === store.id
                                            ? (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)')
                                            : (isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                                        backdropFilter: 'blur(10px)',
                                        border: `1px solid ${hoveredStore === store.id ? `${colors.primary}30` : colors.border}`,
                                        borderRadius: 30,
                                        padding: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {/* Rank */}
                                    <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
                                        {rankStyle ? (
                                            <div style={{
                                                ...rankStyle,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: store.rank === 1 ? '0 10px 25px rgba(255,215,0,0.4)' : 'none'
                                            }}>
                                                {store.rank}
                                            </div>
                                        ) : (
                                            <span style={{ color: colors.textSecondary, fontSize: 20, fontWeight: 700 }}>{store.rank}</span>
                                        )}
                                    </div>

                                    {/* Mağaza Bilgileri */}
                                    <div style={{ flex: 1, marginLeft: 20 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <h4 style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>{store.name}</h4>
                                            {store.verified && (
                                                <span style={{ background: '#4CAF50', color: 'white', fontSize: 11, padding: '3px 10px', borderRadius: 30, fontWeight: 600 }}>✓ Onaylı</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#FFD700' }}>
                                                <span>★</span> {store.rating}
                                                <span style={{ color: colors.textSecondary }}>({store.reviews.toLocaleString()})</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: colors.textSecondary }}>
                                                📦 {store.sales} satış
                                            </div>
                                            <div>
                                                <span style={{ color: '#4CAF50', background: 'rgba(76,175,80,0.1)', padding: '5px 10px', borderRadius: 30, fontSize: 12, fontWeight: 600 }}>{store.trend}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ok İkonu */}
                                    <div style={{
                                        color: '#FFD700',
                                        fontSize: 20,
                                        transition: 'all 0.3s ease',
                                        transform: hoveredStore === store.id ? 'translateX(10px)' : 'translateX(0)'
                                    }}>
                                        →
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Canlı Yayın */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginTop: 40,
                        padding: 20,
                        background: isDarkMode ? 'rgba(255,107,107,0.1)' : 'rgba(255,107,107,0.05)',
                        border: `1px solid ${isDarkMode ? 'rgba(255,107,107,0.3)' : 'rgba(255,107,107,0.2)'}`,
                        borderRadius: 30,
                        animation: 'dealLivePulse 2s infinite'
                    }}>
                        <span style={{
                            width: 12,
                            height: 12,
                            background: '#ff6b6b',
                            borderRadius: '50%',
                            animation: 'dealLiveDot 1s infinite'
                        }} />
                        <span style={{ color: colors.text, fontSize: 14, fontWeight: 600, letterSpacing: 2 }}>
                            CANLI - 1.234 kişi bu mağazaları inceliyor
                        </span>
                    </div>

                    {/* Tüm Mağazalar Butonu */}
                    <button
                        onClick={() => navigate('/shops')}
                        style={{
                            width: '100%',
                            marginTop: 30,
                            padding: 16,
                            background: 'transparent',
                            border: '2px solid rgba(255,215,0,0.3)',
                            borderRadius: 60,
                            color: '#FFD700',
                            fontSize: 15,
                            fontWeight: 700,
                            letterSpacing: 3,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FFD700';
                            e.currentTarget.style.color = '#1a2a2a';
                            e.currentTarget.style.borderColor = '#FFD700';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(255,215,0,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#FFD700';
                            e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <span>TÜM MAĞAZALARI GÖR</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Deal;