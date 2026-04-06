// components/Testimonials.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TestimonialsProps {
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

const Testimonials: React.FC<TestimonialsProps> = ({ colors, isDarkMode = true }) => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const testimonials = [
        {
            id: 1,
            user: { name: 'Ahmet Yılmaz', avatar: '👨‍💻', location: 'İstanbul', verified: true, purchases: 12 },
            rating: 5,
            date: '2 gün önce',
            text: 'MacBook Pro M3 modelini sipariş verdim, ertesi gün elime ulaştı. Cihaz harika, pil ömrü inanılmaz. TechVerse mağazasına da ayrıca teşekkürler, orijinal ürün ve sıfır sorun!',
            product: { name: 'MacBook Pro 14" M3', image: '💻', store: 'TechVerse' },
            likes: 124,
            tags: ['laptop', 'apple', 'hızlı kargo']
        },
        {
            id: 2,
            user: { name: 'Zeynep Kaya', avatar: '👩‍🎨', location: 'Ankara', verified: true, purchases: 8 },
            rating: 5,
            date: '3 gün önce',
            text: 'Sony WH-1000XM5 kulaklık için yorumlara güvenip aldım ve pişman değilim. Ses kalitesi mükemmel, gürültü engelleme harika.',
            product: { name: 'Sony WH-1000XM5', image: '🎧', store: 'GadgetHub' },
            likes: 89,
            tags: ['kulaklık', 'sony', 'ses']
        },
        {
            id: 3,
            user: { name: 'Mehmet Demir', avatar: '👨‍🏫', location: 'İzmir', verified: true, purchases: 5 },
            rating: 4,
            date: '5 gün önce',
            text: 'iPad Pro 12.9" aldım, tasarım ve performans muhteşem. DigitalDream mağazası ilgiliydi, teşekkürler.',
            product: { name: 'iPad Pro 12.9"', image: '📱', store: 'DigitalDream' },
            likes: 56,
            tags: ['tablet', 'apple', 'ipad']
        },
        {
            id: 4,
            user: { name: 'Elif Yıldız', avatar: '👩‍🔬', location: 'Bursa', verified: true, purchases: 15 },
            rating: 5,
            date: '1 hafta önce',
            text: 'PS5 Slim Digital aldım, oyun keyfi bambaşka! GameStation mağazası çok ilgiliydi, hızlı kargo için teşekkürler.',
            product: { name: 'PS5 Slim Digital', image: '🎮', store: 'GameStation' },
            likes: 167,
            tags: ['oyun', 'playstation', 'konsol']
        },
        {
            id: 5,
            user: { name: 'Can Öztürk', avatar: '👨‍🎤', location: 'Antalya', verified: false, purchases: 3 },
            rating: 5,
            date: '1 hafta önce',
            text: 'Logitech MX Master 3S fareyi aldım, ergonomisi ve performansı harika. SoundWave mağazasına teşekkürler.',
            product: { name: 'Logitech MX Master 3S', image: '🖱️', store: 'SoundWave' },
            likes: 78,
            tags: ['mouse', 'logitech', 'aksesuar']
        },
        {
            id: 6,
            user: { name: 'Seda Aydın', avatar: '👩‍💼', location: 'Kocaeli', verified: true, purchases: 7 },
            rating: 5,
            date: '2 hafta önce',
            text: 'iPhone 15 Pro Max aldım, kamerası ve performansı mükemmel. TechVerse mağazası orijinal ürün garantisi verdi.',
            product: { name: 'iPhone 15 Pro Max', image: '📱', store: 'TechVerse' },
            likes: 145,
            tags: ['telefon', 'apple', 'iphone']
        }
    ];

    const filterTags = [
        { id: 'all', label: 'Tüm Yorumlar', icon: '💬' },
        { id: '5star', label: '5 Yıldız', icon: '⭐⭐⭐⭐⭐' },
        { id: '4star', label: '4 Yıldız', icon: '⭐⭐⭐⭐' },
        { id: 'laptop', label: 'Laptop', icon: '💻' },
        { id: 'phone', label: 'Telefon', icon: '📱' },
        { id: 'audio', label: 'Ses', icon: '🎧' },
        { id: 'gaming', label: 'Oyun', icon: '🎮' }
    ];

    const filteredTestimonials = testimonials.filter(t => {
        if (activeFilter === 'all') return true;
        if (activeFilter === '5star') return t.rating === 5;
        if (activeFilter === '4star') return t.rating === 4;
        if (activeFilter === 'laptop') return t.tags.includes('laptop');
        if (activeFilter === 'phone') return t.tags.includes('telefon');
        if (activeFilter === 'audio') return t.tags.includes('kulaklık') || t.tags.includes('ses');
        if (activeFilter === 'gaming') return t.tags.includes('oyun');
        return true;
    });

    const averageRating = (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1);
    const totalReviews = testimonials.length;

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < rating ? '#ffc107' : isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', fontSize: 14 }}>
                ★
            </span>
        ));
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
                @keyframes testimonialFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes testimonialPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes testimonialBounce {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(15deg) scale(1.2); }
                }
                .testimonial-card {
                    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .testimonial-card:hover {
                    transform: translateY(-12px) scale(1.02);
                }
            `}</style>

            {/* Dekoratif Arka Plan Yıldızları */}
            <div style={{
                position: 'absolute',
                top: '5%',
                left: '5%',
                fontSize: 180,
                opacity: 0.03,
                color: colors.primary,
                transform: 'rotate(-15deg)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
            }}>
                ⭐⭐⭐⭐⭐
            </div>
            <div style={{
                position: 'absolute',
                bottom: '5%',
                right: '5%',
                fontSize: 180,
                opacity: 0.03,
                color: colors.primaryLight,
                transform: 'rotate(10deg)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
            }}>
                ⭐⭐⭐⭐⭐
            </div>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                {/* HEADER */}
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 12,
                        background: `rgba(224, 124, 92, 0.12)`,
                        padding: '10px 28px',
                        borderRadius: 60,
                        marginBottom: 24,
                        border: `1px solid ${colors.primary}30`
                    }}>
                        <span style={{ fontSize: 18 }}>⭐</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: colors.primary, letterSpacing: 2 }}>
                            MÜŞTERİ YORUMLARI
                        </span>
                        <span style={{ fontSize: 18 }}>⭐</span>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(36px, 4vw, 52px)',
                        fontWeight: 800,
                        color: colors.text,
                        marginBottom: 16
                    }}>
                        <span style={{ color: colors.primary }}>Gerçek müşteriler</span>, gerçek deneyimler
                    </h2>
                    <p style={{
                        fontSize: 16,
                        color: colors.textSecondary,
                        maxWidth: 650,
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Binlerce müşterimiz alışveriş deneyimlerini paylaştı. 
                        Sen de Craftora farkını keşfedenler arasına katıl!
                    </p>
                </div>

                {/* GENEL PUAN */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 50,
                    marginBottom: 50,
                    padding: '35px 40px',
                    background: isDarkMode ? colors.surface : '#ffffff',
                    borderRadius: 60,
                    boxShadow: `0 20px 40px ${isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'}`,
                    border: `1px solid ${colors.border}`,
                    flexWrap: 'wrap'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: 64,
                            fontWeight: 800,
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1,
                            marginBottom: 5
                        }}>
                            {averageRating}
                        </div>
                        <div style={{ fontSize: 12, color: colors.textSecondary, letterSpacing: 2 }}>ORTALAMA PUAN</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 8, fontSize: 28, marginBottom: 8 }}>
                            {renderStars(Number(averageRating))}
                        </div>
                        <div style={{ fontSize: 14, color: colors.textSecondary }}>{totalReviews} yorum</div>
                    </div>
                    <div>
                        <span style={{
                            padding: '8px 20px',
                            background: `rgba(224, 124, 92, 0.1)`,
                            borderRadius: 40,
                            color: colors.primary,
                            fontSize: 14,
                            fontWeight: 600
                        }}>
                            ✓ %98 memnuniyet
                        </span>
                    </div>
                </div>

                {/* FİLTRELER */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 12,
                    marginBottom: 50,
                    flexWrap: 'wrap'
                }}>
                    {filterTags.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => setActiveFilter(tag.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '10px 24px',
                                background: activeFilter === tag.id 
                                    ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`
                                    : (isDarkMode ? colors.surface2 : '#ffffff'),
                                border: `1px solid ${activeFilter === tag.id ? 'transparent' : colors.border}`,
                                borderRadius: 50,
                                fontSize: 13,
                                fontWeight: 600,
                                color: activeFilter === tag.id ? 'white' : colors.textSecondary,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (activeFilter !== tag.id) {
                                    e.currentTarget.style.borderColor = colors.primary;
                                    e.currentTarget.style.color = colors.primary;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeFilter !== tag.id) {
                                    e.currentTarget.style.borderColor = colors.border;
                                    e.currentTarget.style.color = colors.textSecondary;
                                }
                            }}
                        >
                            <span>{tag.icon}</span>
                            <span>{tag.label}</span>
                        </button>
                    ))}
                </div>

                {/* YORUM GRID */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: 30,
                    marginBottom: 50
                }}>
                    {filteredTestimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="testimonial-card"
                            onMouseEnter={() => setHoveredId(testimonial.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{
                                background: isDarkMode ? colors.surface : '#ffffff',
                                borderRadius: 32,
                                padding: 28,
                                border: `1px solid ${hoveredId === testimonial.id ? colors.primary : colors.border}`,
                                boxShadow: hoveredId === testimonial.id 
                                    ? `0 20px 40px ${colors.primary}20` 
                                    : '0 4px 12px rgba(0,0,0,0.02)',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            {/* Doğrulanmış Badge */}
                            <div style={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                background: `rgba(224, 124, 92, 0.08)`,
                                borderRadius: 30,
                                padding: '5px 12px',
                                fontSize: 11,
                                fontWeight: 600,
                                color: colors.primary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                            }}>
                                <span>✓</span> Doğrulanmış Alışveriş
                            </div>

                            {/* Kullanıcı Bilgisi */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                                <div style={{
                                    width: 60,
                                    height: 60,
                                    background: hoveredId === testimonial.id 
                                        ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`
                                        : `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryLight}10)`,
                                    borderRadius: 20,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 28,
                                    transition: 'all 0.3s ease'
                                }}>
                                    {testimonial.user.avatar}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 4 }}>
                                        {testimonial.user.name}
                                    </h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 13, color: colors.textSecondary }}>{testimonial.user.location}</span>
                                        {testimonial.user.verified && (
                                            <span style={{ fontSize: 11, color: '#4CAF50', background: '#4CAF5010', padding: '2px 8px', borderRadius: 20 }}>
                                                ✓ Onaylı Hesap
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Puan ve Tarih */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ display: 'flex', gap: 3 }}>
                                    {renderStars(testimonial.rating)}
                                </div>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>{testimonial.date}</span>
                            </div>

                            {/* Yorum Metni */}
                            <p style={{
                                fontSize: 14,
                                lineHeight: 1.7,
                                color: colors.textSecondary,
                                marginBottom: 20,
                                fontStyle: 'italic',
                                paddingLeft: 12,
                                borderLeft: `2px solid ${colors.primary}40`
                            }}>
                                "{testimonial.text}"
                            </p>

                            {/* Satın Alınan Ürün */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: 12,
                                background: isDarkMode ? colors.surface2 : '#f8f9fa',
                                borderRadius: 20,
                                marginBottom: 16
                            }}>
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    background: isDarkMode ? colors.surface : '#ffffff',
                                    borderRadius: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 20
                                }}>
                                    {testimonial.product.image}
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{testimonial.product.name}</div>
                                    <div style={{ fontSize: 11, color: colors.primary }}>{testimonial.product.store} mağazasından</div>
                                </div>
                            </div>

                            {/* Beğeni ve Paylaşım */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingTop: 12,
                                borderTop: `1px solid ${colors.border}`
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.textSecondary, fontSize: 12 }}>
                                    <span>❤️</span> {testimonial.likes} kişi beğendi
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.primary, fontSize: 12, cursor: 'pointer' }}>
                                    <span>↗️</span> Paylaş
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tüm Yorumlar Butonu */}
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/reviews')}
                        style={{
                            background: 'transparent',
                            border: `2px solid ${colors.primary}`,
                            padding: '14px 48px',
                            borderRadius: 60,
                            color: colors.primary,
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 12
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`;
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = `0 15px 30px ${colors.primary}40`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = colors.primary;
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        TÜM YORUMLARI GÖR
                        <span style={{ fontSize: 18 }}>→</span>
                    </button>
                    <p style={{
                        marginTop: 20,
                        fontSize: 13,
                        color: colors.textSecondary
                    }}>
                        Toplam 12.432 doğrulanmış müşteri yorumu
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;