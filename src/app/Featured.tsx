// components/Featured.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FeaturedProps {
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

const Featured: React.FC<FeaturedProps> = ({ colors, isDarkMode = true }) => {
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const products = [
        {
            id: 1,
            name: 'MacBook Pro 14" M3',
            category: 'Laptop',
            price: 1299,
            oldPrice: 1499,
            discount: 20,
            rating: 4.8,
            reviews: 124,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1026&q=80',
            badge: '🔥 SÜPER FIRSAT',
            sold: '2.3K',
            color: '#4f46e5'
        },
        {
            id: 2,
            name: 'Sony WH-1000XM5',
            category: 'Kulaklık',
            price: 299,
            oldPrice: 399,
            discount: 25,
            rating: 4.9,
            reviews: 203,
            image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80',
            badge: '🎧 EN ÇOK SATAN',
            sold: '1.8K',
            color: '#10b981'
        },
        {
            id: 3,
            name: 'iPhone 15 Pro Max',
            category: 'Telefon',
            price: 1199,
            oldPrice: 1299,
            discount: 8,
            rating: 4.7,
            reviews: 312,
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            badge: '✨ YENİ',
            sold: '3.1K',
            color: '#f59e0b'
        },
        {
            id: 4,
            name: 'iPad Air 5. Nesil',
            category: 'Tablet',
            price: 599,
            oldPrice: 699,
            discount: 15,
            rating: 4.8,
            reviews: 89,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            badge: '📱 HAFTANIN FIRSATI',
            sold: '1.2K',
            color: '#ec4899'
        }
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ 
                color: i < Math.floor(rating) ? '#ffc107' : 'rgba(255,255,255,0.2)', 
                fontSize: 14,
                transition: 'all 0.2s ease'
            }}>
                ★
            </span>
        ));
    };

    return (
        <section style={{
            padding: '100px 0',
            backgroundColor: isDarkMode ? colors.bg : '#f8f9fa',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style>{`
                @keyframes floatBadge {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(200%) skewX(-15deg); }
                }
                @keyframes cardFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .featured-card {
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .featured-card:hover {
                    transform: translateY(-12px) scale(1.02);
                }
                .featured-img {
                    transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .featured-card:hover .featured-img {
                    transform: scale(1.12);
                }
                .featured-overlay {
                    opacity: 0;
                    transition: opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .featured-card:hover .featured-overlay {
                    opacity: 1;
                }
                .featured-btn {
                    transform: translateY(20px);
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .featured-card:hover .featured-btn {
                    transform: translateY(0);
                }
                .featured-badge {
                    animation: floatBadge 2s ease-in-out infinite;
                }
            `}</style>

            {/* Dekoratif Arka Plan Işıkları */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: 300,
                height: 300,
                background: `radial-gradient(circle, ${colors.primary}15, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(40px)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                width: 250,
                height: 250,
                background: `radial-gradient(circle, ${colors.primaryLight}10, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(40px)'
            }} />

            <div style={{
                maxWidth: 1400,
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
                        backdropFilter: 'blur(10px)',
                        padding: '10px 28px',
                        borderRadius: 60,
                        marginBottom: 24,
                        border: `1px solid ${colors.primary}30`
                    }}>
                        <span style={{ fontSize: 22, animation: 'floatBadge 2s ease-in-out infinite' }}>⚡</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: colors.primary, letterSpacing: 3 }}>
                            HAFTANIN FAVORİLERİ
                        </span>
                        <span style={{ fontSize: 22, animation: 'floatBadge 2s ease-in-out infinite 0.5s' }}>🔥</span>
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(36px, 4vw, 48px)',
                        fontWeight: 800,
                        color: colors.text,
                        marginBottom: 16,
                        letterSpacing: '-0.02em'
                    }}>
                        Bu hafta en çok <span style={{ 
                            color: colors.primary,
                            position: 'relative',
                            display: 'inline-block'
                        }}>
                            satanlar
                            <span style={{
                                position: 'absolute',
                                bottom: 4,
                                left: 0,
                                right: 0,
                                height: 8,
                                background: `${colors.primary}30`,
                                borderRadius: 4,
                                zIndex: -1
                            }} />
                        </span>
                    </h2>
                    <p style={{
                        fontSize: 16,
                        color: colors.textSecondary,
                        maxWidth: 550,
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Binlerce müşterinin tercihi, en popüler ürünler sizi bekliyor
                    </p>
                </div>

                {/* Ürün Grid - 4'lü */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 30
                }}>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="featured-card"
                            onMouseEnter={() => setHoveredId(product.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{
                                background: isDarkMode ? colors.surface : '#ffffff',
                                borderRadius: 28,
                                overflow: 'hidden',
                                boxShadow: hoveredId === product.id 
                                    ? `0 30px 50px rgba(0,0,0,0.25), 0 0 0 1px ${colors.primary}40 inset` 
                                    : `0 4px 20px rgba(0,0,0,0.08)`,
                                border: `1px solid ${colors.border}`,
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            {/* Neon Glow Efekti */}
                            {hoveredId === product.id && (
                                <div style={{
                                    position: 'absolute',
                                    top: -2,
                                    left: -2,
                                    right: -2,
                                    bottom: -2,
                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight}, transparent)`,
                                    borderRadius: 30,
                                    zIndex: -1,
                                    opacity: 0.5,
                                    filter: 'blur(8px)'
                                }} />
                            )}

                            {/* Resim Alanı */}
                            <div style={{
                                position: 'relative',
                                height: 280,
                                overflow: 'hidden',
                                backgroundColor: '#1a1a2e'
                            }}>
                                <img
                                    className="featured-img"
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        willChange: 'transform'
                                    }}
                                />
                                
                                {/* Badge */}
                                <div className="featured-badge" style={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    background: `linear-gradient(135deg, ${product.color}, ${product.color}dd)`,
                                    padding: '6px 16px',
                                    borderRadius: 30,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: 'white',
                                    boxShadow: `0 4px 15px ${product.color}60`,
                                    letterSpacing: 0.5,
                                    zIndex: 5
                                }}>
                                    {product.badge}
                                </div>

                                {/* İndirim Çemberi */}
                                <div style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    width: 50,
                                    height: 50,
                                    background: `linear-gradient(135deg, #ff4757, #ff6b6b)`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(255,71,87,0.4)',
                                    zIndex: 5
                                }}>
                                    -{product.discount}%
                                </div>

                                {/* Hover Overlay */}
                                <div className="featured-overlay" style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: `linear-gradient(135deg, ${colors.primary}ee, ${colors.primaryDark}ee)`,
                                    backdropFilter: 'blur(4px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: 12,
                                    zIndex: 10
                                }}>
                                    <button 
                                        className="featured-btn"
                                        style={{
                                            background: 'white',
                                            border: 'none',
                                            padding: '12px 32px',
                                            borderRadius: 50,
                                            color: colors.primary,
                                            fontWeight: 700,
                                            fontSize: 14,
                                            cursor: 'pointer',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                                            letterSpacing: 1
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.background = colors.primary;
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.color = colors.primary;
                                        }}
                                    >
                                        Hızlı Bakış
                                    </button>
                                    <span style={{
                                        fontSize: 12,
                                        color: 'white',
                                        opacity: 0.8,
                                        letterSpacing: 1
                                    }}>
                                        Detayları gör →
                                    </span>
                                </div>
                            </div>

                            {/* Bilgiler */}
                            <div style={{ padding: '22px 20px 24px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 10
                                }}>
                                    <span style={{
                                        fontSize: 12,
                                        color: colors.primary,
                                        fontWeight: 700,
                                        letterSpacing: 1.5,
                                        background: `rgba(224, 124, 92, 0.1)`,
                                        padding: '4px 12px',
                                        borderRadius: 20
                                    }}>
                                        {product.category}
                                    </span>
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {renderStars(product.rating)}
                                    </div>
                                </div>
                                
                                <h3 style={{
                                    fontSize: 19,
                                    fontWeight: 700,
                                    color: colors.text,
                                    marginBottom: 12,
                                    lineHeight: 1.3,
                                    letterSpacing: '-0.3px'
                                }}>
                                    {product.name}
                                </h3>

                                {/* Fiyat */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: 10,
                                    marginBottom: 16,
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{
                                        fontSize: 28,
                                        fontWeight: 800,
                                        color: colors.primary
                                    }}>
                                        ${product.price}
                                    </span>
                                    <span style={{
                                        fontSize: 16,
                                        color: colors.textSecondary,
                                        textDecoration: 'line-through'
                                    }}>
                                        ${product.oldPrice}
                                    </span>
                                </div>

                                {/* Progress Bar + Satış Bilgisi */}
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 8,
                                        fontSize: 12
                                    }}>
                                        <span style={{ color: colors.textSecondary }}>Bu hafta satıldı</span>
                                        <span style={{ color: colors.primary, fontWeight: 700 }}>{product.sold}</span>
                                    </div>
                                    <div style={{
                                        height: 6,
                                        background: colors.surface2,
                                        borderRadius: 3,
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${Math.min(100, parseInt(product.sold) / 40 * 100)}%`,
                                            height: '100%',
                                            background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
                                            borderRadius: 3,
                                            transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                </div>
                            </div>

                            {/* Alt Dekoratif Çizgi */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 20,
                                right: 20,
                                height: 3,
                                background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.primaryLight}, transparent)`,
                                borderRadius: 3,
                                opacity: hoveredId === product.id ? 1 : 0,
                                transition: 'opacity 0.3s ease'
                            }} />
                        </div>
                    ))}
                </div>

                {/* Tüm Ürünler Butonu */}
                <div style={{ textAlign: 'center', marginTop: 60 }}>
                    <button
                        onClick={() => navigate('/shop')}
                        style={{
                            background: 'linear-gradient(135deg, transparent, transparent)',
                            border: `2px solid ${colors.primary}`,
                            padding: '14px 48px',
                            borderRadius: 60,
                            color: colors.primary,
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 12,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`;
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = `0 15px 30px rgba(224, 124, 92, 0.35)`;
                            e.currentTarget.style.gap = '16px';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = colors.primary;
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.gap = '12px';
                        }}
                    >
                        <span>Tüm Ürünleri Keşfet</span>
                        <span style={{ fontSize: 18, transition: 'transform 0.3s ease' }}>→</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Featured;