// components/Hero.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Hero.css';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Geri gelince animasyon
  useEffect(() => {
    const heroSection = document.querySelector('.hero-section');
    if (location.state?.from === 'medya') {
      heroSection?.classList.add('from-back');
      setTimeout(() => {
        heroSection?.classList.remove('from-back');
      }, 600);
    }
  }, [location]);

  const createStardust = () => {
    for (let i = 0; i < 30; i++) {
      const stardust = document.createElement('div');
      stardust.className = 'hero-stardust';
      
      // Rastalan varyasyonlar
      const angle = (i / 30) * Math.PI * 2;
      const distance = 100 + Math.random() * 150;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      stardust.style.setProperty('--x', `${x}px`);
      stardust.style.setProperty('--y', `${y}px`);
      stardust.style.left = '50%';
      stardust.style.top = '50%';
      stardust.style.animationDelay = `${i * 0.02}s`;
      
      document.body.appendChild(stardust);
      
      setTimeout(() => {
        stardust.remove();
      }, 2000);
    }
  };

  const createBeams = () => {
    const beamsContainer = document.createElement('div');
    beamsContainer.className = 'hero-portal-beams';
    
    for (let i = 0; i < 12; i++) {
      const beam = document.createElement('div');
      beam.className = 'hero-portal-beam';
      beam.style.left = `${(i / 12) * 100}%`;
      beam.style.animationDelay = `${i * 0.1}s`;
      beamsContainer.appendChild(beam);
    }
    
    document.body.appendChild(beamsContainer);
    
    setTimeout(() => {
      beamsContainer.remove();
    }, 2000);
  };

  const handleMedya = () => {
    // Body'e geçiş class'ı ekle
    document.body.classList.add('page-transition');
    
    // Portal elementini ekle
    const portal = document.querySelector('.hero-portal');
    if (portal) {
      portal.classList.add('active');
    }
    
    // Işınları oluştur
    createBeams();
    
    // Yıldız tozlarını oluştur
    createStardust();
    
    // Animasyonlu geçiş
    setTimeout(() => {
      navigate('/medya', { state: { from: 'hero' } });
      
      // Temizlik
      setTimeout(() => {
        document.body.classList.remove('page-transition');
        document.body.classList.add('page-transition-end');
        setTimeout(() => {
          document.body.classList.remove('page-transition-end');
        }, 300);
      }, 100);
    }, 1200);
  };

  return (
    <section className="hero-section">
      {/* Portal (her zaman var, gizli) */}
      <div className="hero-portal"></div>
      
      {/* Abstract Background Blobs */}
      <motion.div 
        className="hero-blob-1"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      <motion.div 
        className="hero-blob-2"
        animate={{ 
          rotate: -360,
          scale: [1, 1.3, 1],
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      <div className="hero-container">
        <div className="hero-grid">
          {/* Text Content */}
          <motion.div 
            className="hero-text-content"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div 
              className="hero-badge"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <span className="hero-badge-dot"></span>
              <span className="hero-badge-text">v2.0 is live</span>
            </motion.div>
            
            {/* Heading */}
            <motion.h1 
              className="hero-heading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Master Your <br />
              <motion.span 
                className="text-gradient"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
              >
                Digital Craft.
              </motion.span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              The all-in-one workspace for creators and managers. Experience the
              future of content management with our ultra-modern platform.
            </motion.p>
            
            {/* Buttons */}
            <motion.div 
              className="hero-buttons"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
            >
              <motion.button 
                onClick={handleMedya}
                className="hero-primary-button"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 30px rgba(224,124,92,0.6)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
                <span className="material-symbols-outlined">rocket_launch</span>
              </motion.button>
              
              <motion.button 
                className="hero-secondary-button"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(224,124,92,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined">play_circle</span>
                Watch Demo
              </motion.button>
            </motion.div>
            
            {/* Trust Section */}
            <motion.div 
              className="hero-trust-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              <div className="hero-avatar-stack">
                {[1, 2, 3].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="hero-avatar"
                    style={{ 
                      backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDDM1JFtFE36hhDRfNRq33ZXwrtcEYIf2fkr6f9_SMuRpmPOzVg46kzdzobx37lZ0FMu2Y2ameUZpbaTpp2s-tW2g_V9KTuUAtlUcoVy7lDQVUIL0shTTyLYcckN0XvxrJKvKV4oI4uT6Td2nQG_Hl0my6AQIYW4FSJ1dD5f9mkcplbkSHZ_HsMkxofiiSfIa5DDfjTD7_xWO8ben6kJ-ASMz9wEsZCNxjiaa_3NRyBWjZLp6AGBOgUIm6TW9PsLM0_xjrEYqZTpNPb')" 
                    }}
                    initial={{ x: -20 * i, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.7 + i * 0.1, duration: 0.4 }}
                  />
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.4 }}
              >
                Trusted by 10,000+ creators
              </motion.p>
            </motion.div>
          </motion.div>
          
          {/* Hero Image / Visual */}
          <motion.div 
            className="hero-image-container perspective-1000"
            initial={{ x: 100, opacity: 0, rotateY: 15 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
          >
            <motion.div 
              className="hero-gradient-bg"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            
            <motion.div 
              className="hero-ui-mockup"
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.4 }}
            >
              {/* UI Mockup Header */}
              <div className="hero-ui-header">
                <div className="hero-ui-dot hero-ui-dot-red"></div>
                <div className="hero-ui-dot hero-ui-dot-yellow"></div>
                <div className="hero-ui-dot hero-ui-dot-green"></div>
              </div>
              
              {/* UI Mockup Body */}
              <div className="hero-ui-body">
                <div 
                  className="hero-ui-screen"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAu6X4jlriwSRU-N1DgGcoiVdx6lSXSvRefc-tnYDNjw7dYwx6V3kQggSgeY4rg1HMCOb3DTyS6SAdmulE4mdYIUPR_7uySWE6zN6opf0OVFKpZfeegjiOqTfkkt90gEZk23a9I9rI3OB24bqabrqkWQmqXc2nWmz4VWB9Ztgb_dyT5YN94dqFp9wACOsjTtOSCvvw_qN7qH9UMwBtCeXzYcAOH1SA1HdvH5jw-gTdMNXa1_yQk3K01fs5S8wvRjajAdlwHzwf9JCn_')" }}
                />
              </div>
              
              {/* Floating Card 1 */}
              <motion.div 
                className="hero-floating-card-1"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, -2, 0, 2, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <div className="hero-floating-card-1-icon">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div className="hero-floating-card-1-content">
                  <p>Engagement</p>
                  <p>+124%</p>
                </div>
              </motion.div>
              
              {/* Floating Card 2 */}
              <motion.div 
                className="hero-floating-card-2"
                animate={{ 
                  y: [0, -10, 0],
                  x: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 7, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="hero-floating-card-2-header">
                  <span>Project A</span>
                  <span>85%</span>
                </div>
                <div className="hero-floating-card-2-bar">
                  <motion.div 
                    className="hero-floating-card-2-fill"
                    initial={{ width: "0%" }}
                    animate={{ width: "85%" }}
                    transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;