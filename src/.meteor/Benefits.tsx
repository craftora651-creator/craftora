/* components/Benefits.tsx */
import React from 'react';
import './benefits.css';

const Benefits: React.FC = () => {
  // AVANTAJ VERİLERİ
  const benefits = [
    {
      id: 1,
      icon: '🚚',
      title: 'Ücretsiz Kargo',
      description: '40$ ve üzeri tüm siparişlerde ücretsiz kargo. 24 saat içinde kargoda!',
      badge: 'HER SİPARİŞTE',
      stats: '1.2M+ teslimat'
    },
    {
      id: 2,
      icon: '🛡️',
      title: '1 Yıl Garanti',
      description: 'Tüm ürünlerde 1 yıl resmi garanti. Uzatılmış garanti seçenekleri de mevcut.',
      badge: 'RESMİ GARANTİ',
      stats: '50K+ garanti işlemi'
    },
    {
      id: 3,
      icon: '🔄',
      title: 'Kolay İade',
      description: '30 gün içinde koşulsuz iade. Sorunsuz, hızlı, ücretsiz!',
      badge: '%100 MEMNUNİYET',
      stats: '99.7% iade memnuniyeti'
    },
    {
      id: 4,
      icon: '💎',
      title: 'Premium Destek',
      description: '7/24 canlı destek. Uzman ekibimiz her an yanında!',
      badge: '7/24 HİZMET',
      stats: '< 2 dk yanıt süresi'
    },
    {
      id: 5,
      icon: '🔒',
      title: 'Güvenli Ödeme',
      description: '256-bit SSL şifreleme. Tüm kredi kartları ve havale seçenekleri.',
      badge: 'SSL SECURED',
      stats: '500K+ güvenli işlem'
    },
    {
      id: 6,
      icon: '🎁',
      title: 'Özel Kampanyalar',
      description: 'Haftalık sürpriz indirimler, sadakat puanları, doğum günü sürprizleri!',
      badge: 'SADECE ÜYELERE',
      stats: '200+ aktif kampanya'
    },
    {
      id: 7,
      icon: '🔧',
      title: 'Teknik Servis',
      description: 'Yetkili servis desteği. Yedek parça, tamir, bakım hizmetleri.',
      badge: 'YETKİLİ SERVİS',
      stats: '34 ilde servis'
    },
    {
      id: 8,
      icon: '📱',
      title: 'Mobil Uygulama',
      description: 'iOS ve Android uygulamalarımızla alışveriş cebinde!',
      badge: '4.9 ★',
      stats: '100K+ indirme'
    }
  ];

  // İSTATİSTİK VERİLERİ
  const stats = [
    { number: '1.5M+', label: 'Mutlu Müşteri' },
    { number: '250K+', label: 'Yıllık Sipariş' },
    { number: '98%', label: 'Müşteri Memnuniyeti' },
    { number: '24/7', label: 'Canlı Destek' }
  ];

  return (
    <section className="kanka_benefits_efsane_abi">
      <div className="kanka_benefits_light_abi"></div>
      
      <div className="kanka_benefits_container_abi">
        
        {/* HEADER */}
        <div className="kanka_benefits_header_abi">
          <span className="kanka_benefits_badge_abi">
            ⚡ NEDEN CRAFTORA? ⚡
          </span>
          <h2 className="kanka_benefits_title_abi">
            <span>Rakiplerden</span> ayrışan avantajlar
          </h2>
          <p className="kanka_benefits_desc_abi">
            Sadece ürün satmıyoruz, mükemmel bir alışveriş deneyimi sunuyoruz. 
            İşte bizi farklı kılan özelliklerimiz...
          </p>
        </div>

        {/* AVANTAJ GRID */}
        <div className="kanka_benefits_grid_abi">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="kanka_benefit_card_abi">
              <div className="kanka_benefit_icon_wrap_abi">
                <span className="kanka_benefit_icon_abi">{benefit.icon}</span>
              </div>
              <h3 className="kanka_benefit_title_abi">{benefit.title}</h3>
              <p className="kanka_benefit_text_abi">{benefit.description}</p>
              <div className="kanka_benefit_badge_abi">
                {benefit.badge}
              </div>
              <div style={{ 
                marginTop: '20px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '1px'
              }}>
                {benefit.stats}
              </div>
            </div>
          ))}
        </div>

        {/* İSTATİSTİKLER */}
        <div className="kanka_stats_showcase_abi">
          {stats.map((stat, index) => (
            <div key={index} className="kanka_stat_showcase_abi">
              <div className="kanka_stat_number_showcase_abi">
                {stat.number}
              </div>
              <div className="kanka_stat_label_showcase_abi">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* GARANTİ BÖLÜMÜ */}
        <div className="kanka_guarantee_abi">
          <div className="kanka_guarantee_content_abi">
            <div className="kanka_guarantee_icon_abi">
              ✓
            </div>
            <div className="kanka_guarantee_text_abi">
              <h4>%100 Memnuniyet Garantisi</h4>
              <p>
                Beğenmediğin ürünü 30 gün içinde koşulsuz iade et, 
                paran cebine geri dönsün. Bu kadar basit!
              </p>
            </div>
          </div>
          <button className="kanka_guarantee_btn_abi">
            DETAYLI İNCELE →
          </button>
        </div>

        {/* EKSTRA GÜVEN MESAJI */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          padding: '30px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '40px',
          border: '1px solid rgba(255,255,255,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '24px',
              fontWeight: '800',
              color: 'white',
              letterSpacing: '2px'
            }}>
              ✦ GÜVENLİ ALIŞVERİŞİN ADRESİ ✦
            </span>
            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center'
            }}>
              <span style={{
                padding: '8px 20px',
                background: 'rgba(77,182,172,0.1)',
                borderRadius: '40px',
                color: '#4db6ac',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                ★ TRUSTED STORE
              </span>
              <span style={{
                padding: '8px 20px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '40px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                ✓ PCI COMPLIANT
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Benefits;