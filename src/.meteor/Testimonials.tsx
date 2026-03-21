/* components/Testimonials.tsx */
import React, { useState } from 'react';
import './testimonials.css';

// YORUM VERİLERİ
const testimonials = [
  {
    id: 1,
    user: {
      name: 'Ahmet Yılmaz',
      avatar: '👨‍💻',
      location: 'İstanbul',
      verified: true,
      purchases: 12
    },
    rating: 5,
    date: '2 gün önce',
    text: 'MacBook Pro M3 modelini sipariş verdim, ertesi gün elime ulaştı. Cihaz harika, pil ömrü inanılmaz. TechVerse mağazasına da ayrıca teşekkürler, orijinal ürün ve sıfır sorun!',
    product: {
      name: 'MacBook Pro 14" M3',
      image: '💻',
      store: 'TechVerse'
    },
    likes: 124,
    verified: true,
    tags: ['laptop', 'apple', 'hızlı kargo']
  },
  {
    id: 2,
    user: {
      name: 'Zeynep Kaya',
      avatar: '👩‍🎨',
      location: 'Ankara',
      verified: true,
      purchases: 8
    },
    rating: 5,
    date: '3 gün önce',
    text: 'Sony WH-1000XM5 kulaklık için yorumlara güvenip aldım ve pişman değilim. Ses kalitesi mükemmel, gürültü engelleme harika. GadgetHub hızlı gönderim ve güzel paketleme için teşekkürler!',
    product: {
      name: 'Sony WH-1000XM5',
      image: '🎧',
      store: 'GadgetHub'
    },
    likes: 89,
    verified: true,
    tags: ['kulaklık', 'sony', 'ses']
  },
  {
    id: 3,
    user: {
      name: 'Mehmet Demir',
      avatar: '👨‍🏫',
      location: 'İzmir',
      verified: true,
      purchases: 5
    },
    rating: 4,
    date: '5 gün önce',
    text: 'iPad Pro 12.9" aldım, tasarım ve performans muhteşem. Tek sorun fiyatı biraz yüksek geldi ama değiyor. DigitalDream mağazası ilgiliydi, teşekkürler.',
    product: {
      name: 'iPad Pro 12.9"',
      image: '📱',
      store: 'DigitalDream'
    },
    likes: 56,
    verified: true,
    tags: ['tablet', 'apple', 'ipad']
  },
  {
    id: 4,
    user: {
      name: 'Elif Yıldız',
      avatar: '👩‍🔬',
      location: 'Bursa',
      verified: true,
      purchases: 15
    },
    rating: 5,
    date: '1 hafta önce',
    product: {
      name: 'PS5 Slim Digital',
      image: '🎮',
      store: 'GameStation'
    },
    likes: 167,
    verified: true,
    tags: ['oyun', 'playstation', 'konsol']
  },
  {
    id: 5,
    user: {
      name: 'Can Öztürk',
      avatar: '👨‍🎤',
      location: 'Antalya',
      verified: false,
      purchases: 3
    },
    rating: 5,
    date: '1 hafta önce',
    product: {
      name: 'Logitech MX Master 3S',
      image: '🖱️',
      store: 'SoundWave'
    },
    likes: 78,
    verified: false,
    tags: ['mouse', 'logitech', 'aksesuar']
  },
  {
    id: 6,
    user: {
      name: 'Seda Aydın',
      avatar: '👩‍💼',
      location: 'Kocaeli',
      verified: true,
      purchases: 7
    },
    rating: 5,
    date: '2 hafta önce',
    
    product: {
      name: 'iPhone 15 Pro Max',
      image: '📱',
      store: 'TechVerse'
    },
    likes: 145,
    verified: true,
    tags: ['telefon', 'apple', 'iphone']
  }
];

// FİLTRE ETİKETLERİ
const filterTags = [
  { id: 'all', label: 'Tüm Yorumlar', icon: '💬' },
  { id: '5star', label: '5 Yıldız', icon: '⭐⭐⭐⭐⭐' },
  { id: '4star', label: '4 Yıldız', icon: '⭐⭐⭐⭐' },
  { id: 'laptop', label: 'Laptop', icon: '💻' },
  { id: 'phone', label: 'Telefon', icon: '📱' },
  { id: 'audio', label: 'Ses', icon: '🎧' },
  { id: 'gaming', label: 'Oyun', icon: '🎮' }
];

