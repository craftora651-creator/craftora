import { useState, useEffect } from 'react';

interface SellerThemesProps {
  colors?: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

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

  // Dark mode tema renkleri
  const darkColors = {
    bg: '#111827',
    surface: '#1f2937',
    border: '#374151',
    text: '#f9fafb',
    textSecondary: '#9ca3af'
  };

  const currentColors = isDarkMode ? darkColors : colors;

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
  const products = [
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
  ];

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: currentColors.bg, transition: 'background-color 0.3s' }}>
      {/* ==================== HEADER ==================== */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
              <a href="#" style={{ color: currentColors.text, textDecoration: 'none', fontWeight: 500 }}>Home</a>
              <a href="#" style={{ color: currentColors.text, textDecoration: 'none', fontWeight: 500 }}>Products</a>
              <a href="#" style={{ color: currentColors.text, textDecoration: 'none', fontWeight: 500 }}>Blog</a>
              <a href="#" style={{ color: currentColors.text, textDecoration: 'none', fontWeight: 500 }}>About</a>
            </nav>
          )}

          {/* Sağ Bölüm */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Arama (tablet ve masaüstünde göster) */}
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
                <span style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 16
                }}>🔍</span>
              </div>
            )}

            {/* Sepet */}
            <button style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 24,
              padding: 4
            }}>
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

            {/* Dark Mode Toggle */}
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

            {/* Kullanıcı İkonu (masaüstü) */}
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
                  {isLoggedIn && (
                    <span style={{ fontSize: 12, color: currentColors.textSecondary }}>
                      {userName}
                    </span>
                  )}
                </button>

                {/* Dropdown Menü */}
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
                        <div style={{
                          padding: '12px 16px',
                          borderBottom: `1px solid ${currentColors.border}`,
                          backgroundColor: currentColors.bg
                        }}>
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

            {/* Mobile Menu Button */}
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
            right: 0,
            width: '70%',
            maxWidth: 300,
            height: '100vh',
            backgroundColor: currentColors.surface,
            borderLeft: `1px solid ${currentColors.border}`,
            boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
            zIndex: 200,
            padding: '80px 24px 24px',
            transition: 'transform 0.3s ease',
            transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)'
          }}>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: currentColors.text
              }}
            >
              ✕
            </button>
            
            {/* Arama (mobile) */}
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  borderRadius: 30,
                  border: `1px solid ${currentColors.border}`,
                  backgroundColor: currentColors.bg,
                  outline: 'none',
                  fontSize: 14,
                  color: currentColors.text
                }}
              />
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <a href="#" style={{ color: currentColors.text, textDecoration: 'none', fontSize: 18, padding: 8 }}>🏠 Home</a>
              <a href="#" style={{ color: currentColors.text, textDecoration: 'none', fontSize: 18, padding: 8 }}>📦 Products</a>
              <a href="#" style={{ color: currentColors.text, textDecoration: 'none', fontSize: 18, padding: 8 }}>📝 Blog</a>
              <a href="#" style={{ color: currentColors.text, textDecoration: 'none', fontSize: 18, padding: 8 }}>ℹ️ About</a>
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

      {/* ==================== BANNER + LOGO (GÜZEL STİL) ==================== */}
      <div style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1e3a8a 0%, #5b21b6 100%)'
          : 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
        position: 'relative',
        padding: '80px 24px',
        marginBottom: 60,
        overflow: 'hidden'
      }}>
        {/* Arkaplan süslemeleri */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 300,
          height: 300,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 400,
          height: 400,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '50%'
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
          {/* Sol: Metin */}
          <div style={{ flex: 1 }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(255,255,255,0.2)',
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
              <span style={{ borderBottom: '4px solid white' }}>Yeni Adresi</span>
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
                backgroundColor: 'white',
                color: '#0ea5e9',
                padding: '14px 32px',
                borderRadius: 40,
                border: 'none',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}>
                🚀 Keşfetmeye Başla
              </button>
              <button style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '14px 32px',
                borderRadius: 40,
                border: '2px solid white',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                📦 Ürünleri Gör
              </button>
            </div>
          </div>

          {/* Sağ: Logo ve Fotoğraf */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20
          }}>
            {/* Banner Fotoğrafı */}
            <img 
              src="https://placehold.co/400x300/ffffff/0ea5e9?text=Digital+Products" 
              alt="Craftora Banner"
              style={{
                width: isMobile ? 280 : 350,
                borderRadius: 24,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                border: '4px solid white'
              }}
            />
            {/* Logo Kartı */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: '16px 24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <div style={{
                width: 60,
                height: 60,
                backgroundColor: '#0ea5e9',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: 32, color: 'white' }}>C</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: 20, fontWeight: 'bold', color: '#111827', margin: 0 }}>Craftora</h3>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>⭐ 4.9 • 10K+ Müşteri</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== ÜRÜNLER BÖLÜMÜ (4 ÜRÜN) ==================== */}
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
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '8px 20px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: 30, cursor: 'pointer', fontSize: 14 }}>Tümü</button>
            <button style={{ padding: '8px 20px', backgroundColor: 'transparent', color: currentColors.textSecondary, border: `1px solid ${currentColors.border}`, borderRadius: 30, cursor: 'pointer', fontSize: 14 }}>Tasarım</button>
            <button style={{ padding: '8px 20px', backgroundColor: 'transparent', color: currentColors.textSecondary, border: `1px solid ${currentColors.border}`, borderRadius: 30, cursor: 'pointer', fontSize: 14 }}>Geliştirme</button>
          </div>
        </div>

        {/* Ürün Grid - 4 ürün */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
          gap: 24
        }}>
          {products.map(product => (
            <div key={product.id} style={{
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

      {/* ==================== NEDEN CRAFTORA? ==================== */}
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

      {/* ==================== FOOTER ==================== */}
      <footer style={{ backgroundColor: isDarkMode ? '#0f172a' : '#1f2937', color: 'white', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
            gap: 48,
            marginBottom: 48
          }}>
            <div><h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#0ea5e9' }}>Craftora</h3><p style={{ color: '#9ca3af' }}>Dijital ürünlerin en kalitelisini uygun fiyatlarla sunuyoruz.</p></div>
            <div><h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Hızlı Linkler</h4><ul style={{ listStyle: 'none', padding: 0 }}><li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Ana Sayfa</a></li><li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Ürünler</a></li><li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Blog</a></li><li style={{ marginBottom: 8 }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Hakkımızda</a></li></ul></div>
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