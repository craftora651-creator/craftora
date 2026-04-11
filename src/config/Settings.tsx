import { useState, useEffect } from 'react';
import { FaInstagram, FaFacebook, FaTiktok, FaPinterest } from 'react-icons/fa';
import { useMyShops, useShopSettings, useUpdateShopSettings } from '../server/FastAPI/shop.hooks';
import { useCurrentUser, useUserSessions  } from '../server/FastAPI/user.hooks';
import {
  useSendNewOrderNotification,
  useSendNewSubscriberNotification,
  useSendPayoutNotification
} from '../server/Gin/email.hooks';

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
  const { data: shops } = useMyShops();
  const currentShop = shops?.[0];
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

        {activeTab === 'contact' && <ContactSettings colors={colors} shopId={currentShop?.id || ''} />}
        {activeTab === 'payment' && <PaymentSettings colors={colors} />}
        {activeTab === 'notification' && <NotificationSettings colors={colors} />}
        {activeTab === 'invoice' && <InvoiceSettings colors={colors} />}
        {activeTab === 'security' && <SecuritySettings colors={colors} />}
      </div>
    </div>
  );
};

// 1. İLETİŞİM & SOSYAL MEDYA
// 1. İLETİŞİM & SOSYAL MEDYA
const ContactSettings = ({ colors, shopId }: { colors: any; shopId: string }) => {
  const { data: shopSettings, isLoading, refetch, error } = useShopSettings(shopId);
  console.log("🔍 shopSettings:", shopSettings);
  console.log("🔍 error:", error);
  const updateSettings = useUpdateShopSettings();
  const { data: currentUser } = useCurrentUser();

  const [formData, setFormData] = useState({
    contactEmail: '',
    supportEmail: '',
    phone: '',
    address: {
      street: '',
      city: '',
      country: '',
      postalCode: ''
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      tiktok: '',
      pinterest: ''
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  // Backend'den gelen verileri form'a yükle
  useEffect(() => {
    if (shopSettings && shopSettings.shop_id) {
      console.log("📦 Gelen shopSettings:", shopSettings);
      console.log("📦 address:", shopSettings.address);
      console.log("📦 social_media:", shopSettings.social_media);

      setFormData({
        contactEmail: shopSettings.contact_email || currentUser?.email || '',
        supportEmail: shopSettings.support_email || '',
        phone: shopSettings.phone || '',
        address: {
          street: shopSettings.address?.street || '',
          city: shopSettings.address?.city || '',
          country: shopSettings.address?.country || '',
          postalCode: shopSettings.address?.postal_code || ''  // DİKKAT: postal_code (alt çizgili)
        },
        socialMedia: {
          instagram: shopSettings.social_media?.instagram || '',
          facebook: shopSettings.social_media?.facebook || '',
          tiktok: shopSettings.social_media?.tiktok || '',
          pinterest: shopSettings.social_media?.pinterest || ''
        }
      });
    }
  }, [shopSettings, currentUser]);

  const handleSave = async () => {
    setIsSaving(true);

    const payload = {
      contact_email: formData.contactEmail,
      support_email: formData.supportEmail,
      phone: formData.phone,
      address: {
        street: formData.address.street,
        city: formData.address.city,
        country: formData.address.country,
        postal_code: formData.address.postalCode
      },
      social_media: {
        instagram: formData.socialMedia.instagram,
        facebook: formData.socialMedia.facebook,
        tiktok: formData.socialMedia.tiktok,
        pinterest: formData.socialMedia.pinterest
      }
    };

    try {
      await updateSettings.mutateAsync({
        shopId: shopId,
        settings: payload
      });

      alert('✅ Ayarlar başarıyla kaydedildi!');

      // REFETCH YAP VE GELEN VERİYLE FORM'U GÜNCELLE
      const result = await refetch();
      if (result.data) {
        console.log("🔄 Gelen yeni veri:", result.data);
        // Form'u manuel güncelle
        setFormData({
          contactEmail: result.data.contact_email || currentUser?.email || '',
          supportEmail: result.data.support_email || '',
          phone: result.data.phone || '',
          address: {
            street: result.data.address?.street || '',
            city: result.data.address?.city || '',
            country: result.data.address?.country || '',
            postalCode: result.data.address?.postal_code || ''
          },
          socialMedia: {
            instagram: result.data.social_media?.instagram || '',
            facebook: result.data.social_media?.facebook || '',
            tiktok: result.data.social_media?.tiktok || '',
            pinterest: result.data.social_media?.pinterest || ''
          }
        });
      }

    } catch (error: any) {
      console.error('❌ Kaydetme hatası:', error);
      if (error.response) {
        console.error('❌ Backend hatası:', error.response.data);
      }
      alert('❌ Kaydedilirken bir hata oluştu!');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Yükleniyor...</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 24 }}>İletişim & Sosyal Medya</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>📧 İletişim E-postası *</label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
            style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>📧 Destek E-postası</label>
          <input
            type="email"
            value={formData.supportEmail}
            onChange={e => setFormData({ ...formData, supportEmail: e.target.value })}
            style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>📞 Telefon Numarası</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+90 555 123 4567"
            style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>📍 Adres Bilgileri</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              placeholder="Cadde / Sokak"
              value={formData.address.street}
              onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
              style={{ padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input
                type="text"
                placeholder="Şehir"
                value={formData.address.city}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                style={{ padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }}
              />
              <input
                type="text"
                placeholder="Posta Kodu"
                value={formData.address.postalCode}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })}
                style={{ padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }}
              />
            </div>
            <input
              type="text"
              placeholder="Ülke"
              value={formData.address.country}
              onChange={e => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
              style={{ padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>🌐 Sosyal Medya Hesapları</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaInstagram style={{ width: 24, height: 24, color: '#E4405F' }} />
              <input type="text" placeholder="Instagram" value={formData.socialMedia.instagram} onChange={e => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, instagram: e.target.value } })} style={{ flex: 1, padding: '10px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaFacebook style={{ width: 24, height: 24, color: '#1877F2' }} />
              <input type="text" placeholder="Facebook" value={formData.socialMedia.facebook} onChange={e => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, facebook: e.target.value } })} style={{ flex: 1, padding: '10px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaTiktok style={{ width: 24, height: 24, color: '#000000' }} />
              <input type="text" placeholder="TikTok" value={formData.socialMedia.tiktok} onChange={e => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, tiktok: e.target.value } })} style={{ flex: 1, padding: '10px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaPinterest style={{ width: 24, height: 24, color: '#BD081C' }} />
              <input type="text" placeholder="Pinterest" value={formData.socialMedia.pinterest} onChange={e => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, pinterest: e.target.value } })} style={{ flex: 1, padding: '10px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: '12px 24px',
            backgroundColor: colors.primary,
            border: 'none',
            borderRadius: 40,
            color: 'white',
            fontWeight: 600,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            alignSelf: 'flex-start',
            opacity: isSaving ? 0.7 : 1
          }}
        >
          {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
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
// 3. BİLDİRİMLER (Yeni sipariş, Abonelik, Müşteri mesajı, Ödeme)
const NotificationSettings = ({ colors }: SettingsPageProps) => {
  const { data: shops } = useMyShops();
  const currentShop = shops?.[0];
  const { data: shopSettings, refetch } = useShopSettings(currentShop?.id || '');
  const updateSettings = useUpdateShopSettings();

  // Bildirim tercihlerini backend'den al veya default değerleri kullan
  const [notifications, setNotifications] = useState({
    newOrder: true,
    newSubscriber: true,
    customerMessage: true,
    payoutSent: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [testStatus, setTestStatus] = useState<{ type: string; status: string } | null>(null);

  // Test bildirimi gönderme hook'ları
  const { mutate: sendOrderTest, isPending: isOrderPending } = useSendNewOrderNotification();
  const { mutate: sendSubscriberTest, isPending: isSubscriberPending } = useSendNewSubscriberNotification();
  const { mutate: sendPayoutTest, isPending: isPayoutPending } = useSendPayoutNotification();

  // Backend'den gelen tercihleri yükle
  useEffect(() => {
    if (shopSettings?.settings?.notifications) {
      const prefs = shopSettings.settings.notifications;
      setNotifications({
        newOrder: prefs.new_order ?? true,
        newSubscriber: prefs.new_subscriber ?? true,
        customerMessage: prefs.customer_message ?? true,
        payoutSent: prefs.payout_sent ?? true,
      });
    }
  }, [shopSettings]);

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Bildirim tercihlerini kaydet
  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await updateSettings.mutateAsync({
        shopId: currentShop?.id || '',
        settings: {
          notifications: {
            new_order: notifications.newOrder,
            new_subscriber: notifications.newSubscriber,
            customer_message: notifications.customerMessage,
            payout_sent: notifications.payoutSent,
          }
        }
      });
      alert('✅ Bildirim tercihleri kaydedildi!');
      refetch();
    } catch (error) {
      console.error('❌ Kaydetme hatası:', error);
      alert('❌ Kaydedilirken bir hata oluştu!');
    } finally {
      setIsSaving(false);
    }
  };

  // Test bildirimi gönder
  const sendTestNotification = (type: string) => {
    const shopEmail = shopSettings?.contact_email || 'test@craftora.com';
    const shopName = currentShop?.shop_name || 'Test Mağaza';

    setTestStatus({ type, status: 'sending' });

    const handleResponse = (result: any) => {
      if (result?.success) {
        setTestStatus({ type, status: 'success' });
        setTimeout(() => setTestStatus(null), 3000);
      } else {
        setTestStatus({ type, status: 'error' });
        setTimeout(() => setTestStatus(null), 3000);
      }
    };

    const handleError = () => {
      setTestStatus({ type, status: 'error' });
      setTimeout(() => setTestStatus(null), 3000);
    };

    switch (type) {
      case 'order':
        sendOrderTest({
          to_email: shopEmail,
          order_id: 'TEST-001',
          order_total: '1.250,00',
          customer_name: 'Test Müşteri',
          shop_name: shopName,
        }, {
          onSuccess: handleResponse,
          onError: handleError
        });
        break;
      case 'subscriber':
        sendSubscriberTest({
          to_email: shopEmail,
          subscriber_email: 'abone@test.com',
          shop_name: shopName,
        }, {
          onSuccess: handleResponse,
          onError: handleError
        });
        break;
      case 'payout':
        sendPayoutTest({
          to_email: shopEmail,
          amount: '5.000,00',
          payment_date: new Date().toLocaleDateString('tr-TR'),
          shop_name: shopName,
        }, {
          onSuccess: handleResponse,
          onError: handleError
        });
        break;
    }
  };

  const isTesting = (type: string) => {
    if (type === 'order') return isOrderPending;
    if (type === 'subscriber') return isSubscriberPending;
    if (type === 'payout') return isPayoutPending;
    return false;
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 24 }}>Bildirim Tercihleri</h2>

      <p style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 24 }}>
        Bu bildirimler <strong>{shopSettings?.contact_email || 'kayıtlı e-posta adresinize'}</strong> gönderilecektir.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <NotificationItem
          label="📦 Yeni Sipariş"
          description="Yeni bir sipariş geldiğinde bildirim al"
          enabled={notifications.newOrder}
          onToggle={() => toggle('newOrder')}
          colors={colors}
          onTest={() => sendTestNotification('order')}
          isTesting={isTesting('order')}
          testStatus={testStatus?.type === 'order' ? testStatus.status : null}
        />
        <NotificationItem
          label="🔔 Yeni Abone"
          description="Bir kullanıcı mağazana abone olduğunda bildirim al"
          enabled={notifications.newSubscriber}
          onToggle={() => toggle('newSubscriber')}
          colors={colors}
          onTest={() => sendTestNotification('subscriber')}
          isTesting={isTesting('subscriber')}
          testStatus={testStatus?.type === 'subscriber' ? testStatus.status : null}
        />
        <NotificationItem
          label="💬 Müşteri Mesajı"
          description="Müşteri size mesaj gönderdiğinde bildirim al"
          enabled={notifications.customerMessage}
          onToggle={() => toggle('customerMessage')}
          colors={colors}
        />
        <NotificationItem
          label="💰 Ödeme Gönderildi"
          description="Kazancınız hesabınıza aktarıldığında bildirim al"
          enabled={notifications.payoutSent}
          onToggle={() => toggle('payoutSent')}
          colors={colors}
          onTest={() => sendTestNotification('payout')}
          isTesting={isTesting('payout')}
          testStatus={testStatus?.type === 'payout' ? testStatus.status : null}
        />
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
        <button
          onClick={handleSavePreferences}
          disabled={isSaving}
          style={{
            padding: '12px 24px',
            backgroundColor: colors.primary,
            border: 'none',
            borderRadius: 40,
            color: 'white',
            fontWeight: 600,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.7 : 1
          }}
        >
          {isSaving ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
        </button>
      </div>

      <div style={{
        marginTop: 24,
        padding: 16,
        backgroundColor: colors.bg,
        borderRadius: 12,
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ fontSize: 12, color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ fontSize: 16 }}>info</span>
          Not: Test bildirimleri göndermek için "Test Et" butonlarını kullanabilirsiniz.
          Bildirimler {shopSettings?.contact_email || 'e-posta adresinize'} gönderilecektir.
        </div>
      </div>
    </div>
  );
};

