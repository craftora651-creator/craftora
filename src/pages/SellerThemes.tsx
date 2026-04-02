import { useState, useEffect } from 'react';
import SellerProducts from '../middleware/SellerProducts';
import SellerProductDetail from '../middleware/SellerProductDetail';

interface SellerThemesProps {
  colors?: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
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
  const [cartCount, setCartCount] = useState(2);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [shopLogo, setShopLogo] = useState<string | null>(null);
  const [shopBanner, setShopBanner] = useState<string | null>(null);
  const [shopName, setShopName] = useState('Craftora');
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

  // Dark mode tema renkleri
  const darkColors = {
    bg: '#111827',
    surface: '#1f2937',
    border: '#374151',
    text: '#f9fafb',
    textSecondary: '#9ca3af'
  };

  const currentColors = isDarkMode ? darkColors : colors;

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

const handleAddToCartWithQuantity = (product: any, quantity: number) => {
  if (!isLoggedIn) {
    alert('Satın almak için lütfen giriş yapın!');
    window.location.href = '/login';
    return;
  }
  alert(`${product.name} (${quantity} adet) sepete eklendi!`);
  setCartCount(prev => prev + quantity);
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

  // Sepete ekle
  const handleAddToCart = (product: any) => {
    if (!isLoggedIn) {
      alert('Satın almak için lütfen giriş yapın!');
      window.location.href = '/login';
      return;
    }
    alert(`${product.name} sepete eklendi!`);
    setCartCount(prev => prev + 1);
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

  // Home Page Content
  const HomePage = () => (
    <>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        padding: '80px 24px',
        marginBottom: 60,
        overflow: 'hidden',
        backgroundImage: 'url(https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600)',
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
              Dijital Ürünlerin<br />
              <span style={{ borderBottom: '4px solid #0ea5e9' }}>Yeni Adresi</span>
            </h1>
            <p style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: 32,
              maxWidth: 500
            }}>
              En iyi tasarımlar, yazılımlar ve eğitim içerikleri tek bir yerde. Hemen keşfetmeye başla!
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button style={{
                backgroundColor: '#0ea5e9',
                color: 'white',
                padding: '14px 32px',
                borderRadius: 40,
                border: 'none',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}>
                🚀 Keşfetmeye Başla
              </button>
              <button
                onClick={() => setCurrentPage('products')}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  padding: '14px 32px',
                  borderRadius: 40,
                  border: '1px solid white',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                📦 Ürünleri Gör
              </button>
            </div>
          </div>
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
              backgroundImage: 'url(https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400)',
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
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(14,165,233,0.4)',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }} />
              <span style={{
                fontSize: isMobile ? 48 : 64,
                color: 'white',
                fontWeight: 'bold',
                zIndex: 1,
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                letterSpacing: 2
              }}>
                C
              </span>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>Craftora</h3>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>Dijital Ürünler Marketi</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ fontSize: 16, color: '#fbbf24' }}>★</span>
              ))}
              <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>(4.9)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#0ea5e9' }}>500+</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Ürün</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#0ea5e9' }}>10K+</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Müşteri</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#0ea5e9' }}>99%</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Memnuniyet</div>
              </div>
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
          {products.map(product => (
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
              <img src={product.image} alt={product.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: currentColors.text }}>{product.name}</h3>
                  <span style={{
                    backgroundColor: 'rgba(14,165,233,0.1)',
                    color: '#0ea5e9',
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 12
                  }}>{product.category}</span>
                </div>
                <p style={{ fontSize: 14, color: currentColors.textSecondary, marginBottom: 12 }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 12, color: '#f59e0b' }}>⭐ {product.rating}</span>
                  <span style={{ fontSize: 12, color: currentColors.textSecondary }}>📦 {product.sales} satış</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 'bold', color: '#0ea5e9' }}>
                    ${product.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
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
      <div style={{ backgroundColor: currentColors.surface, padding: '60px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 'bold', color: currentColors.text, marginBottom: 16 }}>
            Neden Craftora?
          </h2>
          <p style={{ fontSize: 18, color: currentColors.textSecondary, marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>
            Dijital ürünlerin güvenli adresi
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
            gap: 32
          }}>
            <div><div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div><h3 style={{ fontSize: 20, fontWeight: 600, color: currentColors.text }}>Anında Teslimat</h3><p style={{ color: currentColors.textSecondary }}>Satın aldığınız anda ürünler hesabınıza eklenir</p></div>
            <div><div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div><h3 style={{ fontSize: 20, fontWeight: 600, color: currentColors.text }}>Güvenli Ödeme</h3><p style={{ color: currentColors.textSecondary }}>256-bit SSL sertifikası ile güvenli alışveriş</p></div>
            <div><div style={{ fontSize: 48, marginBottom: 16 }}>🔄</div><h3 style={{ fontSize: 20, fontWeight: 600, color: currentColors.text }}>30 Gün İade</h3><p style={{ color: currentColors.textSecondary }}>Memnun kalmazsanız iade garantisi</p></div>
            <div><div style={{ fontSize: 48, marginBottom: 16 }}>💎</div><h3 style={{ fontSize: 20, fontWeight: 600, color: currentColors.text }}>Premium Kalite</h3><p style={{ color: currentColors.textSecondary }}>En iyi tasarımcı ve geliştiricilerden ürünler</p></div>
          </div>
        </div>
      </div>
    </>
  );


  // Blog Page Content - Sade yazı ve fotoğraf, alt alta
  // Blog Page Content - Sade yazı ve fotoğraf, alt alta
  const BlogPage = () => {
    // Örnek blog yazıları
    const blogPosts = [
      {
        id: 1,
        title: "Dijital Ürünlerde Başarılı Olmanın 5 Altın Kuralı",
        content: "Dijital ürün satışında başarılı olmak için bilmeniz gereken püf noktaları. Müşteri memnuniyeti, ürün kalitesi ve pazarlama stratejileri hakkında kapsamlı rehber. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1200",
        date: "15 Mart 2024",
        author: "Ahmet Yılmaz"
      },
      {
        id: 2,
        title: "React ile Modern Web Uygulamaları Geliştirme",
        content: "React 18 ile gelen yeni özellikler, performans iyileştirmeleri ve en iyi pratikler. Modern web geliştirme dünyasında neler oluyor? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        image: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200",
        date: "10 Mart 2024",
        author: "Ayşe Demir"
      },
      {
        id: 3,
        title: "UI/UX Tasarımında 2024 Trendleri",
        content: "Bu yılın öne çıkan tasarım trendleri, renk paletleri, tipografi ve kullanıcı deneyimi yenilikleri. Geleceğin tasarım dünyasına hazır olun! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200",
        date: "5 Mart 2024",
        author: "Mehmet Kaya"
      },
      {
        id: 4,
        title: "Yapay Zeka ile İçerik Üretimi: Geleceğin Trendi",
        content: "Yapay zeka araçlarıyla nasıl kaliteli içerikler üretebilirsiniz? ChatGPT, Midjourney ve diğer AI araçlarının kullanım alanları. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
        date: "28 Şubat 2024",
        author: "Zeynep Şahin"
      },
      {
        id: 5,
        title: "Freelance Çalışarak Aylık $10,000 Nasıl Kazanılır?",
        content: "Freelance dünyasında başarılı olmanın yolları, portföy oluşturma, müşteri bulma ve fiyatlandırma stratejileri. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200",
        date: "20 Şubat 2024",
        author: "Can Öztürk"
      }
    ];

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
          <p style={{
            fontSize: 18,
            color: currentColors.textSecondary,
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Dijital dünyadan yazılar, ipuçları ve güncel haberler
          </p>
        </div>

        {/* Blog Posts - Alt alta sade yazı ve fotoğraf */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
          {blogPosts.map(post => (
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

              {/* İçerik */}
              <p style={{
                fontSize: 16,
                color: currentColors.textSecondary,
                lineHeight: 1.8,
                marginBottom: 0
              }}>
                {post.content}
              </p>

              {/* Yazılar arasına çizgi (son yazıda gösterme) */}
              {post.id !== blogPosts[blogPosts.length - 1].id && (
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
          Hakkımızda
        </h1>
        <p style={{ fontSize: 18, color: currentColors.textSecondary, maxWidth: 700, margin: '0 auto' }}>
          Dijital ürünlerin en kalitelisini uygun fiyatlarla sunuyoruz
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
            Craftora, dijital ürünlerin satışı için kurulmuş modern bir platformdur.
            Tasarımcılar, geliştiriciler ve yazarlar için en iyi pazaryeri deneyimini sunuyoruz.
          </p>
          <p style={{ color: currentColors.textSecondary, lineHeight: 1.7 }}>
            2024 yılında kurulan Craftora, bugün 500+ ürün ve 10.000+ mutlu müşteriye
            hizmet vermektedir. Misyonumuz, dijital ürünlerin güvenli ve kolay bir şekilde
            alınıp satılmasını sağlamaktır.
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
            Dijital ürünler dünyasında Türkiye'nin lider platformu olmak.
          </p>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 32,
        textAlign: 'center',
        padding: '40px 0',
        borderTop: `1px solid ${currentColors.border}`,
        borderBottom: `1px solid ${currentColors.border}`
      }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#0ea5e9' }}>500+</div>
          <div style={{ color: currentColors.textSecondary }}>Ürün</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#0ea5e9' }}>10K+</div>
          <div style={{ color: currentColors.textSecondary }}>Müşteri</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 'bold', color: '#0ea5e9' }}>99%</div>
          <div style={{ color: currentColors.textSecondary }}>Memnuniyet</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: currentColors.bg, transition: 'background-color 0.3s' }}>
      {/* HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: currentColors.surface,
        borderBottom: `1px solid ${currentColors.border}`,
        padding: '16px 24px',
        transition: 'all 0.3s'
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
              <span style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>C</span>
            </div>
            <span style={{ fontSize: 24, fontWeight: 'bold', color: '#0ea5e9' }}>Craftora</span>
          </div>

          {/* Desktop Navigasyon */}
          {!isMobile && !isTablet && (
            <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              <button onClick={() => setCurrentPage('home')} style={{ color: currentColors.text, background: 'none', border: 'none', fontWeight: currentPage === 'home' ? 700 : 500, borderBottom: currentPage === 'home' ? '2px solid #0ea5e9' : 'none', paddingBottom: 4, cursor: 'pointer', fontSize: 16 }}>Home</button>
              <button onClick={() => setCurrentPage('products')} style={{ color: currentColors.text, background: 'none', border: 'none', fontWeight: currentPage === 'products' ? 700 : 500, borderBottom: currentPage === 'products' ? '2px solid #0ea5e9' : 'none', paddingBottom: 4, cursor: 'pointer', fontSize: 16 }}>Products</button>
              <button onClick={() => setCurrentPage('blog')} style={{ color: currentColors.text, background: 'none', border: 'none', fontWeight: currentPage === 'blog' ? 700 : 500, borderBottom: currentPage === 'blog' ? '2px solid #0ea5e9' : 'none', paddingBottom: 4, cursor: 'pointer', fontSize: 16 }}>Blog</button>
              <button onClick={() => setCurrentPage('about')} style={{ color: currentColors.text, background: 'none', border: 'none', fontWeight: currentPage === 'about' ? 700 : 500, borderBottom: currentPage === 'about' ? '2px solid #0ea5e9' : 'none', paddingBottom: 4, cursor: 'pointer', fontSize: 16 }}>About</button>
            </nav>
          )}

          {/* Sağ Bölüm */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {!isMobile && (
              <div style={{ position: 'relative' }}>
                <input type="text" placeholder="Ürün ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '8px 16px 8px 36px', borderRadius: 30, border: `1px solid ${currentColors.border}`, backgroundColor: currentColors.bg, width: isTablet ? 150 : 200, outline: 'none', fontSize: 14, color: currentColors.text }} />
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
              </div>
            )}
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, padding: 4 }}>
              🛒
              {cartCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', color: 'white', fontSize: 10, fontWeight: 'bold', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
            </button>
            <button onClick={toggleDarkMode} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, padding: 4, color: currentColors.text }}>{isDarkMode ? '☀️' : '🌙'}</button>
            {!isMobile && (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, padding: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  👤
                  {isLoggedIn && <span style={{ fontSize: 12, color: currentColors.textSecondary }}>{userName}</span>}
                </button>
                {showUserMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, backgroundColor: currentColors.surface, border: `1px solid ${currentColors.border}`, borderRadius: 12, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', minWidth: 200, zIndex: 50, overflow: 'hidden' }}>
                    {isLoggedIn ? (
                      <>
                        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${currentColors.border}`, backgroundColor: currentColors.bg }}>
                          <div style={{ fontWeight: 600, color: currentColors.text }}>{userName}</div>
                          <div style={{ fontSize: 12, color: currentColors.textSecondary }}>{userEmail}</div>
                        </div>
                        <button onClick={() => alert('Hesabım')} style={{ width: '100%', padding: '10px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text, fontSize: 14 }}>📋 Hesabım</button>
                        <button onClick={() => alert('Siparişlerim')} style={{ width: '100%', padding: '10px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text, fontSize: 14 }}>📦 Siparişlerim</button>
                        <button onClick={handleLogout} style={{ width: '100%', padding: '10px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 14, borderTop: `1px solid ${currentColors.border}` }}>🚪 Çıkış Yap</button>
                      </>
                    ) : (
                      <>
                        <button onClick={handleLogin} style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text, fontSize: 14, fontWeight: 500 }}>🔑 Giriş Yap</button>
                        <button onClick={() => alert('Kayıt')} style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text, fontSize: 14 }}>📝 Kayıt Ol</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            {(isMobile || isTablet) && (
              <button className="menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, padding: 4, color: currentColors.text }}>☰</button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {(isMobile || isTablet) && isMobileMenuOpen && (
          <div className="mobile-menu" style={{ position: 'fixed', top: 0, right: 0, width: '70%', maxWidth: 300, height: '100vh', backgroundColor: currentColors.surface, borderLeft: `1px solid ${currentColors.border}`, boxShadow: '-5px 0 25px rgba(0,0,0,0.1)', zIndex: 200, padding: '80px 24px 24px', transition: 'transform 0.3s ease', transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
            <button onClick={() => setIsMobileMenuOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: currentColors.text }}>✕</button>
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <input type="text" placeholder="Ürün ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: 30, border: `1px solid ${currentColors.border}`, backgroundColor: currentColors.bg, outline: 'none', fontSize: 14, color: currentColors.text }} />
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <button onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }} style={{ color: currentColors.text, fontSize: 18, padding: 8, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>🏠 Home</button>
              <button onClick={() => { setCurrentPage('products'); setIsMobileMenuOpen(false); }} style={{ color: currentColors.text, fontSize: 18, padding: 8, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>📦 Products</button>
              <button onClick={() => { setCurrentPage('blog'); setIsMobileMenuOpen(false); }} style={{ color: currentColors.text, fontSize: 18, padding: 8, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>📝 Blog</button>
              <button onClick={() => { setCurrentPage('about'); setIsMobileMenuOpen(false); }} style={{ color: currentColors.text, fontSize: 18, padding: 8, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>ℹ️ About</button>
            </nav>
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${currentColors.border}` }}>
              {isLoggedIn ? (
                <>
                  <div style={{ padding: 12, backgroundColor: currentColors.bg, borderRadius: 12, marginBottom: 12 }}>
                    <div style={{ fontWeight: 600, color: currentColors.text }}>{userName}</div>
                    <div style={{ fontSize: 12, color: currentColors.textSecondary }}>{userEmail}</div>
                  </div>
                  <button onClick={() => alert('Hesabım')} style={{ width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text }}>📋 Hesabım</button>
                  <button onClick={() => alert('Siparişlerim')} style={{ width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: currentColors.text }}>📦 Siparişlerim</button>
                  <button onClick={handleLogout} style={{ width: '100%', padding: '12px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>🚪 Çıkış Yap</button>
                </>
              ) : (
                <>
                  <button onClick={handleLogin} style={{ width: '100%', padding: '12px', textAlign: 'center', background: '#0ea5e9', border: 'none', borderRadius: 30, cursor: 'pointer', color: 'white', marginBottom: 12 }}>🔑 Giriş Yap</button>
                  <button onClick={() => alert('Kayıt')} style={{ width: '100%', padding: '12px', textAlign: 'center', background: 'transparent', border: `1px solid ${currentColors.border}`, borderRadius: 30, cursor: 'pointer', color: currentColors.text }}>📝 Kayıt Ol</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT - Sayfa içeriği currentPage'e göre değişir */}
      <main>
  {/* ÖNCE DETAY SAYFASINI KONTROL ET */}
  {showProductDetail && selectedProduct ? (
    <SellerProductDetail
      product={selectedProduct}
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
      <footer style={{ backgroundColor: isDarkMode ? '#0f172a' : '#1f2937', color: 'white', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'), gap: 48, marginBottom: 48 }}>
            <div><h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#0ea5e9' }}>Craftora</h3><p style={{ color: '#9ca3af' }}>Dijital ürünlerin en kalitelisini uygun fiyatlarla sunuyoruz.</p></div>
            <div><h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Hızlı Linkler</h4><ul style={{ listStyle: 'none', padding: 0 }}><li style={{ marginBottom: 8 }}><button onClick={() => setCurrentPage('home')} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>Ana Sayfa</button></li><li style={{ marginBottom: 8 }}><button onClick={() => setCurrentPage('products')} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>Ürünler</button></li><li style={{ marginBottom: 8 }}><button onClick={() => setCurrentPage('blog')} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>Blog</button></li><li style={{ marginBottom: 8 }}><button onClick={() => setCurrentPage('about')} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>Hakkımızda</button></li></ul></div>
            <div><h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Destek</h4><ul style={{ listStyle: 'none', padding: 0 }}><li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>İade Politikası</a></li><li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Kullanım Koşulları</a></li><li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Gizlilik Politikası</a></li><li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>İletişim</a></li></ul></div>
            <div><h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Bizi Takip Edin</h4><div style={{ display: 'flex', gap: 16 }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 24 }}>📘</a><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 24 }}>📷</a><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 24 }}>🐦</a><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 24 }}>💼</a></div></div>
          </div>
          <div style={{ borderTop: '1px solid #374151', paddingTop: 24, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>© 2024 Craftora. Tüm hakları saklıdır.</div>
        </div>
      </footer>
    </div>
  );
};

export default SellerThemes;