import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useUploadFile } from '../server/Gin/upload.hooks';
import { useCreateProduct } from '../server/FastAPI/product.hooks';
import { useMyShops } from '../server/FastAPI/shop.hooks';
import { useCurrentUser } from '../server/FastAPI/user.hooks';
import {
  saveFormDraft,
  clearFormDraft,
  setSelectedProduct,
  setCurrentOperation
} from '../redux/productSlice';
import type { ProductCreateRequest, ProductResponse } from '../types/product.types';
import { ProductType, Currency, FileType, ProductStatus } from '../types/product.types';
import { FilePurpose, type UploadResponse } from '../types/upload.types';
import './AddProduct.css';
import { AxiosError } from 'axios';
import SuccessModal from "../.paket/SuccessModal"
import './AddProduct.css';

// ===== TİP TANIMLAMALARI =====
interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
  ctx?: Record<string, unknown>;
  input?: unknown;
}

interface FastAPIErrorResponse {
  detail: ValidationErrorItem[] | string;
}

const AddBook: React.FC = () => {
  // ===== 1️⃣ TÜM HOOK'LAR EN ÜSTTE =====
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: shops, isLoading: shopsLoading } = useMyShops();
  const uploadFile = useUploadFile();
  const createProduct = useCreateProduct();

  // ===== 2️⃣ TÜM USESTATE'LER =====
  const [formData, setFormData] = useState({
    urunAdi: '',
    aciklama: '',
    kisaAciklama: '',
    kategori: 'Roman' as string,
    fiyat: '',
    indirimliFiyat: '',
    stokMiktari: '0',           // 👈 Varsayılan 0 (sınırsız)
    tags: '',
    sku: '',
    barcode: '',
    urunDurumu: 'draft',
  });
  const [modalError, setModalError] = useState('');
  const [isModalError, setIsModalError] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<ProductResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverImages, setCoverImages] = useState<File[]>([]);
  const [stokDegeri, setStokDegeri] = useState('sınırsız');
  const [stokInputMode, setStokInputMode] = useState<'select' | 'input'>('select');
  const [isUploading, setIsUploading] = useState(false);
  const isLoading = uploadFile.isPending || createProduct.isPending || isUploading || userLoading || shopsLoading;

  // ===== 3️⃣ TÜM USEEFFECT'LER =====
  useEffect(() => {
    const draftData: Partial<ProductCreateRequest> = {
      name: formData.urunAdi,
      description: formData.aciklama,
      primary_category: formData.kategori,
      base_price: formData.fiyat ? parseFloat(formData.fiyat) : undefined,
      compare_at_price: formData.indirimliFiyat ? parseFloat(formData.indirimliFiyat) : undefined,
      product_type: ProductType.DIGITAL,
      currency: Currency.TRY,
      tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : [],
    };
    dispatch(saveFormDraft(draftData));
  }, [formData, dispatch]);

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
    return <div className="loading-container">Yükleniyor...</div>;
  }

  // ===== 5️⃣ VERİLER HAZIR, FONKSİYONLAR =====
  const shopId = shops?.[0]?.id;
  const userId = currentUser?.id;

  // 📁 Dosya tipini otomatik belirle
  const getFileType = (filename: string): FileType => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return FileType.PDF;
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'webm': return FileType.VIDEO;
      case 'mp3':
      case 'wav':
      case 'ogg': return FileType.AUDIO;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz': return FileType.ARCHIVE;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'svg': return FileType.IMAGE;
      case 'doc':
      case 'docx':
      case 'txt':
      case 'rtf': return FileType.DOCUMENT;
      case 'exe':
      case 'msi':
      case 'sh':
      case 'bat': return FileType.SOFTWARE;
      default: return FileType.OTHER;
    }
  };

  // Görsel yükleme fonksiyonu
  // Görsel yükleme fonksiyonu
  const uploadCoverImages = async (files: File[]): Promise<string[]> => {
    if (!userId) {
      throw new Error("UserId bulunamadı");
    }

    const urls: string[] = [];

    for (const file of files) {
      try {
        const result = await uploadFile.mutateAsync({
          file,
          userId, // artık TS biliyor bunun string olduğunu
          purpose: FilePurpose.PRODUCT_COVER
        }) as UploadResponse;

        if (typeof result?.file?.s3_url === "string") {
          urls.push(result.file.s3_url);
        }
      } catch (error) {
        console.error('Görsel yüklenirken hata:', error);
      }
    }

    return urls;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCoverImagesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setCoverImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (indexToRemove: number): void => {
    setCoverImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleStokChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
    const value = e.target.value;
    setStokDegeri(value);

    // stokMiktari'ni da güncelle
    if (value === 'sınırsız') {
      setFormData(prev => ({ ...prev, stokMiktari: '0' }));
    } else {
      setFormData(prev => ({ ...prev, stokMiktari: value }));
    }
  };

  const validateForm = (): { isValid: boolean; error?: string } => {
    if (!formData.urunAdi.trim()) {
      return { isValid: false, error: 'Ürün adı zorunludur!' };
    }
    if (!formData.fiyat || parseFloat(formData.fiyat) <= 0) {
      return { isValid: false, error: 'Geçerli bir fiyat giriniz!' };
    }
    if (!selectedFile) {
      return { isValid: false, error: 'Ürün dosyası zorunludur!' };
    }
    return { isValid: true };
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
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

      console.log('📤 Dosya yükleniyor...');
      console.log('📦 Gönderilen file:', selectedFile?.name);
      console.log('👤 userId:', userId);

      const uploadResult = await uploadFile.mutateAsync({
        file: selectedFile!,
        userId,
        purpose: FilePurpose.PRODUCT_FILE
      }) as UploadResponse;

      console.log('📦 uploadResult:', uploadResult);

      if (!uploadResult?.file?.s3_url) {
        throw new Error('uploadResult undefined!');
      }

      const fileUrl = uploadResult.file?.s3_url as string;
      console.log('✅ Dosya yüklendi:', fileUrl);

      let coverImageUrls: string[] = [];
      if (coverImages.length > 0) {
        console.log('📸 Kapak görselleri yükleniyor...');
        coverImageUrls = await uploadCoverImages(coverImages);
        console.log('✅ Kapak görselleri yüklendi:', coverImageUrls);
      }
      console.log('🔍 İndirimli fiyat (ham):', formData.indirimliFiyat);
      console.log('🔍 İndirimli fiyat (parse):', formData.indirimliFiyat ? parseFloat(formData.indirimliFiyat) : undefined);
      // status'ü ProductStatus enum'ına çevir
      console.log('🔍 Status (enum):', status);  // Debug için
      // status'ü ProductStatus enum'ına çevir
      const statusValue =
        formData.urunDurumu === 'draft' ? ProductStatus.DRAFT :
          formData.urunDurumu === 'published' ? ProductStatus.PUBLISHED :
            ProductStatus.ARCHIVED;

      // productData'yı oluştur
      const productData: ProductCreateRequest = {
        name: formData.urunAdi,
        sku: formData.sku || undefined,
        barcode: formData.barcode || undefined,
        short_description: formData.kisaAciklama || undefined,
        description: formData.aciklama,
        primary_category: formData.kategori,
        base_price: parseFloat(formData.fiyat),
        compare_at_price: formData.indirimliFiyat ? parseFloat(formData.indirimliFiyat) : undefined,
        product_type: ProductType.DIGITAL,
        currency: Currency.TRY,
        file_url: fileUrl,
        file_name: selectedFile!.name,
        file_type: getFileType(selectedFile!.name),
        file_size: selectedFile!.size,
        stock_quantity: formData.stokMiktari ? parseInt(formData.stokMiktari) : 0,
        tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : [],
        shop_id: shopId,
        image_gallery: coverImageUrls,
        feature_image_url: coverImageUrls.length > 0 ? coverImageUrls[0] : undefined,
        fulfillment_type: 'auto',

        // 🟢🟢🟢 STATUS - statusValue değişkenini kullan! 🟢🟢🟢
        status: statusValue,
      };

      // Kontrol et
      console.log('📦 GÖNDERİLEN STATUS:', productData.status);
      console.log('📦 TÜM VERİ:', JSON.stringify(productData, null, 2));


      // 📦 Gönderilen veriyi kontrol et
      console.log('📦 Gönderilen productData:', {
        name: productData.name,
        base_price: productData.base_price,
        compare_at_price: productData.compare_at_price,
        sku: productData.sku,
        barcode: productData.barcode,
        tags: productData.tags,
        image_gallery: productData.image_gallery?.length
      });

      const result = await createProduct.mutateAsync(productData) as ProductResponse;
      console.log('✅ Ürün kaydedildi:', result);
      console.log('📦 Gönderilen productData (tam):', JSON.stringify(productData, null, 2));

      if (!result) {
        throw new Error("urun olusturuldu ama response bos");
      }

      // ✅ BAŞARILI DURUM - Modal'ı aç
      setCreatedProduct(result);
      setIsModalError(false);
      setModalError('');
      setSuccessModalOpen(true);

      // Dispatch işlemleri
      dispatch(setSelectedProduct(result));
      dispatch(clearFormDraft());

    } catch (error) {
      console.error('❌ Hata:', error);
      let errorMessage = 'Bilinmeyen bir hata oluştu';

      if (error instanceof AxiosError && error.response) {
        console.log('📄 Hata durumu:', error.response.status);
        console.log('📄 Hata detayı:', error.response.data);  // 👈
        const responseData = error.response.data as FastAPIErrorResponse;
        if (error.response.status === 422) {
          if (typeof responseData.detail === 'string') {
            errorMessage = responseData.detail;
            console.log('🔴 422 HATA MESAJI:', errorMessage);
          } else if (Array.isArray(responseData.detail)) {
            errorMessage = 'Validasyon hataları:\n';
            responseData.detail.forEach((err: ValidationErrorItem) => {
              const field = err.loc?.slice(1).join('.') || 'bilinmeyen alan';
              errorMessage += `- ${field}: ${err.msg}\n`;
              console.log(`🔴 HATA - ${field}: ${err.msg}`);
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

  return (
    <>
      <div className="add-product-page" style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',  // ☀️ LIGHT TEMA
        color: '#0f172a'
      }}>
        <div className="add-product-container" style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '2rem',
          '@media (max-width: 768px)': {
            padding: '1rem'
          }
        }}>

          {/* Breadcrumbs - Sade, light renkler */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div className="breadcrumbs" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              flexWrap: 'wrap'
            }}>
              <a href="/dashboard" style={{
                color: '#475569',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span className="material-icons" style={{ fontSize: '1rem' }}>dashboard</span>
                Dashboard
              </a>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <a href="/products" style={{
                color: '#475569',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span className="material-icons" style={{ fontSize: '1rem' }}>inventory_2</span>
                Dijital Ürünler
              </a>
              <span style={{ color: '#cbd5e1' }}>/</span>
              <span style={{
                color: '#0ea5e9',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span className="material-icons" style={{ fontSize: '1rem' }}>add_circle</span>
                Yeni Dijital Ürün Ekle
              </span>
            </div>
          </div>

          {/* ===== HEADER ===== */}
          <div className="page-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div className="header-title">
              <h1 style={{
                fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 0.5rem 0'
              }}>Yeni Dijital Ürün Ekle</h1>
              <p style={{
                color: '#475569',
                margin: 0,
                fontSize: 'clamp(0.875rem, 3vw, 0.95rem)'
              }}>Sisteme yeni bir dijital ürün tanımlayın ve dosyasını yükleyin.</p>
            </div>
            <div className="header-actions" style={{
              display: 'flex',
              gap: '1rem',
              '@media (max-width: 480px)': {
                width: '100%',
                '& button': {
                  flex: 1
                }
              }
            }}>
              <button
                type="button"
                onClick={() => navigate('/products')}
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
                <span className="material-icons" style={{ fontSize: '1.25rem' }}>close</span>
                İptal
              </button>
              <button
                type="submit"
                form="product-form"
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
                <span className="material-icons" style={{ fontSize: '1.25rem' }}>publish</span>
                {isLoading ? 'Kaydediliyor...' : 'Ürünü Yayınla'}
              </button>
            </div>
          </div>

          {/* ===== FORM CARD ===== */}
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            marginBottom: '2rem'
          }}>
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="material-icons" style={{ color: '#0ea5e9' }}>info</span>
                Genel Bilgiler
              </h2>
            </div>

            <form id="product-form" onSubmit={handleSubmit}>
              {/* Ürün Adı + Kategori */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>Ürün Adı *</label>
                  <input
                    type="text"
                    name="urunAdi"
                    value={formData.urunAdi}
                    onChange={handleInputChange}
                    placeholder="Örn: Python Programlama Eğitimi"
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
                  }}>Kategori *</label>
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
                    <option>Roman</option>
                    <option>Bilim Kurgu</option>
                    <option>Tarih</option>
                    <option>Felsefe</option>
                    <option>Eğitim</option>
                    <option>Yazılım</option>
                  </select>
                </div>
              </div>

              {/* Açıklama */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#0f172a'
                }}>Ürün Açıklaması</label>
                <textarea
                  name="aciklama"
                  value={formData.aciklama}
                  onChange={handleInputChange}
                  placeholder="Ürün içeriği hakkında detaylı bilgi verin..."
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

              <div style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flex: '1' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
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
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        color: '#0f172a',
                        fontSize: '0.95rem',
                        outline: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <option value="draft">📝 Taslak (Sadece siz görebilirsiniz)</option>
                      <option value="published">🚀 Yayında (Herkes görebilir ve satın alabilir)</option>
                      <option value="archived">🗄️ Arşivlenmiş (Mağazada görünmez)</option>
                    </select>
                  </div>

                  <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '8px',
                    color: '#334155',
                    fontSize: '0.9rem',
                    maxWidth: '300px'
                  }}>
                    <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '4px' }}>info</span>
                    {formData.urunDurumu === 'draft' && 'Ürün henüz yayında değil. Sadece siz görebilirsiniz.'}
                    {formData.urunDurumu === 'published' && 'Ürün mağazada görünür ve satışa açıktır.'}
                    {formData.urunDurumu === 'archived' && 'Ürün mağazadan kaldırıldı, ancak verileri duruyor.'}
                  </div>
                </div>
              </div>

              {/* Fiyat + İndirim + Etiketler */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>Fiyat (TL) *</label>
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
                  }}>İndirimli Fiyat</label>
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
                  }}>Etiketler</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="eğitim, python, yazılım"
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

              {/* Stok Durumu */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#0f172a'
                }}>Stok Durumu</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {stokInputMode === 'select' ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
                      <select
                        value={stokDegeri}
                        onChange={handleStokChange}
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
                      >
                        <option value="sınırsız">Sınırsız</option>
                        <option value="100">100 adet</option>
                        <option value="50">50 adet</option>
                        <option value="10">10 adet</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setStokInputMode('input')}
                        disabled={isLoading}
                        style={{
                          padding: '0.75rem',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 10,
                          color: '#475569',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span className="material-icons">edit</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
                      <input
                        type="number"
                        value={stokDegeri}
                        onChange={handleStokChange}
                        placeholder="Stok miktarı"
                        min="0"
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
                      <button
                        type="button"
                        onClick={() => {
                          setStokInputMode('select');
                          setStokDegeri('sınırsız');
                        }}
                        disabled={isLoading}
                        style={{
                          padding: '0.75rem',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 10,
                          color: '#475569',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span className="material-icons">list</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '1.5rem'  // Üstteki stoktan biraz boşluk
              }}>
                {/* SKU (Ürün Kodu) */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Ürün Kodu (SKU)
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}  // 👈 state'te tanımla
                    onChange={handleInputChange}
                    placeholder="Örn: URUN-001"
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

                {/* Barkod Numarası */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>
                    Barkod Numarası
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}  // 👈 state'te tanımla
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
                {/* Kısa Açıklama - ŞU AN YOK! EKLE! */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#0f172a'
                  }}>Kısa Açıklama</label>
                  <textarea
                    name="kisaAciklama"
                    value={formData.kisaAciklama}
                    onChange={handleInputChange}
                    placeholder="Ürün özeti (max 300 karakter)"
                    rows={3}
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
            </form>
          </div>

          {/* ===== DOSYA YÜKLEME CARD ===== */}
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            marginBottom: '2rem'
          }}>
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="material-icons" style={{ color: '#8b5cf6' }}>cloud_upload</span>
                Dosya ve Medya
              </h2>
            </div>

            {/* Kapak Görselleri */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{
                marginBottom: '1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="material-icons" style={{ fontSize: '1rem', color: '#64748b' }}>collections</span>
                Ürün Görselleri
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '1rem'
              }}>
                {coverImages.map((image, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '2px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Ürün görseli ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={isLoading}
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
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: '1rem' }}>close</span>
                    </button>
                    {index === 0 && (
                      <span style={{
                        position: 'absolute',
                        bottom: 4,
                        left: 4,
                        background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        <span className="material-icons" style={{ fontSize: '0.7rem' }}>star</span>
                        Öne Çıkan
                      </span>
                    )}
                  </div>
                ))}

                {coverImages.length < 5 && (
                  <div
                    onClick={() => !isLoading && document.getElementById('cover-upload')?.click()}
                    style={{
                      aspectRatio: '1',
                      border: '2px dashed #e2e8f0',
                      borderRadius: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.5 : 1,
                      background: '#f8fafc',
                      color: '#64748b'
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
                    <span className="material-icons" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>add_photo_alternate</span>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>Görsel Ekle</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{coverImages.length}/5</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ana Dosya */}
            <div>
              <p style={{
                marginBottom: '1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="material-icons" style={{ fontSize: '1rem', color: '#64748b' }}>insert_drive_file</span>
                Ürün Dosyası *
              </p>
              <div
                onClick={() => !isLoading && document.getElementById('product-upload')?.click()}
                style={{
                  border: '2px dashed #e2e8f0',
                  borderRadius: 12,
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                  background: '#f8fafc',
                  color: '#475569'
                }}
              >
                <input
                  type="file"
                  id="product-upload"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  style={{ display: 'none' }}
                />
                {selectedFile ? (
                  <div>
                    <span className="material-icons" style={{
                      fontSize: '3rem',
                      color: '#10b981',
                      marginBottom: '0.5rem'
                    }}>check_circle</span>
                    <p style={{
                      margin: '0 0 0.25rem',
                      color: '#0f172a',
                      fontWeight: 500
                    }}>{selectedFile.name}</p>
                    <p style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {uploadFile.isPending && (
                      <p style={{
                        marginTop: '0.5rem',
                        color: '#0ea5e9',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}>
                        <span className="material-icons" style={{ fontSize: '1rem' }}>hourglass_top</span>
                        Yükleniyor...
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <span className="material-icons" style={{ fontSize: '3rem', marginBottom: '1rem' }}>cloud_upload</span>
                    <p style={{
                      margin: '0 0 0.25rem',
                      color: '#0f172a',
                      fontWeight: 500
                    }}>Dosya Seç</p>
                    <p style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>PDF, DOC, MP4, ZIP (Max 100MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ===== DOSYA TİPLERİ BİLGİ KARTI ===== */}
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '1.5rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <span className="material-icons" style={{ color: '#8b5cf6' }}>info</span>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#0f172a',
                margin: 0
              }}>Desteklenen Dosya Tipleri</h3>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '1rem'
            }}>
              {[
                { icon: 'picture_as_pdf', text: 'PDF', color: '#ef4444' },
                { icon: 'description', text: 'DOC', color: '#3b82f6' },
                { icon: 'text_snippet', text: 'TXT', color: '#6b7280' },
                { icon: 'table_chart', text: 'XLS', color: '#10b981' },
                { icon: 'slideshow', text: 'PPT', color: '#f97316' },
                { icon: 'table_rows', text: 'CSV', color: '#8b5cf6' },
                { icon: 'menu_book', text: 'EPUB', color: '#059669' },
                { icon: 'book', text: 'MOBI', color: '#b45309' }
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0'
                }}>
                  <span className="material-icons" style={{ fontSize: '2rem', color: item.color }}>{item.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== FOOTER ===== */}
          <div style={{
            paddingTop: '2rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#64748b',
            fontSize: '0.875rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-icons" style={{ fontSize: '1rem' }}>copyright</span>
              © 2024 Craftora Dijital Ürünler
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="#" style={{
                color: '#64748b',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span className="material-icons" style={{ fontSize: '1rem' }}>help</span>
                Yardım
              </a>
              <a href="#" style={{
                color: '#64748b',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span className="material-icons" style={{ fontSize: '1rem' }}>gavel</span>
                Koşullar
              </a>
            </div>
          </div>
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
            kategori: 'Roman',
            fiyat: '',
            indirimliFiyat: '',
            tags: '',
          });
          setSelectedFile(null);
          setCoverImages([]);
          setStokDegeri('sınırsız');
        }}
      />
    </>
  );
};

export default AddBook;