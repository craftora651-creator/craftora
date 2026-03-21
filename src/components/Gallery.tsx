// components/Gallery.tsx
import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const Gallery: React.FC = () => {
    const galleryRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
    
    // Dark mode kontrolü
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

    // Renkler
    const colors = {
        bg: isDarkMode ? '#1a2c2c' : '#FFF5E1',
        surface: isDarkMode ? '#233636' : '#FFFCF5',
        text: isDarkMode ? '#f8fcfc' : '#0c1d1d',
        textSecondary: isDarkMode ? '#b0c4c4' : '#4a5c5c',
        primary: '#008080',
        accent: '#FF6F61',
        border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    };

    const scrollLeft = () => {
        if (galleryRef.current) {
            galleryRef.current.scrollBy({
                left: -400,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (galleryRef.current) {
            galleryRef.current.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        }
    };

    const galleryItems = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&auto=format",
            category: "Robotics",
            title: "MekaRobot v2.0",
            alt: "Robot assembly",
            color: colors.primary
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1631556097160-5c33b3b1b14c?w=600&auto=format",
            category: "3D Art",
            title: "Dragon Collection",
            alt: "3D printed dragon",
            color: colors.accent
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format",
            category: "UI Design",
            title: "Mobile App UI",
            alt: "App interface",
            color: '#8b5cf6'
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1553408228-10e475fe8c1c?w=600&auto=format",
            category: "Coding",
            title: "Arduino Workshop",
            alt: "Coding session",
            color: '#10b981'
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&auto=format",
            category: "Robotics",
            title: "MekaRobot v2.0",
            alt: "Robot assembly",
            color: colors.primary
        },
    ];

    const isMobile = window.innerWidth < 768;

    // Scrollbar gizleme için style
    const hideScrollbar = {
        msOverflowStyle: 'none' as const,
        scrollbarWidth: 'none' as const,
        WebkitOverflowScrolling: 'touch' as const
    };

    return (
        <motion.section 
            style={{
                paddingTop: '5rem',
                paddingBottom: '5rem',
                overflow: 'hidden',
                backgroundColor: colors.bg,
                transition: 'background-color 0.3s ease'
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Header */}
            <motion.div 
                ref={headerRef}
                style={{
                    maxWidth: '80rem',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingLeft: isMobile ? '1rem' : '2.5rem',
                    paddingRight: isMobile ? '1rem' : '2.5rem',
                    marginBottom: '2.5rem',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'flex-start' : 'flex-end',
                    gap: isMobile ? '1rem' : 0
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div style={{ flex: 1 }}>
                    <motion.h2 
                        style={{
                            fontSize: isMobile ? '1.875rem' : '2.25rem',
                            fontWeight: 700,
                            marginBottom: '0.5rem',
                            color: colors.text
                        }}
                        initial={{ opacity: 0, x: -30 }}
                        animate={headerInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Create. Manage. Scale.
                    </motion.h2>
                    <motion.p 
                        style={{
                            color: colors.textSecondary
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={headerInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        See what's possible with Craftora.
                    </motion.p>
                </div>

                <motion.div 
                    style={{
                        display: 'flex',
                        gap: '0.5rem'
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={headerInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
                >
                    <motion.button
                        onClick={scrollLeft}
                        aria-label="Previous slide"
                        whileHover={{ 
                            scale: 1.2,
                            backgroundColor: colors.primary,
                            color: 'white',
                            boxShadow: `0 0 15px ${colors.primary}80`
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            border: `1px solid ${colors.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'none',
                            cursor: 'pointer',
                            color: colors.text,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </motion.button>
                    <motion.button
                        onClick={scrollRight}
                        aria-label="Next slide"
                        whileHover={{ 
                            scale: 1.2,
                            backgroundColor: colors.primary,
                            color: 'white',
                            boxShadow: `0 0 15px ${colors.primary}80`
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            border: `1px solid ${colors.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'none',
                            cursor: 'pointer',
                            color: colors.text,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Gallery */}
            <motion.div
                ref={galleryRef}
                style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '1.5rem',
                    paddingLeft: isMobile ? '1rem' : '2.5rem',
                    paddingRight: isMobile ? '1rem' : '2.5rem',
                    paddingBottom: '2.5rem',
                    scrollSnapType: 'x mandatory',
                    ...hideScrollbar
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                drag="x"
                dragConstraints={galleryRef}
                dragElastic={0.2}
                dragMomentum={false}
                onDragEnd={(event, info) => {
                    if (info.offset.x < -100) {
                        scrollRight();
                    } else if (info.offset.x > 100) {
                        scrollLeft();
                    }
                }}
            >
                <style>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                <AnimatePresence>
                    {galleryItems.map((item, index) => (
                        <motion.div 
                            key={item.id} 
                            style={{
                                minWidth: isMobile ? '300px' : '400px',
                                scrollSnapAlign: 'center',
                                flexShrink: 0
                            }}
                            initial={{ opacity: 0, scale: 0.8, x: 100 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ 
                                duration: 0.6, 
                                delay: index * 0.15,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{ 
                                y: -15,
                                scale: 1.05,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <motion.div 
                                style={{
                                    position: 'relative',
                                    borderRadius: '2rem',
                                    overflow: 'hidden',
                                    aspectRatio: '4/3',
                                    cursor: 'pointer',
                                    backgroundColor: colors.surface,
                                    border: `1px solid ${colors.border}`,
                                    boxShadow: isDarkMode 
                                        ? '0 20px 40px -15px rgba(0,0,0,0.6)' 
                                        : '0 20px 40px -15px rgba(0,0,0,0.1)'
                                }}
                                whileHover={{ 
                                    boxShadow: `0 30px 40px -20px ${item.color}80`
                                }}
                            >
                                <motion.div 
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        zIndex: 10,
                                        transition: 'background-color 0.2s ease'
                                    }}
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                
                                <motion.div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: `url('${item.image}')`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        transition: 'transform 0.7s ease'
                                    }}
                                    role="img"
                                    aria-label={item.alt}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                />
                                
                                <motion.div 
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '1.5rem',
                                        zIndex: 20,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                                    }}
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                                >
                                    <motion.span 
                                        style={{
                                            color: item.color,
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            marginBottom: '0.5rem',
                                            display: 'block'
                                        }}
                                        whileHover={{ 
                                            color: colors.primary,
                                            x: 5,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        {item.category}
                                    </motion.span>
                                    <motion.h3 
                                        style={{
                                            color: 'white',
                                            fontSize: '1.25rem',
                                            fontWeight: 700
                                        }}
                                        whileHover={{ 
                                            color: colors.primary,
                                            x: 5,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        {item.title}
                                    </motion.h3>
                                </motion.div>

                                {/* Renkli üst çizgi */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3,
                                    background: item.color,
                                    zIndex: 30
                                }} />
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.section>
    );
};

export default Gallery;