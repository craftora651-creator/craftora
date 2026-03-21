// components/onboarding/animations/ColorWave.tsx
import React, { useEffect, useRef } from 'react';
// ESKİ: import styles from '../styles/onboarding.module.scss';
import '../styles/onboarding.css';

interface ColorWaveProps {
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
  theme?: 'warm' | 'modern' | 'creative';
}

const ColorWave: React.FC<ColorWaveProps> = ({ 
  isActive, 
  intensity = 'medium',
  speed = 'normal',
  theme = 'creative'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<HTMLDivElement>>([]);
  
  // Theme'a göre renk paleti
  const getColorPalette = () => {
    switch (theme) {
      case 'warm':
        return [
          '#FF6B8B', '#FF8FA3', // Pembe tonları
          '#FFD166', '#FFE085', // Altın sarısı
          '#06D6A0', '#2CFFB9', // Yeşil
          '#FF9A76', '#FFB294'  // Turuncu
        ];
      case 'modern':
        return [
          '#118AB2', '#1AA5D1', // Mavi tonları
          '#EF476F', '#FF6B8B', // Pembe
          '#073B4C', '#0A4D63', // Koyu mavi
          '#8AC926', '#9EF01A'  // Açık yeşil
        ];
      case 'creative':
      default:
        return [
          '#8338EC', '#9D5CFF', // Mor
          '#3A86FF', '#5B9AFF', // Mavi
          '#FB5607', '#FF7A3D', // Turuncu
          '#FF006E', '#FF5C8D', // Pembe
          '#FFBE0B', '#FFD166', // Sarı
          '#00BBF9', '#06D6A0'  // Camgöbeği
        ];
    }
  };
  
  // Yoğunluğa göre partikül sayısı
  const getParticleCount = () => {
    switch (intensity) {
      case 'high': return 100;
      case 'medium': return 60;
      case 'low': return 30;
      default: return 60;
    }
  };
  
  // Hıza göre speed multiplier
  const getSpeedMultiplier = () => {
    switch (speed) {
      case 'fast': return 2;
      case 'slow': return 0.5;
      case 'normal': 
      default: return 1;
    }
  };
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const colors = getColorPalette();
    const particleCount = getParticleCount();
    const speedMultiplier = getSpeedMultiplier();
    
    // Önceki partikülleri temizle
    particlesRef.current.forEach(particle => {
      if (particle.parentNode === container) {
        container.removeChild(particle);
      }
    });
    particlesRef.current = [];
    
    // Yeni partiküller oluştur
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'color-particle';
      
      // Rastgele özellikler
      const size = Math.random() * 25 + 5; // 5-30px
      const duration = (Math.random() * 15 + 10) / speedMultiplier;
      const delay = Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const blurAmount = intensity === 'high' ? 12 : intensity === 'medium' ? 8 : 4;
      const opacity = intensity === 'high' ? 0.5 : intensity === 'medium' ? 0.4 : 0.3;
      
      // Başlangıç pozisyonları
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        opacity: ${opacity};
        filter: blur(${blurAmount}px);
        left: ${startX}%;
        top: ${startY}%;
        transform-origin: center;
        will-change: transform, opacity;
        z-index: 0;
      `;
      
      // Özel data attribute'lar
      particle.dataset.originalX = startX.toString();
      particle.dataset.originalY = startY.toString();
      particle.dataset.speed = (Math.random() * 0.02 + 0.01).toString();
      particle.dataset.amplitude = (Math.random() * 30 + 20).toString();
      particle.dataset.angle = (Math.random() * Math.PI * 2).toString();
      
      container.appendChild(particle);
      particlesRef.current.push(particle);
    }
    
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) * 0.001 * speedMultiplier;
      
      particlesRef.current.forEach((particle, index) => {
        const originalX = parseFloat(particle.dataset.originalX || '0');
        const originalY = parseFloat(particle.dataset.originalY || '0');
        const particleSpeed = parseFloat(particle.dataset.speed || '0.01');
        const amplitude = parseFloat(particle.dataset.amplitude || '20');
        const angle = parseFloat(particle.dataset.angle || '0');
        
        // Dalga hareketi (sinüs dalgası)
        const waveX = Math.sin(elapsed * particleSpeed + angle) * amplitude;
        const waveY = Math.cos(elapsed * particleSpeed + angle) * amplitude;
        
        // Dairesel hareket
        const circleX = Math.cos(elapsed * particleSpeed * 0.5 + index * 0.1) * 15;
        const circleY = Math.sin(elapsed * particleSpeed * 0.5 + index * 0.1) * 15;
        
        // Titreşim efekti
        const shakeX = Math.sin(elapsed * 10 + index) * 0.5;
        const shakeY = Math.cos(elapsed * 10 + index) * 0.5;
        
        // Scale efekti (nabız gibi)
        const scale = 1 + Math.sin(elapsed * 2 + index) * 0.1;
        
        // Opacity efekti
        const pulseOpacity = 0.3 + Math.sin(elapsed * 1.5 + index) * 0.2;
        
        // Toplam hareket
        const x = originalX + (waveX + circleX + shakeX) / window.innerWidth * 100;
        const y = originalY + (waveY + circleY + shakeY) / window.innerHeight * 100;
        
        particle.style.transform = `translate(${x}%, ${y}%) scale(${scale})`;
        particle.style.opacity = (opacity * pulseOpacity).toString();
        
        // Renk geçişi (sadece creative theme'de)
        if (theme === 'creative') {
          const hueRotate = (elapsed * 10 + index) % 360;
          particle.style.filter = `blur(${blurAmount}px) hue-rotate(${hueRotate}deg)`;
        }
      });
      
      // Arka plan gradient animasyonu
      if (container) {
        const hue = (elapsed * 20) % 360;
        container.style.background = `
          radial-gradient(
            circle at ${50 + Math.sin(elapsed) * 10}% ${50 + Math.cos(elapsed) * 10}%,
            rgba(255, 255, 255, 0.05) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at ${30 + Math.cos(elapsed * 0.7) * 20}% ${70 + Math.sin(elapsed * 0.7) * 20}%,
            rgba(255, 255, 255, 0.03) 0%,
            transparent 40%
          )
        `;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    // Temizlik
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Partikülleri temizle
      if (container && containerRef.current) {
        particlesRef.current.forEach(particle => {
          if (particle.parentNode === container) {
            container.removeChild(particle);
          }
        });
        particlesRef.current = [];
      }
    };
  }, [isActive, intensity, speed, theme]);
  
  if (!isActive) return null;
  
  return (
    <div 
      ref={containerRef}
      className={`color-wave-container theme-${theme} intensity-${intensity}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    />
  );
};

export default ColorWave;