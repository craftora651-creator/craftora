// config/ThemesPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ThemesPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    hover: string;
  };
}

const ThemesPage = ({ colors }: ThemesPageProps) => {
  const navigate = useNavigate();
  const [purchasedThemes, setPurchasedThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Satın alınan temaları JSON Server'dan çek
  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      // Burada satıcının ID'sini dinamik yapabilirsin
      const response = await fetch('http://localhost:3000/satici_temalari?satici_id=101');
      const data = await response.json();
      setPurchasedThemes(data);
    } catch (error) {
      console.error('Temalar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `3px solid ${colors.border}`,
            borderTopColor: '#0ea5e9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: colors.textSecondary }}>Temalar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: colors.text,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '28px' }}>🎨</span>
            Temalarım
          </h2>
          <p style={{ fontSize: '14px', color: colors.textSecondary, marginTop: '4px' }}>
            Satın aldığın temaları yönet ve özelleştir
          </p>
        </div>

        {/* Themes Shop Butonu */}
        <button
          onClick={() => window.open('/craftora-themes', '_blank')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#0ea5e9',
            border: 'none',
            borderRadius: '30px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
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
          <span style={{ fontSize: '18px' }}>🛍️</span>
          Craftora Themes Shop
          <span style={{ fontSize: '16px' }}>→</span>
        </button>
      </div>

      {/* Temalar Grid */}
      {purchasedThemes.length === 0 ? (
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: '20px',
          border: `1px solid ${colors.border}`,
          padding: '60px 24px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🎨</span>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
            Henüz tema satın almadın
          </h3>
          <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px' }}>
            Craftora Themes Shop'dan temalara göz atabilirsin
          </p>
          <button
            onClick={() => window.open('https://craftora.com/themes-shop', '_blank')}
            style={{
              padding: '12px 32px',
              backgroundColor: '#0ea5e9',
              border: 'none',
              borderRadius: '30px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Temalara Göz At
            <span>→</span>
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {purchasedThemes.map((theme) => (
            <div
              key={theme.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: '20px',
                overflow: 'hidden',
                border: `1px solid ${colors.border}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 24px ${colors.bg === '#0f172a' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => navigate(`/admin/myshops?theme=${theme.id}`)}
            >
              {/* Tema Önizleme */}
              <div style={{
                height: '180px',
                background: `linear-gradient(135deg, ${theme.tema_ayarlari?.renkler?.ana_renk || '#0ea5e9'} 0%, ${theme.tema_ayarlari?.renkler?.arkaplan || '#1e293b'} 100%)`,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '48px', opacity: 0.3 }}>
                  {theme.tema_id === 'dark-knight' ? '🌙' : '☀️'}
                </span>

                {/* Aktif Badge */}
                {theme.aktif_mi && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '30px',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{ fontSize: '8px' }}>●</span>
                    AKTİF
                  </div>
                )}
              </div>

              {/* Tema Bilgileri */}
              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: colors.text,
                    margin: 0
                  }}>
                    {theme.tema_adi}
                  </h3>
                  <span style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    backgroundColor: colors.bg,
                    padding: '4px 8px',
                    borderRadius: '30px'
                  }}>
                    v{theme.versiyon || '1.0'}
                  </span>
                </div>

                {/* Renkler */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  {Object.values(theme.tema_ayarlari?.renkler || {}).map((color: string, i: number) => (
                    <div
                      key={i}
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: color,
                        borderRadius: '6px',
                        border: `2px solid ${colors.border}`
                      }}
                      title={color}
                    />
                  ))}
                </div>

                {/* İstatistikler */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  padding: '12px 0',
                  borderTop: `1px solid ${colors.border}`,
                  borderBottom: `1px solid ${colors.border}`,
                  marginBottom: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: colors.text }}>24</div>
                    <div style={{ fontSize: '11px', color: colors.textSecondary }}>Ürün</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: colors.text }}>12</div>
                    <div style={{ fontSize: '11px', color: colors.textSecondary }}>Video</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: colors.text }}>8</div>
                    <div style={{ fontSize: '11px', color: colors.textSecondary }}>Reels</div>
                  </div>
                </div>

                {/* Tarih ve Buton */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '11px', color: colors.textSecondary }}>
                    Satın Alma: {new Date(theme.satin_alma_tarihi).toLocaleDateString('tr-TR')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/myshops?theme=${theme.id}`);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '30px',
                      color: colors.text,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>⚙️</span>
                    Düzenle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Animasyon */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ThemesPage;