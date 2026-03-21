// components/onboarding/OnboardingFlow.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepCard from './StepCard';
import ProgressWizard from './ProgressWizard';
import SkipConfirmModal from './SkipConfirmModal';
import useOnboarding from './hooks/useOnboarding';
import { steps } from './data/steps';
import './styles/onboarding.css';

interface Sparkle {
  id: string;
  style: {
    left: string;
    top: string;
    animationDelay: string;
  };
}

interface Shape {
  id: string;
  style: {
    left: string;
    animationDelay: string;
    animationDuration: string;
  };
}

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [showSkipModal, setShowSkipModal] = useState(false);
  const { currentStep, nextStep, prevStep, completeOnboarding } = useOnboarding();
  
  const currentStepData = steps[currentStep];
  
  // Son adımda özel efekti tetikle
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    color: string;
    size: number;
    rotation: number;
  }>>([]);
  
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [floatingShapes, setFloatingShapes] = useState<Shape[]>([]);
  
  // Confetti ve efekt partiküllerini oluştur
  useEffect(() => {
    if (currentStep === steps.length - 1) {
      setShowCelebration(true);
      
      // 30 adet confetti partikülü oluştur
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        color: ['#FF6B8B', '#FFD166', '#06D6A0', '#8338EC', '#3A86FF', '#FB5607'][i % 6],
        size: Math.random() * 15 + 5,
        rotation: Math.random() * 360
      }));
      setConfettiParticles(particles);
      
      // 10 adet sparkle oluştur
      const sparkleData = Array.from({ length: 10 }, (_, i) => ({
        id: `sparkle-${i}-${Date.now()}-${Math.random()}`,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`
        }
      }));
      setSparkles(sparkleData);
      
    } else {
      setShowCelebration(false);
      setConfettiParticles([]);
      setSparkles([]);
    }
  }, [currentStep]);
  
  // Floating shapes oluştur (creative tema için)
  useEffect(() => {
    if (currentStepData.theme === 'creative') {
      const shapes = Array.from({ length: 5 }, (_, i) => ({
        id: `shape-${i}-${Date.now()}-${Math.random()}`,
        style: {
          left: `${20 + i * 15}%`,
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${3 + i}s`
        }
      }));
      setFloatingShapes(shapes);
    }
  }, [currentStepData.theme]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      nextStep();
    } else {
      completeOnboarding();
      
      // 🎉 Büyük kutlama efekti
      setTimeout(() => {
        navigate('/vip-selection');
      }, 1000);
    }
  };
  
  const handleSkip = () => {
    if (currentStep === steps.length - 1) {
      navigate('/vip-selection');
    } else {
      setShowSkipModal(true);
    }
  };
  
  // Çıkış animasyonu
  const handleExit = () => {
    document.querySelector('.onboarding-container')?.classList.add('exiting');
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };
  
  return (
    <div className={`onboarding-container theme-${currentStepData.theme}`}>
      
      {/* Progress Wizard */}
      <ProgressWizard 
        currentStep={currentStep} 
        totalSteps={steps.length} 
      />
      
      {/* Ana içerik */}
      <div className="content">
        <StepCard 
          step={currentStepData}
          onNext={handleNext}
          onPrev={currentStep > 0 ? prevStep : undefined}
        />
      </div>
      
      {/* Skip butonu */}
      <button 
        className="skip-button"
        onClick={handleSkip}
      >
        {currentStep === steps.length - 1 ? '🎉 Mağazamı Aç!' : 'Atla'}
      </button>
      
      {/* Kutlama efekti (son adımda) */}
      {showCelebration && (
        <div className="celebration">
          {confettiParticles.map(particle => (
            <div 
              key={particle.id}
              className="confetti"
              style={{
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`,
                background: particle.color,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                transform: `rotate(${particle.rotation}deg)`
              }}
            />
          ))}
          
          {/* Sparkle efektleri - STATE'ten geliyor! */}
          <div className="celebration-sparkles">
            {sparkles.map(sparkle => (
              <div 
                key={sparkle.id}
                className="sparkle"
                style={sparkle.style}
              />
            ))}
          </div>
          
          {/* Işık huzmeleri - SABIT, sorun yok */}
          <div className="light-rays">
            {[...Array(8)].map((_, i) => (
              <div 
                key={`ray-${i}`}
                className="light-ray"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Skip onay modal'ı */}
      <SkipConfirmModal 
        isOpen={showSkipModal}
        onClose={() => setShowSkipModal(false)}
        onConfirm={handleExit}
      />
      
      {/* Arka plan efekti (theme'a göre) */}
      <div className="background-effects">
        {currentStepData.theme === 'creative' && (
          <div className="floating-shapes">
            {floatingShapes.map(shape => (
              <div 
                key={shape.id}
                className="floating-shape"
                style={shape.style}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;