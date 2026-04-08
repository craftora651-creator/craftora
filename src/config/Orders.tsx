import { useState, useEffect } from 'react';
import { useMyOrders, useOrderDownloads } from '../server/FastAPI/order.hooks';
import { OrderStatus } from '../types/order.types';

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
const OrderDetailModal = ({ order, onClose, colors, downloads }: { 
  order: any; 
  onClose: () => void; 
  colors: any;
  downloads?: any;
}) => {
  if (!order) return null;
  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'COMPLETED':
      case 'DELIVERED':
        return { text: 'Teslim Edildi', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✅' };
      case 'PENDING':
        return { text: 'Beklemede', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '⏳' };
      case 'PROCESSING':
        return { text: 'İşleniyor', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', icon: '⚙️' };
      case 'CANCELLED':
        return { text: 'İptal', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '❌' };
      default:
        return { text: status, color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: '•' };
    }
  };

  const status = getStatusInfo(order.status || order.orderStatus);

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

        <div style={{ padding: 24 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <div>
              <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Sipariş No</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>{order.order_number || order.orderNumber}</div>
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
                backgroundImage: `url(${order.customer?.avatar || `https://ui-avatars.com/api/?name=${order.customer?.name || order.customer_name || 'User'}&background=0ea5e9&color=fff&size=40`})`,
                backgroundSize: 'cover'
              }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{order.customer?.name || order.customer_name}</div>
                <div style={{ fontSize: 13, color: colors.textSecondary }}>{order.customer?.email || order.customer_email}</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 12 }}>
              Ürünler
            </div>
            {(order.items || order.products)?.map((p: any, i: number) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: i < (order.items || order.products).length - 1 ? `1px solid ${colors.border}` : 'none'
              }}>
                <div>
                  <div style={{ fontSize: 14, color: colors.text }}>{p.product_name || p.name}</div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>Adet: {p.quantity}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                  ${((p.unit_price || p.price) * p.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

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
              ${(order.total_amount || order.totalAmount || 0).toLocaleString()}
            </span>
          </div>

          {downloads?.digital_delivered && downloads.downloads?.length > 0 && (
            <div style={{
              backgroundColor: '#0ea5e9',
              borderRadius: 16,
              padding: 16,
              marginBottom: 20
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 12 }}>
                📥 Dijital Ürünleriniz
              </div>
              {downloads.downloads.map((dl: any, idx: number) => (
                <div key={idx} style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: idx < downloads.downloads.length - 1 ? 8 : 0
                }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'white', marginBottom: 4 }}>
                    {dl.product_name}
                  </div>
                  <div style={{ fontSize: 12, color: 'white', opacity: 0.9, marginBottom: 8 }}>
                    Kalan indirme hakkı: {dl.downloads_remaining}/{dl.download_limit}
                    {dl.access_expires && ` • Son kullanım: ${new Date(dl.access_expires).toLocaleDateString()}`}
                  </div>
                  <a 
                    href={dl.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      backgroundColor: 'white',
                      color: '#0ea5e9',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      textDecoration: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    📥 İndir
                  </a>
                </div>
              ))}
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
  const [useMock, setUseMock] = useState(true); // ✅ true = mock kullan, false = backend kullan
  
  const ordersPerPage = 8;

  // ✅ MOCK SİPARİŞLER (TEST İÇİN)
  const mockOrders = [
    {
      id: "mock-1",
      order_id: "mock-1",
      order_number: "CRA-2024-001",
      customer_name: "Ahmet Yılmaz",
      customer_email: "ahmet@example.com",
      customer_phone: "+90 555 123 4567",
      customer: {
        name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        phone: "+90 555 123 4567",
        avatar: "https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=0ea5e9&color=fff&size=40"
      },
      items: [
        { product_name: "Premium UI Kit", quantity: 1, unit_price: 89, price: 89 },
        { product_name: "Tailwind Pro Components", quantity: 2, unit_price: 49, price: 49 }
      ],
      products: [
        { name: "Premium UI Kit", quantity: 1, price: 89 },
        { name: "Tailwind Pro Components", quantity: 2, price: 49 }
      ],
      total_amount: 187,
      totalAmount: 187,
      status: "COMPLETED",
      orderStatus: "COMPLETED",
      created_at: "2024-03-28T10:30:00",
      orderDate: "2024-03-28T10:30:00",
      digital_delivered: true,
      digital_delivered_at: "2024-03-28T10:30:00",
      order_type: "digital",
      shop_id: "shop-1"
    },
    {
      id: "mock-2",
      order_id: "mock-2",
      order_number: "CRA-2024-002",
      customer_name: "Ayşe Demir",
      customer_email: "ayse@example.com",
      customer_phone: "+90 555 987 6543",
      customer: {
        name: "Ayşe Demir",
        email: "ayse@example.com",
        phone: "+90 555 987 6543",
        avatar: "https://ui-avatars.com/api/?name=Ayse+Demir&background=0ea5e9&color=fff&size=40"
      },
      items: [
        { product_name: "E-book: React Mastery", quantity: 1, unit_price: 39, price: 39 },
        { product_name: "Video Course: Next.js 14", quantity: 1, unit_price: 129, price: 129 }
      ],
      products: [
        { name: "E-book: React Mastery", quantity: 1, price: 39 },
        { name: "Video Course: Next.js 14", quantity: 1, price: 129 }
      ],
      total_amount: 168,
      totalAmount: 168,
      status: "PENDING",
      orderStatus: "PENDING",
      created_at: "2024-03-29T15:20:00",
      orderDate: "2024-03-29T15:20:00",
      digital_delivered: false,
      digital_delivered_at: null,
      order_type: "digital",
      shop_id: "shop-2"
    }
  ];

  const mockDownloads = {
    digital_delivered: true,
    downloads: [
      {
        product_id: "prod-1",
        product_name: "Premium UI Kit",
        file_url: "https://example.com/download/premium-ui-kit.zip",
        file_name: "premium-ui-kit.zip",
        downloads_used: 1,
        downloads_remaining: 4,
        download_limit: 5,
        access_expires: "2025-03-28T10:30:00"
      }
    ]
  };

  // ✅ BACKEND HOOKLARI (useMock false olunca aktif)
  const { 
    data: backendOrders = [], 
    isLoading: backendLoading, 
    isError: backendError, 
    error: backendErrorObj,
    refetch: backendRefetch 
  } = useMyOrders(
    filterStatus !== 'all' ? { status: filterStatus as OrderStatus } : {},
    { enabled: !useMock } // ✅ mock kullanıyorsa backend'i çağırma
  );
  
  const { data: backendDownloads } = useOrderDownloads(
    selectedOrder?.id || selectedOrder?.order_id || '',
    { enabled: !!selectedOrder && showDetailModal && !useMock }
  );

  // ✅ MOCK veya BACKEND verisini seç
  const orders = useMock ? mockOrders : backendOrders;
  const isLoading = useMock ? false : backendLoading;
  const isError = useMock ? false : backendError;
  const error = useMock ? null : backendErrorObj;
  const refetch = useMock ? () => {} : backendRefetch;
  
  // ✅ Downloads seçimi
  const getMockDownloads = (orderId: string) => {
    if (orderId === "mock-1") {
      return mockDownloads;
    }
    return null;
  };
  
  const downloads = useMock 
    ? getMockDownloads(selectedOrder?.id || selectedOrder?.order_id || '')
    : backendDownloads;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  // Metric hesaplamaları
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'DELIVERED').length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  // Filtreleme
  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (order.order_number || '').toLowerCase().includes(term) ||
        (order.customer?.name || order.customer_name || '').toLowerCase().includes(term) ||
        (order.customer?.email || order.customer_email || '').toLowerCase().includes(term)
      );
    }
    return true;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
      setSelectedOrders(currentOrders.map(o => o.id || o.order_id));
    }
  };

  const openDetailModal = (order: any) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED':
      case 'DELIVERED':
        return { text: 'Teslim Edildi', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✅' };
      case 'PENDING':
        return { text: 'Beklemede', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '⏳' };
      case 'PROCESSING':
        return { text: 'İşleniyor', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', icon: '⚙️' };
      case 'CANCELLED':
        return { text: 'İptal', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '❌' };
      default:
        return { text: status, color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: '•' };
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <div style={{ color: colors.text }}>Siparişler yükleniyor...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <div style={{ color: '#ef4444' }}>
          Siparişler yüklenirken bir hata oluştu: {error?.message}
          <button onClick={() => refetch()} style={{ marginLeft: 12, padding: '4px 12px' }}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Scrollbar styles */}
      <style>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${colors.bg}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 10px; border: 2px solid ${colors.bg}; }
        ::-webkit-scrollbar-thumb:hover { background: #0284c7; }
        * { scrollbar-width: thin; scrollbar-color: #0ea5e9 ${colors.bg}; }
      `}</style>
      
      {/* TEST MODU İÇİN BİR BUTON (isteğe bağlı) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          onClick={() => setUseMock(!useMock)}
          style={{
            padding: '6px 12px',
            backgroundColor: useMock ? '#f59e0b' : '#10b981',
            border: 'none',
            borderRadius: 20,
            color: 'white',
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          {useMock ? '📦 Test Verisi Kullanılıyor' : '🔌 Backend\'e Bağlan'}
        </button>
      </div>
      
      {/* 4'lü Metric Kartlar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
        gap: isMobile ? 12 : 20,
        marginBottom: 32
      }}>
        <div style={{ backgroundColor: colors.surface, borderRadius: 20, padding: isMobile ? 16 : 24, border: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 12 : 16 }}>
            <div style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, backgroundColor: 'rgba(14, 165, 233, 0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: isMobile ? 20 : 24 }}>shopping_bag</span>
            </div>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>TOPLAM SİPARİŞ</div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>{totalOrders}</div>
        </div>

        <div style={{ backgroundColor: colors.surface, borderRadius: 20, padding: isMobile ? 16 : 24, border: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 12 : 16 }}>
            <div style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons-round" style={{ color: '#10b981', fontSize: isMobile ? 20 : 24 }}>check_circle</span>
            </div>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>TESLİM EDİLEN</div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>{completedOrders}</div>
        </div>

        <div style={{ backgroundColor: colors.surface, borderRadius: 20, padding: isMobile ? 16 : 24, border: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 12 : 16 }}>
            <div style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons-round" style={{ color: '#f59e0b', fontSize: isMobile ? 20 : 24 }}>pending</span>
            </div>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>BEKLEYEN</div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>{pendingOrders}</div>
        </div>

        <div style={{ backgroundColor: colors.surface, borderRadius: 20, padding: isMobile ? 16 : 24, border: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 12 : 16 }}>
            <div style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons-round" style={{ color: '#8b5cf6', fontSize: isMobile ? 20 : 24 }}>attach_money</span>
            </div>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>TOPLAM GELİR</div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>${totalRevenue.toLocaleString()}</div>
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
        <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div style={{ display: 'flex', gap: 8, backgroundColor: colors.surface, padding: 4, borderRadius: 30, border: `1px solid ${colors.border}`, width: 'fit-content' }}>
            <button onClick={() => setFilterStatus('all')} style={{ padding: isMobile ? '6px 16px' : '8px 24px', backgroundColor: filterStatus === 'all' ? '#0ea5e9' : 'transparent', border: 'none', borderRadius: 30, color: filterStatus === 'all' ? 'white' : colors.textSecondary, fontSize: isMobile ? 13 : 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Tümü</button>
            <button onClick={() => setFilterStatus('COMPLETED')} style={{ padding: isMobile ? '6px 16px' : '8px 24px', backgroundColor: filterStatus === 'COMPLETED' ? '#10b981' : 'transparent', border: 'none', borderRadius: 30, color: filterStatus === 'COMPLETED' ? 'white' : colors.textSecondary, fontSize: isMobile ? 13 : 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Teslim Edildi</button>
            <button onClick={() => setFilterStatus('PENDING')} style={{ padding: isMobile ? '6px 16px' : '8px 24px', backgroundColor: filterStatus === 'PENDING' ? '#f59e0b' : 'transparent', border: 'none', borderRadius: 30, color: filterStatus === 'PENDING' ? 'white' : colors.textSecondary, fontSize: isMobile ? 13 : 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Beklemede</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, width: isMobile ? '100%' : 'auto' }}>
          <div style={{ position: 'relative', width: isMobile ? '100%' : '280px' }}>
            <span className="material-icons-round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.textSecondary, fontSize: 18 }}>search</span>
            <input type="text" placeholder="Sipariş veya müşteri ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: isMobile ? '12px 16px 12px 40px' : '10px 16px 10px 40px', backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 30, color: colors.text, fontSize: isMobile ? 14 : 14, outline: 'none' }} />
          </div>
        </div>
      </div>

      {/* Toplu işlem başlığı */}
      {selectedOrders.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: 'rgba(14,165,233,0.1)', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-icons-round" style={{ color: '#0ea5e9' }}>check_circle</span>
            <span style={{ fontSize: 14, color: colors.text }}>{selectedOrders.length} sipariş seçildi</span>
          </div>
          <button onClick={() => alert('Toplu işlem yakında!')} style={{ padding: '6px 16px', backgroundColor: '#ef4444', border: 'none', borderRadius: 20, color: 'white', fontSize: 13, cursor: 'pointer' }}>Toplu İşlem</button>
        </div>
      )}

      {/* Sipariş Listesi */}
      {currentOrders.length === 0 ? (
        <div style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 48, textAlign: 'center', border: `1px solid ${colors.border}` }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📦</span>
          <div style={{ fontSize: 18, fontWeight: 500, color: colors.text, marginBottom: 8 }}>Henüz siparişiniz bulunmuyor</div>
          <div style={{ fontSize: 14, color: colors.textSecondary }}>Dijital ürünlerimizi keşfetmek için mağazayı ziyaret edin!</div>
        </div>
      ) : !isMobile ? (
        <div style={{ backgroundColor: colors.surface, borderRadius: 20, border: `1px solid ${colors.border}`, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '50px 140px 200px 1fr 100px 120px 100px 80px', padding: '16px 24px', backgroundColor: colors.bg, borderBottom: `1px solid ${colors.border}`, fontSize: 12, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', alignItems: 'center' }}>
            <div><input type="checkbox" onChange={toggleAll} style={{ cursor: 'pointer' }} /></div>
            <div>SİPARİŞ NO</div>
            <div>MÜŞTERİ</div>
            <div>ÜRÜNLER</div>
            <div>TARİH</div>
            <div>TUTAR</div>
            <div>DURUM</div>
            <div style={{ textAlign: 'center' }}>İŞLEM</div>
          </div>

          {currentOrders.map((order) => {
            const status = getStatusBadge(order.status);
            return (
              <div key={order.id || order.order_id} style={{ display: 'grid', gridTemplateColumns: '50px 140px 200px 1fr 100px 120px 100px 80px', padding: '16px 24px', borderBottom: `1px solid ${colors.border}`, backgroundColor: selectedOrders.includes(order.id || order.order_id) ? 'rgba(14,165,233,0.1)' : colors.surface, alignItems: 'center' }}>
                <div><input type="checkbox" checked={selectedOrders.includes(order.id || order.order_id)} onChange={() => toggleOrder(order.id || order.order_id)} style={{ cursor: 'pointer' }} /></div>
                <div style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{order.order_number}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 16, backgroundImage: `url(${order.customer?.avatar || `https://ui-avatars.com/api/?name=${order.customer?.name || order.customer_name || 'User'}&background=0ea5e9&color=fff&size=40`})`, backgroundSize: 'cover' }} />
                  <span style={{ fontSize: 13, color: colors.text }}>{order.customer?.name || order.customer_name}</span>
                </div>
                <div>{(order.items || order.products)?.map((p: any, i: number) => (<span key={i} style={{ fontSize: 12, color: colors.textSecondary }}>{p.quantity}x {(p.product_name || p.name)?.length > 20 ? (p.product_name || p.name).substring(0, 20) + '...' : (p.product_name || p.name)}{i < (order.items || order.products).length - 1 ? ', ' : ''}</span>))}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>{new Date(order.created_at || order.orderDate).toLocaleDateString()}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>${(order.total_amount || 0).toLocaleString()}</div>
                <div><span style={{ display: 'inline-block', padding: '4px 2px', backgroundColor: status.bg, color: status.color, fontSize: 11, fontWeight: 600, borderRadius: 30, whiteSpace: 'nowrap' }}>{status.icon} {status.text}</span></div>
                <div style={{ textAlign: 'center' }}><button onClick={() => openDetailModal(order)} style={{ background: 'none', border: `1px solid ${colors.border}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: colors.text, cursor: 'pointer' }}>Detay</button></div>
              </div>
            );
          })}
        </div>
      ) : (
        // MOBİL KARTLAR (aynı kalabilir)
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {currentOrders.map((order) => {
            const status = getStatusBadge(order.status);
            return (
              <div key={order.id || order.order_id} style={{ backgroundColor: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, padding: 16, borderColor: selectedOrders.includes(order.id || order.order_id) ? '#0ea5e9' : colors.border }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input type="checkbox" checked={selectedOrders.includes(order.id || order.order_id)} onChange={() => toggleOrder(order.id || order.order_id)} style={{ width: 20, height: 20 }} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{order.order_number}</span>
                  </div>
                  <span style={{ padding: '4px 8px', backgroundColor: status.bg, color: status.color, fontSize: 11, fontWeight: 600, borderRadius: 30 }}>{status.icon} {status.text}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, backgroundImage: `url(${order.customer?.avatar || `https://ui-avatars.com/api/?name=${order.customer?.name || order.customer_name || 'User'}&background=0ea5e9&color=fff&size=40`})`, backgroundSize: 'cover' }} />
                  <div><div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{order.customer?.name || order.customer_name}</div><div style={{ fontSize: 12, color: colors.textSecondary }}>{order.customer?.email || order.customer_email}</div></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12, padding: 12, backgroundColor: colors.bg, borderRadius: 12 }}>
                  <div><div style={{ fontSize: 11, color: colors.textSecondary }}>Tarih</div><div style={{ fontSize: 13, color: colors.text }}>{new Date(order.created_at || order.orderDate).toLocaleDateString()}</div></div>
                  <div><div style={{ fontSize: 11, color: colors.textSecondary }}>Toplam</div><div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>${(order.total_amount || 0).toLocaleString()}</div></div>
                </div>
                <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Ürünler</div>{(order.items || order.products)?.map((p: any, i: number) => (<div key={i} style={{ fontSize: 12, color: colors.text, padding: '2px 0' }}>{p.quantity}x {p.product_name || p.name}</div>))}</div>
                <button onClick={() => openDetailModal(order)} style={{ width: '100%', padding: '10px', background: '#0ea5e9', border: 'none', borderRadius: 30, color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Detayları Gör</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? 16 : 0 }}>
          <div style={{ fontSize: isMobile ? 12 : 13, color: colors.textSecondary, textAlign: isMobile ? 'center' : 'left' }}>{indexOfFirstOrder + 1} - {Math.min(indexOfLastOrder, filteredOrders.length)} / {filteredOrders.length} sipariş</div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: isMobile ? '4px 8px' : '6px 12px', background: 'none', border: `1px solid ${colors.border}`, borderRadius: 6, color: currentPage === 1 ? colors.textSecondary : colors.text, fontSize: isMobile ? 12 : 13, cursor: currentPage === 1 ? 'default' : 'pointer' }}>Önceki</button>
            {!isMobile ? [...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} style={{ padding: '6px 12px', background: currentPage === i + 1 ? colors.bg : 'none', border: `1px solid ${colors.border}`, borderRadius: 6, color: currentPage === i + 1 ? colors.text : colors.textSecondary, fontSize: 13, cursor: 'pointer' }}>{i + 1}</button>)) : (<span style={{ padding: '6px 12px', background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.text, fontSize: 12 }}>{currentPage} / {totalPages}</span>)}
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: isMobile ? '4px 8px' : '6px 12px', background: 'none', border: `1px solid ${colors.border}`, borderRadius: 6, color: currentPage === totalPages ? colors.textSecondary : colors.text, fontSize: isMobile ? 12 : 13, cursor: currentPage === totalPages ? 'default' : 'pointer' }}>Sonraki</button>
          </div>
        </div>
      )}

      {/* Detay Modalı */}
      {showDetailModal && (
        <OrderDetailModal
          order={selectedOrder}
          downloads={downloads}
          onClose={() => { setShowDetailModal(false); setSelectedOrder(null); }}
          colors={colors}
        />
      )}
    </div>
  );
};

export default OrdersPage;