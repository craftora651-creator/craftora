// share/intro.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

// Logoyu import et
import craftoraLogo from '../images/Craftora.jpg';

interface IntroProps {
  onComplete: () => void;
  duration?: number;
}

const Intro: React.FC<IntroProps> = ({
  onComplete,
  duration = 6000 // 6 saniye
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Mouse hareketi için physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Süper yumuşak spring
  const springConfig = { damping: 15, stiffness: 50, mass: 1.5 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);

  // Ölçek efekti
  const scale = useSpring(1, { damping: 20, stiffness: 200 });

  // Glitch efekti tetikle
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 100);
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Mouse takibi
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const x = e.clientX - rect.left - centerX;
      const y = e.clientY - rect.top - centerY;

      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const timer = setTimeout(onComplete, duration);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [duration, onComplete, mouseX, mouseY]);

  // INLINE STYLES
  const styles = {
    container: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: '#000',
      zIndex: 999999,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    overlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 50% 50%, #1a0f00, #000 80%)',
      boxShadow: 'inset 0 0 300px rgba(255,215,0,0.2)',
    },

    lightLayer1: {
      position: 'absolute' as const,
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 30% 50%, rgba(255,215,0,0.3) 0%, transparent 50%)',
      mixBlendMode: 'overlay' as const,
    },

    lightLayer2: {
      position: 'absolute' as const,
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)',
      mixBlendMode: 'screen' as const,
    },

    lightLayer3: {
      position: 'absolute' as const,
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 20% 80%, rgba(255,200,100,0.3) 0%, transparent 70%)',
      mixBlendMode: 'soft-light' as const,
    },

    logoWrapper: {
      position: 'relative' as const,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: '40px',
      transformStyle: 'preserve-3d' as const,
      perspective: '1500px',
    },

    logoImage: {
      width: 'min(600px, 85vw)',
      height: 'auto',
      borderRadius: '40px',
      boxShadow: `
        0 40px 80px rgba(0,0,0,0.8),
        0 0 0 5px rgba(255,215,0,0.3),
        0 0 100px rgba(255,215,0,0.5),
        0 0 200px rgba(255,215,0,0.3),
        inset 0 0 50px rgba(255,215,0,0.3)
      `,
      filter: 'brightness(1.2) contrast(1.2) saturate(1.3)',
      border: '1px solid rgba(255,215,0,0.3)',
    },

    logoText: {
      fontSize: 'clamp(4rem, 15vw, 8rem)',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #FFD700, #FFF, #FFA500, #FFD700, #FFF, #FFD700)',
      backgroundSize: '400% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 'clamp(15px, 4vw, 40px)',
      fontFamily: "'Montserrat', 'Poppins', 'Impact', sans-serif",
      textShadow: `
        0 0 50px rgba(255,215,0,0.8),
        0 0 100px rgba(255,215,0,0.5),
        0 0 150px rgba(255,215,0,0.3),
        3px 3px 0 rgba(255,100,0,0.3),
        -3px -3px 0 rgba(255,255,255,0.3)
      `,
      marginTop: '30px',
      filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.6))',
      whiteSpace: 'nowrap' as const,
      transform: 'perspective(500px) rotateX(2deg)',
    },

    lightBeam1: {
      position: 'absolute' as const,
      top: '-20%',
      left: '-10%',
      width: '70%',
      height: '140%',
      background: 'linear-gradient(135deg, transparent, rgba(255,215,0,0.2), rgba(255,255,255,0.3), rgba(255,215,0,0.2), transparent)',
      transform: 'rotate(25deg)',
      filter: 'blur(60px)',
      pointerEvents: 'none' as const,
      zIndex: 50,
    },

    lightBeam2: {
      position: 'absolute' as const,
      top: '-10%',
      right: '-10%',
      width: '60%',
      height: '120%',
      background: 'linear-gradient(225deg, transparent, rgba(255,200,100,0.15), rgba(255,255,255,0.2), rgba(255,200,100,0.15), transparent)',
      transform: 'rotate(-15deg)',
      filter: 'blur(80px)',
      pointerEvents: 'none' as const,
      zIndex: 50,
    },

    lightBurst: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '150%',
      height: '150%',
      background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
      filter: 'blur(100px)',
      pointerEvents: 'none' as const,
      zIndex: 40,
    },

    progressBar: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      height: '6px',
      background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700, #FFF, #FF4500, #FFD700)',
      backgroundSize: '300% 100%',
      boxShadow: `
        0 -10px 30px #FFD700,
        0 -20px 60px rgba(255,215,0,0.6),
        0 -30px 90px rgba(255,215,0,0.4)
      `,
      zIndex: 200,
      borderTop: '1px solid rgba(255,255,255,0.3)',
    },

    particle: {
      position: 'absolute' as const,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #FFD700, #FF4500)',
      pointerEvents: 'none' as const,
      zIndex: 30,
      filter: 'blur(4px)',
      boxShadow: '0 0 20px #FFD700',
    },

    glitchOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, rgba(255,0,0,0.2), rgba(0,255,0,0.1), rgba(0,0,255,0.2))',
      mixBlendMode: 'difference' as const,
      zIndex: 1000,
      pointerEvents: 'none' as const,
    },
  };

  // 100 PARTİKÜL
  const particles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    size: Math.random() * 15 + 3,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 6 + 4,
    opacity: Math.random() * 0.7 + 0.3,
    blur: Math.random() * 5 + 2,
    color: `rgba(${255 - Math.random() * 50}, ${215 - Math.random() * 50}, ${Math.random() * 50}, 0.8)`,
  }));

  // ANİMASYON VARYANTLARI
  const containerVariants = {
    initial: { opacity: 0, scale: 1.5 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: {
      opacity: 0,
      scale: 2,
      filter: 'blur(20px)',
      transition: { duration: 1.2 }
    }
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 0.98, 0.95, 0.9, 0],
      transition: {
        duration: duration / 1000,
        times: [0, 0.1, 0.5, 0.85, 1],
        ease: "easeInOut"
      }
    }
  };

  const logoVariants = {
    initial: {
      y: "-150vh",
      opacity: 0,
      scale: 0.1,
      rotate: -30,
      filter: "blur(30px)"
    },
    animate: {
      y: 0,
      opacity: [0, 1, 1, 1, 0.95, 0],
      scale: [0.1, 1.3, 1.1, 1, 0.98, 0.95],
      rotate: [-30, 10, -5, 2, 0, -2],
      filter: [
        "blur(30px)",
        "blur(0px)",
        "blur(0px)",
        "blur(0px)",
        "blur(2px)",
        "blur(8px)"
      ],
      transition: {
        y: {
          type: "spring",
          stiffness: 15,
          damping: 10,
          mass: 2,
          duration: 3.5
        },
        opacity: {
          duration: duration / 1000,
          times: [0, 0.15, 0.3, 0.6, 0.85, 1],
          ease: "easeInOut"
        },
        scale: {
          duration: duration / 1000,
          times: [0, 0.2, 0.35, 0.6, 0.85, 1],
          ease: [0.34, 1.56, 0.64, 1] // ✅ ŞİMDİ OLDU!
        },
        rotate: {
          duration: duration / 1000,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          ease: "easeOut"
        },
        filter: {
          duration: duration / 1000,
          times: [0, 0.1, 0.3, 0.5, 0.8, 1]
        }
      }
    }
  };

  const textVariants = {
    initial: {
      opacity: 0,
      scale: 0.3,
      filter: "blur(20px)",
      rotateX: 45,
    },
    animate: {
      opacity: [0, 1, 1, 1, 0.9, 0],
      scale: [0.3, 1.5, 1.2, 1, 0.95, 0.9],
      filter: ["blur(20px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(4px)", "blur(10px)"],
      rotateX: [45, 0, 0, 0, -5, 0],
      textShadow: [
        "0 0 0px rgba(255,215,0,0)",
        "0 0 60px rgba(255,215,0,1)",
        "0 0 100px rgba(255,215,0,0.9)",
        "0 0 80px rgba(255,215,0,0.7)",
        "0 0 60px rgba(255,215,0,0.5)",
        "0 0 40px rgba(255,215,0,0.3)"
      ],
      transition: {
        duration: duration / 1000,
        times: [0, 0.2, 0.4, 0.6, 0.85, 1],
        ease: "easeInOut"
      }
    }
  };

  const beamVariants = {
    initial: { x: "-150%", opacity: 0, rotate: 25 },
    animate: {
      x: ["-150%", "250%"],
      opacity: [0, 0.8, 0.6, 0.4, 0],
      transition: {
        duration: duration / 1000 * 0.8,
        times: [0, 0.3, 0.6, 0.8, 1],
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={styles.container}
      >
        {/* Ana overlay */}
        <motion.div
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          style={styles.overlay}
        />

        {/* Işık katmanları */}
        <div style={styles.lightLayer1} />
        <div style={styles.lightLayer2} />
        <div style={styles.lightLayer3} />

        {/* Işık patlaması */}
        <motion.div
          style={styles.lightBurst}
          animate={{
            scale: [1, 1.5, 1, 1.3, 1],
            opacity: [0.3, 0.8, 0.4, 0.6, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Dev ışık hüzmeleri */}
        <motion.div
          variants={beamVariants}
          initial="initial"
          animate="animate"
          style={styles.lightBeam1}
        />

        <motion.div
          style={styles.lightBeam2}
          animate={{
            x: ["200%", "-200%"],
            opacity: [0, 0.6, 0.3, 0],
          }}
          transition={{
            duration: duration / 1000 * 0.9,
            delay: 0.3,
            ease: "easeInOut"
          }}
        />

        {/* 100 PARTİKÜL */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              ...styles.particle,
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: p.color,
              filter: `blur(${p.blur}px)`,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
            animate={{
              scale: [1, 2, 0.5, 1.5, 0],
              opacity: [p.opacity, p.opacity * 2, p.opacity * 0.3, p.opacity, 0],
              x: [
                0,
                (Math.random() - 0.5) * 400,
                (Math.random() - 0.5) * 400,
                0,
                (Math.random() - 0.5) * 500
              ],
              y: [
                0,
                (Math.random() - 0.5) * 400,
                (Math.random() - 0.5) * 400,
                0,
                (Math.random() - 0.5) * 500
              ],
              rotate: [0, 180, 360, 540, 720],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* ANA LOGO */}
        <motion.div
          style={{
            ...styles.logoWrapper,
            rotateX,
            rotateY,
            scale,
          }}
          animate={{
            scale: [1, 1.02, 1, 1.01, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate="animate"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Logo resmi */}
            <motion.img
              src={craftoraLogo}
              alt="Craftora"
              style={styles.logoImage}
              animate={{
                boxShadow: [
                  '0 40px 80px rgba(0,0,0,0.8), 0 0 0 5px rgba(255,215,0,0.3), 0 0 100px rgba(255,215,0,0.5)',
                  '0 40px 80px rgba(0,0,0,0.8), 0 0 0 8px rgba(255,215,0,0.5), 0 0 150px rgba(255,215,0,0.8)',
                  '0 40px 80px rgba(0,0,0,0.8), 0 0 0 5px rgba(255,215,0,0.3), 0 0 100px rgba(255,215,0,0.5)',
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Craftora yazısı */}
            <motion.div
              variants={textVariants}
              initial="initial"
              animate="animate"
              style={styles.logoText}
            >
              CRAFTORA
            </motion.div>

            {/* Altın tozu efekti */}
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>

        {/* GLITCH EFEKTİ */}
        {glitchEffect && (
          <motion.div
            style={styles.glitchOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 1, 0] }}
            transition={{ duration: 0.1 }}
          />
        )}

        {/* PROGRESS BAR */}
        <motion.div
          style={styles.progressBar}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: '-10px',
              left: '0',
              width: '100%',
              height: '20px',
              background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)',
              filter: 'blur(10px)',
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <style>
          {`
            @keyframes beamFloat {
              0%, 100% { transform: rotate(25deg) translateX(0) translateY(0); }
              33% { transform: rotate(23deg) translateX(2%) translateY(-2%); }
              66% { transform: rotate(27deg) translateX(-2%) translateY(2%); }
            }
          `}
        </style>
      </motion.div>
    </AnimatePresence>
  );
};

export default Intro;