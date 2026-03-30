// src/themes/pages/ProductsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ThemeSettings } from '../../types/theme.types';

type OnElementClick = (
  elementType: string,
  meta?: { id?: number; currentData?: Record<string, string> }
) => void;

// makeEditable helper
const makeEditable = (
  elementType: string,
  isEditing: boolean,
  onElementClick: OnElementClick | undefined,
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

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isFeatured?: boolean;
  category?: string;
}

interface ProductsPageProps {
  settings?: ThemeSettings;
  products: Product[];
  handleAddToCart: (productName: string) => void;
  isDarkMode?: boolean;
  isEditing?: boolean;
  onElementClick?: (
    elementType: string,
    meta?: { id?: number; currentData?: Record<string, string> }
  ) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  handleAddToCart,
  isDarkMode = false,
  isEditing = false,
  onElementClick
}) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Light/Dark mode renkleri
  const lightColors = {
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    accent: '#3b82f6',
    border: '#eef2f6',
    background: '#ffffff',
    cardBg: '#ffffff',
    filterBg: '#ffffff',
    saleBadge: '#ef4444',
    newBadge: '#10b981',
  };

  const darkColors = {
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    accent: '#60a5fa',
    border: '#374151',
    background: '#111827',
    cardBg: '#1f2937',
    filterBg: '#1f2937',
    saleBadge: '#ef4444',
    newBadge: '#10b981',
  };

  const colors = isDarkMode ? darkColors : lightColors;

  // Kategoriler
  const categories = [
    { id: 'all', name: 'Tümü', icon: '✨', count: products.length },
    { id: 'new', name: 'Yeni', icon: '🆕', count: products.filter(p => p.isNew).length },
    { id: 'sale', name: 'İndirim', icon: '🏷️', count: products.filter(p => p.oldPrice).length },
    { id: 'featured', name: 'Öne Çıkan', icon: '⭐', count: products.filter(p => p.isFeatured).length },
  ];

  // Filtreleme ve sıralama
  const filteredProducts = products
    .filter(product => {
      if (selectedCategory === 'new' && !product.isNew) return false;
      if (selectedCategory === 'sale' && !product.oldPrice) return false;
      if (selectedCategory === 'featured' && !product.isFeatured) return false;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.id - a.id;
      return 0;
    });

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '60px 24px',
      backgroundColor: colors.background,
      minHeight: 'calc(100vh - 200px)',
      transition: 'background-color 0.3s ease',
    }}>
      {/* Başlık - EDITABLE */}
      <div 
        {...makeEditable('products-header', isEditing, onElementClick, {
          currentData: { title: 'Ürünler', subtitle: 'KOLEKSİYON' }
        }, colors.accent)}
        style={{ textAlign: 'center', marginBottom: '60px', cursor: isEditing ? 'pointer' : 'default' }}
      >
        <div style={{
          fontSize: '13px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: '16px',
          fontWeight: 500,
        }}>KOLEKSİYON</div>
        <h1 style={{
          fontSize: '56px',
          fontWeight: 600,
          color: colors.textPrimary,
          marginBottom: '16px',
          letterSpacing: '-0.02em',
        }}>Ürünler</h1>
        <div style={{
          width: '60px',
          height: '2px',
          backgroundColor: colors.accent,
          margin: '0 auto',
        }} />
      </div>

      {/* Kategori Butonları */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '40px',
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              backgroundColor: selectedCategory === cat.id ? colors.accent : 'transparent',
              color: selectedCategory === cat.id ? 'white' : colors.textSecondary,
              border: selectedCategory === cat.id ? 'none' : `1px solid ${colors.border}`,
              borderRadius: '40px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== cat.id) {
                e.currentTarget.style.borderColor = colors.accent;
                e.currentTarget.style.color = colors.accent;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== cat.id) {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.color = colors.textSecondary;
              }
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            <span style={{
              fontSize: '12px',
              opacity: 0.7,
            }}>({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Arama ve Sıralama */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px',
        padding: '20px 0',
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: '48px',
            padding: '4px 4px 4px 20px',
            transition: 'all 0.2s',
          }}
            onFocus={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = colors.accent;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 3px ${colors.accent}20`;
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = colors.border;
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}>
            <span style={{ fontSize: '18px', color: colors.textMuted }}>🔍</span>
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '15px',
                color: colors.textPrimary,
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  padding: '8px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.textMuted,
                  fontSize: '16px',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px 20px',
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: '40px',
              fontSize: '14px',
              color: colors.textPrimary,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="newest">🆕 En Yeni</option>
            <option value="price-asc">💰 Fiyat (Düşük → Yüksek)</option>
            <option value="price-desc">💰 Fiyat (Yüksek → Düşük)</option>
            <option value="rating">⭐ En Çok Beğenilen</option>
          </select>

          <div style={{ display: 'flex', gap: '8px', background: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '40px', padding: '4px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 16px',
                backgroundColor: viewMode === 'grid' ? colors.accent : 'transparent',
                color: viewMode === 'grid' ? 'white' : colors.textSecondary,
                border: 'none',
                borderRadius: '32px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '16px',
              }}
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px 16px',
                backgroundColor: viewMode === 'list' ? colors.accent : 'transparent',
                color: viewMode === 'list' ? 'white' : colors.textSecondary,
                border: 'none',
                borderRadius: '32px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '16px',
              }}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Ürünler */}
      {filteredProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '100px 20px',
        }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '24px',
            opacity: 0.5,
          }}>🔍</div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 500,
            color: colors.textPrimary,
            marginBottom: '8px',
          }}>Ürün bulunamadı</h3>
          <p style={{ color: colors.textSecondary }}>Filtreleri değiştirip tekrar deneyin.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '40px',
        }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/theme/enterprise/product/${product.id}`)}
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: '24px',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.2, 0, 0, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '320px',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                {product.isNew && (
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: colors.newBadge,
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '30px',
                    letterSpacing: '0.5px',
                  }}>YENİ</span>
                )}
                {product.oldPrice && (
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: colors.saleBadge,
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '30px',
                  }}>
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>

              <div style={{ padding: '24px 20px 20px' }}>
                {/* Ürün Başlığı - EDITABLE */}
                <h3 
                  {...makeEditable('product-title', isEditing, onElementClick, {
                    id: product.id,
                    currentData: { title: product.name }
                  }, colors.accent)}
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: colors.textPrimary,
                    marginBottom: '8px',
                    lineHeight: 1.3,
                    cursor: isEditing ? 'pointer' : 'default'
                  }}
                >
                  {product.name}
                </h3>

                <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{
                      color: i < product.rating ? '#fbbf24' : '#e5e7eb',
                      fontSize: '13px',
                    }}>★</span>
                  ))}
                </div>

                {/* Ürün Fiyatı - EDITABLE */}
                <div 
                  {...makeEditable('product-price', isEditing, onElementClick, {
                    id: product.id,
                    currentData: { price: product.price.toString(), oldPrice: product.oldPrice?.toString() || '' }
                  }, colors.accent)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    gap: '8px', 
                    marginBottom: '20px',
                    cursor: isEditing ? 'pointer' : 'default'
                  }}
                >
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: colors.accent,
                  }}>₺{product.price.toLocaleString()}</span>
                  {product.oldPrice && (
                    <span style={{
                      fontSize: '14px',
                      color: colors.textMuted,
                      textDecoration: 'line-through',
                    }}>₺{product.oldPrice.toLocaleString()}</span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product.name);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: colors.textPrimary,
                    border: `1px solid ${colors.border}`,
                    padding: '12px',
                    borderRadius: '40px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.accent;
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.textPrimary;
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                >
                  Sepete Ekle →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/theme/enterprise/product/${product.id}`)}
              style={{
                display: 'flex',
                gap: '28px',
                backgroundColor: colors.cardBg,
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                flexWrap: 'wrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ width: '120px', height: '120px', flexShrink: 0 }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div style={{ flex: 1, padding: '16px 16px 16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    {/* List Görünüm Başlık - EDITABLE */}
                    <h3 
                      {...makeEditable('product-title', isEditing, onElementClick, {
                        id: product.id,
                        currentData: { title: product.name }
                      }, colors.accent)}
                      style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: colors.textPrimary,
                        marginBottom: '6px',
                        cursor: isEditing ? 'pointer' : 'default'
                      }}
                    >
                      {product.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{
                          color: i < product.rating ? '#fbbf24' : '#e5e7eb',
                          fontSize: '12px',
                        }}>★</span>
                      ))}
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: colors.textSecondary,
                      lineHeight: 1.5,
                    }}>
                      Premium kalite, şık tasarım. Hemen keşfedin!
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {/* List Görünüm Fiyat - EDITABLE */}
                    <div 
                      {...makeEditable('product-price', isEditing, onElementClick, {
                        id: product.id,
                        currentData: { price: product.price.toString(), oldPrice: product.oldPrice?.toString() || '' }
                      }, colors.accent)}
                      style={{ 
                        marginBottom: '12px',
                        cursor: isEditing ? 'pointer' : 'default'
                      }}
                    >
                      <span style={{
                        fontSize: '22px',
                        fontWeight: 700,
                        color: colors.accent,
                      }}>₺{product.price.toLocaleString()}</span>
                      {product.oldPrice && (
                        <span style={{
                          fontSize: '13px',
                          color: colors.textMuted,
                          textDecoration: 'line-through',
                          marginLeft: '8px',
                          display: 'block',
                        }}>₺{product.oldPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.name);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        color: colors.textPrimary,
                        border: `1px solid ${colors.border}`,
                        padding: '8px 20px',
                        borderRadius: '40px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = colors.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.textPrimary;
                        e.currentTarget.style.borderColor = colors.border;
                      }}
                    >
                      Sepete Ekle →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sonuç Sayısı */}
      {filteredProducts.length > 0 && (
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          padding: '20px',
          borderTop: `1px solid ${colors.border}`,
          color: colors.textMuted,
          fontSize: '13px',
          letterSpacing: '0.5px',
        }}>
          {filteredProducts.length} ürün gösteriliyor
        </div>
      )}
    </div>
  );
};

export default ProductsPage;