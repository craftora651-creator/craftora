// nix/CategoryShowcase.tsx
import React, { useEffect, useState } from 'react';  // useState'i ekle
import { motion } from 'framer-motion';

interface CategoryShowcaseProps {
  isDarkMode?: boolean;
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = () => {
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
    bg: isDarkMode ? '#1a2c2c' : '#FFF5E1',        // --background-light/dark
    surface: isDarkMode ? '#233636' : '#FFFCF5',    // --surface-light/dark
    text: isDarkMode ? '#f8fcfc' : '#0c1d1d',       // --text-light/dark
    textSecondary: isDarkMode ? '#b0c4c4' : '#4a5c5c',
    primary: '#008080',      // --primary
    primaryDark: '#006666',   // --primary-dark
    accent: '#FF6F61',        // --accent
    border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  };
  const categories = [
    {
      title: "E-COMMERCE",
      icon: "storefront",
      description: "Digital & Physical Products",
      color: colors.primary,
      bgGradient: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.primary}05 100%)`,
      borderColor: `${colors.primary}40`,
      items: [
        { 
          name: "🤖 MekaRobot v2.0", 
          detail: "$299", 
          badge: "🔥 BESTSELLER",
          badgeColor: colors.accent
        },
        { 
          name: "🔧 Arduino Dev Kit", 
          detail: "$450", 
          badge: "🆕 NEW",
          badgeColor: '#10b981' // green
        }
      ]
    },
    {
      title: "MEDIA",
      icon: "play_circle_filled",
      description: "Reels & Videos",
      color: colors.accent,
      bgGradient: `linear-gradient(135deg, ${colors.accent}15 0%, ${colors.accent}05 100%)`,
      borderColor: `${colors.accent}40`,
      items: [
        { 
          name: "🎬 Robot Build Guide", 
          detail: "124K views", 
          badge: "⭐ TRENDING",
          badgeColor: '#f59e0b' // amber
        },
        { 
          name: "💻 Coding 101", 
          detail: "89K views", 
          badge: "⚡ POPULAR",
          badgeColor: '#8b5cf6' // purple
        }
      ]
    },
    {
      title: "PROJECTS",
      icon: "emoji_objects",
      description: "Community & Tutorials",
      color: '#8b5cf6', // purple (extra color)
      bgGradient: `linear-gradient(135deg, #8b5cf615 0%, #8b5cf605 100%)`,
      borderColor: '#8b5cf640',
      items: [
        { 
          name: "🦾 Robotic Arm Project", 
          detail: "150 likes", 
          badge: "🏆 WEEKLY WINNER",
          badgeColor: '#8b5cf6'
        },
        { 
          name: "📟 Arduino Code Share", 
          detail: "89 likes", 
          badge: "✨ FEATURED",
          badgeColor: colors.primary
        }
      ]
    }
  ];

  

  return (
    <div style={{
      padding: '80px 24px',
      background: colors.bg,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* ABSTRACT BACKGROUND PATTERN - CRAFTORA SPECIAL */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.4,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, ${colors.primary}10 0%, transparent 30%),
          radial-gradient(circle at 80% 70%, ${colors.accent}10 0%, transparent 40%),
          repeating-linear-gradient(45deg, transparent 0px, transparent 20px, ${colors.primary}05 20px, ${colors.primary}05 40px)
        `,
        pointerEvents: 'none'
      }} />

      {/* MAIN CONTAINER */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        
        {/* HEADER SECTION - SUPER ELEGANT! */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            textAlign: 'center',
            marginBottom: 60
          }}
        >
          {/* SMALL BADGE */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
              borderRadius: 40,
              marginBottom: 20,
              border: `1px solid ${colors.primary}30`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <span style={{
              color: colors.primary,
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '0.1em'
            }}>
              ✨ CRAFTORA ECOSYSTEM
            </span>
          </motion.div>

          {/* MAIN HEADING */}
          <h2 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20,
            color: colors.text
          }}>
            <span style={{ color: colors.primary }}>Discover</span>,{' '}
            <span style={{ color: colors.accent }}>Learn</span>,{' '}
            <span style={{ color: '#8b5cf6' }}>Create</span>
            <br />
            & Share
          </h2>

          {/* SUBTITLE */}
          <p style={{
            fontSize: '1.25rem',
            color: colors.textSecondary,
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Welcome to our creative ecosystem filled with products, videos, 
            and community projects. Start your journey today.
          </p>
        </motion.div>

        {/* CATEGORY CARDS - 3 COLUMN GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 30,
          marginBottom: 50
        }}>
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              style={{
                background: colors.surface,
                borderRadius: 32,
                overflow: 'hidden',
                boxShadow: isDarkMode 
                  ? '0 25px 50px -12px rgba(0,0,0,0.5)' 
                  : '0 25px 50px -12px rgba(0,0,0,0.15)',
                border: `1px solid ${colors.border}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {/* COLORFUL TOP BAR */}
              <div style={{
                height: 6,
                background: `linear-gradient(90deg, ${cat.color}, ${cat.badgeColor || cat.color})`,
                width: '100%'
              }} />

              {/* CARD CONTENT */}
              <div style={{ padding: 30 }}>
                
                {/* CATEGORY HEADER */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 25
                }}>
                  {/* ICON */}
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    background: cat.bgGradient,
                    border: `1px solid ${cat.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cat.color,
                    fontSize: 32
                  }}>
                    <span className="material-icons" style={{ fontSize: 32 }}>
                      {cat.icon}
                    </span>
                  </div>

                  {/* TITLE */}
                  <div>
                    <h3 style={{
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: colors.text,
                      marginBottom: 4,
                      letterSpacing: '-0.02em'
                    }}>
                      {cat.title}
                    </h3>
                    <p style={{
                      fontSize: '0.95rem',
                      color: colors.textSecondary,
                      fontWeight: 500
                    }}>
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* ITEMS LIST */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  marginBottom: 25
                }}>
                  {cat.items.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 8 }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: isDarkMode ? '#1a2c2c40' : '#FFF5E180',
                        borderRadius: 20,
                        border: `1px solid ${cat.color}20`
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                      }}>
                        <span style={{ fontSize: '1.8rem' }}>
                          {item.name.split(' ')[0]}
                        </span>
                        <div>
                          <div style={{
                            fontWeight: 600,
                            color: colors.text,
                            fontSize: '1rem',
                            marginBottom: 4
                          }}>
                            {item.name.split(' ').slice(1).join(' ')}
                          </div>
                          <div style={{
                            fontWeight: 800,
                            color: cat.color,
                            fontSize: '1.2rem'
                          }}>
                            {item.detail}
                          </div>
                        </div>
                      </div>
                      
                      {/* BADGE */}
                      <span style={{
                        padding: '4px 12px',
                        background: `${item.badgeColor}15`,
                        color: item.badgeColor,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        borderRadius: 40,
                        border: `1px solid ${item.badgeColor}30`
                      }}>
                        {item.badge}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CARD BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    background: 'transparent',
                    border: `2px solid ${cat.color}30`,
                    borderRadius: 30,
                    color: cat.color,
                    fontSize: '1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>
                    {idx === 0 ? '🛒 VIEW ALL PRODUCTS' : 
                     idx === 1 ? '🎬 VIEW ALL VIDEOS' : 
                     '💡 VIEW ALL PROJECTS'}
                  </span>
                  <span className="material-icons" style={{ fontSize: 20 }}>
                    arrow_forward
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM STATISTICS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
            marginTop: 40,
            padding: '30px',
            background: colors.surface,
            borderRadius: 40,
            border: `1px solid ${colors.border}`,
            boxShadow: isDarkMode 
              ? '0 20px 40px -20px rgba(0,0,0,0.4)' 
              : '0 20px 40px -20px rgba(0,0,0,0.1)'
          }}
        >
          {[
            { label: 'Total Products', value: '2,500+', icon: '📦', color: colors.primary },
            { label: 'Video Content', value: '5,200+', icon: '🎬', color: colors.accent },
            { label: 'Community Projects', value: '1,800+', icon: '💡', color: '#8b5cf6' },
            { label: 'Active Members', value: '12,500+', icon: '👥', color: '#10b981' }
          ].map((stat, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '20px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: 10
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1.2,
                marginBottom: 5
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.95rem',
                color: colors.textSecondary,
                fontWeight: 500
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* BIG EXPLORE BUTTON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            marginTop: 60
          }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 20px 40px -10px ${colors.primary}80`
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '20px 50px',
              fontSize: '1.3rem',
              fontWeight: 800,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              border: 'none',
              borderRadius: 60,
              color: 'white',
              cursor: 'pointer',
              boxShadow: `0 10px 30px -10px ${colors.primary}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              border: '2px solid white'
            }}
          >
            <span>✨ EXPLORE ECOSYSTEM</span>
            <span className="material-icons">explore</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryShowcase;