// components/Winners.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WinnersProps {
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

const Winners: React.FC<WinnersProps> = ({ colors, isDarkMode = true }) => {
    const navigate = useNavigate();
    const [hoveredWinner, setHoveredWinner] = useState<number | null>(null);

    const winners = [
        { id: 1, name: 'Ahmet Yılmaz', avatar: '👨‍💻', prize: 'MacBook Pro M3', prizeIcon: '💻', prizeValue: '$1.299', daysAgo: 3, verified: true, rank: 2 },
        { id: 2, name: 'Ayşe Demir', avatar: '👩‍🎨', prize: 'Sony WH-1000XM5', prizeIcon: '🎧', prizeValue: '$399', daysAgo: 5, verified: true, rank: 3 },
        { id: 3, name: 'Mehmet Kaya', avatar: '👨‍🏫', prize: 'iPhone 15 Pro', prizeIcon: '📱', prizeValue: '$1.099', daysAgo: 2, verified: true, rank: 1 },
        { id: 4, name: 'Furkan Şahin', avatar: '👨‍💼', prize: 'iPad Air 5', prizeIcon: '📱', prizeValue: '$599', daysAgo: 7, verified: false, rank: 4 },
        { id: 5, name: 'Selena Gökçe', avatar: '👩‍🎤', prize: 'PS5 Slim', prizeIcon: '🎮', prizeValue: '$499', daysAgo: 1, verified: true, rank: 5 }
    ];

    // Sıralama: 1. ortada, 2. solda, 3. sağda, 4. ve 5. altta
    const firstPlace = winners.find(w => w.rank === 1);
    const secondPlace = winners.find(w => w.rank === 2);
    const thirdPlace = winners.find(w => w.rank === 3);
    const otherWinners = winners.filter(w => w.rank === 4 || w.rank === 5);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '👑';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '🎖️';
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'linear-gradient(135deg, #FFD700, #FFA500)';
        if (rank === 2) return 'linear-gradient(135deg, #C0C0C0, #A0A0A0)';
        if (rank === 3) return 'linear-gradient(135deg, #CD7F32, #B87333)';
        return `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`;
    };

    return (
        <section style={{
            background: isDarkMode ? colors.bg : '#f8f9fa',
            padding: '100px 0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style>{`
                @keyframes podiumGlow {
                    0%, 100% { box-shadow: 0 0 20px ${colors.primary}40; }
                    50% { box-shadow: 0 0 40px ${colors.primary}80; }
                }
                @keyframes podiumFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes crownShine {
                    0% { opacity: 0.5; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                    100% { opacity: 0.5; transform: scale(0.8); }
                }
                @keyframes confettiFall {
                    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
                }
                .podium-card {
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .podium-card:hover {
                    transform: translateY(-8px) scale(1.02);
                }
                .crown-animation {
                    animation: crownShine 1.5s ease-in-out infinite;
                }
            `}</style>

            {/* Konfeti Efekti */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 4}px`,
                            height: `${Math.random() * 10 + 4}px`,
                            background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            opacity: 0.4,
                            animation: `confettiFall ${Math.random() * 5 + 3}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '0 24px'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        background: `rgba(224, 124, 92, 0.12)`,
                        padding: '8px 28px',
                        borderRadius: 60,
                        marginBottom: 20
                    }}>
                        <span style={{ fontSize: 24 }}>🏆</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: colors.primary, letterSpacing: 2 }}>
                            AYIN KAZANANLARI
                        </span>
                        <span style={{ fontSize: 24 }}>🎉</span>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(36px, 4vw, 52px)',
                        fontWeight: 800,
                        color: colors.text,
                        marginBottom: 16
                    }}>
                        Podyumda <span style={{ color: colors.primary }}>yer alanlar</span>
                    </h2>
                    <p style={{
                        fontSize: 16,
                        color: colors.textSecondary,
                        maxWidth: 550,
                        margin: '0 auto'
                    }}>
                        Bu ayın en şanslı isimleri, harika ödüller kazandılar. 
                        Sıradaki kazanan sen olabilirsin!
                    </p>
                </div>

                {/* PODYUM - 1., 2., 3. */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: 30,
                    marginBottom: 50,
                    flexWrap: 'wrap'
                }}>
                    {/* 2. LİK - SOL */}
                    {secondPlace && (
                        <div className="podium-card" style={{
                            flex: 1,
                            minWidth: 250,
                            maxWidth: 280,
                            order: 1
                        }}
                        onMouseEnter={() => setHoveredWinner(secondPlace.id)}
                        onMouseLeave={() => setHoveredWinner(null)}>
                            <div style={{
                                background: isDarkMode ? colors.surface : '#ffffff',
                                borderRadius: 40,
                                padding: '30px 20px',
                                textAlign: 'center',
                                border: `2px solid ${hoveredWinner === secondPlace.id ? colors.primary : colors.border}`,
                                position: 'relative',
                                cursor: 'pointer',
                                transform: hoveredWinner === secondPlace.id ? 'translateY(-10px)' : 'translateY(0)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => navigate('/contest')}>
                                {/* Gümüş Rozet */}
                                <div style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
                                    color: '#1a2a2a',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 24,
                                    fontWeight: 800,
                                    boxShadow: '0 4px 15px rgba(192,192,192,0.4)'
                                }}>
                                    2
                                </div>
                                <div style={{
                                    width: 90,
                                    height: 90,
                                    background: `linear-gradient(135deg, #C0C0C020, #A0A0A010)`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 48,
                                    margin: '0 auto 16px',
                                    border: `2px solid #C0C0C040`
                                }}>
                                    {secondPlace.avatar}
                                </div>
                                <h3 style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: colors.text,
                                    marginBottom: 4
                                }}>
                                    {secondPlace.name}
                                    {secondPlace.verified && <span style={{ fontSize: 16, color: '#4CAF50', marginLeft: 6 }}>✓</span>}
                                </h3>
                                <p style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 20 }}>
                                    {secondPlace.daysAgo} gün önce kazandı
                                </p>
                                <div style={{
                                    background: `linear-gradient(135deg, #C0C0C015, #A0A0A005)`,
                                    borderRadius: 20,
                                    padding: '15px',
                                    border: `1px solid #C0C0C030`
                                }}>
                                    <div style={{ fontSize: 36, marginBottom: 8 }}>{secondPlace.prizeIcon}</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 4 }}>{secondPlace.prize}</div>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: '#C0C0C0' }}>{secondPlace.prizeValue}</div>
                                </div>
                            </div>
                            {/* Podyum Kaidesi */}
                            <div style={{
                                height: 20,
                                background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
                                marginTop: -10,
                                borderRadius: '0 0 20px 20px',
                                width: '90%',
                                margin: '-10px auto 0',
                                opacity: 0.6
                            }} />
                        </div>
                    )}

                    {/* 1. LİK - ORTA (EN BÜYÜK) */}
                    {firstPlace && (
                        <div className="podium-card" style={{
                            flex: 1.2,
                            minWidth: 300,
                            maxWidth: 340,
                            order: 2
                        }}
                        onMouseEnter={() => setHoveredWinner(firstPlace.id)}
                        onMouseLeave={() => setHoveredWinner(null)}>
                            <div style={{
                                background: isDarkMode ? colors.surface : '#ffffff',
                                borderRadius: 48,
                                padding: '40px 20px',
                                textAlign: 'center',
                                border: `2px solid ${hoveredWinner === firstPlace.id ? colors.primary : '#FFD700'}`,
                                position: 'relative',
                                cursor: 'pointer',
                                transform: hoveredWinner === firstPlace.id ? 'translateY(-12px)' : 'translateY(0)',
                                transition: 'all 0.3s ease',
                                boxShadow: hoveredWinner === firstPlace.id ? `0 20px 40px ${colors.primary}30` : '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => navigate('/contest')}>
                                {/* Taç */}
                                <div className="crown-animation" style={{
                                    position: 'absolute',
                                    top: -25,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: 40
                                }}>
                                    👑
                                </div>
                                {/* Altın Rozet */}
                                <div style={{
                                    position: 'absolute',
                                    top: -15,
                                    right: -15,
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    color: '#1a2a2a',
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 28,
                                    fontWeight: 800,
                                    boxShadow: '0 4px 20px rgba(255,215,0,0.5)'
                                }}>
                                    1
                                </div>
                                <div style={{
                                    width: 110,
                                    height: 110,
                                    background: `radial-gradient(circle, #FFD70020, #FFA50010)`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 56,
                                    margin: '0 auto 16px',
                                    border: `3px solid #FFD700`
                                }}>
                                    {firstPlace.avatar}
                                </div>
                                <h3 style={{
                                    fontSize: 26,
                                    fontWeight: 800,
                                    color: colors.text,
                                    marginBottom: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6
                                }}>
                                    {firstPlace.name}
                                    {firstPlace.verified && <span style={{ fontSize: 18, color: '#4CAF50' }}>✓</span>}
                                </h3>
                                <p style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 20 }}>
                                    {firstPlace.daysAgo} gün önce kazandı
                                </p>
                                <div style={{
                                    background: `linear-gradient(135deg, #FFD70015, #FFA50005)`,
                                    borderRadius: 24,
                                    padding: '18px',
                                    border: `1px solid #FFD70040`
                                }}>
                                    <div style={{ fontSize: 42, marginBottom: 8 }}>{firstPlace.prizeIcon}</div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{firstPlace.prize}</div>
                                    <div style={{ fontSize: 24, fontWeight: 800, color: '#FFD700' }}>{firstPlace.prizeValue}</div>
                                </div>
                                {/* Kazanan Flaması */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: -10,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    padding: '4px 20px',
                                    borderRadius: 30,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#1a2a2a',
                                    whiteSpace: 'nowrap'
                                }}>
                                    🏆 GRAND CHAMPION 🏆
                                </div>
                            </div>
                            {/* Podyum Kaidesi (En Yüksek) */}
                            <div style={{
                                height: 30,
                                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                marginTop: -10,
                                borderRadius: '0 0 25px 25px',
                                width: '95%',
                                margin: '-10px auto 0',
                                opacity: 0.7
                            }} />
                        </div>
                    )}

                    {/* 3. LİK - SAĞ */}
                    {thirdPlace && (
                        <div className="podium-card" style={{
                            flex: 1,
                            minWidth: 250,
                            maxWidth: 280,
                            order: 3
                        }}
                        onMouseEnter={() => setHoveredWinner(thirdPlace.id)}
                        onMouseLeave={() => setHoveredWinner(null)}>
                            <div style={{
                                background: isDarkMode ? colors.surface : '#ffffff',
                                borderRadius: 40,
                                padding: '30px 20px',
                                textAlign: 'center',
                                border: `2px solid ${hoveredWinner === thirdPlace.id ? colors.primary : colors.border}`,
                                position: 'relative',
                                cursor: 'pointer',
                                transform: hoveredWinner === thirdPlace.id ? 'translateY(-10px)' : 'translateY(0)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => navigate('/contest')}>
                                {/* Bronz Rozet */}
                                <div style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'linear-gradient(135deg, #CD7F32, #B87333)',
                                    color: 'white',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 24,
                                    fontWeight: 800,
                                    boxShadow: '0 4px 15px rgba(205,127,50,0.4)'
                                }}>
                                    3
                                </div>
                                <div style={{
                                    width: 90,
                                    height: 90,
                                    background: `linear-gradient(135deg, #CD7F3220, #B8733310)`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 48,
                                    margin: '0 auto 16px',
                                    border: `2px solid #CD7F3240`
                                }}>
                                    {thirdPlace.avatar}
                                </div>
                                <h3 style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: colors.text,
                                    marginBottom: 4
                                }}>
                                    {thirdPlace.name}
                                    {thirdPlace.verified && <span style={{ fontSize: 16, color: '#4CAF50', marginLeft: 6 }}>✓</span>}
                                </h3>
                                <p style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 20 }}>
                                    {thirdPlace.daysAgo} gün önce kazandı
                                </p>
                                <div style={{
                                    background: `linear-gradient(135deg, #CD7F3215, #B8733305)`,
                                    borderRadius: 20,
                                    padding: '15px',
                                    border: `1px solid #CD7F3230`
                                }}>
                                    <div style={{ fontSize: 36, marginBottom: 8 }}>{thirdPlace.prizeIcon}</div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 4 }}>{thirdPlace.prize}</div>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: '#CD7F32' }}>{thirdPlace.prizeValue}</div>
                                </div>
                            </div>
                            {/* Podyum Kaidesi */}
                            <div style={{
                                height: 20,
                                background: 'linear-gradient(135deg, #CD7F32, #B87333)',
                                marginTop: -10,
                                borderRadius: '0 0 20px 20px',
                                width: '90%',
                                margin: '-10px auto 0',
                                opacity: 0.6
                            }} />
                        </div>
                    )}
                </div>

                {/* ALT SIRA - 4. ve 5. (Yan yana, daha küçük) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 40,
                    marginBottom: 60,
                    flexWrap: 'wrap'
                }}>
                    {otherWinners.map((winner, idx) => (
                        <div
                            key={winner.id}
                            className="podium-card"
                            style={{
                                flex: 1,
                                minWidth: 220,
                                maxWidth: 260
                            }}
                            onMouseEnter={() => setHoveredWinner(winner.id)}
                            onMouseLeave={() => setHoveredWinner(null)}>
                            <div style={{
                                background: isDarkMode ? colors.surface : '#ffffff',
                                borderRadius: 32,
                                padding: '25px 20px',
                                textAlign: 'center',
                                border: `1px solid ${hoveredWinner === winner.id ? colors.primary : colors.border}`,
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => navigate('/contest')}>
                                <div style={{
                                    position: 'absolute',
                                    top: -12,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: getRankColor(winner.rank),
                                    color: winner.rank === 4 || winner.rank === 5 ? 'white' : '#1a2a2a',
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 20,
                                    fontWeight: 800
                                }}>
                                    {winner.rank}
                                </div>
                                <div style={{
                                    width: 70,
                                    height: 70,
                                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryLight}10)`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 36,
                                    margin: '0 auto 12px'
                                }}>
                                    {winner.avatar}
                                </div>
                                <h3 style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: colors.text,
                                    marginBottom: 4
                                }}>
                                    {winner.name}
                                    {winner.verified && <span style={{ fontSize: 14, color: '#4CAF50', marginLeft: 4 }}>✓</span>}
                                </h3>
                                <p style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 12 }}>
                                    {winner.daysAgo} gün önce
                                </p>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    background: `rgba(224, 124, 92, 0.08)`,
                                    borderRadius: 30,
                                    padding: '8px 12px'
                                }}>
                                    <span style={{ fontSize: 20 }}>{winner.prizeIcon}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{winner.prize}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Banner */}
                <div style={{
                    background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primaryLight}05)`,
                    borderRadius: 48,
                    padding: '40px',
                    textAlign: 'center',
                    border: `1px solid ${colors.primary}30`,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        background: `radial-gradient(circle, ${colors.primary}20, transparent)`,
                        borderRadius: '50%'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: -50,
                        left: -50,
                        width: 200,
                        height: 200,
                        background: `radial-gradient(circle, ${colors.primaryLight}15, transparent)`,
                        borderRadius: '50%'
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🎁</span>
                        <h3 style={{
                            fontSize: 'clamp(24px, 3vw, 32px)',
                            fontWeight: 800,
                            color: colors.text,
                            marginBottom: 12
                        }}>
                            Sıradaki kazanan <span style={{ color: colors.primary }}>SEN OLABİLİRSİN!</span>
                        </h3>
                        <p style={{
                            fontSize: 16,
                            color: colors.textSecondary,
                            marginBottom: 24,
                            maxWidth: 500,
                            margin: '0 auto 24px'
                        }}>
                            Her ay düzenlediğimiz yarışmalara katıl, 
                            harika ödüller kazanma şansını yakala!
                        </p>
                        <button
                            onClick={() => navigate('/contest')}
                            style={{
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                                border: 'none',
                                padding: '14px 42px',
                                borderRadius: 60,
                                color: 'white',
                                fontSize: 16,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: `0 10px 25px ${colors.primary}40`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                                e.currentTarget.style.boxShadow = `0 20px 40px ${colors.primary}60`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = `0 10px 25px ${colors.primary}40`;
                            }}
                        >
                            Hemen Katıl, Sen de Kazan! →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Winners;