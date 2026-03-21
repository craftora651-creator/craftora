// nix/CraftoraShowcase.tsx - RESPONSIVE VERSION
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CraftoraShowcase: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
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

  const demoSections = [
    {
      title: "📦 Ürün Sat",
      description: "Dijital ürünlerini fiziksel ürünlerini saniyeler içinde listele",
      video: "🎥",
      stats: "10K+ ürün satıldı",
      color: colors.primary
    },
    {
      title: "🎬 İçerik Paylaş",
      description: "Reels ve videolarla ürünlerini tanıt, topluluk oluştur",
      video: "📱",
      stats: "50K+ saat izlendi",
      color: colors.accent
    },
    {
      title: "💡 Proje Göster",
      description: "Yaptığın projeleri paylaş, ilham ver, ilham al",
      video: "🔧",
      stats: "5K+ proje paylaşıldı",
      color: '#8b5cf6'
    }
  ];

  const communityProjects = [
    {
      title: "MekaRobot v2.0",
      author: "robot_lover",
      image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&auto=format",
      likes: 234,
      views: "1.2K",
      color: colors.primary
    },
    {
      title: "3D Printed Art",
      author: "digital_artist",
      image: "https://images.unsplash.com/photo-1631556097160-5c33b3b1b14c?w=600&auto=format",
      likes: 567,
      views: "2.3K",
      color: colors.accent
    },
    {
      title: "Mobile App UI",
      author: "ui_designer",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format",
      likes: 892,
      views: "3.4K",
      color: '#8b5cf6'
    }
  ];

  // Responsive breakpoints
  const styles = {
    container: {
      padding: window.innerWidth < 768 ? '60px 16px' : '100px 24px',
      background: colors.bg,
      position: 'relative' as const,
      overflow: 'hidden' as const
    },
    headerTitle: {
      fontSize: window.innerWidth < 768 ? '2rem' : 'clamp(2.5rem, 6vw, 4rem)',
      fontWeight: 800,
      color: colors.text,
      marginBottom: 20,
      lineHeight: 1.2
    },
    headerSubtitle: {
      fontSize: window.innerWidth < 768 ? '1rem' : '1.2rem',
      color: colors.textSecondary,
      maxWidth: 600,
      margin: '0 auto',
      padding: window.innerWidth < 768 ? '0 16px' : '0'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* BACKGROUND - Enerjik desen */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        background: `radial-gradient(circle at 30% 50%, ${colors.primary}30 0%, transparent 50%),
                    radial-gradient(circle at 70% 50%, ${colors.accent}30 0%, transparent 50%)`
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        padding: window.innerWidth < 768 ? '0' : '0'
      }}>
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            marginBottom: window.innerWidth < 768 ? 40 : 60
          }}
        >
          <h2 style={styles.headerTitle}>
            See{' '}
            <span style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              CRAFTORA
            </span>{' '}
            in Action
          </h2>
          <p style={styles.headerSubtitle}>
            Watch how creators like you are using our platform
          </p>
        </motion.div>

        {/* ANA SHOWCASE - MOBİLDE DİKEY, DESKTOP'TA YAN YANA */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          gap: window.innerWidth < 768 ? 30 : 40,
          alignItems: window.innerWidth < 768 ? 'stretch' : 'center',
          marginBottom: window.innerWidth < 768 ? 60 : 80
        }}>
          
          {/* SOL TARAF - VİDEO/ANİMASYON ALANI */}
          <motion.div
            initial={{ opacity: 0, x: window.innerWidth < 768 ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              flex: 1,
              background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
              borderRadius: window.innerWidth < 768 ? 30 : 40,
              padding: window.innerWidth < 768 ? 20 : 40,
              border: `1px solid ${colors.border}`,
              boxShadow: isDarkMode 
                ? '0 30px 60px -30px rgba(0,0,0,0.8)' 
                : '0 30px 60px -30px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            {/* PLAY BUTTON - BÜYÜK */}
            <div style={{
              position: 'relative',
              aspectRatio: '16/9',
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
              borderRadius: window.innerWidth < 768 ? 20 : 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* ABSTRACT ANIMATION */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {demoSections.map((section, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 1, 0.3],
                      rotate: [0, 360, 0]
                    }}
                    transition={{
                      duration: 8,
                      delay: idx * 2,
                      repeat: Infinity
                    }}
                    style={{
                      position: 'absolute',
                      fontSize: window.innerWidth < 768 ? '4rem' : '6rem',
                      color: section.color,
                      filter: `drop-shadow(0 0 30px ${section.color})`
                    }}
                  >
                    {section.video}
                  </motion.div>
                ))}
              </div>

              {/* PLAY BUTTON */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: window.innerWidth < 768 ? 60 : 80,
                  height: window.innerWidth < 768 ? 60 : 80,
                  background: colors.accent,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: `0 0 50px ${colors.accent}`,
                  border: '3px solid white',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                <span className="material-icons" style={{ 
                  fontSize: window.innerWidth < 768 ? 30 : 40, 
                  color: 'white' 
                }}>
                  play_arrow
                </span>
              </motion.div>
            </div>

            {/* VİDEO ALT YAZI */}
            <p style={{
              textAlign: 'center',
              marginTop: 20,
              color: colors.textSecondary,
              fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem'
            }}>
              ✨ Watch: 2 minute platform overview
            </p>
          </motion.div>

          {/* SAĞ TARAF - AÇIKLAMALAR */}
          <motion.div
            initial={{ opacity: 0, x: window.innerWidth < 768 ? 0 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              flex: 1
            }}
          >
            <h3 style={{
              fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem',
              fontWeight: 700,
              color: colors.text,
              marginBottom: window.innerWidth < 768 ? 20 : 30,
              textAlign: window.innerWidth < 768 ? 'center' : 'left'
            }}>
              Everything you need in{' '}
              <span style={{ color: colors.primary }}>one place</span>
            </h3>

            {/* TAB MENU - MOBİLDE YATAY KAYDIRMALI */}
            <div style={{
              display: 'flex',
              gap: 10,
              marginBottom: window.innerWidth < 768 ? 20 : 30,
              flexWrap: window.innerWidth < 768 ? 'nowrap' : 'wrap',
              overflowX: window.innerWidth < 768 ? 'auto' : 'visible',
              paddingBottom: window.innerWidth < 768 ? 10 : 0,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {demoSections.map((section, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(idx)}
                  style={{
                    padding: window.innerWidth < 768 ? '10px 20px' : '12px 24px',
                    background: activeTab === idx 
                      ? `linear-gradient(135deg, ${section.color}, ${section.color}dd)`
                      : 'transparent',
                    border: activeTab === idx 
                      ? 'none'
                      : `2px solid ${section.color}30`,
                    borderRadius: 40,
                    color: activeTab === idx ? 'white' : section.color,
                    fontWeight: 600,
                    fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {section.title}
                </motion.button>
              ))}
            </div>

            {/* AKTİF TAB İÇERİĞİ */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: colors.surface,
                padding: window.innerWidth < 768 ? 20 : 30,
                borderRadius: window.innerWidth < 768 ? 20 : 30,
                border: `1px solid ${colors.border}`,
                marginBottom: window.innerWidth < 768 ? 20 : 30
              }}
            >
              <div style={{
                fontSize: window.innerWidth < 768 ? '2.5rem' : '3rem',
                marginBottom: 15
              }}>
                {demoSections[activeTab].video}
              </div>
              <h4 style={{
                fontSize: window.innerWidth < 768 ? '1.3rem' : '1.5rem',
                fontWeight: 700,
                color: demoSections[activeTab].color,
                marginBottom: 10
              }}>
                {demoSections[activeTab].title}
              </h4>
              <p style={{
                fontSize: window.innerWidth < 768 ? '1rem' : '1.1rem',
                color: colors.textSecondary,
                lineHeight: 1.6,
                marginBottom: 15
              }}>
                {demoSections[activeTab].description}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: window.innerWidth < 768 ? '12px 15px' : '15px 20px',
                background: `${demoSections[activeTab].color}10`,
                borderRadius: 20
              }}>
                <span className="material-icons" style={{ color: demoSections[activeTab].color }}>
                  trending_up
                </span>
                <span style={{
                  color: colors.text,
                  fontWeight: 600,
                  fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem'
                }}>
                  {demoSections[activeTab].stats}
                </span>
              </div>
            </motion.div>

            {/* CTA BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: window.innerWidth < 768 ? '14px 20px' : '16px 32px',
                background: 'transparent',
                border: `2px solid ${colors.primary}`,
                borderRadius: 40,
                color: colors.primary,
                fontSize: window.innerWidth < 768 ? '1rem' : '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <span>📹 Watch Full Demo</span>
              <span className="material-icons">arrow_forward</span>
            </motion.button>
          </motion.div>
        </div>

        {/* GERÇEK KULLANICI ÇALIŞMALARI - FOTOĞRAFLI! */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 style={{
            fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem',
            fontWeight: 700,
            color: colors.text,
            marginBottom: window.innerWidth < 768 ? 30 : 40,
            textAlign: 'center',
            padding: window.innerWidth < 768 ? '0 16px' : '0'
          }}>
            Real <span style={{ color: colors.accent }}>creations</span> from our community
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 
              ? '1fr' 
              : window.innerWidth < 1024 
                ? 'repeat(2, 1fr)' 
                : 'repeat(3, 1fr)',
            gap: window.innerWidth < 768 ? 20 : 25
          }}>
            {communityProjects.map((project, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10, scale: 1.02 }}
                style={{
                  background: colors.surface,
                  borderRadius: window.innerWidth < 768 ? 20 : 30,
                  overflow: 'hidden',
                  border: `1px solid ${colors.border}`,
                  boxShadow: isDarkMode 
                    ? '0 20px 40px -15px rgba(0,0,0,0.6)' 
                    : '0 20px 40px -15px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
              >
                {/* FOTOĞRAF */}
                <div style={{
                  aspectRatio: '1',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img 
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  
                  {/* RENKLİ OVERLAY */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: `linear-gradient(to top, ${project.color}80, transparent)`
                  }} />

                  {/* MOBİLDE DOKUNMATİP İPUCU */}
                  {window.innerWidth < 768 && (
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: 20,
                      fontSize: '0.7rem',
                      backdropFilter: 'blur(4px)'
                    }}>
                      👆 Dokun
                    </div>
                  )}
                </div>

                {/* İÇERİK */}
                <div style={{ padding: window.innerWidth < 768 ? 15 : 20 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                    flexWrap: window.innerWidth < 768 ? 'wrap' : 'nowrap',
                    gap: 8
                  }}>
                    <h4 style={{
                      fontSize: window.innerWidth < 768 ? '1.1rem' : '1.2rem',
                      fontWeight: 700,
                      color: colors.text
                    }}>
                      {project.title}
                    </h4>
                    <span style={{
                      color: project.color,
                      fontWeight: 600,
                      fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem'
                    }}>
                      @{project.author}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: window.innerWidth < 768 ? 15 : 20,
                    color: colors.textSecondary,
                    fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      ❤️ {project.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      👁️ {project.views}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* TÜMÜNÜ GÖR BUTONU */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{
              textAlign: 'center',
              marginTop: window.innerWidth < 768 ? 30 : 40
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: window.innerWidth < 768 ? '12px 30px' : '14px 35px',
                background: 'transparent',
                border: `2px solid ${colors.accent}`,
                borderRadius: 40,
                color: colors.accent,
                fontSize: window.innerWidth < 768 ? '0.95rem' : '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span>🔍 See All Projects</span>
              <span className="material-icons">arrow_forward</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CraftoraShowcase;