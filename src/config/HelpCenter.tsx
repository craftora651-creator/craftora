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
  const [tickets, setTickets] = useState<any[]>([
    {
      id: 1,
      subject: 'Ödeme',
      priority: 'high',
      status: 'waiting', // waiting, answered, closed
      messages: [
        { type: 'user', message: 'Ödemem neden hala yatmadı?', date: '2024-01-15 10:30' },
        { type: 'admin', message: 'Merhaba, ödemeniz 15 Ocak\'ta hesabınıza aktarılacaktır.', date: '2024-01-15 11:00' },
        { type: 'user', message: 'Teşekkürler, bekleyeceğim.', date: '2024-01-15 11:05' }
      ]
    }
  ]);
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState('normal');
  const [chatInput, setChatInput] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState('normal');
  const [ticketSent, setTicketSent] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const faqs = [
    { q: '📦 Nasıl ürün eklerim?', a: 'Products > Create Product butonuna tıklayın. Ürün adı, fiyat, açıklama ve dosyanızı ekleyin. Dijital ürünler için dosya yükleme zorunludur.' },
    { q: '💰 Ödemelerim ne zaman yatacak?', a: 'Ödemeler her ayın 15\'inde, minimum ödeme eşiğini (₺50) aştığınızda otomatik olarak hesabınıza aktarılır.' },
    { q: '🔄 İade ve iptal nasıl yapılır?', a: 'Müşteri talebi üzerine sipariş detayından "İade Talep Et" butonu ile işlem başlatılır. Dijital ürünlerde iade politikası satıcıya bağlıdır.' },
    { q: '📎 Dijital ürün nasıl teslim edilir?', a: 'Sipariş tamamlandıktan sonra müşteriye otomatik indirme linki e-posta ile gönderilir. Ayrıca siparişlerim sayfasından da ürünlerine ulaşabilirler.' },
    { q: '🏷️ Komisyon oranları nedir?', a: 'Craftora her satıştan %10 komisyon almaktadır. Örneğin: ₺100\'lük bir ürün sattığınızda ₺90 kazanırsınız.' },
    { q: '💬 Müşteri ile nasıl iletişime geçerim?', a: 'Müşteriler size doğrudan mesaj gönderebilir. Bildirimlerden mesajları görebilir ve yanıtlayabilirsiniz.' }
  ];

  const guides = [
    { title: '📘 Craftora Satıcı Rehberi', type: 'pdf' },
    { title: '🖼️ Ürün görseli optimizasyonu', type: 'article' },
    { title: '🔍 SEO ipuçları', type: 'article' },
    { title: '⭐ Başarılı mağaza ipuçları', type: 'video' }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createTicket = () => {
    if (!newTicketSubject || !newTicketMessage) return;

    const newTicket = {
      id: Date.now(),
      subject: newTicketSubject,
      priority: newTicketPriority,
      status: 'waiting',
      messages: [
        { type: 'user', message: newTicketMessage, date: new Date().toLocaleString() }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setNewTicketSubject('');
    setNewTicketPriority('normal');
    setNewTicketMessage('');
    setShowNewTicketForm(false);
  };

  // Cevap gönder
  const sendReply = (ticketId: number) => {
    if (!replyMessage) return;

    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'waiting',
          messages: [...ticket.messages, { type: 'user', message: replyMessage, date: new Date().toLocaleString() }]
        };
      }
      return ticket;
    }));
    setReplyMessage('');
  };

  // Aktif talebi göster
  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { type: 'user', message: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { type: 'bot', message: 'Teşekkürler! En kısa sürede size dönüş yapacağız. 🙏' }]);
    }, 500);
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
            <div
              key={idx}
              onClick={() => {
                setSelectedGuide(guide);
                setIsGuideModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                backgroundColor: colors.bg,
                borderRadius: 16,
                transition: 'all 0.2s',
                border: `1px solid ${colors.border}`,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <span style={{ fontSize: 24 }}>{guide.type === 'pdf' ? '📄' : guide.type === 'video' ? '🎬' : '📝'}</span>
              <span style={{ fontSize: 14, color: colors.text, flex: 1 }}>{guide.title}</span>
              <span className="material-icons-round" style={{ color: colors.primary, fontSize: 18 }}>arrow_forward</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {/* Modal */}
      {isGuideModalOpen && selectedGuide && (
        <>
          <div
            onClick={() => setIsGuideModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 1000
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 550,
            maxHeight: '80vh',
            overflowY: 'auto',
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 28,
            zIndex: 1001,
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>{selectedGuide.title}</h3>
              <button
                onClick={() => setIsGuideModalOpen(false)}
                style={{
                  background: colors.surface2,
                  border: 'none',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: colors.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>

            <div style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 1.7 }}>
              {selectedGuide.title === '📘 Craftora Satıcı Rehberi' && (
                <div>
                  <h4 style={{ fontSize: 18, fontWeight: 600, color: colors.primary, marginBottom: 16 }}>Craftora Satıcı Rehberi</h4>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>1. Hesap Oluşturma</h5>
                    <p>• Craftora'ya üye olun ve e-posta adresinizi doğrulayın.<br />
                      • Hesap ayarlarından "Satıcı Ol" butonuna tıklayarak satıcı başvurusu yapın.<br />
                      • Kimlik doğrulama ve vergi bilgilerinizi girin.</p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>2. Mağaza Kurulumu</h5>
                    <p>• Mağaza adı, logo ve kapak görseli ekleyin.<br />
                      • Mağaza açıklaması ve politikalarınızı belirleyin.<br />
                      • Ödeme bilgilerinizi (IBAN, PayPal vb.) girin.</p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>3. Ürün Ekleme</h5>
                    <p>• Ürün başlığı, açıklaması ve fiyat bilgilerini girin.<br />
                      • Yüksek kaliteli ürün görselleri yükleyin (min. 1024x1024 px).<br />
                      • Dijital ürünler için dosya (PDF, ZIP, MP4 vb.) yükleyin.<br />
                      • Stok durumu ve kargo seçeneklerini ayarlayın.</p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>4. Satış ve Pazarlama</h5>
                    <p>• Ürünlerinizi sosyal medyada paylaşın.<br />
                      • İndirim ve kampanyalar düzenleyin.<br />
                      • Müşteri yorumlarına hızlı yanıt verin.<br />
                      • Craftora reklam araçlarını kullanın.</p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>5. Ödeme ve Komisyon</h5>
                    <p>• Her satıştan %10 komisyon alınır.<br />
                      • Ödemeler aylık olarak 15'inde hesabınıza aktarılır.<br />
                      • Minimum ödeme eşiği ₺50'dir.</p>
                  </div>
                </div>
              )}

              {selectedGuide.title === '🖼️ Ürün görseli optimizasyonu' && (
                <div>
                  <h4 style={{ fontSize: 18, fontWeight: 600, color: colors.primary, marginBottom: 16 }}>Ürün Görseli Optimizasyonu</h4>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>📸 Görsel Boyutları</h5>
                    <p>• Önerilen boyut: 1024x1024 piksel<br />
                      • Minimum 500x500 piksel<br />
                      • Maksimum dosya boyutu: 5MB</p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>🎨 Görsel Kalitesi</h5>
                    <p>• Yüksek çözünürlük kullanın<br />
                      • Beyaz veya nötr arka plan tercih edin<br />
                      • Ürünün farklı açılarını gösterin (en az 3 fotoğraf)</p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>📈 SEO İpuçları</h5>
                    <p>• Dosya adında anahtar kelime kullanın (örn: siyah-elbise-1.jpg)<br />
                      • Alt metin (alt text) ekleyin<br />
                      • Ana görselde ürünü öne çıkarın</p>
                  </div>
                </div>
              )}

              {selectedGuide.title === '🔍 SEO ipuçları' && (
                <div>
                  <h4 style={{ fontSize: 18, fontWeight: 600, color: colors.primary, marginBottom: 16 }}>SEO İpuçları</h4>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>🏷️ Başlık Optimizasyonu</h5>
                    <p>• Anahtar kelimeyi başlığın başında kullanın<br />
                      • 60 karakteri geçmeyin<br />
                      • Marka + Ürün + Özellik formatını kullanın</p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>📝 Açıklama Optimizasyonu</h5>
                    <p>• 150-160 karakter arası olmalıdır<br />
                      • Anahtar kelimeyi doğal şekilde kullanın<br />
                      • Harekete geçirici mesaj ekleyin (Hemen Al, İncele vb.)</p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>🔗 URL Optimizasyonu</h5>
                    <p>• Kısa ve açıklayıcı URL kullanın<br />
                      • Anahtar kelime içersin<br />
                      • Rakam ve özel karakter kullanmaktan kaçının</p>
                  </div>
                </div>
              )}

              {selectedGuide.title === '⭐ Başarılı mağaza ipuçları' && (
                <div>
                  <h4 style={{ fontSize: 18, fontWeight: 600, color: colors.primary, marginBottom: 16 }}>Başarılı Mağaza İpuçları</h4>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>🏪 Mağaza Tasarımı</h5>
                    <p>• Profesyonel logo ve kapak görseli kullanın<br />
                      • Mağaza açıklamanızı detaylı yazın<br />
                      • Kategorileri düzenli tutun</p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>📦 Ürün Yönetimi</h5>
                    <p>• Stokları güncel tutun<br />
                      • Hızlı kargo gönderimi yapın<br />
                      • Ürün fiyatlarını rekabetçi belirleyin</p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h5 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 8 }}>💬 Müşteri İletişimi</h5>
                    <p>• Sorulara hızlı yanıt verin (24 saat içinde)<br />
                      • Olumsuz yorumları yapıcı şekilde değerlendirin<br />
                      • Memnun müşterilerden yorum isteyin</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsGuideModalOpen(false)}
              style={{
                marginTop: 24,
                padding: '12px 24px',
                backgroundColor: colors.primary,
                border: 'none',
                borderRadius: 30,
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Kapat
            </button>
          </div>
        </>
      )}

      {/* Video Eğitimler */}

      {/* Destek Talebi Oluştur */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        marginBottom: 32,
        overflow: 'hidden'
      }}>
        <div style={{ padding: 24, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💬</span> Destek Taleplerim
          </h2>
          <button
            onClick={() => setShowNewTicketForm(!showNewTicketForm)}
            style={{
              padding: '8px 16px',
              backgroundColor: colors.primary,
              border: 'none',
              borderRadius: 30,
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + Yeni Talep
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Yeni Talep Formu */}
          {showNewTicketForm && (
            <div style={{ marginBottom: 24, padding: 20, backgroundColor: colors.bg, borderRadius: 16, border: `1px solid ${colors.border}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 16 }}>Yeni Destek Talebi</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Konu Seçimi</label>
                  <select value={newTicketSubject} onChange={(e) => setNewTicketSubject(e.target.value)} style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }}>
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
                      <button key={p.value} onClick={() => setNewTicketPriority(p.value)} style={{ padding: '8px 16px', backgroundColor: newTicketPriority === p.value ? p.color : colors.surface, border: `1px solid ${colors.border}`, borderRadius: 30, color: newTicketPriority === p.value ? 'white' : colors.text, fontSize: 13, cursor: 'pointer' }}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: colors.textSecondary, display: 'block', marginBottom: 8 }}>Mesajınız</label>
                  <textarea rows={4} value={newTicketMessage} onChange={(e) => setNewTicketMessage(e.target.value)} placeholder="Sorunuzu veya talebinizi detaylıca yazın..." style={{ width: '100%', padding: '12px 16px', backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={createTicket} style={{ padding: '10px 20px', backgroundColor: colors.primary, border: 'none', borderRadius: 30, color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                    Gönder
                  </button>
                  <button onClick={() => setShowNewTicketForm(false)} style={{ padding: '10px 20px', backgroundColor: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 30, color: colors.textSecondary, cursor: 'pointer' }}>
                    İptal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Talepler Listesi */}
          {tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: colors.textSecondary }}>
              Henüz destek talebiniz yok.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tickets.map(ticket => (
                <div key={ticket.id} style={{
                  padding: 16,
                  backgroundColor: colors.bg,
                  borderRadius: 16,
                  border: `1px solid ${activeTicketId === ticket.id ? colors.primary : colors.border}`,
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }} onClick={() => setActiveTicketId(activeTicketId === ticket.id ? null : ticket.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{ticket.subject === 'Ödeme' ? '💰' : ticket.subject === 'Ürün' ? '📦' : ticket.subject === 'Teknik' ? '⚙️' : '📝'}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{ticket.subject}</div>
                        <div style={{ fontSize: 11, color: colors.textSecondary }}>Son mesaj: {ticket.messages[ticket.messages.length - 1]?.date}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: ticket.priority === 'urgent' ? '#ef4444' : ticket.priority === 'high' ? '#f59e0b' : '#0ea5e9',
                        color: 'white'
                      }}>
                        {ticket.priority === 'urgent' ? '🔴 Acil' : ticket.priority === 'high' ? '🟠 Yüksek' : '🔵 Normal'}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: ticket.status === 'answered' ? '#10b981' : '#f59e0b',
                        color: 'white'
                      }}>
                        {ticket.status === 'answered' ? 'Cevaplandı' : 'Bekliyor'}
                      </span>
                      <span className="material-icons-round" style={{ color: colors.textSecondary, transform: activeTicketId === ticket.id ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }}>
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Mesajlar */}
                  {activeTicketId === ticket.id && (
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${colors.border}` }}>
                      <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 16 }}>
                        {ticket.messages.map((msg, idx) => (
                          <div key={idx} style={{ marginBottom: 16, display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={{
                              maxWidth: '80%',
                              padding: '10px 14px',
                              borderRadius: 16,
                              backgroundColor: msg.type === 'user' ? colors.primary : colors.surface2,
                              color: msg.type === 'user' ? 'white' : colors.text
                            }}>
                              <div style={{ fontSize: 13 }}>{msg.message}</div>
                              <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{msg.date}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cevap Yaz */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendReply(ticket.id)}
                          placeholder="Cevap yazın..."
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            backgroundColor: colors.surface,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 30,
                            color: colors.text,
                            fontSize: 13,
                            outline: 'none'
                          }}
                        />
                        <button
                          onClick={() => sendReply(ticket.id)}
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sık Kullanılan Bağlantılar */}

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
            <span style={{ color: colors.text }}>destek@craftora.com</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-icons-round" style={{ color: colors.primary }}>schedule</span>
            <span style={{ color: colors.text }}>Destek ekibimize e-posta ile 7/24 ulaşabilirsiniz.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-icons-round" style={{ color: colors.primary }}>access_time</span>
            <span style={{ color: colors.text }}>En geç 24 saat içinde yanıt alırsınız.</span>
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