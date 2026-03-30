// config/MyShops.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const MyShopsPage = ({ colors }: MyShopsPageProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Mağaza Ayarları
  const [magzaAdi, setMagzaAdi] = useState('Craftora Mağazam');
  const [magzaAciklama, setMagzaAciklama] = useState('En kaliteli dijital ürünler burada!');
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const HandleSumbitThemes = () => {
    navigate('/seller-themes');
  }

  // Tema ayarları (rastgele tema)
  const [aktifTema] = useState({
    id: 'dark-knight',
    adi: 'Dark Knight',
    renkler: {
      ana_renk: '#000000',
      arkaplan: '#1a1a1a',
      yazi_renk: '#ffffff'
    },
    urunler: {
      sayfa_basi_urun: 12,
      gorunum: 'grid'
    }
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // Banner yükleme
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

  // Logo yükleme
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



  return (
    <div>
      {/* HEADER - Mağazam Başlık */}
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
            <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: 32 }}>store</span>
            Mağaza Ayarları
          </h2>
          <p style={{ fontSize: 14, color: colors.textSecondary, margin: '4px 0 0' }}>
            Mağazanın genel görünümünü ve ayarlarını düzenle
          </p>
        </div>

        {/* MAĞAZAMI GÖRÜNTÜLE BUTONU */}
        <button
          onClick={HandleSumbitThemes}
          style={{
            padding: '14px 32px',
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
          <span className="material-icons-round">visibility</span>
          MAĞAZAMI GÖRÜNTÜLE
        </button>
      </div>

      {/* ANA İÇERİK - Tüm ayarlar alt alta */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        padding: isMobile ? 20 : 32
      }}>
        
        {/* 1. MAĞAZA BİLGİLERİ */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.text,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span className="material-icons-round" style={{ color: '#0ea5e9' }}>info</span>
            Mağaza Bilgileri
          </h3>

          {/* Mağaza Adı */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 8
            }}>
              Mağaza Adı <span style={{ color: '#ef4444' }}>*</span>
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
              Bu isim mağazanın her yerinde görünecek
            </p>
          </div>

          {/* Mağaza Açıklaması */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 8
            }}>
              Mağaza Açıklaması
            </label>
            <textarea
              value={magzaAciklama}
              onChange={(e) => setMagzaAciklama(e.target.value)}
              placeholder="Mağazanı kısaca tanıt"
              rows={4}
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
        </div>

        {/* 2. LOGO VE BANNER */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.text,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span className="material-icons-round" style={{ color: '#0ea5e9' }}>image</span>
            Logo & Banner
          </h3>

          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 12
            }}>
              Logo
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              flexWrap: 'wrap'
            }}>
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
                  <span className="material-icons-round" style={{ fontSize: 40, color: colors.textSecondary }}>add_photo_alternate</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  style={{
                    padding: '10px 24px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 30,
                    color: colors.text,
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}
                >
                  Logo Seç
                </label>
                <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
                  Önerilen boyut: 200x200px
                </p>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 12
            }}>
              Banner
            </label>
            <div style={{
              height: 200,
              backgroundColor: colors.bg,
              borderRadius: 16,
              border: `2px dashed ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              marginBottom: 12
            }}>
              {bannerPreview ? (
                <img src={bannerPreview} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <span className="material-icons-round" style={{ fontSize: 48, color: colors.textSecondary, marginBottom: 8 }}>panorama</span>
                  <p style={{ fontSize: 14, color: colors.textSecondary }}>Banner yüklemek için tıkla</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              style={{ display: 'none' }}
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              style={{
                padding: '10px 24px',
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 30,
                color: colors.text,
                fontSize: 14,
                cursor: 'pointer',
                display: 'inline-block'
              }}
            >
              Banner Seç
            </label>
            <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
              Önerilen boyut: 1920x400px
            </p>
          </div>
        </div>

        {/* 3. TEMA AYARLARI (Rastgele tema) */}
        <div style={{ marginBottom: 40 }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 600,
            color: colors.text,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span className="material-icons-round" style={{ color: '#0ea5e9' }}>palette</span>
            Tema Ayarları
          </h3>

          {/* Aktif Tema Bilgisi */}
          <div style={{
            backgroundColor: colors.bg,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 12, color: colors.textSecondary }}>AKTİF TEMA</span>
                <h4 style={{ fontSize: 20, fontWeight: 600, color: colors.text, margin: '4px 0 0' }}>
                  {aktifTema.adi}
                </h4>
              </div>
              <button style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: 30,
                color: colors.text,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span className="material-icons-round" style={{ fontSize: 18 }}>color_lens</span>
                Temalar
              </button>
            </div>

            {/* Renk Önizleme */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Ana Renk</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, backgroundColor: aktifTema.renkler.ana_renk, borderRadius: 6 }} />
                  <span style={{ fontSize: 13, color: colors.text }}>{aktifTema.renkler.ana_renk}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Arkaplan</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, backgroundColor: aktifTema.renkler.arkaplan, borderRadius: 6 }} />
                  <span style={{ fontSize: 13, color: colors.text }}>{aktifTema.renkler.arkaplan}</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Yazı Rengi</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, backgroundColor: aktifTema.renkler.yazi_renk, borderRadius: 6 }} />
                  <span style={{ fontSize: 13, color: colors.text }}>{aktifTema.renkler.yazi_renk}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tema Önizleme */}
          <div style={{
            height: 250,
            background: `linear-gradient(135deg, ${aktifTema.renkler.ana_renk} 0%, ${aktifTema.renkler.arkaplan} 100%)`,
            borderRadius: 16,
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${colors.border}`
          }}>
            <div style={{
              position: 'absolute',
              top: 20,
              left: 20,
              right: 20,
              display: 'flex',
              justifyContent: 'space-between',
              color: aktifTema.renkler.yazi_renk
            }}>
              <span style={{ fontSize: 24, fontWeight: 'bold' }}>{magzaAdi}</span>
              <div style={{ display: 'flex', gap: 10 }}>
                <span>🏠</span>
                <span>🛒</span>
                <span>👤</span>
              </div>
            </div>
            <div style={{
              position: 'absolute',
              bottom: 30,
              left: 30,
              color: aktifTema.renkler.yazi_renk
            }}>
              <h4>Özel Teklifler</h4>
              <p>%50'ye varan indirimler</p>
            </div>
          </div>

          {/* Ürün Ayarları */}
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 16 }}>
              Ürün Görünüm Ayarları
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4, display: 'block' }}>
                  Sayfa Başı Ürün
                </label>
                <select
                  value={aktifTema.urunler.sayfa_basi_urun}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text
                  }}
                >
                  <option>9</option>
                  <option>12</option>
                  <option>15</option>
                  <option>18</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4, display: 'block' }}>
                  Görünüm Şekli
                </label>
                <select
                  value={aktifTema.urunler.gorunum}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text
                  }}
                >
                  <option value="grid">Grid (Kartlar)</option>
                  <option value="liste">Liste</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 4. KAYDET BUTONU */}
        <div style={{
          marginTop: 24,
          paddingTop: 24,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button style={{
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
            gap: 8
          }}>
            <span className="material-icons-round">save</span>
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyShopsPage;