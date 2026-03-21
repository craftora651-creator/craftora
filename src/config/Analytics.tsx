import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useFullAnalytics,
  useConversionRate,
  useTopTrafficSource,
  useGrowthPercentage
} from '../server/Gin/analytics.hooks';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip  } from 'recharts';

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
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  // Backend verilerini çek
  const period = timeRange === 'daily' ? '7d' : timeRange === 'weekly' ? '30d' : '90d';
  const { data, isLoading } = useFullAnalytics(period);
  const conversionRate = useConversionRate(period);
  const topSource = useTopTrafficSource(period);
  const growth = useGrowthPercentage(period, '7d');

  // Verilerden değerleri çıkar
  const totalVisitors = data?.traffic?.total_visitors || 1245;
  const totalRevenue = data?.dashboard?.overview?.total_revenue || 8920;
  const avgDuration = data?.dashboard?.overview?.avg_session_duration || '4m 12s';
  const bounceRate = data?.dashboard?.overview?.bounce_rate || 42.3;

  const handleViewDetailedReport = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/analytics-shop');
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg
      }}>
        <div style={{ textAlign: 'center' }}>
          <span className="material-icons-round" style={{ fontSize: 48, color: '#0ea5e9', marginBottom: 16 }}>hourglass_empty</span>
          <div style={{ color: colors.text }}>Analytics verileri yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100%',
    }}>
      {/* 4'lü Kartlar */}
      {/* 4'lü Kartlar */}
      <div className="grid-4" style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
        gap: isMobile ? 10 : 20,
        marginBottom: 32
      }}>
        {/* Real-time Visitors - Anlık Ziyaretçi */}
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
              <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: isMobile ? 20 : 24 }}>visibility</span>
            </div>
            <span style={{
              color: data?.dashboard?.overview?.visitor_growth > 0 ? '#10b981' : '#ef4444',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: data?.dashboard?.overview?.visitor_growth > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              {data?.dashboard?.overview?.visitor_growth ?
                (data.dashboard.overview.visitor_growth > 0 ? '+' : '') + data.dashboard.overview.visitor_growth.toFixed(1) + '%'
                : '+12%'}
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            ANLIK ZİYARETÇİ
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
            {data?.dashboard?.overview?.realtime_visitors?.toLocaleString() ?? 0}
          </div>
        </div>

        {/* Toplam Gelir */}
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
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#a855f7', fontSize: isMobile ? 20 : 24 }}>payments</span>
            </div>
            <span style={{
              color: colors.textSecondary,
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              {data?.dashboard?.overview?.revenue_growth ?
                (data.dashboard.overview.revenue_growth > 0 ? '+' : '') + data.dashboard.overview.revenue_growth.toFixed(1) + '%'
                : 'vs geçen ay'}
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            TOPLAM GELİR
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
            ₺{data?.dashboard?.overview?.total_revenue?.toLocaleString() ?? '0'}
          </div>
        </div>

        {/* Ortalama Oturum Süresi */}
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
              <span className="material-icons-round" style={{ color: '#f59e0b', fontSize: isMobile ? 20 : 24 }}>timer</span>
            </div>
            <span style={{
              color: colors.textSecondary,
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              {data?.dashboard?.overview?.duration_growth ?
                (data.dashboard.overview.duration_growth > 0 ? '+' : '') + data.dashboard.overview.duration_growth.toFixed(1) + '%'
                : 'vs dün'}
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            ORT. OTURUM SÜRESİ
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
            {data?.dashboard?.overview?.avg_session_duration || '4d 12s'}
          </div>
        </div>

        {/* Hemen Çıkma Oranı */}
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
              <span className="material-icons-round" style={{ color: '#10b981', fontSize: isMobile ? 20 : 24 }}>trending_down</span>
            </div>
            <span style={{
              color: (data?.dashboard?.overview?.bounce_rate || 42) < 50 ? '#10b981' : '#ef4444',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: (data?.dashboard?.overview?.bounce_rate || 42) < 50 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              {data?.dashboard?.overview?.bounce_rate_change ?
                (data.dashboard.overview.bounce_rate_change > 0 ? '+' : '') + data.dashboard.overview.bounce_rate_change.toFixed(1) + '%'
                : '-0.8%'}
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            HEMEN ÇIKMA ORANI
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
            %{data?.dashboard?.overview?.bounce_rate?.toFixed(1) || '42.3'}
          </div>
        </div>
      </div>

      {/* Zaman Filtresi */}
      <div style={{
        marginBottom: 24,
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
          {[
            { key: 'daily', label: 'Daily' },
            { key: 'weekly', label: 'Weekly' },
            { key: 'monthly', label: 'Monthly' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setTimeRange(item.key as any)}
              style={{
                padding: isMobile ? '6px 16px' : '8px 24px',
                backgroundColor: timeRange === item.key ? '#0ea5e9' : 'transparent',
                border: 'none',
                borderRadius: 30,
                color: timeRange === item.key ? 'white' : colors.textSecondary,
                fontSize: isMobile ? 12 : 14,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Engagement Heatmap ve Traffic Trends */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 16 : 24,
        marginBottom: 32
      }}>
        {/* ========== ENGAGEMENT HEATMAP ========== */}
        {/* ========== ENGAGEMENT HEATMAP ========== */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${colors.border}`,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <h2 style={{ fontSize: isMobile ? 15 : 18, fontWeight: 600, color: colors.text, margin: '0 0 12px 0' }}>
            Engagement Heatmap
          </h2>
          <p style={{ fontSize: isMobile ? 11 : 13, color: colors.textSecondary, marginBottom: 16 }}>
            User activity intensity by Day & Hour
          </p>

          {/* Zaman Etiketleri */}
          <div style={{ overflowX: 'auto', marginBottom: 12, paddingBottom: 4 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingLeft: 35,
              minWidth: isMobile ? '280px' : 'auto'
            }}>
              {['00:00', '06:00', '12:00', '18:00', '24:00'].map(time => (
                <span key={time} style={{ fontSize: isMobile ? 9 : 11, color: colors.textSecondary }}>{time}</span>
              ))}
            </div>
          </div>

          {/* Heatmap Grid */}
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <div style={{
              display: 'flex',
              gap: 4,
              minWidth: isMobile ? '280px' : 'auto'
            }}>
              {/* Gün Etiketleri */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 35 }}>
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                  <span key={day} style={{
                    fontSize: isMobile ? 9 : 11,
                    color: colors.text,
                    height: isMobile ? 18 : 24,
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 500
                  }}>
                    {day}
                  </span>
                ))}
              </div>

              {/* Heatmap Hücreleri */}
              <div style={{ flex: 1 }}>
                {[0, 1, 2, 3, 4, 5, 6].map(row => (
                  <div key={row} style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                    {[0, 1, 2, 3, 4].map(col => {
                      // ✅ GERÇEK VERİ - heatmap'ten geliyor
                      const intensity = data?.dashboard?.heatmap?.data?.[row]?.[col] ?? 0;

                      // Yoğunluğa göre renk
                      let bgColor = 'rgba(14,165,233,0.05)';
                      if (intensity > 0) {
                        if (intensity > 70) bgColor = 'rgba(14,165,233,0.9)';
                        else if (intensity > 50) bgColor = 'rgba(14,165,233,0.7)';
                        else if (intensity > 30) bgColor = 'rgba(14,165,233,0.5)';
                        else if (intensity > 10) bgColor = 'rgba(14,165,233,0.3)';
                        else bgColor = 'rgba(14,165,233,0.1)';
                      }

                      return (
                        <div
                          key={col}
                          style={{
                            flex: 1,
                            height: isMobile ? 18 : 24,
                            backgroundColor: bgColor,
                            borderRadius: 4,
                            minWidth: isMobile ? 14 : 20,
                            transition: 'all 0.2s',
                            cursor: intensity > 0 ? 'pointer' : 'default'
                          }}
                          title={intensity > 0
                            ? `${['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'][row]} ${col * 5}:00 - ${(col + 1) * 5}:00\nYoğunluk: %${Math.round(intensity)}`
                            : 'Aktivite yok'
                          }
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Heatmap Alt İstatistikler - ✅ GERÇEK VERİ */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginTop: 20,
            paddingTop: 16,
            borderTop: `1px solid ${colors.border}`
          }}>
            <div>
              <span style={{ fontSize: isMobile ? 9 : 11, color: colors.textSecondary }}>En Yoğun Gün</span>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: colors.text, marginTop: 2 }}>
                {data?.dashboard?.heatmap?.peak_day || '—'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: isMobile ? 9 : 11, color: colors.textSecondary }}>En Yoğun Saat</span>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: colors.text, marginTop: 2 }}>
                {data?.dashboard?.heatmap?.peak_hour || '—'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: isMobile ? 9 : 11, color: colors.textSecondary }}>Toplam Aktivite</span>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: colors.text, marginTop: 2 }}>
                {data?.dashboard?.heatmap?.total_activities?.toLocaleString() || '0'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: isMobile ? 9 : 11, color: colors.textSecondary }}>Ortalama Yoğunluk</span>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: colors.text, marginTop: 2 }}>
                {data?.dashboard?.heatmap?.avg_intensity ? `%${data.dashboard.heatmap.avg_intensity}` : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* ========== TRAFFIC AND CONVERSION TRENDS ========== */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${colors.border}`,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <h2 style={{ fontSize: isMobile ? 15 : 18, fontWeight: 600, color: colors.text, margin: '0 0 12px 0' }}>
            Traffic & Conversion
          </h2>

          {/* Total Visits */}
          <div style={{ marginBottom: isMobile ? 12 : 20 }}>
            <div style={{ fontSize: isMobile ? 20 : 36, fontWeight: 'bold', color: colors.text }}>
              {data?.traffic?.total_visitors?.toLocaleString() || '0'}
            </div>
            <div style={{ fontSize: isMobile ? 10 : 13, color: '#10b981' }}>
              +{growth?.revenue?.toFixed(1) || '0'}%
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: isMobile ? 12 : 24, marginBottom: isMobile ? 10 : 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: isMobile ? 8 : 12, height: isMobile ? 8 : 12, backgroundColor: '#0ea5e9', borderRadius: 2 }} />
              <span style={{ fontSize: isMobile ? 9 : 12, color: colors.textSecondary }}>Ziyaretçi</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: isMobile ? 8 : 12, height: isMobile ? 8 : 12, backgroundColor: '#10b981', borderRadius: 2 }} />
              <span style={{ fontSize: isMobile ? 9 : 12, color: colors.textSecondary }}>Sipariş</span>
            </div>
          </div>

          {/* Chart */}
          {/* Chart */}
          <div style={{ overflowX: 'auto', flex: 1 }}>
            {data?.dashboard?.sales_by_day?.length > 0 ? (
              <>
                <div style={{
                  height: isMobile ? 70 : 150,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 4,
                  marginBottom: 8,
                  minWidth: isMobile ? '250px' : 'auto'
                }}>
                  {data.dashboard.sales_by_day.slice(-7).map((day, i) => {
                    const maxVisitors = Math.max(...(data.dashboard.sales_by_day.map(d => d.visitors) || [1]));
                    const maxOrders = Math.max(...(data.dashboard.sales_by_day.map(d => d.orders) || [1]));

                    const visitHeight = maxVisitors > 0 ? (day.visitors / maxVisitors) * (isMobile ? 50 : 120) : 4;
                    const orderHeight = maxOrders > 0 ? (day.orders / maxOrders) * (isMobile ? 20 : 50) : 2;

                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{
                          height: Math.max(visitHeight, 4),
                          backgroundColor: '#0ea5e9',
                          borderRadius: '3px 3px 0 0',
                          minHeight: 4,
                          transition: 'height 0.3s'
                        }} />
                        <div style={{
                          height: Math.max(orderHeight, 2),
                          backgroundColor: '#10b981',
                          borderRadius: '3px 3px 0 0',
                          minHeight: 2,
                          transition: 'height 0.3s'
                        }} />
                      </div>
                    );
                  })}
                </div>

                {/* Günler */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 4px',
                  minWidth: isMobile ? '250px' : 'auto'
                }}>
                  {data.dashboard.sales_by_day.slice(-7).map((day, i) => {
                    const date = new Date(day.date);
                    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
                    return (
                      <span key={i} style={{ fontSize: isMobile ? 8 : 11, color: colors.textSecondary }}>
                        {dayNames[date.getDay()]}
                      </span>
                    );
                  })}
                </div>
              </>
            ) : (
              // 🟢 VERİ YOKSA - "Veri bulunamadı" mesajı
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: isMobile ? 100 : 180,
                backgroundColor: colors.bg,
                borderRadius: 12,
                gap: 8
              }}>
                <span className="material-icons-round" style={{ fontSize: 32, color: colors.textSecondary, opacity: 0.5 }}>
                  timeline
                </span>
                <span style={{ fontSize: isMobile ? 12 : 14, color: colors.textSecondary }}>
                  Grafik verisi bulunamadı
                </span>
                <span style={{ fontSize: isMobile ? 10 : 12, color: colors.textSecondary, opacity: 0.7 }}>
                  Ziyaretçi olduğunda görünecek
                </span>
              </div>
            )}
          </div>

          {/* Traffic Alt İstatistikler */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginTop: 20,
            paddingTop: 16,
            borderTop: `1px solid ${colors.border}`
          }}>
            <div>
              <span style={{ fontSize: isMobile ? 9 : 11, color: colors.textSecondary }}>Toplam Sipariş</span>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: colors.text, marginTop: 2 }}>
                {data?.dashboard?.overview?.total_orders?.toLocaleString() || '0'}
              </div>
            </div>
            <div>
              <span style={{ fontSize: isMobile ? 9 : 11, color: colors.textSecondary }}>Dönüşüm Oranı</span>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: colors.text, marginTop: 2 }}>
                %{(data?.dashboard?.overview?.conversion_rate || 0).toFixed(1)}
              </div>
            </div>
            <div>
              <span style={{ fontSize: isMobile ? 9 : 11, color: colors.textSecondary }}>Ortalama Sipariş</span>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: colors.text, marginTop: 2 }}>
                ₺{((data?.dashboard?.overview?.total_revenue || 0) / (data?.dashboard?.overview?.total_orders || 1)).toFixed(0)}
              </div>
            </div>
            <div>
              <span style={{ fontSize: isMobile ? 9 : 11, color: colors.textSecondary }}>Ziyaretçi/Sipariş</span>
              <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 600, color: colors.text, marginTop: 2 }}>
                {((data?.traffic?.total_visitors || 0) / (data?.dashboard?.overview?.total_orders || 1)).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Completion ve User Distribution */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 16 : 24,
        marginBottom: 32
      }}>
        {/* ========== GOAL COMPLETION ========== */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: isMobile ? 20 : 24,
          border: `1px solid ${colors.border}`
        }}>
          <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>
            Goal Completion
          </h2>

          {/* Dönüşüm Oranı */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: isMobile ? 13 : 14, color: colors.text }}>Dönüşüm Oranı</span>
              <span style={{ fontSize: isMobile ? 18 : 20, fontWeight: 'bold', color: colors.text }}>
                %{(data?.dashboard?.overview?.conversion_rate || conversionRate || 0).toFixed(1)}
              </span>
            </div>
            <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: 8 }}>
              Hedef: %5
            </div>
            <div style={{
              width: '100%',
              height: 6,
              backgroundColor: colors.bg,
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(((data?.dashboard?.overview?.conversion_rate || conversionRate || 0) / 5) * 100, 100)}%`,
                height: '100%',
                backgroundColor: '#0ea5e9',
                borderRadius: 3
              }} />
            </div>
            <div style={{ textAlign: 'right', marginTop: 4 }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: '#0ea5e9' }}>
                Hedefin %{Math.min(((data?.dashboard?.overview?.conversion_rate || conversionRate || 0) / 5 * 100).toFixed(0), 100)}'i
              </span>
            </div>
          </div>

          {/* En Popüler Kaynak */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: isMobile ? 13 : 14, color: colors.text }}>En İyi Trafik Kaynağı</span>
              <span style={{ fontSize: isMobile ? 18 : 20, fontWeight: 'bold', color: colors.text }}>
                {topSource?.source === 'organic' ? 'Organik' :
                  topSource?.source === 'social' ? 'Sosyal' :
                    topSource?.source === 'direct' ? 'Direkt' :
                      topSource?.source === 'referral' ? 'Yönlendirme' :
                        topSource?.source || '—'}
              </span>
            </div>
            <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: 8 }}>
              {topSource?.count || 0} ziyaretçi
            </div>
            <div style={{
              width: '100%',
              height: 6,
              backgroundColor: colors.bg,
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(((topSource?.count || 0) / (data?.traffic?.total_visitors || 100)) * 100, 100)}%`,
                height: '100%',
                backgroundColor: '#f59e0b',
                borderRadius: 3
              }} />
            </div>
            <div style={{ textAlign: 'right', marginTop: 4 }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: '#f59e0b' }}>
                Toplam trafiğin %{Math.min((((topSource?.count || 0) / (data?.traffic?.total_visitors || 1)) * 100).toFixed(0), 100)}'i
              </span>
            </div>
          </div>

          {/* Toplam Müşteri */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: isMobile ? 13 : 14, color: colors.text }}>Toplam Müşteri</span>
              <span style={{ fontSize: isMobile ? 18 : 20, fontWeight: 'bold', color: colors.text }}>
                {data?.dashboard?.overview?.total_customers?.toLocaleString() || '0'}
              </span>
            </div>
            <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: 8 }}>
              Hedef: 2000 müşteri
            </div>
            <div style={{
              width: '100%',
              height: 6,
              backgroundColor: colors.bg,
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(((data?.dashboard?.overview?.total_customers || 0) / 2000) * 100, 100)}%`,
                height: '100%',
                backgroundColor: '#10b981',
                borderRadius: 3
              }} />
            </div>
            <div style={{ textAlign: 'right', marginTop: 4 }}>
              <span style={{ fontSize: isMobile ? 10 : 11, color: '#10b981' }}>
                Hedefin %{Math.min(((data?.dashboard?.overview?.total_customers || 0) / 2000 * 100).toFixed(0), 100)}'i
              </span>
            </div>
          </div>

          <a
            onClick={handleViewDetailedReport}
            href="#"
            style={{
              color: '#0ea5e9',
              fontSize: isMobile ? 12 : 13,
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: 8,
              cursor: 'pointer'
            }}>
            Detaylı Raporu Görüntüle →
          </a>
        </div>

        {/* ========== USER DISTRIBUTION BY REGION ========== */}
        <div style={{
  backgroundColor: colors.surface,
  borderRadius: 20,
  padding: isMobile ? 16 : 24,  // Mobilde padding küçültüldü
  border: `1px solid ${colors.border}`,
  boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
}}>
  {/* Header - Mobilde daha kompakt */}
  <div style={{ 
    display: 'flex', 
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between', 
    alignItems: isMobile ? 'flex-start' : 'center', 
    marginBottom: isMobile ? 16 : 24,
    gap: isMobile ? 8 : 0
  }}>
    <div>
      <h2 style={{ 
        fontSize: isMobile ? 16 : 18, 
        fontWeight: 600, 
        color: colors.text, 
        margin: 0 
      }}>
        Bölgelere Göre Dağılım
      </h2>
      <p style={{ 
        fontSize: isMobile ? 11 : 12, 
        color: colors.textSecondary, 
        margin: '4px 0 0 0' 
      }}>
        {data?.dashboard?.regions?.length ? 'Dünya geneli ziyaretçi dağılımı' : 'Henüz veri yok'}
      </p>
    </div>
    
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.bg,
      padding: isMobile ? '4px 10px' : '6px 14px',
      borderRadius: 30,
      border: `1px solid ${colors.border}`,
      alignSelf: isMobile ? 'flex-start' : 'center'
    }}>
      <span style={{ fontSize: isMobile ? 12 : 13, color: colors.textSecondary }}>🌍</span>
      <span style={{ fontSize: isMobile ? 11 : 13, color: colors.textSecondary }}>Dünya Geneli</span>
    </div>
  </div>

  {/* Backend'den gelen veri var mı kontrol et */}
  {data?.dashboard?.regions && data.dashboard.regions.length > 0 ? (
    <>
      {/* Pie Chart - Mobilde daha küçük */}
      <div style={{
        height: isMobile ? 180 : 260,
        marginBottom: isMobile ? 16 : 24,
        backgroundColor: colors.bg,
        borderRadius: 16,
        padding: isMobile ? 4 : 8
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.dashboard.regions}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 40 : 70}
              outerRadius={isMobile ? 65 : 100}
              paddingAngle={2}
              dataKey="percentage"
              nameKey="name"
              labelLine={false}
            >
              {data.dashboard.regions.map((entry, index) => {
                const colors = ['#0ea5e9', '#f59e0b', '#ec4899', '#a855f7', '#10b981', '#14b8a6', '#f43f5e'];
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || colors[index % colors.length]} 
                    stroke={colors.surface}
                    strokeWidth={2}
                  />
                );
              })}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                padding: isMobile ? '6px 10px' : '8px 12px'
              }}
              itemStyle={{ color: colors.text, fontSize: isMobile ? 11 : 12 }}
              formatter={(value: number) => [`%${value}`, 'Dağılım']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bölge istatistikleri grid - Mobilde daha iyi padding */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? 10 : 12
      }}>
        {data.dashboard.regions.map((region, index) => {
          const colors = ['#0ea5e9', '#f59e0b', '#ec4899', '#a855f7', '#10b981', '#14b8a6', '#f43f5e'];
          const regionColor = region.color || colors[index % colors.length];
          
          return (
            <div
              key={region.name}
              style={{
                backgroundColor: colors.bg,
                borderRadius: 12,
                padding: isMobile ? 12 : 14,
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? 8 : 10,
                border: `1px solid ${colors.border}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ 
                  width: isMobile ? 10 : 12, 
                  height: isMobile ? 10 : 12, 
                  backgroundColor: regionColor, 
                  borderRadius: 4 
                }} />
                <span style={{ 
                  fontSize: isMobile ? 12 : 13, 
                  color: colors.text, 
                  fontWeight: 500 
                }}>
                  {region.name}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ 
                  fontSize: isMobile ? 10 : 12, 
                  color: colors.textSecondary 
                }}>
                  Dağılım
                </span>
                <span style={{ 
                  fontSize: isMobile ? 16 : 20, 
                  fontWeight: 700, 
                  color: regionColor 
                }}>
                  %{region.percentage}
                </span>
              </div>
              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: isMobile ? 5 : 6,
                backgroundColor: colors.bg,
                borderRadius: 3,
                overflow: 'hidden',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{
                  width: `${region.percentage}%`,
                  height: '100%',
                  backgroundColor: regionColor,
                  borderRadius: 3,
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  ) : (
    // VERİ YOKSA - Mobil uyumlu placeholder
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: isMobile ? 320 : 400,
      backgroundColor: colors.bg,
      borderRadius: 16,
      gap: isMobile ? 16 : 20,
      padding: isMobile ? 20 : 32,
      border: `2px dashed ${colors.border}`
    }}>
      {/* Dünya ikonu - Mobilde daha küçük */}
      <div style={{
        width: isMobile ? 70 : 100,
        height: isMobile ? 70 : 100,
        backgroundColor: 'rgba(14,165,233,0.08)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'pulse 2s infinite'
      }}>
        <span style={{ fontSize: isMobile ? 36 : 48 }}>🌍</span>
      </div>
      
      <h3 style={{ 
        fontSize: isMobile ? 16 : 20, 
        color: colors.text, 
        margin: 0, 
        fontWeight: 600,
        textAlign: 'center'
      }}>
        Bölgesel veri bulunamadı
      </h3>
      
      <p style={{ 
        fontSize: isMobile ? 12 : 14, 
        color: colors.textSecondary, 
        textAlign: 'center',
        maxWidth: 320,
        margin: 0,
        lineHeight: 1.6,
        padding: isMobile ? '0 8px' : 0
      }}>
        Henüz farklı bölgelerden yeterli ziyaretçi verisi yok. 
        Ziyaretçiler geldikçe burada dünya dağılımı görünecek.
      </p>

      {/* Kıta bayrakları - Mobilde daha iyi sarma */}
      <div style={{
        display: 'flex',
        gap: isMobile ? 8 : 12,
        marginTop: isMobile ? 4 : 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: isMobile ? '0 8px' : 0
      }}>
        {['🇺🇸', '🇪🇺', '🇯🇵', '🇧🇷', '🇿🇦', '🇦🇺'].map((flag, i) => (
          <div
            key={i}
            style={{
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              backgroundColor: colors.surface,
              borderRadius: isMobile ? 10 : 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? 20 : 24,
              border: `1px solid ${colors.border}`,
              opacity: 0.6
            }}
          >
            {flag}
          </div>
        ))}
      </div>

      {/* Bekleme mesajı badge - Mobilde daha kompakt */}
      <div style={{
        marginTop: isMobile ? 12 : 16,
        padding: isMobile ? '8px 16px' : '10px 20px',
        backgroundColor: colors.surface,
        borderRadius: 40,
        fontSize: isMobile ? 11 : 12,
        color: colors.textSecondary,
        border: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 6 : 8
      }}>
        <span style={{ fontSize: isMobile ? 14 : 16 }}>⏳</span>
        <span>Ziyaretçiler geldikçe otomatik doldurulacak</span>
      </div>
    </div>
  )}
