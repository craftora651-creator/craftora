// components/Footer.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
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

const Footer: React.FC<FooterProps> = ({ colors, isDarkMode = true }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('📧 E-posta başarıyla kaydedildi! (Demo)');
        setEmail('');
    };

    return (
        <footer style={{
            background: isDarkMode ? colors.bg : '#f8f9fa',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            borderTop: `1px solid ${colors.border}`,
            color: isDarkMode ? 'white' : colors.text
        }}>
            <style>{`
                @keyframes footerTextFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(-1deg); }
                }
                @keyframes footerShine {
                    0% { left: -100%; }
                    20% { left: 100%; }
                    100% { left: 100%; }
                }
                .footer-link {
                    transition: all 0.3s ease;
                }
                .footer-link:hover {
                    color: ${colors.primary};
                    transform: translateX(5px);
                }
                .social-icon {
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .social-icon:hover {
                    background: ${colors.primary};
                    transform: translateY(-8px) scale(1.1);
                    border-color: transparent;
                }
                .payment-icon {
                    transition: all 0.3s ease;
                }
                .payment-icon:hover {
                    background: rgba(255,255,255,0.08);
                    border-color: ${colors.primary}50;
                    transform: translateY(-3px);
                }
                .contact-icon {
                    transition: all 0.3s ease;
                }
                .contact-icon:hover {
                    background: ${colors.primary};
                    color: white;
                    transform: scale(1.1);
                    border-color: transparent;
                }
            `}</style>

            {/* Dekoratif Arka Plan */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                right: '5%',
                fontSize: 180,
                fontWeight: 900,
                opacity: 0.02,
                color: isDarkMode ? 'white' : colors.primary,
                letterSpacing: 20,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                animation: 'footerTextFloat 30s ease-in-out infinite'
            }}>
                CRAFTORA
            </div>

            {/* NEWSLETTER BÖLÜMÜ */}
            <div style={{
                padding: '80px 0',
                background: isDarkMode ? 'rgba(224, 124, 92, 0.03)' : 'rgba(0,0,0,0.02)',
                borderBottom: `1px solid ${colors.border}`
            }}>
                <div style={{
                    maxWidth: 1280,
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 60,
                    flexWrap: 'wrap'
                }}>
                    {/* Sol Taraf - Metin */}
                    <div style={{ flex: 1, minWidth: 280 }}>
                        <div style={{
                            display: 'inline-block',
                            background: `rgba(224, 124, 92, 0.1)`,
                            border: `1px solid ${colors.primary}30`,
                            color: colors.primary,
                            padding: '8px 24px',
                            borderRadius: 50,
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: 3,
                            marginBottom: 24,
                            textTransform: 'uppercase'
                        }}>
                            ✉️ NEWSLETTER
                        </div>
                        <h2 style={{
                            fontSize: 'clamp(32px, 4vw, 48px)',
                            fontWeight: 800,
                            lineHeight: 1.2,
                            marginBottom: 16,
                            color: isDarkMode ? 'white' : colors.text,
                            letterSpacing: '-0.02em'
                        }}>
                            Fırsatları <span style={{ color: colors.primary }}>kaçırma</span>
                        </h2>
                        <p style={{
                            fontSize: 16,
                            lineHeight: 1.7,
                            color: isDarkMode ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
                            maxWidth: 450
                        }}>
                            Haftalık özel indirimler, yeni ürün haberleri ve 
                            sürpriz kampanyalardan ilk sen haberdar ol!
                        </p>
                    </div>

                    {/* Sağ Taraf - Form */}
                    <div style={{ flex: 1, minWidth: 320 }}>
                        <form onSubmit={handleSubmit} style={{
                            display: 'flex',
                            gap: 12,
                            background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                            borderRadius: 80,
                            padding: '5px',
                            border: `1px solid ${colors.border}`,
                            transition: 'all 0.3s ease'
                        }}>
                            <input
                                type="email"
                                placeholder="E-posta adresiniz"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    flex: 1,
                                    padding: '16px 24px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: isDarkMode ? 'white' : colors.text,
                                    fontSize: 15,
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '14px 32px',
                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                                    border: 'none',
                                    borderRadius: 60,
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: 700,
                                    letterSpacing: 1.5,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = `0 10px 25px ${colors.primary}40`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <span>ABONE OL</span>
                                <span style={{ fontSize: 16 }}>✈️</span>
                            </button>
                        </form>
                        <div style={{
                            display: 'flex',
                            gap: 20,
                            marginTop: 16,
                            color: isDarkMode ? 'rgba(255,255,255,0.4)' : colors.textSecondary,
                            fontSize: 12,
                            flexWrap: 'wrap'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🔒 256-bit SSL</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🚫 Spam yok</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>⚡ Hemen başla</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>✅ Her an ayrıl</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER ANA İÇERİK */}
            <div style={{
                maxWidth: 1280,
                margin: '0 auto',
                padding: '80px 24px 60px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 40,
                position: 'relative',
                zIndex: 5
            }}>
                {/* MARKA BÖLÜMÜ */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                            borderRadius: 14,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            color: 'white',
                            boxShadow: `0 8px 20px ${colors.primary}30`
                        }}>
                            ✨
                        </div>
                        <span style={{
                            fontSize: 26,
                            fontWeight: 800,
                            background: `linear-gradient(135deg, ${isDarkMode ? '#ffffff' : '#1a1a1a'}, ${colors.primaryLight})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.5px'
                        }}>
                            CRAFT<span style={{ color: colors.primary, WebkitTextFillColor: colors.primary }}>ORA</span>
                        </span>
                    </div>
                    <p style={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary,
                        marginBottom: 24,
                        maxWidth: 280
                    }}>
                        Teknoloji tutkunları için premium ürünler, 
                        hızlı teslimat ve müşteri memnuniyeti odaklı 
                        alışveriş deneyimi.
                    </p>

                    {/* Sosyal Medya */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 30 }}>
                        {['📷', '🐦', '📘', '▶️', '🎵'].map((icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="social-icon"
                                style={{
                                    width: 40,
                                    height: 40,
                                    background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 18,
                                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
                                    textDecoration: 'none'
                                }}
                            >
                                {icon}
                            </a>
                        ))}
                    </div>

                    {/* Ödeme Yöntemleri */}
                    <div>
                        <span style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: isDarkMode ? 'rgba(255,255,255,0.8)' : colors.text,
                            letterSpacing: 2,
                            textTransform: 'uppercase',
                            display: 'block',
                            marginBottom: 12
                        }}>
                            Ödeme Yöntemleri
                        </span>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {['VISA', 'MC', 'AMEX', 'Pay', '📱'].map((payment, i) => (
                                <span
                                    key={i}
                                    className="payment-icon"
                                    style={{
                                        padding: '6px 12px',
                                        background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: 8,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {payment}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alışveriş */}
                <div>
                    <h4 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: isDarkMode ? 'white' : colors.text,
                        marginBottom: 24,
                        position: 'relative',
                        paddingBottom: 12
                    }}>
                        Alışveriş
                        <span style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: 40,
                            height: 3,
                            background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
                            borderRadius: 3
                        }} />
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {['Tüm Ürünler', 'Yeni Ürünler', 'İndirimdekiler', 'En Çok Satanlar', 'Özel Fırsatlar', 'Hediye Kartı'].map((item, i) => (
                            <li key={i}>
                                <a
                                    href="#"
                                    className="footer-link"
                                    style={{
                                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary,
                                        textDecoration: 'none',
                                        fontSize: 14,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6
                                    }}
                                >
                                    <span style={{ fontSize: 16, color: colors.primary }}>›</span>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Kategoriler */}
                <div>
                    <h4 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: isDarkMode ? 'white' : colors.text,
                        marginBottom: 24,
                        position: 'relative',
                        paddingBottom: 12
                    }}>
                        Kategoriler
                        <span style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: 40,
                            height: 3,
                            background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
                            borderRadius: 3
                        }} />
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {['Laptop & Bilgisayar', 'Telefon & Tablet', 'Ses & Kulaklık', 'Oyun & Konsol', 'Aksesuarlar', 'Akıllı Ev'].map((item, i) => (
                            <li key={i}>
                                <a
                                    href="#"
                                    className="footer-link"
                                    style={{
                                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary,
                                        textDecoration: 'none',
                                        fontSize: 14,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6
                                    }}
                                >
                                    <span style={{ fontSize: 16, color: colors.primary }}>›</span>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Yardım & Destek */}
                <div>
                    <h4 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: isDarkMode ? 'white' : colors.text,
                        marginBottom: 24,
                        position: 'relative',
                        paddingBottom: 12
                    }}>
                        Yardım & Destek
                        <span style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: 40,
                            height: 3,
                            background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
                            borderRadius: 3
                        }} />
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {['Sıkça Sorulan Sorular', 'Kargo Takibi', 'İade & Değişim', 'Garanti Koşulları', 'Üyelik Sözleşmesi', 'Gizlilik Politikası'].map((item, i) => (
                            <li key={i}>
                                <a
                                    href="#"
                                    className="footer-link"
                                    style={{
                                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary,
                                        textDecoration: 'none',
                                        fontSize: 14,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6
                                    }}
                                >
                                    <span style={{ fontSize: 16, color: colors.primary }}>›</span>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* İletişim */}
                <div>
                    <h4 style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: isDarkMode ? 'white' : colors.text,
                        marginBottom: 24,
                        position: 'relative',
                        paddingBottom: 12
                    }}>
                        İletişim
                        <span style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: 40,
                            height: 3,
                            background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
                            borderRadius: 3
                        }} />
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span className="contact-icon" style={{
                                width: 36,
                                height: 36,
                                background: isDarkMode ? 'rgba(224,124,92,0.1)' : 'rgba(0,0,0,0.05)',
                                border: `1px solid ${colors.primary}20`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                color: colors.primary
                            }}>📍</span>
                            <span style={{ fontSize: 14, color: isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary }}>İstanbul, Türkiye</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span className="contact-icon" style={{
                                width: 36,
                                height: 36,
                                background: isDarkMode ? 'rgba(224,124,92,0.1)' : 'rgba(0,0,0,0.05)',
                                border: `1px solid ${colors.primary}20`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                color: colors.primary
                            }}>📞</span>
                            <span style={{ fontSize: 14, color: isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary }}>+90 (212) 444 0 000</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span className="contact-icon" style={{
                                width: 36,
                                height: 36,
                                background: isDarkMode ? 'rgba(224,124,92,0.1)' : 'rgba(0,0,0,0.05)',
                                border: `1px solid ${colors.primary}20`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                color: colors.primary
                            }}>✉️</span>
                            <span style={{ fontSize: 14, color: isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary }}>destek@craftora.com</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span className="contact-icon" style={{
                                width: 36,
                                height: 36,
                                background: isDarkMode ? 'rgba(224,124,92,0.1)' : 'rgba(0,0,0,0.05)',
                                border: `1px solid ${colors.primary}20`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                color: colors.primary
                            }}>⏰</span>
                            <span style={{ fontSize: 14, color: isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary }}>7/24 Canlı Destek</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ALT BİLGİLER */}
            <div style={{
                maxWidth: 1280,
                margin: '0 auto',
                padding: '24px 24px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                borderTop: `1px solid ${colors.border}`,
                fontSize: 13
            }}>
                <div style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : colors.textSecondary }}>
                    © 2025 Craftora. Tüm hakları saklıdır.
                </div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {['KVKK', 'Kullanım Koşulları', 'Çerez Politikası', 'Site Haritası'].map((item, i) => (
                        <a
                            key={i}
                            href="#"
                            style={{
                                color: isDarkMode ? 'rgba(255,255,255,0.4)' : colors.textSecondary,
                                textDecoration: 'none',
                                transition: 'color 0.3s ease',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                            onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? 'rgba(255,255,255,0.4)' : colors.textSecondary}
                        >
                            {item}
                        </a>
                    ))}
                </div>
                <div>
                    <button style={{
                        background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${colors.border}`,
                        borderRadius: 30,
                        padding: '6px 16px',
                        color: isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = colors.primary;
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
                        e.currentTarget.style.color = isDarkMode ? 'rgba(255,255,255,0.6)' : colors.textSecondary;
                        e.currentTarget.style.borderColor = colors.border;
                    }}
                    >
                        <span>🇹🇷</span>
                        <span>Türkçe</span>
                        <span>▼</span>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;