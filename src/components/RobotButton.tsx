import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const RobotButton = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [isExcited, setIsExcited] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [bounce, setBounce] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; scale: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  let rippleId = 0;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fizik tabanlı sallanma
  useEffect(() => {
    let frameId: number;
    let time = 0;
    const animate = () => {
      time += 0.02;
      if (isHovered) {
        setRotation(Math.sin(time * 8) * 4);
        setBounce(Math.abs(Math.sin(time * 12)) * 3);
      } else {
        setRotation(Math.sin(time * 2) * 1);
        setBounce(Math.abs(Math.sin(time * 3)) * 1);
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [isHovered]);

  // Mouse takibi - fiziksel tepki
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / 30;
        const deltaY = (e.clientY - centerY) / 30;
        setMousePos({ x: Math.min(Math.max(deltaX, -8), 8), y: Math.min(Math.max(deltaY, -8), 8) });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hareket animasyonları
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 600);
    }, 7000);
    
    const happyInterval = setInterval(() => {
      setIsHappy(true);
      setTimeout(() => setIsHappy(false), 1000);
    }, 9000);
    
    const exciteInterval = setInterval(() => {
      setIsExcited(true);
      setTimeout(() => setIsExcited(false), 800);
    }, 15000);
    
    return () => {
      clearInterval(waveInterval);
      clearInterval(happyInterval);
      clearInterval(exciteInterval);
    };
  }, []);

  // Scroll'da gizlenme
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const createRipple = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: rippleId++, x, y, scale: 1 };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (e: React.MouseEvent) => {
    createRipple(e);
    setTimeout(() => {
      navigate('/crafotra-gpt');
    }, 150);
  };

  const styles = {
    container: {
      position: 'fixed' as const,
      bottom: isMobile ? '24px' : '32px',
      right: isMobile ? '24px' : '32px',
      zIndex: 9999,
      transform: isVisible ? 'translateX(0) translateY(0)' : 'translateX(120px) translateY(30px)',
      transition: 'transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
      filter: `drop-shadow(0 ${bounce * 0.5}px ${bounce * 1.5}px rgba(0,0,0,0.2))`,
    },
    wrapper: {
      position: 'relative' as const,
      transform: `rotate(${rotation + mousePos.x * 2}deg) translateY(${bounce * -0.5}px)`,
      transition: 'transform 0.05s linear',
    },
    button: {
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      padding: 0,
      outline: 'none',
      position: 'relative' as const,
    },
    // Dalga efekti
    waveRing: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(59,130,246,0) 70%)',
      animation: isHovered ? 'pulseWave 1s ease-out infinite' : 'none',
      pointerEvents: 'none' as const,
    },
    // Ana gövde
    robotBody: {
      position: 'relative' as const,
      width: isMobile ? '72px' : '84px',
      height: isMobile ? '72px' : '84px',
      background: `linear-gradient(135deg, 
        ${isExcited ? '#f59e0b' : '#3b82f6'} 0%, 
        ${isExcited ? '#d97706' : '#1e40af'} 100%)`,
      borderRadius: '50%',
      boxShadow: isHovered 
        ? `0 25px 40px -12px ${isExcited ? 'rgba(245,158,11,0.5)' : 'rgba(59,130,246,0.5)'}, 
           0 0 0 5px rgba(255,255,255,0.25),
           inset 0 2px 10px rgba(255,255,255,0.3),
           inset 0 -3px 5px rgba(0,0,0,0.1)` 
        : `0 18px 30px -10px rgba(0,0,0,0.25),
           0 0 0 3px rgba(255,255,255,0.2),
           inset 0 1px 5px rgba(255,255,255,0.2)`,
      transform: `scale(${isHovered ? 1.03 : 1}) translateY(${isWaving ? -3 : 0}px)`,
      transition: 'all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    // Işık parlaması
    shine: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at ${30 + mousePos.x * 3}% ${30 + mousePos.y * 3}%, 
        rgba(255,255,255,0.4) 0%, 
        rgba(255,255,255,0) 60%)`,
      borderRadius: '50%',
      pointerEvents: 'none' as const,
    },
    // Kollar
    armLeft: {
      position: 'absolute' as const,
      left: '-22px',
      top: '50%',
      transform: `translateY(-50%) ${isWaving ? 'rotate(-45deg)' : isHovered ? 'rotate(-28deg)' : 'rotate(-18deg)'}`,
      width: '24px',
      height: '48px',
      background: `linear-gradient(135deg, ${isExcited ? '#f59e0b' : '#3b82f6'} 0%, ${isExcited ? '#d97706' : '#1e3a8a'} 100%)`,
      borderRadius: '30px',
      transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.1), 2px 4px 8px rgba(0,0,0,0.2)',
    },
    armRight: {
      position: 'absolute' as const,
      right: '-22px',
      top: '50%',
      transform: `translateY(-50%) ${isWaving ? 'rotate(45deg)' : isHovered ? 'rotate(28deg)' : 'rotate(18deg)'}`,
      width: '24px',
      height: '48px',
      background: `linear-gradient(135deg, ${isExcited ? '#f59e0b' : '#3b82f6'} 0%, ${isExcited ? '#d97706' : '#1e3a8a'} 100%)`,
      borderRadius: '30px',
      transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      boxShadow: 'inset 2px -2px 0 rgba(0,0,0,0.1), -2px 4px 8px rgba(0,0,0,0.2)',
      animation: isWaving ? 'waveSwing 0.4s ease-in-out' : 'none',
    },
    // Anten
    antenna: {
      position: 'absolute' as const,
      top: '-18px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '6px',
      height: '28px',
      background: 'linear-gradient(180deg, #fbbf24, #f59e0b)',
      borderRadius: '3px',
    },
    antennaBall: {
      position: 'absolute' as const,
      top: '-12px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '16px',
      height: '16px',
      background: `radial-gradient(circle at 35% 35%, #fcd34d, ${isExcited ? '#f97316' : '#f59e0b'})`,
      borderRadius: '50%',
      boxShadow: `0 0 ${isExcited ? '20px' : '12px'} rgba(251,191,36,0.6)`,
      animation: 'antennaGlow 1s ease infinite',
    },
    // Yüz
    face: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '8px',
      zIndex: 2,
    },
    eyes: {
      display: 'flex',
      gap: '18px',
      position: 'relative' as const,
    },
    eyeLeft: {
      width: isMobile ? '12px' : '14px',
      height: isMobile ? '12px' : '14px',
      background: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 ${isExcited ? '12px' : '5px'} rgba(255,255,255,0.8)`,
      transform: isHappy ? 'scale(1.2)' : 'scale(1)',
      transition: 'all 0.2s ease',
    },
    eyeRight: {
      width: isMobile ? '12px' : '14px',
      height: isMobile ? '12px' : '14px',
      background: '#ffffff',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 ${isExcited ? '12px' : '5px'} rgba(255,255,255,0.8)`,
      transform: isHappy ? 'scale(1.2)' : 'scale(1)',
      transition: 'all 0.2s ease',
    },
    pupil: {
      width: '6px',
      height: '6px',
      background: isExcited ? '#f97316' : '#0f172a',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
      transform: isHovered ? 'scale(1.2)' : 'scale(1)',
    },
    // Yanaklar
    cheek: {
      position: 'absolute' as const,
      bottom: '18px',
      width: '12px',
      height: '8px',
      background: 'rgba(255,182,193,0.5)',
      borderRadius: '50%',
      filter: 'blur(2px)',
      opacity: isHappy ? 0.8 : 0,
      transition: 'opacity 0.2s ease',
    },
    cheekLeft: {
      left: '12px',
    },
    cheekRight: {
      right: '12px',
    },
    // Ağız
    mouth: {
      width: '28px',
      height: isHappy ? '12px' : '10px',
      borderBottom: `2px solid ${isExcited ? '#fbbf24' : '#ffffff'}`,
      borderRadius: '0 0 20px 20px',
      transition: 'all 0.2s ease',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    },
    // Konuşma balonu
    bubble: {
      position: 'absolute' as const,
      top: '-55px',
      left: '50%',
      transform: `translateX(-50%) ${isHovered ? 'translateY(-5px)' : 'translateY(0)'}`,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      padding: isMobile ? '8px 16px' : '10px 20px',
      borderRadius: '28px',
      fontSize: isMobile ? '11px' : '12px',
      fontWeight: 600,
      color: '#3b82f6',
      whiteSpace: 'nowrap' as const,
      opacity: isHovered ? 1 : 0,
      visibility: isHovered ? 'visible' : 'hidden',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1), 0 0 0 1px rgba(59,130,246,0.2)',
      pointerEvents: 'none' as const,
    },
    bubbleArrow: {
      position: 'absolute' as const,
      bottom: '-7px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 0,
      height: 0,
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderTop: '8px solid #ffffff',
    },
    // Ripple efekti
    rippleContainer: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '50%',
      overflow: 'hidden' as const,
      pointerEvents: 'none' as const,
    },
    ripple: {
      position: 'absolute' as const,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0) 70%)',
      transform: 'scale(0)',
      animation: 'rippleExpand 0.6s ease-out forwards',
      pointerEvents: 'none' as const,
    },
  };

  const animationStyles = `
    @keyframes pulseWave {
      0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0.8;
      }
      100% {
        transform: translate(-50%, -50%) scale(1.4);
        opacity: 0;
      }
    }
    
    @keyframes waveSwing {
      0%, 100% {
        transform: translateY(-50%) rotate(18deg);
      }
      50% {
        transform: translateY(-50%) rotate(52deg);
      }
    }
    
    @keyframes antennaGlow {
      0%, 100% {
        opacity: 0.6;
        transform: translateX(-50%) scale(1);
      }
      50% {
        opacity: 1;
        transform: translateX(-50%) scale(1.15);
      }
    }
    
    @keyframes rippleExpand {
      0% {
        transform: scale(0);
        opacity: 0.8;
      }
      100% {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-6px);
      }
    }
    
    @keyframes glowPulse {
      0%, 100% {
        box-shadow: 0 0 5px rgba(59,130,246,0.3);
      }
      50% {
        box-shadow: 0 0 20px rgba(59,130,246,0.6);
      }
    }
    
    .robot-float {
      animation: float 3s ease-in-out infinite;
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.container} ref={containerRef}>
        <div style={styles.wrapper}>
          <button
            style={styles.button}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            className="robot-float"
          >
            <div style={styles.waveRing} />
            <div style={styles.robotBody}>
              <div style={styles.shine} />
              
              <div style={styles.armLeft} />
              <div style={styles.armRight} />
              
              <div style={styles.antenna}>
                <div style={styles.antennaBall} />
              </div>
              
              <div style={styles.face}>
                <div style={styles.eyes}>
                  <div style={styles.eyeLeft}>
                    <div style={styles.pupil} />
                  </div>
                  <div style={styles.eyeRight}>
                    <div style={styles.pupil} />
                  </div>
                </div>
                <div style={styles.mouth} />
              </div>
              
              <div style={{ ...styles.cheek, ...styles.cheekLeft } as React.CSSProperties} />
              <div style={{ ...styles.cheek, ...styles.cheekRight } as React.CSSProperties} />
              
              <div style={styles.rippleContainer}>
                {ripples.map(ripple => (
                  <div
                    key={ripple.id}
                    style={{
                      ...styles.ripple,
                      left: ripple.x,
                      top: ripple.y,
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div style={styles.bubble}>
              <span>✨ CRAFTORA GPT ✨</span>
              <div style={styles.bubbleArrow} />
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default RobotButton;