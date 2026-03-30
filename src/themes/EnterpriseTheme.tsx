import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../server/Gin/theme.hook';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';

// ============================================================
// PROPS
// ============================================================

interface EnterpriseThemeProps {
  shopId: string;
  isEditing?: boolean;
  // YENİ: meta objesi taşıyor (id + currentData)
  onElementClick?: (
    elementType: string,
    meta?: { id?: number; currentData?: Record<string, string> }
  ) => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

// ============================================================
// HELPER: editing modunda hover + tıklama stili uygular
// Her elemanda tekrar tekrar yazmak yerine bunu spread et
// ============================================================
const makeEditable = (
  elementType: string,
  isEditing: boolean,
  onElementClick: EnterpriseThemeProps['onElementClick'],
  meta?: { id?: number; currentData?: Record<string, string> },
  accentColor: string = '#3b82f6'
) => {
  if (!isEditing) return {};
  return {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onElementClick?.(elementType, meta);
    },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.outline = `2px dashed ${accentColor}`;
      e.currentTarget.style.backgroundColor = `${accentColor}18`;
      e.currentTarget.style.cursor = 'pointer';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.outline = 'none';
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.cursor = 'default';
    },
  };
};

// ============================================================
// COMPONENT
// ============================================================
const EnterpriseTheme: React.FC<EnterpriseThemeProps> = ({
  shopId,
  isEditing = false,
  onElementClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(3);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<string>('home');

  const {
    settings,
    sections,
    menus,
    isLoading,
    error,
    isEditMode,
    setActiveSection,
  } = useTheme(shopId);

  const basePath = '/theme/enterprise';

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith(`${basePath}/product/`)) setCurrentPage('product-detail');
    else if (path === basePath) setCurrentPage('home');
    else if (path === `${basePath}/blog`) setCurrentPage('blog');
    else if (path === `${basePath}/products`) setCurrentPage('products');
    else if (path === `${basePath}/contact`) setCurrentPage('contact');
  }, [location.pathname]);

  const headerMenu = menus?.find(m => m.location === 'header');
  const navLinks = headerMenu?.items?.map(item => item.title) || ['Ana Sayfa', 'Ürünler', 'Blog', 'İletişim'];

  const heroSection = sections?.find(s => s.section_type === 'hero');
  const heroContent = heroSection?.content as any;

  const products: Product[] = [
    { id: 1, name: 'Premium Deri Sırt Çantası', price: 1899, oldPrice: 2499, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop', rating: 5, isNew: true },
    { id: 2, name: 'Minimalist Kol Saati', price: 799, oldPrice: 1199, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop', rating: 4, isFeatured: true },
    { id: 3, name: 'Akıllı Spor Ayakkabı', price: 1599, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop', rating: 5, isNew: true },
    { id: 4, name: 'Güneş Gözlüğü Koleksiyon', price: 1299, oldPrice: 1799, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop', rating: 4 },
    { id: 5, name: 'Kablosuz Kulaklık Pro', price: 2499, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', rating: 5, isFeatured: true },
    { id: 6, name: 'Laptop Çantası Deri', price: 899, oldPrice: 1199, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop', rating: 4 },
  ];

  const featuredProducts = products.filter(p => p.isFeatured);

  const handleAddToCart = (productName: string) => {
    setCartCount(prev => prev + 1);
    alert(`${productName} sepete eklendi!`);
  };

  const lightColors = {
    primary: '#111827', accent: '#3b82f6', background: '#ffffff',
    backgroundAlt: '#f9fafb', textPrimary: '#111827', textSecondary: '#6b7280',
    textMuted: '#9ca3af', border: '#eef2f6', cardBg: '#ffffff', heroBg: '#fafafc',
  };
  const darkColors = {
    primary: '#f9fafb', accent: '#60a5fa', background: '#111827',
    backgroundAlt: '#1f2937', textPrimary: '#f9fafb', textSecondary: '#9ca3af',
    textMuted: '#6b7280', border: '#374151', cardBg: '#1f2937', heroBg: '#1f2937',
  };
  const colors = isDarkMode ? darkColors : (settings?.colors || lightColors);

  const navigateTo = (pageKey: string, productId?: number) => {
    setCurrentPage(pageKey);
    if (pageKey === 'home') navigate(basePath);
    else if (pageKey === 'product-detail' && productId) navigate(`${basePath}/product/${productId}`);
    else navigate(`${basePath}/${pageKey}`);
    setMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: `3px solid ${colors.textMuted}`, borderTopColor: colors.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ marginTop: '16px', color: colors.textSecondary }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <p style={{ color: '#ef4444' }}>Bir hata oluştu: {error}</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      transition: 'background-color 0.3s ease',
    }}>

      {/* ========== HEADER ========== */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: colors.background,
        borderBottom: `1px solid ${colors.border}`,
        backdropFilter: 'blur(8px)', transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

            {/* ── LOGO ── tıklanınca sidebar açılır */}
            <div
              onClick={(e) => {
                if (isEditing) {
                  e.stopPropagation();
                  onElementClick?.('header-logo', {
                    currentData: {
                      logoText: settings?.logoText || 'SERLAM',
                      logoSubText: settings?.logoSubText || 'KANKAM',
                    },
                  });
                } else {
                  navigateTo('home');
                }
              }}
              onMouseEnter={(e) => {
                if (isEditing) {
                  e.currentTarget.style.outline = `2px dashed ${colors.accent}`;
                  e.currentTarget.style.cursor = 'pointer';
                } else {
                  e.currentTarget.style.opacity = '0.8';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.outline = 'none';
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.cursor = 'default';
              }}
              style={{ display: 'flex', alignItems: 'baseline', gap: '4px', cursor: 'pointer', transition: 'opacity 0.2s' }}
            >
              <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', color: colors.textPrimary }}>
                {settings?.logoText || 'SERLAM'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: colors.textMuted }}>
                {settings?.logoSubText || 'KANKAM'}
              </span>
            </div>

            {/* ── NAV LİNKLERİ ── tıklanınca sidebar açılır */}
            <nav style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
              {navLinks.map((link, idx) => {
                let pageKey = 'home';
                if (link === 'Ürünler') pageKey = 'products';
                if (link === 'Blog') pageKey = 'blog';
                if (link === 'İletişim') pageKey = 'contact';
                const isActive = currentPage === pageKey;

                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      if (isEditing) {
                        e.stopPropagation();
                        onElementClick?.('header-nav', {
                          id: headerMenu?.id,
                          currentData: {
                            nav1: navLinks[0] || '',
                            nav2: navLinks[1] || '',
                            nav3: navLinks[2] || '',
                            nav4: navLinks[3] || '',
                          },
                        });
                      } else {
                        navigateTo(pageKey);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (isEditing) {
                        e.currentTarget.style.outline = `2px dashed ${colors.accent}`;
                      } else if (!isActive) {
                        e.currentTarget.style.color = colors.textPrimary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.outline = 'none';
                      if (!isActive && !isEditing) e.currentTarget.style.color = colors.textSecondary;
                    }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: isActive ? colors.accent : colors.textSecondary,
                      fontSize: '15px', fontWeight: isActive ? 600 : 500,
                      padding: '8px 0', position: 'relative', transition: 'color 0.2s ease',
                    }}
                  >
                    {link}
                    {isActive && !isEditing && (
                      <span style={{ position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '2px', backgroundColor: colors.accent, borderRadius: '2px' }} />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sağ ikonlar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textSecondary, padding: '8px', borderRadius: '50%', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                {isDarkMode ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                )}
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textSecondary, padding: '8px', borderRadius: '50%', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textSecondary, padding: '8px', borderRadius: '50%', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                {cartCount > 0 && <span style={{ position: 'absolute', top: '0px', right: '0px', backgroundColor: colors.accent, color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========== MAIN ========== */}
      <main>
        {currentPage === 'home' && (
          <>
            {/* ── HERO ── */}
            <section style={{ backgroundColor: colors.heroBg, borderBottom: `1px solid ${colors.border}`, padding: '60px 24px' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '60px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>

                    {/* HERO BADGE */}
                    <div
                      {...makeEditable('hero-badge', isEditing, onElementClick, {
                        id: heroSection?.id,
                        currentData: { badge: heroContent?.badge || 'YAZ SEZONU FIRSATI' },
                      }, colors.accent)}
                      style={{
                        display: 'inline-block', backgroundColor: colors.border,
                        padding: '6px 16px', borderRadius: '40px', fontSize: '13px',
                        fontWeight: 500, color: colors.textSecondary, marginBottom: '24px',
                        cursor: isEditing ? 'pointer' : 'default', transition: 'all 0.2s',
                      }}
                    >
                      ✨ {heroContent?.badge || 'YAZ SEZONU FIRSATI'}
                    </div>

                    {/* HERO BAŞLIK */}
                    <h1
                      {...makeEditable('hero-title', isEditing, onElementClick, {
                        id: heroSection?.id,
                        currentData: {
                          title: heroContent?.title || 'Stilinle',
                          titleHighlight: heroContent?.titleHighlight || 'Fark Yarat',
                        },
                      }, colors.accent)}
                      style={{
                        fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800,
                        color: colors.textPrimary, margin: '0 0 20px 0',
                        lineHeight: 1.2, letterSpacing: '-0.02em',
                        cursor: isEditing ? 'pointer' : 'default', transition: 'all 0.2s',
                      }}
                    >
                      {heroContent?.title || 'Stilinle'} <br />
                      <span style={{ color: colors.accent }}>
                        {heroContent?.titleHighlight || 'Fark Yarat'}
                      </span>
                    </h1>

                    {/* HERO ALT METİN */}
                    <p
                      {...makeEditable('hero-subtitle', isEditing, onElementClick, {
                        id: heroSection?.id,
                        currentData: { subtitle: heroContent?.subtitle || 'En yeni koleksiyonlar ve özel indirimler seni bekliyor.' },
                      }, colors.accent)}
                      style={{
                        fontSize: '16px', color: colors.textSecondary, lineHeight: 1.6,
                        marginBottom: '32px', maxWidth: '500px',
                        cursor: isEditing ? 'pointer' : 'default', transition: 'all 0.2s',
                      }}
                    >
                      {heroContent?.subtitle || 'En yeni koleksiyonlar ve özel indirimler seni bekliyor.'}
                    </p>

                    {/* HERO BUTONLARI */}
                    <div
                      {...makeEditable('hero-button', isEditing, onElementClick, {
                        id: heroSection?.id,
                        currentData: {
                          buttonText: heroContent?.buttonText || 'Alışverişe Başla',
                          secondaryButtonText: heroContent?.secondaryButtonText || 'Koleksiyonu İncele',
                        },
                      }, colors.accent)}
                      style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
                    >
                      <button
                        onClick={(e) => { if (!isEditing) { e.stopPropagation(); navigateTo('products'); } }}
                        style={{ backgroundColor: colors.textPrimary, color: colors.background, border: 'none', padding: '14px 36px', borderRadius: '40px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => { if (!isEditing) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        {heroContent?.buttonText || 'Alışverişe Başla'} →
                      </button>
                      <button
                        onClick={(e) => { if (!isEditing) { e.stopPropagation(); navigateTo('blog'); } }}
                        style={{ backgroundColor: 'transparent', color: colors.textSecondary, border: `1px solid ${colors.border}`, padding: '14px 36px', borderRadius: '40px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => { if (!isEditing) { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.color = colors.accent; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textSecondary; }}
                      >
                        {heroContent?.secondaryButtonText || 'Koleksiyonu İncele'}
                      </button>
                    </div>
                  </div>

                  {/* HERO GÖRSEL */}
                  <div
                    {...makeEditable('hero-image', isEditing, onElementClick, {
                      id: heroSection?.id,
                      currentData: { imageUrl: heroContent?.imageUrl || '' },
                    }, colors.accent)}
                    style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: '280px', cursor: isEditing ? 'pointer' : 'default' }}
                  >
                    <div style={{ width: '280px', height: '280px', borderRadius: '50%', backgroundColor: colors.background, boxShadow: '0 20px 40px -20px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${colors.border}` }}>
                      <img
                        src={heroContent?.imageUrl || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop'}
                        alt="Hero"
                        style={{ width: '220px', height: '220px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Kategoriler */}
            <section style={{ padding: '80px 24px', backgroundColor: colors.background }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.accent, letterSpacing: '2px', textTransform: 'uppercase' }}>KATEGORİLER</span>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: colors.textPrimary, marginTop: '12px', marginBottom: '48px' }}>Keşfetmeye Hazır Ol</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                  {[
                    { img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop', title: 'Yeni Sezon Giyim', desc: "%20'ye varan indirim" },
                    { img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=400&fit=crop', title: 'Aksesuar Dünyası', desc: 'Şık detaylar' },
                    { img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=400&fit=crop', title: 'Spor & Günlük', desc: 'Konforu keşfet' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', cursor: 'pointer', transition: 'transform 0.4s ease' }} onMouseEnter={(e) => { if (!isEditing) e.currentTarget.style.transform = 'translateY(-8px)'; }} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                      <img src={item.img} alt={item.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 24px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: 'white' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{item.title}</h3>
                        <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.9 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Ürünler */}
            <section style={{ padding: '80px 24px', backgroundColor: colors.backgroundAlt }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: colors.accent, letterSpacing: '2px' }}>EN ÇOK SATANLAR</span>
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 32px)', fontWeight: 700, color: colors.textPrimary, marginTop: '8px' }}>Popüler Ürünler</h2>
                  </div>
                  <button onClick={() => navigateTo('products')} style={{ background: 'none', border: 'none', color: colors.accent, fontWeight: 500, cursor: 'pointer', fontSize: '14px' }}>Tümünü Gör →</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                  {products.slice(0, 4).map((product) => (
                    <div key={product.id} style={{ backgroundColor: colors.cardBg, borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 30px -12px rgba(0,0,0,0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ position: 'relative', backgroundColor: colors.backgroundAlt }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                        {product.isNew && <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: colors.accent, color: 'white', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '30px' }}>Yeni</span>}
                        {product.oldPrice && <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#ef4444', color: 'white', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '30px' }}>%{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}</span>}
                      </div>
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.textPrimary, margin: '0 0 8px 0' }}>{product.name}</h3>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                          {[...Array(5)].map((_, i) => <span key={i} style={{ color: i < product.rating ? '#fbbf24' : '#e5e7eb', fontSize: '12px' }}>★</span>)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <span style={{ fontSize: '20px', fontWeight: 700, color: colors.textPrimary }}>₺{product.price.toLocaleString()}</span>
                          {product.oldPrice && <span style={{ fontSize: '13px', color: colors.textMuted, textDecoration: 'line-through' }}>₺{product.oldPrice.toLocaleString()}</span>}
                        </div>
                        <button onClick={() => handleAddToCart(product.name)} style={{ width: '100%', backgroundColor: colors.textPrimary, color: colors.background, border: 'none', padding: '12px', borderRadius: '40px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accent} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.textPrimary}>
                          Sepete Ekle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Kampanya */}
            <section style={{ padding: '80px 24px', backgroundColor: colors.background }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: colors.border, padding: '6px 16px', borderRadius: '40px', marginBottom: '24px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: colors.textSecondary }}>Sınırlı Süreli Fırsat</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(28px, 4vw, 34px)', fontWeight: 700, color: colors.textPrimary, marginBottom: '20px', lineHeight: 1.3 }}>Serlam Kankam Özel <br />Koleksiyonu</h2>
                    <p style={{ fontSize: '16px', color: colors.textSecondary, lineHeight: 1.6, marginBottom: '32px' }}>Elit tasarımlar, özel fiyatlar ve yalnızca üyelerimize özel avantajlar. İlk alışverişinde ek %10 indirim fırsatını kaçırma.</p>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                      {['Ücretsiz kargo ve iade garantisi', 'Güvenli ödeme ve taksit seçenekleri', 'Müşteri memnuniyeti odaklı destek'].map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: colors.textSecondary }}>
                          <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {item}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => navigateTo('products')} style={{ backgroundColor: colors.textPrimary, color: colors.background, border: 'none', padding: '14px 36px', borderRadius: '40px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.accent; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.textPrimary; e.currentTarget.style.transform = 'translateY(0)'; }}>Hemen Katıl →</button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=500&fit=crop" alt="Kampanya" style={{ width: '100%', borderRadius: '24px' }} />
                  </div>
                </div>
              </div>
            </section>

            {/* Editörün Seçtikleri */}
            {featuredProducts.length > 0 && (
              <section style={{ padding: '60px 24px', backgroundColor: colors.backgroundAlt }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: 700, color: colors.textPrimary }}>Editörün Seçtikleri</h2>
                  <p style={{ color: colors.textSecondary, marginTop: '8px', marginBottom: '40px' }}>Stil sahibi herkes için özel tasarımlar</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '700px', margin: '0 auto' }}>
                    {featuredProducts.map((product) => (
                      <div key={product.id} style={{ display: 'flex', backgroundColor: colors.cardBg, borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        <div style={{ padding: '16px', flex: 1, textAlign: 'left' }}>
                          <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, margin: '0 0 6px 0' }}>{product.name}</h3>
                          <p style={{ fontSize: '18px', fontWeight: 700, color: colors.accent, margin: '0 0 12px 0' }}>₺{product.price.toLocaleString()}</p>
                          <button onClick={() => handleAddToCart(product.name)} style={{ backgroundColor: colors.textPrimary, color: colors.background, border: 'none', padding: '6px 16px', borderRadius: '30px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accent} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.textPrimary}>Hemen Al</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {currentPage === 'blog' && (
          <BlogPage
            settings={settings}
            isDarkMode={isDarkMode}
            isEditing={isEditing}
            onElementClick={onElementClick}
          />
        )}
        {currentPage === 'contact' && <ContactPage settings={settings} shopId={shopId} isDarkMode={isDarkMode} />}
        {currentPage === 'products' && <ProductsPage settings={settings} products={products} handleAddToCart={handleAddToCart} isDarkMode={isDarkMode} />}
        {currentPage === 'product-detail' && <ProductDetail settings={settings} products={products} handleAddToCart={handleAddToCart} isDarkMode={isDarkMode} />}
      </main>

      {/* ========== FOOTER ========== */}
      <footer style={{ backgroundColor: '#111827', color: '#9ca3af', padding: '60px 24px 40px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '50px' }}>

            {/* FOOTER MARKA - tıklanabilir */}
            <div
              {...makeEditable('footer-text', isEditing, onElementClick, {
                currentData: {
                  footerBrand: settings?.footerBrand || 'SERLAMKANKAM',
                  footerDesc: settings?.footerDesc || 'Modern alışverişin adresi, kaliteli ve şık ürünler sizin için seçildi.',
                  footerCopyright: settings?.footerCopyright || '',
                },
              })}
              style={{ cursor: isEditing ? 'pointer' : 'default' }}
            >
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
                SERLAM<span style={{ color: '#6b7280' }}>KANKAM</span>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '20px', color: '#9ca3af' }}>
                {settings?.footerDesc || 'Modern alışverişin adresi, kaliteli ve şık ürünler sizin için seçildi.'}
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                {['📘', '📷', '🐦'].map((icon, i) => (
                  <a key={i} href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '20px' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>{icon}</a>
                ))}
              </div>
            </div>

            {/* FOOTER LİNKLER - tıklanabilir */}
            <div
              {...makeEditable('footer-links', isEditing, onElementClick, {
                currentData: {
                  footerLink1: 'Yeni Ürünler',
                  footerLink2: 'Kampanyalar',
                  footerLink3: 'Hediye Kartı',
                  footerLink4: 'Outlet',
                },
              })}
              style={{ cursor: isEditing ? 'pointer' : 'default' }}
            >
              <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '20px', fontSize: '16px' }}>Alışveriş</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Yeni Ürünler', 'Kampanyalar', 'Hediye Kartı', 'Outlet'].map((link, i) => (
                  <li key={i} style={{ marginBottom: '12px' }}>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '20px', fontSize: '16px' }}>Destek</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Yardım Merkezi', 'İade ve Değişim', 'Kargo Takibi', 'SSS'].map((link, i) => (
                  <li key={i} style={{ marginBottom: '12px' }}>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }} onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '20px', fontSize: '16px' }}>Bülten</h4>
              <p style={{ fontSize: '13px', marginBottom: '16px', color: '#9ca3af' }}>Kampanya ve yeniliklerden ilk sen haberdar ol.</p>
              <div style={{ display: 'flex' }}>
                <input type="email" placeholder="E-posta adresiniz" style={{ flex: 1, padding: '12px 16px', backgroundColor: '#1f2937', border: 'none', borderRadius: '30px 0 0 30px', color: 'white', fontSize: '13px', outline: 'none' }} />
                <button style={{ backgroundColor: 'white', color: '#111827', border: 'none', padding: '0 24px', borderRadius: '0 30px 30px 0', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#111827'; }}>Abone Ol</button>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1f2937', paddingTop: '30px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
            © {new Date().getFullYear()} Serlam Kankam. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) { nav { display: none !important; } }
      `}</style>
    </div>
  );
};

export default EnterpriseTheme;