import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface SupplierSettingsProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

const SupplierSettings = ({ colors }: SupplierSettingsProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  
  const navigate = useNavigate();
  const { id } = useParams();

  // Responsive kontrol
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Örnek tedarikçi verisi
  const supplier = {
    id: id,
    name: 'AutoDS',
    logo: '🚀',
    type: 'autods',
    status: 'active',
    connectedAt: '12 Mart 2024'
  };

  // Ayarlar state'leri
  const [settings, setSettings] = useState({
    // Genel Ayarlar
    supplierName: 'AutoDS',
    defaultCarrier: 'UPS',
    defaultShippingMethod: 'economy',
    
    // Sipariş Otomasyonu
    autoSendOrders: true,
    autoSyncStatus: true,
    emailOnError: true,
    
    // Stok Senkronizasyonu
    syncInventory: true,
    syncFrequency: 'hourly',
    hideOutOfStock: true,
    lowStockThreshold: 5,
    
    // Fiyatlandırma
    autoUpdatePrices: true,
    profitMargin: 30,
    minPrice: 5,
    maxPrice: 1000,
    roundPrices: true,
    
    // Kargo Ayarları
    trackingAutoNotify: true,
    estimatedDeliveryDays: '7-14',
    shippingInsurance: false,
    
    // API Ayarları (sadece göstermelik, satıcı değiştiremez)
    apiKey: '••••••••••••••••',
    apiEndpoint: 'https://api.autods.com/v1',
    storeId: 'STORE_12345'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Ayarlar kaydediliyor:', settings);
    alert('Ayarlar başarıyla kaydedildi!');
  };

  const handleTestConnection = () => {
    alert('Bağlantı test ediliyor... (API anahtarları arka planda)');
  };

  return (
    <div style={{ 
      minHeight: '100%',
    }}>
      {/* Header - Geri Butonu ve Başlık */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => navigate(`/admin/suppliers/${id}`)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            color: colors.textSecondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20
          }}
        >
          ←
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            backgroundColor: colors.bg,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24
          }}>
            {supplier.logo}
          </div>
          <div>
            <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 600, color: colors.text, margin: 0 }}>
              {supplier.name} Ayarları
            </h1>
            <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0' }}>
              Tedarikçi tercihlerini ve otomasyon ayarlarını yönet
            </p>
          </div>
        </div>
      </div>

      {/* Ana İçerik - 2 Kolonlu (Solda Menü, Sağda Ayarlar) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
        gap: 24
      }}>
        {/* Sol Menü - Ayarlar Kategorileri */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          border: `1px solid ${colors.border}`,
          padding: 16,
          height: 'fit-content'
        }}>
          <div style={{ marginBottom: 16, padding: '0 8px' }}>
            <div style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 600, letterSpacing: 1 }}>
              TEDARİKÇİ AYARLARI
            </div>
          </div>
          
          {[
            { id: 'general', label: 'Genel Ayarlar', icon: '⚙️' },
            { id: 'orders', label: 'Sipariş Otomasyonu', icon: '🤖' },
            { id: 'inventory', label: 'Stok Yönetimi', icon: '📦' },
            { id: 'pricing', label: 'Fiyatlandırma', icon: '💰' },
            { id: 'shipping', label: 'Kargo Ayarları', icon: '🚚' },
            { id: 'api', label: 'API Bilgileri', icon: '🔌' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: activeSection === item.id ? colors.bg : 'transparent',
                border: 'none',
                borderRadius: 12,
                color: activeSection === item.id ? '#0ea5e9' : colors.textSecondary,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 4,
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div style={{ marginTop: 24, padding: '16px 8px', borderTop: `1px solid ${colors.border}` }}>
            <button
              onClick={handleTestConnection}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: 30,
                color: colors.text,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <span>🔌</span>
              Bağlantıyı Test Et
            </button>
          </div>
        </div>

        {/* Sağ İçerik - Aktif Ayarlar */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          border: `1px solid ${colors.border}`,
          padding: 24
        }}>
          {/* Genel Ayarlar */}
          {activeSection === 'general' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 20px 0' }}>
                ⚙️ Genel Ayarlar
              </h2>
              
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: colors.textSecondary }}>
                  Tedarikçi Adı
                </label>
                <input
                  type="text"
                  value={settings.supplierName}
                  onChange={(e) => handleSettingChange('supplierName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text,
                    fontSize: 14,
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: colors.textSecondary }}>
                  Varsayılan Kargo Firması
                </label>
                <select
                  value={settings.defaultCarrier}
                  onChange={(e) => handleSettingChange('defaultCarrier', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text,
                    fontSize: 14,
                    outline: 'none'
                  }}
                >
                  <option value="UPS">UPS</option>
                  <option value="FedEx">FedEx</option>
                  <option value="DHL">DHL</option>
                  <option value="PTT">PTT</option>
                  <option value="Aras">Aras Kargo</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: colors.textSecondary }}>
                  Varsayılan Gönderim Metodu
                </label>
                <select
                  value={settings.defaultShippingMethod}
                  onChange={(e) => handleSettingChange('defaultShippingMethod', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text,
                    fontSize: 14,
                    outline: 'none'
                  }}
                >
                  <option value="economy">Ekonomik (7-14 gün)</option>
                  <option value="standard">Standart (5-7 gün)</option>
                  <option value="express">Ekspres (3-5 gün)</option>
                  <option value="priority">Öncelikli (1-3 gün)</option>
                </select>
              </div>

              <div style={{ 
                padding: 16, 
                backgroundColor: colors.bg, 
                borderRadius: 12,
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>
                  Bağlantı Durumu
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#10b981'
                  }} />
                  <span style={{ fontSize: 14, color: colors.text }}>Aktif ve çalışıyor</span>
                </div>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>
                  Son bağlantı: {supplier.connectedAt}
                </div>
              </div>
            </div>
          )}

          {/* Sipariş Otomasyonu */}
          {activeSection === 'orders' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 20px 0' }}>
                🤖 Sipariş Otomasyonu
              </h2>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.autoSendOrders}
                    onChange={(e) => handleSettingChange('autoSendOrders', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>Siparişleri otomatik gönder</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>Yeni siparişler anında tedarikçiye iletilir</div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.autoSyncStatus}
                    onChange={(e) => handleSettingChange('autoSyncStatus', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>Sipariş durumlarını otomatik senkronize et</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>Kargo takibi ve teslimat durumu otomatik güncellenir</div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.emailOnError}
                    onChange={(e) => handleSettingChange('emailOnError', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>Hata durumunda email bildirimi</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>Sipariş gönderilemezse bilgilendirme al</div>
                  </div>
                </label>
              </div>

              <div style={{
                marginTop: 24,
                padding: 16,
                backgroundColor: colors.bg,
                borderRadius: 12,
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>Otomasyon Durumu</div>
                <div style={{ fontSize: 14, color: colors.text }}>✅ Aktif - Son 24 saatte 124 sipariş otomatik gönderildi</div>
              </div>
            </div>
          )}

          {/* Stok Yönetimi */}
          {activeSection === 'inventory' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 20px 0' }}>
                📦 Stok Yönetimi
              </h2>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.syncInventory}
                    onChange={(e) => handleSettingChange('syncInventory', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>Stokları otomatik senkronize et</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>Tedarikçi stokları otomatik güncellenir</div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: colors.textSecondary }}>
                  Senkronizasyon Sıklığı
                </label>
                <select
                  value={settings.syncFrequency}
                  onChange={(e) => handleSettingChange('syncFrequency', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text,
                    fontSize: 14,
                    outline: 'none'
                  }}
                >
                  <option value="realtime">Gerçek zamanlı</option>
                  <option value="hourly">Saatlik</option>
                  <option value="daily">Günlük</option>
                  <option value="weekly">Haftalık</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.hideOutOfStock}
                    onChange={(e) => handleSettingChange('hideOutOfStock', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>Stokta olmayan ürünleri gizle</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>Tükenen ürünler otomatik gizlenir</div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: colors.textSecondary }}>
                  Düşük Stok Uyarı Eşiği
                </label>
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text,
                    fontSize: 14,
                    outline: 'none'
                  }}
                />
                <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>
                  Bu adedin altına düşen ürünler için uyarı al
                </div>
              </div>
            </div>
          )}

          {/* Fiyatlandırma */}
          {activeSection === 'pricing' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 20px 0' }}>
                💰 Fiyatlandırma
              </h2>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.autoUpdatePrices}
                    onChange={(e) => handleSettingChange('autoUpdatePrices', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>Fiyatları otomatik güncelle</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>Tedarikçi fiyat değişiklikleri otomatik uygulanır</div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: colors.textSecondary }}>
                  Kar Marjı (%)
                </label>
                <input
                  type="number"
                  value={settings.profitMargin}
                  onChange={(e) => handleSettingChange('profitMargin', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text,
                    fontSize: 14,
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: colors.textSecondary }}>
                    Minimum Fiyat ($)
                  </label>
                  <input
                    type="number"
                    value={settings.minPrice}
                    onChange={(e) => handleSettingChange('minPrice', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      color: colors.text,
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: colors.textSecondary }}>
                    Maksimum Fiyat ($)
                  </label>
                  <input
                    type="number"
                    value={settings.maxPrice}
                    onChange={(e) => handleSettingChange('maxPrice', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      color: colors.text,
                      fontSize: 14,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.roundPrices}
                    onChange={(e) => handleSettingChange('roundPrices', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>Fiyatları yuvarla</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>Örn: $49.99 → $50.00</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Kargo Ayarları */}
          {activeSection === 'shipping' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 20px 0' }}>
                🚚 Kargo Ayarları
              </h2>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.trackingAutoNotify}
                    onChange={(e) => handleSettingChange('trackingAutoNotify', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>Kargo takibi gelince müşteriye bildir</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>Takip numarası otomatik email olarak gönderilir</div>
                  </div>
                </label>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: colors.textSecondary }}>
                  Tahmini Teslimat Süresi (gün)
                </label>
                <input
                  type="text"
                  value={settings.estimatedDeliveryDays}
                  onChange={(e) => handleSettingChange('estimatedDeliveryDays', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    color: colors.text,
                    fontSize: 14,
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.shippingInsurance}
                    onChange={(e) => handleSettingChange('shippingInsurance', e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>Kargo sigortası ekle</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>Kayıp/hasar durumunda koruma</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* API Bilgileri (Sadece görüntüleme) */}
          {activeSection === 'api' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 20px 0' }}>
                🔌 API Bilgileri
              </h2>
              
              <div style={{
                padding: 16,
                backgroundColor: colors.bg,
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                marginBottom: 20
              }}>
                <p style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 16 }}>
                  API bilgileri otomatik olarak yapılandırılmıştır. Değiştirmeniz gerekmez.
                </p>
                
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>API Anahtarı</div>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: colors.surface,
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    fontSize: 13,
                    fontFamily: 'monospace'
                  }}>
                    {settings.apiKey}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>API Endpoint</div>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: colors.surface,
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    fontSize: 13
                  }}>
                    {settings.apiEndpoint}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Store ID</div>
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: colors.surface,
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    fontSize: 13
                  }}>
                    {settings.storeId}
                  </div>
                </div>
              </div>

              <div style={{
                padding: 16,
                backgroundColor: 'rgba(14,165,233,0.1)',
                borderRadius: 12,
                border: `1px solid rgba(14,165,233,0.3)`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>🔒</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#0ea5e9' }}>Güvenli Bağlantı</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>API anahtarlarınız şifrelenerek saklanır</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kaydet Butonu - Her bölümde göster */}
          <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              onClick={() => navigate(`/admin/suppliers/${id}`)}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                border: `1px solid ${colors.border}`,
                borderRadius: 30,
                color: colors.text,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '12px 32px',
                backgroundColor: '#0ea5e9',
                border: 'none',
                borderRadius: 30,
                color: 'white',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Ayarları Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierSettings;