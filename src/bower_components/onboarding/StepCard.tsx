// components/onboarding/StepCard.tsx
import React, { useEffect, useState } from 'react';
import { Step } from './types/onboarding.types';
import './styles/onboarding.css';

interface StepCardProps {
  step: Step;
  onNext: () => void;
  onPrev?: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, onNext, onPrev }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [step.id]);
  
  // Theme'e göre gradient arkaplan
  const getThemeGradient = () => {
    switch(step.theme) {
      case 'warm':
        return 'linear-gradient(145deg, rgba(255,107,139,0.15), rgba(255,209,102,0.15))';
      case 'modern':
        return 'linear-gradient(145deg, rgba(17,138,178,0.15), rgba(239,71,111,0.15))';
      case 'creative':
        return 'linear-gradient(145deg, rgba(131,56,236,0.15), rgba(251,86,7,0.15))';
      default:
        return 'rgba(255,255,255,0.1)';
    }
  };

  return (
    <div 
      className={`step-card theme-${step.theme} ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--theme-gradient': getThemeGradient()
      } as React.CSSProperties}
    >
      {/* Parlama efekti */}
      <div className="step-card-glow"></div>
      
      {/* Dekoratif arkaplan şekilleri */}
      <div className="step-card-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      {/* İkon container - 3D efektli */}
      <div className="icon-wrapper">
        <div className="icon-container">
          <span className={`step-icon icon-${step.theme}`}>{step.icon}</span>
        </div>
        <div className="icon-ring"></div>
        <div className="icon-ring-2"></div>
      </div>
      
      {/* İçerik */}
      <div className="step-content">
        {/* Rozet */}
        <div className="step-badge">
          <span className="badge-text">Adım {step.id}/4</span>
        </div>
        
        {/* Başlık */}
        <h1 className="step-title gradient-text">{step.title}</h1>
        
        {/* Alt başlık */}
        <h2 className="step-subtitle">{step.subtitle}</h2>
        
        {/* Açıklama */}
        <p className="step-description">{step.description}</p>
        
        {/* Özellik listesi */}
        {step.features && step.features.length > 0 && (
          <div className="feature-list">
            {step.features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="feature-icon">✨</span>
                <span className="feature-text">{feature}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* CTA Butonları */}
        <div className="step-actions">
          {onPrev && (
            <button 
              className="btn-prev"
              onClick={onPrev}
            >
              <span className="btn-icon">←</span>
              <span className="btn-text">Geri</span>
            </button>
          )}
          
          <button 
            className={`btn-next btn-${step.theme}`}
            onClick={onNext}
          >
            <span className="btn-text">{step.buttonText}</span>
            <span className="btn-icon">→</span>
            <span className="btn-glow"></span>
          </button>
        </div>
      </div>
      
      {/* Dekoratif elementler */}
      <div className="step-card-decoration">
        <div className="decoration-line"></div>
        <div className="decoration-dots"></div>
      </div>
    </div>
  );
};

export default StepCard;