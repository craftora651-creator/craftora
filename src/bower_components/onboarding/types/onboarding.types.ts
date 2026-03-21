// components/onboarding/types/onboarding.types.ts
export interface Step {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  theme: 'warm' | 'modern' | 'creative';
  buttonText: string;
  features?: string[]; // YENİ
  cta?: string; // YENİ
}

export interface OnboardingData {
  currentStep: number;
  isCompleted: boolean;
  startedAt: string;
}