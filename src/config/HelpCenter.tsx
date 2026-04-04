import { useState } from 'react';

interface HelpCenterProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
}

const HelpCenter = ({ colors }: HelpCenterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Merhaba! 👋 Size nasıl yardımcı olabilirim?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState('normal');
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    { q: '📦 Nasıl ürün eklerim?', a: 'Products > Create Product butonuna tıklayın. Ürün adı, fiyat, açıklama ve dosyanızı ekleyin. Dijital ürünler için dosya yükleme zorunludur.' },
    { q: '💰 Ödemelerim ne zaman yatacak?', a: 'Ödemeler her ayın 15\'inde, minimum ödeme eşiğini (₺50) aştığınızda otomatik olarak hesabınıza aktarılır.' },
    { q: '🔄 İade ve iptal nasıl yapılır?', a: 'Müşteri talebi üzerine sipariş detayından "İade Talep Et" butonu ile işlem başlatılır. Dijital ürünlerde iade politikası satıcıya bağlıdır.' },
    { q: '📎 Dijital ürün nasıl teslim edilir?', a: 'Sipariş tamamlandıktan sonra müşteriye otomatik indirme linki e-posta ile gönderilir. Ayrıca siparişlerim sayfasından da ürünlerine ulaşabilirler.' },
    { q: '🏷️ Komisyon oranları nedir?', a: 'Craftora her satıştan %10 komisyon almaktadır. Örneğin: ₺100\'lük bir ürün sattığınızda ₺90 kazanırsınız.' },
    { q: '💬 Müşteri ile nasıl iletişime geçerim?', a: 'Müşteriler size doğrudan mesaj gönderebilir. Bildirimlerden mesajları görebilir ve yanıtlayabilirsiniz.' }
  ];

  const guides = [
    { title: '📘 Craftora Satıcı Rehberi', type: 'pdf', link: '#' },
    { title: '🖼️ Ürün görseli optimizasyonu', type: 'article', link: '#' },
    { title: '🔍 SEO ipuçları', type: 'article', link: '#' },
    { title: '⭐ Başarılı mağaza ipuçları', type: 'video', link: '#' }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { type: 'user', message: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { type: 'bot', message: 'Teşekkürler! En kısa sürede size dönüş yapacağız. 🙏' }]);
    }, 500);
  };

  const sendTicket = () => {
    if (!ticketSubject || !ticketMessage) return;
    setTicketSent(true);
    setTimeout(() => setTicketSent(false), 3000);
    setTicketSubject('');
    setTicketMessage('');
    setTicketPriority('normal');
  };

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Header + Arama */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 40,
        textAlign: 'center',
        marginBottom: 32,
        border: `1px solid ${colors.border}`
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.text, marginBottom: 12 }}>
          Merhaba, size nasıl yardımcı olabiliriz?
        </h1>
        <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 24 }}>
          Sık sorulan sorulara göz atın veya destek ekibimize ulaşın
        </p>
        
        {/* Arama Kutusu */}
        <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
          <span className="material-icons-round" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary }}>
            search
          </span>
          <input
            type="text"
            placeholder="Yardım ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: 40,
              color: colors.text,
              fontSize: 14,
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Popüler Konular Kartları */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
        marginBottom: 32
      }}>
        {[
          { icon: '💰', title: 'Ödemeler', desc: 'Ödeme zamanlaması ve hesaplar' },
          { icon: '📦', title: 'Ürün Yönetimi', desc: 'Ürün ekleme ve düzenleme' },
          { icon: '🔄', title: 'İade ve İptal', desc: 'İade politikaları' },
          { icon: '💬', title: 'Müşteri İletişim', desc: 'Müşterilerle nasıl iletişim?' }
        ].map((item, i) => (
          <div key={i} style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            border: `1px solid ${colors.border}`,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* SSS Bölümü */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        marginBottom: 32,
        overflow: 'hidden'
      }}>
        <div style={{ padding: 24, borderBottom: `1px solid ${colors.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📚</span> Sık Sorulan Sorular
          </h2>
        </div>
        <div>
          {filteredFaqs.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: colors.textSecondary }}>
              Sonuç bulunamadı.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <div key={idx} style={{ borderBottom: idx < filteredFaqs.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '18px 24px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500, color: colors.text }}>{faq.q}</span>
                  <span className="material-icons-round" style={{ color: colors.textSecondary, transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }}>
                    expand_more
                  </span>
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 24px 24px 24px', fontSize: 14, color: colors.textSecondary, lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rehberler */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        marginBottom: 32,
        overflow: 'hidden'
      }}>
        <div style={{ padding: 24, borderBottom: `1px solid ${colors.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📖</span> Rehberler & Dokümantasyon
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, padding: 24 }}>
          {guides.map((guide, idx) => (
            <a key={idx} href={guide.link} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 16,
              backgroundColor: colors.bg,
              borderRadius: 16,
              textDecoration: 'none',
              transition: 'all 0.2s',
              border: `1px solid ${colors.border}`
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
              <span style={{ fontSize: 24 }}>{guide.type === 'pdf' ? '📄' : guide.type === 'video' ? '🎬' : '📝'}</span>
              <span style={{ fontSize: 14, color: colors.text, flex: 1 }}>{guide.title}</span>
              <span className="material-icons-round" style={{ color: colors.primary, fontSize: 18 }}>arrow_forward</span>
            </a>
          ))}
        </div>
      </div>

      {/* Video Eğitimler */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        marginBottom: 32,
        overflow: 'hidden'
      }}>
        <div style={{ padding: 24, borderBottom: `1px solid ${colors.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🎬</span> Video Eğitimler
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, padding: 24 }}>
          <div style={{ backgroundColor: colors.bg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
            <div style={{ backgroundColor: '#000', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 48 }}>🎥</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Craftora Satıcı Olma Rehberi</div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>10 dk • Başlangıç</div>
            </div>
          </div>
          <div style={{ backgroundColor: colors.bg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
            <div style={{ backgroundColor: '#000', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 48 }}>🎥</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Ürün Görseli Optimizasyonu</div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>8 dk • İleri Seviye</div>
            </div>
          </div>
        </div>
      </div>

      {/* Destek Talebi Oluştur */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        marginBottom: 32,
        overflow: 'hidden'
      }}>
        <div style={{ padding: 24, borderBottom: `1px solid ${colors.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💬</span> Destek Talebi Oluştur
          </h2>
        </div>
        <div style={{ padding: 24 }}>
          {ticketSent && (
            <div style={{ marginBottom: 20, padding: 12, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 12, color: '#10b981', fontSize: 13 }}>
              ✅ Talebiniz başarıyla gönderildi! En kısa sürede dönüş yapılacaktır.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Konu Seçimi</label>
              <select value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }}>
                <option value="">Bir konu seçin</option>
                <option value="Ödeme">💰 Ödeme</option>
                <option value="Ürün">📦 Ürün</option>
                <option value="Teknik">⚙️ Teknik</option>
                <option value="Diğer">📝 Diğer</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Öncelik Seviyesi</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { value: 'normal', label: '🔵 Normal', color: '#0ea5e9' },
                  { value: 'high', label: '🟠 Yüksek', color: '#f59e0b' },
                  { value: 'urgent', label: '🔴 Acil', color: '#ef4444' }
                ].map(p => (
                  <button key={p.value} onClick={() => setTicketPriority(p.value)} style={{ padding: '8px 16px', backgroundColor: ticketPriority === p.value ? p.color : colors.bg, border: `1px solid ${colors.border}`, borderRadius: 30, color: ticketPriority === p.value ? 'white' : colors.text, fontSize: 13, cursor: 'pointer' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Mesajınız</label>
              <textarea rows={4} value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} placeholder="Sorunuzu veya talebinizi detaylıca yazın..." style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Dosya Ekle (opsiyonel)</label>
              <input type="file" style={{ width: '100%', padding: '10px', backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            </div>
            <button onClick={sendTicket} style={{ padding: '12px 24px', backgroundColor: colors.primary, border: 'none', borderRadius: 40, color: 'white', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
              Gönder
            </button>
          </div>
        </div>
      </div>

      {/* Sık Kullanılan Bağlantılar */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        marginBottom: 32,
        overflow: 'hidden'
      }}>
        <div style={{ padding: 24, borderBottom: `1px solid ${colors.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🔗</span> Sık Kullanılan Bağlantılar
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 24 }}>
          <a href="#" style={{ color: colors.primary, textDecoration: 'none', fontSize: 14 }}>📄 Gizlilik Sözleşmesi</a>
          <a href="#" style={{ color: colors.primary, textDecoration: 'none', fontSize: 14 }}>📜 Kullanım Şartları</a>
        </div>
      </div>

      {/* İletişim Kanalları */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        marginBottom: 32,
        overflow: 'hidden'
      }}>
        <div style={{ padding: 24, borderBottom: `1px solid ${colors.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📞</span> İletişim Kanalları
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-icons-round" style={{ color: colors.primary }}>email</span>
            <span style={{ color: colors.text }}>support@craftora.com</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-icons-round" style={{ color: colors.primary }}>schedule</span>
            <span style={{ color: colors.text }}>Canlı Destek: Hafta içi 09:00 - 18:00</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-icons-round" style={{ color: colors.primary }}>chat</span>
            <span style={{ color: colors.text }}>WhatsApp: +90 555 123 45 67</span>
          </div>
        </div>
      </div>

      {/* Destek Ekibi Butonu - Floating Chat */}
      <button
        onClick={() => setShowChat(true)}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.primary,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span className="material-icons-round" style={{ color: 'white', fontSize: 28 }}>support_agent</span>
      </button>

      {/* Chat Modal */}
      {showChat && (
        <>
          <div
            onClick={() => setShowChat(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1100
            }}
          />
          <div style={{
            position: 'fixed',
            bottom: 100,
            right: 30,
            width: 380,
            height: 500,
            backgroundColor: colors.surface,
            borderRadius: 20,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1101,
            overflow: 'hidden',
            border: `1px solid ${colors.border}`
          }}>
            {/* Chat Header */}
            <div style={{
              padding: 16,
              backgroundColor: colors.primary,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-icons-round" style={{ color: 'white' }}>support_agent</span>
                <span style={{ color: 'white', fontWeight: 600 }}>Destek Ekibi</span>
              </div>
              <button
                onClick={() => setShowChat(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: 18,
                    backgroundColor: msg.type === 'user' ? colors.primary : colors.bg,
                    color: msg.type === 'user' ? 'white' : colors.text,
                    fontSize: 13,
                    border: msg.type === 'bot' ? `1px solid ${colors.border}` : 'none'
                  }}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div style={{
              padding: 16,
              borderTop: `1px solid ${colors.border}`,
              display: 'flex',
              gap: 8
            }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Mesajınızı yazın..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 30,
                  color: colors.text,
                  fontSize: 13,
                  outline: 'none'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="material-icons-round" style={{ color: 'white', fontSize: 20 }}>send</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HelpCenter;