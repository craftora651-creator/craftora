// src/themes/pages/ProductDetail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery?: string[];
  rating: number;
  reviewCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  description?: string;
  details?: {
    brand?: string;
    material?: string;
    dimensions?: string;
    weight?: string;
    warranty?: string;
  };
  stock?: number;
  sku?: string;
}

interface ProductDetailProps {
  settings: any;
  products: Product[];
  handleAddToCart: (productName: string, quantity: number) => void;
  isDarkMode?: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  settings, 
  products, 
  handleAddToCart,
  isDarkMode = false 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const mockProduct: Product = {
    id: parseInt(id || '1'),
    name: 'Premium Deri Sırt Çantası',
    price: 1899,
    oldPrice: 2499,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
    rating: 5,
    isNew: true,
    description: 'Yüksek kaliteli deriden üretilmiş, şık ve kullanışlı sırt çantası. Günlük kullanım için ideal.',
    stock: 15,
  };

  const product = products.find(p => p.id === parseInt(id || '0')) || mockProduct;

  // Light/Dark mode renkleri
  const lightColors = {
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    accent: '#3b82f6',
    border: '#eef2f6',
    background: '#ffffff',
    cardBg: '#ffffff',
    saleBadge: '#ef4444',
    newBadge: '#10b981',
    stockIn: '#10b981',
    stockOut: '#ef4444',
  };

  const darkColors = {
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    accent: '#60a5fa',
    border: '#374151',
    background: '#111827',
    cardBg: '#1f2937',
    saleBadge: '#ef4444',
    newBadge: '#10b981',
    stockIn: '#10b981',
    stockOut: '#ef4444',
  };

  const colors = isDarkMode ? darkColors : (settings?.colors || lightColors);

