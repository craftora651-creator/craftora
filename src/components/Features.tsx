// components/Features.tsx
import React from 'react';
import { motion } from 'framer-motion';
import '../css/Features.css';

const Features: React.FC = () => {
  // Container için stagger animasyonu
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  // Her kart için animasyon
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  };

  return (
    <motion.section 
      className="features-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="features-container">
        {/* Header */}
        <motion.div 
          className="features-header"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="features-title-section">
            <motion.h2 
              className="features-heading"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Why <motion.span
                initial={{ scale: 0.8, color: "#000" }}
                whileInView={{ scale: 1, color: "#008080" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
              >Craftora?</motion.span>
            </motion.h2>
            
            <motion.p 
              className="features-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Unlock the potential of your team with tools designed for the
              modern creator. We've stripped away the clutter to focus on what
              matters: your content.
            </motion.p>
            
            <motion.button 
              className="features-view-all"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ 
                x: 10,
                color: "#008080",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              View all features
              <span className="material-symbols-outlined">arrow_forward</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Bento Grid Layout - Stagger ile gelsin */}
        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Large Card */}
          <motion.div 
            className="feature-large-card hover-card"
            variants={itemVariants}
            whileHover={{ 
              y: -15,
              scale: 1.02,
              boxShadow: "0 30px 40px -20px rgba(0,128,128,0.4)",
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              className="feature-large-card-bg-icon"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <span className="material-symbols-outlined">neurology</span>
            </motion.div>
            <div className="feature-large-card-content">
              <motion.div 
                className="feature-large-card-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="material-symbols-outlined">neurology</span>
              </motion.div>
              <div>
                <h3>Smart Workflows</h3>
                <p>
                  Automate your daily tasks with intelligent pipelines that
                  learn from your habits. Reduce repetitive work by up to 40%.
                </p>
              </div>
              <motion.div 
                className="feature-large-card-link"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <span>Explore Automation</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Tall Card */}
          <motion.div 
            className="feature-tall-card hover-card"
            variants={itemVariants}
            whileHover={{ 
              y: -15,
              scale: 1.02,
              boxShadow: "0 30px 40px -20px rgba(128,0,128,0.3)",
              transition: { duration: 0.3 }
            }}
          >
            <motion.div 
              className="feature-tall-card-blob"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                borderRadius: ["50%", "30%", "50%"]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            ></motion.div>
            <div className="feature-tall-card-content">
              <motion.div 
                className="feature-tall-card-icon"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <span className="material-symbols-outlined">groups</span>
              </motion.div>
              <div>
                <h3>Team Sync</h3>
                <p>
                  Collaborate in real-time with zero latency. Whether you're in
                  New York or Tokyo, your team moves as one.
                </p>
                {/* Mini abstract UI for chat */}
                <div className="feature-chat-container">
                  <motion.div 
                    className="feature-chat-bubble-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    Did you see the new draft?
                  </motion.div>
                  <motion.div 
                    className="feature-chat-bubble-right"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2, duration: 0.5 }}
                  >
                    Yes! It looks amazing 🚀
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Regular Card 1 */}
          <motion.div 
            className="feature-regular-card hover-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10,
              scale: 1.05,
              boxShadow: "0 20px 30px -10px rgba(255,111,97,0.3)",
              transition: { duration: 0.3 }
            }}
          >
            <div className="feature-regular-card-content">
              <motion.div 
                className="feature-regular-card-icon feature-icon-accent"
                whileHover={{ 
                  rotate: 360,
                  backgroundColor: "#FF6F61",
                  color: "white"
                }}
                transition={{ duration: 0.5 }}
              >
                <span className="material-symbols-outlined">monitoring</span>
              </motion.div>
              <h3>Deep Analytics</h3>
              <p>
                Gain insights that actually drive growth. Visualise your data
                with one click.
              </p>
            </div>
          </motion.div>

          {/* Regular Card 2 */}
          <motion.div 
            className="feature-regular-card hover-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10,
              scale: 1.05,
              boxShadow: "0 20px 30px -10px rgba(106,13,173,0.3)",
              transition: { duration: 0.3 }
            }}
          >
            <div className="feature-regular-card-content">
              <motion.div 
                className="feature-regular-card-icon feature-icon-purple"
                whileHover={{ 
                  rotate: 360,
                  backgroundColor: "#6a0dad",
                  color: "white"
                }}
                transition={{ duration: 0.5 }}
              >
                <span className="material-symbols-outlined">security</span>
              </motion.div>
              <h3>Enterprise Security</h3>
              <p>
                Bank-grade encryption for all your assets. Your intellectual
                property stays yours.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Features;