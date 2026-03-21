import { useState, useEffect } from 'react';

interface OrdersPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

// Detay modalı
const OrderDetailModal = ({ order, onClose, colors }: { order: any; onClose: () => void; colors: any }) => {
  if (!order) return null;

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'DELIVERED': return { text: 'Teslim Edildi', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✅' };
      case 'SHIPPED': return { text: 'Kargoda', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', icon: '🚚' };
      case 'PROCESSING': return { text: 'Hazırlanıyor', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '⚙️' };
      case 'PENDING': return { text: 'Beklemede', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: '⏳' };
      case 'CANCELLED': return { text: 'İptal', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '❌' };
      default: return { text: status, color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: '•' };
    }
  };

  const status = getStatusInfo(order.orderStatus);

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
          padding: '20px 24px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: colors.text }}>
            Sipariş Detayı
          </h3>
          <button onClick={onClose} style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            border: `1px solid ${colors.border}`,
            background: colors.bg,
            color: colors.text,
            cursor: 'pointer',
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            ✕
          </button>
        </div>

        {/* İçerik */}
        <div style={{ padding: 24 }}>
          {/* Sipariş No ve Durum */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <div>
              <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Sipariş No</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>{order.orderNumber}</div>
            </div>
            <span style={{
              padding: '6px 12px',
              backgroundColor: status.bg,
              color: status.color,
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 30
            }}>
              {status.icon} {status.text}
            </span>
          </div>

          {/* Müşteri Bilgileri */}
          <div style={{
            backgroundColor: colors.bg,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundImage: `url(${order.customer.avatar})`,
                backgroundSize: 'cover'
              }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{order.customer.name}</div>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>{order.customer.email}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>
              📞 {order.customer.phone}
            </div>
          </div>

          {/* Ürünler */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 12 }}>
              Ürünler
            </div>
            {order.products.map((p: any, i: number) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: i < order.products.length - 1 ? `1px solid ${colors.border}` : 'none'
              }}>
                <div>
                  <div style={{ fontSize: 14, color: colors.text }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>Adet: {p.quantity}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                  ${(p.price * p.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Toplam */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderTop: `2px solid ${colors.border}`,
            marginBottom: 20
          }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>Toplam</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>
              ${order.totalAmount.toLocaleString()}
            </span>
          </div>

          {/* Tedarikçi Bilgisi (fiziksel ürünler için) */}
          {order.supplier && (
            <div style={{
              backgroundColor: colors.bg,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 12 }}>
                🔌 Tedarikçi Bilgileri
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{order.supplier === 'autods' ? '🚀' : '⚡'}</span>
                <span style={{ fontSize: 14, color: colors.text }}>
                  {order.supplier === 'autods' ? 'AutoDS' : 'CJ Dropshipping'}
                </span>
              </div>
              {order.supplierProductId && (
                <div style={{ fontSize: 12, color: colors.textSecondary }}>
                  Tedarikçi Ürün ID: {order.supplierProductId}
                </div>
              )}
            </div>
          )}

          {/* Kargo Bilgileri */}
          {order.shippingAddress && (
            <div style={{
              backgroundColor: colors.bg,
              borderRadius: 16,
              padding: 16
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 12 }}>
                📦 Teslimat Bilgileri
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>
                {order.shippingAddress}
              </div>
              {order.trackingNumber && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  border: `1px solid ${colors.border}`
                }}>
                  <span style={{ fontSize: 16 }}>🔍</span>
                  <div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>Kargo Takip No</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{order.trackingNumber}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrdersPage = ({ colors }: OrdersPageProps) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const ordersPerPage = 8;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  // Sipariş verileri - tedarikçi bilgileri eklendi
  const allOrders = [
    {
      id: 'ORD-001',
      orderNumber: 'ORD-2024-001',
      customer: {
        name: 'Jenny Wilson',
        email: 'jenny.w@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Jenny+Wilson&background=0ea5e9&color=fff&size=40',
        phone: '+1 (212) 555-1234'
      },
      products: [
        { name: 'Nike Air Max 270', quantity: 2, price: 129.99 },
        { name: 'Ultimate UI Kit', quantity: 1, price: 49.00 }
      ],
      totalAmount: 308.98,
      orderDate: '2024-03-15T10:30:00',
      orderStatus: 'DELIVERED',
      supplier: 'autods',
      supplierProductId: 'AUTO-12345',
      shippingAddress: '123 Main St, New York, NY 10001',
      trackingNumber: 'TRK-123456789'
    },
    {
      id: 'ORD-002',
      orderNumber: 'ORD-2024-002',
      customer: {
        name: 'Robert Fox',
        email: 'robert.f@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Robert+Fox&background=0ea5e9&color=fff&size=40',
        phone: '+44 20 7946 0138'
      },
      products: [
        { name: 'SEO Mastery E-book', quantity: 1, price: 39.00 },
        { name: 'Quantum Processor V4', quantity: 1, price: 12499.00 }
      ],
      totalAmount: 12538.00,
      orderDate: '2024-03-14T15:45:00',
      orderStatus: 'PROCESSING',
      supplier: 'cj',
      supplierProductId: 'CJ-67890',
      shippingAddress: '456 High St, London, UK',
      trackingNumber: null
    },
    {
      id: 'ORD-003',
      orderNumber: 'ORD-2024-003',
      customer: {
        name: 'Jacob Jones',
        email: 'jacob.j@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Jacob+Jones&background=0ea5e9&color=fff&size=40',
        phone: '+49 30 1234 5678'
      },
      products: [
        { name: 'Lightroom Presets', quantity: 3, price: 25.00 }
      ],
      totalAmount: 75.00,
      orderDate: '2024-03-14T09:15:00',
      orderStatus: 'PENDING',
      supplier: null,
      shippingAddress: null,
      trackingNumber: null
    },
    {
      id: 'ORD-004',
      orderNumber: 'ORD-2024-004',
      customer: {
        name: 'Courtney Henry',
        email: 'courtney.h@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Courtney+Henry&background=0ea5e9&color=fff&size=40',
        phone: '+33 1 2345 6789'
      },
      products: [
        { name: 'Plasma Thruster Mk. II', quantity: 1, price: 82400.00 },
        { name: 'Neural Interface Lens', quantity: 2, price: 2150.00 }
      ],
      totalAmount: 86700.00,
      orderDate: '2024-03-13T14:20:00',
      orderStatus: 'SHIPPED',
      supplier: 'autods',
      supplierProductId: 'AUTO-98765',
      shippingAddress: '321 Rue de Rivoli, Paris, France',
      trackingNumber: 'FEDEX-987654321'
    }
  ];

  // Metric hesaplamaları
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.orderStatus === 'PENDING').length;
  const processingOrders = allOrders.filter(o => o.orderStatus === 'PROCESSING').length;
  const shippedOrders = allOrders.filter(o => o.orderStatus === 'SHIPPED').length;
  const deliveredOrders = allOrders.filter(o => o.orderStatus === 'DELIVERED').length;
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Filtreleme
  const filteredOrders = allOrders.filter(order => {
    if (filterStatus !== 'all' && order.orderStatus !== filterStatus) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.email.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Sayfalama
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Checkbox işlemleri
  const toggleOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAll = () => {
    if (selectedOrders.length === currentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map(o => o.id));
    }
  };

  // Detay modalını aç
  const openDetailModal = (order: any) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Durum badge'i
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'DELIVERED':
        return { text: 'Teslim Edildi', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✅' };
      case 'SHIPPED':
        return { text: 'Kargoda', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', icon: '🚚' };
      case 'PROCESSING':
        return { text: 'Hazırlanıyor', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '⚙️' };
      case 'PENDING':
        return { text: 'Beklemede', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: '⏳' };
      case 'CANCELLED':
        return { text: 'İptal', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '❌' };
      default:
        return { text: status, color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: '•' };
    }
  };

  return (
    <div style={{ 
      minHeight: '100%',
    }}>

      <style>{`
        /* Chrome, Safari, Edge, Opera */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${colors.bg};
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #0ea5e9;
          border-radius: 10px;
          border: 2px solid ${colors.bg};
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #0284c7;
        }
        
        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #0ea5e9 ${colors.bg};
        }
      `}</style>
      
      {/* Header */}

      {/* 4'lü Metric Kartlar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
        gap: isMobile ? 12 : 20,
        marginBottom: 32
      }}>
        {/* Toplam Sipariş */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${colors.border}`
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
              <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: isMobile ? 20 : 24 }}>shopping_bag</span>
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
            TOPLAM SİPARİŞ
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>{totalOrders}</div>
        </div>

        {/* Bekleyen / Hazırlanan */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${colors.border}`
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
              <span className="material-icons-round" style={{ color: '#f59e0b', fontSize: isMobile ? 20 : 24 }}>pending</span>
            </div>
            <span style={{
              color: '#f59e0b',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              {pendingOrders + processingOrders}
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            BEKLEYEN / HAZIRLANAN
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>{pendingOrders + processingOrders}</div>
        </div>

        {/* Kargoda */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${colors.border}`
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
              <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: isMobile ? 20 : 24 }}>local_shipping</span>
            </div>
            <span style={{
              color: '#0ea5e9',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              {shippedOrders}
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            KARGODA
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>{shippedOrders}</div>
        </div>

        {/* Teslim Edilen */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${colors.border}`
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
              <span className="material-icons-round" style={{ color: '#10b981', fontSize: isMobile ? 20 : 24 }}>check_circle</span>
            </div>
            <span style={{
              color: '#10b981',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              {deliveredOrders}
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            TESLİM EDİLEN
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>{deliveredOrders}</div>
        </div>
      </div>

      {/* Filtreler */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        marginBottom: 24,
        gap: 16
      }}>
        {/* Status Filtreleri */}
        <div style={{
          overflowX: 'auto',
          paddingBottom: 8
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
                fontSize: isMobile ? 13 : 14,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              style={{
                padding: isMobile ? '6px 16px' : '8px 24px',
                backgroundColor: filterStatus === 'PENDING' ? '#6b7280' : 'transparent',
                border: 'none',
                borderRadius: 30,
                color: filterStatus === 'PENDING' ? 'white' : colors.textSecondary,
                fontSize: isMobile ? 13 : 14,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Beklemede
            </button>
            <button
              onClick={() => setFilterStatus('PROCESSING')}
              style={{
                padding: isMobile ? '6px 16px' : '8px 24px',
                backgroundColor: filterStatus === 'PROCESSING' ? '#f59e0b' : 'transparent',
                border: 'none',
                borderRadius: 30,
                color: filterStatus === 'PROCESSING' ? 'white' : colors.textSecondary,
                fontSize: isMobile ? 13 : 14,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Hazırlanıyor
            </button>
            <button
              onClick={() => setFilterStatus('SHIPPED')}
              style={{
                padding: isMobile ? '6px 16px' : '8px 24px',
                backgroundColor: filterStatus === 'SHIPPED' ? '#0ea5e9' : 'transparent',
                border: 'none',
                borderRadius: 30,
                color: filterStatus === 'SHIPPED' ? 'white' : colors.textSecondary,
                fontSize: isMobile ? 13 : 14,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Kargoda
            </button>
            <button
              onClick={() => setFilterStatus('DELIVERED')}
              style={{
                padding: isMobile ? '6px 16px' : '8px 24px',
                backgroundColor: filterStatus === 'DELIVERED' ? '#10b981' : 'transparent',
                border: 'none',
                borderRadius: 30,
                color: filterStatus === 'DELIVERED' ? 'white' : colors.textSecondary,
                fontSize: isMobile ? 13 : 14,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Teslim Edildi
            </button>
          </div>
        </div>

        {/* Arama */}
        <div style={{ 
          display: 'flex', 
          gap: 12,
          width: isMobile ? '100%' : 'auto'
        }}>
          <div style={{ position: 'relative', width: isMobile ? '100%' : '280px' }}>
            <span className="material-icons-round" style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.textSecondary,
              fontSize: 18,
              zIndex: 1
            }}>search</span>
            <input
              type="text"
              placeholder="Sipariş veya müşteri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: isMobile ? '12px 16px 12px 40px' : '10px 16px 10px 40px',
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 30,
                color: colors.text,
                fontSize: isMobile ? 14 : 14,
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Toplu işlem başlığı */}
      {selectedOrders.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          backgroundColor: 'rgba(14,165,233,0.1)',
          borderRadius: 12,
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-icons-round" style={{ color: '#0ea5e9' }}>check_circle</span>
            <span style={{ fontSize: 14, color: colors.text }}>
              {selectedOrders.length} sipariş seçildi
            </span>
          </div>
          <button
            onClick={() => alert('Toplu işlem yakında!')}
            style={{
              padding: '6px 16px',
              backgroundColor: '#ef4444',
              border: 'none',
              borderRadius: 20,
              color: 'white',
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            Toplu İşlem
          </button>
        </div>
      )}

      {/* Sipariş Listesi */}
      {!isMobile ? (
        /* MASAÜSTÜ - Tablo */
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          marginBottom: 24
        }}>
          {/* Tablo Başlığı */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '50px 120px 180px 1fr 100px 120px 80px 80px',
            padding: '16px 24px',
            backgroundColor: colors.bg,
            borderBottom: `1px solid ${colors.border}`,
            fontSize: 12,
            fontWeight: 600,
            color: colors.textSecondary,
            textTransform: 'uppercase',
            alignItems: 'center'
          }}>
            <div>
              <input type="checkbox" onChange={toggleAll} style={{ cursor: 'pointer' }} />
            </div>
            <div>SİPARİŞ NO</div>
            <div>MÜŞTERİ</div>
            <div>ÜRÜNLER</div>
            <div>TARİH</div>
            <div>TUTAR</div>
            <div>DURUM</div>
            <div style={{ textAlign: 'center' }}>İŞLEM</div>
          </div>

          {/* Tablo Satırları */}
          {currentOrders.map((order) => {
            const status = getStatusBadge(order.orderStatus);
            return (
              <div
                key={order.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 120px 180px 1fr 100px 120px 80px 80px',
                  padding: '16px 24px',
                  borderBottom: `1px solid ${colors.border}`,
                  backgroundColor: selectedOrders.includes(order.id) ? 'rgba(14,165,233,0.1)' : colors.surface,
                  alignItems: 'center'
                }}
              >
                {/* Checkbox */}
                <div>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrder(order.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                {/* Sipariş No */}
                <div style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{order.orderNumber}</div>

                {/* Müşteri */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundImage: `url(${order.customer.avatar})`,
                    backgroundSize: 'cover'
                  }} />
                  <span style={{ fontSize: 13, color: colors.text }}>{order.customer.name}</span>
                </div>

                {/* Ürünler */}
                <div>
                  {order.products.map((p, i) => (
                    <span key={i} style={{ fontSize: 12, color: colors.textSecondary }}>
                      {p.quantity}x {p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name}
                      {i < order.products.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>

                {/* Tarih */}
                <div style={{ fontSize: 12, color: colors.textSecondary }}>
                  {new Date(order.orderDate).toLocaleDateString()}
                </div>

                {/* Tutar */}
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                  ${order.totalAmount.toLocaleString()}
                </div>

                {/* Durum */}
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 2px',
                    backgroundColor: status.bg,
                    color: status.color,
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 30,
                    whiteSpace: 'nowrap'
                  }}>
                    {status.icon} {status.text}
                  </span>
                </div>

                {/* Detay Butonu */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => openDetailModal(order)}
                    style={{
                      background: 'none',
                      border: `1px solid ${colors.border}`,
                      borderRadius: 20,
                      padding: '4px 12px',
                      fontSize: 12,
                      color: colors.text,
                      cursor: 'pointer'
                    }}
                  >
                    Detay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MOBİL - Kartlar */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBottom: 24
        }}>
          {currentOrders.map((order) => {
            const status = getStatusBadge(order.orderStatus);
            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  border: `1px solid ${colors.border}`,
                  padding: 16,
                  borderColor: selectedOrders.includes(order.id) ? '#0ea5e9' : colors.border
                }}
              >
                {/* Checkbox ve Sipariş No */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrder(order.id)}
                      style={{ width: 20, height: 20 }}
                    />
                    <span style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>
                      {order.orderNumber}
                    </span>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: status.bg,
                    color: status.color,
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 30
                  }}>
                    {status.icon} {status.text}
                  </span>
                </div>

                {/* Müşteri */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundImage: `url(${order.customer.avatar})`,
                    backgroundSize: 'cover'
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>
                      {order.customer.name}
                    </div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>
                      {order.customer.email}
                    </div>
                  </div>
                </div>

                {/* Detay Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  marginBottom: 12,
                  padding: 12,
                  backgroundColor: colors.bg,
                  borderRadius: 12
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: colors.textSecondary }}>Tarih</div>
                    <div style={{ fontSize: 13, color: colors.text }}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: colors.textSecondary }}>Toplam</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>
                      ${order.totalAmount.toLocaleString()}
                    </div>
                  </div>
                  {order.supplier && (
                    <div>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>Tedarikçi</div>
                      <div style={{ fontSize: 13, color: colors.text, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {order.supplier === 'autods' ? '🚀 AutoDS' : '⚡ CJ'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ürünler */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>
                    Ürünler
                  </div>
                  {order.products.map((p, i) => (
                    <div key={i} style={{
                      fontSize: 12,
                      color: colors.text,
                      padding: '2px 0'
                    }}>
                      {p.quantity}x {p.name}
                    </div>
                  ))}
                </div>

                {/* Detay Butonu */}
                <button
                  onClick={() => openDetailModal(order)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#0ea5e9',
                    border: 'none',
                    borderRadius: 30,
                    color: 'white',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Detayları Gör
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Sayfalama */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? 16 : 0
      }}>
        <div style={{ 
          fontSize: isMobile ? 12 : 13, 
          color: colors.textSecondary, 
          textAlign: isMobile ? 'center' : 'left' 
        }}>
          {indexOfFirstOrder + 1} - {Math.min(indexOfLastOrder, filteredOrders.length)} / {filteredOrders.length} sipariş
        </div>

        <div style={{ 
          display: 'flex', 
          gap: 4,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: isMobile ? '4px 8px' : '6px 12px',
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              color: currentPage === 1 ? colors.textSecondary : colors.text,
              fontSize: isMobile ? 12 : 13,
              cursor: currentPage === 1 ? 'default' : 'pointer'
            }}
          >
            Önceki
          </button>

          {!isMobile ? (
            [...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  padding: '6px 12px',
                  background: currentPage === i + 1 ? colors.bg : 'none',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  color: currentPage === i + 1 ? colors.text : colors.textSecondary,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))
          ) : (
            <span style={{
              padding: '6px 12px',
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              color: colors.text,
              fontSize: 12
            }}>
              {currentPage} / {totalPages}
            </span>
          )}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: isMobile ? '4px 8px' : '6px 12px',
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              color: currentPage === totalPages ? colors.textSecondary : colors.text,
              fontSize: isMobile ? 12 : 13,
              cursor: currentPage === totalPages ? 'default' : 'pointer'
            }}
          >
            Sonraki
          </button>
        </div>
      </div>

      {/* Detay Modalı */}
      {showDetailModal && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowDetailModal(false)}
          colors={colors}
        />
      )}
    </div>
  );
};

export default OrdersPage;