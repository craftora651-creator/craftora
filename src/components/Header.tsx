// components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/Header.css';

interface HeaderProps {
    onGetStarted?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStarted }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode', !isDarkMode);
    };

    const handleGetStarted = () => {
        setIsAnimating(true);
        if (onGetStarted) {
            onGetStarted();
        }
        setTimeout(() => {
            setIsAnimating(false);
        }, 1200);
    };

    // Mobil menü açıkken body scroll'u engelle
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            <motion.div
                className="top-nav-container"
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    duration: 0.8
                }}
            >
                <nav className="main-nav">
                    {/* Logo */}
                    <div className="logo-container">
                        <motion.div
                            className="logo-icon"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                delay: 0.3,
                                duration: 0.6
                            }}
                        >
                            <span className="material-symbols-outlined">hexagon</span>
                        </motion.div>
                        <motion.h2
                            className="logo-text premium-logo-text"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            Craftora
                        </motion.h2>
                    </div>

                    {/* Desktop Navigation - md ve üstü görünür */}
                    <div className="nav-links">
                        {['Features', 'Pricing', 'Resources'].map((item, i) => (
                            <motion.a
                                key={item}
                                href="#"
                                className="nav-link"
                                initial={{ y: -30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
                            >
                                {item}
                            </motion.a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="nav-actions">
                        {/* Desktop Login - sm ve üstü görünür */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.4 }}
                        >
                            <Link to="/login" className="login-link">
                                Log In
                            </Link>
                        </motion.div>

                        {/* CTA Button - Her zaman görünür */}
                        <motion.button
                            className={`cta-button btn-animate ${isAnimating ? 'clicked' : ''}`}
                            onClick={handleGetStarted}
                            whileHover={{
                                scale: 1.2,
                                boxShadow: "0 0 20px rgba(0,128,128,0.8)"
                            }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 1.2,
                                type: "spring",
                                stiffness: 300,
                                damping: 10
                            }}
                        >
                            <span className="btn-text">Get Started</span>
                            <span className="material-symbols-outlined arrow-icon">
                                arrow_forward
                            </span>
                            <span className="btn-glow"></span>
                            <span className="btn-spark"></span>
                        </motion.button>

                        {/* Dark mode toggle */}
                        <motion.button
                            className="theme-toggle"
                            onClick={toggleDarkMode}
                            whileHover={{ rotate: 180 }}
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ delay: 1.4, duration: 0.5 }}
                        >
                            <span className="material-symbols-outlined">
                                {isDarkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </motion.button>

                        {/* Hamburger Menu Button - Mobilde görünür */}
                        <button 
                            className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menu"
                        >
                            <span className="hamburger-line"></span>
                        </button>
                    </div>
                </nav>
            </motion.div>

            {/* Mobile Menu Overlay */}
           <AnimatePresence>
    {isMobileMenuOpen && (
        <>
            {/* Overlay - Blur efektli */}
            <motion.div 
                className="mobile-menu-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel - Glassmorphism tasarım */}
            <motion.div 
                className="mobile-menu-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
                {/* Dekoratif arkaplan elementi */}
                <div className="mobile-menu-bg-decoration"></div>
                
                {/* Header with close button */}
                <div className="mobile-menu-header">
                    <motion.div 
                        className="mobile-menu-logo"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                    >
                        <span className="material-symbols-outlined">hexagon</span>
                        <span>Craftora</span>
                    </motion.div>
                    <motion.button 
                        className="mobile-menu-close"
                        onClick={() => setIsMobileMenuOpen(false)}
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </motion.button>
                </div>

                {/* Menu Links - Premium */}
                <div className="mobile-menu-links">
                    {[
                        { name: 'Features', icon: 'widgets' },
                        { name: 'Pricing', icon: 'attach_money' },
                        { name: 'Resources', icon: 'menu_book' }
                    ].map((item, i) => (
                        <motion.a
                            key={item.name}
                            href="#"
                            className="mobile-menu-link"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            whileHover={{ 
                                x: 10,
                                backgroundColor: 'rgba(0,128,128,0.1)',
                                transition: { duration: 0.2 }
                            }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.name}</span>
                            <motion.span 
                                className="mobile-menu-link-arrow"
                                initial={{ x: -10, opacity: 0 }}
                                whileHover={{ x: 0, opacity: 1 }}
                            >
                                →
                            </motion.span>
                        </motion.a>
                    ))}
                    
                    <motion.div 
                        className="mobile-menu-divider"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.7 }}
                    />

                    {/* Login Section */}
                    <motion.div
                        className="mobile-menu-login-section"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link 
                            to="/login" 
                            className="mobile-menu-login"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="material-symbols-outlined">login</span>
                            <span>Log In</span>
                        </Link>
                    </motion.div>

                    {/* Get Started Button - Mobilde görünsün */}
                    <motion.div
                        className="mobile-menu-cta"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <motion.button
                            className="mobile-menu-cta-button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleGetStarted();
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: "0 10px 25px rgba(0,128,128,0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Get Started</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </motion.button>
                    </motion.div>

                    {/* Dark Mode Toggle - Mobilde */}
                    <motion.div
                        className="mobile-menu-theme"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.0 }}
                    >
                        <span>Dark Mode</span>
                        <motion.button
                            className={`mobile-theme-toggle ${isDarkMode ? 'active' : ''}`}
                            onClick={toggleDarkMode}
                            whileTap={{ scale: 0.9 }}
                        >
                            <motion.div 
                                className="toggle-thumb"
                                animate={{ x: isDarkMode ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                        </motion.button>
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.div 
                    className="mobile-menu-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                >
                    <p>© 2024 Craftora</p>
                    <div className="mobile-menu-social">
                        <motion.a 
                            href="#" 
                            whileHover={{ y: -3, color: '#008080' }}
                        >
                            <span className="material-symbols-outlined">public</span>
                        </motion.a>
                        <motion.a 
                            href="#" 
                            whileHover={{ y: -3, color: '#008080' }}
                        >
                            <span className="material-symbols-outlined">mail</span>
                        </motion.a>
                    </div>
                </motion.div>
            </motion.div>
        </>
    )}
