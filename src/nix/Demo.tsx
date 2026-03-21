// pages/Demo.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Mahmut from '../video/mahmut.mp4'

const Demo: React.FC = () => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.body.classList.contains('dark-mode'));
        };

        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const colors = {
        bg: isDarkMode ? '#1a2c2c' : '#FFF5E1',
        surface: isDarkMode ? '#233636' : '#FFFCF5',
        text: isDarkMode ? '#f8fcfc' : '#0c1d1d',
        textSecondary: isDarkMode ? '#b0c4c4' : '#4a5c5c',
        primary: '#008080',
        accent: '#FF6F61',
        border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    };

    const isMobile = window.innerWidth < 768;

    const userStories = [
        {
            name: "Ali Yılmaz",
            role: "Robot Geliştirici",
            story: "6 ayda 500'den fazla robot sattım, artık tam zamanlı üreticiyim!",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            color: colors.primary
        },
        {
            name: "Zeynep Demir",
            role: "3D Tasarımcı",
            story: "Tasarımlarımı paylaştım, dünyanın her yerinden sipariş alıyorum.",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            color: colors.accent
        },
        {
            name: "Mehmet Kaya",
            role: "Yazılımcı",
            story: "UI kit'lerimle pasif gelir elde ediyorum, hayalimdeki hayatı yaşıyorum.",
            image: "https://randomuser.me/api/portraits/men/46.jpg",
            color: '#8b5cf6'
        }
    ];

    const howItWorks = [
        {
            step: 1,
            title: "Ürününü Ekle",
            desc: "Dijital veya fiziksel ürününü birkaç tıklamayla listele",
            icon: "📦"
        },
        {
            step: 2,
            title: "Toplulukla Paylaş",
            desc: "Reels ve projelerle ürününü tanıt, takipçi kazan",
            icon: "🎬"
        },
        {
            step: 3,
            title: "Kazanmaya Başla",
            desc: "Satış yap, gelir elde et, yarışmalarda ödül kazan",
            icon: "💰"
        }
    ];

    return (
        <div style={{
            background: colors.bg,
            minHeight: '100vh',
            paddingTop: 100
        }}>
            {/* HEADER SPACE (Header zaten var) */}

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: isMobile ? '0 16px 60px' : '0 24px 80px'
            }}>

                {/* 1. TANITIM VİDEOSU */}

                {/* 1. TANITIM VİDEOSU - MAHMUT FULL EKRAN! */}
                {/* 1. TANITIM VİDEOSU - MAHMUT TAM BOY! */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        marginBottom: 40,
                        width: '100%',
                        padding: 0,
                        margin: 0
                    }}
                >
                    {/* VİDEO KONTEYNERI - SADECE VİDEO KADAR */}
                    <div style={{
                        width: '100%',
                        background: 'transparent',  // Siyah değil!
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px 0'
                    }}>
                        {/* VİDEO - TAM BOYUTUYLA */}
                        <video
                            width="100%"
                            height="auto"
                            controls
                            autoPlay
                            loop
                            playsInline
                            preload="auto"
                            style={{
                                width: '100%',
                                maxWidth: '1200px',  // Maksimum genişlik
                                height: 'auto',
                                maxHeight: '70vh',    // Maksimum yükseklik
                                borderRadius: '24px',
                                boxShadow: `0 20px 40px -10px rgba(0,0,0,0.3)`,
                                display: 'block',
                                margin: '0 auto',
                                objectFit: 'contain'  // Video orijinal boyutunda
                            }}
                        >
                            {/* KALİTE SEÇENEKLERİ */}
                            <source src="/videos/mahmut-1080p.mp4" type="video/mp4" />
                            <source src="/videos/mahmut-720p.mp4" type="video/mp4" />
                            <source src="/videos/mahmut-480p.mp4" type="video/mp4" />
                            <source src="/videos/mahmut-360p.mp4" type="video/mp4" />
                            <source src={Mahmut} type="video/mp4" />
                            Tarayıcınız video etiketini desteklemiyor.
                        </video>
                    </div>

                    {/* BAŞLIK VE AÇIKLAMALAR */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            textAlign: 'center',
                            marginTop: 30,
                            padding: '0 20px',
                            maxWidth: '800px',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    >
                        <h1 style={{
                            fontSize: isMobile ? '2rem' : '2.8rem',
                            fontWeight: 700,
                            color: colors.text,
                            marginBottom: 10
                        }}>
                            🎬 <span style={{ color: colors.primary }}>Mahmut</span> Anlatıyor
                        </h1>

                        <p style={{
                            fontSize: isMobile ? '1rem' : '1.1rem',
                            color: colors.textSecondary,
                            marginBottom: 20
                        }}>
                            CRAFTORA ile üretmenin keyfini keşfedin
                        </p>

                        {/* KALİTE SEÇENEKLERİ */}
                        <div style={{
                            display: 'flex',
                            gap: 8,
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            {['1080p', '720p', '480p', '360p'].map((res, i) => (
                                <span key={i} style={{
                                    padding: '4px 12px',
                                    background: colors.surface,
                                    borderRadius: 20,
                                    border: `1px solid ${colors.border}`,
                                    color: i === 0 ? colors.primary : colors.textSecondary,
                                    fontSize: '0.8rem'
                                }}>
                                    {res}
                                </span>
                            ))}
                        </div>

                        {/* 3 NOKTA İPUCU */}
                        <p style={{
                            color: colors.textSecondary,
                            fontSize: '0.85rem',
                            marginTop: 15,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4
                        }}>
                            <span className="material-icons" style={{ fontSize: 16 }}>info</span>
                            Video ayarları için 3 noktaya tıklayın
                        </p>
                    </motion.div>
                </motion.div>
                {/* 2. NASIL ÇALIŞIR? */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{
                        marginBottom: 80
                    }}
                >
                    <h2 style={{
                        fontSize: isMobile ? '2rem' : '2.5rem',
                        fontWeight: 700,
                        color: colors.text,
                        textAlign: 'center',
                        marginBottom: 50
                    }}>
                        <span style={{ color: colors.primary }}>Nasıl Çalışır?</span>
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                        gap: 30
                    }}>
                        {howItWorks.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                whileHover={{ y: -10 }}
                                style={{
                                    background: colors.surface,
                                    borderRadius: 30,
                                    padding: 40,
                                    border: `1px solid ${colors.border}`,
                                    textAlign: 'center',
                                    position: 'relative',
                                    boxShadow: isDarkMode
                                        ? '0 20px 40px -20px rgba(0,0,0,0.6)'
                                        : '0 20px 40px -20px rgba(0,0,0,0.1)'
                                }}
                            >
                                {/* STEP BADGE */}
                                <div style={{
                                    position: 'absolute',
                                    top: -15,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: colors.primary,
                                    color: 'white',
                                    padding: '8px 20px',
                                    borderRadius: 30,
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    boxShadow: `0 10px 20px -10px ${colors.primary}`
                                }}>
                                    Adım {item.step}
                                </div>

                                <div style={{ fontSize: '4rem', marginBottom: 20, marginTop: 20 }}>
                                    {item.icon}
                                </div>

                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: colors.text,
                                    marginBottom: 15
                                }}>
                                    {item.title}
                                </h3>

                                <p style={{
                                    color: colors.textSecondary,
                                    lineHeight: 1.6
                                }}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 3. KULLANICI HİKAYELERİ + FOTOĞRAFLAR */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{
                        marginBottom: 80
                    }}
                >
                    <h2 style={{
                        fontSize: isMobile ? '2rem' : '2.5rem',
                        fontWeight: 700,
                        color: colors.text,
                        textAlign: 'center',
                        marginBottom: 20
                    }}>
                        Gerçek <span style={{ color: colors.accent }}>Hikayeler</span>
                    </h2>

                    <p style={{
                        textAlign: 'center',
                        color: colors.textSecondary,
                        fontSize: '1.1rem',
                        marginBottom: 50
                    }}>
                        CRAFTORA ile hayatı değişen üreticiler
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                        gap: 30
                    }}>
                        {userStories.map((user, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                whileHover={{ y: -10 }}
                                style={{
                                    background: colors.surface,
                                    borderRadius: 30,
                                    padding: 30,
                                    border: `1px solid ${colors.border}`,
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* BACKGROUND GLOW */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-50%',
                                    left: '-50%',
                                    width: '200%',
                                    height: '200%',
                                    background: `radial-gradient(circle at 50% 50%, ${user.color}20, transparent 70%)`,
                                    opacity: 0.5
                                }} />

                                <img
                                    src={user.image}
                                    alt={user.name}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: `3px solid ${user.color}`,
                                        marginBottom: 20,
                                        position: 'relative',
                                        zIndex: 2
                                    }}
                                />

                                <h3 style={{
                                    fontSize: '1.3rem',
                                    fontWeight: 700,
                                    color: colors.text,
                                    marginBottom: 5,
                                    position: 'relative',
                                    zIndex: 2
                                }}>
                                    {user.name}
                                </h3>

                                <p style={{
                                    color: user.color,
                                    fontWeight: 600,
                                    marginBottom: 15,
                                    position: 'relative',
                                    zIndex: 2
                                }}>
                                    {user.role}
                                </p>

                                <p style={{
                                    color: colors.textSecondary,
                                    fontStyle: 'italic',
                                    lineHeight: 1.6,
                                    position: 'relative',
                                    zIndex: 2
                                }}>
                                    "{user.story}"
                                </p>

                                {/* TIRNAK İŞARETİ */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 20,
                                    right: 20,
                                    fontSize: '5rem',
                                    color: user.color,
                                    opacity: 0.1,
                                    fontFamily: 'serif'
                                }}>
                                    "
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 4. ÖNEMLİ AÇIKLAMA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
                        borderRadius: 50,
                        padding: isMobile ? 40 : 60,
                        marginBottom: 60,
                        border: `1px solid ${colors.primary}30`,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* BACKGROUND PATTERN */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.1,
                        backgroundImage: `
                            repeating-linear-gradient(45deg, ${colors.primary} 0px, ${colors.primary} 2px, transparent 2px, transparent 20px)
                        `
                    }} />

                    <h3 style={{
                        fontSize: isMobile ? '1.8rem' : '2.2rem',
                        fontWeight: 700,
                        color: colors.text,
                        textAlign: 'center',
                        marginBottom: 20,
                        position: 'relative',
                        zIndex: 2
                    }}>
                        Neden <span style={{ color: colors.primary }}>CRAFTORA</span>?
                    </h3>

                    <p style={{
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        color: colors.text,
                        textAlign: 'center',
                        maxWidth: 800,
                        margin: '0 auto',
                        lineHeight: 1.8,
                        position: 'relative',
                        zIndex: 2
                    }}>
                        CRAFTORA sadece bir pazar yeri değil, <strong>üreticilerin buluştuğu,
                            öğrendiği ve kazandığı bir ekosistem</strong>. Dijital ürünlerden fiziksel
                        ürünlere, reels videolardan topluluk projelerine kadar her şey tek platformda.
                        Üstelik yarışmalar, rozetler ve liderlik tablolarıyla <strong>eğlence hiç bitmez!</strong>
                    </p>

                    {/* PARILTI EFEKTI */}
                    <motion.div
                        animate={{
                            x: ['-100%', '100%'],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '20%',
                            height: '100%',
                            background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`,
                            transform: 'skewX(-20deg)'
                        }}
                    />
                </motion.div>

                {/* 5. BUTONLAR */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <motion.button
                        whileHover={{
                            scale: 1.1,
                            boxShadow: `0 20px 40px -10px ${colors.primary}`
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/register')}
                        style={{
                            padding: isMobile ? '16px 40px' : '18px 50px',
                            fontSize: isMobile ? '1.1rem' : '1.2rem',
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                            border: 'none',
                            borderRadius: 60,
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: `0 10px 30px -10px ${colors.primary}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: 'center'
                        }}
                    >
                        <span>🚀 ARAMIZA KATIL</span>
                        <span className="material-icons">arrow_forward</span>
                    </motion.button>

                    <motion.button
                        whileHover={{
                            scale: 1.1,
                            borderColor: colors.accent,
                            color: colors.accent
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/medya')}
                        style={{
                            padding: isMobile ? '16px 40px' : '18px 50px',
                            fontSize: isMobile ? '1.1rem' : '1.2rem',
                            fontWeight: 700,
                            background: 'transparent',
                            border: `2px solid ${colors.primary}`,
                            borderRadius: 60,
                            color: colors.primary,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: 'center'
                        }}
                    >
                        <span>🎬 REELS'LERE GİT</span>
                        <span className="material-icons">play_circle</span>
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default Demo;