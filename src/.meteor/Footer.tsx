/* components/Footer.tsx */
import React from 'react';
import './footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="kanka_footer_efsane_abi">
      
      {/* ===== NEWSLETTER BÖLÜMÜ ===== */}
      <div className="kanka_newsletter_efsane_abi">
        <div className="kanka_newsletter_container_abi">
          
          {/* SOL TARAF - METİN */}
          <div className="kanka_newsletter_content_abi">
            <span className="kanka_newsletter_badge_abi">
              ✉️ NEWSLETTER
            </span>
            <h2 className="kanka_newsletter_title_abi">
              Fırsatları <span>kaçırma</span>
            </h2>
            <p className="kanka_newsletter_desc_abi">
              Haftalık özel indirimler, yeni ürün haberleri ve 
              sürpriz kampanyalardan ilk sen haberdar ol!
            </p>
          </div>
          
          {/* SAĞ TARAF - FORM */}
          <div className="kanka_newsletter_form_wrap_abi">
            <form 
              className="kanka_newsletter_form_abi"
              onSubmit={(e) => {
                e.preventDefault();
                alert('📧 E-posta başarıyla kaydedildi! (Demo)');
              }}
            >
              <input 
                type="email" 
                placeholder="E-posta adresiniz"
                className="kanka_newsletter_input_abi"
                required
              />
              <button type="submit" className="kanka_newsletter_btn_abi">
                <span>ABONE OL</span>
                <span>✈️</span>
              </button>
            </form>
            <div className="kanka_newsletter_benefits_abi">
              <span>🔒 256-bit SSL</span>
              <span>🚫 Spam yok</span>
              <span>⚡ Hemen başla</span>
              <span>✅ Her an ayrıl</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ANA İÇERİK ===== */}
      <div className="kanka_footer_main_abi">
        
        {/* MARKA BÖLÜMÜ */}
        <div className="kanka_footer_brand_abi">
          <div className="kanka_footer_logo_abi">
            <div className="kanka_footer_logo_icon_abi">
              <span className="material-symbols-outlined">hexagon</span>
            </div>
            <span className="kanka_footer_logo_text_abi">Craftora</span>
          </div>
          <p className="kanka_footer_description_abi">
            Teknoloji tutkunları için premium ürünler, 
            hızlı teslimat ve müşteri memnuniyeti odaklı 
            alışveriş deneyimi.
          </p>
          
          {/* SOSYAL MEDYA */}
          <div className="kanka_footer_social_abi">
            <a href="#" className="kanka_social_icon_abi" aria-label="Instagram">
              📷
            </a>
            <a href="#" className="kanka_social_icon_abi" aria-label="Twitter">
              🐦
            </a>
            <a href="#" className="kanka_social_icon_abi" aria-label="Facebook">
              📘
            </a>
            <a href="#" className="kanka_social_icon_abi" aria-label="YouTube">
              ▶️
            </a>
            <a href="#" className="kanka_social_icon_abi" aria-label="TikTok">
              🎵
            </a>
          </div>
          
          {/* ÖDEME YÖNTEMLERİ */}
          <div className="kanka_footer_payment_abi">
            <span className="kanka_payment_title_abi">Ödeme Yöntemleri</span>
            <div className="kanka_payment_icons_abi">
              <span className="kanka_payment_icon_abi">VISA</span>
              <span className="kanka_payment_icon_abi">MC</span>
              <span className="kanka_payment_icon_abi">AMEX</span>
              <span className="kanka_payment_icon_abi">Pay</span>
              <span className="kanka_payment_icon_abi">📱</span>
            </div>
          </div>
        </div>

        {/* ALIŞVERİŞ */}
        <div className="kanka_footer_column_abi">
          <h4 className="kanka_footer_column_title_abi">Alışveriş</h4>
          <ul className="kanka_footer_links_abi">
            <li><a href="#" className="kanka_footer_link_abi">Tüm Ürünler</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Yeni Ürünler</a></li>
            <li><a href="#" className="kanka_footer_link_abi">İndirimdekiler</a></li>
            <li><a href="#" className="kanka_footer_link_abi">En Çok Satanlar</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Özel Fırsatlar</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Hediye Kartı</a></li>
          </ul>
        </div>

        {/* KATEGORİLER */}
        <div className="kanka_footer_column_abi">
          <h4 className="kanka_footer_column_title_abi">Kategoriler</h4>
          <ul className="kanka_footer_links_abi">
            <li><a href="#" className="kanka_footer_link_abi">Laptop & Bilgisayar</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Telefon & Tablet</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Ses & Kulaklık</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Oyun & Konsol</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Aksesuarlar</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Akıllı Ev</a></li>
          </ul>
        </div>

        {/* DESTEK */}
        <div className="kanka_footer_column_abi">
          <h4 className="kanka_footer_column_title_abi">Yardım & Destek</h4>
          <ul className="kanka_footer_links_abi">
            <li><a href="#" className="kanka_footer_link_abi">Sıkça Sorulan Sorular</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Kargo Takibi</a></li>
            <li><a href="#" className="kanka_footer_link_abi">İade & Değişim</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Garanti Koşulları</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Üyelik Sözleşmesi</a></li>
            <li><a href="#" className="kanka_footer_link_abi">Gizlilik Politikası</a></li>
          </ul>
        </div>

        {/* İLETİŞİM */}
        <div className="kanka_footer_column_abi">
          <h4 className="kanka_footer_column_title_abi">İletişim</h4>
          <ul className="kanka_footer_contact_abi">
            <li className="kanka_footer_contact_item_abi">
              <span className="kanka_footer_contact_icon_abi">📍</span>
              <span>İstanbul, Türkiye</span>
            </li>
            <li className="kanka_footer_contact_item_abi">
              <span className="kanka_footer_contact_icon_abi">📞</span>
              <span>+90 (212) 444 0 000</span>
            </li>
            <li className="kanka_footer_contact_item_abi">
              <span className="kanka_footer_contact_icon_abi">✉️</span>
              <span>destek@craftora.com</span>
            </li>
            <li className="kanka_footer_contact_item_abi">
              <span className="kanka_footer_contact_icon_abi">⏰</span>
              <span>7/24 Canlı Destek</span>
            </li>
          </ul>
        </div>

      </div>

      {/* ===== ALT BİLGİLER ===== */}
      <div className="kanka_footer_bottom_abi">
        <div className="kanka_footer_copyright_abi">
          © 2024 Craftora. Tüm hakları saklıdır.
        </div>
        <div className="kanka_footer_legal_abi">
          <a href="#" className="kanka_footer_legal_link_abi">KVKK</a>
          <a href="#" className="kanka_footer_legal_link_abi">Kullanım Koşulları</a>
          <a href="#" className="kanka_footer_legal_link_abi">Çerez Politikası</a>
          <a href="#" className="kanka_footer_legal_link_abi">Site Haritası</a>
        </div>
        <div className="kanka_footer_language_abi">
          <button className="kanka_footer_language_btn_abi">
            <span>🇹🇷</span>
            <span>Türkçe</span>
            <span>▼</span>
          </button>
        </div>
      </div>

    </footer>
  );
};

export default Footer;