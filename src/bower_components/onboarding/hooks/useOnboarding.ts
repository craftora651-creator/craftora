// components/onboarding/hooks/useOnboarding.ts
import { useState } from 'react';

const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const completeOnboarding = () => {
    setIsCompleted(true);
    // API call buraya gelecek
    console.log('Onboarding completed!');
  };
  
  return {
    currentStep,
    isCompleted,
    nextStep,
    prevStep,
    completeOnboarding,
    setCurrentStep
  };
};

export default useOnboarding;