// pages/DetailedAnalyticsPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useFullAnalytics,
  useGrowthPercentage,
  useConversionRate,
  useTopTrafficSource
} from '../server/Gin/analytics.hooks';

import './AnalyticsDetail.css';

interface DetailedAnalyticsProps {
  colors?: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

const DetailedAnalyticsPage = ({ colors }: DetailedAnalyticsProps) => {
  const { period: urlPeriod } = useParams<{ period?: string }>();
  const navigate = useNavigate();
  
  // URL'den period gelmezse default '30d'
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '12m' | '24m'>(
    (urlPeriod as any) || '30d'
  );
  
  const [selectedTab, setSelectedTab] = useState('overview');
  const [compareWith, setCompareWith] = useState<'previous' | 'lastYear'>('previous');
  
  // Tüm verileri çek
  const { data, isLoading, isError } = useFullAnalytics(selectedPeriod);
  const growth = useGrowthPercentage(selectedPeriod, '7d');
  const conversionRate = useConversionRate(selectedPeriod);
  const topSource = useTopTrafficSource(selectedPeriod);
  
  // Period değişince URL'i güncelle
  const handlePeriodChange = (period: any) => {
    setSelectedPeriod(period);
    navigate(`/analytics/detailed/${period}`);
  };
  
  // Tabs
  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: 'dashboard', count: null },
    { id: 'traffic', label: 'Trafik Kaynakları', icon: 'traffic', count: data?.dashboard?.traffic?.sources ? Object.keys(data.dashboard.traffic.sources).length : 0 },
    { id: 'products', label: 'Ürün Performansı', icon: 'inventory_2', count: data?.dashboard?.top_products?.length },
    { id: 'customers', label: 'Müşteri Analizi', icon: 'people', count: data?.dashboard?.overview?.total_customers },
    { id: 'sales', label: 'Satış Raporları', icon: 'trending_up', count: data?.dashboard?.overview?.total_orders },
    { id: 'geo', label: 'Coğrafi Dağılım', icon: 'public', count: data?.dashboard?.regions?.length },
    { id: 'devices', label: 'Cihazlar', icon: 'devices', count: 3 },
    { id: 'seo', label: 'SEO & Ranking', icon: 'analytics', count: data?.ranking?.world_rank ? `#${data.ranking.world_rank}` : null },
  ];
  
  // DEFAULT COLORS - eğer colors prop'u gelmezse bunu kullan
  const defaultColors = {
    bg: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    text: '#f8fafc',
    textSecondary: '#94a3b8'
  };
  
  // colors varsa onu kullan, yoksa default'u kullan
  const theme = colors || defaultColors;

  // Loading durumu
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.bg,
        color: theme.text
      }}>
        <div style={{ textAlign: 'center' }}>
          <span className="material-icons-round" style={{ fontSize: 48, color: '#0ea5e9', marginBottom: 16 }}>hourglass_empty</span>
          <div>Detaylı analiz verileri yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: theme.bg,  // colors yerine theme kullan
      padding: 32
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <button
              onClick={() => navigate('/analytics')}
              style={{
                background: 'none',
                border: 'none',
                color: theme.textSecondary,  // colors yerine theme
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 14
              }}
            >
              <span className="material-icons-round" style={{ fontSize: 20 }}>arrow_back</span>
              Analytics Dashboard
            </button>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 600, color: theme.text, margin: 0 }}>  {/* theme kullan */}
            Detaylı Analiz Raporu
          </h1>
          <p style={{ fontSize: 14, color: theme.textSecondary, marginTop: 8 }}>  {/* theme kullan */}
            Mağazanızın tüm performans metriklerini detaylıca inceleyin
          </p>
        </div>

        {/* Period Selector */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          backgroundColor: theme.surface,  // theme kullan
          padding: 4, 
          borderRadius: 12,
          border: `1px solid ${theme.border}`  // theme kullan
        }}>
          {[
            { value: '7d', label: '7 Gün' },
            { value: '30d', label: '30 Gün' },
            { value: '90d', label: '90 Gün' },
            { value: '12m', label: '12 Ay' },
            { value: '24m', label: '24 Ay' }
          ].map(p => (
            <button
              key={p.value}
              onClick={() => handlePeriodChange(p.value)}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedPeriod === p.value ? '#0ea5e9' : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: selectedPeriod === p.value ? 'white' : theme.textSecondary,  // theme kullan
                fontSize: 14,
                fontWeight: selectedPeriod === p.value ? 500 : 400,
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compare Toggle */}
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 24,
        padding: '12px 20px',
        backgroundColor: theme.surface,  // theme kullan
        borderRadius: 12,
        border: `1px solid ${theme.border}`,  // theme kullan
        width: 'fit-content'
      }}>
        <span style={{ color: theme.textSecondary, fontSize: 14 }}>Karşılaştır:</span>  {/* theme kullan */}
        <button
          onClick={() => setCompareWith('previous')}
          style={{
            padding: '4px 12px',
            backgroundColor: compareWith === 'previous' ? '#0ea5e9' : 'transparent',
            border: 'none',
            borderRadius: 20,
            color: compareWith === 'previous' ? 'white' : theme.text,  // theme kullan
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          Önceki Dönem
        </button>
        <button
          onClick={() => setCompareWith('lastYear')}
          style={{
            padding: '4px 12px',
            backgroundColor: compareWith === 'lastYear' ? '#0ea5e9' : 'transparent',
            border: 'none',
            borderRadius: 20,
            color: compareWith === 'lastYear' ? 'white' : theme.text,  // theme kullan
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          Geçen Yıl
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 32,
        flexWrap: 'wrap',
        borderBottom: `1px solid ${theme.border}`,  // theme kullan
        paddingBottom: 16
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              backgroundColor: selectedTab === tab.id ? '#0ea5e9' : 'transparent',
              border: 'none',
              borderRadius: 30,
              color: selectedTab === tab.id ? 'white' : theme.text,  // theme kullan
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span className="material-icons-round" style={{ fontSize: 20 }}>
              {tab.icon}
            </span>
            {tab.label}
            {tab.count !== null && tab.count !== undefined && (
              <span style={{
                backgroundColor: selectedTab === tab.id ? 'rgba(255,255,255,0.2)' : theme.bg,  // theme kullan
                padding: '2px 8px',
                borderRadius: 20,
                fontSize: 12,
                marginLeft: 4
              }}>
                {typeof tab.count === 'number' ? tab.count.toLocaleString() : tab.count}
              </span>
            )}
          </button>
        ))}

        {/* Export Button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.border}`,  // theme kullan
            borderRadius: 30,
            color: theme.text,  // theme kullan
            fontSize: 14,
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          <span className="material-icons-round" style={{ fontSize: 20 }}>download</span>
          Raporu İndir (PDF)
        </button>
      </div>

      {/* Tab Content */}
      <div style={{
        backgroundColor: theme.surface,  // theme kullan
        borderRadius: 24,
        border: `1px solid ${theme.border}`,  // theme kullan
        padding: 32
      }}>
        {selectedTab === 'overview' && (
          <OverviewTab 
            data={data} 
            colors={theme}  // theme'i colors olarak geç
            growth={growth}
            conversionRate={conversionRate}
            period={selectedPeriod}
          />
        )}
        
        {selectedTab === 'traffic' && (
          <TrafficTab 
            data={data} 
            colors={theme}  // theme'i colors olarak geç
            topSource={topSource}
          />
        )}
        
        {selectedTab === 'products' && (
          <ProductsTab 
            data={data} 
            colors={theme}  // theme'i colors olarak geç
          />
        )}
        
        {selectedTab === 'customers' && (
          <CustomersTab 
            data={data} 
            colors={theme}  // theme'i colors olarak geç
          />
        )}
        
        {selectedTab === 'sales' && (
          <SalesTab 
            data={data} 
            colors={theme}  // theme'i colors olarak geç
          />
        )}
        
        {selectedTab === 'geo' && (
          <GeoTab 
            data={data} 
            colors={theme}  // theme'i colors olarak geç
          />
        )}
        
        {selectedTab === 'devices' && (
          <DevicesTab 
            data={data} 
            colors={theme}  // theme'i colors olarak geç
          />
        )}
        
        {selectedTab === 'seo' && (
          <SEOTab 
            data={data} 
            colors={theme}  // theme'i colors olarak geç
          />
        )}
      </div>
    </div>
  );
};