const Testimonials: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filtreleme fonksiyonu
  const filteredTestimonials = testimonials.filter(testimonial => {
    if (activeFilter === 'all') return true;
    if (activeFilter === '5star') return testimonial.rating === 5;
    if (activeFilter === '4star') return testimonial.rating === 4;
    if (activeFilter === 'laptop') return testimonial.tags.includes('laptop');
    if (activeFilter === 'phone') return testimonial.tags.includes('telefon');
    if (activeFilter === 'audio') return testimonial.tags.includes('kulaklık') || testimonial.tags.includes('ses');
    if (activeFilter === 'gaming') return testimonial.tags.includes('oyun');
    return true;
  });

  // Ortalama puan hesapla
  const averageRating = (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1);
  const totalReviews = testimonials.length;

  // Yıldız render
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#ffc107' : '#e0e0e0' }}>★</span>
    ));
  };

  return (
    <section className="kanka_testimonials_efsane_abi">
      <div className="kanka_testimonials_container_abi">
        
        {/* HEADER */}
        <div className="kanka_testimonials_header_abi">
          <span className="kanka_testimonials_badge_abi">
            ⭐ MÜŞTERİ YORUMLARI ⭐
          </span>
          <h2 className="kanka_testimonials_title_abi">
            <span>Gerçek müşteriler</span>, gerçek deneyimler
          </h2>
          <p className="kanka_testimonials_desc_abi">
            Binlerce müşterimiz alışveriş deneyimlerini paylaştı. 
            Sen de Craftora farkını keşfedenler arasına katıl!
          </p>
        </div>

        {/* GENEL PUAN */}
        <div className="kanka_testimonials_rating_overall_abi">
          <div className="kanka_overall_score_abi">
            <div className="kanka_overall_number_abi">{averageRating}</div>
            <div className="kanka_overall_label_abi">ORTALAMA PUAN</div>
          </div>
          <div className="kanka_overall_stars_abi">
            <div className="kanka_stars_large_abi">
              {renderStars(Number(averageRating))}
            </div>
            <div className="kanka_overall_total_abi">
              {totalReviews} yorum
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
          }}>
            <span style={{
              padding: '8px 20px',
              background: 'rgba(139,92,246,0.05)',
              borderRadius: '40px',
              color: '#8B5CF6',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              ✓ %98 memnuniyet
            </span>
          </div>
        </div>

        {/* FİLTRELER */}
        <div className="kanka_testimonials_filters_abi">
          {filterTags.map((tag) => (
            <button
              key={tag.id}
              className={`kanka_filter_tag_abi ${activeFilter === tag.id ? 'kanka_filter_active_abi' : ''}`}
              onClick={() => setActiveFilter(tag.id)}
            >
              <span>{tag.icon}</span>
              <span>{tag.label}</span>
            </button>
          ))}
        </div>

        {/* YORUM GRID */}
        <div className="kanka_testimonials_grid_abi">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="kanka_testimonial_card_abi">
              
              {/* DOĞRULANMIŞ BADGE */}
              {testimonial.verified && (
                <div className="kanka_testimonial_badge_abi">
                  <span>✓</span>
                  <span>Doğrulanmış Alışveriş</span>
                </div>
              )}

              {/* KULLANICI */}
              <div className="kanka_testimonial_user_abi">
                <div className="kanka_testimonial_avatar_abi">
                  {testimonial.user.avatar}
                </div>
                <div className="kanka_testimonial_user_info_abi">
                  <h4>{testimonial.user.name}</h4>
                  <p>
                    <span>{testimonial.user.location}</span>
                    {testimonial.user.verified && (
                      <span className="kanka_verified_badge_abi">✓ Onaylı Hesap</span>
                    )}
                  </p>
                </div>
              </div>

              {/* PUAN */}
              <div className="kanka_testimonial_rating_abi">
                <div className="kanka_testimonial_stars_abi">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="kanka_testimonial_date_abi">
                  {testimonial.date}
                </span>
              </div>

              {/* YORUM */}
              <p className="kanka_testimonial_text_abi">
                "{testimonial.text}"
              </p>

              {/* SATIN ALINAN ÜRÜN */}
              <div className="kanka_testimonial_product_abi">
                <div className="kanka_testimonial_product_image_abi">
                  {testimonial.product.image}
                </div>
                <div className="kanka_testimonial_product_info_abi">
                  <h5>{testimonial.product.name}</h5>
                  <p>{testimonial.product.store} mağazasından</p>
                </div>
              </div>

              {/* İSTATİSTİKLER */}
              <div className="kanka_testimonial_stats_abi">
                <div className="kanka_testimonial_likes_abi">
                  <span>❤️</span>
                  <span>{testimonial.likes} kişi beğendi</span>
                </div>
                <div className="kanka_testimonial_share_abi">
                  <span>↗️</span>
                  <span>Paylaş</span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* DAHA FAZLA YORUM */}
        <div className="kanka_testimonials_more_abi">
          <button className="kanka_testimonials_btn_abi">
            <span>TÜM YORUMLARI GÖR</span>
            <span>→</span>
          </button>
          <p style={{
            marginTop: '25px',
            color: '#8aa0a0',
            fontSize: '14px'
          }}>
            Toplam 12.432 doğrulanmış müşteri yorumu
          </p>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;