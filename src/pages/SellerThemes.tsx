import { useState, useEffect } from 'react';
import SellerProducts from '../middleware/SellerProducts';
import SellerProductDetail from '../middleware/SellerProductDetail';
import { useActiveTheme } from '../server/Gin/theme.hook';
import { useMyShops } from '../server/FastAPI/shop.hooks';
import { useCurrentUser } from '../server/FastAPI/user.hooks';
import { useCart, useAddToCart, useRemoveFromCart, useClearCart } from '../server/FastAPI/cart.hooks';


interface SellerThemesProps {
  colors?: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
}

type PageType = 'home' | 'products' | 'blog' | 'about';

const SellerThemes = ({ colors = {
  bg: '#ffffff',
  surface: '#f9fafb',
  border: '#e5e7eb',
  text: '#111827',
  textSecondary: '#6b7280'
} }: SellerThemesProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const [shopBanner, setShopBanner] = useState<string | null>(null);
  const [shopName, setShopName] = useState('Craftora');
  const [footerAbout, setFooterAbout] = useState('Dijital ürünlerin en kalitelisini uygun fiyatlarla sunuyoruz.');
  const [socialLinks, setSocialLinks] = useState({
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    facebook: 'https://facebook.com'
  });
  // SellerThemes.tsx - state'lerin olduğu yere ekle
  const [showCartModal, setShowCartModal] = useState(false);


  const [shopDescription, setShopDescription] = useState('Dijital Ürünler Marketi');
  const [stats, setStats] = useState([
    { value: '500+', label: 'Ürün' },
    { value: '10K+', label: 'Müşteri' },
    { value: '99%', label: 'Memnuniyet' }
  ]);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Premium UI Kit',
      description: 'Modern ve kullanışlı UI bileşenleri',
      price: 89,
      image: 'https://placehold.co/400x300/0ea5e9/white?text=UI+Kit',
      category: 'Tasarım',
      rating: 4.8,
      sales: 234
    },
    {
      id: 2,
      name: 'Tailwind Pro Components',
      description: '100+ hazır Tailwind bileşeni',
      price: 49,
      image: 'https://placehold.co/400x300/8b5cf6/white?text=Tailwind',
      category: 'Geliştirme',
      rating: 4.9,
      sales: 189
    },
    {
      id: 3,
      name: 'React Mastery E-book',
      description: 'React öğrenmek için kapsamlı kitap',
      price: 39,
      image: 'https://placehold.co/400x300/10b981/white?text=React+Book',
      category: 'E-kitap',
      rating: 4.7,
      sales: 456
    },
    {
      id: 4,
      name: 'Figma Design System',
      description: 'Profesyonel Figma tasarım sistemi',
      price: 59,
      image: 'https://placehold.co/400x300/ef4444/white?text=Figma',
      category: 'Tasarım',
      rating: 4.9,
      sales: 312
    }
  ]);
  // State'lerin olduğu yere ekle
  const { data: cartData, isLoading: cartLoading, refetch: refetchCart } = useCart();
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart('');
  const clearCartMutation = useClearCart();

  // Sepet verilerinden hesaplama
  const cartItems = cartData?.items || [];
  const cartCount = cartData?.item_count || 0;
  const cartTotal = cartData?.total || 0;

  const handleAddToCart = (product: any, quantity: number = 1) => {
    if (!isLoggedIn) {
      alert('Satın almak için lütfen giriş yapın!');
      window.location.href = '/login';
      return;
    }

    addToCartMutation.mutate({
      product_id: product.id,
      quantity: quantity,
      product_variant_id: null,
      metadata: {}
    }, {
      onSuccess: (data) => {
        console.log('Sepet güncellendi:', data);
        refetchCart(); // Sepeti yenile
        alert(`${product.name} (${quantity} adet) sepete eklendi!`);
      },
      onError: (error) => {
        console.error('Sepet hatası:', error);
      }
    });
  };
  console.log('cartData:', cartData);