// Diğer component'ler aynı, sadece colors prop'unu kullanıyorlar
const OverviewTab = ({ data, colors, growth, conversionRate, period }: any) => {
  return (
    <div>
      <h2 style={{ fontSize: 24, color: colors.text, marginBottom: 24 }}>Genel Bakış</h2>
      
      {/* KPI Kartları */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        marginBottom: 32
      }}>
        {/* Gelir Kartı */}
        <div style={{
          backgroundColor: colors.bg,
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#10b981', fontSize: 24 }}>payments</span>
            </div>
            <div style={{
              color: growth?.revenue > 0 ? '#10b981' : '#ef4444',
              fontSize: 14,
              fontWeight: 500
            }}>
              {growth?.revenue > 0 ? '+' : ''}{growth?.revenue?.toFixed(1)}%
            </div>
          </div>
          <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>Toplam Gelir</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: colors.text }}>
            ₺{data?.dashboard?.overview?.total_revenue?.toLocaleString() || 0}
          </div>
        </div>

        {/* Diğer kartlar aynı... */}
        {/* Sipariş Kartı */}
        <div style={{
          backgroundColor: colors.bg,
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: 24 }}>shopping_cart</span>
            </div>
          </div>
          <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>Toplam Sipariş</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: colors.text }}>
            {data?.dashboard?.overview?.total_orders?.toLocaleString() || 0}
          </div>
        </div>

        {/* Müşteri Kartı */}
        <div style={{
          backgroundColor: colors.bg,
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#a855f7', fontSize: 24 }}>people</span>
            </div>
          </div>
          <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>Toplam Müşteri</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: colors.text }}>
            {data?.dashboard?.overview?.total_customers?.toLocaleString() || 0}
          </div>
        </div>

        {/* Dönüşüm Kartı */}
        <div style={{
          backgroundColor: colors.bg,
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#f59e0b', fontSize: 24 }}>trending_up</span>
            </div>
          </div>
          <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>Dönüşüm Oranı</div>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: colors.text }}>
            {conversionRate?.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Detaylı Metrikler Tablosu */}
      <div style={{
        backgroundColor: colors.bg,
        borderRadius: 16,
        padding: 24,
        marginBottom: 32
      }}>
        <h3 style={{ fontSize: 18, color: colors.text, marginBottom: 20 }}>Detaylı Metrikler</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24
        }}>
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span style={{ color: colors.textSecondary }}>Ortalama Sipariş Değeri</span>
              <span style={{ color: colors.text, fontWeight: 500 }}>
                ₺{((data?.dashboard?.overview?.total_revenue || 0) / (data?.dashboard?.overview?.total_orders || 1)).toFixed(2)}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span style={{ color: colors.textSecondary }}>Ziyaretçi Başına Gelir</span>
              <span style={{ color: colors.text, fontWeight: 500 }}>
                ₺{((data?.dashboard?.overview?.total_revenue || 0) / (data?.dashboard?.traffic?.total_visitors || 1)).toFixed(2)}
              </span>
            </div>
          </div>
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span style={{ color: colors.textSecondary }}>Müşteri Başına Sipariş</span>
              <span style={{ color: colors.text, fontWeight: 500 }}>
                {((data?.dashboard?.overview?.total_orders || 0) / (data?.dashboard?.overview?.total_customers || 1)).toFixed(2)}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              borderBottom: `1px solid ${colors.border}`
            }}>
              <span style={{ color: colors.textSecondary }}>Sepet Terk Oranı</span>
              <span style={{ color: '#ef4444', fontWeight: 500 }}>%68.5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zaman İçinde Gelir Grafiği */}
      <div style={{
        backgroundColor: colors.bg,
        borderRadius: 16,
        padding: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, color: colors.text, margin: 0 }}>Gelir Trendi</h3>
          <select style={{
            backgroundColor: colors.surface,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: '8px 12px'
          }}>
            <option>Günlük</option>
            <option>Haftalık</option>
            <option>Aylık</option>
          </select>
        </div>

        {/* Basit grafik placeholder */}
        <div style={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {data?.dashboard?.sales_by_day?.slice(0, 30).map((day: any, i: number) => {
            const maxRevenue = Math.max(...(data?.dashboard?.sales_by_day?.map((d: any) => d.revenue) || [1]));
            const height = (day.revenue / maxRevenue) * 250;
            
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  height: height, 
                  backgroundColor: '#0ea5e9',
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.7
                }} />
                {i % 5 === 0 && (
                  <span style={{ fontSize: 10, color: colors.textSecondary, marginTop: 8 }}>
                    {new Date(day.date).getDate()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Diğer tab component'leri aynı kalabilir
const TrafficTab = ({ data, colors, topSource }: any) => (
  <div>
    <h2 style={{ fontSize: 24, color: colors.text, marginBottom: 24 }}>Trafik Kaynakları</h2>
    {/* Trafik kaynakları detayları */}
  </div>
);

const ProductsTab = ({ data, colors }: any) => (
  <div>
    <h2 style={{ fontSize: 24, color: colors.text, marginBottom: 24 }}>Ürün Performansı</h2>
    {/* Ürün performansı detayları */}
  </div>
);

const CustomersTab = ({ data, colors }: any) => (
  <div>
    <h2 style={{ fontSize: 24, color: colors.text, marginBottom: 24 }}>Müşteri Analizi</h2>
    {/* Müşteri analizi detayları */}
  </div>
);

const SalesTab = ({ data, colors }: any) => (
  <div>
    <h2 style={{ fontSize: 24, color: colors.text, marginBottom: 24 }}>Satış Raporları</h2>
    {/* Satış raporları detayları */}
  </div>
);

const GeoTab = ({ data, colors }: any) => (
  <div>
    <h2 style={{ fontSize: 24, color: colors.text, marginBottom: 24 }}>Coğrafi Dağılım</h2>
    {/* Coğrafi dağılım detayları */}
  </div>
);

const DevicesTab = ({ data, colors }: any) => (
  <div>
    <h2 style={{ fontSize: 24, color: colors.text, marginBottom: 24 }}>Cihaz Analizi</h2>
    {/* Cihaz analizi detayları */}
  </div>
);

const SEOTab = ({ data, colors }: any) => (
  <div>
    <h2 style={{ fontSize: 24, color: colors.text, marginBottom: 24 }}>SEO & Ranking</h2>
    {/* SEO detayları */}
  </div>
);

export default DetailedAnalyticsPage;