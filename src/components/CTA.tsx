// components/CTA.tsx
import React from 'react';
import { motion } from 'framer-motion';
import '../css/CTA.css';

const CTA: React.FC = () => {
  return (
    <motion.section 
      className="cta-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="cta-container">
        {/* Background Gradient - Dönsün */}
        <motion.div 
          className="cta-bg-gradient"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        {/* Main Card */}
        <motion.div 
          className="cta-card"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 12
          }}
          whileHover={{ 
            boxShadow: "0 30px 60px -20px rgba(0,128,128,0.5)",
            transition: { duration: 0.3 }
          }}
        >
          {/* Decorative Circles - Yüzsünler */}
          <motion.div 
            className="cta-circle-top"
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          
          <motion.div 
            className="cta-circle-bottom"
            animate={{ 
              y: [0, 20, 0],
              x: [0, -10, 0, 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* Content */}
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.h2 
              className="cta-heading"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Ready to transform your workflow?
            </motion.h2>
            
            <motion.p 
              className="cta-description"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              Join thousands of teams who have switched to Craftora. Start your
              14-day free trial today.
            </motion.p>
            
            <motion.div 
              className="cta-buttons"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.button 
                className="cta-primary-button btn-animate"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 30px rgba(0,128,128,0.8)",
                  backgroundColor: "#006666",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                Get Started Now
                <motion.span 
                  className="material-symbols-outlined"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  arrow_forward
                </motion.span>
              </motion.button>
              
              <motion.button 
                className="cta-secondary-button btn-animate"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(0,128,128,0.1)",
                  borderColor: "#008080",
                  color: "#008080",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                Contact Sales
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTA;