import React, { useState } from 'react';
import './featured.css';

// ÜRÜN VERİLERİ
const products = [
  {
    id: 1,
    name: 'MacBook Pro 14" M3',
    category: 'Laptop',
    price: 1299,
    oldPrice: 1499,
    discount: 20,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1026&q=80',
    badge: '🔥 SÜPER FIRSAT',
    badgeType: 'hot',
    stock: 45
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5',
    category: 'Kulaklık',
    price: 299,
    oldPrice: 399,
    discount: 25,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80',
    badge: '🎧 EN ÇOK SATAN',
    badgeType: 'hot',
    stock: 32
  },
  {
    id: 3,
    name: 'iPhone 15 Pro Max',
    category: 'Telefon',
    price: 1199,
    oldPrice: 1299,
    discount: 8,
    rating: 4.7,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    badge: '✨ YENİ',
    badgeType: 'new',
    stock: 18
  },
  {
    id: 4,
    name: 'iPad Air 5. Nesil',
    category: 'Tablet',
    price: 599,
    oldPrice: 699,
    discount: 15,
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    badge: '📱 HAFTANIN FIRSATI',
    badgeType: 'hot',
    stock: 27
  },
  {
    id: 5,
    name: 'Logitech MX Master 3S',
    category: 'Aksesuar',
    price: 89,
    oldPrice: 119,
    discount: 25,
    rating: 4.9,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1629429408209-1f912961db12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
    badge: '🖱️ EN ÇOK TERCİH',
    badgeType: 'hot',
    stock: 56
  },
  {
    id: 6,
    name: 'Samsung Odyssey G9',
    category: 'Monitör',
    price: 999,
    oldPrice: 1299,
    discount: 23,
    rating: 4.7,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    badge: '🖥️ OYUNCU EFSANESİ',
    badgeType: 'hot',
    stock: 12
  },
  {
    id: 7,
    name: 'Apple Watch Series 9',
    category: 'Saat',
    price: 429,
    oldPrice: 499,
    discount: 14,
    rating: 4.8,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80',
    badge: '⌚ SÜPER FIRSAT',
    badgeType: 'hot',
    stock: 23
  },
  {
    id: 8,
    name: 'PS5 Slim Digital',
    category: 'Oyun',
    price: 449,
    oldPrice: 499,
    discount: 10,
    rating: 4.9,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
    badge: '🎮 TÜKENDİ!',
    badgeType: 'soldout',
    stock: 0
  }
];

// FİLTRE KATEGORİLERİ
const filters = [
  { id: 'all', label: 'Tüm Ürünler', icon: '✨' },
  { id: 'Laptop', label: 'Laptop', icon: '💻' },
  { id: 'Telefon', label: 'Telefon', icon: '📱' },
  { id: 'Kulaklık', label: 'Kulaklık', icon: '🎧' },
  { id: 'Aksesuar', label: 'Aksesuar', icon: '⌨️' },
  { id: 'Oyun', label: 'Oyun', icon: '🎮' },
];

const Featured: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(p => p.category === activeFilter);

  // Badge tipine göre renk belirle
  const getBadgeClass = (type: string) => {
    switch(type) {
      case 'new': return 'craftProductBadgeNew';
      case 'soldout': return 'craftProductBadgeSoldout';
      case 'hot': return 'craftProductBadgeHot';
      default: return '';
    }
  };

  // Yıldız oluştur
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i}>★</span>);
      } else if (i === fullStars && hasHalf) {
        stars.push(<span key={i}>½</span>);
      } else {
        stars.push(<span key={i} style={{ opacity: 0.3 }}>★</span>);
      }
    }
    return stars;
  };

  return (
    <section className="craftFeatured">
      {/* Dekoratif şekiller */}
      <div className="craftFeaturedShape craftFeaturedShape1"></div>
      <div className="craftFeaturedShape craftFeaturedShape2"></div>

      <div className="craftFeaturedHeader">
        <div className="craftFeaturedBadge">
          <span className="craftFeaturedBadgeIcon">⚡</span>
          <span>Haftanın Favorileri</span>
          <span className="craftFeaturedBadgeIcon">🔥</span>
        </div>
        
        <h2 className="craftFeaturedTitle">
          Bu hafta en çok <span>satanlar</span>
        </h2>
        
        <p className="craftFeaturedDesc">
          <strong>12,458+</strong> kişi bu ürünleri inceledi • <strong>3,247+</strong> kişi satın aldı
        </p>

        {/* LİMİTED TIME BANNER */}
        <div className="craftFeaturedLimited">
          <span className="craftFeaturedLimitedIcon">⏳</span>
          <span className="craftFeaturedLimitedText">SÜPER FIRSAT bitiyor!</span>
          <span className="craftFeaturedLimitedTimer">23:15:42</span>
        </div>
      </div>

      {/* FİLTRE BUTONLARI */}
      <div className="craftFeaturedFilter">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`craftFilterBtn ${activeFilter === filter.id ? 'craftFilterActive' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      {/* ÜRÜN GRID */}
      <div className="craftFeaturedGrid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="craftProductCard">
            
            {/* BADGE */}
            {product.badge && (
              <div className={`craftProductBadge ${getBadgeClass(product.badgeType)}`}>
                <span>{product.badge.split(' ')[0]}</span>
                {product.badge.slice(2)}
              </div>
            )}

            {/* TRENDING ICON */}
            {product.stock > 40 && (
              <div className="craftProductTrending">
                🔥
              </div>
            )}

            {/* RESİM ALANI */}
            <div className="craftProductImageWrap">
              <img 
                src={product.image} 
                alt={product.name}
                className="craftProductImage"
                loading="lazy"
              />
              
              {/* HOVER OVERLAY - HIZLI BAKIŞ */}
              <div className="craftProductOverlay">
                <button className="craftProductQuickView">
                  Hızlı Bakış
                </button>
              </div>
            </div>

            {/* ÜRÜN BİLGİLERİ */}
            <div className="craftProductInfo">
              <span className="craftProductCategory">
                {product.category}
              </span>
              
              <h3 className="craftProductTitle">
                {product.name}
              </h3>

              {/* RATING */}
              <div className="craftProductRating">
                <div className="craftStars">
                  {renderStars(product.rating)}
                </div>
                <span className="craftReviewCount">
                  ({product.reviews})
                </span>
              </div>

              {/* FİYAT */}
              <div className="craftProductPriceWrap">
                <div className="craftPriceBox">
                  <span className="craftPriceCurrent">
                    ${product.price}
                  </span>
                  <span className="craftPriceOld">
                    ${product.oldPrice}
                  </span>
                </div>
                <span className="craftDiscount">
                  -{product.discount}%
                </span>
              </div>

              {/* STOK DURUMU */}
              {product.stock > 0 && product.stock < 30 && (
                <div className="craftProductStock">
                  <span>Acele et! Sadece {product.stock} ürün kaldı</span>
                  <div className="craftStockBar">
                    <div 
                      className="craftStockFill" 
                      style={{ width: `${(product.stock / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* SEPETE EKLE BUTONU */}
              <button className="craftProductAdd" disabled={product.stock === 0}>
                <span>{product.stock === 0 ? 'TÜKENDİ' : 'Sepete Ekle'}</span>
                <span className="material-icons-outlined">
                  {product.stock === 0 ? 'block' : 'shopping_cart'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TÜM ÜRÜNLERİ GÖR BUTONU */}
      <div className="craftFeaturedFooter">
        <button className="craftFeaturedAllBtn">
          Tüm Ürünleri Keşfet
          <span>→</span>
          <span className="craftFeaturedAllCount">{products.length} ürün</span>
        </button>
      </div>
    </section>
  );
};

export default Featured;