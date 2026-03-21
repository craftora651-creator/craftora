// nix/CraftoraTestimonials.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CraftoraTestimonials: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
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

  const testimonials = [
    {
      name: "Ali Yılmaz",
      role: "Robot Geliştirici",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "CRAFTORA sayesinde robot projelerimi satmaya başladım. Aylık gelirim 3 katına çıktı!",
      rating: 5,
      product: "🤖 MekaRobot v2.0",
      color: colors.primary
    },
    {
      name: "Zeynep Demir",
      role: "3D Tasarımcı",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "3D modellerimi paylaştım, topluluktan harika geri dönüşler aldım. Şimdi herkes benim tasarımlarımı kullanıyor.",
      rating: 5,
      product: "🎨 3D Printed Art",
      color: colors.accent
    },
    {
      name: "Mehmet Kaya",
      role: "Mobil Geliştirici",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      content: "UI kit'lerimi satıyorum, pasif gelir elde ediyorum. CRAFTORA ekosistemi harika!",
      rating: 5,
      product: "📱 Mobile App UI",
      color: '#8b5cf6'
    },
    {
      name: "Ayşe Yıldız",
      role: "Eğitmen",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      content: "Arduino derslerimi video olarak paylaştım, binlerce kişi izledi. Artık tanınan bir eğitmenim.",
      rating: 5,
      product: "🎬 Arduino Eğitim Serisi",
      color: '#10b981'
    }
  ];

  const stats = [
    { value: "10K+", label: "Mutlu Kullanıcı", icon: "😊" },
    { value: "15K+", label: "Başarılı Proje", icon: "🚀" },
    { value: "50K+", label: "Saat İçerik", icon: "🎥" },
    { value: "4.9", label: "Ortalama Puan", icon: "⭐" }
  ];

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
    }
  };

  return (
    <div style={styles.container}>
      
      {/* BACKGROUND DESENİ */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, ${colors.primary} 0%, transparent 30%),
          radial-gradient(circle at 80% 70%, ${colors.accent} 0%, transparent 30%),
          repeating-linear-gradient(45deg, transparent 0px, transparent 20px, ${colors.primary}10 20px, ${colors.primary}10 40px)
        `,
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative'
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
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              display: 'inline-block',
              padding: '8px 24px',
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
              borderRadius: 40,
              marginBottom: 20,
              border: `1px solid ${colors.primary}30`,
              color: colors.primary,
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            💬 COMMUNITY LOVE
          </motion.span>

          <h2 style={styles.headerTitle}>
            Trusted by{' '}
            <span style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Creators
            </span>{' '}
            Worldwide
          </h2>

          <p style={{
            fontSize: window.innerWidth < 768 ? '1rem' : '1.2rem',
            color: colors.textSecondary,
            maxWidth: 600,
            margin: '0 auto',
            padding: window.innerWidth < 768 ? '0 16px' : '0'
          }}>
            Real stories from real people who built their dreams on CRAFTORA
          </p>
        </motion.div>

        {/* İSTATİSTİKLER - 4'lü kart */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 
            ? 'repeat(2, 1fr)' 
            : 'repeat(4, 1fr)',
          gap: window.innerWidth < 768 ? 15 : 20,
          marginBottom: window.innerWidth < 768 ? 40 : 60
        }}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                background: colors.surface,
                padding: window.innerWidth < 768 ? '15px' : '20px',
                borderRadius: 20,
                border: `1px solid ${colors.border}`,
                textAlign: 'center',
                boxShadow: isDarkMode 
                  ? '0 10px 20px -10px rgba(0,0,0,0.5)' 
                  : '0 10px 20px -10px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{stat.icon}</div>
              <div style={{
                fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem',
                fontWeight: 800,
                color: idx === 0 ? colors.primary : idx === 1 ? colors.accent : idx === 2 ? '#8b5cf6' : '#f59e0b',
                lineHeight: 1.2,
                marginBottom: 4
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
                color: colors.textSecondary
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ANA YORUM SLIDER'I */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
          gap: 30,
          alignItems: 'center',
          marginBottom: 40
        }}>
          
          {/* BÜYÜK YORUM KARTI */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: colors.surface,
              borderRadius: 40,
              padding: window.innerWidth < 768 ? 30 : 40,
              border: `1px solid ${colors.border}`,
              boxShadow: isDarkMode 
                ? '0 30px 60px -30px rgba(0,0,0,0.8)' 
                : '0 30px 60px -30px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            {/* TIRNAK İŞARETİ */}
            <div style={{
              position: 'absolute',
              top: 20,
              right: 30,
              fontSize: '8rem',
              color: testimonials[activeIndex].color,
              opacity: 0.1,
              fontFamily: 'serif'
            }}>
              "
            </div>

            {/* KULLANICI BİLGİSİ */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 25
            }}>
              <img 
                src={testimonials[activeIndex].avatar}
                alt={testimonials[activeIndex].name}
                style={{
                  width: window.innerWidth < 768 ? 60 : 70,
                  height: window.innerWidth < 768 ? 60 : 70,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `3px solid ${testimonials[activeIndex].color}`
                }}
              />
              <div>
                <h4 style={{
                  fontSize: window.innerWidth < 768 ? '1.3rem' : '1.5rem',
                  fontWeight: 700,
                  color: colors.text,
                  marginBottom: 4
                }}>
                  {testimonials[activeIndex].name}
                </h4>
                <p style={{
                  color: testimonials[activeIndex].color,
                  fontWeight: 600,
                  marginBottom: 8
                }}>
                  {testimonials[activeIndex].role}
                </p>
                {/* YILDIZLAR */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: '#f59e0b', fontSize: '1.2rem' }}>★</span>
                  ))}
                </div>
              </div>
            </div>

            {/* YORUM */}
            <p style={{
              fontSize: window.innerWidth < 768 ? '1.1rem' : '1.3rem',
              color: colors.text,
              lineHeight: 1.6,
              marginBottom: 20,
              fontStyle: 'italic',
              position: 'relative',
              zIndex: 2
            }}>
              "{testimonials[activeIndex].content}"
            </p>

            {/* ÜRÜN BADGE */}
            <div style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: `${testimonials[activeIndex].color}15`,
              borderRadius: 40,
              color: testimonials[activeIndex].color,
              fontWeight: 600,
              fontSize: '1rem',
              border: `1px solid ${testimonials[activeIndex].color}30`
            }}>
              {testimonials[activeIndex].product}
            </div>
          </motion.div>

          {/* DİĞER YORUMLAR (KÜÇÜK KARTLAR) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 15
          }}>
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 10 }}
                onClick={() => setActiveIndex(idx)}
                style={{
                  background: colors.surface,
                  padding: 20,
                  borderRadius: 30,
                  border: activeIndex === idx 
                    ? `2px solid ${t.color}` 
                    : `1px solid ${colors.border}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: activeIndex === idx ? 1 : 0.7,
                  boxShadow: activeIndex === idx 
                    ? `0 10px 30px -10px ${t.color}` 
                    : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 15
                }}>
                  <img 
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${t.color}`
                    }}
                  />
                  <div>
                    <h5 style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: colors.text,
                      marginBottom: 4
                    }}>
                      {t.name}
                    </h5>
                    <p style={{
                      color: t.color,
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>
                      {t.product}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* NAVİGASYON OKLARI */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginTop: 30
        }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              color: colors.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="material-icons">arrow_back</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              color: colors.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span className="material-icons">arrow_forward</span>
          </motion.button>
        </div>

        {/* ALT CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center',
            marginTop: 60
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: window.innerWidth < 768 ? '16px 30px' : '18px 45px',
              fontSize: window.innerWidth < 768 ? '1rem' : '1.1rem',
              fontWeight: 600,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              border: 'none',
              borderRadius: 50,
              color: 'white',
              cursor: 'pointer',
              boxShadow: `0 20px 30px -10px ${colors.primary}80`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <span>✨ Join Our Community</span>
            <span className="material-icons">arrow_forward</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CraftoraTestimonials;