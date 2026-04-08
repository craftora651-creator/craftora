import { useState, useEffect } from 'react';
import { useSendEmail } from '../server/Gin/email.hooks';
import { useMyShops } from '../server/FastAPI/shop.hooks';
import axios from 'axios';

interface CustomersPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

// ==================== TYPES ====================
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'ACTIVE' | 'AWAY' | 'OFFLINE';
  lastActive: string;
  online: boolean;
  avatar: string;
  type: 'Ziyaretçi' | 'Görüntüleyen' | 'Alıcı' | 'Abone';
  lastPurchase: string;
  totalOrders: number;
  joinDate: string;
  visitCount: number;
  viewCount: number;
  purchaseCount: number;
}

interface Subscriber {
  id: number;
  email: string;
  status: string;
  created_at: string;
}

// ==================== API FUNCTIONS ====================
// Aboneleri backend'den çek
const getSubscribersFromBackend = async (shopId: string): Promise<Subscriber[]> => {
  if (!shopId) return [];
  try {
    const { data } = await axios.get(`http://localhost:8082/api/newsletter/subscribers?shop_id=${shopId}`);
    return data.subscribers || [];
  } catch (error) {
    console.error('Aboneler alınamadı:', error);
    return [];
  }
};

// Mock müşteri verileri


// ==================== MODAL BİLEŞENLERİ ====================
interface MailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  colors: CustomersPageProps['colors'];
  onSendMail: (to: string, subject: string, content: string) => void;
  isLoading: boolean;
}

