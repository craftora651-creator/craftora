import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SuppliersPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

// Tedarikçi tipi
interface Supplier {
  id: string;
  name: string;
  logo: string;
  type: 'autods' | 'cj' | 'dsers' | 'spocket' | 'modalyst' | 'aliexpress' | 'custom';
  status: 'active' | 'inactive' | 'pending';
  connectedAt?: string;
  stats?: {
    totalOrders: number;
    monthlyOrders: number;
    successRate: number;
  };
}

const SuppliersPage = ({ colors }: SuppliersPageProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const navigate = useNavigate();

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

  // Örnek bağlı tedarikçiler
  const [connectedSuppliers, setConnectedSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'AutoDS',
      logo: '🚀',
      type: 'autods',
      status: 'active',
      connectedAt: '12 Mart 2024',
      stats: {
        totalOrders: 1247,
        monthlyOrders: 124,
        successRate: 98.5
      }
    },
    {
      id: '2',
      name: 'CJ Dropshipping',
      logo: '⚡',
      type: 'cj',
      status: 'active',
      connectedAt: '10 Mart 2024',
      stats: {
        totalOrders: 567,
        monthlyOrders: 67,
        successRate: 97.2
      }
    }
  ]);

  // Popüler tedarikçiler
  const popularSuppliers = [
    { id: 'autods', name: 'AutoDS', logo: '🚀', desc: 'En popüler dropshipping platformu', color: '#0ea5e9', badge: 'Önerilen' },
    { id: 'cj', name: 'CJ Dropshipping', logo: '⚡', desc: 'Hızlı kargo, ABD/EU deposu', color: '#f59e0b', badge: 'Hızlı Kargo' },
    { id: 'dsers', name: 'DSers', logo: '🛍️', desc: 'AliExpress resmi ortağı', color: '#a855f7', badge: 'Ücretsiz' },
    { id: 'spocket', name: 'Spocket', logo: '🌎', desc: 'ABD/Avrupa tedarikçileri', color: '#10b981', badge: 'Kaliteli' },
    { id: 'modalyst', name: 'Modalyst', logo: '📦', desc: 'Moda ve aksesuar', color: '#ec4899', badge: 'Premium' },
    { id: 'aliexpress', name: 'AliExpress', logo: '🇨🇳', desc: 'Uygun fiyatlı ürünler', color: '#ef4444', badge: 'Ucuz' },
  ];

  // Filtreleme
  const filteredPopular = popularSuppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Aktif', color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
      case 'inactive':
        return { text: 'Pasif', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' };
      case 'pending':
        return { text: 'Beklemede', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
      default:
        return { text: 'Bilinmiyor', color: '#6b7280', bg: 'rgba(107,114,128,0.1)' };
    }
  };

  return (
    <div style={{
      minHeight: '100%',
    }}>
      {/* Header - Başlık ve Buton */}
      {/* İstatistik Kartları - ProductsPage'deki gibi */}
      <div className="grid-4" style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
        gap: isMobile ? 10 : 20,
        marginBottom: 32
      }}>
        {/* Bağlı Tedarikçi */}
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
              <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: isMobile ? 20 : 24 }}>link</span>
            </div>
            <span style={{
              color: '#10b981',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              +2
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            BAĞLI TEDARİKÇİ
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
            {connectedSuppliers.length}
          </div>
        </div>

        {/* Bu Ayki Sipariş */}
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
              <span className="material-icons-round" style={{ color: '#10b981', fontSize: isMobile ? 20 : 24 }}>shopping_cart</span>
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
            BU AY SİPARİŞ
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>191</div>
        </div>

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
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#f59e0b', fontSize: isMobile ? 20 : 24 }}>inventory</span>
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
            TOPLAM SİPARİŞ
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>1,814</div>
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
              +5.2%
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            BAŞARI ORANI
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>97.8%</div>
        </div>
      </div>
      {/* Arama ve Filtre */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: 1,
          position: 'relative',
          minWidth: 200
        }}>
          <span style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: colors.textSecondary,
            fontSize: 18,
            zIndex: 1
          }}>🔍</span>
          <input
            type="text"
            placeholder="Tedarikçi ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 30,
              color: colors.text,
              fontSize: 14,
              outline: 'none'
            }}
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '12px 24px',
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 30,
            color: colors.text,
            fontSize: 14,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">Tüm Tedarikçiler</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
          <option value="pending">Beklemede</option>
        </select>
      </div>

      {/* Bağlı Tedarikçiler */}
      {connectedSuppliers.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{
            fontSize: isMobile ? 18 : 20,
            fontWeight: 600,
            color: colors.text,
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span>📦</span> Bağlı Tedarikçilerim
            <span style={{
              backgroundColor: colors.surface,
              padding: '2px 10px',
              borderRadius: 30,
              fontSize: 13,
              color: colors.textSecondary,
              marginLeft: 8
            }}>
              {connectedSuppliers.length}
            </span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: 16
          }}>
            {connectedSuppliers.map(supplier => {
              const status = getStatusBadge(supplier.status);

              return (
                <div
                  key={supplier.id}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    border: `1px solid ${colors.border}`,
                    padding: 20,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/admin/suppliers/${supplier.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Üst Kısım */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 16
                  }}>
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
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>
                          {supplier.name}
                        </h3>
                        <p style={{ fontSize: 12, color: colors.textSecondary, margin: '4px 0 0' }}>
                          Bağlantı: {supplier.connectedAt}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: status.bg,
                      color: status.color,
                      borderRadius: 30,
                      fontSize: 12,
                      fontWeight: 500
                    }}>
                      {status.text}
                    </span>
                  </div>

                  {/* İstatistikler */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                    padding: 12,
                    backgroundColor: colors.bg,
                    borderRadius: 12,
                    marginBottom: 16
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>Toplam</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>
                        {supplier.stats?.totalOrders}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>Bu Ay</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: colors.text }}>
                        {supplier.stats?.monthlyOrders}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>Başarı</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#10b981' }}>
                        {supplier.stats?.successRate}%
                      </div>
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div style={{
                    display: 'flex',
                    gap: 8
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/suppliers/${supplier.id}`);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#0ea5e9',
                        border: 'none',
                        borderRadius: 12,
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      Detaylar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Ayarlar
                      }}
                      style={{
                        padding: '10px',
                        backgroundColor: 'transparent',
                        border: `1px solid ${colors.border}`,
                        borderRadius: 12,
                        color: colors.textSecondary,
                        fontSize: 13,
                        cursor: 'pointer'
                      }}
                    >
                      ⚙️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Popüler Tedarikçiler */}
      <div>
        <h2 style={{
          fontSize: isMobile ? 18 : 20,
          fontWeight: 600,
          color: colors.text,
          margin: '0 0 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>🔥</span> Popüler Tedarikçiler
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isTablet ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)'),
          gap: isMobile ? 12 : 16
        }}>
          {filteredPopular.map(supplier => (
            <div
              key={supplier.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: isMobile ? 16 : 20,
                border: `1px solid ${colors.border}`,
                textAlign: 'center',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => navigate(`/admin/suppliers/connect/${supplier.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Badge */}
              <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                padding: '2px 8px',
                backgroundColor: supplier.color + '20',
                color: supplier.color,
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 600
              }}>
                {supplier.badge}
              </div>

              {/* Logo */}
              <div style={{
                width: 56,
                height: 56,
                backgroundColor: supplier.color + '10',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                margin: '0 auto 12px'
              }}>
                {supplier.logo}
              </div>

              {/* İsim */}
              <h3 style={{
                fontSize: isMobile ? 15 : 16,
                fontWeight: 600,
                color: colors.text,
                margin: '0 0 4px 0'
              }}>
                {supplier.name}
              </h3>

              {/* Açıklama */}
              <p style={{
                fontSize: isMobile ? 11 : 12,
                color: colors.textSecondary,
                margin: '0 0 16px 0',
                lineHeight: 1.4
              }}>
                {supplier.desc}
              </p>

              {/* Bağlan Butonu */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/suppliers/connect/${supplier.id}`);
                }}
                style={{
                  width: '100%',
                  padding: '8px 0',
                  backgroundColor: 'transparent',
                  border: `1px solid ${supplier.color}`,
                  borderRadius: 30,
                  color: supplier.color,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = supplier.color;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = supplier.color;
                }}
              >
                Bağlan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Özel Tedarikçi Ekleme Kartı */}
      <div style={{
        marginTop: 40,
        backgroundColor: colors.surface,
        borderRadius: 20,
        border: `2px dashed ${colors.border}`,
        padding: 32,
        textAlign: 'center'
      }}>
        <span style={{ fontSize: 48, color: colors.textSecondary, marginBottom: 16, display: 'block' }}>✨</span>
        <h3 style={{ fontSize: isMobile ? 18 : 20, color: colors.text, margin: '0 0 8px 0' }}>
          Kendi Tedarikçini Ekle
        </h3>
        <p style={{ fontSize: isMobile ? 13 : 14, color: colors.textSecondary, marginBottom: 24, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
          Listenizde olmayan bir tedarikçi mi var? Kendi tedarikçini özel olarak ekle.
        </p>
        <button
          onClick={() => navigate('/admin/suppliers/custom')}
          style={{
            padding: '12px 32px',
            backgroundColor: 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: 40,
            color: colors.text,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span>+</span>
          Özel Tedarikçi Ekle
        </button>
      </div>
    </div>
  );
};

export default SuppliersPage;