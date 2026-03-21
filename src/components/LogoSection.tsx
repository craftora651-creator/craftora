// components/LogosSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import '../css/LogoSection.css';

const LogosSection: React.FC = () => {
  const logos = [
    'TechFlow',
    'CreativeInc',
    'DesignCo',
    'WebWorks',
    'Appify',
    'NetSphere',
    'DataMind'
  ];

  return (
    <motion.section 
      className="logos-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="logos-container">
        <motion.h4 
          className="logos-heading"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        >
          Trusted by forward-thinking teams
        </motion.h4>
      </div>
      
      <div className="logos-marquee-container">
        {/* First marquee track */}
        <motion.div 
          className="logos-marquee-track scroll-animation"
          animate={{ x: [0, -1000] }}
          transition={{ 
            x: { 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop"
            }
          }}
        >
          {logos.map((logo, index) => (
            <motion.span 
              key={`original-${index}`} 
              className="logo-item"
              whileHover={{ 
                scale: 1.2,
                color: "#008080",
                transition: { duration: 0.2 }
              }}
            >
              {logo}
            </motion.span>
          ))}
          {/* Duplicate for seamless loop */}
          {logos.map((logo, index) => (
            <motion.span 
              key={`duplicate-${index}`} 
              className="logo-item"
              whileHover={{ 
                scale: 1.2,
                color: "#008080",
                transition: { duration: 0.2 }
              }}
            >
              {logo}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Second marquee track (duplicate for continuous scroll) */}
        <motion.div 
          className="logos-marquee-track-duplicate scroll-animation"
          animate={{ x: [0, -1000] }}
          transition={{ 
            x: { 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop",
              delay: 0.5
            }
          }}
        >
          {logos.map((logo, index) => (
            <motion.span 
              key={`duplicate-track-${index}`} 
              className="logo-item"
              whileHover={{ 
                scale: 1.2,
                color: "#008080",
                transition: { duration: 0.2 }
              }}
            >
              {logo}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default LogosSection;