import React, { useState, useEffect } from 'react'; // ✅ useEffect eklendi
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../server/FastAPI/user.hooks'; // ✅ Kullanıcı hook'u!
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import './AdminOnboarding.css';
import { apiClient } from '../api/apiClient';
import { AxiosError } from 'axios'; // ✅ Bunu ekle!

// ==================== TİP TANIMLARI (admin.types olmadan) ====================


// AdminOnboarding.tsx'in en üstüne, import'lardan sonra ekle:
interface ShopCreateResponse {
  id: string;
  shop_name: string;
  slug: string;
  status: string;
  created_at: string;
}

// 📍 Adres tipi
interface ShopAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

// 🔗 Sosyal medya linkleri
interface SocialMediaLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  youtube?: string;
}

// 🏪 Mağaza onboarding verisi
export interface ShopOnboardingData {
  // Step 1 - Mağaza Bilgileri
  shopName: string;
  shopDescription: string;
  shortDescription?: string;
  primaryCategory?: string;
  logo?: File;
  banner?: File;

  // Step 2 - İletişim
  contactEmail: string;
  supportEmail?: string;
  phone?: string;
  address: ShopAddress;

  // Step 3 - Sosyal Medya
  socialMedia: SocialMediaLinks;
}

// ✅ Step component'lerine geçecek props
export interface StepProps {
  data: ShopOnboardingData;
  updateData: (newData: Partial<ShopOnboardingData>) => void;
}

// ❌ Form hataları için
export interface FormErrors {
  [key: string]: string;
}

// ==================== ANA COMPONENT ====================

const AdminOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser(); // ✅ Kullanıcıyı al
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<ShopOnboardingData>({
    shopName: '',
    shopDescription: '',
    shortDescription: '',
    logo: undefined,
    banner: undefined,
    contactEmail: currentUser?.email || '', // ✅ Varsa email'i otomatik doldur
    supportEmail: '',
    phone: '',
    address: {
      street: '',
      city: '',
      country: '',
      postalCode: ''
    },
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: '',
      tiktok: '',
      linkedin: '',
      youtube: ''
    }
  });

  // ✅ currentUser geldiğinde email'i güncelle
  useEffect(() => {
    if (currentUser?.email) {
      setFormData(prev => ({
        ...prev,
        contactEmail: currentUser.email
      }));
    }
  }, [currentUser]);

  // ⏳ Kullanıcı yükleniyor mu?
  if (userLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Kullanıcı bilgileri yükleniyor...</p>
      </div>
    );
  }

  // ❌ Kullanıcı giriş yapmamış mı?
  if (!currentUser) {
    return (
      <div className="error-container">
        <h2>🔐 Giriş Yapmalısınız</h2>
        <p>Mağaza oluşturmak için lütfen giriş yapın.</p>
        <button
          className="login-button"
          onClick={() => navigate('/login')}
        >
          Giriş Yap
        </button>
      </div>
    );
  }

  const updateFormData = (newData: Partial<ShopOnboardingData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));




  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // 📞 Telefon formatla
  const formatPhone = (phone: string): string | null => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `+90${digits}`;
    if (digits.length === 11 && digits.startsWith('0')) return `+90${digits.substring(1)}`;
    if (digits.length === 12 && digits.startsWith('90')) return `+${digits}`;
    return null;
  };

  const handleComplete = async () => {
    console.log('✅ Mağaza oluşturuluyor:', {
      ...formData,
      userId: currentUser.id,
      userEmail: currentUser.email
    });

    try {
      // 1️⃣ Logo yükle
      let logoUrl = null;
      if (formData.logo) {
        console.log('📤 Logo yükleniyor...');
        const logoResult = await apiClient.uploadFile(
          formData.logo,
          currentUser.id,
          "shop_logo"
        );
        logoUrl = logoResult.file.s3_url;
        console.log('✅ Logo yüklendi:', logoUrl);
      }

      // 2️⃣ Banner yükle
      let bannerUrl = null;
      if (formData.banner) {
        console.log('📤 Banner yükleniyor...');
        const bannerResult = await apiClient.uploadFile(
          formData.banner,
          currentUser.id,
          "shop_banner"
        );
        bannerUrl = bannerResult.file.s3_url;
        console.log('✅ Banner yüklendi:', bannerUrl);
      }

      // 3️⃣ Mağaza verisi hazırla
      const shopData = {
        shop_name: formData.shopName.trim(),
        description: formData.shopDescription,
        short_description: formData.shortDescription || "",
        slug: generateSlug(formData.shopName),
        primary_category: formData.primaryCategory || "digital-art",
        secondary_categories: [],
        tags: [],
        contact_email: formData.contactEmail,
        support_email: formData.supportEmail || "",
        phone: formData.phone ? formatPhone(formData.phone) : null,
        slogan: "",
        website_url: null,
        tax_number: "",
        tax_office: "",
        // 🔥 ADDRESS EKLE
        address: {
          street: formData.address.street || "",
          city: formData.address.city || "",
          country: formData.address.country || "",
          postal_code: formData.address.postalCode || ""
        },
        // 🔥 SOCIAL MEDIA EKLE - undefined'ları boş string yap
        social_links: {
          instagram: formData.socialMedia.instagram || "",
          facebook: formData.socialMedia.facebook || "",
          tiktok: formData.socialMedia.tiktok || "",
          twitter: formData.socialMedia.twitter || "",
          youtube: formData.socialMedia.youtube || "",
          linkedin: formData.socialMedia.linkedin || ""
        }
      };

      console.log('📤 Gönderilen shop data:', shopData);

      // 4️⃣ FastAPI'ye gönder
      const response = await apiClient.post<ShopCreateResponse>('/api/shops/', shopData);
      if (response && response.id) {
        localStorage.setItem('shop_id', response.id);
        console.log('✅ Shop ID kaydedildi:', response.id);
      } else {
        console.error('❌ Shop ID alınamadı! Response:', response);
      }

      console.log('✅ Mağaza oluşturuldu:', response);
      alert('🎉 Mağazanız başarıyla oluşturuldu!');
      navigate('/admin');

    } catch (error) {
      console.error('❌ Mağaza oluşturma hatası:', error);

      if (error instanceof AxiosError) {
        if (error.response) {
          const responseData = error.response.data as Record<string, unknown>;
          console.log('📋 Hata DETAYI:', responseData);
          console.log('📋 Hata STATUS:', error.response.status);
          console.log('📋 Hata HEADERS:', error.response.headers);

          if (responseData && 'detail' in responseData) {
            const detail = responseData.detail;

            if (Array.isArray(detail)) {
              let errorMessage = 'Validasyon hataları:\n';
              detail.forEach((err, index) => {
                const errObj = err as { loc?: string[]; msg?: string };
                const field = errObj.loc?.slice(1).join('.') || 'bilinmeyen alan';
                const message = errObj.msg || 'geçersiz değer';
                errorMessage += `${index + 1}. ${field}: ${message}\n`;
              });
              alert(errorMessage);
            } else {
              alert('Hata: ' + String(detail));
            }
          }
        } else if (error.request) {
          alert('Sunucuya ulaşılamadı.');
        } else {
          alert('İstek hatası: ' + error.message);
        }
      } else if (error instanceof Error) {
        alert('Hata: ' + error.message);
      }
    }
  };

  const renderStep = () => {
    const commonProps = {
      data: formData,
      updateData: updateFormData
    };

    switch (currentStep) {
      case 1:
        return <Step1 {...commonProps} onNext={handleNext} />;
      case 2:
        return <Step2 {...commonProps} onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <Step3 {...commonProps} onNext={handleNext} onPrev={handlePrev} />;
      case 4:
        return <Step4
          {...commonProps}
          onPrev={handlePrev}
          onComplete={handleComplete}
          currentUser={currentUser}  // ✅ Kullanıcıyı Step4'e gönder
        />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-onboarding">
      {/* Hoşgeldin mesajı */}


      {/* Progress Bar */}
      <div className="onboarding-progress">
        <div className="progress-steps">
          {[
            { num: 1, label: 'Mağaza Bilgileri' },
            { num: 2, label: 'İletişim' },
            { num: 3, label: 'Sosyal Medya' },
            { num: 4, label: 'Özet' }
          ].map(step => (
            <div
              key={step.num}
              className={`step ${currentStep >= step.num ? 'active' : ''} ${currentStep === step.num ? 'current' : ''}`}
            >
              <div className="step-number">{step.num}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentStep / 4) * 100}%` }} />
        </div>
      </div>

      {/* Step Content */}
      <div className="onboarding-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default AdminOnboarding;