const MailModal = ({ isOpen, onClose, customer, colors, onSendMail, isLoading }: MailModalProps) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (customer) {
      setTimeout(() => {
        setSubject(`Merhaba ${customer.name}`);
        setContent(`${customer.name} merhaba, size özel bir teklifimiz var!`);
      }, 0);
    }
  }, [customer]);
  
  if (!isOpen || !customer) return null;

  const handleSend = () => {
    if (!subject.trim() || !content.trim()) {
      alert('Lütfen konu ve mesaj giriniz');
      return;
    }
    onSendMail(customer.email, subject, content);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }} onClick={onClose}>
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 28,
        width: '100%',
        maxWidth: 480,
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }} onClick={e => e.stopPropagation()}>

        <div style={{
          padding: isMobile ? '20px 24px' : '24px 28px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: isMobile ? 20 : 22, fontWeight: 700, color: colors.text }}>
              📧 Mail Gönder
            </h3>
            <p style={{ margin: '6px 0 0', fontSize: isMobile ? 13 : 14, color: colors.textSecondary }}>
              {customer.name}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: isMobile ? 36 : 40,
            height: isMobile ? 36 : 40,
            borderRadius: 20,
            border: `1px solid ${colors.border}`,
            background: colors.bg,
            color: colors.textSecondary,
            cursor: 'pointer',
            fontSize: isMobile ? 18 : 20,
            transition: 'all 0.2s'
          }}>
            ✕
          </button>
        </div>

        <div style={{ padding: isMobile ? '20px 24px' : '24px 28px' }}>
          <div style={{
            padding: isMobile ? 12 : 14,
            backgroundColor: colors.bg,
            borderRadius: 16,
            marginBottom: 20,
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: isMobile ? 12 : 13, color: colors.textSecondary }}>Alıcı:</span>
              <span style={{ fontSize: isMobile ? 13 : 14, color: colors.text, fontWeight: 500 }}>{customer.email}</span>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontSize: isMobile ? 13 : 14,
              fontWeight: 500,
              color: colors.text
            }}>
              Konu
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E-posta konusu..."
              style={{
                width: '100%',
                padding: isMobile ? '12px 16px' : '14px 18px',
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 14,
                color: colors.text,
                fontSize: isMobile ? 14 : 15,
                outline: 'none',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontSize: isMobile ? 13 : 14,
              fontWeight: 500,
              color: colors.text
            }}>
              Mesaj
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Mesajınızı yazın..."
              rows={isMobile ? 5 : 6}
              style={{
                width: '100%',
                padding: isMobile ? '12px 16px' : '14px 18px',
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 14,
                color: colors.text,
                fontSize: isMobile ? 14 : 15,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        <div style={{
          padding: isMobile ? '16px 24px' : '20px 28px',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12
        }}>
          <button
            onClick={onClose}
            style={{
              padding: isMobile ? '10px 20px' : '12px 28px',
              background: 'transparent',
              border: `1px solid ${colors.border}`,
              borderRadius: 40,
              color: colors.textSecondary,
              fontSize: isMobile ? 13 : 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            İptal
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading}
            style={{
              padding: isMobile ? '10px 24px' : '12px 32px',
              background: '#0ea5e9',
              border: 'none',
              borderRadius: 40,
              color: 'white',
              fontSize: isMobile ? 13 : 14,
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {isLoading ? '⏳ Gönderiliyor...' : '✉️ Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  colors: CustomersPageProps['colors'];
}

const DetailModal = ({ isOpen, onClose, customer, colors }: DetailModalProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen || !customer) return null;

  const getStatusIcon = () => {
    if (customer.online) return '🟢';
    if (customer.status === 'AWAY') return '🟡';
    return '⚫';
  };

  const getTypeBadgeStyle = () => {
    switch (customer.type) {
      case 'Alıcı': return { bg: '#10b981', color: 'white' };
      case 'Görüntüleyen': return { bg: '#f59e0b', color: 'white' };
      case 'Abone': return { bg: '#8b5cf6', color: 'white' };
      default: return { bg: '#0ea5e9', color: 'white' };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }} onClick={onClose}>
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 32,
        width: '100%',
        maxWidth: 520,
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }} onClick={e => e.stopPropagation()}>

        <div style={{
          padding: isMobile ? '24px' : '28px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: isMobile ? 20 : 22, fontWeight: 700, color: colors.text }}>
              Müşteri Detayları
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: isMobile ? 13 : 14, color: colors.textSecondary }}>
              Profil bilgileri ve aktivite istatistikleri
            </p>
          </div>
          <button onClick={onClose} style={{
            width: isMobile ? 36 : 40,
            height: isMobile ? 36 : 40,
            borderRadius: 20,
            border: `1px solid ${colors.border}`,
            background: colors.bg,
            color: colors.textSecondary,
            cursor: 'pointer',
            fontSize: isMobile ? 18 : 20
          }}>
            ✕
          </button>
        </div>

        <div style={{ padding: isMobile ? '20px 24px' : '24px 28px' }}>
          {/* Profil Başlığı */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{
              width: isMobile ? 72 : 88,
              height: isMobile ? 72 : 88,
              borderRadius: 44,
              backgroundImage: `url(${customer.avatar})`,
              backgroundSize: 'cover',
              border: `3px solid ${getTypeBadgeStyle().bg}`,
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
            }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: colors.text }}>{customer.name}</span>
                <span style={{
                  fontSize: 11,
                  padding: '4px 12px',
                  borderRadius: 30,
                  backgroundColor: getTypeBadgeStyle().bg,
                  color: 'white',
                  fontWeight: 500
                }}>
                  {customer.type}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: isMobile ? 13 : 14, color: colors.textSecondary }}>{customer.email}</span>
                <span style={{ fontSize: 16 }}>{getStatusIcon()}</span>
              </div>
            </div>
          </div>

          {/* İstatistik Kartları */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 28
          }}>
            {[
              { label: 'Ziyaret', value: customer.visitCount, icon: '👥', color: '#0ea5e9' },
              { label: 'Görüntüleme', value: customer.viewCount, icon: '👁️', color: '#f59e0b' },
              { label: 'Satın Alma', value: customer.purchaseCount, icon: '🛒', color: '#10b981' }
            ].map(stat => (
              <div key={stat.label} style={{
                backgroundColor: colors.bg,
                borderRadius: 20,
                padding: isMobile ? '12px 8px' : '16px 12px',
                textAlign: 'center',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ fontSize: isMobile ? 20 : 24, marginBottom: 4 }}>{stat.icon}</div>
                <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Detay Bilgiler Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: 16
          }}>
            {[
              { label: '📞 Telefon', value: customer.phone },
              { label: '📍 Konum', value: customer.location },
              { label: '📅 Kayıt Tarihi', value: customer.joinDate },
              { label: '⏱️ Son Aktiflik', value: customer.lastActive },
              { label: '📦 Son Satın Alma', value: customer.lastPurchase },
              { label: '📊 Toplam Sipariş', value: `${customer.totalOrders} sipariş` }
            ].map(detail => (
              <div key={detail.label} style={{
                padding: isMobile ? '12px 0' : '12px 0',
                borderBottom: `1px solid ${colors.border}`
              }}>
                <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: 4 }}>{detail.label}</div>
                <div style={{ fontSize: isMobile ? 14 : 15, color: colors.text, fontWeight: 500 }}>{detail.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          padding: isMobile ? '20px 24px' : '24px 28px',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button onClick={onClose} style={{
            padding: isMobile ? '10px 28px' : '12px 36px',
            background: '#0ea5e9',
            border: 'none',
            borderRadius: 40,
            color: 'white',
            fontSize: isMobile ? 13 : 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== KART BİLEŞENİ ====================
interface CustomerCardProps {
  customer: Customer;
  onMailClick: (customer: Customer) => void;
  onDetailClick: (customer: Customer) => void;
  colors: CustomersPageProps['colors'];
}

const CustomerCard = ({ customer, onMailClick, onDetailClick, colors }: CustomerCardProps) => {
  const getTypeColor = () => {
    switch (customer.type) {
      case 'Alıcı': return '#10b981';
      case 'Görüntüleyen': return '#f59e0b';
      case 'Abone': return '#8b5cf6';
      default: return '#0ea5e9';
    }
  };

  const getStatusIcon = () => {
    if (customer.online) return '🟢';
    if (customer.status === 'AWAY') return '🟡';
    return '⚫';
  };

  return (
    <div style={{
      backgroundColor: colors.surface,
      borderRadius: 24,
      border: `1px solid ${colors.border}`,
      padding: 20,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    }}
      onClick={() => onDetailClick(customer)}>

      {/* Üst Kısım - Avatar ve İsim */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundImage: `url(${customer.avatar})`,
          backgroundSize: 'cover',
          border: `2px solid ${getTypeColor()}`,
          flexShrink: 0
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {customer.name}
            </span>
            <span style={{
              fontSize: 10,
              padding: '2px 10px',
              borderRadius: 30,
              backgroundColor: `${getTypeColor()}20`,
              color: getTypeColor(),
              fontWeight: 500
            }}>
              {customer.type}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {customer.email}
            </span>
            <span style={{ fontSize: 12 }}>{getStatusIcon()}</span>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        marginBottom: 16,
        backgroundColor: colors.bg,
        borderRadius: 20,
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0ea5e9' }}>{customer.visitCount}</div>
          <div style={{ fontSize: 10, color: colors.textSecondary }}>Ziyaret</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b' }}>{customer.viewCount}</div>
          <div style={{ fontSize: 10, color: colors.textSecondary }}>Görüntüleme</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: customer.purchaseCount > 0 ? '#10b981' : colors.textSecondary }}>
            {customer.purchaseCount}
          </div>
          <div style={{ fontSize: 10, color: colors.textSecondary }}>Satın Alma</div>
        </div>
      </div>

      {/* Butonlar */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMailClick(customer);
          }}
          style={{
            flex: 1,
            padding: '10px 12px',
            backgroundColor: 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: 40,
            color: colors.text,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s'
          }}
        >
          ✉️ Mail At
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDetailClick(customer);
          }}
          style={{
            flex: 1,
            padding: '10px 12px',
            backgroundColor: '#0ea5e9',
            border: 'none',
            borderRadius: 40,
            color: 'white',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s'
          }}
        >
          📋 Detaylar
        </button>
      </div>
    </div>
  );
};

// ==================== BAŞARILI MAIL MODALI ====================
interface MailSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  to: string;
  colors: CustomersPageProps['colors'];
}

