// src/webpack/types/admin.types.ts
// SADECE admin paneli için tipler - diğerlerinden izole!

export interface Address {
  street?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface SocialMedia {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  youtube?: string;
}

export interface ShopOnboardingData {
  // Adım 1 - Mağaza Bilgileri
  shopName: string;
  shopDescription: string;
  shortDescription?: string;
  logo?: File | string;
  banner?: File | string;
  
  // Adım 2 - İletişim Bilgileri
  contactEmail: string;
  supportEmail?: string;
  phone?: string;
  address: Address;
  
  // Adım 3 - Sosyal Medya
  socialMedia: SocialMedia;
}

export interface OnboardingState {
  currentStep: number;
  data: ShopOnboardingData;
  isCompleted: boolean;
}

export interface StepProps {
  data: ShopOnboardingData;
  updateData: (data: Partial<ShopOnboardingData>) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onComplete?: () => void;
}

export interface FormErrors {
  [key: string]: string;
}