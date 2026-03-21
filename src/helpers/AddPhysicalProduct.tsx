// config/AddPhysicalProduct.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUploadFile } from '../server/Gin/upload.hooks';
import { useCreateProduct } from '../server/FastAPI/product.hooks';
import { useMyShops } from '../server/FastAPI/shop.hooks';
import { useCurrentUser } from '../server/FastAPI/user.hooks';
import {
  clearFormDraft,
  setSelectedProduct,
  setCurrentOperation
} from '../redux/productSlice';
import type { ProductCreateRequest, ProductResponse } from '../types/product.types';
import { ProductType, Currency, ProductStatus, FulfillmentType } from '../types/product.types';
import { FilePurpose } from '../types/upload.types';
import { AxiosError } from 'axios';
import SuccessModal from "../.paket/SuccessModal";

// ===== TİP TANIMLAMALARI =====
interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface FastAPIErrorResponse {
  detail: ValidationErrorItem[] | string;
}

interface VariantOption {
  name: string;
  values: string[];
  selected?: boolean;
}

interface Variant {
  option1?: string;
  value1?: string;
  option2?: string;
  value2?: string;
  option3?: string;
  value3?: string;
  sku: string;
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  stock_quantity: number;
  image_url?: string;
}

const AddPhysicalProduct: React.FC = () => {
  // ===== 1️⃣ TÜM HOOK'LAR =====
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: shops, isLoading: shopsLoading } = useMyShops();
  const uploadFile = useUploadFile();
  const createProduct = useCreateProduct();

  // ===== 2️⃣ TÜM USESTATE'LER =====
  // Temel bilgiler
  const [formData, setFormData] = useState({
    urunAdi: '',
    aciklama: '',
    kisaAciklama: '',
    kategori: 'Giyim',
    fiyat: '',
    indirimliFiyat: '',
    maliyet: '',
    kdvOrani: '18',
    tags: '',
    sku: '',
    barcode: '',
    urunDurumu: 'draft',
  });

  // Stok & Envanter (Kargo yok, tedarikçi halleder)
  const [stokData, setStokData] = useState({
    trackInventory: true,
    stockQuantity: '',
    lowStockThreshold: '5',
    allowBackorders: false,
  });

  // Fiziksel özellikler (Sadece ağırlık ve boyut - kargo için değil, ürün bilgisi için)
  const [physicalData, setPhysicalData] = useState({
    weight: '',
    weightUnit: 'kg',
    length: '',
    width: '',
    height: '',
    dimensionUnit: 'cm',
  });

  // Varyantlar - Zenginleştirilmiş
  const [hasVariants, setHasVariants] = useState(false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([
    { name: 'Renk', values: ['Siyah', 'Beyaz', 'Kırmızı', 'Mavi', 'Yeşil', 'Sarı'], selected: false },
    { name: 'Beden', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42'], selected: false },
    { name: 'Stil', values: ['Spor', 'Klasik', 'Günlük', 'Vintage', 'Modern'], selected: false },
    { name: 'Malzeme', values: ['Pamuk', 'Polyester', 'Deri', 'Süet', 'Keten', 'Yün'], selected: false },
    { name: 'Desen', values: ['Düz', 'Çizgili', 'Kareli', 'Desenli', 'Geometrik'], selected: false },
    { name: 'Boy', values: ['Kısa', 'Uzun', '3/4', '7/8'], selected: false },
    { name: 'Kol Boyu', values: ['Kısa Kol', 'Uzun Kol', '3/4 Kol', 'Kolsuz'], selected: false },
    { name: 'Yaka Tipi', values: ['V Yaka', 'Yuvarlak', 'Polo', 'Gömlek Yaka', 'Turtleneck'], selected: false },
  ]);
  const [customVariant, setCustomVariant] = useState({ name: '', values: '' });
  const [generatedVariants, setGeneratedVariants] = useState<Variant[]>([]);

  // Görseller
  const [coverImages, setCoverImages] = useState<File[]>([]);

  // UI State'leri
  const [modalError, setModalError] = useState('');
  const [isModalError, setIsModalError] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<ProductResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isLoading = createProduct.isPending || isUploading || userLoading || shopsLoading;

  // ===== 3️⃣ USEEFFECT'LER =====
  useEffect(() => {
    if (!userLoading && !shopsLoading) {
      if (!currentUser) {
        navigate('/login');
      } else if (!shops || shops.length === 0) {
        navigate('/admin-onboarding');
      }
    }
  }, [currentUser, shops, userLoading, shopsLoading, navigate]);

  // ===== 4️⃣ LOADING KONTROLÜ =====
  if (userLoading || shopsLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '3px solid #e2e8f0',
            borderTopColor: '#0ea5e9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#475569' }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // ===== 5️⃣ VERİLER =====
  const shopId = shops?.[0]?.id;
  const userId = currentUser?.id;

  // ===== 6️⃣ YARDIMCI FONKSİYONLAR =====
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStokChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setStokData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePhysicalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPhysicalData(prev => ({ ...prev, [name]: value }));
  };

  // Varyant fonksiyonları
  const toggleVariantOption = (index: number) => {
    setVariantOptions(prev =>
      prev.map((opt, i) => i === index ? { ...opt, selected: !opt.selected } : opt)
    );
    setGeneratedVariants([]); // Seçenek değişince kombinasyonları temizle
  };

  const addCustomVariant = () => {
    if (!customVariant.name || !customVariant.values) return;

    const values = customVariant.values.split(',').map(v => v.trim());
    setVariantOptions([
      ...variantOptions,
      { name: customVariant.name, values, selected: true }
    ]);
    setCustomVariant({ name: '', values: '' });
  };

  const removeVariantOption = (index: number) => {
    setVariantOptions(variantOptions.filter((_, i) => i !== index));
    setGeneratedVariants([]);
  };

  const generateVariants = () => {
    const selectedOptions = variantOptions.filter(opt => opt.selected);
    if (selectedOptions.length === 0) return;

    const combinations: Variant[] = [];

    const generateCombinations = (
      current: Record<string, string>,
      depth: number
    ) => {
      if (depth === selectedOptions.length) {
        const variant: Variant = {
          option1: selectedOptions[0]?.name,
          value1: current[selectedOptions[0]?.name],
          option2: selectedOptions[1]?.name,
          value2: current[selectedOptions[1]?.name],
          option3: selectedOptions[2]?.name,
          value3: current[selectedOptions[2]?.name],
          sku: `${formData.sku || 'VAR'}-${Object.values(current).join('-')}`,
          price: parseFloat(formData.fiyat) || 0,
          stock_quantity: parseInt(stokData.stockQuantity) || 0,
        };
        combinations.push(variant);
        return;
      }

      const option = selectedOptions[depth];
      for (const value of option.values) {
        generateCombinations({ ...current, [option.name]: value }, depth + 1);
      }
    };

    generateCombinations({}, 0);
    setGeneratedVariants(combinations);
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    setGeneratedVariants(prev =>
      prev.map((v, i) => i === index ? { ...v, [field]: value } : v)
    );
  };

  // Görsel yükleme
  const handleCoverImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setCoverImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setCoverImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Validasyon
  const validateForm = (): { isValid: boolean; error?: string } => {
    if (!formData.urunAdi.trim()) {
      return { isValid: false, error: 'Ürün adı zorunludur!' };
    }
    if (!formData.fiyat || parseFloat(formData.fiyat) <= 0) {
      return { isValid: false, error: 'Geçerli bir fiyat giriniz!' };
    }
    if (stokData.trackInventory && !stokData.stockQuantity) {
      return { isValid: false, error: 'Stok miktarı giriniz!' };
    }
    return { isValid: true };
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm();
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    if (!shopId || !userId) {
      alert('Mağaza veya kullanıcı bilgisi bulunamadı!');
      return;
    }

    try {
      dispatch(setCurrentOperation({ type: 'create', productId: null, shopId }));
      setIsUploading(true);

      // Görselleri yükle
      const coverImageUrls: string[] = [];
      if (coverImages.length > 0) {
        for (const image of coverImages) {
          const result = await uploadFile.mutateAsync({
            file: image,
            userId,
            purpose: FilePurpose.PRODUCT_COVER
          });
          if (result?.file?.s3_url) {
            coverImageUrls.push(result.file.s3_url);
          }
        }
      }

      // Ürün verisini hazırla
      const productData: ProductCreateRequest = {
        name: formData.urunAdi,
        sku: formData.sku || undefined,
        barcode: formData.barcode || undefined,
        short_description: formData.kisaAciklama || undefined,
        description: formData.aciklama,
        primary_category: formData.kategori,
        base_price: parseFloat(formData.fiyat),
        compare_at_price: formData.indirimliFiyat ? parseFloat(formData.indirimliFiyat) : undefined,
        cost_per_item: formData.maliyet ? parseFloat(formData.maliyet) : undefined,
        product_type: ProductType.PHYSICAL,
        currency: Currency.TRY,
        shop_id: shopId,
        image_gallery: coverImageUrls,
        feature_image_url: coverImageUrls.length > 0 ? coverImageUrls[0] : undefined,
        status: formData.urunDurumu === 'draft' ? ProductStatus.DRAFT :
          formData.urunDurumu === 'published' ? ProductStatus.PUBLISHED :
            ProductStatus.ARCHIVED,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],

        // Fiziksel özellikler (sadece ürün bilgisi)
        weight: physicalData.weight ? parseFloat(physicalData.weight) : undefined,
        dimensions: physicalData.length ? {
          length: parseFloat(physicalData.length),
          width: parseFloat(physicalData.width),
          height: parseFloat(physicalData.height),
          unit: physicalData.dimensionUnit as 'cm' | 'm' | 'inch',
        } : undefined,

        // Stok bilgileri
        stock_quantity: stokData.trackInventory ? parseInt(stokData.stockQuantity) || 0 : -1,
        low_stock_threshold: parseInt(stokData.lowStockThreshold) || 5,
        allows_backorder: stokData.allowBackorders,

        // Tedarikçi bilgileri (ileride eklenecek)
        fulfillment_type: FulfillmentType.MANUAL,

        // Varyantlar
        variants: hasVariants ? generatedVariants.map(v => ({
          ...v,
          price: v.price || parseFloat(formData.fiyat),
        })) : undefined,
      };

      const result = await createProduct.mutateAsync(productData) as ProductResponse;

      setCreatedProduct(result);
      setIsModalError(false);
      setModalError('');
      setSuccessModalOpen(true);
      dispatch(setSelectedProduct(result));
      dispatch(clearFormDraft());

    } catch (error) {
      console.error('❌ Hata:', error);
      let errorMessage = 'Bilinmeyen bir hata oluştu';

      if (error instanceof AxiosError && error.response) {
        const responseData = error.response.data as FastAPIErrorResponse;
        if (error.response.status === 422) {
          if (typeof responseData.detail === 'string') {
            errorMessage = responseData.detail;
          } else if (Array.isArray(responseData.detail)) {
            errorMessage = 'Validasyon hataları:\n';
            responseData.detail.forEach(err => {
              const field = err.loc?.slice(1).join('.') || 'bilinmeyen alan';
              errorMessage += `- ${field}: ${err.msg}\n`;
            });
          }
        } else {
          errorMessage = typeof responseData.detail === 'string'
            ? responseData.detail
            : error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setCreatedProduct({ name: formData.urunAdi } as ProductResponse);
      setIsModalError(true);
      setModalError(errorMessage);
      setSuccessModalOpen(true);

    } finally {
      setIsUploading(false);
      dispatch(setCurrentOperation({ type: null, productId: null, shopId: null }));
    }
  };

  // ===== 7️⃣ RENDER =====
  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'Inter, sans-serif',
        padding: '2rem',
        '@media (max-width: 768px)': {
          padding: '1rem'
        }
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto'
        }}>
          {/* Breadcrumbs */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              flexWrap: 'wrap'
            }}>
              <span
                onClick={() => navigate('/admin')}
                style={{
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span style={{ fontSize: '1rem' }}>📊</span>
                Dashboard
              </span>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span
                onClick={() => navigate('/admin/products')}
                style={{
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span style={{ fontSize: '1rem' }}>📦</span>
                Ürünler
              </span>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span style={{
                color: '#0ea5e9',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span style={{ fontSize: '1rem' }}>➕</span>
                Fiziksel Ürün Ekle
              </span>
            </div>
          </div>

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 0.5rem 0'
              }}>
                Yeni Fiziksel Ürün Ekle
              </h1>
              <p style={{
                color: '#475569',
                margin: 0,
                fontSize: 'clamp(0.875rem, 3vw, 0.95rem)'
              }}>
                Giyim, aksesuar, elektronik ve daha fazlası. Varyantlarla zenginleştirin.
              </p>
            </div>
            <div style={{
              display: 'flex',
              gap: '1rem',
              '@media (max-width: 480px)': {
                width: '100%',
                '& button': { flex: 1 }
              }
            }}>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>✕</span>
                İptal
              </button>
              <button
                type="submit"
                form="physical-product-form"
                disabled={isLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>💾</span>
                {isLoading ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
              </button>
            </div>
          </div>

          {/* FORM */}
          <form id="physical-product-form" onSubmit={handleSubmit}>
            {/* TEMEL BİLGİLER */}
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: '0 0 1.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📝</span>
                Temel Bilgiler
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Ürün Adı <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="urunAdi"
                    value={formData.urunAdi}
                    onChange={handleInputChange}
                    placeholder="Örn: Nike Air Max 90"
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Kategori <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  >
                    <option>Giyim</option>
                    <option>Ayakkabı</option>
                    <option>Aksesuar</option>
                    <option>Elektronik</option>
                    <option>Ev & Yaşam</option>
                    <option>Kozmetik</option>
                    <option>Spor</option>
                    <option>Oyuncak</option>
                    <option>Kitap</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#0f172a'
                }}>
                  Kısa Açıklama
                </label>
                <input
                  type="text"
                  name="kisaAciklama"
                  value={formData.kisaAciklama}
                  onChange={handleInputChange}
                  placeholder="Ürün özeti (max 300 karakter)"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#0f172a'
                }}>
                  Ürün Açıklaması
                </label>
                <textarea
                  name="aciklama"
                  value={formData.aciklama}
                  onChange={handleInputChange}
                  placeholder="Ürün hakkında detaylı bilgi verin..."
                  rows={5}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    color: '#0f172a',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* FİYATLANDIRMA */}
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: '0 0 1.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>💰</span>
                Fiyatlandırma
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Fiyat (TL) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="fiyat"
                    value={formData.fiyat}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    İndirimli Fiyat
                  </label>
                  <input
                    type="number"
                    name="indirimliFiyat"
                    value={formData.indirimliFiyat}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Birim Maliyet
                  </label>
                  <input
                    type="number"
                    name="maliyet"
                    value={formData.maliyet}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    KDV Oranı
                  </label>
                  <select
                    name="kdvOrani"
                    value={formData.kdvOrani}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  >
                    <option value="1">%1</option>
                    <option value="8">%8</option>
                    <option value="18">%18</option>
                    <option value="20">%20</option>
                  </select>
                </div>
              </div>
            </div>

            {/* STOK & ENVANTER */}
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: '0 0 1.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📦</span>
                Stok & Envanter
              </h2>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: '#0f172a'
                }}>
                  <input
                    type="checkbox"
                    name="trackInventory"
                    checked={stokData.trackInventory}
                    onChange={handleStokChange}
                    disabled={isLoading}
                  />
                  Stok Takibi Yap
                </label>
              </div>

              {stokData.trackInventory && (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#0f172a'
                      }}>
                        Stok Miktarı
                      </label>
                      <input
                        type="number"
                        name="stockQuantity"
                        value={stokData.stockQuantity}
                        onChange={handleStokChange}
                        placeholder="0"
                        min="0"
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 10,
                          color: '#0f172a',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#0f172a'
                      }}>
                        Düşük Stok Eşiği
                      </label>
                      <input
                        type="number"
                        name="lowStockThreshold"
                        value={stokData.lowStockThreshold}
                        onChange={handleStokChange}
                        placeholder="5"
                        min="0"
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 10,
                          color: '#0f172a',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: '#0f172a'
                    }}>
                      <input
                        type="checkbox"
                        name="allowBackorders"
                        checked={stokData.allowBackorders}
                        onChange={handleStokChange}
                        disabled={isLoading}
                      />
                      Stokta Yoksa Sipariş Al
                    </label>
                  </div>
                </>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    SKU (Stok Kodu)
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Örn: NK-AIRMAX-001"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Barkod
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    placeholder="Örn: 8691234567890"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* FİZİKSEL ÖZELLİKLER */}
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: '0 0 1.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>⚖️</span>
                Fiziksel Özellikler
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Ağırlık
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="number"
                      name="weight"
                      value={physicalData.weight}
                      onChange={handlePhysicalChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        color: '#0f172a',
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                    <select
                      name="weightUnit"
                      value={physicalData.weightUnit}
                      onChange={handlePhysicalChange}
                      disabled={isLoading}
                      style={{
                        width: 80,
                        padding: '0.75rem 0.5rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        color: '#0f172a',
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    >
                      <option>kg</option>
                      <option>g</option>
                      <option>lb</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    En
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={physicalData.length}
                    onChange={handlePhysicalChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Boy
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={physicalData.width}
                    onChange={handlePhysicalChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Yükseklik
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={physicalData.height}
                    onChange={handlePhysicalChange}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Birim
                  </label>
                  <select
                    name="dimensionUnit"
                    value={physicalData.dimensionUnit}
                    onChange={handlePhysicalChange}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  >
                    <option>cm</option>
                    <option>m</option>
                    <option>inch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* VARYANTLAR */}
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: '0 0 1.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>🔄</span>
                Varyantlar (Renk, Beden, Stil, vb.)
              </h2>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: '#0f172a'
                }}>
                  <input
                    type="checkbox"
                    checked={hasVariants}
                    onChange={(e) => setHasVariants(e.target.checked)}
                    disabled={isLoading}
                  />
                  Bu ürünün varyantları var
                </label>
              </div>

              {hasVariants && (
                <>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a',
                    marginBottom: '1rem'
                  }}>
                    Varyant seçeneklerini işaretleyin:
                  </p>

                  {/* Varyant Seçenekleri Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                  }}>
                    {variantOptions.map((option, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: option.selected ? '#f0f9ff' : '#f8fafc',
                        border: `1px solid ${option.selected ? '#0ea5e9' : '#e2e8f0'}`,
                        borderRadius: 8,
                        position: 'relative'
                      }}>
                        <input
                          type="checkbox"
                          checked={option.selected}
                          onChange={() => toggleVariantOption(idx)}
                          style={{ marginTop: '0.2rem' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{option.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {option.values.slice(0, 5).join(', ')}
                            {option.values.length > 5 && '...'}
                          </div>
                        </div>

                        {/* Sadece özel varyantlar için sil butonu (ön tanımlı olanları silemez) */}
                        {idx >= 8 && ( // İlk 8 varyant ön tanımlı, sonrakiler özel
                          <button
                            type="button"
                            onClick={() => removeVariantOption(idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: 4,
                              '&:hover': {
                                background: '#fee2e2'
                              }
                            }}
                            title="Bu varyantı sil"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Özel varyant ekleme */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: 8,
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    border: '1px dashed #cbd5e1'
                  }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a', marginBottom: '0.75rem' }}>
                      Özel Varyant Ekle
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Varyant adı (örn: Cep Boyutu)"
                        value={customVariant.name}
                        onChange={(e) => setCustomVariant({ ...customVariant, name: e.target.value })}
                        style={{
                          flex: 2,
                          minWidth: 150,
                          padding: '0.6rem 1rem',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 6,
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Değerler (virgülle: 64GB,128GB)"
                        value={customVariant.values}
                        onChange={(e) => setCustomVariant({ ...customVariant, values: e.target.value })}
                        style={{
                          flex: 3,
                          minWidth: 200,
                          padding: '0.6rem 1rem',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 6,
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={addCustomVariant}
                        disabled={!customVariant.name || !customVariant.values}
                        style={{
                          padding: '0.6rem 1.5rem',
                          background: '#0ea5e9',
                          border: 'none',
                          borderRadius: 6,
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          opacity: (!customVariant.name || !customVariant.values) ? 0.5 : 1
                        }}
                      >
                        Ekle
                      </button>
                    </div>
                  </div>

                  {variantOptions.filter(opt => opt.selected).length > 0 && (
                    <>
                      <div style={{ marginBottom: '1rem' }}>
                        <button
                          type="button"
                          onClick={generateVariants}
                          disabled={isLoading}
                          style={{
                            padding: '0.75rem 2rem',
                            background: '#8b5cf6',
                            border: 'none',
                            borderRadius: 8,
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Kombinasyonları Oluştur ({variantOptions.filter(opt => opt.selected).reduce((acc, opt) => acc * opt.values.length, 1)} adet)
                        </button>
                      </div>

                      {generatedVariants.length > 0 && (
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                            Varyant Kombinasyonları:
                          </p>
                          <div style={{
                            maxHeight: 300,
                            overflowY: 'auto',
                            border: '1px solid #e2e8f0',
                            borderRadius: 10,
                            padding: '1rem'
                          }}>
                            {generatedVariants.map((variant, idx) => (
                              <div key={idx} style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr auto',
                                gap: '0.5rem',
                                padding: '0.75rem',
                                borderBottom: idx < generatedVariants.length - 1 ? '1px solid #e2e8f0' : 'none',
                                alignItems: 'center'
                              }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                  {variant.value1}
                                  {variant.value2 && ` / ${variant.value2}`}
                                  {variant.value3 && ` / ${variant.value3}`}
                                </span>
                                <input
                                  type="number"
                                  placeholder="Fiyat"
                                  value={variant.price}
                                  onChange={(e) => updateVariant(idx, 'price', parseFloat(e.target.value) || 0)}
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 6,
                                    fontSize: '0.875rem'
                                  }}
                                />
                                <input
                                  type="number"
                                  placeholder="Stok"
                                  value={variant.stock_quantity}
                                  onChange={(e) => updateVariant(idx, 'stock_quantity', parseInt(e.target.value) || 0)}
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 6,
                                    fontSize: '0.875rem'
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setGeneratedVariants(prev => prev.filter((_, i) => i !== idx))}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem'
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* GÖRSELLER */}
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: '0 0 1.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📸</span>
                Ürün Görselleri
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                {coverImages.map((image, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: index === 0 ? '3px solid #0ea5e9' : '1px solid #e2e8f0'
                  }}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Ürün ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: 4,
                        left: 4,
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: '0.7rem'
                      }}>
                        Ana
                      </div>
                    )}
                  </div>
                ))}

                {coverImages.length < 5 && (
                  <div
                    onClick={() => document.getElementById('cover-upload')?.click()}
                    style={{
                      aspectRatio: '1',
                      border: '2px dashed #e2e8f0',
                      borderRadius: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: '#f8fafc',
                      color: '#94a3b8'
                    }}
                  >
                    <input
                      type="file"
                      id="cover-upload"
                      accept="image/*"
                      onChange={handleCoverImagesChange}
                      multiple
                      disabled={isLoading}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '2rem' }}>+</span>
                    <span style={{ fontSize: '0.75rem' }}>{coverImages.length}/5</span>
                  </div>
                )}
              </div>
            </div>

            {/* DİĞER BİLGİLER */}
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: '0 0 1.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📋</span>
                Diğer Bilgiler
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Etiketler
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="ayakkabı, spor, nike (virgülle ayırın)"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Ürün Durumu
                  </label>
                  <select
                    name="urunDurumu"
                    value={formData.urunDurumu}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  >
                    <option value="draft">📝 Taslak</option>
                    <option value="published">🚀 Yayında</option>
                    <option value="archived">🗄️ Arşiv</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        productName={createdProduct?.name || formData.urunAdi}
        isError={isModalError}
        errorMessage={modalError}
        onViewProducts={() => {
          setSuccessModalOpen(false);
          navigate('/admin/products');
        }}
        onAddAnother={() => {
          setSuccessModalOpen(false);
          setFormData({
            urunAdi: '',
            aciklama: '',
            kisaAciklama: '',
            kategori: 'Giyim',
            fiyat: '',
            indirimliFiyat: '',
            maliyet: '',
            kdvOrani: '18',
            tags: '',
            sku: '',
            barcode: '',
            urunDurumu: 'draft',
          });
          setStokData({
            trackInventory: true,
            stockQuantity: '',
            lowStockThreshold: '5',
            allowBackorders: false,
          });
          setPhysicalData({
            weight: '',
            weightUnit: 'kg',
            length: '',
            width: '',
            height: '',
            dimensionUnit: 'cm',
          });
          setHasVariants(false);
          setVariantOptions(variantOptions.map(opt => ({ ...opt, selected: false })));
          setGeneratedVariants([]);
          setCoverImages([]);
        }}
      />
    </>
  );
};

export default AddPhysicalProduct;