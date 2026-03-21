import { useState, useEffect } from 'react';

interface CustomersPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

// Mesaj Modal Bileşeni (Responsive)
const MessageModal = ({ 
  isOpen, 
  onClose, 
  customer, 
  colors 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  customer: any; 
  colors: any;
}) => {
  const [messageType, setMessageType] = useState<'whatsapp' | 'email' | 'sms' | 'craftora'>('craftora');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen || !customer) return null;

  const handleSend = () => {
    console.log('Mesaj gönderiliyor:', {
      type: messageType,
      to: customer,
      subject,
      message
    });
    alert(`Mesaj gönderildi: ${messageType} - ${customer.name}`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }} onClick={onClose}>
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        width: '100%',
        maxWidth: 500,
        maxHeight: '90vh',
        overflow: 'auto',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: isMobile ? '16px 20px' : '20px 24px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: isMobile ? 18 : 20, fontWeight: 600, color: colors.text }}>
              Mesaj Gönder
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: isMobile ? 12 : 14, color: colors.textSecondary }}>
              {customer?.name} • {customer?.email}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: isMobile ? 36 : 40,
            height: isMobile ? 36 : 40,
            borderRadius: 20,
            border: `1px solid ${colors.border}`,
            background: colors.bg,
            color: colors.text,
            cursor: 'pointer',
            fontSize: isMobile ? 18 : 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            ✕
          </button>
        </div>

        {/* Mesaj Tipi Seçici - Mobilde 2 sütun */}
        <div style={{
          padding: isMobile ? 20 : 24,
          borderBottom: `1px solid ${colors.border}`
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: 8
          }}>
            {[
              { type: 'craftora', label: '📱 Craftora', color: '#0ea5e9' },
              { type: 'whatsapp', label: '💬 WhatsApp', color: '#25D366' },
              { type: 'email', label: '✉️ Email', color: '#a855f7' },
              { type: 'sms', label: '📱 SMS', color: '#f59e0b' }
            ].map(option => (
              <button
                key={option.type}
                onClick={() => setMessageType(option.type as any)}
                style={{
                  padding: isMobile ? '10px 4px' : '12px 8px',
                  backgroundColor: messageType === option.type ? option.color : 'transparent',
                  border: `1px solid ${messageType === option.type ? option.color : colors.border}`,
                  borderRadius: 12,
                  color: messageType === option.type ? 'white' : colors.text,
                  fontSize: isMobile ? 12 : 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mesaj İçeriği */}
        <div style={{ padding: isMobile ? 20 : 24 }}>
          {messageType === 'email' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 8, 
                fontSize: isMobile ? 12 : 13, 
                color: colors.textSecondary 
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
                  padding: isMobile ? '10px 14px' : '12px 16px',
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  color: colors.text,
                  fontSize: isMobile ? 13 : 14,
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: isMobile ? 12 : 13, 
              color: colors.textSecondary 
            }}>
              Mesajınız
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              rows={isMobile ? 4 : 6}
              style={{
                width: '100%',
                padding: isMobile ? '10px 14px' : '12px 16px',
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                color: colors.text,
                fontSize: isMobile ? 13 : 14,
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Önizleme */}
          <div style={{
            padding: isMobile ? 12 : 16,
            backgroundColor: colors.bg,
            borderRadius: 12,
            marginBottom: 24,
            fontSize: isMobile ? 12 : 13,
            color: colors.textSecondary,
            border: `1px dashed ${colors.border}`
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, color: colors.text }}>Alıcı:</span>
              <span>{customer?.name} ({messageType === 'email' ? customer?.email : customer?.phone})</span>
            </div>
            {messageType === 'craftora' && (
              <div style={{ color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', padding: 8, borderRadius: 8 }}>
                📢 Bu mesaj Craftora uygulamasında bildirim olarak görünecek
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: isMobile ? 20 : 24,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12
        }}>
          <button
            onClick={onClose}
            style={{
              padding: isMobile ? '10px 20px' : '12px 24px',
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: 30,
              color: colors.text,
              fontSize: isMobile ? 13 : 14,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            İptal
          </button>
          <button
            onClick={handleSend}
            style={{
              padding: isMobile ? '10px 20px' : '12px 24px',
              background: messageType === 'whatsapp' ? '#25D366' :
                         messageType === 'email' ? '#a855f7' :
                         messageType === 'sms' ? '#f59e0b' : '#0ea5e9',
              border: 'none',
              borderRadius: 30,
              color: 'white',
              fontSize: isMobile ? 13 : 14,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomersPage = ({ colors }: CustomersPageProps) => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageModal, setMessageModal] = useState<{ isOpen: boolean; customer: any }>({
    isOpen: false,
    customer: null
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const customersPerPage = 8;

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

  // Müşteri verileri
  const allCustomers = [
    {
      id: '1',
      name: 'Jenny Wilson',
      email: 'jenny.wilson@example.com',
      phone: '+1 (212) 555-1234',
      location: 'New York, USA',
      status: 'ACTIVE',
      statusColor: '#10b981',
      lastActive: '2 min ago',
      online: true,
      avatar: 'https://ui-avatars.com/api/?name=Jenny+Wilson&background=0ea5e9&color=fff&size=40',
      type: 'Premium',
      lastPurchase: 'Nike Air Max',
      totalOrders: 24,
      joinDate: '12 Jan 2023'
    },
    {
      id: '2',
      name: 'Robert Fox',
      email: 'robert.fox@example.com',
      phone: '+44 20 7946 0138',
      location: 'London, UK',
      status: 'ACTIVE',
      statusColor: '#10b981',
      lastActive: '15 min ago',
      online: true,
      avatar: 'https://ui-avatars.com/api/?name=Robert+Fox&background=0ea5e9&color=fff&size=40',
      type: 'Standard',
      lastPurchase: 'Ultimate UI Kit',
      totalOrders: 15,
      joinDate: '23 Mar 2023'
    },
    {
      id: '3',
      name: 'Jacob Jones',
      email: 'jacob.jones@example.com',
      phone: '+49 30 1234 5678',
      location: 'Berlin, Germany',
      status: 'AWAY',
      statusColor: '#f59e0b',
      lastActive: '1 hour ago',
      online: false,
      avatar: 'https://ui-avatars.com/api/?name=Jacob+Jones&background=0ea5e9&color=fff&size=40',
      type: 'Basic',
      lastPurchase: 'SEO E-book',
      totalOrders: 5,
      joinDate: '05 Apr 2023'
    },
    {
      id: '4',
      name: 'Courtney Henry',
      email: 'courtney.henry@example.com',
      phone: '+33 1 2345 6789',
      location: 'Paris, France',
      status: 'ACTIVE',
      statusColor: '#10b981',
      lastActive: '3 hours ago',
      online: true,
      avatar: 'https://ui-avatars.com/api/?name=Courtney+Henry&background=0ea5e9&color=fff&size=40',
      type: 'VIP',
      lastPurchase: 'Plasma Thruster',
      totalOrders: 67,
      joinDate: '18 Aug 2022'
    },
    {
      id: '5',
      name: 'Dianne Russell',
      email: 'dianne.russell@example.com',
      phone: '+81 3 1234 5678',
      location: 'Tokyo, Japan',
      status: 'ACTIVE',
      statusColor: '#10b981',
      lastActive: '5 hours ago',
      online: true,
      avatar: 'https://ui-avatars.com/api/?name=Dianne+Russell&background=0ea5e9&color=fff&size=40',
      type: 'Standard',
      lastPurchase: 'Quantum Processor',
      totalOrders: 12,
      joinDate: '30 Sep 2023'
    },
    {
      id: '6',
      name: 'Guy Hawkins',
      email: 'guy.hawkins@example.com',
      phone: '+61 2 1234 5678',
      location: 'Sydney, Australia',
      status: 'OFFLINE',
      statusColor: '#6b7280',
      lastActive: '2 days ago',
      online: false,
      avatar: 'https://ui-avatars.com/api/?name=Guy+Hawkins&background=0ea5e9&color=fff&size=40',
      type: 'Basic',
      lastPurchase: 'None',
      totalOrders: 0,
      joinDate: '12 Nov 2023'
    },
    {
      id: '7',
      name: 'Eleanor Pena',
      email: 'eleanor.pena@example.com',
      phone: '+34 91 123 4567',
      location: 'Madrid, Spain',
      status: 'ACTIVE',
      statusColor: '#10b981',
      lastActive: '1 day ago',
      online: true,
      avatar: 'https://ui-avatars.com/api/?name=Eleanor+Pena&background=0ea5e9&color=fff&size=40',
      type: 'Premium',
      lastPurchase: 'Neural Interface',
      totalOrders: 28,
      joinDate: '22 Jul 2023'
    },
    {
      id: '8',
      name: 'Ronald Richards',
      email: 'ronald.richards@example.com',
      phone: '+39 02 1234 5678',
      location: 'Milan, Italy',
      status: 'ACTIVE',
      statusColor: '#10b981',
      lastActive: '30 min ago',
      online: true,
      avatar: 'https://ui-avatars.com/api/?name=Ronald+Richards&background=0ea5e9&color=fff&size=40',
      type: 'VIP',
      lastPurchase: 'Omni-Cloud Core',
      totalOrders: 124,
      joinDate: '05 Jan 2023'
    }
  ];

  // Arama ve filtreleme
  const filteredCustomers = allCustomers.filter(customer => {
    if (filterStatus !== 'all' && customer.status !== filterStatus) return false;
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

  // Sayfalama
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Seçim işlemleri
  const toggleCustomer = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleAll = () => {
    if (selectedCustomers.length === currentCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(currentCustomers.map(c => c.id));
    }
  };

  // Mail gönderme
  const sendEmail = (email: string, name: string) => {
    window.location.href = `mailto:${email}?subject=Hello ${name}&body=Hi ${name},`;
  };

  // Toplu mail
  const sendBulkEmail = () => {
    const selectedEmails = selectedCustomers.map(id =>
      allCustomers.find(c => c.id === id)?.email
    ).filter(Boolean).join(',');
    
    if (selectedEmails) {
      window.location.href = `mailto:${selectedEmails}?subject=Campaign&body=Hello,`;
    }
  };

  const openMessageModal = (customer: any) => {
    setMessageModal({ isOpen: true, customer });
  };

  // Responsive grid sütun sayısı
  const getMetricGridColumns = () => {
    if (isMobile) return 'repeat(2, 1fr)'; // Mobilde 2 sütun
    if (isTablet) return 'repeat(2, 1fr)'; // Tablet'te 2 sütun
    return 'repeat(4, 1fr)'; // Masaüstünde 4 sütun
  };

  return (
    <div style={{ 
      minHeight: '100%',
    }}>
      {/* Arama Çubuğu */}

      {/* 4'lü Metric Kartlar - Admin.tsx'teki gibi */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: getMetricGridColumns(),
        gap: isMobile ? 12 : 20,
        marginBottom: 32
      }}>
        {/* Total Active Users */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${colors.border}`,
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
              <span style={{ color: '#0ea5e9', fontSize: isMobile ? 20 : 24 }}>👥</span>
            </div>
            <span style={{
              color: '#10b981',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              +12.5%
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            TOTAL ACTIVE USERS
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>1,482</div>
        </div>

        {/* Online Now */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${colors.border}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 12 : 16 }}>
            <div style={{
              width: isMobile ? 40 : 48,
              height: isMobile ? 40 : 48,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: '#10b981', fontSize: isMobile ? 20 : 24 }}>🟢</span>
            </div>
            <span style={{
              color: '#10b981',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              +8.2%
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            ONLINE NOW
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>342</div>
        </div>

        {/* Messages Sent */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${colors.border}`,
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
              <span style={{ color: '#a855f7', fontSize: isMobile ? 20 : 24 }}>💬</span>
            </div>
            <span style={{
              color: colors.textSecondary,
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              This week
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            MESSAGES SENT
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>1,245</div>
        </div>

        {/* Response Rate */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${colors.border}`,
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
              <span style={{ color: '#f59e0b', fontSize: isMobile ? 20 : 24 }}>⚡</span>
            </div>
            <span style={{
              color: '#10b981',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              +5.2%
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            RESPONSE RATE
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>94%</div>
        </div>
      </div>

      {/* Filtreler - Yatay kaydırma */}
      <div style={{ 
        marginBottom: 24,
        overflowX: 'auto',
        paddingBottom: 8,
        WebkitOverflowScrolling: 'touch'
      }}>
        <div style={{ 
          display: 'flex',
          gap: 8,
          backgroundColor: colors.surface,
          padding: 4,
          borderRadius: 30,
          border: `1px solid ${colors.border}`,
          width: 'fit-content'
        }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              padding: isMobile ? '6px 16px' : '8px 24px',
              backgroundColor: filterStatus === 'all' ? '#0ea5e9' : 'transparent',
              border: 'none',
              borderRadius: 30,
              color: filterStatus === 'all' ? 'white' : colors.textSecondary,
              fontSize: isMobile ? 12 : 14,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('ACTIVE')}
            style={{
              padding: isMobile ? '6px 16px' : '8px 24px',
              backgroundColor: filterStatus === 'ACTIVE' ? '#10b981' : 'transparent',
              border: 'none',
              borderRadius: 30,
              color: filterStatus === 'ACTIVE' ? 'white' : colors.textSecondary,
              fontSize: isMobile ? 12 : 14,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🟢 Active
          </button>
          <button
            onClick={() => setFilterStatus('AWAY')}
            style={{
              padding: isMobile ? '6px 16px' : '8px 24px',
              backgroundColor: filterStatus === 'AWAY' ? '#f59e0b' : 'transparent',
              border: 'none',
              borderRadius: 30,
              color: filterStatus === 'AWAY' ? 'white' : colors.textSecondary,
              fontSize: isMobile ? 12 : 14,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            🟡 Away
          </button>
          <button
            onClick={() => setFilterStatus('OFFLINE')}
            style={{
              padding: isMobile ? '6px 16px' : '8px 24px',
              backgroundColor: filterStatus === 'OFFLINE' ? '#6b7280' : 'transparent',
              border: 'none',
              borderRadius: 30,
              color: filterStatus === 'OFFLINE' ? 'white' : colors.textSecondary,
              fontSize: isMobile ? 12 : 14,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            ⚫ Offline
          </button>
        </div>
      </div>

      {/* Toplu Mail Butonu */}
      {selectedCustomers.length > 0 && (
        <div style={{
          marginBottom: 16,
          padding: isMobile ? '10px 16px' : '12px 20px',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <span style={{ fontSize: isMobile ? 13 : 14, color: colors.text }}>
            {selectedCustomers.length} müşteri seçildi
          </span>
          <button
            onClick={sendBulkEmail}
            style={{
              padding: isMobile ? '6px 16px' : '8px 20px',
              backgroundColor: '#0ea5e9',
              border: 'none',
              borderRadius: 30,
              color: 'white',
              fontSize: isMobile ? 12 : 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>✉️</span>
            Toplu Mail Gönder
          </button>
        </div>
      )}

      {/* Müşteri Listesi - Responsive */}
      {isMobile ? (
        // Mobil Görünüm - Kartlar
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          {currentCustomers.map((customer) => (
            <div
              key={customer.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                border: `1px solid ${colors.border}`,
                padding: 16,
                position: 'relative'
              }}
            >
              {/* Seçim Checkbox */}
              <div style={{
                position: 'absolute',
                top: 16,
                right: 16
              }}>
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={() => toggleCustomer(customer.id)}
                  style={{ cursor: 'pointer', width: 18, height: 18 }}
                />
              </div>

              {/* Üst Kısım - Avatar ve İsim */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundImage: `url(${customer.avatar})`,
                  backgroundSize: 'cover',
                  border: customer.type === 'VIP' ? `2px solid #a855f7` : 'none'
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{customer.name}</span>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: customer.online ? '#10b981' : customer.status === 'AWAY' ? '#f59e0b' : '#6b7280'
                    }} />
                  </div>
                  <div style={{ fontSize: 13, color: colors.textSecondary }}>{customer.email}</div>
                </div>
              </div>

              {/* Detay Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                marginBottom: 16,
                padding: 12,
                backgroundColor: colors.bg,
                borderRadius: 12
              }}>
                <div>
                  <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>Telefon</div>
                  <div style={{ fontSize: 12, color: colors.text }}>{customer.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>Konum</div>
                  <div style={{ fontSize: 12, color: colors.text }}>{customer.location}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>Son Sipariş</div>
                  <div style={{ fontSize: 12, color: colors.text }}>{customer.lastPurchase}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>Toplam Sipariş</div>
                  <div style={{ fontSize: 12, color: colors.text }}>{customer.totalOrders}</div>
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div style={{
                display: 'flex',
                gap: 8,
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => openMessageModal(customer)}
                  style={{
                    padding: '8px 16px',
                    background: 'none',
                    border: `1px solid ${colors.border}`,
                    borderRadius: 20,
                    color: colors.text,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  💬 Mesaj
                </button>
                <button
                  onClick={() => sendEmail(customer.email, customer.name)}
                  style={{
                    padding: '8px 16px',
                    background: 'none',
                    border: `1px solid ${colors.border}`,
                    borderRadius: 20,
                    color: colors.text,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  ✉️ Mail
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Masaüstü ve Tablet Görünümü - Tablo
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          border: `1px solid ${colors.border}`,
          overflow: 'auto'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTablet 
              ? '40px 60px 2fr 2fr 1.5fr 1.5fr'
              : '40px 60px 2fr 2fr 1.5fr 1fr 2fr',
            padding: isMobile ? '12px 16px' : '16px 24px',
            backgroundColor: colors.bg,
            borderBottom: `1px solid ${colors.border}`,
            fontSize: isMobile ? 11 : 12,
            fontWeight: 500,
            color: colors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            alignItems: 'center',
            minWidth: isTablet ? '800px' : 'auto'
          }}>
            <div>
              <input
                type="checkbox"
                checked={selectedCustomers.length === currentCustomers.length && currentCustomers.length > 0}
                onChange={toggleAll}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div>STATUS</div>
            <div>CUSTOMER</div>
            <div>CONTACT</div>
            <div>LOCATION</div>
            {!isTablet && <div>LAST PURCHASE</div>}
            <div style={{ textAlign: 'center' }}>ACTIONS</div>
          </div>

          {/* Customer Rows */}
          {currentCustomers.map((customer) => (
            <div
              key={customer.id}
              style={{
                display: 'grid',
                gridTemplateColumns: isTablet 
                  ? '40px 60px 2fr 2fr 1.5fr 1.5fr'
                  : '40px 60px 2fr 2fr 1.5fr 1fr 2fr',
                padding: isMobile ? '12px 16px' : '16px 24px',
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: selectedCustomers.includes(customer.id) ? 'rgba(14,165,233,0.1)' : colors.surface,
                alignItems: 'center',
                minWidth: isTablet ? '800px' : 'auto'
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={() => toggleCustomer(customer.id)}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: customer.online ? '#10b981' : customer.status === 'AWAY' ? '#f59e0b' : '#6b7280',
                  boxShadow: customer.online ? '0 0 8px #10b981' : 'none'
                }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundImage: `url(${customer.avatar})`,
                  backgroundSize: 'cover',
                  border: customer.type === 'VIP' ? `2px solid #a855f7` : 'none'
                }} />
                <div>
                  <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 500, color: colors.text, marginBottom: 2 }}>
                    {customer.name}
                  </div>
                  <div style={{ fontSize: isMobile ? 10 : 11, color: customer.type === 'VIP' ? '#a855f7' : colors.textSecondary }}>
                    {customer.type} • {customer.totalOrders} orders
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: isMobile ? 12 : 13, color: colors.text, marginBottom: 4 }}>{customer.email}</div>
                <div style={{ fontSize: isMobile ? 10 : 11, color: colors.textSecondary }}>{customer.phone}</div>
              </div>

              <div>
                <div style={{ fontSize: isMobile ? 12 : 13, color: colors.text }}>{customer.location}</div>
                <div style={{ fontSize: isMobile ? 9 : 10, color: colors.textSecondary }}>Joined {customer.joinDate}</div>
              </div>

              {!isTablet && (
                <div>
                  <div style={{ fontSize: isMobile ? 12 : 13, color: colors.text }}>{customer.lastPurchase}</div>
                  <div style={{ fontSize: isMobile ? 9 : 10, color: colors.textSecondary }}>{customer.lastActive}</div>
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 4
              }}>
                <button
                  onClick={() => openMessageModal(customer)}
                  style={{
                    width: isMobile ? 28 : 32,
                    height: isMobile ? 28 : 32,
                    background: 'none',
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    color: colors.textSecondary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? 14 : 16
                  }}
                  title="Mesaj Gönder"
                >
                  💬
                </button>

                <button
                  onClick={() => sendEmail(customer.email, customer.name)}
                  style={{
                    width: isMobile ? 28 : 32,
                    height: isMobile ? 28 : 32,
                    background: 'none',
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    color: colors.textSecondary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? 14 : 16
                  }}
                  title="Email Gönder"
                >
                  ✉️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal({ isOpen: false, customer: null })}
        customer={messageModal.customer}
        colors={colors}
      />

      {/* Pagination - Responsive */}
      <div style={{
        marginTop: 24,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 16
      }}>
        <div style={{ fontSize: isMobile ? 12 : 13, color: colors.textSecondary, textAlign: isMobile ? 'center' : 'left' }}>
          {indexOfFirstCustomer + 1} - {Math.min(indexOfLastCustomer, filteredCustomers.length)} / {filteredCustomers.length} müşteri
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: isMobile ? '4px 10px' : '6px 12px',
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              color: currentPage === 1 ? colors.textSecondary : colors.text,
              fontSize: isMobile ? 12 : 13,
              cursor: currentPage === 1 ? 'default' : 'pointer'
            }}
          >
            ← Önceki
          </button>
          
          {!isMobile ? (
            // Masaüstünde tüm sayfalar
            [...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  padding: isMobile ? '4px 10px' : '6px 12px',
                  background: currentPage === i + 1 ? colors.bg : 'none',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  color: currentPage === i + 1 ? colors.text : colors.textSecondary,
                  fontSize: isMobile ? 12 : 13,
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))
          ) : (
            // Mobilde sadece mevcut sayfa
            <span style={{
              padding: isMobile ? '4px 10px' : '6px 12px',
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              color: colors.text,
              fontSize: isMobile ? 12 : 13
            }}>
              {currentPage} / {totalPages}
            </span>
          )}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: isMobile ? '4px 10px' : '6px 12px',
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              color: currentPage === totalPages ? colors.textSecondary : colors.text,
              fontSize: isMobile ? 12 : 13,
              cursor: currentPage === totalPages ? 'default' : 'pointer'
            }}
          >
            Sonraki →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;