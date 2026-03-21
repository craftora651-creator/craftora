// components/Footer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import '../css/Footer.css';

const Footer: React.FC = () => {
  // Linkler için hover animasyonları
  const linkVariants = {
    hover: {
      x: 5,
      color: "#008080",
      transition: { duration: 0.2 }
    }
  };

  // Column'lar için stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer-container">
        <motion.div 
          className="footer-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Brand Section */}
          <motion.div 
            className="footer-brand"
            variants={itemVariants}
          >
            <motion.div 
              className="footer-logo-container"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="footer-logo-icon"
                whileHover={{ 
                  rotate: 360,
                  backgroundColor: "#008080",
                  transition: { duration: 0.5 }
                }}
              >
                <span className="material-symbols-outlined">hexagon</span>
              </motion.div>
              <motion.h2 
                className="footer-logo-text"
                whileHover={{ color: "#008080" }}
              >
                Craftora
              </motion.h2>
            </motion.div>
            
            <motion.p 
              className="footer-description"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Crafting the future of digital management. Built for speed,
              designed for humans.
            </motion.p>
            
            <motion.div 
              className="footer-social"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {['mail', 'public'].map((icon, index) => (
                <motion.a
                  key={icon}
                  href="#"
                  className="footer-social-link"
                  whileHover={{ 
                    scale: 1.2,
                    backgroundColor: "#008080",
                    color: "white",
                    boxShadow: "0 0 15px rgba(0,128,128,0.5)"
                  }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Product Column */}
          <motion.div 
            className="footer-column"
            variants={itemVariants}
          >
            <motion.h4
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Product
            </motion.h4>
            <ul className="footer-links">
              {['Features', 'Pricing', 'Integrations', 'Enterprise'].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                >
                  <motion.a
                    href="#"
                    className="footer-link"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Column */}
          <motion.div 
            className="footer-column"
            variants={itemVariants}
          >
            <motion.h4
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Resources
            </motion.h4>
            <ul className="footer-links">
              {['Documentation', 'API Reference', 'Blog', 'Community'].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                >
                  <motion.a
                    href="#"
                    className="footer-link"
                    variants={linkVariants}
                    whileHover="hover"
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div 
            className="footer-column"
            variants={itemVariants}
          >
            <motion.h4
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              Company
            </motion.h4>
            <ul className="footer-links">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <motion.a
                  href="#"
                  className="footer-link"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  About
                </motion.a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.3 }}
              >
                <motion.a
                  href="#"
                  className="footer-link"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  Careers
                  <motion.span 
                    className="hiring-badge"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: ["#FF6F61", "#FF8A7A", "#FF6F61"]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    Hiring
                  </motion.span>
                </motion.a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0, duration: 0.3 }}
              >
                <motion.a
                  href="#"
                  className="footer-link"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  Legal
                </motion.a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1, duration: 0.3 }}
              >
                <motion.a
                  href="#"
                  className="footer-link"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  Contact
                </motion.a>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.p 
            className="footer-copyright"
            whileHover={{ color: "#008080" }}
          >
            © 2024 Craftora Inc. All rights reserved.
          </motion.p>
          <div className="footer-legal">
            {['Privacy Policy', 'Terms of Service'].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="footer-legal-link"
                whileHover={{ 
                  color: "#008080",
                  x: 3,
                  transition: { duration: 0.2 }
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.3 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;