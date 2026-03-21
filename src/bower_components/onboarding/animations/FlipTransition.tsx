// components/onboarding/animations/FlipTransition.tsx
import React, { useEffect, useState } from 'react';
import '../styles/onboarding.css';

interface FlipTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  flipType?: 'horizontal' | 'vertical' | '3D';
  duration?: number;
}

const FlipTransition: React.FC<FlipTransitionProps> = ({ 
  children, 
  isActive, 
  flipType = 'horizontal',
  duration = 600 
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [showFront, setShowFront] = useState(true);
  
  useEffect(() => {
    if (isActive) {
      setIsFlipping(true);
      // Önce front'u gizle
      setTimeout(() => {
        setShowFront(false);
      }, duration / 2);
      
      // Sonra back'i göster
      const timer = setTimeout(() => {
        setShowFront(true);
        setIsFlipping(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, duration]);
  
  // Flip type'a göre class'lar
  const getFlipClasses = () => {
    const baseClasses = ['flipContainer'];
    
    if (isFlipping) {
      baseClasses.push('flipping');
    }
    
    switch (flipType) {
      case 'vertical':
        baseClasses.push('flipVertical');
        break;
      case '3D':
        baseClasses.push('flip3D');
        break;
      default:
        baseClasses.push('flipHorizontal');
    }
    
    return baseClasses.join(' ');
  };
  
  return (
    <div className={getFlipClasses()}>
      <div className="flipper">
        {/* Front side */}
        <div className={`front ${showFront ? 'visible' : 'hidden'}`}>
          {children}
        </div>
        
        {/* Back side */}
        <div className={`back ${!showFront ? 'visible' : 'hidden'}`}>
          <div className="back-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipTransition;