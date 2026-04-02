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

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.bg,
      padding: '40px 24px 80px'
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
            fontSize: 14,
            marginBottom: 32,
            padding: 0
          }}
        >
          ← Geri Dön
        </button>

        {/* Ürün Detay İçeriği */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          backgroundColor: colors.surface,
          borderRadius: 24,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden'
        }}>
          {/* Sol: Ürün Görseli */}
          <div style={{
            backgroundColor: colors.bg,
            padding: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={product.image} 
              alt={product.name}
              style={{
                width: '100%',
                maxWidth: 400,
                borderRadius: 16,
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Sağ: Ürün Bilgileri */}
          <div style={{ padding: 32 }}>
            {/* Kategori */}
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(14,165,233,0.1)',
              color: '#0ea5e9',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              marginBottom: 16
            }}>
              {product.category}
            </span>

            {/* Başlık */}
            <h1 style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 16
            }}>
              {product.name}
            </h1>

            {/* Rating ve Satış */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#f59e0b' }}>⭐</span>
                <span style={{ color: colors.text }}>{product.rating}</span>
                <span style={{ color: colors.textSecondary }}>({product.sales} değerlendirme)</span>
              </div>
              <div style={{ color: colors.textSecondary }}>
                📦 {product.sales} satış
              </div>
            </div>

            {/* Fiyat */}
            <div style={{
              fontSize: 36,
              fontWeight: 'bold',
              color: '#0ea5e9',
              marginBottom: 24
            }}>
              ${product.price}
            </div>

            {/* Açıklama */}
            <div style={{
              marginBottom: 32,
              paddingBottom: 24,
              borderBottom: `1px solid ${colors.border}`
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                color: colors.text,
                marginBottom: 12
              }}>
                Ürün Açıklaması
              </h3>
              <p style={{
                fontSize: 16,
                color: colors.textSecondary,
                lineHeight: 1.6
              }}>
                {product.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </div>

            {/* Miktar Seçici */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 14,
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
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.bg,
                    cursor: 'pointer',
                    fontSize: 20,
                    color: colors.text
                  }}
                >
                  -
                </button>
                <span style={{
                  fontSize: 18,
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
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.bg,
                    cursor: 'pointer',
                    fontSize: 20,
                    color: colors.text
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Butonlar */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  backgroundColor: '#0ea5e9',
                  border: 'none',
                  borderRadius: 40,
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
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
                  flex: 1,
                  padding: '14px 24px',
                  backgroundColor: 'transparent',
                  border: `2px solid #0ea5e9`,
                  borderRadius: 40,
                  color: '#0ea5e9',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ⚡ Hemen Satın Al
              </button>
            </div>

            {/* Güvenlik Badgesi */}
            <div style={{
              marginTop: 32,
              padding: 16,
              backgroundColor: colors.bg,
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🔒</span>
                <span style={{ fontSize: 12, color: colors.textSecondary }}>Güvenli Ödeme</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>⚡</span>
                <span style={{ fontSize: 12, color: colors.textSecondary }}>Anında Teslimat</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🔄</span>
                <span style={{ fontSize: 12, color: colors.textSecondary }}>30 Gün İade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ürün Detay Sekmeleri */}
        <div style={{
          marginTop: 48,
          backgroundColor: colors.surface,
          borderRadius: 24,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${colors.border}`
          }}>
            <button
              onClick={() => setActiveTab('details')}
              style={{
                padding: '16px 24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'details' ? '#0ea5e9' : colors.textSecondary,
                fontWeight: activeTab === 'details' ? 600 : 400,
                borderBottom: activeTab === 'details' ? `2px solid #0ea5e9` : 'none'
              }}
            >
              Detaylı Bilgi
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '16px 24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'reviews' ? '#0ea5e9' : colors.textSecondary,
                fontWeight: activeTab === 'reviews' ? 600 : 400,
                borderBottom: activeTab === 'reviews' ? `2px solid #0ea5e9` : 'none'
              }}
            >
              Yorumlar ({product.sales})
            </button>
          </div>

          <div style={{ padding: 32 }}>
            {activeTab === 'details' && (
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 16 }}>
                  Ürün Özellikleri
                </h3>
                <ul style={{ color: colors.textSecondary, lineHeight: 1.8, paddingLeft: 20 }}>
                  <li>Yüksek kaliteli dijital ürün</li>
                  <li>Anında indirme linki</li>
                  <li>7/24 müşteri desteği</li>
                  <li>Lisans: Kişisel ve Ticari Kullanım</li>
                  <li>Düzenli güncellemeler</li>
                </ul>
                
                <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginTop: 24, marginBottom: 16 }}>
                  Bu Ürün Neler İçeriyor?
                </h3>
                <p style={{ color: colors.textSecondary, lineHeight: 1.6 }}>
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
                  marginBottom: 32
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, fontWeight: 'bold', color: '#0ea5e9' }}>
                      {product.rating}
                    </div>
                    <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ color: star <= Math.floor(product.rating) ? '#f59e0b' : '#e5e7eb' }}>★</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                      {product.sales} değerlendirme
                    </div>
                  </div>
                </div>

                {/* Örnek Yorumlar */}
                {[1,2,3].map(i => (
                  <div key={i} style={{
                    padding: 20,
                    borderBottom: `1px solid ${colors.border}`,
                    marginBottom: 20
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#0ea5e9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        K
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: colors.text }}>Kullanıcı {i}</div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>15 Mart 2024</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ color: star <= 5 ? '#f59e0b' : '#e5e7eb' }}>★</span>
                      ))}
                    </div>
                    <p style={{ color: colors.textSecondary }}>
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