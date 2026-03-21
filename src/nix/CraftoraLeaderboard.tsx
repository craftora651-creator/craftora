// nix/CraftoraLeaderboard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CraftoraLeaderboard: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('shops'); // 'shops' veya 'products'
    
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
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
        border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    };

    const topShops = [
        {
            rank: 1,
            name: "Robotix Studio",
            owner: "@robot_master",
            sales: "15.2K",
            revenue: "₺1.2M",
            products: 234,
            image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=200&auto=format",
            badge: "🏆 CHAMPION",
            color: colors.gold
        },
        {
            rank: 2,
            name: "3D Wonderland",
            owner: "@print_artist",
            sales: "12.8K",
            revenue: "₺980K",
            products: 189,
            image: "https://images.unsplash.com/photo-1631556097160-5c33b3b1b14c?w=200&auto=format",
            badge: "🥈 SILVER",
            color: colors.silver
        },
        {
            rank: 3,
            name: "UI Market",
            owner: "@design_pro",
            sales: "10.4K",
            revenue: "₺850K",
            products: 156,
            image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=200&auto=format",
            badge: "🥉 BRONZE",
            color: colors.bronze
        },
        {
            rank: 4,
            name: "CodeCraft",
            owner: "@dev_guru",
            sales: "8.9K",
            revenue: "₺720K",
            products: 142,
            image: "https://images.unsplash.com/photo-1553408228-10e475fe8c1c?w=200&auto=format",
            badge: "⭐ RISING STAR",
            color: colors.primary
        },
        {
            rank: 5,
            name: "ArduinoHub",
            owner: "@circuit_lover",
            sales: "7.6K",
            revenue: "₺610K",
            products: 128,
            image: "https://images.unsplash.com/photo-1581092335871-4c5c0c1b5b5a?w=200&auto=format",
            badge: "🔥 TRENDING",
            color: colors.accent
        }
    ];

    const topProducts = [
        {
            rank: 1,
            name: "MekaRobot Pro Kit",
            shop: "Robotix Studio",
            sales: "3.2K",
            revenue: "₺950K",
            image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=200&auto=format",
            badge: "👑 BEST SELLER"
        },
        {
            rank: 2,
            name: "3D Printed Dragon",
            shop: "3D Wonderland",
            sales: "2.8K",
            revenue: "₺420K",
            image: "https://images.unsplash.com/photo-1631556097160-5c33b3b1b14c?w=200&auto=format",
            badge: "🎨 ARTIST"
        },
        {
            rank: 3,
            name: "Mobile UI Kit 2024",
            shop: "UI Market",
            sales: "2.4K",
            revenue: "₺360K",
            image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=200&auto=format",
            badge: "📱 TRENDING"
        },
        {
            rank: 4,
            name: "Arduino Course",
            shop: "ArduinoHub",
            sales: "2.1K",
            revenue: "₺315K",
            image: "https://images.unsplash.com/photo-1553408228-10e475fe8c1c?w=200&auto=format",
            badge: "🎓 POPULAR"
        },
        {
            rank: 5,
            name: "Web Dev Bundle",
            shop: "CodeCraft",
            sales: "1.9K",
            revenue: "₺285K",
            image: "https://images.unsplash.com/photo-1581092335871-4c5c0c1b5b5a?w=200&auto=format",
            badge: "💻 HOT"
        }
    ];

    const isMobile = window.innerWidth < 768;

    return (
        <section style={{
            padding: isMobile ? '60px 16px' : '80px 24px',
            background: colors.bg,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* BACKGROUND PARILTILAR */}
            <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.1,
                background: `
                    radial-gradient(circle at 20% 30%, ${colors.gold}30 0%, transparent 40%),
                    radial-gradient(circle at 80% 70%, ${colors.accent}30 0%, transparent 40%),
                    repeating-linear-gradient(45deg, ${colors.primary}10 0px, ${colors.primary}10 2px, transparent 2px, transparent 20px)
                `
            }} />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 2
            }}>
                
                {/* HEADER - HEYECAN VERİCİ! */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        textAlign: 'center',
                        marginBottom: isMobile ? 40 : 50
                    }}
                >
                    <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring" }}
                        style={{
                            display: 'inline-block',
                            padding: '8px 24px',
                            background: `linear-gradient(135deg, ${colors.gold}30, ${colors.accent}30)`,
                            borderRadius: 40,
                            marginBottom: 20,
                            border: `1px solid ${colors.gold}40`,
                            color: colors.gold,
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                    >
                        👑 CRAFTORA CHAMPIONS
                    </motion.span>

                    <h2 style={{
                        fontSize: isMobile ? '2.2rem' : 'clamp(2.5rem, 6vw, 4rem)',
                        fontWeight: 800,
                        color: colors.text,
                        marginBottom: 15,
                        lineHeight: 1.2
                    }}>
                        This Month's{' '}
                        <span style={{
                            background: `linear-gradient(135deg, ${colors.gold}, ${colors.accent})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Winners
                        </span>
                    </h2>

                    <p style={{
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        color: colors.textSecondary,
                        maxWidth: 600,
                        margin: '0 auto'
                    }}>
                        Top performing shops and products that crushed it this month! 🚀
                    </p>
                </motion.div>

                {/* TAB MENU */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 20,
                    marginBottom: 40
                }}>
                    <motion.button
                        onClick={() => setActiveTab('shops')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '14px 35px',
                            background: activeTab === 'shops' 
                                ? `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`
                                : 'transparent',
                            border: activeTab === 'shops'
                                ? 'none'
                                : `2px solid ${colors.primary}40`,
                            borderRadius: 50,
                            color: activeTab === 'shops' ? 'white' : colors.primary,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: activeTab === 'shops'
                                ? `0 10px 30px -10px ${colors.primary}`
                                : 'none'
                        }}
                    >
                        🏪 Top 5 Shops
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab('products')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: '14px 35px',
                            background: activeTab === 'products' 
                                ? `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`
                                : 'transparent',
                            border: activeTab === 'products'
                                ? 'none'
                                : `2px solid ${colors.primary}40`,
                            borderRadius: 50,
                            color: activeTab === 'products' ? 'white' : colors.primary,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: activeTab === 'products'
                                ? `0 10px 30px -10px ${colors.primary}`
                                : 'none'
                        }}
                    >
                        🔥 Top 5 Products
                    </motion.button>
                </div>

                {/* LEADERBOARD */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* ŞAMPİYON ÖZEL KARTI (1. olan) */}
                    {activeTab === 'shops' && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            style={{
                                background: `linear-gradient(135deg, ${colors.gold}20, ${colors.accent}20)`,
                                borderRadius: 40,
                                padding: isMobile ? 25 : 35,
                                marginBottom: 30,
                                border: `2px solid ${colors.gold}`,
                                boxShadow: `0 20px 40px -15px ${colors.gold}`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* ŞAMPİYON KRAVATI */}
                            <div style={{
                                position: 'absolute',
                                top: 20,
                                right: -30,
                                background: colors.gold,
                                color: '#000',
                                padding: '8px 40px',
                                transform: 'rotate(45deg)',
                                fontSize: '0.9rem',
                                fontWeight: 800,
                                boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                            }}>
                                👑 CHAMPION
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: isMobile ? 15 : 25,
                                flexDirection: isMobile ? 'column' : 'row',
                                textAlign: isMobile ? 'center' : 'left'
                            }}>
                                <div style={{
                                    position: 'relative'
                                }}>
                                    <img 
                                        src={topShops[0].image}
                                        alt={topShops[0].name}
                                        style={{
                                            width: isMobile ? 100 : 120,
                                            height: isMobile ? 100 : 120,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: `4px solid ${colors.gold}`,
                                            boxShadow: `0 0 30px ${colors.gold}`
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: -10,
                                        left: -10,
                                        fontSize: '3rem'
                                    }}>
                                        👑
                                    </div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: isMobile ? '1.8rem' : '2.2rem',
                                        fontWeight: 800,
                                        color: colors.text,
                                        marginBottom: 8
                                    }}>
                                        {topShops[0].name}
                                    </h3>
                                    <p style={{
                                        fontSize: '1.1rem',
                                        color: colors.gold,
                                        fontWeight: 600,
                                        marginBottom: 15
                                    }}>
                                        {topShops[0].owner}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        gap: isMobile ? 15 : 30,
                                        justifyContent: isMobile ? 'center' : 'flex-start',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>Sales</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text }}>{topShops[0].sales}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>Revenue</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.gold }}>{topShops[0].revenue}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>Products</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text }}>{topShops[0].products}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'products' && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            style={{
                                background: `linear-gradient(135deg, ${colors.gold}20, ${colors.accent}20)`,
                                borderRadius: 40,
                                padding: isMobile ? 25 : 35,
                                marginBottom: 30,
                                border: `2px solid ${colors.gold}`,
                                boxShadow: `0 20px 40px -15px ${colors.gold}`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: 20,
                                right: -30,
                                background: colors.gold,
                                color: '#000',
                                padding: '8px 40px',
                                transform: 'rotate(45deg)',
                                fontSize: '0.9rem',
                                fontWeight: 800
                            }}>
                                👑 #1 BEST SELLER
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: isMobile ? 15 : 25,
                                flexDirection: isMobile ? 'column' : 'row',
                                textAlign: isMobile ? 'center' : 'left'
                            }}>
                                <div style={{
                                    position: 'relative'
                                }}>
                                    <img 
                                        src={topProducts[0].image}
                                        alt={topProducts[0].name}
                                        style={{
                                            width: isMobile ? 100 : 120,
                                            height: isMobile ? 100 : 120,
                                            borderRadius: 20,
                                            objectFit: 'cover',
                                            border: `4px solid ${colors.gold}`,
                                            boxShadow: `0 0 30px ${colors.gold}`
                                        }}
                                    />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: isMobile ? '1.8rem' : '2.2rem',
                                        fontWeight: 800,
                                        color: colors.text,
                                        marginBottom: 8
                                    }}>
                                        {topProducts[0].name}
                                    </h3>
                                    <p style={{
                                        fontSize: '1.1rem',
                                        color: colors.gold,
                                        fontWeight: 600,
                                        marginBottom: 15
                                    }}>
                                        by {topProducts[0].shop}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        gap: isMobile ? 15 : 30,
                                        justifyContent: isMobile ? 'center' : 'flex-start',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>Sales</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text }}>{topProducts[0].sales}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: colors.textSecondary }}>Revenue</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.gold }}>{topProducts[0].revenue}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* DİĞER SIRALAMALAR (2-5) */}
                    <div style={{
                        display: 'grid',
                        gap: 15
                    }}>
                        {(activeTab === 'shops' ? topShops.slice(1) : topProducts.slice(1)).map((item, idx) => (
                            <motion.div
                                key={item.rank}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                whileHover={{ scale: 1.02, x: 10 }}
                                style={{
                                    background: colors.surface,
                                    borderRadius: 30,
                                    padding: isMobile ? 15 : 20,
                                    border: `1px solid ${colors.border}`,
                                    boxShadow: isDarkMode 
                                        ? '0 10px 30px -15px rgba(0,0,0,0.6)' 
                                        : '0 10px 30px -15px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 20,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* RANK BADGE */}
                                <div style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    background: item.color || colors.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    color: item.rank === 2 ? '#000' : 'white',
                                    boxShadow: `0 5px 15px ${item.color || colors.primary}80`,
                                    flexShrink: 0
                                }}>
                                    {item.rank}
                                </div>

                                {/* IMAGE */}
                                <img 
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 15,
                                        objectFit: 'cover',
                                        flexShrink: 0
                                    }}
                                />

                                {/* INFO */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 5,
                                        flexWrap: 'wrap',
                                        gap: 8
                                    }}>
                                        <h4 style={{
                                            fontSize: isMobile ? '1rem' : '1.2rem',
                                            fontWeight: 700,
                                            color: colors.text
                                        }}>
                                            {item.name}
                                        </h4>
                                        <span style={{
                                            padding: '4px 12px',
                                            background: `${item.color || colors.primary}20`,
                                            color: item.color || colors.primary,
                                            borderRadius: 20,
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>
                                            {item.badge}
                                        </span>
                                    </div>
                                    
                                    <p style={{
                                        color: colors.textSecondary,
                                        fontSize: '0.9rem',
                                        marginBottom: 8
                                    }}>
                                        {activeTab === 'shops' ? item.owner : `by ${item.shop}`}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        gap: 20,
                                        fontSize: '0.9rem'
                                    }}>
                                        <span style={{ color: colors.textSecondary }}>
                                            Sales: <strong style={{ color: colors.primary }}>{item.sales}</strong>
                                        </span>
                                        <span style={{ color: colors.textSecondary }}>
                                            Revenue: <strong style={{ color: colors.gold }}>{item.revenue}</strong>
                                        </span>
                                    </div>
                                </div>

                                {/* HOVER GLOW */}
                                <motion.div
                                    style={{
                                        position: 'absolute',
                                        top: '-50%',
                                        left: '-50%',
                                        width: '200%',
                                        height: '200%',
                                        background: `radial-gradient(circle at 50% 50%, ${item.color || colors.primary}20, transparent 70%)`,
                                        opacity: 0,
                                        pointerEvents: 'none'
                                    }}
                                    whileHover={{ opacity: 0.3 }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ALT İSTATİSTİKLER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                        gap: 15,
                        marginTop: 50,
                        padding: isMobile ? 20 : 30,
                        background: colors.surface,
                        borderRadius: 40,
                        border: `1px solid ${colors.border}`
                    }}
                >
                    {[
                        { label: 'Total Sales', value: '54.9K', icon: '💰' },
                        { label: 'Total Revenue', value: '₺4.2M', icon: '📈' },
                        { label: 'Active Shops', value: '1.2K', icon: '🏪' },
                        { label: 'Products Sold', value: '28.5K', icon: '📦' }
                    ].map((stat, idx) => (
                        <div key={idx} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 5 }}>{stat.icon}</div>
                            <div style={{
                                fontSize: isMobile ? '1.2rem' : '1.5rem',
                                fontWeight: 800,
                                color: colors.primary
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: '0.85rem',
                                color: colors.textSecondary
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* KATIL BUTONU */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    style={{
                        textAlign: 'center',
                        marginTop: 50
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: `0 20px 40px -10px ${colors.gold}` }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            padding: isMobile ? '16px 30px' : '18px 45px',
                            fontSize: isMobile ? '1rem' : '1.2rem',
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${colors.gold}, ${colors.accent})`,
                            border: 'none',
                            borderRadius: 60,
                            color: '#000',
                            cursor: 'pointer',
                            boxShadow: `0 10px 30px -10px ${colors.gold}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10
                        }}
                    >
                        <span>🏆 JOIN THE RACE</span>
                        <span className="material-icons">arrow_forward</span>
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default CraftoraLeaderboard;