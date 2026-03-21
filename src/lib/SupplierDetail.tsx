import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface SupplierDetailProps {
    colors: {
        bg: string;
        surface: string;
        border: string;
        text: string;
        textSecondary: string;
    };
}

const SupplierDetail = ({ colors }: SupplierDetailProps) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

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
        connectedAt: '12 Mart 2024',
        stats: {
            totalOrders: 1247,
            monthlyOrders: 124,
            successRate: 98.5,
            avgDeliveryTime: '4.2 gün',
            totalRevenue: 45230,
            activeProducts: 156,
            cancelledOrders: 18
        },
        recentOrders: [
            { id: '#ORD-12345', customer: 'Jenny Wilson', date: '12.03.2024', total: '$129', status: 'delivered', products: 'Nike Air Max' },
            { id: '#ORD-12344', customer: 'Robert Fox', date: '11.03.2024', total: '$89', status: 'shipped', products: 'Basic T-shirt x2' },
            { id: '#ORD-12343', customer: 'Jacob Jones', date: '10.03.2024', total: '$249', status: 'processing', products: 'Ultimate UI Kit' },
            { id: '#ORD-12342', customer: 'Courtney Henry', date: '09.03.2024', total: '$599', status: 'delivered', products: 'Plasma Thruster' },
        ],
        products: [
            { id: 'P001', name: 'Nike Air Max', price: '$129', stock: 45, sales: 234, image: '👟' },
            { id: 'P002', name: 'Basic T-shirt', price: '$39', stock: 128, sales: 567, image: '👕' },
            { id: 'P003', name: 'Ultimate UI Kit', price: '$49', stock: 999, sales: 1234, image: '🎨' },
            { id: 'P004', name: 'Plasma Thruster', price: '$599', stock: 12, sales: 67, image: '🚀' },
        ]
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#10b981';
            case 'inactive': return '#6b7280';
            case 'pending': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getOrderStatusBadge = (status: string) => {
        switch (status) {
            case 'delivered':
                return { text: 'Teslim Edildi', color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
            case 'shipped':
                return { text: 'Kargoda', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
            case 'processing':
                return { text: 'Hazırlanıyor', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' };
            case 'cancelled':
                return { text: 'İptal', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
            default:
                return { text: 'Beklemede', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' };
        }
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
                    onClick={() => navigate('/admin/suppliers')}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                    <div style={{
                        width: 52,
                        height: 52,
                        backgroundColor: colors.bg,
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28
                    }}>
                        {supplier.logo}
                    </div>
                    <div>
                        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 600, color: colors.text, margin: 0 }}>
                            {supplier.name}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: getStatusColor(supplier.status)
                                }} />
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>
                                    {supplier.status === 'active' ? 'Aktif' : 'Pasif'}
                                </span>
                            </div>
                            <span style={{ fontSize: 13, color: colors.textSecondary }}>•</span>
                            <span style={{ fontSize: 13, color: colors.textSecondary }}>Bağlantı: {supplier.connectedAt}</span>
                        </div>
                    </div>
                </div>

                {/* Sağdaki Ayarlar Butonu */}
                <button
                    onClick={() => navigate(`/admin/suppliers/${id}/settings`)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: colors.surface,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 30,
                        color: colors.text,
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}
                >
                    <span>⚙️</span>
                    Tedarikçi Ayarları
                </button>
            </div>

            {/* Performans Kartları - 4'lü */}
            {/* Performans Kartları - Daha okunabilir versiyon */}
            {/* Performans Kartları - SuppliersPage'deki metric kartlarla birebir aynı */}
<div className="grid-4" style={{
  display: 'grid',
  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
  gap: isMobile ? 10 : 20,
  marginBottom: 32
}}>
  {/* Toplam Sipariş */}
  <div style={{
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: isMobile ? 16 : 24,
    border: `1px solid ${colors.border}`,
    boxShadow: colors.bg === '#0f172a' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
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
        ↑ %12
      </span>
    </div>
    <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
      TOPLAM SİPARİŞ
    </div>
    <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
      {supplier.stats.totalOrders.toLocaleString()}
    </div>
  </div>

  {/* Aktif Ürün */}
  <div style={{
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: isMobile ? 16 : 24,
    border: `1px solid ${colors.border}`,
    boxShadow: colors.bg === '#0f172a' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
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
        <span className="material-icons-round" style={{ color: '#10b981', fontSize: isMobile ? 20 : 24 }}>inventory</span>
      </div>
      <span style={{
        color: colors.textSecondary,
        fontSize: isMobile ? 11 : 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        padding: isMobile ? '2px 8px' : '4px 10px',
        borderRadius: 20
      }}>
        Toplam
      </span>
    </div>
    <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
      AKTİF ÜRÜN
    </div>
    <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
      {supplier.stats.activeProducts}
    </div>
  </div>

  {/* Başarı Oranı */}
  <div style={{
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: isMobile ? 16 : 24,
    border: `1px solid ${colors.border}`,
    boxShadow: colors.bg === '#0f172a' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
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
        <span className="material-icons-round" style={{ color: '#8b5cf6', fontSize: isMobile ? 20 : 24 }}>star</span>
      </div>
      <span style={{
        color: '#10b981',
        fontSize: isMobile ? 11 : 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: isMobile ? '2px 8px' : '4px 10px',
        borderRadius: 20
      }}>
        {supplier.stats.successRate}%
      </span>
    </div>
    <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
      BAŞARI ORANI
    </div>
    <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: '#10b981' }}>
      {supplier.stats.successRate}%
    </div>
  </div>

  {/* Toplam Ciro */}
  <div style={{
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: isMobile ? 16 : 24,
    border: `1px solid ${colors.border}`,
    boxShadow: colors.bg === '#0f172a' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
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
        <span className="material-icons-round" style={{ color: '#f59e0b', fontSize: isMobile ? 20 : 24 }}>attach_money</span>
      </div>
      <span style={{
        color: colors.textSecondary,
        fontSize: isMobile ? 11 : 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        padding: isMobile ? '2px 8px' : '4px 10px',
        borderRadius: 20
      }}>
        Ciro
      </span>
    </div>
    <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
      TOPLAM CİRO
    </div>
    <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
      ${supplier.stats.totalRevenue.toLocaleString()}
    </div>
  </div>
</div>

            {/* Tabs - Sadece 3 ana tab: Genel Bakış, Siparişler, Ürünler */}
            <div style={{
                display: 'flex',
                gap: 8,
                borderBottom: `1px solid ${colors.border}`,
                marginBottom: 24,
                overflowX: 'auto',
                paddingBottom: 2
            }}>
                {[
                    { id: 'overview', label: 'Genel Bakış', icon: '📊' },
                    { id: 'orders', label: 'Siparişler', icon: '📦' },
                    { id: 'products', label: 'Ürünler', icon: '🛒' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? `2px solid #0ea5e9` : '2px solid transparent',
                            color: activeTab === tab.id ? '#0ea5e9' : colors.textSecondary,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content - Genel Bakış */}
            {activeTab === 'overview' && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
                    gap: 24
                }}>
                    {/* Sol Kolon - Son Siparişler ve Aktivite */}
                    <div>
                        {/* Son Siparişler */}
                        <div style={{
                            backgroundColor: colors.surface,
                            borderRadius: 20,
                            padding: 24,
                            border: `1px solid ${colors.border}`,
                            marginBottom: 24
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 20
                            }}>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>
                                    📦 Son Siparişler
                                </h3>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#0ea5e9',
                                        fontSize: 13,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Tümünü Gör →
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {supplier.recentOrders.map(order => {
                                    const status = getOrderStatusBadge(order.status);
                                    return (
                                        <div
                                            key={order.id}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'auto 1fr auto',
                                                gap: 12,
                                                padding: 16,
                                                backgroundColor: colors.bg,
                                                borderRadius: 12,
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                                        >
                                            <span style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{order.id}</span>
                                            <div>
                                                <div style={{ fontSize: 14, color: colors.text }}>{order.customer}</div>
                                                <div style={{ fontSize: 12, color: colors.textSecondary }}>{order.products}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{order.total}</div>
                                                <span style={{
                                                    fontSize: 11,
                                                    padding: '2px 8px',
                                                    backgroundColor: status.bg,
                                                    color: status.color,
                                                    borderRadius: 20,
                                                    display: 'inline-block',
                                                    marginTop: 4
                                                }}>
                                                    {status.text}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Performans Grafiği */}
                        <div style={{
                            backgroundColor: colors.surface,
                            borderRadius: 20,
                            padding: 24,
                            border: `1px solid ${colors.border}`
                        }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>
                                📈 Sipariş Performansı (Son 30 Gün)
                            </h3>
                            <div style={{
                                height: 200,
                                backgroundColor: colors.bg,
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `1px dashed ${colors.border}`
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: 32, color: colors.textSecondary }}>📊</span>
                                    <p style={{ color: colors.textSecondary, marginTop: 8 }}>
                                        Grafik yakında eklenecek
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Kolon - İstatistikler ve Hızlı İşlemler */}
                    <div>
                        {/* Popüler Ürünler */}
                        <div style={{
                            backgroundColor: colors.surface,
                            borderRadius: 20,
                            padding: 24,
                            border: `1px solid ${colors.border}`,
                            marginBottom: 24
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>
                                    🔥 Popüler Ürünler
                                </h3>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#0ea5e9',
                                        fontSize: 13,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Tümünü Gör →
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {supplier.products.slice(0, 3).map(product => (
                                    <div
                                        key={product.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            padding: 12,
                                            backgroundColor: colors.bg,
                                            borderRadius: 12
                                        }}
                                    >
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: colors.surface,
                                            borderRadius: 10,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 20
                                        }}>
                                            {product.image}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{product.name}</div>
                                            <div style={{ fontSize: 12, color: colors.textSecondary }}>Stok: {product.stock}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{product.price}</div>
                                            <div style={{ fontSize: 12, color: '#10b981' }}>{product.sales} satış</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hızlı İşlemler (API yok!) */}
                        <div style={{
                            backgroundColor: colors.surface,
                            borderRadius: 20,
                            padding: 24,
                            border: `1px solid ${colors.border}`
                        }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>
                                ⚡ Hızlı İşlemler
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <button
                                    onClick={() => navigate(`/admin/products?supplier=${id}`)}
                                    style={{
                                        padding: '14px',
                                        backgroundColor: colors.bg,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: 12,
                                        color: colors.text,
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{ fontSize: 20 }}>📦</span>
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>Ürünleri Görüntüle</div>
                                        <div style={{ fontSize: 12, color: colors.textSecondary }}>{supplier.stats.activeProducts} aktif ürün</div>
                                    </div>
                                    <span>→</span>
                                </button>

                                <button
                                    onClick={() => navigate(`/admin/orders?supplier=${id}`)}
                                    style={{
                                        padding: '14px',
                                        backgroundColor: colors.bg,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: 12,
                                        color: colors.text,
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12
                                    }}
                                >
                                    <span style={{ fontSize: 20 }}>📋</span>
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>Tüm Siparişler</div>
                                        <div style={{ fontSize: 12, color: colors.textSecondary }}>{supplier.stats.monthlyOrders} sipariş bu ay</div>
                                    </div>
                                    <span>→</span>
                                </button>

                                <button
                                    onClick={() => window.open('https://autods.com/dashboard', '_blank')}
                                    style={{
                                        padding: '14px',
                                        backgroundColor: colors.bg,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: 12,
                                        color: colors.text,
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12
                                    }}
                                >
                                    <span style={{ fontSize: 20 }}>🌐</span>
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>AutoDS Paneline Git</div>
                                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Yeni sekmede açılır</div>
                                    </div>
                                    <span>↗️</span>
                                </button>

                                <button
                                    onClick={() => navigate(`/admin/suppliers/${id}/sync`)}
                                    style={{
                                        padding: '14px',
                                        backgroundColor: '#0ea5e9',
                                        border: 'none',
                                        borderRadius: 12,
                                        color: 'white',
                                        fontSize: 14,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12
                                    }}
                                >
                                    <span style={{ fontSize: 20 }}>🔄</span>
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <div style={{ fontWeight: 500 }}>Stok ve Fiyatları Senkronize Et</div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Son senkron: 5 dk önce</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Siparişler Tab */}
            {activeTab === 'orders' && (
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>
                        📦 Tüm Siparişler ({supplier.stats.totalOrders})
                    </h3>

                    {/* Filtreler */}
                    <div style={{
                        display: 'flex',
                        gap: 12,
                        marginBottom: 20,
                        flexWrap: 'wrap'
                    }}>
                        <select style={{
                            padding: '8px 16px',
                            backgroundColor: colors.bg,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 30,
                            color: colors.text,
                            fontSize: 13,
                            outline: 'none'
                        }}>
                            <option value="all">Tüm Durumlar</option>
                            <option value="processing">Hazırlanıyor</option>
                            <option value="shipped">Kargoda</option>
                            <option value="delivered">Teslim Edildi</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Sipariş ara..."
                            style={{
                                flex: 1,
                                padding: '8px 16px',
                                backgroundColor: colors.bg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 30,
                                color: colors.text,
                                fontSize: 13,
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Sipariş Listesi Tablosu */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ fontSize: 12, color: colors.textSecondary }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Sipariş No</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Müşteri</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Ürün</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Tarih</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Tutar</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supplier.recentOrders.map(order => {
                                    const status = getOrderStatusBadge(order.status);
                                    return (
                                        <tr key={order.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                            <td style={{ padding: '12px', color: colors.text }}>{order.id}</td>
                                            <td style={{ padding: '12px', color: colors.text }}>{order.customer}</td>
                                            <td style={{ padding: '12px', color: colors.textSecondary }}>{order.products}</td>
                                            <td style={{ padding: '12px', color: colors.textSecondary }}>{order.date}</td>
                                            <td style={{ padding: '12px', color: colors.text }}>{order.total}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    backgroundColor: status.bg,
                                                    color: status.color,
                                                    borderRadius: 20,
                                                    fontSize: 11
                                                }}>
                                                    {status.text}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Ürünler Tab */}
            {activeTab === 'products' && (
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>
                        🛒 Tedarikçi Ürünleri ({supplier.products.length})
                    </h3>

                    {/* Ürün Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
                        gap: 16
                    }}>
                        {supplier.products.map(product => (
                            <div
                                key={product.id}
                                style={{
                                    backgroundColor: colors.bg,
                                    borderRadius: 16,
                                    padding: 16,
                                    border: `1px solid ${colors.border}`
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <div style={{
                                        width: 48,
                                        height: 48,
                                        backgroundColor: colors.surface,
                                        borderRadius: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 24
                                    }}>
                                        {product.image}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 500, color: colors.text }}>{product.name}</div>
                                        <div style={{ fontSize: 12, color: colors.textSecondary }}>SKU: {product.id}</div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontSize: 13, color: colors.textSecondary }}>Stok</div>
                                        <div style={{ fontSize: 16, fontWeight: 600, color: product.stock > 10 ? '#10b981' : '#f59e0b' }}>
                                            {product.stock}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, color: colors.textSecondary }}>Fiyat</div>
                                        <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{product.price}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, color: colors.textSecondary }}>Satış</div>
                                        <div style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{product.sales}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierDetail;