// components/RobotBuddy.tsx - ELEXTRA TASARIMI ROBOT
import React, { useEffect, useRef } from 'react';
import '../css/RobotBuddy.css';

interface RobotBuddyProps {
  mousePosition: { x: number; y: number };
  isListening?: boolean;
  mood?: 'happy' | 'thinking' | 'sad';
}

const RobotBuddy: React.FC<RobotBuddyProps> = ({ 
  mousePosition, 
  isListening = true,
  mood = 'happy' 
}) => {
  const robotRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const leftArmRef = useRef<HTMLDivElement>(null);

  // Mouse takibi - gözler
  useEffect(() => {
    if (!robotRef.current || !leftEyeRef.current || !rightEyeRef.current) return;
    
    const rect = robotRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = mousePosition.x - centerX;
    const deltaY = mousePosition.y - centerY;
    
    // Göz bebekleri hareketi - max 3px
    const moveX = Math.max(-3, Math.min(3, deltaX * 0.015));
    const moveY = Math.max(-2, Math.min(2, deltaY * 0.01));
    
    leftEyeRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    rightEyeRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    
    // Sol kol sallama
    if (leftArmRef.current) {
      const waveAngle = isListening ? Math.sin(Date.now() * 0.008) * 10 + 15 : 15;
      leftArmRef.current.style.transform = `rotate(${waveAngle}deg)`;
    }
    
  }, [mousePosition, isListening]);

  // Konuşma mesajları
  const getMessage = () => {
    if (!isListening) return null;
    
    switch(mood) {
      case 'thinking': return '🤔 Hmm...';
      case 'sad': return '😢 Oops...';
      case 'happy': 
      default: return '👋 Hi there! Ready to shop?';
    }
  };

  return (
    <div ref={robotRef} className="robot-buddy">
      
      {/* Konuşma Balonu */}
      {isListening && (
        <div className="robot-bubble">
          <p className="bubble-text">
            {getMessage()}
            <span className="bubble-arrow"></span>
          </p>
        </div>
      )}
      
      {/* El Sallama Efekti */}
      <div className="hand-pulse">
        <div className="pulse-ring"></div>
        <div className="pulse-ring" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Robot Figürü */}
      <div className="robot-figure">
        
        {/* Kafa */}
        <div className="robot-head">
          
          {/* Ekran Yüz */}
          <div className="robot-face">
            
            {/* Gözler */}
            <div className="robot-eyes">
              <div ref={leftEyeRef} className="robot-eye left"></div>
              <div ref={rightEyeRef} className="robot-eye right"></div>
            </div>
            
            {/* Tarama Işığı */}
            <div className="robot-scanner">
              <div className="scanner-beam"></div>
            </div>
            
          </div>
          
          {/* Kulak/Sensörler */}
          <div className="robot-ear left"></div>
          <div className="robot-ear right"></div>
          
        </div>
        
        {/* Boyun */}
        <div className="robot-neck"></div>
        
        {/* Gövde */}
        <div className="robot-body">
          
          {/* Göğüs Plakası */}
          <div className="chest-plate">
            <div className="power-core">
              <div className="power-core-inner"></div>
            </div>
            <div className="power-bar"></div>
            <div className="power-bar short"></div>
          </div>
          
        </div>
        
        {/* Kollar */}
        <div ref={leftArmRef} className="robot-arm left">
          <div className="hand">
            <div className="finger"></div>
          </div>
        </div>
        
        <div className="robot-arm right">
          <div className="hand"></div>
        </div>
        
      </div>
      
    </div>
  );
};

export default RobotBuddy;