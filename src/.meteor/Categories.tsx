import React from 'react';
import './categories.css';

// KATEGORİ VERİLERİ
const categories = [
  { 
    id: 1, 
    icon: '💻', 
    name: 'Laptop', 
    count: '124 ürün',
    desc: 'Oyun, ofis, iş istasyonu'
  },
  { 
    id: 2, 
    icon: '📱', 
    name: 'Telefon', 
    count: '89 ürün',
    desc: 'Akıllı telefonlar, aksesuarlar'
  },
  { 
    id: 3, 
    icon: '🎧', 
    name: 'Kulaklık', 
    count: '56 ürün',
    desc: 'Kablosuz, ANC, spor'
  },
  { 
    id: 4, 
    icon: '⌚', 
    name: 'Saat', 
    count: '34 ürün',
    desc: 'Akıllı saat, fitness takip'
  },
  { 
    id: 5, 
    icon: '📷', 
    name: 'Kamera', 
    count: '28 ürün',
    desc: 'DSLR, aynasız, aksiyon'
  },
  { 
    id: 6, 
    icon: '🎮', 
    name: 'Oyun', 
    count: '67 ürün',
    desc: 'Konsol, oyun bilgisayarı'
  },
  { 
    id: 7, 
    icon: '🔊', 
    name: 'Ses Sistemleri', 
    count: '42 ürün',
    desc: 'Hoparlör, soundbar'
  },
  { 
    id: 8, 
    icon: '⌨️', 
    name: 'Aksesuar', 
    count: '103 ürün',
    desc: 'Mouse, klavye, kılıf'
  },
  { 
    id: 9, 
    icon: '🖥️', 
    name: 'Monitör', 
    count: '31 ürün',
    desc: '4K, oyun, profesyonel'
  },
  { 
    id: 10, 
    icon: '📟', 
    name: 'Tablet', 
    count: '27 ürün',
    desc: 'iPad, Android, kalem'
  },
  { 
    id: 11, 
    icon: '🔌', 
    name: 'Şarj', 
    count: '48 ürün',
    desc: 'Powerbank, adaptör'
  },
  { 
    id: 12, 
    icon: '🕶️', 
    name: 'VR/AR', 
    count: '16 ürün',
    desc: 'Sanal gerçeklik'
  }
];

const Categories: React.FC = () => {
  // İlk 6 kategoriyi göster
  const mainCategories = categories.slice(0, 6);
  const otherCategories = categories.slice(6);
  const otherCount = otherCategories.reduce((acc, cat) => acc + parseInt(cat.count), 0);

  return (
    <section className="craftCategories">
      {/* Dekoratif şekiller */}
      <div className="craftCategoriesShape craftCategoriesShape1"></div>
      <div className="craftCategoriesShape craftCategoriesShape2"></div>

      <div className="craftCategoriesHeader">
        <div className="craftCategoriesBadge">
          <span className="craftCategoriesBadgeIcon">✦</span>
          <span>KATEGORİLER</span>
          <span className="craftCategoriesBadgeIcon">✦</span>
        </div>
        <h2 className="craftCategoriesTitle">
          Ne arıyorsun?
        </h2>
        <p className="craftCategoriesDesc">
          Hayalindeki teknolojiye ulaşman için binlerce ürün, 
          yüzlerce marka seni bekliyor.
        </p>
      </div>

      {/* KATEGORİ GRID */}
      <div className="craftCategoriesGrid">
        {mainCategories.map((category) => (
          <div key={category.id} className="craftCategoryCard">
            <div className="craftCategoryIcon">
              {category.icon}
            </div>
            <h3 className="craftCategoryName">
              {category.name}
            </h3>
            <span className="craftCategoryCount">
              {category.count}
            </span>
            <div className="craftCategoryDesc">
              {category.desc}
            </div>
          </div>
        ))}

        {/* DİĞER KATEGORİLER KARTI */}
        <div className="craftCategoryCard craftCategoryCardOther">
          <div className="craftCategoryIcon">
            ⋯
          </div>
          <h3 className="craftCategoryName">
            Diğer
          </h3>
          <span className="craftCategoryCount">
            {otherCount} ürün
          </span>
          <div className="craftCategoryDesc">
            {otherCategories.length} kategori • Tüm ürünler
          </div>
        </div>
      </div>

      {/* ALT BİLGİ */}
      <div className="craftCategoriesFooter">
        <button className="craftCategoriesMore">
          Tüm Kategorileri Keşfet
          <span>→</span>
          <span className="craftCategoriesMoreCount">
            {categories.length} kategori
          </span>
        </button>
      </div>
    </section>
  );
};

export default Categories;