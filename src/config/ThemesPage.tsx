// config/ThemesPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePurchasedThemes, useActivateTheme } from '../server/Gin/theme.hook';

interface ThemesPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    hover: string;
  };
  shopId: string;
}

const ThemesPage = ({ colors, shopId }: ThemesPageProps) => {
  console.log("ThemesPage - shopId:", shopId);
  const navigate = useNavigate();

  // Backend'den satın alınan temaları getir
  const { data: purchasedThemes, isLoading, refetch } = usePurchasedThemes();
  const { mutate: activateTheme, isPending: isActivating } = useActivateTheme();

  // Aktif etme işlemi
  const handleActivate = (themeId: number) => {
    activateTheme(themeId, {
      onSuccess: () => {
        refetch(); // Listeyi yenile
        alert('Tema başarıyla aktifleştirildi!');
      },
      onError: (error) => {
        alert('Tema aktifleştirilirken hata oluştu: ' + error.message);
      }
    });
  };

  const goToThemeShop = () => {
    navigate('/craftora-themes');
  };

  if (isLoading) {
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
          onClick={goToThemeShop}
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
      {!purchasedThemes || purchasedThemes.length === 0 ? (
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
            onClick={goToThemeShop}
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
            >
              {/* Tema Önizleme */}
              <div style={{
                height: '180px',
                background: `linear-gradient(135deg, ${theme.settings?.colors?.primary || '#0ea5e9'} 0%, ${theme.settings?.colors?.background || '#1e293b'} 100%)`,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '48px', opacity: 0.3 }}>
                  {theme.theme_code === 'enterprise' ? '🏢' : '🎨'}
                </span>

                {/* Aktif Badge */}
                {theme.is_active && (
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
                    {theme.theme_code === 'enterprise' ? 'Enterprise Theme' : theme.theme_code}
                  </h3>
                  <span style={{
                    fontSize: '12px',
                    color: colors.textSecondary,
                    backgroundColor: colors.bg,
                    padding: '4px 8px',
                    borderRadius: '30px'
                  }}>
                    v1.0
                  </span>
                </div>

                {/* Renkler */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  {Object.values(theme.settings?.colors || {}).slice(0, 4).map((color: string, i: number) => (
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

                {/* Tarih ve Buton */}
                {/* Tarih ve Butonlar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: `1px solid ${colors.border}`,
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '11px', color: colors.textSecondary }}>
                    Satın Alma: {new Date(theme.purchased_at).toLocaleDateString('tr-TR')}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Düzenle Butonu - YENİ */}
                    {/* Düzenle Butonu */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/theme-editor?theme=${theme.theme_code}&shopId=${shopId}`);
                      }}
                      style={{
                        padding: '8px 20px',
                        backgroundColor: '#8b5cf6',
                        border: 'none',
                        borderRadius: '30px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#7c3aed';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#8b5cf6';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>✏️</span>
                      Temayı Düzenle
                    </button>

                    {/* Aktif Et / Görüntüle Butonu */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!theme.is_active) {
                          handleActivate(theme.theme_id);
                        } else {
                          navigate(`/theme/enterprise`);
                        }
                      }}
                      disabled={isActivating}
                      style={{
                        padding: '8px 20px',
                        backgroundColor: theme.is_active ? '#10b981' : '#0ea5e9',
                        border: 'none',
                        borderRadius: '30px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: isActivating ? 'not-allowed' : 'pointer',
                        opacity: isActivating ? 0.7 : 1,
                        transition: 'all 0.2s'
                      }}
                    >
                      {isActivating ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{
                            width: '12px',
                            height: '12px',
                            border: '2px solid white',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.6s linear infinite'
                          }} />
                          İşleniyor...
                        </span>
                      ) : theme.is_active ? (
                        '✨ Temayı Görüntüle'
                      ) : (
                        '🚀 Temayı Aktif Et'
                      )}
                    </button>
                  </div>
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