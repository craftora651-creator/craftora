// sellerProducts.tsx
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  sales: number;
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
  onProductClick: (product: Product) => void; // YENİ - EKLENDİ
}

const SellerProducts = ({ colors, isDarkMode, onAddToCart, onProductClick }: SellerProductsProps) => {  // onProductClick'i props'tan al
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchInput, setSearchInput] = useState('');

  // Örnek ürünler
  const products: Product[] = [
    {
      id: 1,
      name: 'Premium UI Kit',
      description: 'Modern ve kullanışlı UI bileşenleri',
      price: 89,
      image: 'https://placehold.co/400x300/0ea5e9/white?text=UI+Kit',
      category: 'Tasarım',
      rating: 4.8,
      sales: 234
    },
    {
      id: 2,
      name: 'Tailwind Pro Components',
      description: '100+ hazır Tailwind bileşeni',
      price: 49,
      image: 'https://placehold.co/400x300/8b5cf6/white?text=Tailwind',
      category: 'Geliştirme',
      rating: 4.9,
      sales: 189
    },
    {
      id: 3,
      name: 'React Mastery E-book',
      description: 'React öğrenmek için kapsamlı kitap',
      price: 39,
      image: 'https://placehold.co/400x300/10b981/white?text=React+Book',
      category: 'E-kitap',
      rating: 4.7,
      sales: 456
    },
    {
      id: 4,
      name: 'Figma Design System',
      description: 'Profesyonel Figma tasarım sistemi',
      price: 59,
      image: 'https://placehold.co/400x300/ef4444/white?text=Figma',
      category: 'Tasarım',
      rating: 4.9,
      sales: 312
    },
    {
      id: 5,
      name: 'Vue.js Masterclass',
      description: 'Vue.js ile modern web uygulamaları',
      price: 79,
      image: 'https://placehold.co/400x300/42b883/white?text=Vue.js',
      category: 'Geliştirme',
      rating: 4.8,
      sales: 167
    },
    {
      id: 6,
      name: '3D Icons Pack',
      description: '500+ profesyonel 3D ikon seti',
      price: 29,
      image: 'https://placehold.co/400x300/f97316/white?text=3D+Icons',
      category: 'Tasarım',
      rating: 4.6,
      sales: 423
    },
    {
      id: 7,
      name: 'Python Crash Course',
      description: 'Sıfırdan ileri seviye Python',
      price: 49,
      image: 'https://placehold.co/400x300/3776ab/white?text=Python',
      category: 'E-kitap',
      rating: 4.9,
      sales: 678
    },
    {
      id: 8,
      name: 'Dashboard Template',
      description: 'Admin paneli için hazır şablon',
      price: 69,
      image: 'https://placehold.co/400x300/6366f1/white?text=Dashboard',
      category: 'Geliştirme',
      rating: 4.7,
      sales: 245
    }
  ];

  // Kategoriler
  const categories = [
    { id: 'all', name: 'Tüm Ürünler' },
    { id: 'Tasarım', name: 'Tasarım' },
    { id: 'Geliştirme', name: 'Geliştirme' },
    { id: 'E-kitap', name: 'E-kitap' }
  ];

  // Filtreleme
  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchInput.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              onClick={() => onProductClick(product)}  // Ürün kartına tıklayınca detay aç
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
                src={product.image} 
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
                    {product.category}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 12 }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 12, color: '#f59e0b' }}>⭐ {product.rating}</span>
                  <span style={{ fontSize: 12, color: colors.textSecondary }}>📦 {product.sales} satış</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 'bold', color: '#0ea5e9' }}>
                    ${product.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // Bu çok önemli! Üstteki onClick'i engeller
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