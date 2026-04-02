import { useState, useEffect, useRef } from 'react';
import { useMyProducts } from '../server/FastAPI/product.hooks';
import { useMyShops } from '../server/FastAPI/shop.hooks';
import { useActiveTheme, useUpdateThemeSettings } from '../server/Gin/theme.hook';
import { useUploadFile } from '../server/Gin/upload.hooks';

interface MyShopsPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    hover: string;
  };
}

// Icon seçenekleri
const iconOptions = [
  { value: '⚡', label: '⚡ Şimşek' },
  { value: '🔒', label: '🔒 Kilit' },
  { value: '🔄', label: '🔄 Döngü' },
  { value: '💎', label: '💎 Elmas' },
  { value: '🚀', label: '🚀 Roket' },
  { value: '🎯', label: '🎯 Hedef' },
  { value: '⭐', label: '⭐ Yıldız' },
  { value: '❤️', label: '❤️ Kalp' },
  { value: '👍', label: '👍 Beğeni' },
  { value: '🤝', label: '🤝 El sıkışma' },
  { value: '📦', label: '📦 Kargo' },
  { value: '💳', label: '💳 Kart' },
  { value: '🎨', label: '🎨 Tasarım' },
  { value: '⚙️', label: '⚙️ Ayarlar' }
];