</AnimatePresence>


            {/* CSS for mobile menu - Header.css'e eklenebilir ama şimdilik style olarak ekleyelim */}
          {/* Hamburger Menu Button - Mobilde görünür */}


{/* Hamburger stilleri - Header.css'e değil, buraya ekleyelim */}
<style>{`
    .hamburger { 
        display: none; 
        width: 36px; 
        height: 28px; 
        align-items: center; 
        justify-content: center; 
        background: transparent; 
        border: none; 
        padding: 0; 
        cursor: pointer; 
    }
    
    .hamburger-line { 
        width: 22px; 
        height: 2px; 
        background: var(--text-dark); 
        position: relative; 
        transition: transform 260ms cubic-bezier(.2,.9,.2,1), opacity 200ms; 
        display: block; 
    }
    
    .hamburger-line::before, 
    .hamburger-line::after { 
        content: ''; 
        position: absolute; 
        left: 0; 
        width: 22px; 
        height: 2px; 
        background: inherit; 
        transition: transform 260ms cubic-bezier(.2,.9,.2,1), top 260ms; 
    }
    
    .hamburger-line::before { top: -7px; } 
    .hamburger-line::after { top: 7px; }
    
    .hamburger.open .hamburger-line { background: transparent; }
    .hamburger.open .hamburger-line::before { transform: translateY(7px) rotate(45deg); }
    .hamburger.open .hamburger-line::after { transform: translateY(-7px) rotate(-45deg); }
    
    @media (max-width: 768px) {
        .hamburger {
            display: inline-flex;
        }
    }
    
    .dark-mode .hamburger-line {
        background: var(--text-light);
    }
`}</style>
        </>
    );
};

export default Header;