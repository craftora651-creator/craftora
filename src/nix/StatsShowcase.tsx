// nix/StatsShowcase.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const StatsShowcase: React.FC = () => {
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

  // CRAFTORA RENKLERİ - Dark/Light uyumlu
  const colors = {
    bg: isDarkMode ? '#1a2c2c' : '#FFF5E1',
    surface: isDarkMode ? '#233636' : '#FFFCF5',
    text: isDarkMode ? '#f8fcfc' : '#0c1d1d',
    textSecondary: isDarkMode ? '#b0c4c4' : '#4a5c5c',
    primary: '#008080',
    primaryLight: '#40a0a0',
    accent: '#FF6F61',
    accentLight: '#ff9f95',
    border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  };

  const stats = [
    {
      icon: '📦',
      value: '10,000+',
      label: 'Products Sold',
      sublabel: 'Digital & Physical',
      color: colors.primary,
      trend: '+25%',
      trendUp: true
    },
    {
      icon: '👥',
      value: '5,200+',
      label: 'Active Creators',
      sublabel: 'Join our community',
      color: colors.accent,
      trend: '+12%',
      trendUp: true
    },
    {
      icon: '🎬',
      value: '15,000+',
      label: 'Video Hours',
      sublabel: 'Content watched',
      color: '#8b5cf6',
      trend: '+48%',
      trendUp: true
    },
    {
      icon: '💡',
      value: '850+',
      label: 'Community Projects',
      sublabel: 'Shared this month',
      color: '#10b981',
      trend: '+8%',
      trendUp: true
    }
  ];

  return (
    <div style={{
      padding: '60px 24px',
      background: colors.bg,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* BACKGROUND PATTERN */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.3,
        backgroundImage: `
          radial-gradient(circle at 30% 40%, ${colors.primary}15 0%, transparent 30%),
          radial-gradient(circle at 70% 60%, ${colors.accent}15 0%, transparent 30%),
          repeating-linear-gradient(45deg, ${colors.primary}05 0px, ${colors.primary}05 1px, transparent 1px, transparent 20px)
        `,
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: 50
          }}
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
              borderRadius: 40,
              marginBottom: 20,
              border: `1px solid ${colors.primary}30`,
              color: colors.primary,
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            📊 CRAFTORA IN NUMBERS
          </motion.span>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: colors.text,
            marginBottom: 15
          }}>
            Growing{' '}
            <span style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Stronger
            </span>{' '}
            Every Day
          </h2>

          <p style={{
            fontSize: '1.1rem',
            color: colors.textSecondary,
            maxWidth: 600,
            margin: '0 auto'
          }}>
            Join thousands of creators who trust CRAFTORA
          </p>
        </motion.div>

        {/* STATS GRID - 4'lü kart */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 25,
          marginBottom: 40
        }}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
              style={{
                background: colors.surface,
                borderRadius: 30,
                padding: '30px 25px',
                border: `1px solid ${colors.border}`,
                boxShadow: isDarkMode 
                  ? '0 20px 40px -15px rgba(0,0,0,0.5)' 
                  : '0 20px 40px -15px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* HOVER GLOW EFFECT */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `radial-gradient(circle at 50% 50%, ${stat.color} 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }}
              />

              {/* ICON */}
              <div style={{
                fontSize: '3rem',
                marginBottom: 20,
                filter: `drop-shadow(0 10px 15px ${stat.color}40)`
              }}>
                {stat.icon}
              </div>

              {/* VALUE */}
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1.2,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                {stat.value}
                
                {/* TREND BADGE */}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  style={{
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    background: stat.trendUp ? '#10b98120' : '#ef444420',
                    color: stat.trendUp ? '#10b981' : '#ef4444',
                    borderRadius: 40,
                    fontWeight: 600
                  }}
                >
                  {stat.trend}
                </motion.span>
              </div>

              {/* LABEL */}
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: colors.text,
                marginBottom: 6
              }}>
                {stat.label}
              </div>

              {/* SUBLABEL */}
              <div style={{
                fontSize: '0.9rem',
                color: colors.textSecondary
              }}>
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM MESSAGE */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          style={{
            textAlign: 'center',
            marginTop: 30
          }}
        >
          <p style={{
            color: colors.textSecondary,
            fontSize: '0.95rem'
          }}>
            ✨ Updated live • Last 30 days
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsShowcase;