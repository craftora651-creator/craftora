/* components/StoreProducts.tsx */
import React, { useState } from 'react';
import './store_products.css';

// ===== MAĞAZA VERİLERİ =====
const stores = [
  {
    id: 1,
    name: 'TechVerse',
    logo: '🚀',
    rating: 4.9,
    reviews: 12453,
    sales: '154.2K',
    verified: true,
    color: '#8B5CF6'
  },
  {
    id: 2,
    name: 'GadgetHub',
    logo: '⚡',
    rating: 4.8,
    reviews: 9876,
    sales: '98.7K',
    verified: true,
    color: '#EC4899'
  },
  {
    id: 3,
    name: 'DigitalDream',
    logo: '💭',
    rating: 4.9,
    reviews: 7654,
    sales: '76.3K',
    verified: true,
    color: '#3B82F6'
  },
  {
    id: 4,
    name: 'SoundWave',
    logo: '🎵',
    rating: 4.7,
    reviews: 5432,
    sales: '52.1K',
    verified: false,
    color: '#10B981'
  },
  {
    id: 5,
    name: 'GameStation',
    logo: '🎮',
    rating: 4.8,
    reviews: 8765,
    sales: '87.9K',
    verified: true,
    color: '#F59E0B'
  }
];

// ===== ÜRÜN VERİLERİ (Mağazaya özel) =====
const storeProducts = {
  1: [ // TechVerse
    {
      id: 101,
      name: 'MacBook Pro 14" M3',
      category: 'Laptop',
      price: 1299,
      oldPrice: 1499,
      rating: 4.9,
      reviews: 324,
      sales: '12.4K',
      trend: '+34%',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1026&q=80',
      badge: '🔥 EN ÇOK SATAN',
      badgeType: 'hot',
      store: 'TechVerse'
    },
    {
      id: 102,
      name: 'iPad Pro 12.9"',
      category: 'Tablet',
      price: 1099,
      oldPrice: 1299,
      rating: 4.8,
      reviews: 256,
      sales: '8.9K',
      trend: '+28%',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      badge: '⭐ POPÜLER',
      badgeType: 'selling',
      store: 'TechVerse'
    },
    {
      id: 103,
      name: 'iPhone 15 Pro',
      category: 'Telefon',
      price: 1199,
      oldPrice: 1299,
      rating: 4.9,
      reviews: 567,
      sales: '23.1K',
      trend: '+56%',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      badge: '🚀 HAFTANIN ÜRÜNÜ',
      badgeType: 'hot',
      store: 'TechVerse'
    }
  ],
  2: [ // GadgetHub
    {
      id: 201,
      name: 'Sony WH-1000XM5',
      category: 'Kulaklık',
      price: 299,
      oldPrice: 399,
      rating: 4.9,
      reviews: 892,
      sales: '45.2K',
      trend: '+67%',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80',
      badge: '🎧 EN ÇOK SATAN',
      badgeType: 'hot',
      store: 'GadgetHub'
    },
    {
      id: 202,
      name: 'Apple Watch Series 9',
      category: 'Saat',
      price: 429,
      oldPrice: 499,
      rating: 4.8,
      reviews: 445,
      sales: '18.3K',
      trend: '+42%',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80',
      badge: '⌚ POPÜLER',
      badgeType: 'selling',
      store: 'GadgetHub'
    },
    {
      id: 203,
      name: 'AirPods Pro 2',
      category: 'Kulaklık',
      price: 199,
      oldPrice: 249,
      rating: 4.8,
      reviews: 678,
      sales: '34.5K',
      trend: '+51%',
      image: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      badge: '⚡ SÜPER FIRSAT',
      badgeType: 'hot',
      store: 'GadgetHub'
    }
  ],
  3: [ // DigitalDream
    {
      id: 301,
      name: 'Samsung Odyssey G9',
      category: 'Monitör',
      price: 999,
      oldPrice: 1299,
      rating: 4.7,
      reviews: 234,
      sales: '6.7K',
      trend: '+23%',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      badge: '🖥️ EN ÇOK SATAN',
      badgeType: 'hot',
      store: 'DigitalDream'
    },
    {
      id: 302,
      name: 'Logitech MX Master 3S',
      category: 'Aksesuar',
      price: 89,
      oldPrice: 119,
      rating: 4.9,
      reviews: 567,
      sales: '28.9K',
      trend: '+73%',
      image: 'https://images.unsplash.com/photo-1629429408209-1f912961db12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      badge: '🖱️ POPÜLER',
      badgeType: 'selling',
      store: 'DigitalDream'
    },
    {
      id: 303,
      name: 'Keychron Q1 Pro',
      category: 'Aksesuar',
      price: 199,
      oldPrice: 229,
      rating: 4.8,
      reviews: 178,
      sales: '5.2K',
      trend: '+89%',
      image: 'https://images.unsplash.com/photo-1595225476474-87563907f212?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      badge: '✨ YENİ',
      badgeType: 'new',
      store: 'DigitalDream'
    }
  ],
  4: [ // SoundWave
    {
      id: 401,
      name: 'Marshall Stanmore III',
      category: 'Hoparlör',
      price: 349,
      oldPrice: 399,
      rating: 4.8,
      reviews: 345,
      sales: '9.8K',
      trend: '+31%',
      image: 'https://images.unsplash.com/photo-1545454678-3531b543be5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      badge: '🔊 EN ÇOK SATAN',
      badgeType: 'hot',
      store: 'SoundWave'
    },
    {
      id: 402,
      name: 'JBL Charge 5',
      category: 'Hoparlör',
      price: 149,
      oldPrice: 179,
      rating: 4.7,
      reviews: 456,
      sales: '34.2K',
      trend: '+45%',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      badge: '🔋 POPÜLER',
      badgeType: 'selling',
      store: 'SoundWave'
    }
  ],
  5: [ // GameStation
    {
      id: 501,
      name: 'PS5 Slim Digital',
      category: 'Oyun',
      price: 449,
      oldPrice: 499,
      rating: 4.9,
      reviews: 892,
      sales: '67.3K',
      trend: '+92%',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
      badge: '🎮 EN ÇOK SATAN',
      badgeType: 'hot',
      store: 'GameStation'
    },
    {
      id: 502,
      name: 'Xbox Series X',
      category: 'Oyun',
      price: 499,
      oldPrice: 549,
      rating: 4.8,
      reviews: 567,
      sales: '45.6K',
      trend: '+58%',
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      badge: '🎯 POPÜLER',
      badgeType: 'selling',
      store: 'GameStation'
    },
    {
      id: 503,
      name: 'Nintendo Switch OLED',
      category: 'Oyun',
      price: 299,
      oldPrice: 349,
      rating: 4.8,
      reviews: 445,
      sales: '34.8K',
      trend: '+47%',
      image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      badge: '✨ YENİ',
      badgeType: 'new',
      store: 'GameStation'
    }
  ]
};

// Ürün kategorileri
const productCategories = ['Tümü', 'En Çok Satanlar', 'Popüler Ürünler', 'Yeni Çıkanlar'];

const StoreProducts: React.FC = () => {
  const [activeStore, setActiveStore] = useState(1);
  const [activeCategory, setActiveCategory] = useState('Tümü');

  // Aktif mağazanın ürünlerini getir
  const currentProducts = storeProducts[activeStore as keyof typeof storeProducts] || [];
  
  // Kategoriye göre filtrele
  const filteredProducts = currentProducts.filter(product => {
    if (activeCategory === 'Tümü') return true;
    if (activeCategory === 'En Çok Satanlar') return product.badgeType === 'hot';
    if (activeCategory === 'Popüler Ürünler') return product.badgeType === 'selling';
    if (activeCategory === 'Yeni Çıkanlar') return product.badgeType === 'new';
    return true;
  });

  // Aktif mağaza bilgisi
  const activeStoreData = stores.find(s => s.id === activeStore)!;

  // Badge tipine göre renk
  const getBadgeClass = (type: string) => {
    switch(type) {
      case 'hot': return 'kanka_store_product_badge_hot_abi';
      case 'selling': return 'kanka_store_product_badge_selling_abi';
      default: return '';
    }
  };

  return (
    <section className="kanka_store_products_efsane_abi">
      <div className="kanka_store_header_abi">
        <span className="kanka_store_badge_abi">
          🏪 MAĞAZA ÖZEL 🏪
        </span>
        <h2 className="kanka_store_title_abi">
          <span>Popüler mağazaların</span> en çok satanları
        </h2>
        <p className="kanka_store_desc_abi">
          Her mağazanın kendi vitrininden seçilmiş, en popüler ve en çok tercih edilen ürünler. 
          Hangi mağazayı merak ediyorsun?
        </p>
      </div>

      {/* MAĞAZA SEÇİCİ */}
      <div className="kanka_store_selector_abi">
        <div className="kanka_store_tabs_abi">
          {stores.map((store) => (
            <button
              key={store.id}
              className={`kanka_store_tab_abi ${activeStore === store.id ? 'kanka_store_tab_active_abi' : ''}`}
              onClick={() => setActiveStore(store.id)}
              style={{
                background: activeStore === store.id ? `linear-gradient(145deg, ${store.color}, ${store.color}dd)` : '',
                borderColor: activeStore === store.id ? store.color : ''
              }}
            >
              <span className="kanka_store_tab_icon_abi">{store.logo}</span>
              <span>{store.name}</span>
            </button>
          ))}
        </div>

        {/* MAĞAZA BİLGİ KARTI */}
        <div className="kanka_store_featured_abi">
          <div className="kanka_store_featured_info_abi">
            <div 
              className="kanka_store_featured_logo_abi"
              style={{ background: `linear-gradient(145deg, ${activeStoreData.color}, ${activeStoreData.color}dd)` }}
            >
              {activeStoreData.logo}
            </div>
            <div className="kanka_store_featured_details_abi">
              <h3>{activeStoreData.name}</h3>
              <div className="kanka_store_featured_stats_abi">
                <span className="kanka_store_featured_rating_abi">★ {activeStoreData.rating}</span>
                <span>📊 {activeStoreData.reviews.toLocaleString()} yorum</span>
                <span>📦 {activeStoreData.sales} satış</span>
                {activeStoreData.verified && (
                  <span style={{ color: '#4CAF50' }}>✓ Onaylı Mağaza</span>
                )}
              </div>
            </div>
          </div>
          <button className="kanka_store_featured_btn_abi">
            MAĞAZAYI ZİYARET ET →
          </button>
        </div>

        {/* ÜRÜN KATEGORİLERİ */}
        <div className="kanka_product_tabs_abi">
          {productCategories.map((cat) => (
            <button
              key={cat}
              className={`kanka_product_tab_abi ${activeCategory === cat ? 'kanka_product_tab_active_abi' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ÜRÜN GRID */}
      <div className="kanka_store_products_grid_abi">
        {filteredProducts.map((product) => (
          <div key={product.id} className="kanka_store_product_card_abi">
            
            {/* BADGE */}
            {product.badge && (
              <div className={`kanka_store_product_badge_abi ${getBadgeClass(product.badgeType)}`}>
                {product.badge}
              </div>
            )}

            {/* RESİM */}
            <div className="kanka_store_product_image_wrap_abi">
              <img 
                src={product.image} 
                alt={product.name}
                className="kanka_store_product_image_abi"
                loading="lazy"
              />
              
              {/* MAĞAZA ETİKETİ */}
              <div className="kanka_store_product_store_abi">
                <span>{activeStoreData.logo}</span>
                <span>{product.store}</span>
              </div>
            </div>

            {/* ÜRÜN BİLGİLERİ */}
            <div className="kanka_store_product_info_abi">
              <div className="kanka_store_product_category_abi">
                <span className="kanka_store_product_cat_abi">
                  {product.category}
                </span>
                <div className="kanka_store_product_rating_abi">
                  <span>★</span> {product.rating}
                  <span style={{ color: '#8aa0a0', marginLeft: '5px' }}>
                    ({product.reviews})
                  </span>
                </div>
              </div>

              <h3 className="kanka_store_product_title_abi">
                {product.name}
              </h3>

              {/* SATIŞ İSTATİSTİKLERİ */}
              <div className="kanka_store_product_stats_abi">
                <div className="kanka_store_product_sales_abi">
                  <span>📦</span> {product.sales} satış
                </div>
                <div className="kanka_store_product_trend_abi">
                  <span>📈</span> {product.trend}
                </div>
              </div>

              {/* FİYAT */}
              <div className="kanka_store_product_price_wrap_abi">
                <div className="kanka_store_price_box_abi">
                  <span className="kanka_store_price_current_abi">
                    ${product.price}
                  </span>
                  <span className="kanka_store_price_old_abi">
                    ${product.oldPrice}
                  </span>
                </div>
                <span style={{ 
                  background: 'rgba(139,92,246,0.1)', 
                  color: '#8B5CF6',
                  padding: '5px 12px',
                  borderRadius: '30px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              </div>

              {/* SEPETE EKLE */}
              <button className="kanka_store_product_add_abi">
                <span>SEPETE EKLE</span>
                <span className="material-icons-outlined">shopping_cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DAHA FAZLA ÜRÜN BUTONU */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <button style={{
          padding: '18px 48px',
          background: 'linear-gradient(145deg, #8B5CF6, #7C3AED)',
          border: 'none',
          borderRadius: '60px',
          color: 'white',
          fontSize: '16px',
          fontWeight: '700',
          letterSpacing: '3px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '15px',
          boxShadow: '0 20px 40px rgba(139,92,246,0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 30px 50px rgba(139,92,246,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(139,92,246,0.3)';
        }}>
          <span>{activeStoreData.name} MAĞAZASININ TÜM ÜRÜNLERİ</span>
          <span>→</span>
        </button>
      </div>
    </section>
  );
};

export default StoreProducts;