console.log('cartItems:', cartItems);


  // Dark mode tema renkleri
  const darkColors = {
    bg: '#111827',
    surface: '#1f2937',
    border: '#374151',
    text: '#f9fafb',
    textSecondary: '#9ca3af'
  };

  // State'lerin olduğu yere ekle
  const { data: userData, isLoading: userLoading } = useCurrentUser(); // ✅ userError kaldırıldı
  useEffect(() => {
    if (userData) {
      setIsLoggedIn(true);
      // ✅ UserResponse'da full_name var, name yok
      setUserName(userData.full_name || userData.email?.split('@')[0] || 'Kullanıcı');
      setUserEmail(userData.email);
      console.log('👤 Kullanıcı bilgileri:', userData);
    } else if (!userLoading && !userData) {
      setIsLoggedIn(false);
      setUserName('');
      setUserEmail('');
    }
  }, [userData, userLoading]); // ✅ setIsLoggedIn, setUserEmail, setUserName gerekmez (stable functions)


  const currentColors = isDarkMode ? darkColors : colors;
  const { data: myShops } = useMyShops();


  // themeData'dan shop_name al (eğer settings içinde varsa)
  const [selectedShopId, setSelectedShopId] = useState('');
  useEffect(() => {
    if (myShops && myShops.length > 0) {
      setSelectedShopId(myShops[0].id);
    }
  }, [myShops]);
  const { data: themeData } = useActiveTheme(selectedShopId);

  useEffect(() => {
    if (themeData?.settings?.footer_about) {
      setFooterAbout(themeData.settings.footer_about);
    }
    if (themeData?.settings?.social_links) {
      setSocialLinks(themeData.settings.social_links);
    }
  }, [themeData]);


  const [aboutContent, setAboutContent] = useState({
    title: 'Hakkımızda',
    description: 'Dijital ürünlerin en kalitelisini uygun fiyatlarla sunuyoruz',
    mainText: 'Craftora, dijital ürünlerin satışı için kurulmuş modern bir platformdur...',
    visionText: 'Dijital ürünler dünyasında Türkiye\'nin lider platformu olmak.'
  });

  // 5. EN SON useEffect'leri tanımla
  useEffect(() => {
    if (themeData?.settings?.about_content) {
      setAboutContent(themeData.settings.about_content);
    }
  }, [themeData]);
  const [features, setFeatures] = useState([
    { icon: '⚡', title: 'Anında Teslimat', description: 'Satın aldığınız anda ürünler hesabınıza eklenir' },
    { icon: '🔒', title: 'Güvenli Ödeme', description: '256-bit SSL sertifikası ile güvenli alışveriş' },
    { icon: '🔄', title: '30 Gün İade', description: 'Memnun kalmazsanız iade garantisi' },
    { icon: '💎', title: 'Premium Kalite', description: 'En iyi tasarımcı ve geliştiricilerden ürünler' }
  ]);

  // SellerThemes.tsx - state'lerin olduğu yere ekle
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // themeData geldiğinde blogPosts'u güncelle (diğer useEffect'lerin yanına)
  useEffect(() => {
    if (themeData?.settings?.blog_posts && Array.isArray(themeData.settings.blog_posts)) {
      setBlogPosts(themeData.settings.blog_posts);
      console.log('📝 Blog posts loaded from backend:', themeData.settings.blog_posts);
    }
  }, [themeData]);

  // Theme data geldiğinde features'ı güncelle (diğer useEffect'lerin yanına ekle)
  useEffect(() => {
    if (themeData?.settings?.features && Array.isArray(themeData.settings.features)) {
      setFeatures(themeData.settings.features);
      console.log('🎨 Features loaded from backend:', themeData.settings.features);
    }
  }, [themeData]);
  const popularProducts = themeData?.settings?.selected_products || [];
  // themeData'dan hero değerlerini al (varsayılan değerlerle)
  const heroTitle = themeData?.settings?.hero_title || 'Dijital Ürünlerin Yeni Adresi';
  const heroSubtitle = themeData?.settings?.hero_subtitle || 'En iyi tasarımlar, yazılımlar ve eğitim içerikleri tek bir yerde. Hemen keşfetmeye başla!';
  const heroButtonText = themeData?.settings?.hero_button_text || '🚀 Keşfetmeye Başla';
  const heroButton2Text = themeData?.settings?.hero_button2_text || '📦 Ürünleri Gör';
  console.log('🎨 themeData:', themeData);
  console.log('🎨 selected_products:', themeData?.settings?.selected_products);

  useEffect(() => {
    const savedSettings = localStorage.getItem('craftora_shop_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.logoPreview) setShopLogo(settings.logoPreview);
      if (settings.bannerPreview) setShopBanner(settings.bannerPreview);
      if (settings.magzaAdi) setShopName(settings.magzaAdi);
      if (settings.selectedProducts && settings.selectedProducts.length > 0) {
        // Ana sayfadaki ürünleri güncelle
        setProducts(settings.selectedProducts);
      }
    }
  }, []);

  // Sepete ekleme fonksiyonu (handleAddToCart zaten var, onu kullan)
  // handleAddToCartWithQuantity fonksiyonunu düzelt:
  const handleAddToCartWithQuantity = (product: any, quantity: number) => {
    if (!isLoggedIn) {
      alert('Satın almak için lütfen giriş yapın!');
      window.location.href = '/login';
      return;
    }

    addToCartMutation.mutate({
      product_id: product.id,
      quantity: quantity,
      product_variant_id: null,
      metadata: {}
    }, {
      onSuccess: () => {
        refetchCart();
        alert(`${product.name} (${quantity} adet) sepete eklendi!`);
      }
    });
  };

  // Ekran boyutunu takip et
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  // Örnek ürünler (sadece 4 tane)


  // Kullanıcı girişini kontrol et (mock)
  useEffect(() => {
    const mockUser = localStorage.getItem('craftora_user');
    if (mockUser) {
      const user = JSON.parse(mockUser);
      setIsLoggedIn(true);
      setUserName(user.name);
      setUserEmail(user.email);
    }
  }, []);

  // Kullanıcı giriş yap
  const handleLogin = () => {
    window.location.href = '/login';
  };

  // Kullanıcı çıkış yap
  const handleLogout = () => {
    localStorage.removeItem('craftora_user');
    setIsLoggedIn(false);
    setShowUserMenu(false);
  };


  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Mobile menu dışına tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // handleAddToCartWithQuantity'den sonra ekle
  const openProductDetail = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  // Sepet Modal Component (return'den önce veya sonra)
  const CartModal = () => {
    const totalPrice = cartItems.reduce((total, item) => total + (item.line_total || 0), 0);

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} onClick={() => setShowCartModal(false)}>
        <div style={{
          backgroundColor: currentColors.surface,
          borderRadius: 24,
          width: '90%',
          maxWidth: 500,
          maxHeight: '80vh',
          overflow: 'auto',
          padding: 24
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 24, fontWeight: 'bold', color: currentColors.text }}>🛒 Sepetim</h2>
            <button onClick={() => setShowCartModal(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: currentColors.text }}>✕</button>
          </div>

          {cartLoading ? (
            <div style={{ textAlign: 'center', padding: 40, color: currentColors.textSecondary }}>Yükleniyor...</div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: currentColors.textSecondary }}>
              🛒 Sepetiniz boş
            </div>
          ) : (
            <>
              {cartItems.map((item: any) => (
                <div key={item.product_id} style={{ display: 'flex', gap: 16, padding: 12, borderBottom: `1px solid ${currentColors.border}` }}>
                  <img
                    src={item.product_image || 'https://placehold.co/400x300/0ea5e9/white?text=Product'}
                    alt={item.product_name}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: currentColors.text }}>{item.product_name}</div>
                    <div style={{ fontSize: 14, color: currentColors.textSecondary }}>
                      ${item.unit_price} x {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#0ea5e9' }}>
                    ${item.line_total?.toFixed(2) || (item.unit_price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${currentColors.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontWeight: 600, color: currentColors.text }}>Toplam:</span>
                  <span style={{ fontSize: 20, fontWeight: 'bold', color: '#0ea5e9' }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    alert(`Toplam ${totalPrice.toFixed(2)} $ ödenecek. Satın alma işlemi tamamlandı!`);
                    clearCartMutation.mutate();
                    setShowCartModal(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#0ea5e9',
                    border: 'none',
                    borderRadius: 40,
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🚀 Satın Al (${totalPrice.toFixed(2)})
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Home Page Content
  const HomePage = () => (
    <>
      {/* Hero Section - Banner background */}
      <div style={{
        position: 'relative',
        padding: '80px 24px',
        marginBottom: 60,
        overflow: 'hidden',
        backgroundImage: `url(${shopBanner || 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 300,
          height: 300,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 400,
          height: 400,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          zIndex: 1
        }} />
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 48,
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ flex: 1 }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              padding: '6px 16px',
              borderRadius: 30,
              fontSize: 14,
              color: 'white',
              marginBottom: 20
            }}>
              🔥 Yeni Sezon Fırsatları
            </span>
            <h1 style={{
              fontSize: isMobile ? 36 : 48,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 16,
              lineHeight: 1.2
            }}>
              {heroTitle.split(' ').slice(0, -1).join(' ')}<br />
              <span style={{ borderBottom: '4px solid #0ea5e9' }}>{heroTitle.split(' ').slice(-1)}</span>
            </h1>
            <p style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: 32,
              maxWidth: 500
            }}>
              {heroSubtitle}
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentPage('products')}
                style={{
                  backgroundColor: '#0ea5e9',
                  color: 'white',
                  padding: '14px 32px',
                  borderRadius: 40,
                  border: 'none',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}
              >
                {heroButtonText}
              </button>
              {/* ✅ "Ürünleri Gör" butonu KALDIRILDI */}
            </div>
          </div>

          {/* Logo Card - Backend'den gelen logo */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 24,
            padding: '32px 40px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            minWidth: isMobile ? 200 : 280,
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <div style={{
              width: isMobile ? 120 : 160,
              height: isMobile ? 120 : 160,
              margin: '0 auto 20px',
              backgroundImage: shopLogo ? `url(${shopLogo})` : 'none',
              backgroundColor: !shopLogo ? '#0ea5e9' : 'transparent',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {!shopLogo && (
                <span style={{
                  fontSize: isMobile ? 48 : 64,
                  color: 'white',
                  fontWeight: 'bold',
                  zIndex: 1,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                  letterSpacing: 2
                }}>
                  {shopName?.charAt(0) || 'C'}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>{shopName || 'Craftora'}</h3>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>{shopDescription || 'Dijital Ürünler Marketi'}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ fontSize: 16, color: '#fbbf24' }}>★</span>
              ))}
              <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>(4.9)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
              {stats.map((stat, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#0ea5e9' }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popüler Ürünler Bölümü */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 'bold', color: currentColors.text }}>
              Popüler Dijital Ürünler
            </h2>
            <p style={{ color: currentColors.textSecondary, marginTop: 8 }}>
              En çok tercih edilen ürünler
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('products')}
            style={{ padding: '8px 20px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: 30, cursor: 'pointer', fontSize: 14 }}
          >
            Tüm Ürünleri Gör →
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
          gap: 24
        }}>
          {popularProducts.map(product => (
            <div key={product.id}
              onClick={() => openProductDetail(product)}
              style={{
                backgroundColor: currentColors.surface,
                borderRadius: 20,
                border: `1px solid ${currentColors.border}`,
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <img
                src={product.feature_image_url || 'https://placehold.co/400x300/0ea5e9/white?text=Product'}
                alt={product.name}
                style={{ width: '100%', height: 200, objectFit: 'cover' }}
              />
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: currentColors.text }}>{product.name}</h3>
                  <span style={{
                    backgroundColor: 'rgba(14,165,233,0.1)',
                    color: '#0ea5e9',
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 12
                  }}>{product.primary_category || 'Ürün'}</span>
                </div>
                <p style={{ fontSize: 14, color: currentColors.textSecondary, marginBottom: 12 }}>
                  {product.short_description || product.description?.substring(0, 80)}
                </p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 12, color: '#f59e0b' }}>⭐ {product.average_rating || '4.8'}</span>
                  <span style={{ fontSize: 12, color: currentColors.textSecondary }}>📦 {product.purchase_count || 0} satış</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 'bold', color: '#0ea5e9' }}>
                    ${product.base_price ? Number(product.base_price).toFixed(2) : '0'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    style={{
                      backgroundColor: '#0ea5e9',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: 30,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 500
                    }}
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Neden Craftora? */}
      {themeData?.settings?.show_why_section !== false && (
        <div style={{ backgroundColor: currentColors.surface, padding: '60px 24px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 32, fontWeight: 'bold', color: currentColors.text, marginBottom: 16 }}>
              Neden {shopName || 'Craftora'}?
            </h2>
            <p style={{ fontSize: 18, color: currentColors.textSecondary, marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
              Dijital ürünlerin güvenli adresi
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
              gap: 32
            }}>
              {features.map((feature, index) => (
                <div key={index}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>{feature.icon}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 600, color: currentColors.text }}>{feature.title}</h3>
                  <p style={{ color: currentColors.textSecondary }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );


  // Blog Page Content - Sade yazı ve fotoğraf, alt alta
  // Blog Page Content - Sade yazı ve fotoğraf, alt alta
  // Blog Page Content
  const BlogPage = () => {
    // Backend'den gelen blogPosts'u kullan, sabitleri kaldır
    if (!blogPosts || blogPosts.length === 0) {
      return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📝</div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: currentColors.text, marginBottom: 8 }}>
            Henüz blog yazısı yok
          </h2>
          <p style={{ color: currentColors.textSecondary }}>
            Admin panelinden blog yazıları ekleyebilirsiniz.
          </p>
        </div>
      );
    }

    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        {/* Blog Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 style={{
            fontSize: isMobile ? 36 : 48,
            fontWeight: 'bold',
            color: currentColors.text,
            marginBottom: 16
          }}>
            Blog
          </h1>
        </div>

        {/* Blog Posts - Alt alta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
          {blogPosts.map((post: any) => (
            <div key={post.id} style={{ width: '100%' }}>
              {/* Başlık */}
              <h2 style={{
                fontSize: isMobile ? 28 : 32,
                fontWeight: 'bold',
                color: currentColors.text,
                marginBottom: 16,
                lineHeight: 1.3
              }}>
                {post.title}
              </h2>

              {/* Meta bilgiler */}
              <div style={{
                display: 'flex',
                gap: 24,
                marginBottom: 24,
                fontSize: 14,
                color: currentColors.textSecondary,
                borderBottom: `1px solid ${currentColors.border}`,
                paddingBottom: 16
              }}>
                <span>📅 {post.date}</span>
                <span>✍️ {post.author}</span>
              </div>

              {/* Fotoğraf */}
              {post.image && (
                <div style={{
                  width: '100%',
                  marginBottom: 32,
                  borderRadius: 16,
                  overflow: 'hidden'
                }}>
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: 500,
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              {/* İçerik */}
              <p style={{
                fontSize: 16,
                color: currentColors.textSecondary,
                lineHeight: 1.8,
                marginBottom: 0
              }}>
                {post.content}
              </p>

              {/* Yazılar arasına çizgi */}
              {post.id !== blogPosts[blogPosts.length - 1]?.id && (
                <div style={{
                  marginTop: 60,
                  borderTop: `1px solid ${currentColors.border}`,
                  opacity: 0.5
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // About Page Content
  const AboutPage = () => (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 48, fontWeight: 'bold', color: currentColors.text, marginBottom: 16 }}>
          {aboutContent.title}
        </h1>
        <p style={{ fontSize: 18, color: currentColors.textSecondary, maxWidth: 700, margin: '0 auto' }}>
          {aboutContent.description}
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: 48,
        alignItems: 'center',
        marginBottom: 60
      }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 'bold', color: currentColors.text, marginBottom: 20 }}>
            Craftora Nedir?
          </h2>
          <p style={{ color: currentColors.textSecondary, lineHeight: 1.7, marginBottom: 16 }}>
            {aboutContent.mainText}
          </p>
        </div>
        <div style={{
          backgroundColor: currentColors.surface,
          borderRadius: 24,
          padding: 40,
          border: `1px solid ${currentColors.border}`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🚀</div>
          <h3 style={{ fontSize: 24, fontWeight: 'bold', color: currentColors.text, marginBottom: 12 }}>
            Vizyonumuz
          </h3>
          <p style={{ color: currentColors.textSecondary }}>
            {aboutContent.visionText}
          </p>
        </div>
      </div>

    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: currentColors.bg,
      transition: 'background-color 0.3s',
      display: 'flex',           // ✅ BUNU EKLE
      flexDirection: 'column'    // ✅ BUNU EKLE
    }}>
      {/* HEADER */}
      <header style={{

        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: currentColors.surface,
        borderBottom: `1px solid ${currentColors.border}`,
        padding: '16px 24px',
        transition: 'all 0.3s',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
            <div style={{
              width: 40,
              height: 40,
              backgroundColor: '#0ea5e9',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                {shopName?.charAt(0) || 'C'}
              </span>
            </div>
            <span style={{ fontSize: 24, fontWeight: 'bold', color: '#0ea5e9' }}>
              {shopName || 'Craftora'}
            </span>
          </div>

          {/* Desktop Navigasyon */}
          {!isMobile && !isTablet && (
            <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setShowProductDetail(false);  // ✅ BUNU EKLE
                }}
                style={{ color: currentColors.text, background: 'none', border: 'none', fontWeight: currentPage === 'home' ? 700 : 500, borderBottom: currentPage === 'home' ? '2px solid #0ea5e9' : 'none', paddingBottom: 4, cursor: 'pointer', fontSize: 16 }}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setCurrentPage('products');
                  setShowProductDetail(false);  // ✅ BUNU EKLE
                }}
                style={{ color: currentColors.text, background: 'none', border: 'none', fontWeight: currentPage === 'products' ? 700 : 500, borderBottom: currentPage === 'products' ? '2px solid #0ea5e9' : 'none', paddingBottom: 4, cursor: 'pointer', fontSize: 16 }}
              >
                Products
              </button>
              <button
                onClick={() => {
                  setCurrentPage('blog');
                  setShowProductDetail(false);  // ✅ BUNU EKLE
                }}
                style={{ color: currentColors.text, background: 'none', border: 'none', fontWeight: currentPage === 'blog' ? 700 : 500, borderBottom: currentPage === 'blog' ? '2px solid #0ea5e9' : 'none', paddingBottom: 4, cursor: 'pointer', fontSize: 16 }}
              >
                Blog
              </button>
              <button
                onClick={() => {
                  setCurrentPage('about');
                  setShowProductDetail(false);  // ✅ BUNU EKLE
                }}
                style={{ color: currentColors.text, background: 'none', border: 'none', fontWeight: currentPage === 'about' ? 700 : 500, borderBottom: currentPage === 'about' ? '2px solid #0ea5e9' : 'none', paddingBottom: 4, cursor: 'pointer', fontSize: 16 }}
              >
                About
              </button>
            </nav>
          )}

          {/* Sağ Bölüm */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Arama Kutusu - Sadece Desktop */}
            {!isMobile && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '8px 16px 8px 36px',
                    borderRadius: 30,
                    border: `1px solid ${currentColors.border}`,
                    backgroundColor: currentColors.bg,
                    width: isTablet ? 150 : 200,
                    outline: 'none',
                    fontSize: 14,
                    color: currentColors.text
                  }}
                />
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
              </div>
            )}

            {/* Sepet Butonu */}
            <button
              onClick={() => setShowCartModal(true)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 24,
                padding: 4
              }}
            >
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dark Mode Butonu */}
            <button
              onClick={toggleDarkMode}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 20,
                padding: 4,
                color: currentColors.text
              }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Kullanıcı Menüsü - Sadece Desktop */}
            {!isMobile && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 24,
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  👤
                  {isLoggedIn && <span style={{ fontSize: 12, color: currentColors.textSecondary }}>{userName}</span>}
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    backgroundColor: currentColors.surface,
                    border: `1px solid ${currentColors.border}`,
                    borderRadius: 12,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    minWidth: 200,
                    zIndex: 50,
                    overflow: 'hidden'
                  }}>
                    {isLoggedIn ? (
                      <>
                        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${currentColors.border}`, backgroundColor: currentColors.bg }}>
                          <div style={{ fontWeight: 600, color: currentColors.text }}>{userName}</div>
                          <div style={{ fontSize: 12, color: currentColors.textSecondary }}>{userEmail}</div>
                        </div>
                        <button
                          onClick={() => alert('Hesabım')}
                          style={{ width: '100%', padding: '10px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text, fontSize: 14 }}
                        >
                          📋 Hesabım
                        </button>
                        <button
                          onClick={() => alert('Siparişlerim')}
                          style={{ width: '100%', padding: '10px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text, fontSize: 14 }}
                        >
                          📦 Siparişlerim
                        </button>
                        <button
                          onClick={handleLogout}
                          style={{ width: '100%', padding: '10px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 14, borderTop: `1px solid ${currentColors.border}` }}
                        >
                          🚪 Çıkış Yap
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleLogin}
                          style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text, fontSize: 14, fontWeight: 500 }}
                        >
                          🔑 Giriş Yap
                        </button>
                        <button
                          onClick={() => alert('Kayıt')}
                          style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text, fontSize: 14 }}
                        >
                          📝 Kayıt Ol
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Butonu */}
            {(isMobile || isTablet) && (
              <button
                className="menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 28,
                  padding: 4,
                  color: currentColors.text
                }}
              >
                ☰
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {(isMobile || isTablet) && isMobileMenuOpen && (
          <div className="mobile-menu" style={{
            position: 'fixed',
            top: 0,
            right: 0,  // ✅ right: 0 (sağdan açılır)
            width: '100%',
            maxWidth: 280,
            height: '100vh',
            backgroundColor: currentColors.surface,
            borderLeft: `1px solid ${currentColors.border}`,  // ✅ sol çizgi
            boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
            zIndex: 200,
            padding: '60px 20px 20px',
            transition: 'transform 0.3s ease',
            transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',  // ✅ sağdan gelir
            overflowY: 'auto'
          }}>
            {/* Kapatma Butonu - Sol üstte */}
            <button onClick={() => setIsMobileMenuOpen(false)} style={{
              position: 'absolute',
              top: 16,
              left: 16,  // ✅ sol üstte
              background: 'none',
              border: 'none',
              fontSize: 22,
              cursor: 'pointer',
              color: currentColors.text
            }}>✕</button>

            {/* Logo - Solda hizalı */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 30 }}>
              <div style={{
                width: 36,
                height: 36,
                backgroundColor: '#0ea5e9',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>{shopName?.charAt(0) || 'C'}</span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 'bold', color: '#0ea5e9' }}>{shopName || 'Craftora'}</span>
            </div>

            {/* Arama */}
            <div style={{ position: 'relative', marginBottom: 30 }}>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 25,
                  border: `1px solid ${currentColors.border}`,
                  backgroundColor: currentColors.bg,
                  outline: 'none',
                  fontSize: 13,
                  color: currentColors.text
                }}
              />
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
            </div>

            {/* Linkler - Solda hizalı */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 30 }}>
              <button onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); setShowProductDetail(false); }} style={{
                color: currentColors.text, fontSize: 15, padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, width: '100%'
              }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentColors.bg} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                🏠 Ana Sayfa
              </button>
              <button onClick={() => { setCurrentPage('products'); setIsMobileMenuOpen(false); setShowProductDetail(false); }} style={{
                color: currentColors.text, fontSize: 15, padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, width: '100%'
              }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentColors.bg} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                📦 Ürünler
              </button>
              <button onClick={() => { setCurrentPage('blog'); setIsMobileMenuOpen(false); setShowProductDetail(false); }} style={{
                color: currentColors.text, fontSize: 15, padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, width: '100%'
              }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentColors.bg} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                📝 Blog
              </button>
              <button onClick={() => { setCurrentPage('about'); setIsMobileMenuOpen(false); setShowProductDetail(false); }} style={{
                color: currentColors.text, fontSize: 15, padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, width: '100%'
              }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentColors.bg} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                ℹ️ Hakkımızda
              </button>
            </nav>

            {/* Kullanıcı */}
            <div style={{ borderTop: `1px solid ${currentColors.border}`, paddingTop: 20 }}>
              {isLoggedIn ? (
                <>
                  <div style={{ padding: 10, backgroundColor: currentColors.bg, borderRadius: 10, marginBottom: 12 }}>
                    <div style={{ fontWeight: 600, color: currentColors.text, fontSize: 14 }}>{userName}</div>
                    <div style={{ fontSize: 11, color: currentColors.textSecondary }}>{userEmail}</div>
                  </div>
                  <button onClick={() => alert('Hesabım')} style={{ width: '100%', padding: '10px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text, fontSize: 14, borderRadius: 8 }}>📋 Hesabım</button>
                  <button onClick={() => alert('Siparişlerim')} style={{ width: '100%', padding: '10px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text, fontSize: 14, borderRadius: 8 }}>📦 Siparişlerim</button>
                  <button onClick={handleLogout} style={{ width: '100%', padding: '10px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 14, borderRadius: 8 }}>🚪 Çıkış Yap</button>
                </>
              ) : (
                <>
                  <button onClick={handleLogin} style={{ width: '100%', padding: '10px', textAlign: 'center', background: '#0ea5e9', border: 'none', borderRadius: 25, cursor: 'pointer', color: 'white', marginBottom: 10, fontSize: 14 }}>🔑 Giriş Yap</button>
                  <button onClick={() => alert('Kayıt')} style={{ width: '100%', padding: '10px', textAlign: 'center', background: 'transparent', border: `1px solid ${currentColors.border}`, borderRadius: 25, cursor: 'pointer', color: currentColors.text, fontSize: 14 }}>📝 Kayıt Ol</button>
                </>
              )}
            </div>
          </div>
        )}
        {showCartModal && <CartModal />}
      </header>

      {/* MAIN CONTENT - Sayfa içeriği currentPage'e göre değişir */}
      <main>
        {/* ÖNCE DETAY SAYFASINI KONTROL ET */}
        {showProductDetail && selectedProduct ? (
          <SellerProductDetail
            productId={selectedProduct.id}
            colors={currentColors}
            isDarkMode={isDarkMode}
            onAddToCart={handleAddToCartWithQuantity}
            onClose={() => setShowProductDetail(false)}
          />
        ) : (
          /* DETAY KAPALIYSA NORMAL SAYFALARI GÖSTER */
          <>
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'products' && (
              <SellerProducts
                colors={currentColors}
                isDarkMode={isDarkMode}
                onAddToCart={handleAddToCart}
                onProductClick={openProductDetail}
              />
            )}
            {currentPage === 'blog' && <BlogPage />}
            {currentPage === 'about' && <AboutPage />}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: isDarkMode ? '#0f172a' : '#1f2937',
        color: 'white',
        padding: '48px 24px 32px',
        flexShrink: 0,
        borderTop: `1px solid ${isDarkMode ? '#374151' : '#374151'}`
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
            gap: 48,
            marginBottom: 48
          }}>
            {/* 1. Sütun - Mağaza Adı ve Açıklama */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#0ea5e9',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{shopName?.charAt(0) || 'C'}</span>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 'bold', color: 'white', margin: 0 }}>
                  {shopName || 'Craftora'}
                </h3>
              </div>
              <p style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: 14, marginBottom: 16 }}>
                {footerAbout}
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>📧 craftora@example.com</span>

              </div>
            </div>

            {/* 2. Sütun - Hızlı Linkler */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: 'white', position: 'relative', display: 'inline-block' }}>
                Hızlı Linkler
                <span style={{ position: 'absolute', bottom: -8, left: 0, width: 40, height: 2, backgroundColor: '#0ea5e9' }}></span>
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><button onClick={() => setCurrentPage('home')} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0, transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={(e) => e.currentTarget.style.color = '#0ea5e9'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}><span>🏠</span> Ana Sayfa</button></li>
                <li><button onClick={() => setCurrentPage('products')} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0, transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={(e) => e.currentTarget.style.color = '#0ea5e9'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}><span>📦</span> Ürünler</button></li>
                <li><button onClick={() => setCurrentPage('blog')} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0, transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={(e) => e.currentTarget.style.color = '#0ea5e9'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}><span>📝</span> Blog</button></li>
                <li><button onClick={() => setCurrentPage('about')} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: 0, transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={(e) => e.currentTarget.style.color = '#0ea5e9'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}><span>ℹ️</span> Hakkımızda</button></li>
              </ul>
            </div>

            {/* 3. Sütun - Bizi Takip Edin */}
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: 'white', position: 'relative', display: 'inline-block' }}>
                Bizi Takip Edin
                <span style={{ position: 'absolute', bottom: -8, left: 0, width: 40, height: 2, backgroundColor: '#0ea5e9' }}></span>
              </h4>
              <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#9ca3af', textDecoration: 'none', transition: 'all 0.2s', opacity: 0.8 }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
                    alt="Instagram"
                    width="28"
                    height="28"
                    style={{ filter: 'invert(1)' }}
                  />
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#9ca3af', textDecoration: 'none', transition: 'all 0.2s', opacity: 0.8 }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg"
                    alt="TikTok"
                    width="28"
                    height="28"
                    style={{ filter: 'invert(1)' }}
                  />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#9ca3af', textDecoration: 'none', transition: 'all 0.2s', opacity: 0.8 }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
                    alt="Facebook"
                    width="28"
                    height="28"
                    style={{ filter: 'invert(1)' }}
                  />
                </a>
              </div>
              <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}>
                📩 Yeniliklerden ilk siz haberdar olun!
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <input type="email" placeholder="E-posta adresiniz" style={{ flex: 1, padding: '10px 12px', borderRadius: 30, border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#374151', color: 'white', outline: 'none', fontSize: 13 }} />
                <button style={{ padding: '10px 20px', borderRadius: 30, border: 'none', backgroundColor: '#0ea5e9', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Abone Ol</button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            borderTop: `1px solid ${isDarkMode ? '#374151' : '#4b5563'}`,
            paddingTop: 24,
            textAlign: 'center',
            color: '#6b7280',
            fontSize: 13,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <span>© 2024 {shopName || 'Craftora'}. Tüm hakları saklıdır.</span>
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 12 }}>Gizlilik Politikası</a>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 12 }}>Kullanım Koşulları</a>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 12 }}>Çerez Politikası</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SellerThemes;