const MyShopsPage = ({ colors }: MyShopsPageProps) => {
  // ========== 1. MAĞAZA VERİLERİ ==========
  const { data: myShops, isLoading: shopsLoading, error: shopsError } = useMyShops();
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const uploadFileMutation = useUploadFile();

  useEffect(() => {
    if (myShops && myShops.length > 0 && !selectedShopId) {
      setSelectedShopId(myShops[0].id);
    }
  }, [myShops]);

  // shopData'yı myShops array'inden bul (API çağrısı yok!)
  const shopData = myShops?.find(shop => shop.id === selectedShopId);

  // ========== 2. RESPONSIVE ==========
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // ========== 3. SEKMELER ==========
  const [aktifSekme, setAktifSekme] = useState<'magaza' | 'urunler' | 'neden' | 'blog' | 'about'>('magaza');

  // ========== 4. MAĞAZA AYARLARI STATE'LERİ ==========
  const [magzaAdi, setMagzaAdi] = useState('Craftora Mağazam');
  const [magzaAciklama, setMagzaAciklama] = useState('En kaliteli dijital ürünler burada!');
  const [shopDescription, setShopDescription] = useState('Dijital Ürünler Marketi');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Hero bölümü
  const [heroTitle, setHeroTitle] = useState('Dijital Ürünlerin Yeni Adresi');
  const [heroSubtitle, setHeroSubtitle] = useState('En iyi tasarımlar, yazılımlar ve eğitim içerikleri tek bir yerde. Hemen keşfetmeye başla!');
  const [heroButtonText, setHeroButtonText] = useState('🚀 Keşfetmeye Başla');
  const [heroButton2Text, setHeroButton2Text] = useState('📦 Ürünleri Gör');

  // ========== 5. ÜRÜNLER ==========
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [showAllProductsModal, setShowAllProductsModal] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalSelectedCategory, setModalSelectedCategory] = useState('all');

  // Backend'den ürünleri çek
  const { data: sellerProducts, isLoading: loadingProducts, error: productsError } = useMyProducts(selectedShopId, undefined, {
    enabled: !!selectedShopId
  });
  const { data: themeData } = useActiveTheme(selectedShopId);
  const updateThemeSettings = useUpdateThemeSettings();
  console.log('🔍 selectedShopId:', selectedShopId);
  console.log('🔍 sellerProducts:', sellerProducts);
  console.log('🔍 loadingProducts:', loadingProducts);
  console.log('🔍 productsError:', productsError);

  // ========== 6. NEDEN CRAFTORA? ==========
  const [features, setFeatures] = useState([
    { icon: '⚡', title: 'Anında Teslimat', description: 'Satın aldığınız anda ürünler hesabınıza eklenir' },
    { icon: '🔒', title: 'Güvenli Ödeme', description: '256-bit SSL sertifikası ile güvenli alışveriş' },
    { icon: '🔄', title: '30 Gün İade', description: 'Memnun kalmazsanız iade garantisi' },
    { icon: '💎', title: 'Premium Kalite', description: 'En iyi tasarımcı ve geliştiricilerden ürünler' }
  ]);

  // ========== 7. FOOTER ==========
  const [footerAbout, setFooterAbout] = useState('Dijital ürünlerin en kalitelisini uygun fiyatlarla sunuyoruz.');

  // ========== 8. BLOG ==========
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: 'Dijital Ürünlerde Başarılı Olmanın 5 Altın Kuralı',
      content: 'Dijital ürün satışında başarılı olmak için bilmeniz gereken püf noktaları. Müşteri memnuniyeti, ürün kalitesi ve pazarlama stratejileri hakkında kapsamlı rehber.',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1200',
      date: '15 Mart 2024',
      author: 'Ahmet Yılmaz'
    },
    {
      id: 2,
      title: 'React ile Modern Web Uygulamaları Geliştirme',
      content: 'React 18 ile gelen yeni özellikler, performans iyileştirmeleri ve en iyi pratikler. Modern web geliştirme dünyasında neler oluyor?',
      image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
      date: '10 Mart 2024',
      author: 'Ayşe Demir'
    }
  ]);

  // ========== 9. ABOUT ==========
  const [aboutContent, setAboutContent] = useState({
    title: 'Hakkımızda',
    description: 'Dijital ürünlerin en kalitelisini uygun fiyatlarla sunuyoruz',
    mainText: 'Craftora, dijital ürünlerin satışı için kurulmuş modern bir platformdur. Tasarımcılar, geliştiriciler ve yazarlar için en iyi pazaryeri deneyimini sunuyoruz.',
    visionText: 'Dijital ürünler dünyasında Türkiye\'nin lider platformu olmak.'
  });

  // ========== 10. SHOP DATA GELDİĞİNDE STATE'LERİ GÜNCELLE ==========
  useEffect(() => {
    if (shopData) {
      console.log('🔥 shopData GELDİ:', shopData);
      setMagzaAdi(shopData.shop_name || 'Craftora Mağazam');
      setShopDescription(shopData.description || 'Dijital Ürünler Marketi');
      if (shopData.logo_url) setLogoPreview(shopData.logo_url);
      if (shopData.banner_url) setBannerPreview(shopData.banner_url);
    }
  }, [shopData]);

  // Theme data geldiğinde hero state'lerini güncelle
  useEffect(() => {
    if (themeData?.settings) {
      setHeroTitle(themeData.settings.hero_title || 'Dijital Ürünlerin Yeni Adresi');
      setHeroSubtitle(themeData.settings.hero_subtitle || 'En iyi tasarımlar, yazılımlar ve eğitim içerikleri tek bir yerde. Hemen keşfetmeye başla!');
      setHeroButtonText(themeData.settings.hero_button_text || '🚀 Keşfetmeye Başla');
      setHeroButton2Text(themeData.settings.hero_button2_text || '📦 Ürünleri Gör');
      setFooterAbout(themeData.settings.footer_about || 'Dijital ürünlerin en kalitelisini uygun fiyatlarla sunuyoruz.');
      if (themeData.settings.features && Array.isArray(themeData.settings.features)) {
        setFeatures(themeData.settings.features);
      }
      if (themeData.settings.about_content) {
        setAboutContent(themeData.settings.about_content);
      }
    }
  }, [themeData]);

  // ========== 11. LOCALSTORAGE'DAN YÜKLE ==========
  useEffect(() => {
    const savedData = localStorage.getItem('craftora_shop_settings');
    if (savedData) {
      const data = JSON.parse(savedData);
      setMagzaAdi(data.magzaAdi || 'Craftora Mağazam');
      setMagzaAciklama(data.magzaAciklama || 'En kaliteli dijital ürünler burada!');
      setSelectedProducts(data.selectedProducts || []);
      setFeatures(data.features || []);
      setFooterAbout(data.footerAbout || 'Dijital ürünlerin en kalitelisini uygun fiyatlarla sunuyoruz.');
      setBlogPosts(data.blogPosts || []);
      setAboutContent(data.aboutContent || {});
      if (data.logoPreview) setLogoPreview(data.logoPreview);
      if (data.bannerPreview) setBannerPreview(data.bannerPreview);
    }
  }, []);

  // ========== 12. HANDLER FUNCTIONS ==========
  const handleSaveAll = async () => {
    console.log('💾 Kaydediliyor...');

    try {
      // Hero bölümünü theme settings'e kaydet
      await updateThemeSettings.mutateAsync({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_button_text: heroButtonText,
        hero_button2_text: heroButton2Text,
        footer_about: footerAbout,
        features: features,
        about_content: aboutContent,  // ✅ aboutContent -> about_content
      });

      // Diğer ayarları localStorage'a kaydet (geçici)
      const dataToSaveLocal = {
        magzaAdi,
        magzaAciklama,
        selectedProducts,
        features,
        footerAbout,
        blogPosts,
        aboutContent,
        logoPreview,
        bannerPreview
      };
      localStorage.setItem('craftora_shop_settings', JSON.stringify(dataToSaveLocal));

      console.log('✅ Kaydedildi:', dataToSaveLocal);
      alert('✅ Tüm ayarlar kaydedildi!');
    } catch (error) {
      console.error('❌ Kaydetme hatası:', error);
      alert('❌ Kaydedilirken hata oluştu!');
    }
  };

  const handleViewShop = () => {
    window.location.href = '/seller-themes';
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Blog işlemleri
  const addBlogPost = () => {
    const newId = Math.max(...blogPosts.map(p => p.id), 0) + 1;
    setBlogPosts([
      ...blogPosts,
      {
        id: newId,
        title: 'Yeni Blog Yazısı',
        content: 'Blog yazısı içeriği buraya gelecek...',
        image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1200',
        date: new Date().toLocaleDateString('tr-TR'),
        author: 'Yazar Adı'
      }
    ]);
  };

  const deleteBlogPost = (id: number) => {
    if (confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) {
      setBlogPosts(blogPosts.filter(p => p.id !== id));
    }
  };

  const updateBlogPost = (id: number, field: string, value: string) => {
    setBlogPosts(blogPosts.map(post =>
      post.id === id ? { ...post, [field]: value } : post
    ));
  };

  const removeProduct = (id: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
  };

  // ========== 13. LOADING VE ERROR STATE'LERİ ==========
  if (shopsLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Mağazalarınız yükleniyor...</div>;
  }

  if (shopsError) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Hata: {shopsError.message}</div>;
  }

  if (!myShops || myShops.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Henüz mağazanız yok</h2>
        <p>Hemen bir mağaza açın ve satışa başlayın!</p>
        <button style={{ padding: '12px 24px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          Mağaza Aç
        </button>
      </div>
    );
  }




  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, postId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasyon: sadece resim dosyaları
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin (JPEG, PNG, WEBP, GIF)');
      return;
    }

    // Boyut kontrolü: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    try {
      const result = await uploadFileMutation.mutateAsync({
        file: file,
        userId: selectedShopId,
        purpose: 'blog_image' as any, // veya FilePurpose.BLOG_IMAGE
      });

      const imageUrl = result.file.s3_url;

      if (imageUrl) {
        updateBlogPost(postId, 'image', imageUrl);
        alert('Görsel başarıyla yüklendi!');
      } else {
        throw new Error('No URL returned');
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      alert('Görsel yüklenemedi! Lütfen tekrar deneyin.');
    }
  };

  // ========== 14. ALL PRODUCTS MODAL ==========
  const AllProductsModal = () => {
    const modalCategories = [
      { id: 'all', name: 'Tümü' },
      { id: 'Tasarım', name: 'Tasarım' },
      { id: 'Geliştirme', name: 'Geliştirme' },
      { id: 'E-kitap', name: 'E-kitap' }
    ];
    const [tempSearchTerm, setTempSearchTerm] = useState(modalSearchTerm);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        setModalSearchTerm(tempSearchTerm);
      }, 300);

      return () => {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
      };
    }, [tempSearchTerm]);

    const filteredProducts = (sellerProducts || []).filter(p => {
      const matchCategory = modalSelectedCategory === 'all' || p.category === modalSelectedCategory;
      const matchSearch = p.name.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        (p.description?.toLowerCase() || '').includes(modalSearchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });

    const handleAddProductFromModal = (product: any) => {
      if (selectedProducts.length >= 4) {
        alert('En fazla 4 ürün seçebilirsiniz!');
        return;
      }
      if (!selectedProducts.find(p => p.id === product.id)) {
        setSelectedProducts([...selectedProducts, product]);
        alert(`${product.name} eklendi!`);
      } else {
        alert('Bu ürün zaten seçili!');
      }
    };



    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 16 : 24
      }} onClick={() => setShowAllProductsModal(false)}>
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 24,
          width: '100%',
          maxWidth: 900,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }} onClick={(e) => e.stopPropagation()}>

          {/* Modal Header */}
          <div style={{
            padding: isMobile ? 20 : 24,
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: colors.text, margin: 0 }}>
                📦 Tüm Ürünler
              </h2>
              <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
                {sellerProducts?.length || 0} ürün arasından seçim yapın (En fazla 4 ürün)
              </p>
            </div>
            <button
              onClick={() => setShowAllProductsModal(false)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 24,
                color: colors.textSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>

          {/* Modal Filtreler */}
          <div style={{
            padding: isMobile ? 16 : 20,
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {modalCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setModalSelectedCategory(cat.id)}
                  style={{
                    padding: '6px 16px',
                    backgroundColor: modalSelectedCategory === cat.id ? '#0ea5e9' : 'transparent',
                    color: modalSelectedCategory === cat.id ? 'white' : colors.textSecondary,
                    border: `1px solid ${modalSelectedCategory === cat.id ? '#0ea5e9' : colors.border}`,
                    borderRadius: 30,
                    cursor: 'pointer',
                    fontSize: 13,
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: isMobile ? '100%' : 200 }}>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 16px 8px 36px',
                  borderRadius: 30,
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.bg,
                  outline: 'none',
                  fontSize: 13,
                  color: colors.text
                }}
              />
              <span style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 14
              }}>🔍</span>
            </div>
          </div>

          {/* Modal Ürün Listesi */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: isMobile ? 16 : 20
          }}>
            {loadingProducts ? (
              <div style={{ textAlign: 'center', padding: 40, color: colors.textSecondary }}>
                ⏳ Ürünler yükleniyor...
              </div>
            ) : filteredProducts.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: 12
              }}>
                {filteredProducts.map(product => {
                  const isSelected = selectedProducts.find(p => p.id === product.id);
                  return (
                    <div key={product.id} style={{
                      backgroundColor: colors.bg,
                      borderRadius: 12,
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      border: `1px solid ${isSelected ? '#0ea5e9' : colors.border}`,
                      opacity: isSelected ? 0.7 : 1
                    }}>
                      <img
                        src={product.feature_image_url || 'https://placehold.co/400x300/0ea5e9/white?text=Product'}
                        alt={product.name}
                        style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: colors.text, fontSize: 14 }}>
                          {product.name}
                          {isSelected && <span style={{ fontSize: 10, color: '#0ea5e9', marginLeft: 6 }}>(Seçili)</span>}
                        </div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>
                          {product.base_price ? `$${Number(product.base_price).toFixed(2)}` : 'Fiyat yok'} •
                          {product.primary_category || 'Kategorisiz'}
                        </div>
                      </div>
                      {!isSelected && (
                        <button
                          onClick={() => handleAddProductFromModal(product)}
                          disabled={selectedProducts.length >= 4}
                          style={{
                            padding: '6px 16px',
                            backgroundColor: selectedProducts.length >= 4 ? '#9ca3af' : '#0ea5e9',
                            border: 'none',
                            borderRadius: 20,
                            color: 'white',
                            cursor: selectedProducts.length >= 4 ? 'not-allowed' : 'pointer',
                            fontSize: 12,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Ekle
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: colors.textSecondary }}>
                🔍 Ürün bulunamadı
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div style={{
            padding: isMobile ? 16 : 20,
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 13, color: colors.textSecondary }}>
              Seçili ürün: {selectedProducts.length}/4
            </span>
            <button
              onClick={() => setShowAllProductsModal(false)}
              style={{
                padding: '8px 24px',
                backgroundColor: '#0ea5e9',
                border: 'none',
                borderRadius: 30,
                color: 'white',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500
              }}
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{
            fontSize: isMobile ? 24 : 28,
            fontWeight: 700,
            color: colors.text,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ color: '#0ea5e9', fontSize: 32 }}>🏪</span>
            Mağaza Yönetim Paneli
          </h2>
          <p style={{ fontSize: 14, color: colors.textSecondary, margin: '4px 0 0' }}>
            Mağazanın tüm ayarlarını buradan düzenleyebilirsiniz
          </p>
        </div>

        {/* MAĞAZAMI GÖRÜNTÜLE BUTONU */}
        <button
          onClick={handleViewShop}
          style={{
            padding: '12px 28px',
            backgroundColor: '#0ea5e9',
            border: 'none',
            borderRadius: 40,
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 15px rgba(14,165,233,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0284c7';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0ea5e9';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          👁️ MAĞAZAMI GÖRÜNTÜLE
        </button>
      </div>

      {/* SEKMELER */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 24,
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: 12,
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setAktifSekme('magaza')}
          style={{
            padding: '10px 24px',
            backgroundColor: aktifSekme === 'magaza' ? '#0ea5e9' : 'transparent',
            color: aktifSekme === 'magaza' ? 'white' : colors.text,
            border: 'none',
            borderRadius: 30,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          🏪 Mağaza Bilgileri
        </button>
        <button
          onClick={() => setAktifSekme('urunler')}
          style={{
            padding: '10px 24px',
            backgroundColor: aktifSekme === 'urunler' ? '#0ea5e9' : 'transparent',
            color: aktifSekme === 'urunler' ? 'white' : colors.text,
            border: 'none',
            borderRadius: 30,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          ⭐ Popüler Ürünler
        </button>
        <button
          onClick={() => setAktifSekme('neden')}
          style={{
            padding: '10px 24px',
            backgroundColor: aktifSekme === 'neden' ? '#0ea5e9' : 'transparent',
            color: aktifSekme === 'neden' ? 'white' : colors.text,
            border: 'none',
            borderRadius: 30,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          ✨ Neden Craftora?
        </button>
        <button
          onClick={() => setAktifSekme('blog')}
          style={{
            padding: '10px 24px',
            backgroundColor: aktifSekme === 'blog' ? '#0ea5e9' : 'transparent',
            color: aktifSekme === 'blog' ? 'white' : colors.text,
            border: 'none',
            borderRadius: 30,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          📝 Blog
        </button>
        <button
          onClick={() => setAktifSekme('about')}
          style={{
            padding: '10px 24px',
            backgroundColor: aktifSekme === 'about' ? '#0ea5e9' : 'transparent',
            color: aktifSekme === 'about' ? 'white' : colors.text,
            border: 'none',
            borderRadius: 30,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500
          }}
        >
          ℹ️ Hakkımızda
        </button>
      </div>

      {/* İÇERİK ALANI */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        padding: isMobile ? 20 : 32
      }}>

        {/* ========== MAĞAZA BİLGİLERİ SEKMESİ ========== */}
        {/* ========== MAĞAZA BİLGİLERİ SEKMESİ ========== */}
        {aktifSekme === 'magaza' && (
          <div>
            <h3 style={{
              fontSize: 20,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ color: '#0ea5e9' }}>🏪</span>
              Mağaza Bilgileri
            </h3>

            {/* ========== TEMEL BİLGİLER ========== */}
            <div style={{ marginBottom: 32, borderBottom: `1px solid ${colors.border}`, paddingBottom: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 16 }}>Temel Bilgiler</h4>

              {/* Mağaza Adı */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>
                  Mağaza Adı
                </label>
                <input
                  type="text"
                  value={magzaAdi}
                  onChange={(e) => setMagzaAdi(e.target.value)}
                  placeholder="Mağaza adını girin"
                  style={{
                    width: '100%',
                    maxWidth: 500,
                    padding: '14px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 16,
                    color: colors.text,
                    fontSize: 15,
                    outline: 'none'
                  }}
                />
                <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 6 }}>
                  Bu isim mağazanın başlığında görünecek
                </p>
              </div>

              {/* Logo Altı Açıklama (YENİ) */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>
                  Logo Altı Açıklama
                </label>
                <input
                  type="text"
                  value={shopDescription}
                  onChange={(e) => setShopDescription(e.target.value)}
                  placeholder="Örn: Dijital Ürünler Marketi"
                  style={{
                    width: '100%',
                    maxWidth: 500,
                    padding: '14px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 16,
                    color: colors.text,
                    fontSize: 15,
                    outline: 'none'
                  }}
                />
                <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 6 }}>
                  Logo'nun altında gösterilecek açıklama metni
                </p>
              </div>

              {/* Mağaza Puanı (YENİ) */}

            </div>

            {/* ========== LOGO & BANNER ========== */}
            <div style={{ marginBottom: 32, borderBottom: `1px solid ${colors.border}`, paddingBottom: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 16 }}>Logo & Banner</h4>

              {/* Logo */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 12 }}>
                  Logo
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{
                    width: 100,
                    height: 100,
                    backgroundColor: colors.bg,
                    borderRadius: 16,
                    border: `2px dashed ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 40, color: colors.textSecondary }}>🖼️</span>
                    )}
                  </div>
                  <div>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} id="logo-upload" />
                    <label htmlFor="logo-upload" style={{
                      padding: '10px 24px',
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 30,
                      color: colors.text,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'inline-block'
                    }}>
                      Logo Seç
                    </label>
                    <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>Önerilen: 200x200px</p>
                  </div>
                </div>
              </div>

              {/* Banner */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 12 }}>
                  Banner
                </label>
                <div style={{
                  height: 180,
                  backgroundColor: colors.bg,
                  borderRadius: 16,
                  border: `2px dashed ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  marginBottom: 12,
                  backgroundImage: bannerPreview ? `url(${bannerPreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  {!bannerPreview && (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: 48, color: colors.textSecondary }}>🖼️</span>
                      <p style={{ fontSize: 14, color: colors.textSecondary }}>Banner yüklemek için tıkla</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleBannerUpload} style={{ display: 'none' }} id="banner-upload" />
                <label htmlFor="banner-upload" style={{
                  padding: '10px 24px',
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 30,
                  color: colors.text,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'inline-block'
                }}>
                  Banner Seç
                </label>
                <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>Önerilen: 1920x400px</p>
              </div>
            </div>

            {/* ========== HERO BÖLÜMÜ (Banner Üstü) ========== */}
            <div style={{ marginBottom: 32, borderBottom: `1px solid ${colors.border}`, paddingBottom: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 16 }}>Hero Bölümü (Banner Üstü)</h4>

              {/* Banner Başlığı */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>
                  Banner Başlığı
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Örn: Dijital Ürünlerin Yeni Adresi"
                  style={{
                    width: '100%',
                    maxWidth: 500,
                    padding: '14px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 16,
                    color: colors.text,
                    fontSize: 15,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Banner Açıklaması */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>
                  Banner Açıklaması
                </label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  rows={3}
                  placeholder="En iyi tasarımlar, yazılımlar ve eğitim içerikleri tek bir yerde..."
                  style={{
                    width: '100%',
                    maxWidth: 500,
                    padding: '14px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 16,
                    color: colors.text,
                    fontSize: 15,
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Buton Metinleri */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>
                    1. Buton Metni
                  </label>
                  <input
                    type="text"
                    value={heroButtonText}
                    onChange={(e) => setHeroButtonText(e.target.value)}
                    placeholder="🚀 Keşfetmeye Başla"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      color: colors.text
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>
                    2. Buton Metni
                  </label>
                  <input
                    type="text"
                    value={heroButton2Text}
                    onChange={(e) => setHeroButton2Text(e.target.value)}
                    placeholder="📦 Ürünleri Gör"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      color: colors.text
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ========== İSTATİSTİKLER ========== */}


            {/* ========== FOOTER ========== */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 16 }}>Footer</h4>

              {/* Footer Açıklama */}
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>
                  Footer Açıklaması
                </label>
                <input
                  type="text"
                  value={footerAbout}
                  onChange={(e) => setFooterAbout(e.target.value)}
                  placeholder="Footer'da gösterilecek açıklama"
                  style={{
                    width: '100%',
                    maxWidth: 500,
                    padding: '14px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 16,
                    color: colors.text,
                    fontSize: 15,
                    outline: 'none'
                  }}
                />
                <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 6 }}>
                  Bu metin footer'da "Craftora" başlığının altında gösterilecek
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========== POPÜLER ÜRÜNLER SEKMESİ ========== */}
        {/* ========== POPÜLER ÜRÜNLER SEKMESİ ========== */}
        {aktifSekme === 'urunler' && (
          <div>
            <h3 style={{
              fontSize: 20,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ color: '#0ea5e9' }}>⭐</span>
              Popüler Ürünler
            </h3>
            <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 24 }}>
              Ana sayfada gösterilecek 4 ürünü seçin. (En fazla 4 ürün)
            </p>

            {/* Seçili Ürünler */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 12 }}>
                Seçili Ürünler ({selectedProducts.length}/4)
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: 12
              }}>
                {selectedProducts.map(product => (
                  <div key={product.id} style={{
                    backgroundColor: colors.bg,
                    borderRadius: 12,
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    border: `1px solid ${colors.border}`
                  }}>
                    <img
                      src={product.feature_image_url || product.image || 'https://placehold.co/400x300/0ea5e9/white?text=Product'}
                      alt={product.name}
                      style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: colors.text }}>{product.name}</div>
                      <div style={{ fontSize: 12, color: colors.textSecondary }}>
                        ${product.base_price ? Number(product.base_price).toFixed(2) : product.price || '0'}
                      </div>
                    </div>
                    <button
                      onClick={() => removeProduct(product.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        fontSize: 20,
                        padding: '4px 8px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {selectedProducts.length === 0 && (
                  <div style={{ color: colors.textSecondary, padding: 20, textAlign: 'center', backgroundColor: colors.bg, borderRadius: 12, border: `1px dashed ${colors.border}` }}>
                    Henüz ürün seçilmedi. Aşağıdaki butona tıklayarak ürün ekleyin.
                  </div>
                )}
              </div>
            </div>

            {/* Tüm Ürünler - BUTON OLARAK (ESKİ UZUN LİSTE YERİNE) */}
            <div>
              <button
                onClick={() => setShowAllProductsModal(true)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#0ea5e9',
                  border: 'none',
                  borderRadius: 30,
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                📦 Tüm Ürünlerden Seç
              </button>
              <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
                Tüm ürünler listesini açarak ürün ekleyebilirsiniz
              </p>
            </div>
          </div>
        )}

        {/* ========== NEDEN CRAFTORA? SEKMESİ ========== */}
        {aktifSekme === 'neden' && (
          <div>
            <h3 style={{
              fontSize: 20,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ color: '#0ea5e9' }}>✨</span>
              Neden Craftora? Bölümü
            </h3>
            <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 24 }}>
              Her bir özelliğin iconunu, başlığını ve açıklamasını düzenleyin.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {features.map((feature, index) => (
                <div key={index} style={{
                  backgroundColor: colors.bg,
                  borderRadius: 16,
                  padding: 20,
                  border: `1px solid ${colors.border}`
                }}>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>İkon</label>
                      <select
                        value={feature.icon}
                        onChange={(e) => {
                          const newFeatures = [...features];
                          newFeatures[index].icon = e.target.value;
                          setFeatures(newFeatures);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          color: colors.text,
                          fontSize: 14
                        }}
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>Başlık</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => {
                          const newFeatures = [...features];
                          newFeatures[index].title = e.target.value;
                          setFeatures(newFeatures);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          color: colors.text
                        }}
                      />
                    </div>
                    <div style={{ flex: 3 }}>
                      <label style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>Açıklama</label>
                      <input
                        type="text"
                        value={feature.description}
                        onChange={(e) => {
                          const newFeatures = [...features];
                          newFeatures[index].description = e.target.value;
                          setFeatures(newFeatures);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          color: colors.text
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== BLOG SEKMESİ ========== */}
        {aktifSekme === 'blog' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
              flexWrap: 'wrap',
              gap: 16
            }}>
              <div>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: colors.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  margin: 0
                }}>
                  <span style={{ color: '#0ea5e9' }}>📝</span>
                  Blog Yazıları
                </h3>
                <p style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                  Blog sayfasında gösterilecek yazıları düzenleyin
                </p>
              </div>
              <button
                onClick={addBlogPost}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#0ea5e9',
                  border: 'none',
                  borderRadius: 30,
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                + Yeni Yazı Ekle
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {blogPosts.map(post => (
                <div key={post.id} style={{
                  backgroundColor: colors.bg,
                  borderRadius: 16,
                  padding: 20,
                  border: `1px solid ${colors.border}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontWeight: 600, color: colors.text }}>Yazı #{post.id}</span>
                    <button
                      onClick={() => deleteBlogPost(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        fontSize: 18
                      }}
                    >
                      🗑️ Sil
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>Başlık</label>
                      <input
                        type="text"
                        value={post.title}
                        onChange={(e) => updateBlogPost(post.id, 'title', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          color: colors.text,
                          marginBottom: 12
                        }}
                      />

                      <label style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>Yazar</label>
                      <input
                        type="text"
                        value={post.author}
                        onChange={(e) => updateBlogPost(post.id, 'author', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          color: colors.text,
                          marginBottom: 12
                        }}
                      />

                      <label style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>Tarih</label>
                      <input
                        type="text"
                        value={post.date}
                        onChange={(e) => updateBlogPost(post.id, 'date', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          color: colors.text,
                          marginBottom: 12
                        }}
                      />

                      {/* ✅ GÖRSEL YÜKLEME - URL yerine file upload */}
                      <label style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>Görsel</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => handleBlogImageUpload(e, post.id)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          color: colors.text,
                          fontSize: 14
                        }}
                      />
                      {post.image && (
                        <div style={{ marginTop: 8 }}>
                          <img src={post.image} alt="preview" style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 4 }}>İçerik</label>
                      <textarea
                        value={post.content}
                        onChange={(e) => updateBlogPost(post.id, 'content', e.target.value)}
                        rows={8}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: colors.surface,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 12,
                          color: colors.text,
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  </div>

                  {/* Görsel Önizleme */}
                  {post.image && (
                    <div style={{ marginTop: 16 }}>
                      <img src={post.image} alt="preview" style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 12 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== HAKKIMIZDA SEKMESİ ========== */}
        {aktifSekme === 'about' && (
          <div>
            <h3 style={{
              fontSize: 20,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ color: '#0ea5e9' }}>ℹ️</span>
              Hakkımızda Sayfası
            </h3>
            <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 24 }}>
              Hakkımızda sayfasında gösterilecek içeriği düzenleyin
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: colors.text, display: 'block', marginBottom: 8 }}>Başlık</label>
                <input
                  type="text"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: colors.text, display: 'block', marginBottom: 8 }}>Alt Başlık / Açıklama</label>
                <input
                  type="text"
                  value={aboutContent.description}
                  onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: colors.text, display: 'block', marginBottom: 8 }}>Ana Metin</label>
                <textarea
                  value={aboutContent.mainText}
                  onChange={(e) => setAboutContent({ ...aboutContent, mainText: e.target.value })}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text,
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: colors.text, display: 'block', marginBottom: 8 }}>Vizyon Metni</label>
                <input
                  type="text"
                  value={aboutContent.visionText}
                  onChange={(e) => setAboutContent({ ...aboutContent, visionText: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* KAYDET BUTONU */}
        <div style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleSaveAll}
            style={{
              padding: '14px 40px',
              backgroundColor: '#0ea5e9',
              border: 'none',
              borderRadius: 40,
              color: 'white',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
          >
            💾 Tüm Değişiklikleri Kaydet
          </button>
        </div>
      </div>
      {showAllProductsModal && <AllProductsModal />}
    </div>
  );
};

export default MyShopsPage;