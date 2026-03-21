import React, { useState } from 'react';
import { 
  useFullAnalytics,
  useTopTrafficSource,
  useConversionRate,
  useTrackShopView,
  useTrackProductView
} from '../server/Gin/analytics.hooks';

interface AnalyticsPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

const AnalyticsPage = ({ colors }: AnalyticsPageProps) => {
  const [timeRange, setTimeRange] = useState('weekly'); // weekly veya daily
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  
  // Tüm analytics verilerini çek
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetchAll 
  } = useFullAnalytics(
    timeRange === 'weekly' ? '7d' : 
    timeRange === 'daily' ? '30d' : '30d'
  );
  
  // Conversion rate hesapla
  const conversionRate = useConversionRate(selectedPeriod);
  
  // Top traffic source bul
  const topSource = useTopTrafficSource(selectedPeriod);
  
  // Loading durumu
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.text
      }}>
        <div style={{ textAlign: 'center' }}>
          <span className="material-icons-round" style={{ fontSize: 48, marginBottom: 16 }}>hourglass_empty</span>
          <div>Analytics verileri yükleniyor...</div>
        </div>
      </div>
    );
  }
  
  // Error durumu
  if (isError) {
    return (
      <div style={{ 
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.text
      }}>
        <div style={{ textAlign: 'center' }}>
          <span className="material-icons-round" style={{ fontSize: 48, color: '#ef4444', marginBottom: 16 }}>error</span>
          <div>Hata oluştu: {error?.message}</div>
          <button 
            onClick={() => refetchAll()}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              backgroundColor: '#0ea5e9',
              border: 'none',
              borderRadius: 8,
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Zaman aralığı seçici */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: 8,
        marginBottom: 24
      }}>
        <button
          onClick={() => setSelectedPeriod('7d')}
          style={{
            padding: '8px 16px',
            backgroundColor: selectedPeriod === '7d' ? '#0ea5e9' : 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            color: selectedPeriod === '7d' ? 'white' : colors.text,
            cursor: 'pointer'
          }}
        >
          Son 7 Gün
        </button>
        <button
          onClick={() => setSelectedPeriod('30d')}
          style={{
            padding: '8px 16px',
            backgroundColor: selectedPeriod === '30d' ? '#0ea5e9' : 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            color: selectedPeriod === '30d' ? 'white' : colors.text,
            cursor: 'pointer'
          }}
        >
          Son 30 Gün
        </button>
        <button
          onClick={() => setSelectedPeriod('90d')}
          style={{
            padding: '8px 16px',
            backgroundColor: selectedPeriod === '90d' ? '#0ea5e9' : 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            color: selectedPeriod === '90d' ? 'white' : colors.text,
            cursor: 'pointer'
          }}
        >
          Son 90 Gün
        </button>
      </div>

      {/* 4'lü Kartlar - Gerçek verilerle */}
      <div className="grid-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        marginBottom: 32
      }}>
        {/* Real-time Visitors - backend'den gelmiyor, sabit */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`,
          boxShadow: colors.bg === '#0f172a' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: 24 }}>visibility</span>
            </div>
            <span style={{
              color: '#10b981',
              fontSize: 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: '4px 10px',
              borderRadius: 20
            }}>
              +12%
            </span>
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>REAL-TIME VISITORS</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>1,245</div>
        </div>

        {/* Toplam Ziyaretçi */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#a855f7', fontSize: 24 }}>people</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>TOTAL VISITORS</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>
            {data?.dashboard?.traffic?.total_visitors?.toLocaleString() || 0}
          </div>
        </div>

        {/* Toplam Sipariş */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#f59e0b', fontSize: 24 }}>shopping_cart</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>TOTAL ORDERS</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>
            {data?.dashboard?.overview?.total_orders?.toLocaleString() || 0}
          </div>
        </div>

        {/* Conversion Rate */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#10b981', fontSize: 24 }}>trending_up</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>CONVERSION RATE</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>
            {conversionRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Engagement Heatmap ve Traffic Trends - Gerçek verilerle */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        marginBottom: 32
      }}>
        {/* Engagement Heatmap - Backend'den gelecek şekilde güncellenecek */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 4px 0' }}>Engagement Heatmap</h2>
          <p style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 24 }}>User activity intensity by Day & Hour</p>

          {/* Zaman Etiketleri */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingLeft: 40 }}>
            {['00:00', '06:00', '12:00', '18:00', '24:00'].map(time => (
              <span key={time} style={{ fontSize: 11, color: colors.textSecondary }}>{time}</span>
            ))}
          </div>

          {/* Heatmap Grid - Gerçek verilerle dinamik */}
          <div style={{ display: 'flex', gap: 8 }}>
            {/* Gün Etiketleri */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 40 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} style={{ fontSize: 11, color: colors.textSecondary, height: 24 }}>{day}</span>
              ))}
            </div>

            {/* Heatmap Hücreleri - Gerçek verilerle */}
            <div style={{ flex: 1 }}>
              {data?.dashboard?.heatmap?.map((row: any, rowIndex: number) => (
                <div key={rowIndex} style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                  {row.hours.map((value: number, colIndex: number) => {
                    let bgColor = 'rgba(14,165,233,0.1)';
                    if (value > 75) bgColor = 'rgba(14,165,233,0.8)';
                    else if (value > 50) bgColor = 'rgba(14,165,233,0.5)';
                    else if (value > 25) bgColor = 'rgba(14,165,233,0.3)';
                    
                    return (
                      <div
                        key={colIndex}
                        style={{
                          flex: 1,
                          height: 24,
                          backgroundColor: bgColor,
                          borderRadius: 4,
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                        title={`${row.day} ${colIndex}:00 - ${value} visits`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* View Toggle - Çalışır durumda */}
          <div style={{ 
            display: 'flex', 
            gap: 8, 
            marginTop: 24,
            backgroundColor: colors.bg,
            padding: 4,
            borderRadius: 30,
            width: 'fit-content'
          }}>
            <button
              onClick={() => setTimeRange('weekly')}
              style={{
                padding: '6px 16px',
                backgroundColor: timeRange === 'weekly' ? '#0ea5e9' : 'transparent',
                border: 'none',
                borderRadius: 30,
                color: timeRange === 'weekly' ? 'white' : colors.textSecondary,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('daily')}
              style={{
                padding: '6px 16px',
                backgroundColor: timeRange === 'daily' ? '#0ea5e9' : 'transparent',
                border: 'none',
                borderRadius: 30,
                color: timeRange === 'daily' ? 'white' : colors.textSecondary,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Daily
            </button>
          </div>
        </div>

        {/* Traffic and Conversion Trends - Gerçek verilerle */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 4px 0' }}>Traffic and Conversion Trends</h2>
          
          {/* Total Visits */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: colors.text }}>
              {data?.dashboard?.overview?.total_visitors?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: 13, color: '#10b981' }}>
              Total Visits +{(data?.dashboard?.growth?.visitors || 0).toFixed(1)}%
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, backgroundColor: '#0ea5e9', borderRadius: 3 }} />
              <span style={{ fontSize: 12, color: colors.textSecondary }}>Visits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, backgroundColor: '#10b981', borderRadius: 3 }} />
              <span style={{ fontSize: 12, color: colors.textSecondary }}>Conversions</span>
            </div>
          </div>

          {/* Chart - Gerçek verilerle */}
          <div style={{ height: 150, display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 16 }}>
            {data?.dashboard?.sales_by_day?.map((day: any, i: number) => {
              const maxVisits = Math.max(...(data?.dashboard?.sales_by_day?.map((d: any) => d.visits) || [1]));
              const maxConversions = Math.max(...(data?.dashboard?.sales_by_day?.map((d: any) => d.conversions) || [1]));
              
              const visitHeight = (day.visits / maxVisits) * 120;
              const conversionHeight = (day.conversions / maxConversions) * 120;
              
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ height: visitHeight, backgroundColor: '#0ea5e9', borderRadius: '4px 4px 0 0' }} />
                  <div style={{ height: conversionHeight, backgroundColor: '#10b981', borderRadius: '4px 4px 0 0' }} />
                </div>
              );
            })}
          </div>

          {/* Günler */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
            {data?.dashboard?.sales_by_day?.map((day: any, i: number) => (
              <span key={i} style={{ fontSize: 11, color: colors.textSecondary }}>
                {new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'short' }).toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Goal Completion ve User Distribution - Gerçek verilerle */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        marginBottom: 32
      }}>
        {/* Goal Completion */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>Goal Completion</h2>
          
          {/* Signups */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: colors.text }}>Signups</span>
              <span style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
                {data?.dashboard?.goals?.signups?.percentage || 0}%
              </span>
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>
              Target: {data?.dashboard?.goals?.signups?.target?.toLocaleString() || 0} users
            </div>
            <div style={{ 
              width: '100%', 
              height: 6, 
              backgroundColor: colors.bg, 
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div 
                style={{ 
                  width: `${data?.dashboard?.goals?.signups?.percentage || 0}%`, 
                  height: '100%', 
                  backgroundColor: '#0ea5e9', 
                  borderRadius: 3 
                }} 
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#0ea5e9' }}>Do Track</span>
            </div>
          </div>

          {/* Purchases */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: colors.text }}>Purchases</span>
              <span style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
                {data?.dashboard?.goals?.purchases?.percentage || 0}%
              </span>
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>
              Target: {((data?.dashboard?.goals?.purchases?.target || 0) / 1000).toFixed(1)}k MRR
            </div>
            <div style={{ 
              width: '100%', 
              height: 6, 
              backgroundColor: colors.bg, 
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div 
                style={{ 
                  width: `${data?.dashboard?.goals?.purchases?.percentage || 0}%`, 
                  height: '100%', 
                  backgroundColor: '#f59e0b', 
                  borderRadius: 3 
                }} 
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#f59e0b' }}>Processing</span>
            </div>
          </div>

          {/* Retention */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: colors.text }}>Retention</span>
              <span style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
                {data?.dashboard?.goals?.retention?.percentage || 0}%
              </span>
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>
              Target: +{(data?.dashboard?.goals?.retention?.target || 0).toFixed(1)}% Churn
            </div>
            <div style={{ 
              width: '100%', 
              height: 6, 
              backgroundColor: colors.bg, 
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div 
                style={{ 
                  width: `${data?.dashboard?.goals?.retention?.percentage || 0}%`, 
                  height: '100%', 
                  backgroundColor: '#10b981', 
                  borderRadius: 3 
                }} 
              />
            </div>
            <div style={{ textAlign: 'right', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: '#10b981' }}>Execution</span>
            </div>
          </div>

          <a href="#" style={{ 
            color: '#0ea5e9', 
            fontSize: 13, 
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: 8
          }}>
            View Detailed Report →
          </a>
        </div>

        {/* User Distribution by Region - Gerçek verilerle */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 24px 0' }}>User Distribution by Region</h2>
          
          {/* Bölge istatistikleri */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data?.dashboard?.regions?.map((region: any) => (
              <div key={region.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: colors.text }}>{region.name}</span>
                  <span style={{ fontSize: 13, color: colors.text }}>{region.percentage}%</span>
                </div>
                <div style={{ width: '100%', height: 4, backgroundColor: colors.bg, borderRadius: 2 }}>
                  <div 
                    style={{ 
                      width: `${region.percentage}%`, 
                      height: '100%', 
                      backgroundColor: region.color || '#0ea5e9', 
                      borderRadius: 2 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Harita placeholder - ileride gerçek harita entegrasyonu */}
          <div style={{ 
            height: 150, 
            backgroundColor: colors.bg, 
            borderRadius: 12,
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px dashed ${colors.border}`
          }}>
            <span className="material-icons-round" style={{ fontSize: 48, color: colors.textSecondary }}>map</span>
          </div>
        </div>
      </div>

      {/* Top Performing Pages - Gerçek verilerle */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: 0 }}>Top Performing Pages</h2>
          <a href="#" style={{ color: '#0ea5e9', fontSize: 13, textDecoration: 'none' }}>Full Report →</a>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                backgroundColor: colors.bg,
                fontSize: 12,
                color: colors.textSecondary,
                textAlign: 'left'
              }}>
                <th style={{ padding: '12px 24px' }}>PAGE PATH</th>
                <th style={{ padding: '12px 24px' }}>VIEWS</th>
                <th style={{ padding: '12px 24px' }}>UNIQUE VISITORS</th>
                <th style={{ padding: '12px 24px' }}>BOUNCE RATE</th>
                <th style={{ padding: '12px 24px' }}>EXIT %</th>
                <th style={{ padding: '12px 24px' }}>TREND</th>
              </tr>
            </thead>
            <tbody>
              {data?.dashboard?.top_pages?.map((page: any, index: number) => (
                <tr key={index} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '16px 24px', color: colors.text }}>{page.path}</td>
                  <td style={{ padding: '16px 24px', color: colors.text }}>{page.views.toLocaleString()}</td>
                  <td style={{ padding: '16px 24px', color: colors.text }}>{page.unique_visitors.toLocaleString()}</td>
                  <td style={{ padding: '16px 24px', color: page.bounce_rate < 40 ? '#10b981' : '#f43f5e' }}>
                    {page.bounce_rate}%
                  </td>
                  <td style={{ padding: '16px 24px', color: colors.text }}>{page.exit_rate}%</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ color: page.trend === 'up' ? '#10b981' : '#f43f5e' }}>
                      {page.trend === 'up' ? '↑' : '↓'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;