const MailSuccessModal = ({ isOpen, onClose, to, colors }: MailSuccessModalProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001,
      padding: 16
    }} onClick={onClose}>
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 28,
        width: '100%',
        maxWidth: 360,
        textAlign: 'center',
        padding: isMobile ? 28 : 32,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }} onClick={e => e.stopPropagation()}>

        <div style={{
          width: isMobile ? 64 : 72,
          height: isMobile ? 64 : 72,
          backgroundColor: 'rgba(16,185,129,0.15)',
          borderRadius: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <span style={{ fontSize: isMobile ? 36 : 42 }}>✅</span>
        </div>

        <h3 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>
          Mail Gönderildi!
        </h3>

        <p style={{ fontSize: isMobile ? 13 : 14, color: colors.textSecondary, margin: '0 0 24px' }}>
          {to} adresine mail başarıyla iletildi.
        </p>

        <button
          onClick={onClose}
          style={{
            padding: isMobile ? '10px 28px' : '12px 32px',
            backgroundColor: '#0ea5e9',
            border: 'none',
            borderRadius: 40,
            color: 'white',
            fontSize: isMobile ? 13 : 14,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Tamam
        </button>
      </div>
    </div>
  );
};

// ==================== ANA SAYFA ====================
const CustomersPage = ({ colors }: CustomersPageProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mailModal, setMailModal] = useState<{ isOpen: boolean; customer: Customer | null }>({
    isOpen: false,
    customer: null
  });
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; customer: Customer | null }>({
    isOpen: false,
    customer: null
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; to: string }>({
    isOpen: false,
    to: ''
  });
  const customersPerPage = 6;

  const { mutate: sendEmail, isPending: isSendingEmail } = useSendEmail();
  const { data: myShops } = useMyShops();
  const [selectedShopId, setSelectedShopId] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [mockCustomers, setMockCustomers] = useState<Customer[]>([]);
  const [loadingMock, setLoadingMock] = useState(false);

  // Mağaza ID'sini al
  useEffect(() => {
    if (myShops && myShops.length > 0) {
      setSelectedShopId(myShops[0].id);
    }
  }, [myShops]);

  // Aboneleri çek
  useEffect(() => {
    if (selectedShopId) {
      setLoadingSubscribers(true);
      getSubscribersFromBackend(selectedShopId)
        .then(data => {
          setSubscribers(data);
          setLoadingSubscribers(false);
        })
        .catch(err => {
          console.error('Abone çekme hatası:', err);
          setLoadingSubscribers(false);
        });
    }
  }, [selectedShopId]);

  // Mock müşterileri çek

  // Aboneleri Customer formatına çevir
  const subscriberCustomers: Customer[] = subscribers.map(sub => ({
    id: `sub_${sub.id}`,
    name: sub.email.split('@')[0],
    email: sub.email,
    phone: '-',
    location: '-',
    status: 'ACTIVE',
    lastActive: new Date(sub.created_at).toLocaleString(),
    online: false,
    avatar: `https://ui-avatars.com/api/?name=${sub.email.split('@')[0]}&background=8b5cf6&color=fff&size=80`,
    type: 'Abone',
    lastPurchase: 'Henüz alışveriş yok',
    totalOrders: 0,
    joinDate: new Date(sub.created_at).toLocaleDateString('tr-TR'),
    visitCount: 0,
    viewCount: 0,
    purchaseCount: 0
  }));

  // Tüm müşteriler = Mock müşteriler + Aboneler
  const allCustomers = [...mockCustomers, ...subscriberCustomers];

  // İstatistikler
  const stats = {
    totalVisitors: allCustomers.filter(c => c.type === 'Ziyaretçi').length,
    totalBuyers: allCustomers.filter(c => c.type === 'Alıcı').length,
    totalViewers: allCustomers.filter(c => c.type === 'Görüntüleyen').length,
    totalSubscribers: allCustomers.filter(c => c.type === 'Abone').length,
    conversionRate: allCustomers.length > 0 
      ? Math.round((allCustomers.filter(c => c.type === 'Alıcı').length / allCustomers.length) * 100) 
      : 0
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtreleme
  const filteredCustomers = allCustomers.filter(customer => {
    if (filterStatus !== 'all' && customer.status !== filterStatus) return false;
    if (filterType !== 'all' && customer.type !== filterType) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.location.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const handleSendMail = (to: string, subject: string, content: string) => {
    sendEmail(
      { to, subject, body: content },
      {
        onSuccess: () => {
          setSuccessModal({ isOpen: true, to });
          setMailModal({ isOpen: false, customer: null });
        },
        onError: (error) => {
          alert(`❌ Mail gönderilemedi: ${error.message}`);
        }
      }
    );
  };

  const openMailModal = (customer: Customer) => {
    setMailModal({ isOpen: true, customer });
  };

  const openDetailModal = (customer: Customer) => {
    setDetailModal({ isOpen: true, customer });
  };

  const getCardGridColumns = () => {
    if (isMobile) return '1fr';
    if (isTablet) return 'repeat(2, 1fr)';
    return 'repeat(3, 1fr)';
  };

  const isLoading = loadingMock || loadingSubscribers;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: colors.textSecondary }}>
        <div style={{ fontSize: 20, marginBottom: 12 }}>📊</div>
        Müşteri verileri yükleniyor...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%' }}>
      {/* İstatistik Kartları - 5 KART */}
      {/* İstatistik Kartları - 4 KART */}
{/* İstatistik Kartları - 4 KART (Analytics sayfasındaki gibi) */}
<div className="grid-4" style={{
  display: 'grid',
  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
  gap: isMobile ? 10 : 20,
  marginBottom: 32
}}>
  {/* Ziyaretçi */}
  <div style={{
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: isMobile ? 16 : 24,
    border: `1px solid ${colors.border}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 12 : 16 }}>
      <div style={{
        width: isMobile ? 40 : 48,
        height: isMobile ? 40 : 48,
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: isMobile ? 20 : 24 }}>group</span>
      </div>
      <span style={{
        color: '#10b981',
        fontSize: isMobile ? 11 : 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: isMobile ? '2px 8px' : '4px 10px',
        borderRadius: 20
      }}>
        +12%
      </span>
    </div>
    <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
      TOPLAM ZİYARETÇİ
    </div>
    <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
      {stats.totalVisitors}
    </div>
  </div>

  {/* Satın Alan */}
  <div style={{
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: isMobile ? 16 : 24,
    border: `1px solid ${colors.border}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 12 : 16 }}>
      <div style={{
        width: isMobile ? 40 : 48,
        height: isMobile ? 40 : 48,
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="material-icons-round" style={{ color: '#a855f7', fontSize: isMobile ? 20 : 24 }}>shopping_cart</span>
      </div>
      <span style={{
        color: colors.textSecondary,
        fontSize: isMobile ? 11 : 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        padding: isMobile ? '2px 8px' : '4px 10px',
        borderRadius: 20
      }}>
        +8%
      </span>
    </div>
    <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
      SATIN ALAN
    </div>
    <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
      {stats.totalBuyers}
    </div>
  </div>

  {/* Görüntüleyen */}
  <div style={{
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: isMobile ? 16 : 24,
    border: `1px solid ${colors.border}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 12 : 16 }}>
      <div style={{
        width: isMobile ? 40 : 48,
        height: isMobile ? 40 : 48,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="material-icons-round" style={{ color: '#f59e0b', fontSize: isMobile ? 20 : 24 }}>visibility</span>
      </div>
      <span style={{
        color: colors.textSecondary,
        fontSize: isMobile ? 11 : 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        padding: isMobile ? '2px 8px' : '4px 10px',
        borderRadius: 20
      }}>
        +15%
      </span>
    </div>
    <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
      GÖRÜNTÜLEYEN
    </div>
    <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
      {stats.totalViewers}
    </div>
  </div>

  {/* Abone */}
  <div style={{
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: isMobile ? 16 : 24,
    border: `1px solid ${colors.border}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 12 : 16 }}>
      <div style={{
        width: isMobile ? 40 : 48,
        height: isMobile ? 40 : 48,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="material-icons-round" style={{ color: '#8b5cf6', fontSize: isMobile ? 20 : 24 }}>mail</span>
      </div>
      <span style={{
        color: '#10b981',
        fontSize: isMobile ? 11 : 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: isMobile ? '2px 8px' : '4px 10px',
        borderRadius: 20
      }}>
        +5%
      </span>
    </div>
    <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
      ABONE
    </div>
    <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
      {stats.totalSubscribers}
    </div>
  </div>
</div>
      {/* Tip Filtresi */}
      <div style={{ marginBottom: 24, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Tümü', icon: '📋' },
            { key: 'Alıcı', label: 'Alıcı', icon: '🛒' },
            { key: 'Ziyaretçi', label: 'Ziyaretçi', icon: '👥' },
            { key: 'Görüntüleyen', label: 'Görüntüleyen', icon: '👁️' },
            { key: 'Abone', label: 'Abone', icon: '📧' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setFilterType(filter.key)}
              style={{
                padding: isMobile ? '6px 16px' : '8px 20px',
                backgroundColor: filterType === filter.key ? '#0ea5e9' : 'transparent',
                border: `1px solid ${filterType === filter.key ? '#0ea5e9' : colors.border}`,
                borderRadius: 40,
                color: filterType === filter.key ? 'white' : colors.textSecondary,
                fontSize: isMobile ? 12 : 13,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s'
              }}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Arama Kutusu */}
        <div style={{ position: 'relative', minWidth: isMobile ? '100%' : 250 }}>
          <input
            type="text"
            placeholder="İsim, e-posta veya konum ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: isMobile ? '10px 16px 10px 40px' : '10px 16px 10px 40px',
              borderRadius: 40,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.bg,
              outline: 'none',
              fontSize: isMobile ? 13 : 14,
              color: colors.text
            }}
          />
          <span style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 16
          }}>🔍</span>
        </div>
      </div>

      {/* Durum Filtresi */}
     

      {/* Müşteri Kartları */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: getCardGridColumns(),
        gap: 20
      }}>
        {currentCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onMailClick={openMailModal}
            onDetailClick={openDetailModal}
            colors={colors}
          />
        ))}
      </div>

      {/* Boş Durum */}
      {currentCustomers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 48,
          color: colors.textSecondary,
          backgroundColor: colors.surface,
          borderRadius: 24,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Müşteri bulunamadı</div>
          <div style={{ fontSize: 13 }}>Filtreleri kaldırarak tekrar deneyin</div>
        </div>
      )}

      {/* Modallar */}
      <MailModal
        isOpen={mailModal.isOpen}
        onClose={() => setMailModal({ isOpen: false, customer: null })}
        customer={mailModal.customer}
        colors={colors}
        onSendMail={handleSendMail}
        isLoading={isSendingEmail}
      />
      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, customer: null })}
        customer={detailModal.customer}
        colors={colors}
      />
      <MailSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, to: '' })}
        to={successModal.to}
        colors={colors}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: 32, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: 16 }}>
          <div style={{ fontSize: isMobile ? 12 : 13, color: colors.textSecondary, textAlign: isMobile ? 'center' : 'left' }}>
            {indexOfFirstCustomer + 1} - {Math.min(indexOfLastCustomer, filteredCustomers.length)} / {filteredCustomers.length} müşteri
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: isMobile ? '8px 14px' : '8px 16px',
                background: 'none',
                border: `1px solid ${colors.border}`,
                borderRadius: 40,
                color: currentPage === 1 ? colors.textSecondary : colors.text,
                fontSize: isMobile ? 12 : 13,
                cursor: currentPage === 1 ? 'default' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ← Önceki
            </button>
            {!isMobile && [...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    minWidth: 36,
                    padding: '8px 12px',
                    background: currentPage === pageNum ? '#0ea5e9' : 'none',
                    border: `1px solid ${currentPage === pageNum ? '#0ea5e9' : colors.border}`,
                    borderRadius: 40,
                    color: currentPage === pageNum ? 'white' : colors.textSecondary,
                    fontSize: isMobile ? 12 : 13,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            {isMobile && (
              <span style={{
                padding: '8px 16px',
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 40,
                color: colors.text,
                fontSize: 13
              }}>
                {currentPage} / {totalPages}
              </span>
            )}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: isMobile ? '8px 14px' : '8px 16px',
                background: 'none',
                border: `1px solid ${colors.border}`,
                borderRadius: 40,
                color: currentPage === totalPages ? colors.textSecondary : colors.text,
                fontSize: isMobile ? 12 : 13,
                cursor: currentPage === totalPages ? 'default' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sonraki →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;