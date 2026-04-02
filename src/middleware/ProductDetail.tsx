// sellerProductDetail.tsx
import { useState, useEffect } from 'react';

interface ProductDetailProps {
  product: any;
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  isDarkMode: boolean;
  onAddToCart: (product: any, quantity: number) => void;
  onClose: () => void;
}

const SellerProductDetail = ({ product, colors, isDarkMode, onAddToCart, onClose }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.bg,
      padding: isMobile ? '16px' : '40px 24px 80px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Geri Butonu */}
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors.textSecondary,
            fontSize: isMobile ? 14 : 16,
            marginBottom: isMobile ? 16 : 32,
            padding: isMobile ? '8px 0' : 0
          }}
        >
          ← Geri Dön
        </button>

        {/* Ürün Detay İçeriği */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          backgroundColor: colors.surface,
          borderRadius: isMobile ? 20 : 24,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden'
        }}>
          {/* Sol: Ürün Görseli */}
          <div style={{
            backgroundColor: colors.bg,
            padding: isMobile ? 20 : 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? '100%' : '45%'
          }}>
            <img 
              src={product.image} 
              alt={product.name}
              style={{
                width: '100%',
                maxWidth: isMobile ? 280 : 400,
                borderRadius: 16,
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Sağ: Ürün Bilgileri */}
          <div style={{ 
            padding: isMobile ? 20 : 32,
            width: isMobile ? '100%' : '55%'
          }}>
            {/* Kategori */}
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(14,165,233,0.1)',
              color: '#0ea5e9',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              marginBottom: 12
            }}>
              {product.category}
            </span>

            {/* Başlık */}
            <h1 style={{
              fontSize: isMobile ? 22 : 32,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 12,
              lineHeight: 1.3
            }}>
              {product.name}
            </h1>

            {/* Rating ve Satış */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 20,
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#f59e0b' }}>⭐</span>
                <span style={{ color: colors.text, fontSize: isMobile ? 14 : 16 }}>{product.rating}</span>
                <span style={{ color: colors.textSecondary, fontSize: isMobile ? 12 : 14 }}>({product.sales} değerlendirme)</span>
              </div>
              <div style={{ color: colors.textSecondary, fontSize: isMobile ? 12 : 14 }}>
                📦 {product.sales} satış
              </div>
            </div>

            {/* Fiyat */}
            <div style={{
              fontSize: isMobile ? 28 : 36,
              fontWeight: 'bold',
              color: '#0ea5e9',
              marginBottom: 20
            }}>
              ${product.price}
            </div>

            {/* Açıklama */}
            <div style={{
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: `1px solid ${colors.border}`
            }}>
              <h3 style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 600,
                color: colors.text,
                marginBottom: 10
              }}>
                Ürün Açıklaması
              </h3>
              <p style={{
                fontSize: isMobile ? 14 : 16,
                color: colors.textSecondary,
                lineHeight: 1.6
              }}>
                {product.description}
              </p>
            </div>

            {/* Miktar Seçici */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: isMobile ? 13 : 14,
                fontWeight: 500,
                color: colors.text,
                marginBottom: 8
              }}>
                Miktar
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.bg,
                    cursor: 'pointer',
                    fontSize: isMobile ? 18 : 20,
                    color: colors.text
                  }}
                >
                  -
                </button>
                <span style={{
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: 500,
                  color: colors.text,
                  minWidth: 40,
                  textAlign: 'center'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: isMobile ? 36 : 40,
                    height: isMobile ? 36 : 40,
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.bg,
                    cursor: 'pointer',
                    fontSize: isMobile ? 18 : 20,
                    color: colors.text
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Butonlar - Mobile'da dikey */}
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: 12,
              marginBottom: 24
            }}>
              <button
                onClick={handleAddToCart}
                style={{
                  padding: isMobile ? '12px 20px' : '14px 24px',
                  backgroundColor: '#0ea5e9',
                  border: 'none',
                  borderRadius: 40,
                  color: 'white',
                  fontSize: isMobile ? 15 : 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: isMobile ? '100%' : 'auto',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
              >
                🛒 Sepete Ekle (${(product.price * quantity).toFixed(2)})
              </button>
              <button
                onClick={handleAddToCart}
                style={{
                  padding: isMobile ? '12px 20px' : '14px 24px',
                  backgroundColor: 'transparent',
                  border: `2px solid #0ea5e9`,
                  borderRadius: 40,
                  color: '#0ea5e9',
                  fontSize: isMobile ? 15 : 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                ⚡ Hemen Satın Al
              </button>
            </div>

            {/* Güvenlik Badgesi - Mobile'da yan yana değil grid */}
            <div style={{
              marginTop: 20,
              padding: isMobile ? 12 : 16,
              backgroundColor: colors.bg,
              borderRadius: 12,
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)',
              gap: isMobile ? 12 : 24
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: isMobile ? 18 : 20 }}>🔒</span>
                <span style={{ fontSize: isMobile ? 12 : 13, color: colors.textSecondary }}>Güvenli Ödeme</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: isMobile ? 18 : 20 }}>⚡</span>
                <span style={{ fontSize: isMobile ? 12 : 13, color: colors.textSecondary }}>Anında Teslimat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ürün Detay Sekmeleri */}
        <div style={{
          marginTop: isMobile ? 24 : 48,
          backgroundColor: colors.surface,
          borderRadius: isMobile ? 20 : 24,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${colors.border}`,
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setActiveTab('details')}
              style={{
                padding: isMobile ? '12px 20px' : '16px 24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'details' ? '#0ea5e9' : colors.textSecondary,
                fontWeight: activeTab === 'details' ? 600 : 400,
                borderBottom: activeTab === 'details' ? `2px solid #0ea5e9` : 'none',
                fontSize: isMobile ? 14 : 16,
                whiteSpace: 'nowrap'
              }}
            >
              Detaylı Bilgi
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: isMobile ? '12px 20px' : '16px 24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'reviews' ? '#0ea5e9' : colors.textSecondary,
                fontWeight: activeTab === 'reviews' ? 600 : 400,
                borderBottom: activeTab === 'reviews' ? `2px solid #0ea5e9` : 'none',
                fontSize: isMobile ? 14 : 16,
                whiteSpace: 'nowrap'
              }}
            >
              Yorumlar ({product.sales})
            </button>
          </div>

          <div style={{ padding: isMobile ? 20 : 32 }}>
            {activeTab === 'details' && (
              <div>
                <h3 style={{ 
                  fontSize: isMobile ? 16 : 20, 
                  fontWeight: 600, 
                  color: colors.text, 
                  marginBottom: 12 
                }}>
                  Ürün Özellikleri
                </h3>
                <ul style={{ 
                  color: colors.textSecondary, 
                  lineHeight: 1.8, 
                  paddingLeft: 20,
                  fontSize: isMobile ? 14 : 16
                }}>
                  <li>Yüksek kaliteli dijital ürün</li>
                  <li>Anında indirme linki</li>
                  <li>7/24 müşteri desteği</li>
                  <li>Lisans: Kişisel ve Ticari Kullanım</li>
                  <li>Düzenli güncellemeler</li>
                </ul>
                
                <h3 style={{ 
                  fontSize: isMobile ? 16 : 20, 
                  fontWeight: 600, 
                  color: colors.text, 
                  marginTop: 24, 
                  marginBottom: 12 
                }}>
                  Bu Ürün Neler İçeriyor?
                </h3>
                <p style={{ 
                  color: colors.textSecondary, 
                  lineHeight: 1.6,
                  fontSize: isMobile ? 14 : 16
                }}>
                  Bu ürün ile birlikte tüm kaynak dosyalar, dokümantasyon ve kullanım kılavuzu 
                  size gönderilecektir. Satın aldıktan sonra hesabınızdan ürünü hemen indirebilirsiniz.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 32,
                  flexWrap: 'wrap'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: isMobile ? 36 : 48, fontWeight: 'bold', color: '#0ea5e9' }}>
                      {product.rating}
                    </div>
                    <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ 
                          fontSize: isMobile ? 14 : 16,
                          color: star <= Math.floor(product.rating) ? '#f59e0b' : '#e5e7eb' 
                        }}>★</span>
                      ))}
                    </div>
                    <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginTop: 4 }}>
                      {product.sales} değerlendirme
                    </div>
                  </div>
                </div>

                {/* Örnek Yorumlar */}
                {[1,2,3].map(i => (
                  <div key={i} style={{
                    padding: isMobile ? 16 : 20,
                    borderBottom: `1px solid ${colors.border}`,
                    marginBottom: isMobile ? 16 : 20
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: isMobile ? 32 : 40,
                        height: isMobile ? 32 : 40,
                        borderRadius: '50%',
                        backgroundColor: '#0ea5e9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: isMobile ? 14 : 16
                      }}>
                        K
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: colors.text, fontSize: isMobile ? 14 : 16 }}>
                          Kullanıcı {i}
                        </div>
                        <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary }}>
                          15 Mart 2024
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ 
                          fontSize: isMobile ? 12 : 14,
                          color: star <= 5 ? '#f59e0b' : '#e5e7eb' 
                        }}>★</span>
                      ))}
                    </div>
                    <p style={{ 
                      color: colors.textSecondary,
                      fontSize: isMobile ? 13 : 14,
                      lineHeight: 1.5
                    }}>
                      Harika bir ürün! Kesinlikle tavsiye ederim. Beklentilerimin üzerinde çıktı.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProductDetail;