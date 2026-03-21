// ProgressWizard.tsx - TAMAMEN DÜZELTİLMİŞ
import React from 'react';
import './styles/onboarding.css'; // ✅ CSS import

interface ProgressWizardProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressWizard: React.FC<ProgressWizardProps> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="progressWizard"> {/* ✅ styles. KULLANMA! */}
      <div className="stepDots">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`stepDot ${
              index === currentStep 
                ? 'active' 
                : index < currentStep 
                  ? 'completed' 
                  : ''
            }`}
          >
            {index < currentStep ? '✓' : index + 1}
          </div>
        ))}
      </div>
      
      <div className="progressBar">
        <div 
          className="progressFill"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="progressText">
        Adım {currentStep + 1}/{totalSteps} • %{Math.round(progress)}
      </div>
    </div>
  );
};

export default ProgressWizard;