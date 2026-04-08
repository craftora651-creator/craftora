// sellerProducts.tsx
import { useState, useEffect } from 'react';
import { useMyProducts } from '../server/FastAPI/product.hooks';
import { useMyShops } from '../server/FastAPI/shop.hooks';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  base_price: number;
  feature_image_url?: string;
  primary_category?: string;
  average_rating?: number;
  purchase_count?: number;
}

interface SellerProductsProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  isDarkMode: boolean;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const SellerProducts = ({ colors, isDarkMode, onAddToCart, onProductClick }: SellerProductsProps) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  
  // Mağaza ID'sini al
  const { data: myShops } = useMyShops();
  const [selectedShopId, setSelectedShopId] = useState('');
  
  useEffect(() => {
    if (myShops && myShops.length > 0) {
      setSelectedShopId(myShops[0].id);
    }
  }, [myShops]);
  
  // ✅ Backend'den tüm ürünleri çek
  const { data: products, isLoading, error } = useMyProducts();
  
  console.log('🔍 Products from backend:', products);
  console.log('🔍 isLoading:', isLoading);
  
  // Kategoriler (backend'den gelen kategorilerden dinamik oluştur)
  const categories = [
    { id: 'all', name: 'Tüm Ürünler' },
    ...(products ? [...new Set(products.map(p => p.primary_category).filter(Boolean))].map(cat => ({
      id: cat,
      name: cat
    })) : [])
  ];
  
  // Filtreleme
  const filteredProducts = products?.filter(product => {
    const matchesCategory = filterCategory === 'all' || product.primary_category === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                          (product.description?.toLowerCase() || '').includes(searchInput.toLowerCase()) ||
                          (product.short_description?.toLowerCase() || '').includes(searchInput.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];
  
  if (isLoading) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ color: colors.textSecondary }}>⏳ Ürünler yükleniyor...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ color: '#ef4444' }}>❌ Hata: {error.message}</div>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '40px 24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Başlık */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ 
          fontSize: 36, 
          fontWeight: 'bold', 
          color: colors.text,
          marginBottom: 12
        }}>
          📦 Tüm Ürünler
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: 16 }}>
          En kaliteli dijital ürünler burada
        </p>
      </div>

      {/* Filtre ve Arama */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
        padding: 20,
        backgroundColor: colors.surface,
        borderRadius: 16,
        border: `1px solid ${colors.border}`
      }}>
        {/* Kategori Butonları */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              style={{
                padding: '8px 20px',
                backgroundColor: filterCategory === cat.id ? '#0ea5e9' : 'transparent',
                color: filterCategory === cat.id ? 'white' : colors.textSecondary,
                border: `1px solid ${filterCategory === cat.id ? '#0ea5e9' : colors.border}`,
                borderRadius: 30,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Arama Kutusu */}
        <div style={{ position: 'relative', minWidth: 250 }}>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: 30,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.bg,
              outline: 'none',
              fontSize: 14,
              color: colors.text
            }}
          />
          <span style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 16
          }}>🔍</span>
        </div>
      </div>

      {/* Ürün Sayısı */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: colors.textSecondary }}>
          {filteredProducts.length} ürün bulundu
        </p>
      </div>

      {/* Ürün Grid */}
      {filteredProducts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24
        }}>
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                border: `1px solid ${colors.border}`,
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
              }}
            >
              <img 
                src={product.feature_image_url || 'https://placehold.co/400x300/0ea5e9/white?text=Product'} 
                alt={product.name} 
                style={{ width: '100%', height: 200, objectFit: 'cover' }} 
              />
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>
                    {product.name}
                  </h3>
                  <span style={{
                    backgroundColor: 'rgba(14,165,233,0.1)',
                    color: '#0ea5e9',
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 12
                  }}>
                    {product.primary_category || 'Ürün'}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 12 }}>
                  {product.short_description || product.description?.substring(0, 100) || 'Ürün açıklaması'}
                </p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 12, color: '#f59e0b' }}>⭐ {product.average_rating || '4.8'}</span>
                  <span style={{ fontSize: 12, color: colors.textSecondary }}>📦 {product.purchase_count || 0} satış</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 'bold', color: '#0ea5e9' }}>
                    ${product.base_price ? Number(product.base_price).toFixed(2) : '0'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    style={{
                      backgroundColor: '#0ea5e9',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: 30,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          backgroundColor: colors.surface,
          borderRadius: 20,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 8 }}>
            Ürün bulunamadı
          </h3>
          <p style={{ color: colors.textSecondary }}>
            Farklı bir kategori veya arama terimi deneyin
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;