// Güncellenmiş NotificationItem component'i
const NotificationItem = ({ label, description, enabled, onToggle, colors, onTest, isTesting, testStatus }: any) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{label}</div>
      <div style={{ fontSize: 12, color: colors.textSecondary }}>{description}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {onTest && (
        <button
          onClick={onTest}
          disabled={isTesting}
          style={{
            padding: '6px 12px',
            fontSize: 11,
            backgroundColor: testStatus === 'success' ? '#10b981' : (testStatus === 'error' ? '#ef4444' : colors.bg),
            border: `1px solid ${colors.border}`,
            borderRadius: 30,
            color: testStatus === 'success' ? 'white' : (testStatus === 'error' ? 'white' : colors.textSecondary),
            cursor: isTesting ? 'not-allowed' : 'pointer',
            opacity: isTesting ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          {isTesting ? 'Gönderiliyor...' : (testStatus === 'success' ? '✓ Gönderildi' : (testStatus === 'error' ? '❌ Hata' : 'Test Et'))}
        </button>
      )}
      <button
        onClick={onToggle}
        style={{
          width: 48,
          height: 24,
          borderRadius: 30,
          backgroundColor: enabled ? colors.primary : colors.border,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative'
        }}
      >
        <div style={{
          width: 18,
          height: 18,
          borderRadius: 18,
          backgroundColor: 'white',
          position: 'absolute',
          top: 3,
          left: enabled ? 27 : 3,
          transition: 'left 0.2s'
        }} />
      </button>
    </div>
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
  const { data: userData, isLoading: userLoading } = useCurrentUser();
  const { data: sessions, isLoading: sessionsLoading } = useUserSessions();

  // Giriş geçmişi - varsa göster, yoksa boş
  const loginHistory = sessions?.map(session => ({
    date: new Date(session.created_at).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    device: session.user_agent ? (
      session.user_agent.includes('Windows') ? '💻 Windows PC' :
      session.user_agent.includes('Mac') ? '🍎 Mac' :
      session.user_agent.includes('iPhone') ? '📱 iPhone' :
      session.user_agent.includes('iPad') ? '📱 iPad' :
      session.user_agent.includes('Android') ? '📱 Android' : '🖥️ Bilinmeyen Cihaz'
    ) : '🖥️ Bilinmeyen Cihaz',
    ip: session.ip_address || '📍 Bilinmiyor',
    location: (session.ip_address === '127.0.0.1' || session.ip_address === 'localhost') ? '🏠 İstanbul, TR' : '🌍 Bilinmiyor',
    status: session.is_revoked ? '❌ İptal Edildi' : '✅ Aktif',
    expires_at: new Date(session.expires_at).toLocaleString('tr-TR')
  })) || [];

  const securityTips = [];

  // Güvenlik önerileri
  if (userData?.auth_provider === 'email') {
    securityTips.push({
      text: '🔐 Şifrenizi düzenli olarak değiştirmelisiniz',
      action: 'Şifre Değiştir',
      urgent: false
    });
  }

  // Oturum sayısı kontrolü
  if (sessions && sessions.length > 3) {
    securityTips.push({
      text: `⚠️ ${sessions.length} farklı cihazdan aktif oturumunuz var. Güvenli olmayan oturumları sonlandırın.`,
      action: 'Oturumları Yönet',
      urgent: true
    });
  }

  // Hiç giriş geçmişi yoksa
  if (sessions && sessions.length === 0) {
    securityTips.push({
      text: '📌 Henüz hiç giriş kaydınız bulunmuyor. Giriş yaptığınızda burada görünecektir.',
      action: '',
      urgent: false
    });
  }

  const connectedAccount = {
    type: userData?.auth_provider || 'email',
    email: userData?.email || '',
    name: userData?.full_name || userData?.email?.split('@')[0] || 'Kullanıcı',
    avatar: userData?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.full_name || 'Kullanıcı')}&background=e07c5c&color=fff&size=80`
  };

  if (userLoading || sessionsLoading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: colors.textSecondary }}>
        <span className="material-icons-round" style={{ fontSize: 40, marginBottom: 16 }}>hourglass_empty</span>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, marginBottom: 24 }}>🔒 Hesap Güvenliği</h2>

      {/* ===== BAĞLI HESAP KARTI ===== */}
      <div style={{ marginBottom: 32, padding: 24, backgroundColor: colors.bg, borderRadius: 24, border: `1px solid ${colors.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ color: colors.primary }}>link</span>
          Bağlı Hesap
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundImage: `url(${connectedAccount.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: colors.surface,
            border: `3px solid ${colors.primary}`
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 4 }}>{connectedAccount.name}</div>
            <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>{connectedAccount.email}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                backgroundColor: connectedAccount.type === 'google' ? '#ea4335' : (connectedAccount.type === 'apple' ? '#000' : colors.primary),
                color: 'white',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 30
              }}>
                <span className="material-icons-round" style={{ fontSize: 14 }}>
                  {connectedAccount.type === 'google' ? 'public' : (connectedAccount.type === 'apple' ? 'apple' : 'email')}
                </span>
                {connectedAccount.type === 'google' ? 'Google ile Bağlı' : (connectedAccount.type === 'apple' ? 'Apple ile Bağlı' : 'E-posta ile')}
              </span>
              {userData?.is_verified && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 30
                }}>
                  <span className="material-icons-round" style={{ fontSize: 12 }}>verified</span>
                  Doğrulanmış Hesap
                </span>
              )}
            </div>
          </div>
          <button style={{
            padding: '10px 20px',
            backgroundColor: 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: 30,
            color: colors.textSecondary,
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surface}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            Hesabı Değiştir
          </button>
        </div>
      </div>

      {/* ===== GÜVENLİK ÖNERİLERİ ===== */}
      {securityTips.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-icons-round" style={{ color: colors.primary }}>tips_and_updates</span>
            Güvenlik Önerileri
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {securityTips.map((tip, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                backgroundColor: tip.urgent ? 'rgba(239, 68, 68, 0.08)' : colors.bg,
                borderRadius: 20,
                border: `1px solid ${tip.urgent ? '#ef4444' : colors.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span className="material-icons-round" style={{ color: tip.urgent ? '#ef4444' : colors.primary, fontSize: 22 }}>
                    {tip.urgent ? 'warning' : 'info'}
                  </span>
                  <span style={{ fontSize: 14, color: colors.text }}>{tip.text}</span>
                </div>
                {tip.action && (
                  <button style={{
                    padding: '8px 20px',
                    backgroundColor: tip.urgent ? '#ef4444' : 'transparent',
                    border: tip.urgent ? 'none' : `1px solid ${colors.border}`,
                    borderRadius: 30,
                    color: tip.urgent ? 'white' : colors.textSecondary,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}>
                    {tip.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== GİRİŞ GEÇMİŞİ ===== */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ color: colors.primary }}>history</span>
          Giriş Geçmişi
          <span style={{
            fontSize: 11,
            backgroundColor: colors.surface,
            padding: '2px 8px',
            borderRadius: 20,
            color: colors.textSecondary
          }}>
            {loginHistory.length} kayıt
          </span>
        </div>

        {loginHistory.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 48,
            backgroundColor: colors.bg,
            borderRadius: 20,
            border: `1px solid ${colors.border}`
          }}>
            <span className="material-icons-round" style={{ fontSize: 48, color: colors.textSecondary, marginBottom: 12 }}>devices_other</span>
            <div style={{ fontSize: 14, color: colors.textSecondary }}>Henüz giriş kaydınız bulunmuyor</div>
            <div style={{ fontSize: 12, color: colors.textMuted || colors.textSecondary, marginTop: 4 }}>Giriş yaptığınızda burada görünecektir</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loginHistory.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                backgroundColor: colors.bg,
                borderRadius: 16,
                border: `1px solid ${colors.border}`,
                flexWrap: 'wrap',
                gap: 12,
                transition: 'all 0.2s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.surface,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span className="material-icons-round" style={{ fontSize: 22, color: colors.textSecondary }}>computer</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 4 }}>{item.device}</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span>📍 {item.location}</span>
                      <span>•</span>
                      <span>🌐 {item.ip}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>{item.date}</div>
                  <div style={{ fontSize: 11, color: colors.textSecondary }}>{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;