  if (!product) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 24px',
        textAlign: 'center',
        backgroundColor: colors.background,
        minHeight: 'calc(100vh - 200px)',
      }}>
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>🔍</div>
        <h2 style={{ fontSize: '28px', color: colors.textPrimary, marginBottom: '12px' }}>Ürün Bulunamadı</h2>
        <p style={{ color: colors.textSecondary, marginBottom: '32px' }}>Aradığınız ürün mevcut değil.</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: colors.accent,
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '40px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Geri Dön
        </button>
      </div>
    );
  }

  const mainImage = selectedImage || product.image;
  const galleryImages = product.gallery || [product.image];
  const inStock = (product.stock || 10) > 0;

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => Math.min(prev + 1, product.stock || 99));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(product.name, quantity);
    navigate('/checkout');
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 24px',
      backgroundColor: colors.background,
      minHeight: 'calc(100vh - 200px)',
      transition: 'background-color 0.3s ease',
    }}>
      {/* Geri Butonu */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: colors.textSecondary,
          fontSize: '14px',
          marginBottom: '32px',
          padding: '8px 0',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = colors.accent}
        onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
      >
        <span>←</span> Tüm Ürünler
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '60px',
      }}>
        {/* Sol Taraf - Görseller */}
        <div>
          {/* Ana Görsel */}
          <div style={{
            backgroundColor: colors.cardBg,
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}>
            <img
              src={mainImage}
              alt={product.name}
              style={{
                width: '100%',
                height: '500px',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
            />
          </div>

          {/* Galeri */}
          {galleryImages.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '8px',
            }}>
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: selectedImage === img ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                    cursor: 'pointer',
                    background: 'none',
                    padding: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  <img
                    src={img}
                    alt={`${product.name} - ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Taraf - Bilgiler */}
        <div>
          {/* Badge'ler */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            {product.isNew && (
              <span style={{
                backgroundColor: colors.newBadge,
                color: 'white',
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '30px',
              }}>YENİ</span>
            )}
            {product.oldPrice && (
              <span style={{
                backgroundColor: colors.saleBadge,
                color: 'white',
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '30px',
              }}>
                %{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)} İNDİRİM
              </span>
            )}
            <span style={{
              backgroundColor: inStock ? colors.stockIn : colors.stockOut,
              color: 'white',
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: '30px',
            }}>
              {inStock ? 'STOKTA' : 'STOKTA YOK'}
            </span>
          </div>

          {/* Ürün Adı */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: colors.textPrimary,
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{
                  color: i < product.rating ? '#fbbf24' : '#e5e7eb',
                  fontSize: '16px',
                }}>★</span>
              ))}
            </div>
            <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
              {product.reviewCount || 24} değerlendirme
            </span>
          </div>

          {/* Fiyat */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{
              fontSize: '36px',
              fontWeight: 700,
              color: colors.accent,
            }}>₺{product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span style={{
                fontSize: '20px',
                color: colors.textMuted,
                textDecoration: 'line-through',
                marginLeft: '12px',
              }}>₺{product.oldPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Açıklama */}
          <p style={{
            fontSize: '16px',
            lineHeight: 1.7,
            color: colors.textSecondary,
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: `1px solid ${colors.border}`,
          }}>
            {product.description || 'Premium kalite, şık tasarım ve yüksek performans. Her detayı özenle düşünülmüş, günlük kullanım için ideal.'}
          </p>

          {/* Miktar Seçici */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: colors.textPrimary,
              marginBottom: '12px',
            }}>Miktar</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <button
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'transparent',
                  cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                  color: colors.textPrimary,
                  fontSize: '20px',
                  transition: 'all 0.2s',
                }}
              >
                −
              </button>
              <span style={{
                fontSize: '18px',
                fontWeight: 500,
                color: colors.textPrimary,
                minWidth: '40px',
                textAlign: 'center',
              }}>{quantity}</span>
              <button
                onClick={() => handleQuantityChange('increase')}
                disabled={quantity >= (product.stock || 99)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: 'transparent',
                  cursor: quantity >= (product.stock || 99) ? 'not-allowed' : 'pointer',
                  color: colors.textPrimary,
                  fontSize: '20px',
                  transition: 'all 0.2s',
                }}
              >
                +
              </button>
              <span style={{ color: colors.textMuted, fontSize: '13px' }}>
                Stok: {product.stock || 10} adet
              </span>
            </div>
          </div>

          {/* Butonlar */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => handleAddToCart(product.name, quantity)}
              disabled={!inStock}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                color: colors.textPrimary,
                border: `2px solid ${colors.accent}`,
                padding: '14px 28px',
                borderRadius: '40px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: inStock ? 'pointer' : 'not-allowed',
                opacity: inStock ? 1 : 0.5,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (inStock) {
                  e.currentTarget.style.backgroundColor = colors.accent;
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (inStock) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.textPrimary;
                }
              }}
            >
              🛒 Sepete Ekle
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              style={{
                flex: 1,
                backgroundColor: colors.accent,
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '40px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: inStock ? 'pointer' : 'not-allowed',
                opacity: inStock ? 1 : 0.5,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.accent}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Hemen Satın Al →
            </button>
          </div>

          {/* Ürün Bilgileri */}
          <div style={{
            backgroundColor: colors.cardBg,
            borderRadius: '16px',
            padding: '20px',
            border: `1px solid ${colors.border}`,
          }}>
            <div style={{
              display: 'flex',
              gap: '24px',
              borderBottom: `1px solid ${colors.border}`,
              marginBottom: '20px',
            }}>
              {['description', 'details', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '12px 0',
                    cursor: 'pointer',
                    color: activeTab === tab ? colors.accent : colors.textSecondary,
                    fontSize: '14px',
                    fontWeight: activeTab === tab ? 600 : 500,
                    borderBottom: activeTab === tab ? `2px solid ${colors.accent}` : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab === 'description' && '📝 Açıklama'}
                  {tab === 'details' && '📋 Detaylar'}
                  {tab === 'reviews' && '⭐ Yorumlar'}
                </button>
              ))}
            </div>

            <div style={{ color: colors.textSecondary, fontSize: '14px', lineHeight: 1.6 }}>
              {activeTab === 'description' && (
                <p>
                  {product.description || 'Bu ürün, en kaliteli malzemelerle üretilmiştir. Şık tasarımı ve dayanıklı yapısıyla uzun yıllar kullanım imkanı sunar. Günlük hayatınızda stilinizi tamamlayacak mükemmel bir seçim.'}
                </p>
              )}
              {activeTab === 'details' && (
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div><strong>Marka:</strong> {product.details?.brand || 'Craftora'}</div>
                  <div><strong>Materyal:</strong> {product.details?.material || 'Premium Deri'}</div>
                  <div><strong>Boyutlar:</strong> {product.details?.dimensions || 'Standart'}</div>
                  <div><strong>Ağırlık:</strong> {product.details?.weight || '0.5 kg'}</div>
                  <div><strong>Garanti:</strong> {product.details?.warranty || '2 Yıl'}</div>
                  <div><strong>SKU:</strong> {product.sku || `CR-${product.id.toString().padStart(4, '0')}`}</div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '48px', color: '#fbbf24' }}>★★★★☆</div>
                    <p style={{ marginTop: '8px' }}>{product.reviewCount || 24} müşteri değerlendirmesi</p>
                    <button style={{
                      marginTop: '16px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${colors.border}`,
                      padding: '8px 20px',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      color: colors.textSecondary,
                    }}>
                      Yorum Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Benzer Ürünler (isteğe bağlı) */}
      <div style={{ marginTop: '80px' }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 600,
          color: colors.textPrimary,
          marginBottom: '32px',
          textAlign: 'center',
        }}>Benzer Ürünler</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '24px',
        }}>
          {products.filter(p => p.id !== product.id).slice(0, 4).map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              style={{
                cursor: 'pointer',
                backgroundColor: colors.cardBg,
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img src={p.image} alt={p.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, marginBottom: '8px' }}>{p.name}</h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: colors.accent }}>₺{p.price.toLocaleString()}</span>
                  {p.oldPrice && <span style={{ fontSize: '12px', color: colors.textMuted, textDecoration: 'line-through' }}>₺{p.oldPrice.toLocaleString()}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;