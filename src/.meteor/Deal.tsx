/* components/Deal.tsx */
import React, { useState, useEffect } from 'react';
import './deal.css';

// POPÜLER MAĞAZA VERİLERİ
const topStores = [
  {
    id: 1,
    name: 'TechVerse',
    verified: true,
    rating: 4.9,
    reviews: 12453,
    sales: '154.2K',
    trend: '+24%',
    category: 'Elektronik',
    rank: 1
  },
  {
    id: 2,
    name: 'GadgetHub',
    verified: true,
    rating: 4.8,
    reviews: 9876,
    sales: '98.7K',
    trend: '+18%',
    category: 'Aksesuar',
    rank: 2
  },
  {
    id: 3,
    name: 'DigitalDream',
    verified: true,
    rating: 4.9,
    reviews: 7654,
    sales: '76.3K',
    trend: '+31%',
    category: 'Bilgisayar',
    rank: 3
  },
  {
    id: 4,
    name: 'SoundWave',
    verified: false,
    rating: 4.7,
    reviews: 5432,
    sales: '52.1K',
    trend: '+15%',
    category: 'Ses Sistemleri',
    rank: 4
  },
  {
    id: 5,
    name: 'GameStation',
    verified: true,
    rating: 4.8,
    reviews: 8765,
    sales: '87.9K',
    trend: '+42%',
    category: 'Oyun',
    rank: 5
  }
];

const Deal: React.FC = () => {
  // COUNTDOWN TIMER
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rank'e göre madalyon stili
  const getRankClass = (rank: number) => {
    switch(rank) {
      case 1: return 'kanka_rank_1_abi';
      case 2: return 'kanka_rank_2_abi';
      case 3: return 'kanka_rank_3_abi';
      default: return '';
    }
  };

  // Sayı formatla
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <section className="kanka_deal_efsane_abi">
      {/* IŞIK ÇİZGİLERİ */}
      <div className="kanka_deal_light_1_abi"></div>
      <div className="kanka_deal_light_2_abi"></div>

      <div className="kanka_deal_container_abi">
        
        {/* SOL TARAF - ÖZEL TEKLİF */}
        <div className="kanka_deal_left_abi">
          <span className="kanka_deal_badge_abi">
            ⚡ SON 23 SAAT ⚡
          </span>
          
          <h2 className="kanka_deal_title_abi">
            Bu haftanın <br />
            <span className="kanka_deal_highlight_abi">süper fırsatı</span>
          </h2>
          
          <p className="kanka_deal_desc_abi">
            Sınırlı stok, kaçmaz fiyat! En popüler ürünlerde 
            %70'e varan indirim seni bekliyor.
          </p>

          {/* COUNTDOWN TIMER */}
          <div className="kanka_deal_timer_wrap_abi">
            <div className="kanka_deal_timer_label_abi">
              <span></span> FIRSATIN BİTMESİNE <span></span>
            </div>
            
            <div className="kanka_deal_timer_abi">
              <div className="kanka_timer_block_abi">
                <div className="kanka_timer_number_abi">
                  {formatNumber(timeLeft.hours)}
                </div>
                <div className="kanka_timer_label_abi">SAAT</div>
              </div>
              <div className="kanka_timer_block_abi">
                <div className="kanka_timer_number_abi">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <div className="kanka_timer_label_abi">DAKİKA</div>
              </div>
              <div className="kanka_timer_block_abi">
                <div className="kanka_timer_number_abi">
                  {formatNumber(timeLeft.seconds)}
                </div>
                <div className="kanka_timer_label_abi">SANİYE</div>
              </div>
            </div>
          </div>

          {/* FIRSAT ÜRÜNÜ */}
          <div className="kanka_deal_product_abi">
            <div className="kanka_deal_product_image_abi">
              🎧
            </div>
            <div className="kanka_deal_product_info_abi">
              <h4 className="kanka_deal_product_name_abi">
                Sony WH-1000XM5
              </h4>
              <div className="kanka_deal_product_price_abi">
                <span className="kanka_deal_price_current_abi">
                  $249
                </span>
                <span className="kanka_deal_price_old_abi">
                  $399
                </span>
                <span style={{ 
                  background: '#ff6b6b', 
                  padding: '5px 12px', 
                  borderRadius: '30px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'white'
                }}>
                  -38%
                </span>
              </div>
              <div className="kanka_deal_product_stock_abi">
                <div className="kanka_deal_stock_bar_abi">
                  <div className="kanka_deal_stock_fill_abi" style={{ width: '30%' }}></div>
                </div>
                <span className="kanka_deal_stock_text_abi">
                  Stokta son 12 ürün!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ TARAF - POPÜLER MAĞAZALAR */}
        <div className="kanka_deal_right_abi">
          
          {/* REKABET MADALYONU */}
          <div className="kanka_competition_badge_abi">
            🏆 RAKİPLERİ EZİYORUZ
          </div>

          <h3 className="kanka_deal_title_small_abi">
            Bu ayın en <span>popüler</span> mağazaları
          </h3>

          <p style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            Binlerce satıcı arasından sıyrılan, müşterilerin 
            en çok tercih ettiği mağazalar.
          </p>

          {/* MAĞAZA LİSTESİ */}
          <div className="kanka_store_list_abi">
            {topStores.map((store) => (
              <div key={store.id} className="kanka_store_card_abi">
                
                {/* RANK MADALYONU */}
                <div className="kanka_store_rank_abi">
                  {store.rank <= 3 ? (
                    <div className={getRankClass(store.rank)}>
                      {store.rank}
                    </div>
                  ) : (
                    <span style={{ 
                      color: 'rgba(255,255,255,0.5)', 
                      fontSize: '20px',
                      fontWeight: '700'
                    }}>
                      {store.rank}
                    </span>
                  )}
                </div>

                {/* MAĞAZA BİLGİLERİ */}
                <div className="kanka_store_info_abi">
                  <div className="kanka_store_name_abi">
                    <h4>{store.name}</h4>
                    {store.verified && (
                      <span className="kanka_store_verified_abi">
                        ✓ Onaylı
                      </span>
                    )}
                  </div>
                  
                  <div className="kanka_store_stats_abi">
                    <div className="kanka_store_rating_abi">
                      <span>★</span> {store.rating}
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                        ({store.reviews.toLocaleString()})
                      </span>
                    </div>
                    <div className="kanka_store_sales_abi">
                      📦 {store.sales} satış
                    </div>
                    <div className="kanka_store_trend_abi">
                      <span className="kanka_trend_up_abi">
                        {store.trend}
                      </span>
                    </div>
                  </div>
                </div>

                {/* OK İKONU */}
                <div className="kanka_store_cta_abi">
                  →
                </div>
              </div>
            ))}
          </div>

          {/* CANLI YAYIN - REKABET */}
          <div className="kanka_live_badge_abi">
            <span className="kanka_live_dot_abi"></span>
            <span className="kanka_live_text_abi">
              CANLI - 1.234 kişi bu mağazaları inceliyor
            </span>
          </div>

          {/* TÜM MAĞAZALAR BUTONU */}
          <button style={{
            width: '100%',
            marginTop: '30px',
            padding: '18px',
            background: 'transparent',
            border: '2px solid rgba(255,215,0,0.3)',
            borderRadius: '60px',
            color: '#FFD700',
            fontSize: '15px',
            fontWeight: '700',
            letterSpacing: '3px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FFD700';
            e.currentTarget.style.color = '#1a2a2a';
            e.currentTarget.style.borderColor = '#FFD700';
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(255,215,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#FFD700';
            e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <span>TÜM MAĞAZALARI GÖR</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Deal;