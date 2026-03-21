// pages/CraftoraThemes.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CraftoraThemes = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const themesPerPage = 9; // Her sayfada 9 tema

  // Tüm temalar (marketplace) - 18 tema olsun ki 2 sayfa olsun
  const allThemes = [
    {
      id: 'dark-knight',
      name: 'Dark Knight',
      description: 'Modern ve şık karanlık tema, oyun ve teknoloji siteleri için ideal. Premium kalitede, yüksek performanslı e-ticaret teması.',
      price: 349,
      rating: 4.9,
      reviews: 256,
      sales: 1234,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format',
      category: 'Teknoloji',
      author: 'Craftora Studio',
      features: ['⚡ Dark Mode', '📱 Responsive', '🔍 SEO Optimized', '🚀 Hızlı', '🎨 Özelleştirilebilir'],
      colors: ['#000000', '#1a1a1a', '#ff0000', '#ffffff'],
      isPopular: true,
      isNew: false
    },
    {
      id: 'eco-mart',
      name: 'EcoMart',
      description: 'Sürdürülebilir ve çevre dostu e-ticaret teması. Doğal renkler ve organik tasarım ile fark yaratın.',
      price: 299,
      rating: 4.8,
      reviews: 128,
      sales: 892,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format',
      category: 'E-Ticaret',
      author: 'Craftora Studio',
      features: ['🌿 Eco-Friendly', '📱 Responsive', '✨ Modern', '☀️ Light Mode', '🎬 Animasyonlu'],
      colors: ['#5ff042', '#132210', '#f6f8f6', '#ffffff'],
      isPopular: true,
      isNew: true
    },
    {
      id: 'corporate-pro',
      name: 'Corporate Pro',
      description: 'Kurumsal şirketler için profesyonel ve güvenilir tema. Finans, danışmanlık ve hukuk firmaları için ideal.',
      price: 499,
      rating: 4.9,
      reviews: 342,
      sales: 567,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format',
      category: 'Kurumsal',
      author: 'Craftora Studio',
      features: ['🏢 Kurumsal', '🔒 Güvenli', '🌐 SSL Ready', '📋 GDPR Uyumlu', '🗺️ Çoklu Dil'],
      colors: ['#0a2472', '#0e6ba8', '#f2f4f8', '#212529'],
      isPopular: true,
      isNew: true
    },
    {
      id: 'minimal-white',
      name: 'Minimal White',
      description: 'Sade ve minimalist tasarım, her sektöre uygun. Temiz kod, hızlı yükleme ve maksimum performans.',
      price: 199,
      rating: 4.5,
      reviews: 67,
      sales: 345,
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format',
      category: 'Minimal',
      author: 'Craftora Studio',
      features: ['✨ Minimal', '⚡ Hızlı', '🧹 Temiz Kod', '🔍 SEO', '📱 Mobil Uyumlu'],
      colors: ['#ffffff', '#f8f9fa', '#212529', '#6c757d'],
      isPopular: false,
      isNew: false
    },
    {
      id: 'tech-hub',
      name: 'Tech Hub',
      description: 'Teknoloji ve yazılım şirketleri için modern kurumsal tema. Profesyonel ve etkileyici tasarım.',
      price: 399,
      rating: 4.9,
      reviews: 189,
      sales: 756,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format',
      category: 'Teknoloji',
      author: 'Craftora Studio',
      features: ['💻 Modern', '⚡ Hızlı', '📱 Responsive', '🔍 SEO', '👨‍💻 Developer Friendly'],
      colors: ['#0a1929', '#0ea5e9', '#ffffff', '#94a3b8'],
      isPopular: true,
      isNew: false
    },
    {
      id: 'startup-kit',
      name: 'Startup Kit',
      description: 'Startup\'lar ve girişimler için dinamik ve dönüştürücü tema. Yatırımcı çekmek için ideal.',
      price: 329,
      rating: 4.7,
      reviews: 98,
      sales: 423,
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format',
      category: 'Kurumsal',
      author: 'Craftora Studio',
      features: ['🚀 Dinamik', '📈 Dönüştürücü', '🎯 Landing Page', '📊 Analytics', '🧪 A/B Testing'],
      colors: ['#6366f1', '#312e81', '#ffffff', '#e0e7ff'],
      isPopular: false,
      isNew: true
    },
    {
      id: 'fashion-elite',
      name: 'Fashion Elite',
      description: 'Moda dünyası için özel tasarlanmış, premium ve şık tema. Lüks markalar için ideal.',
      price: 449,
      rating: 4.8,
      reviews: 156,
      sales: 234,
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format',
      category: 'Moda',
      author: 'Craftora Studio',
      features: ['👗 Moda', '✨ Şık', '📱 Responsive', '🎬 Animasyonlu', '🌈 Renkli'],
      colors: ['#d946ef', '#000000', '#ffffff', '#f43f5e'],
      isPopular: true,
      isNew: true
    },
    {
      id: 'architect-studio',
      name: 'Architect Studio',
      description: 'Mimarlık ve tasarım stüdyoları için görsel ağırlıklı, etkileyici tema. Portfolyo sunumu için ideal.',
      price: 379,
      rating: 4.9,
      reviews: 87,
      sales: 156,
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format',
      category: 'Minimal',
      author: 'Craftora Studio',
      features: ['🏛️ Mimari', '🖼️ Portfolyo', '📱 Responsive', '⚡ Hızlı', '🎨 Özelleştirilebilir'],
      colors: ['#2c3e50', '#34495e', '#ecf0f1', '#bdc3c7'],
      isPopular: false,
      isNew: true
    },
    {
      id: 'dark-knight-2',
      name: 'Dark Knight Pro',
      description: 'Dark Knight temasının profesyonel versiyonu. Daha fazla özellik, daha fazla esneklik.',
      price: 449,
      rating: 4.9,
      reviews: 89,
      sales: 345,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format',
      category: 'Teknoloji',
      author: 'Craftora Studio',
      features: ['⚡ Dark Mode', '📱 Responsive', '🔍 SEO Optimized', '🚀 Hızlı', '🎨 Özelleştirilebilir'],
      colors: ['#000000', '#1a1a1a', '#00ff00', '#ffffff'],
      isPopular: false,
      isNew: true
    },
    {
      id: 'eco-mart-pro',
      name: 'EcoMart Pro',
      description: 'EcoMart temasının gelişmiş versiyonu. Daha fazla ekolojik özellik.',
      price: 399,
      rating: 4.8,
      reviews: 67,
      sales: 234,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format',
      category: 'E-Ticaret',
      author: 'Craftora Studio',
      features: ['🌿 Eco-Friendly', '📱 Responsive', '✨ Modern', '☀️ Light Mode', '🎬 Animasyonlu'],
      colors: ['#5ff042', '#132210', '#f6f8f6', '#00ff00'],
      isPopular: false,
      isNew: true
    },
    {
      id: 'corporate-ultra',
      name: 'Corporate Ultra',
      description: 'Kurumsal şirketler için ultra lüks tema. En üst düzey özellikler.',
      price: 699,
      rating: 5.0,
      reviews: 45,
      sales: 123,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format',
      category: 'Kurumsal',
      author: 'Craftora Studio',
      features: ['🏢 Kurumsal', '🔒 Güvenli', '🌐 SSL Ready', '📋 GDPR Uyumlu', '🗺️ Çoklu Dil'],
      colors: ['#0a2472', '#0e6ba8', '#f2f4f8', '#ffd700'],
      isPopular: true,
      isNew: true
    },
    {
      id: 'minimal-black',
      name: 'Minimal Black',
      description: 'Minimal White temasının siyah versiyonu. Sade ve şık.',
      price: 229,
      rating: 4.6,
      reviews: 34,
      sales: 89,
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format',
      category: 'Minimal',
      author: 'Craftora Studio',
      features: ['✨ Minimal', '⚡ Hızlı', '🧹 Temiz Kod', '🔍 SEO', '📱 Mobil Uyumlu'],
      colors: ['#000000', '#1a1a1a', '#ffffff', '#6c757d'],
      isPopular: false,
      isNew: true
    },
    {
      id: 'tech-ultra',
      name: 'Tech Ultra',
      description: 'Teknoloji şirketleri için ultra modern tema.',
      price: 499,
      rating: 4.9,
      reviews: 78,
      sales: 267,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format',
      category: 'Teknoloji',
      author: 'Craftora Studio',
      features: ['💻 Modern', '⚡ Hızlı', '📱 Responsive', '🔍 SEO', '👨‍💻 Developer Friendly'],
      colors: ['#0a1929', '#0ea5e9', '#ffffff', '#ff0000'],
      isPopular: true,
      isNew: true
    },
    {
      id: 'startup-max',
      name: 'Startup Max',
      description: 'Startup\'lar için maksimum dönüşüm odaklı tema.',
      price: 399,
      rating: 4.7,
      reviews: 56,
      sales: 178,
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format',
      category: 'Kurumsal',
      author: 'Craftora Studio',
      features: ['🚀 Dinamik', '📈 Dönüştürücü', '🎯 Landing Page', '📊 Analytics', '🧪 A/B Testing'],
      colors: ['#6366f1', '#312e81', '#ffffff', '#00ff00'],
      isPopular: false,
      isNew: true
    },
    {
      id: 'fashion-luxury',
      name: 'Fashion Luxury',
      description: 'Lüks moda markaları için özel tasarım.',
      price: 599,
      rating: 4.9,
      reviews: 67,
      sales: 145,
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format',
      category: 'Moda',
      author: 'Craftora Studio',
      features: ['👗 Moda', '✨ Şık', '📱 Responsive', '🎬 Animasyonlu', '🌈 Renkli'],
      colors: ['#d946ef', '#000000', '#ffffff', '#ffd700'],
      isPopular: true,
      isNew: true
    },
    {
      id: 'architect-premium',
      name: 'Architect Premium',
      description: 'Mimarlık stüdyoları için premium portfolyo teması.',
      price: 449,
      rating: 4.9,
      reviews: 34,
      sales: 89,
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format',
      category: 'Minimal',
      author: 'Craftora Studio',
      features: ['🏛️ Mimari', '🖼️ Portfolyo', '📱 Responsive', '⚡ Hızlı', '🎨 Özelleştirilebilir'],
      colors: ['#2c3e50', '#34495e', '#ecf0f1', '#ffd700'],
      isPopular: false,
      isNew: true
    },
    {
      id: 'dark-knight-3',
      name: 'Dark Knight Ultra',
      description: 'Dark Knight serisinin en gelişmiş teması.',
      price: 599,
      rating: 5.0,
      reviews: 23,
      sales: 67,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format',
      category: 'Teknoloji',
      author: 'Craftora Studio',
      features: ['⚡ Dark Mode', '📱 Responsive', '🔍 SEO Optimized', '🚀 Hızlı', '🎨 Özelleştirilebilir'],
      colors: ['#000000', '#1a1a1a', '#ff0000', '#00ff00'],
      isPopular: false,
      isNew: true
    },
    {
      id: 'eco-mart-ultra',
      name: 'EcoMart Ultra',
      description: 'EcoMart serisinin en çevreci teması.',
      price: 499,
      rating: 4.9,
      reviews: 45,
      sales: 98,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format',
      category: 'E-Ticaret',
      author: 'Craftora Studio',
      features: ['🌿 Eco-Friendly', '📱 Responsive', '✨ Modern', '☀️ Light Mode', '🎬 Animasyonlu'],
      colors: ['#5ff042', '#132210', '#f6f8f6', '#00ff00'],
      isPopular: false,
      isNew: true
    }
  ];

  const categories = ['Tümü', 'Teknoloji', 'Kurumsal', 'E-Ticaret', 'Minimal', 'Moda'];
  
  // Filtreleme
  const filteredThemes = allThemes.filter(theme => {
    if (selectedCategory !== 'all' && theme.category !== selectedCategory) return false;
    return true;
  });

  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(filteredThemes.length / themesPerPage);
  const indexOfLastTheme = currentPage * themesPerPage;
  const indexOfFirstTheme = indexOfLastTheme - themesPerPage;
  const currentThemes = filteredThemes.slice(indexOfFirstTheme, indexOfLastTheme);

  // Sayfa değiştirme
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header - Glassmorphism Koyu */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '16px 32px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(59,130,246,0.3)'
            }}>
              <span style={{ fontSize: '24px', color: 'white' }}>◆</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 600, color: 'white' }}>Craftora Themes</span>
          </div>
          
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '15px' }}>Temalar</a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '15px' }}>Fiyatlandırma</a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '15px' }}>Belgeler</a>
            <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '15px' }}>Destek</a>
            <button style={{
              padding: '8px 24px',
              background: 'transparent',
              border: '1px solid #3b82f6',
              borderRadius: '30px',
              color: '#3b82f6',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              Giriş Yap
            </button>
            <button style={{
              padding: '8px 24px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              borderRadius: '30px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(59,130,246,0.3)'
            }}>
              Kayıt Ol
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section - Kurumsal */}
      <div style={{
        position: 'relative',
        padding: '100px 24px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Arkaplan Efektleri - Daha Soft */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 15s ease-in-out infinite reverse'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{
            padding: '8px 20px',
            background: 'rgba(59,130,246,0.1)',
            borderRadius: '30px',
            color: '#3b82f6',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '1px',
            marginBottom: '32px',
            display: 'inline-block',
            border: '1px solid rgba(59,130,246,0.2)'
          }}>
            ✦ PREMIUM TEMALAR
          </span>
          
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 64px)',
            fontWeight: 700,
            margin: '0 0 24px',
            lineHeight: 1.2,
            color: 'white'
          }}>
            Profesyonel İşletmeler İçin<br />
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Premium Tema Çözümleri</span>
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.7
          }}>
            150+ profesyonel tema, sınırsız özelleştirme, 7/24 destek.
            İşletmeniz için mükemmel çözümü bulun.
          </p>

          {/* Arama */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            gap: '12px',
            background: '#1e293b',
            padding: '8px',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <input
              type="text"
              placeholder="Tema ara (ör: Corporate, Startup, Minimal...)"
              style={{
                flex: 1,
                padding: '16px 24px',
                border: 'none',
                background: '#0f172a',
                borderRadius: '40px',
                fontSize: '15px',
                color: 'white',
                outline: 'none'
              }}
            />
            <button style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none',
              borderRadius: '40px',
              fontSize: '15px',
              fontWeight: 600,
              color: 'white',
              cursor: 'pointer'
            }}>
              Ara
            </button>
          </div>

          {/* İstatistikler */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '80px',
            marginTop: '80px'
          }}>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 700, color: 'white' }}>150+</div>
              <div style={{ fontSize: '16px', color: '#64748b' }}>Premium Tema</div>
            </div>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 700, color: 'white' }}>12k+</div>
              <div style={{ fontSize: '16px', color: '#64748b' }}>Mutlu Müşteri</div>
            </div>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 700, color: 'white' }}>4.9</div>
              <div style={{ fontSize: '16px', color: '#64748b' }}>Ortalama Puan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          background: '#1e293b',
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat === 'Tümü' ? 'all' : cat);
                  setCurrentPage(1); // Filtre değişince 1. sayfaya dön
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  border: 'none',
                  background: (cat === 'Tümü' && selectedCategory === 'all') || selectedCategory === cat
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    : '#0f172a',
                  color: (cat === 'Tümü' && selectedCategory === 'all') || selectedCategory === cat
                    ? 'white'
                    : '#94a3b8',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <select style={{
            padding: '10px 24px',
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#0f172a',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer'
          }}>
            <option value="all">Fiyata Göre Sırala</option>
            <option value="asc">Artan Fiyat</option>
            <option value="desc">Azalan Fiyat</option>
          </select>
        </div>

        {/* Tema Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px',
          paddingBottom: '40px'
        }}>
          {currentThemes.map((theme) => (
            <div
              key={theme.id}
              onMouseEnter={() => setHoveredId(theme.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: '#1e293b',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease',
                transform: hoveredId === theme.id ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredId === theme.id 
                  ? '0 20px 40px rgba(0,0,0,0.3)'
                  : '0 10px 20px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/theme-preview/${theme.id}`)}
            >
              {/* Resim Alanı */}
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img
                  src={theme.image}
                  alt={theme.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    transform: hoveredId === theme.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
                
                {/* Badgeler */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  {theme.isNew && (
                    <span style={{
                      padding: '6px 16px',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      borderRadius: '30px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'white'
                    }}>
                      YENİ
                    </span>
                  )}
                  {theme.isPopular && (
                    <span style={{
                      padding: '6px 16px',
                      background: '#ef4444',
                      borderRadius: '30px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'white'
                    }}>
                      POPÜLER
                    </span>
                  )}
                </div>
              </div>

              {/* İçerik */}
              <div style={{ padding: '24px' }}>
                {/* Başlık ve Puan */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      margin: 0,
                      color: 'white'
                    }}>
                      {theme.name}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: '4px 0 0'
                    }}>
                      {theme.author}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#fbbf24' }}>★</span>
                    <span style={{ color: 'white' }}>{theme.rating}</span>
                  </div>
                </div>

                {/* Açıklama */}
                <p style={{
                  fontSize: '14px',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  marginBottom: '16px'
                }}>
                  {theme.description.substring(0, 100)}...
                </p>

                {/* Renkler */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    {theme.colors.map((color, i) => (
                      <div
                        key={i}
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: color,
                          borderRadius: '6px',
                          border: '2px solid rgba(255,255,255,0.1)'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Özellikler */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  {theme.features.slice(0, 3).map((feature, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '4px 12px',
                        background: '#0f172a',
                        borderRadius: '30px',
                        fontSize: '11px',
                        color: '#94a3b8'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Fiyat ve Buton */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '16px'
                }}>
                  <div>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: 'white'
                    }}>
                      ${theme.price}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCartItems([...cartItems, theme.id]);
                    }}
                    style={{
                      padding: '10px 24px',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      border: 'none',
                      borderRadius: '30px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sayfalama - Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            padding: '40px 0 60px'
          }}>
            {/* Önceki Buton */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              style={{
                padding: '12px 20px',
                background: currentPage === 1 ? '#1e293b' : '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: currentPage === 1 ? '#475569' : 'white',
                fontSize: '14px',
                fontWeight: 500,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              <span>←</span>
              Önceki
            </button>

            {/* Sayfa Numaraları */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                style={{
                  width: '44px',
                  height: '44px',
                  background: currentPage === page 
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    : '#0f172a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: currentPage === page ? 'white' : '#94a3b8',
                  fontSize: '15px',
                  fontWeight: currentPage === page ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {page}
              </button>
            ))}

            {/* Sonraki Buton */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              style={{
                padding: '12px 20px',
                background: currentPage === totalPages ? '#1e293b' : '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: currentPage === totalPages ? '#475569' : 'white',
                fontSize: '14px',
                fontWeight: 500,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              Sonraki
              <span>→</span>
            </button>
          </div>
        )}

        {/* Sayfa Bilgisi */}
        {totalPages > 1 && (
          <div style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: '14px',
            marginTop: '-20px',
            paddingBottom: '40px'
          }}>
            Sayfa {currentPage} / {totalPages} • Toplam {filteredThemes.length} tema
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: '#0f172a',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '60px 24px 40px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '60px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '20px', color: 'white' }}>◆</span>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>Craftora Themes</span>
            </div>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>
              Profesyonel işletmeler için premium tema çözümleri. 150+ tema, sınırsız özelleştirme.
            </p>
          </div>
          
          {['Ürünler', 'Şirket', 'Destek'].map(section => (
            <div key={section}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '24px' }}>{section}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[1,2,3,4].map(i => (
                  <li key={i} style={{ marginBottom: '12px' }}>
                    <a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>
                      Link {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div style={{
          maxWidth: '1280px',
          margin: '60px auto 0',
          paddingTop: '40px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px'
        }}>
          © 2024 Craftora Themes. Tüm hakları saklıdır.
        </div>
      </footer>

      {/* Animasyonlar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(5deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(-5deg);
          }
        }
        
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default CraftoraThemes;