</div>
      </div>

      {/* Top Performing Pages */}
      <div style={{
  backgroundColor: colors.surface,
  borderRadius: 20,
  border: `1px solid ${colors.border}`,
  overflow: 'hidden',
  boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
}}>
  {/* Header */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '16px 20px' : '20px 24px',
    flexWrap: 'wrap',
    gap: 12,
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.bg
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 44,
        height: 44,
        backgroundColor: 'rgba(14,165,233,0.1)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: 24 }}>bar_chart</span>
      </div>
      <div>
        <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, margin: 0 }}>
          En Çok Ziyaret Edilen Sayfalar
        </h2>
        <p style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, margin: '4px 0 0 0' }}>
          {data?.dashboard?.top_pages?.length ? `${data.dashboard.top_pages.length} sayfa performansı` : 'Henüz veri yok'}
        </p>
      </div>
    </div>
  </div>

  {/* VERİ VARSA Tablo Göster */}
  {data?.dashboard?.top_pages && data.dashboard.top_pages.length > 0 ? (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '700px' : '100%' }}>
        <thead>
          <tr style={{
            backgroundColor: colors.bg,
            fontSize: isMobile ? 11 : 12,
            color: colors.textSecondary,
            textAlign: 'left',
            borderBottom: `2px solid ${colors.border}`
          }}>
            <th style={{ padding: isMobile ? '12px 16px' : '14px 24px', fontWeight: 600 }}>SAYFA YOLU</th>
            <th style={{ padding: isMobile ? '12px 16px' : '14px 24px', fontWeight: 600, textAlign: 'right' }}>GÖRÜNTÜLENME</th>
            <th style={{ padding: isMobile ? '12px 16px' : '14px 24px', fontWeight: 600, textAlign: 'right' }}>TEKİL ZİYARETÇİ</th>
            <th style={{ padding: isMobile ? '12px 16px' : '14px 24px', fontWeight: 600, textAlign: 'right' }}>HEMEN ÇIKMA</th>
            <th style={{ padding: isMobile ? '12px 16px' : '14px 24px', fontWeight: 600, textAlign: 'right' }}>ÇIKIŞ %</th>
            <th style={{ padding: isMobile ? '12px 16px' : '14px 24px', fontWeight: 600, textAlign: 'center' }}>TREND</th>
          </tr>
        </thead>
        <tbody>
          {data.dashboard.top_pages.map((page, index) => (
            <tr 
              key={index} 
              style={{ 
                borderBottom: `1px solid ${colors.border}`,
                transition: 'all 0.2s',
                cursor: 'pointer',
                backgroundColor: index % 2 === 0 ? 'transparent' : colors.bg
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : colors.bg}
            >
              <td style={{ 
                padding: isMobile ? '14px 16px' : '16px 24px', 
                color: colors.text, 
                fontSize: isMobile ? 12 : 13,
                fontWeight: 500
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ 
                    width: 8, 
                    height: 8, 
                    backgroundColor: page.trend === 'up' ? '#10b981' : '#ef4444', 
                    borderRadius: '50%',
                    display: 'inline-block',
                    boxShadow: `0 0 0 2px ${page.trend === 'up' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                  }} />
                  <span style={{ 
                    maxWidth: isMobile ? 150 : 280,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontFamily: 'monospace',
                    fontSize: isMobile ? 11 : 13
                  }}>
                    {page.path}
                  </span>
                </div>
              </td>
              <td style={{ 
                padding: isMobile ? '14px 16px' : '16px 24px', 
                color: colors.text, 
                fontSize: isMobile ? 12 : 13, 
                textAlign: 'right',
                fontWeight: 600
              }}>
                {page.views.toLocaleString()}
              </td>
              <td style={{ 
                padding: isMobile ? '14px 16px' : '16px 24px', 
                color: colors.text, 
                fontSize: isMobile ? 12 : 13, 
                textAlign: 'right' 
              }}>
                {page.unique_visitors.toLocaleString()}
              </td>
              <td style={{ 
                padding: isMobile ? '14px 16px' : '16px 24px', 
                color: page.bounce_rate < 40 ? '#10b981' : '#ef4444', 
                fontSize: isMobile ? 12 : 13, 
                textAlign: 'right',
                fontWeight: 700
              }}>
                %{page.bounce_rate}
              </td>
              <td style={{ 
                padding: isMobile ? '14px 16px' : '16px 24px', 
                color: colors.text, 
                fontSize: isMobile ? 12 : 13, 
                textAlign: 'right' 
              }}>
                %{page.exit_rate}
              </td>
              <td style={{ 
                padding: isMobile ? '14px 16px' : '16px 24px', 
                textAlign: 'center' 
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  backgroundColor: page.trend === 'up' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  borderRadius: 10,
                  border: `1px solid ${page.trend === 'up' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                }}>
                  <span style={{ 
                    color: page.trend === 'up' ? '#10b981' : '#ef4444', 
                    fontSize: isMobile ? 16 : 18,
                    fontWeight: 600
                  }}>
                    {page.trend === 'up' ? '↑' : '↓'}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer - Sayfa bilgisi */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '12px 20px' : '16px 24px',
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        fontSize: isMobile ? 11 : 12,
        color: colors.textSecondary
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 0 2px rgba(16,185,129,0.2)' }} />
            <span>Yükselen</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, backgroundColor: '#ef4444', borderRadius: '50%', boxShadow: '0 0 0 2px rgba(239,68,68,0.2)' }} />
            <span>Düşen</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="material-icons-round" style={{ fontSize: 14, color: colors.textSecondary }}>schedule</span>
          {new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  ) : (
    /* VERİ YOKSA - Şık Empty State */
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? 48 : 64,
      backgroundColor: colors.bg,
      gap: 24
    }}>
      {/* Animasyonlu ikon */}
      <div style={{
        width: 100,
        height: 100,
        backgroundColor: 'rgba(14,165,233,0.05)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'float 3s ease-in-out infinite',
        border: `2px dashed ${colors.border}`
      }}>
        <span className="material-icons-round" style={{ fontSize: 48, color: colors.textSecondary, opacity: 0.7 }}>
          bar_chart
        </span>
      </div>

      {/* Ana mesaj */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: isMobile ? 18 : 20, color: colors.text, margin: '0 0 8px 0', fontWeight: 600 }}>
          Sayfa Görüntülenme Verisi Yok
        </h3>
        <p style={{ 
          fontSize: isMobile ? 13 : 14, 
          color: colors.textSecondary, 
          maxWidth: 400,
          margin: 0,
          lineHeight: 1.6
        }}>
          Henüz hiç sayfa görüntülenmesi gerçekleşmemiş. 
          Ziyaretçiler geldiğinde en çok ziyaret edilen sayfalar burada listelenecek.
        </p>
      </div>

      {/* İstatistik kutuları (örnek gösterim) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16,
        width: '100%',
        maxWidth: 400,
        marginTop: 8
      }}>
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              border: `1px solid ${colors.border}`,
              opacity: 0.6
            }}
          >
            <div style={{
              width: '100%',
              height: 20,
              backgroundColor: colors.bg,
              borderRadius: 4,
              marginBottom: 8,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '60%',
                height: '100%',
                background: `linear-gradient(90deg, ${colors.border} 0%, ${colors.surface} 100%)`,
                animation: 'shimmer 1.5s infinite'
              }} />
            </div>
            <div style={{
              width: '80%',
              height: 16,
              backgroundColor: colors.bg,
              borderRadius: 4,
              marginBottom: 6
            }} />
            <div style={{
              width: '40%',
              height: 12,
              backgroundColor: colors.bg,
              borderRadius: 4
            }} />
          </div>
        ))}
      </div>

      {/* Bekleme mesajı */}
      <div style={{
        marginTop: 16,
        padding: '12px 24px',
        backgroundColor: colors.surface,
        borderRadius: 40,
        fontSize: 13,
        color: colors.textSecondary,
        border: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <span className="material-icons-round" style={{ fontSize: 18, color: '#0ea5e9' }}>hourglass_empty</span>
        <span>İlk ziyaretçinizi bekliyoruz</span>
      </div>
    </div>
  )}
</div>

{/* CSS Animasyonları */}
<style>{`
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`}</style>
    </div>
  );
};

export default AnalyticsPage;