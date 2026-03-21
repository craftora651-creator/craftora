// components/Hero.tsx
import React, { useState, useEffect, useCallback } from 'react';
import './hero.css';

const slides = [
  {
    id: 1,
    title: 'Bu Haftanın En Performanslıları',
    highlight: 'Performanslıları',
    desc: 'En çok satan, en beğenilen, en yüksek puanlı ürünler bu hafta %40\'a varan indirimle seni bekliyor!',
    badge: '🔥 HAFTANIN FIRSATI',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    button: 'Hemen Keşfet',
    stats: ['500+ Ürün', '40% İndirim', 'Ücretsiz Kargo']
  },
  {
    id: 2,
    title: 'Bu Ayın En Çok İzlenen Kursları',
    highlight: 'İzlenen Kursları',
    desc: 'Yazılımdan tasarıma, pazarlamadan veri bilimine en popüler 50+ kurs şimdi sınırlı süre %50 indirimli!',
    badge: '📚 EĞİTİM AYI',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    button: 'Kursları İncele',
    stats: ['50+ Kurs', '50% İndirim', 'Sertifikalı']
  },
  {
    id: 3,
    title: 'Yeni Sezon Teknoloji',
    highlight: 'Teknoloji',
    desc: '2024\'ün en yeni gadget\'ları, akıllı saatler, kablosuz kulaklıklar ve daha fazlası ilk alışverişe özel %20 indirim!',
    badge: '✨ YENİ SEZON',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    button: 'Yeni Ürünler',
    stats: ['100+ Ürün', '20% İndirim', '1 Yıl Garanti']
  },
  {
    id: 4,
    title: 'Süper Fırsat: 2 Al 1 Öde',
    highlight: '2 Al 1 Öde',
    desc: 'Seçili elektronik ürünlerde 2 al 1 öde fırsatı! Sınırlı stok, kaçırmayın! Hemen sepete ekle.',
    badge: '🎁 SÜPER FIRSAT',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    button: 'Fırsatı Yakala',
    stats: ['2 Al 1 Öde', 'Sınırlı Stok', 'Ücretsiz İade']
  },
  {
    id: 5,
    title: 'Premium Destek 7/24',
    highlight: '7/24',
    desc: 'Yılbaşına özel, tüm premium üyeliklerde %50 indirim! Sınırsız danışmanlık ve öncelikli destek.',
    badge: '⭐ ÖZEL FIRSAT',
    image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
    button: 'Premium\'a Geç',
    stats: ['7/24 Destek', '50% İndirim', 'Öncelikli']
  }
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide, isAutoPlaying]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 0.5;
      });
    }, 35);
    return () => clearInterval(timer);
  }, [current, isAutoPlaying]);

  // Partikülleri oluştur
  const particles = Array(10).fill(0).map((_, i) => (
    <div key={i} className="craftParticle" />
  ));

  return (
    <section 
      className="craftHero"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Partikül efekti */}
      <div className="craftHeroParticles">
        {particles}
      </div>

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`craftSlide ${index === current ? 'craftSlideActive' : ''}`}
        >
          <div 
            className="craftSlideBg"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="craftOverlay" />
          
          <div className="craftContainer">
            <div className="craftContent">
              <span className="craftBadge">
                <span className="craftBadgeIcon">{slide.badge.split(' ')[0]}</span>
                <span>{slide.badge.slice(2)}</span>
              </span>
              
              <h1 className="craftTitle">
                {slide.title.split(slide.highlight)[0]}
                <span className="craftHighlight">{slide.highlight}</span>
                {slide.title.split(slide.highlight)[1]}
              </h1>
              
              <p className="craftDesc">{slide.desc}</p>
              
              <button className="craftButton">
                <span className="craftButtonText">{slide.button}</span>
                <span className="craftButtonIcon">→</span>
                <span className="craftButtonRipple"></span>
              </button>
              
              <div className="craftStats">
                {slide.stats.map((stat, i) => (
                  <div key={i} className="craftStatItem" style={{ '--stat-index': i } as any}>
                    <span className="craftStatNumber">{stat.split(' ')[0]}</span>
                    <span className="craftStatLabel">{stat.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button className="craftPrev" onClick={prevSlide}>←</button>
      <button className="craftNext" onClick={nextSlide}>→</button>

      <div className="craftDots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`craftDot ${index === current ? 'craftDotActive' : ''}`}
            onClick={() => {
              setCurrent(index);
              setProgress(0);
            }}
          />
        ))}
      </div>

      <div 
        className="craftProgress"
        style={{ width: `${progress}%` }}
      />

      <div className="craftScrollIndicator">
        <span>SCROLL</span>
        <div className="craftScrollLine"></div>
      </div>
    </section>
  );
};

export default Hero;