// components/Hero.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
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

const Hero: React.FC<HeroProps> = ({ colors, isDarkMode = true }) => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const slides = [
        {
            id: 1,
            title: 'Bu Haftanın En Performanslıları',
            highlight: 'Performanslıları',
            desc: 'En çok satan, en beğenilen, en yüksek puanlı ürünler bu hafta %40\'a varan indirimle seni bekliyor!',
            badge: '🔥 HAFTANIN FIRSATI',
            image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            buttonText: 'Ürünleri Keşfet',
            buttonLink: '/shop',
            stats: ['500+ Ürün', '40% İndirim', 'Ücretsiz Kargo']
        },
        {
            id: 2,
            title: 'Bu Ayın En Çok İzlenen Kursları',
            highlight: 'İzlenen Kursları',
            desc: 'Yazılımdan tasarıma, pazarlamadan veri bilimine en popüler 50+ kurs şimdi sınırlı süre %50 indirimli!',
            badge: '📚 EĞİTİM AYI',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            buttonText: 'Kursları İncele',
            buttonLink: '/courses',
            stats: ['50+ Kurs', '50% İndirim', 'Sertifikalı']
        },
        {
            id: 3,
            title: 'Premium Destek',
            highlight: '7/24',
            desc: 'Yılbaşına özel, tüm premium üyeliklerde %50 indirim! Sınırsız danışmanlık ve öncelikli destek.',
            badge: '⭐ ÖZEL FIRSAT',
            image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
            buttonText: 'Premium\'a Geç',
            buttonLink: '/vip-selection',
            stats: ['7/24 Destek', '50% İndirim', 'Öncelikli']
        },
        {
            id: 4,
            title: 'En Popüler Mağazalar',
            highlight: 'Popüler Mağazalar',
            desc: 'Binlerce satıcı arasından sıyrılan, müşterilerin en çok tercih ettiği mağazaları keşfet!',
            badge: '🏆 REKABET',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed2f7c0d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            buttonText: 'Mağazaları Gör',
            buttonLink: '/shops',
            stats: ['1.2K+ Mağaza', '4.9⭐ Puan', '100K+ Satış']
        }
    ];

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setProgress(0);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        setProgress(0);
    }, [slides.length]);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide, isAutoPlaying]);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0;
                return prev + 0.6;
            });
        }, 35);
        return () => clearInterval(timer);
    }, [currentSlide, isAutoPlaying]);

    const current = slides[currentSlide];

    // Partiküller
    const particles = Array(20).fill(0).map((_, i) => (
        <div
            key={i}
            style={{
                position: 'absolute',
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                background: `radial-gradient(circle, ${colors.primary}, transparent)`,
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.4,
                animation: `floatParticle ${Math.random() * 10 + 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
            }}
        />
    ));

    return (
        <section
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            style={{
                width: '100%',
                height: '90vh',
                minHeight: 650,
                maxHeight: 900,
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                backgroundColor: colors.bg
            }}
        >
            <style>{`
                @keyframes floatParticle {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
                    50% { transform: translateY(-60px) translateX(40px); opacity: 0.6; }
                }
                @keyframes slowZoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.1); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); filter: blur(8px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(-40px); filter: blur(8px); }
                    to { opacity: 1; transform: translateX(0); filter: blur(0); }
                }
                .hero-bg-zoom {
                    animation: slowZoom 14s ease-out infinite alternate;
                }
                .hero-content-slide {
                    animation: slideUp 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
                .hero-badge-slide {
                    animation: slideRight 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
            `}</style>

            {/* Partiküller */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
                {particles}
            </div>

            {/* Arka Plan Resmi */}
            <div
                className="hero-bg-zoom"
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${current.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 8s ease'
                }}
            />

            {/* Overlay - Gradient */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(90deg, 
                    ${isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.7)'} 0%, 
                    ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.4)'} 40%, 
                    transparent 100%)`,
                zIndex: 10
            }} />

            {/* Ana İçerik */}
            <div style={{
                position: 'relative',
                zIndex: 20,
                maxWidth: 1400,
                margin: '0 auto',
                padding: '0 48px',
                height: '100%',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{ maxWidth: 680, color: 'white' }}>
                    {/* Badge */}
                    <div className="hero-badge-slide" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        background: `rgba(224, 124, 92, 0.15)`,
                        backdropFilter: 'blur(10px)',
                        padding: '8px 24px',
                        borderRadius: 60,
                        marginBottom: 28,
                        border: `1px solid rgba(224, 124, 92, 0.3)`,
                        boxShadow: `0 0 20px rgba(224, 124, 92, 0.15)`
                    }}>
                        <span style={{ fontSize: 16 }}>{current.badge.split(' ')[0]}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>
                            {current.badge.slice(2)}
                        </span>
                    </div>

                    {/* Başlık */}
                    <h1 className="hero-content-slide" style={{
                        fontSize: 'clamp(42px, 6vw, 68px)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: 20,
                        letterSpacing: '-0.02em'
                    }}>
                        {current.title.split(current.highlight)[0]}
                        <span style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>
                            {current.highlight}
                        </span>
                    </h1>

                    {/* Açıklama */}
                    <p className="hero-content-slide" style={{
                        fontSize: 'clamp(15px, 1.2vw, 18px)',
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.85)',
                        marginBottom: 35,
                        maxWidth: 580
                    }}>
                        {current.desc}
                    </p>

                    {/* Buton */}
                    <button
                        className="hero-content-slide"
                        onClick={() => navigate(current.buttonLink)}
                        style={{
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                            border: 'none',
                            padding: '14px 38px',
                            borderRadius: 50,
                            color: 'white',
                            fontSize: 15,
                            fontWeight: 600,
                            letterSpacing: 1.5,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                            marginBottom: 45,
                            boxShadow: `0 10px 25px rgba(224, 124, 92, 0.35)`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                            e.currentTarget.style.boxShadow = `0 20px 35px rgba(224, 124, 92, 0.5)`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = `0 10px 25px rgba(224, 124, 92, 0.35)`;
                        }}
                    >
                        <span>{current.buttonText}</span>
                        <span style={{ fontSize: 18 }}>→</span>
                    </button>

                    {/* İstatistikler */}
                    <div className="hero-content-slide" style={{
                        display: 'flex',
                        gap: 45,
                        paddingTop: 25,
                        borderTop: `1px solid rgba(255,255,255,0.12)`
                    }}>
                        {current.stats.map((stat, i) => (
                            <div key={i} style={{ textAlign: 'left' }}>
                                <div style={{
                                    fontSize: 28,
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, #ffffff, ${colors.primaryLight})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    {stat.split(' ')[0]}
                                </div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.5 }}>
                                    {stat.split(' ').slice(1).join(' ')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigasyon Okları */}
            <button
                onClick={prevSlide}
                style={{
                    position: 'absolute',
                    left: 25,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid rgba(255,255,255,0.15)`,
                    color: 'white',
                    fontSize: 22,
                    cursor: 'pointer',
                    zIndex: 30,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.primary;
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
            >
                ←
            </button>
            <button
                onClick={nextSlide}
                style={{
                    position: 'absolute',
                    right: 25,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid rgba(255,255,255,0.15)`,
                    color: 'white',
                    fontSize: 22,
                    cursor: 'pointer',
                    zIndex: 30,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.primary;
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
            >
                →
            </button>

            {/* Dotlar */}
            <div style={{
                position: 'absolute',
                bottom: 35,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 12,
                zIndex: 30,
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(8px)',
                padding: '10px 22px',
                borderRadius: 50
            }}>
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setCurrentSlide(idx);
                            setProgress(0);
                        }}
                        style={{
                            width: idx === currentSlide ? 36 : 8,
                            height: 8,
                            borderRadius: 8,
                            background: idx === currentSlide ? colors.primary : 'rgba(255,255,255,0.4)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: 3,
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
                zIndex: 30,
                transition: 'width 0.05s linear'
            }} />
        </section>
    );
};

export default Hero;