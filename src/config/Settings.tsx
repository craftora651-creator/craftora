import { useState } from 'react';
import { FaInstagram, FaFacebook, FaTiktok, FaPinterest } from 'react-icons/fa';

interface SettingsPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
}

const SettingsPage = ({ colors }: SettingsPageProps) => {
  const [activeTab, setActiveTab] = useState('contact'); // contact, payment, notification, invoice, security

  const tabs = [
    { id: 'contact', label: '📞 İletişim & Sosyal', icon: 'contact_mail' },
    { id: 'payment', label: '💰 Ödeme Ayarları', icon: 'payments' },
    { id: 'notification', label: '🔔 Bildirimler', icon: 'notifications' },
    { id: 'invoice', label: '📄 Fatura & Teslimat', icon: 'receipt' },
    { id: 'security', label: '🔒 Hesap Güvenliği', icon: 'security' },
  ];

  return (
    <div>
      {/* Sekme Butonları */}
      <div style={{
        marginBottom: 32,
        overflowX: 'auto',
        paddingBottom: 8
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
          backgroundColor: colors.surface,
          padding: 4,
          borderRadius: 40,
          border: `1px solid ${colors.border}`,
          width: 'fit-content'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                backgroundColor: activeTab === tab.id ? colors.primary : 'transparent',
                border: 'none',
                borderRadius: 40,
                color: activeTab === tab.id ? 'white' : colors.textSecondary,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <span className="material-icons-round" style={{ fontSize: 18 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* İçerikler */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        padding: 28
      }}>
        {activeTab === 'contact' && <ContactSettings colors={colors} />}
        {activeTab === 'payment' && <PaymentSettings colors={colors} />}
        {activeTab === 'notification' && <NotificationSettings colors={colors} />}
        {activeTab === 'invoice' && <InvoiceSettings colors={colors} />}
        {activeTab === 'security' && <SecuritySettings colors={colors} />}
      </div>
    </div>
  );
};

// 1. İLETİŞİM & SOSYAL MEDYA
const ContactSettings = ({ colors }: SettingsPageProps) => {
  const [email, setEmail] = useState('iletisim@craftora.com');
  const [phone, setPhone] = useState('+90 555 123 45 67');
  const [address, setAddress] = useState('İstanbul, Türkiye');
  const [social, setSocial] = useState({
    instagram: 'https://instagram.com/craftora',
    facebook: 'https://facebook.com/craftora',
    tiktok: 'https://tiktok.com/@craftora',
    pinterest: 'https://pinterest.com/craftora'
  });

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 24 }}>İletişim & Sosyal Medya</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>📧 İletişim E-postası</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
        </div>

        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>📞 Telefon Numarası</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
        </div>

        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>📍 Adres</label>
          <textarea rows={2} value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
        </div>

        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>🌐 Sosyal Medya Hesapları</label>
<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <FaInstagram style={{ width: 24, height: 24, color: '#E4405F' }} />
    <input type="text" placeholder="Instagram" value={social.instagram} onChange={e => setSocial({...social, instagram: e.target.value})} style={{ flex: 1, padding: '10px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <FaFacebook style={{ width: 24, height: 24, color: '#1877F2' }} />
    <input type="text" placeholder="Facebook" value={social.facebook} onChange={e => setSocial({...social, facebook: e.target.value})} style={{ flex: 1, padding: '10px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <FaTiktok style={{ width: 24, height: 24, color: '#000000' }} />
    <input type="text" placeholder="TikTok" value={social.tiktok} onChange={e => setSocial({...social, tiktok: e.target.value})} style={{ flex: 1, padding: '10px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <FaPinterest style={{ width: 24, height: 24, color: '#BD081C' }} />
    <input type="text" placeholder="Pinterest" value={social.pinterest} onChange={e => setSocial({...social, pinterest: e.target.value})} style={{ flex: 1, padding: '10px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
  </div>
</div>        </div>

        <button style={{ padding: '12px 24px', backgroundColor: colors.primary, border: 'none', borderRadius: 40, color: 'white', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
};

// 2. ÖDEME AYARLARI (PayPal / Stripe / IBAN)
const PaymentSettings = ({ colors }: SettingsPageProps) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal'); // paypal, stripe, iban
  const [paypalEmail, setPaypalEmail] = useState('satis@craftora.com');
  const [stripeKey, setStripeKey] = useState('pk_test_...');
  const [iban, setIban] = useState('TR00 0000 0000 0000 0000 0000 00');
  const [bankName, setBankName] = useState('Garanti BBVA');
  const [accountName, setAccountName] = useState('Craftora Dijital');
  const [minPayout, setMinPayout] = useState(50);
  const [paymentEmail, setPaymentEmail] = useState('odeme@craftora.com');

  // Ülke seçimi (IBAN için)
  const [country, setCountry] = useState('tr');
  const countries = [
    { code: 'tr', name: 'Türkiye 🇹🇷', ibanExample: 'TR00 0000 0000 0000 0000 0000 00' },
    { code: 'us', name: 'Amerika Birleşik Devletleri 🇺🇸', ibanExample: 'US1234567890' },
    { code: 'gb', name: 'Birleşik Krallık 🇬🇧', ibanExample: 'GB00ABCD1234567890' },
    { code: 'de', name: 'Almanya 🇩🇪', ibanExample: 'DE00 0000 0000 0000 0000 00' },
    { code: 'fr', name: 'Fransa 🇫🇷', ibanExample: 'FR00 0000 0000 0000 0000 0000 000' },
    { code: 'nl', name: 'Hollanda 🇳🇱', ibanExample: 'NL00ABCD0000000000' },
    { code: 'es', name: 'İspanya 🇪🇸', ibanExample: 'ES00 0000 0000 0000 0000 0000' },
    { code: 'it', name: 'İtalya 🇮🇹', ibanExample: 'IT00 A000 0000 0000 0000 0000 000' },
  ];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = countries.find(c => c.code === e.target.value);
    setCountry(e.target.value);
    if (selected) {
      setIban(selected.ibanExample);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 24 }}>Ödeme & Kazanç Ayarları</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Ödeme Yöntemi Seçimi */}
        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 12 }}>💳 Ödeme Yöntemi Seçin</label>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { id: 'paypal', label: 'PayPal', icon: '💰', color: '#0070ba' },
              { id: 'stripe', label: 'Stripe', icon: '💳', color: '#635bff' },
              { id: 'iban', label: 'Banka Havalesi (IBAN)', icon: '🏦', color: '#10b981' }
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  backgroundColor: paymentMethod === method.id ? method.color : colors.bg,
                  border: `2px solid ${paymentMethod === method.id ? method.color : colors.border}`,
                  borderRadius: 40,
                  color: paymentMethod === method.id ? 'white' : colors.text,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span>{method.icon}</span>
                <span>{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PayPal Alanı */}
        {paymentMethod === 'paypal' && (
          <div>
            <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>PayPal Hesap E-postası</label>
            <input type="email" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>Kazançlarınız bu PayPal hesabına gönderilecek</div>
          </div>
        )}

        {/* Stripe Alanı */}
        {paymentMethod === 'stripe' && (
          <div>
            <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Stripe Secret Key</label>
            <input type="text" value={stripeKey} onChange={e => setStripeKey(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>Stripe hesabınızdan aldığınız API anahtarı</div>
          </div>
        )}

        {/* IBAN Alanı - Ülke seçimi ile birlikte */}
        {paymentMethod === 'iban' && (
          <>
            <div>
              <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>🌍 Banka Hesabınızın Bulunduğu Ülke</label>
              <select value={country} onChange={handleCountryChange} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }}>
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Banka Adı</label>
              <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            </div>

            <div>
              <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Hesap Adı / Şirket Ünvanı</label>
              <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            </div>

            <div>
              <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>IBAN</label>
              <input type="text" value={iban} onChange={e => setIban(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
              <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>
                {countries.find(c => c.code === country)?.name} için IBAN örneği: {countries.find(c => c.code === country)?.ibanExample}
              </div>
            </div>
          </>
        )}

        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>💰 Minimum Ödeme Eşiği (₺ veya $)</label>
          <input type="number" value={minPayout} onChange={e => setMinPayout(Number(e.target.value))} style={{ width: '200px', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
          <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>Bu tutarın altında ödeme talep edemezsiniz</div>
        </div>

        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>📧 Ödeme Bildirimleri Gönderilecek E-posta</label>
          <input type="email" value={paymentEmail} onChange={e => setPaymentEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
        </div>

        <button style={{ padding: '12px 24px', backgroundColor: colors.primary, border: 'none', borderRadius: 40, color: 'white', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
          Kaydet
        </button>
      </div>
    </div>
  );
};

// 3. BİLDİRİMLER (Yeni sipariş, Abonelik, Müşteri mesajı, Ödeme)
const NotificationSettings = ({ colors }: SettingsPageProps) => {
  const [notifications, setNotifications] = useState({
    newOrder: true,
    newSubscriber: true,
    customerMessage: true,
    payoutSent: true,
  });

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 24 }}>Bildirim Tercihleri</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <NotificationItem label="📦 Yeni Sipariş" description="Yeni bir sipariş geldiğinde bildirim al" enabled={notifications.newOrder} onToggle={() => toggle('newOrder')} colors={colors} />
        <NotificationItem label="🔔 Yeni Abone" description="Bir kullanıcı mağazana abone olduğunda bildirim al" enabled={notifications.newSubscriber} onToggle={() => toggle('newSubscriber')} colors={colors} />
        <NotificationItem label="💬 Müşteri Mesajı" description="Müşteri size mesaj gönderdiğinde bildirim al" enabled={notifications.customerMessage} onToggle={() => toggle('customerMessage')} colors={colors} />
        <NotificationItem label="💰 Ödeme Gönderildi" description="Kazancınız hesabınıza aktarıldığında bildirim al" enabled={notifications.payoutSent} onToggle={() => toggle('payoutSent')} colors={colors} />
      </div>

      <button style={{ marginTop: 24, padding: '12px 24px', backgroundColor: colors.primary, border: 'none', borderRadius: 40, color: 'white', fontWeight: 600, cursor: 'pointer' }}>
        Kaydet
      </button>
    </div>
  );
};

const NotificationItem = ({ label, description, enabled, onToggle, colors }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{label}</div>
      <div style={{ fontSize: 12, color: colors.textSecondary }}>{description}</div>
    </div>
    <button onClick={onToggle} style={{ width: 48, height: 24, borderRadius: 30, backgroundColor: enabled ? colors.primary : colors.border, border: 'none', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
      <div style={{ width: 18, height: 18, borderRadius: 18, backgroundColor: 'white', position: 'absolute', top: 3, left: enabled ? 27 : 3, transition: 'left 0.2s' }} />
    </button>
  </div>
);

// 4. FATURA & TESLİMAT
const InvoiceSettings = ({ colors }: SettingsPageProps) => {
  const [taxNumber, setTaxNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [invoiceEnabled, setInvoiceEnabled] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('Dijital ürünleriniz için teşekkür ederiz! İndirme linkiniz e-posta adresinize gönderilmiştir.');

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 24 }}>Fatura & Teslimat Ayarları</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input type="checkbox" checked={invoiceEnabled} onChange={e => setInvoiceEnabled(e.target.checked)} style={{ width: 18, height: 18 }} />
          <span style={{ color: colors.text }}>Fatura kesilsin (Şirket bilgileriniz varsa)</span>
        </div>

        {invoiceEnabled && (
          <>
            <div>
              <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Şirket Ünvanı</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Örn: Craftora Dijital Ticaret A.Ş." style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Vergi Numarası / TAX ID</label>
              <input type="text" value={taxNumber} onChange={e => setTaxNumber(e.target.value)} placeholder="Örn: 1234567890" style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            </div>
          </>
        )}

        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>📝 Teslimat Notu (Müşteriye gösterilecek)</label>
          <textarea rows={3} value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
          <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>Bu not, müşteri siparişi tamamladıktan sonra gösterilecektir.</div>
        </div>

        <button style={{ padding: '12px 24px', backgroundColor: colors.primary, border: 'none', borderRadius: 40, color: 'white', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
          Kaydet
        </button>
      </div>
    </div>
  );
};

// 5. HESAP GÜVENLİĞİ (Google/Apple bağlantısı, oturumlar)
const SecuritySettings = ({ colors }: SettingsPageProps) => {
  const [connectedAccount, setConnectedAccount] = useState({
    type: 'google', // google, apple, email
    email: 'tom.cook@craftora.com',
    name: 'Tom Cook',
    avatar: 'https://ui-avatars.com/api/?name=Tom+Cook&background=0ea5e9&color=fff&size=80'
  });

  const [sessions] = useState([
    { device: 'Chrome on Windows', location: 'İstanbul, TR', ip: '192.168.1.1', lastActive: 'Şu an aktif', current: true },
    { device: 'Safari on iPhone', location: 'Ankara, TR', ip: '192.168.1.2', lastActive: '2 saat önce', current: false },
    { device: 'Firefox on Mac', location: 'İzmir, TR', ip: '192.168.1.3', lastActive: '3 gün önce', current: false },
  ]);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 24 }}>Hesap Güvenliği</h2>

      {/* Bağlı Hesap Bilgisi */}
      <div style={{ marginBottom: 32, padding: 20, backgroundColor: colors.bg, borderRadius: 20, border: `1px solid ${colors.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ color: colors.primary }}>link</span>
          Bağlı Hesap
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundImage: `url(${connectedAccount.avatar})`,
            backgroundSize: 'cover',
            backgroundColor: colors.surface
          }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{connectedAccount.name}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>{connectedAccount.email}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <span style={{
                display: 'inline-block',
                padding: '2px 8px',
                backgroundColor: connectedAccount.type === 'google' ? '#ea4335' : (connectedAccount.type === 'apple' ? '#000' : colors.primary),
                color: 'white',
                fontSize: 10,
                fontWeight: 600,
                borderRadius: 20
              }}>
                {connectedAccount.type === 'google' ? 'Google ile Bağlı' : (connectedAccount.type === 'apple' ? 'Apple ile Bağlı' : 'E-posta ile')}
              </span>
            </div>
          </div>
          <button style={{ marginLeft: 'auto', padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 30, color: colors.textSecondary, fontSize: 12, cursor: 'pointer' }}>
            Hesabı Değiştir
          </button>
        </div>
      </div>

      {/* İki Faktörlü Kimlik Doğrulama */}
      <div style={{ marginBottom: 32, padding: 20, backgroundColor: colors.bg, borderRadius: 20, border: `1px solid ${colors.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-icons-round" style={{ color: colors.primary }}>security</span>
              İki Faktörlü Kimlik Doğrulama (2FA)
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Hesabınıza ekstra bir güvenlik katmanı ekleyin</div>
          </div>
          <button onClick={() => setTwoFactorEnabled(!twoFactorEnabled)} style={{ width: 48, height: 24, borderRadius: 30, backgroundColor: twoFactorEnabled ? colors.primary : colors.border, border: 'none', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
            <div style={{ width: 18, height: 18, borderRadius: 18, backgroundColor: 'white', position: 'absolute', top: 3, left: twoFactorEnabled ? 27 : 3, transition: 'left 0.2s' }} />
          </button>
        </div>
        {twoFactorEnabled && (
          <div style={{ marginTop: 16, padding: 12, backgroundColor: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>✅ 2FA aktive edildi. Telefonunuza veya authenticator uygulamanıza kod gönderilecek.</div>
          </div>
        )}
      </div>

      {/* Aktif Oturumlar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ color: colors.primary }}>devices</span>
          Aktif Oturumlar
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sessions.map((session, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: colors.bg, borderRadius: 16, border: `1px solid ${colors.border}` }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span className="material-icons-round" style={{ color: session.current ? colors.primary : colors.textSecondary }}>devices</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{session.device}</span>
                  {session.current && <span style={{ fontSize: 10, backgroundColor: colors.primary, color: 'white', padding: '2px 10px', borderRadius: 20 }}>Bu cihaz</span>}
                </div>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 6 }}>
                  📍 {session.location} • 🌐 {session.ip} • ⏱️ {session.lastActive}
                </div>
              </div>
              {!session.current && (
                <button style={{ padding: '6px 14px', backgroundColor: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 20, color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>
                  Çıkış Yap
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Güvenlik Aksiyonları */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
        <button style={{ padding: '10px 20px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 30, color: colors.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ fontSize: 18 }}>lock_reset</span>
          Şifre Değiştir
        </button>
        <button style={{ padding: '10px 20px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 30, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ fontSize: 18 }}>logout</span>
          Tüm Cihazlardan Çıkış Yap
        </button>
        <button style={{ padding: '10px 20px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 30, color: colors.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ fontSize: 18 }}>download</span>
          Hesap Verilerimi İndir
        </button>
      </div>

      <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 20, padding: 12, backgroundColor: colors.bg, borderRadius: 12, border: `1px solid ${colors.border}` }}>
        <span className="material-icons-round" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 6 }}>info</span>
        Şifre değiştirme ve hesap verileri için yönlendirileceksiniz. Güvenlik önemlidir!
      </div>
    </div>
  );
};

export default SettingsPage;