import React from "react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useFullAnalytics,
  useGrowthPercentage,
  useConversionRate,
  useTopTrafficSource
} from '../server/Gin/analytics.hooks';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

interface AnalyticsDetailProps {
  colors?: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

const AnalyticsDetail = ({ colors }: AnalyticsDetailProps) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // State'ler
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '12m' | '24m'>('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [compareWith, setCompareWith] = useState<'previous' | 'lastYear'>('previous');
  
  // Responsive kontrol
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Veriler
  const { data, isLoading } = useFullAnalytics(selectedPeriod);
  const conversionRate = useConversionRate(selectedPeriod);
  const topSource = useTopTrafficSource(selectedPeriod);
  const growth = useGrowthPercentage(selectedPeriod, '7d');

  // NaN kontrolü için güvenli sayı fonksiyonu
  const safeNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Yüzde formatla
  const formatPercentage = (value: any): string => {
    const num = safeNumber(value);
    return num > 0 ? num.toFixed(1) : '0.0';
  };

  const defaultColors = {
    bg: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    text: '#f8fafc',
    textSecondary: '#94a3b8'
  };
  
  const theme = colors || defaultColors;

  const handlePeriodChange = (period: '7d' | '30d' | '90d' | '12m' | '24m') => {
    setSelectedPeriod(period);
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.bg
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 60,
            height: 60,
            border: `3px solid ${theme.border}`,
            borderTopColor: '#0ea5e9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: 20
          }} />
          <div style={{ color: theme.text }}>Detaylı analiz verileri yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: theme.bg,
      padding: isMobile ? 16 : 32
    }}>
      {/* ========== HEADER ========== */}
      <div style={{ marginBottom: isMobile ? 20 : 32 }}>
        {/* Geri Butonu ve Başlık */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          marginBottom: isMobile ? 12 : 16 
        }}>
          <button
            onClick={() => navigate('/admin/analytics')}
            style={{
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: isMobile ? 10 : 12,
              color: theme.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? 18 : 20
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ 
              fontSize: isMobile ? 20 : 28, 
              fontWeight: 600, 
              color: theme.text, 
              margin: 0 
            }}>
              Detaylı Analiz
            </h1>
            <p style={{ 
              fontSize: isMobile ? 12 : 14, 
              color: theme.textSecondary, 
              marginTop: 4 
            }}>
              {selectedPeriod === '7d' && 'Son 7 gün'}
              {selectedPeriod === '30d' && 'Son 30 gün'}
              {selectedPeriod === '90d' && 'Son 90 gün'}
              {selectedPeriod === '12m' && 'Son 12 ay'}
              {selectedPeriod === '24m' && 'Son 24 ay'}
            </p>
          </div>
        </div>

        {/* Period ve Karşılaştırma - Mobilde Alt Alta */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 10 : 16
        }}>
          {/* Period Butonları - Yatay Kaydırmalı */}
          <div style={{
            overflowX: 'auto',
            paddingBottom: isMobile ? 4 : 0,
            WebkitOverflowScrolling: 'touch'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: 6, 
              backgroundColor: theme.surface, 
              padding: 4, 
              borderRadius: 12,
              width: 'fit-content'
            }}>
              {['7d', '30d', '90d', '12m', '24m'].map(p => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p as any)}
                  style={{
                    padding: isMobile ? '6px 14px' : '8px 16px',
                    backgroundColor: selectedPeriod === p ? '#0ea5e9' : 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    color: selectedPeriod === p ? 'white' : theme.textSecondary,
                    fontSize: isMobile ? 12 : 13,
                    fontWeight: selectedPeriod === p ? 500 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Karşılaştırma Butonları */}
          <div style={{ 
            display: 'flex', 
            gap: 8,
            width: isMobile ? '100%' : 'auto'
          }}>
            <button
              onClick={() => setCompareWith('previous')}
              style={{
                flex: isMobile ? 1 : 'none',
                padding: isMobile ? '8px 0' : '8px 16px',
                backgroundColor: compareWith === 'previous' ? '#0ea5e9' : theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 30,
                color: compareWith === 'previous' ? 'white' : theme.text,
                fontSize: isMobile ? 12 : 13,
                cursor: 'pointer'
              }}
            >
              Önceki Dönem
            </button>
            <button
              onClick={() => setCompareWith('lastYear')}
              style={{
                flex: isMobile ? 1 : 'none',
                padding: isMobile ? '8px 0' : '8px 16px',
                backgroundColor: compareWith === 'lastYear' ? '#0ea5e9' : theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 30,
                color: compareWith === 'lastYear' ? 'white' : theme.text,
                fontSize: isMobile ? 12 : 13,
                cursor: 'pointer'
              }}
            >
              Geçen Yıl
            </button>
          </div>
        </div>
      </div>

      {/* ========== 4'LÜ KARTLAR - MOBİLDE 2x2 ========== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 10 : 20,
        marginBottom: isMobile ? 20 : 32
      }}>
        {[
          { 
            label: 'Toplam Gelir', 
            value: `₺${safeNumber(data?.dashboard?.overview?.total_revenue).toLocaleString()}`, 
            change: safeNumber(growth?.revenue), 
            icon: '💰', 
            color: '#10b981' 
          },
          { 
            label: 'Toplam Sipariş', 
            value: safeNumber(data?.dashboard?.overview?.total_orders).toLocaleString(), 
            change: safeNumber(growth?.orders), 
            icon: '📦', 
            color: '#0ea5e9' 
          },
          { 
            label: 'Toplam Müşteri', 
            value: safeNumber(data?.dashboard?.overview?.total_customers).toLocaleString(), 
            change: safeNumber(growth?.customers), 
            icon: '👥', 
            color: '#a855f7' 
          },
          { 
            label: 'Dönüşüm Oranı', 
            value: `%${formatPercentage(conversionRate)}`, 
            change: 0, 
            icon: '📈', 
            color: '#f59e0b' 
          }
        ].map((item, i) => (
          <div key={i} style={{
            backgroundColor: theme.surface,
            borderRadius: isMobile ? 14 : 16,
            padding: isMobile ? 14 : 20,
            border: `1px solid ${theme.border}`
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: isMobile ? 8 : 12 
            }}>
              <div style={{
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                backgroundColor: `${item.color}10`,
                borderRadius: isMobile ? 8 : 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: isMobile ? 16 : 20 }}>{item.icon}</span>
              </div>
              {item.change > 0 && (
                <span style={{
                  color: item.change > 0 ? '#10b981' : '#ef4444',
                  fontSize: isMobile ? 10 : 13,
                  fontWeight: 500,
                  backgroundColor: item.change > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  padding: isMobile ? '2px 6px' : '4px 8px',
                  borderRadius: 20
                }}>
                  {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                </span>
              )}
            </div>
            <div style={{ 
              fontSize: isMobile ? 10 : 13, 
              color: theme.textSecondary, 
              marginBottom: isMobile ? 2 : 4 
            }}>
              {item.label}
            </div>
            <div style={{ 
              fontSize: isMobile ? 16 : 24, 
              fontWeight: 'bold', 
              color: theme.text 
            }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* ========== ZAMAN İÇİNDE PERFORMANS - GELİŞTİRİLMİŞ ========== */}
      <div style={{
        backgroundColor: theme.surface,
        borderRadius: isMobile ? 16 : 20,
        padding: isMobile ? 16 : 24,
        border: `1px solid ${theme.border}`,
        marginBottom: isMobile ? 16 : 32
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          gap: isMobile ? 12 : 0,
          marginBottom: isMobile ? 12 : 20 
        }}>
          <div>
            <h2 style={{ 
              fontSize: isMobile ? 16 : 18, 
              fontWeight: 600, 
              color: theme.text, 
              margin: '0 0 4px 0' 
            }}>
              Zaman İçinde Performans
            </h2>
            <p style={{ 
              fontSize: isMobile ? 11 : 13, 
              color: theme.textSecondary, 
              margin: 0 
            }}>
              {selectedPeriod === '7d' && 'Günlük'}
              {selectedPeriod === '30d' && 'Günlük'}
              {selectedPeriod === '90d' && 'Haftalık'}
              {selectedPeriod === '12m' && 'Aylık'}
              {selectedPeriod === '24m' && 'Aylık'} veriler
            </p>
          </div>
          
          {/* Metrik Seçici - Mobilde Yatay Kaydırma */}
          <div style={{
            overflowX: 'auto',
            width: '100%',
            paddingBottom: 4
          }}>
            <div style={{ 
              display: 'flex', 
              gap: 6,
              width: 'fit-content'
            }}>
              {['revenue', 'orders', 'visitors'].map(metric => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  style={{
                    padding: isMobile ? '6px 12px' : '6px 12px',
                    backgroundColor: selectedMetric === metric ? '#0ea5e9' : 'transparent',
                    border: `1px solid ${selectedMetric === metric ? '#0ea5e9' : theme.border}`,
                    borderRadius: 20,
                    color: selectedMetric === metric ? 'white' : theme.textSecondary,
                    fontSize: isMobile ? 11 : 12,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {metric === 'revenue' && '💰 Gelir'}
                  {metric === 'orders' && '📦 Sipariş'}
                  {metric === 'visitors' && '👥 Ziyaretçi'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grafik */}
        <div style={{ height: isMobile ? 200 : 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.dashboard?.sales_by_day || []}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={theme.border} strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: theme.textSecondary, fontSize: isMobile ? 10 : 12 }}
                tickFormatter={(value) => {
                  if (!value) return '';
                  const date = new Date(value);
                  return isMobile ? `${date.getDate()}` : `${date.getDate()}/${date.getMonth()+1}`;
                }}
              />
              <YAxis tick={{ fill: theme.textSecondary, fontSize: isMobile ? 10 : 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                  fontSize: isMobile ? 11 : 12
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ========== DETAYLI METRİKLER - MOBİLDE ALT ALTA ========== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? 12 : 24,
        marginBottom: isMobile ? 12 : 32
      }}>
        {/* Trafik Kaynakları */}
        <div style={{
          backgroundColor: theme.surface,
          borderRadius: isMobile ? 16 : 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${theme.border}`
        }}>
          <h2 style={{ 
            fontSize: isMobile ? 16 : 18, 
            fontWeight: 600, 
            color: theme.text, 
            margin: '0 0 16px 0' 
          }}>
            Trafik Kaynakları
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data?.traffic?.sources && Object.entries(data.traffic.sources).length > 0 ? (
              Object.entries(data.traffic.sources).map(([source, count]: any, index) => {
                const colors = ['#0ea5e9', '#f59e0b', '#a855f7', '#10b981'];
                const total = data.traffic.total_visitors || 1;
                const percentage = total > 0 ? (safeNumber(count) / total * 100).toFixed(1) : '0.0';
                
                return (
                  <div key={source}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: 4,
                      fontSize: isMobile ? 12 : 13
                    }}>
                      <span style={{ color: theme.text }}>
                        {source === 'organic' ? 'Organik' : 
                         source === 'social' ? 'Sosyal' : 
                         source === 'direct' ? 'Direkt' : 
                         source === 'referral' ? 'Yönlendirme' : source}
                      </span>
                      <span style={{ color: theme.text, fontWeight: 600 }}>%{percentage}</span>
                    </div>
                    <div style={{ width: '100%', height: 6, backgroundColor: theme.bg, borderRadius: 3 }}>
                      <div style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        backgroundColor: colors[index % 4], 
                        borderRadius: 3 
                      }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: 20, color: theme.textSecondary }}>
                Trafik verisi bulunamadı
              </div>
            )}
          </div>
        </div>

        {/* Cihaz Dağılımı */}
        <div style={{
          backgroundColor: theme.surface,
          borderRadius: isMobile ? 16 : 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${theme.border}`
        }}>
          <h2 style={{ 
            fontSize: isMobile ? 16 : 18, 
            fontWeight: 600, 
            color: theme.text, 
            margin: '0 0 16px 0' 
          }}>
            Cihaz Dağılımı
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: isMobile ? 8 : 12 
          }}>
            {data?.traffic?.devices && Object.entries(data.traffic.devices).length > 0 ? (
              Object.entries(data.traffic.devices).map(([device, count]: any) => {
                const icons: any = { mobile: '📱', desktop: '💻', tablet: '📟' };
                const total = data.traffic.total_visitors || 1;
                const percentage = total > 0 ? (safeNumber(count) / total * 100).toFixed(1) : '0.0';
                
                return (
                  <div key={device} style={{ 
                    textAlign: 'center', 
                    padding: isMobile ? 10 : 12, 
                    backgroundColor: theme.bg, 
                    borderRadius: 12 
                  }}>
                    <div style={{ fontSize: isMobile ? 22 : 24, marginBottom: 6 }}>{icons[device] || '📱'}</div>
                    <div style={{ 
                      fontSize: isMobile ? 16 : 18, 
                      fontWeight: 'bold', 
                      color: theme.text 
                    }}>
                      %{percentage}
                    </div>
                    <div style={{ 
                      fontSize: isMobile ? 10 : 11, 
                      color: theme.textSecondary, 
                      marginTop: 4,
                      textTransform: 'capitalize' 
                    }}>
                      {device === 'mobile' ? 'Mobil' : device === 'desktop' ? 'Masaüstü' : 'Tablet'}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 20, color: theme.textSecondary }}>
                Cihaz verisi bulunamadı
              </div>
            )}
          </div>
        </div>

        {/* En Popüler Ürünler */}
        <div style={{
          backgroundColor: theme.surface,
          borderRadius: isMobile ? 16 : 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${theme.border}`
        }}>
          <h2 style={{ 
            fontSize: isMobile ? 16 : 18, 
            fontWeight: 600, 
            color: theme.text, 
            margin: '0 0 16px 0' 
          }}>
            En Popüler Ürünler
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data?.dashboard?.top_products && data.dashboard.top_products.length > 0 ? (
              data.dashboard.top_products.slice(0, 5).map((product: any, i: number) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  padding: isMobile ? 8 : 8, 
                  backgroundColor: theme.bg, 
                  borderRadius: 12 
                }}>
                  <div style={{ fontSize: isMobile ? 22 : 24 }}>{product.image || '📦'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: isMobile ? 12 : 13, 
                      color: theme.text, 
                      fontWeight: 500, 
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: isMobile ? 120 : 200
                    }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: isMobile ? 10 : 11, color: theme.textSecondary }}>
                      {safeNumber(product.sales)} satış
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: isMobile ? 14 : 16, 
                    fontWeight: 'bold', 
                    color: '#10b981' 
                  }}>
                    ₺{safeNumber(product.revenue).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: 20, color: theme.textSecondary }}>
                Ürün verisi bulunamadı
              </div>
            )}
          </div>
        </div>

        {/* SEO & Sıralama */}
        <div style={{
          backgroundColor: theme.surface,
          borderRadius: isMobile ? 16 : 20,
          padding: isMobile ? 16 : 24,
          border: `1px solid ${theme.border}`
        }}>
          <h2 style={{ 
            fontSize: isMobile ? 16 : 18, 
            fontWeight: 600, 
            color: theme.text, 
            margin: '0 0 16px 0' 
          }}>
            SEO & Sıralama
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: isMobile ? 10 : 16 
          }}>
            <div style={{ 
              textAlign: 'center', 
              padding: isMobile ? 12 : 16, 
              backgroundColor: theme.bg, 
              borderRadius: 12 
            }}>
              <div style={{ fontSize: isMobile ? 11 : 13, color: theme.textSecondary, marginBottom: 4 }}>
                Dünya Sırası
              </div>
              <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 'bold', color: theme.text }}>
                #{safeNumber(data?.ranking?.world_rank)}
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: isMobile ? 12 : 16, 
              backgroundColor: theme.bg, 
              borderRadius: 12 
            }}>
              <div style={{ fontSize: isMobile ? 11 : 13, color: theme.textSecondary, marginBottom: 4 }}>
                Ülke Sırası (TR)
              </div>
              <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 'bold', color: theme.text }}>
                #{safeNumber(data?.ranking?.country_rank)}
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: isMobile ? 12 : 16, 
              backgroundColor: theme.bg, 
              borderRadius: 12 
            }}>
              <div style={{ fontSize: isMobile ? 11 : 13, color: theme.textSecondary, marginBottom: 4 }}>
                Kategori Sırası
              </div>
              <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 'bold', color: theme.text }}>
                #{safeNumber(data?.ranking?.category_rank)}
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: isMobile ? 12 : 16, 
              backgroundColor: theme.bg, 
              borderRadius: 12 
            }}>
              <div style={{ fontSize: isMobile ? 11 : 13, color: theme.textSecondary, marginBottom: 4 }}>
                Top %
              </div>
              <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 'bold', color: '#10b981' }}>
                {formatPercentage(data?.ranking?.top_percent)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== SAATLİK AKTİVİTE ========== */}
      <div style={{
        backgroundColor: theme.surface,
        borderRadius: isMobile ? 16 : 20,
        padding: isMobile ? 16 : 24,
        border: `1px solid ${theme.border}`
      }}>
        <h2 style={{ 
          fontSize: isMobile ? 16 : 18, 
          fontWeight: 600, 
          color: theme.text, 
          margin: '0 0 16px 0' 
        }}>
          Saatlik Aktivite
        </h2>
        <div style={{ 
          height: isMobile ? 150 : 200, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: theme.bg,
          borderRadius: 12
        }}>
          <div style={{ textAlign: 'center', color: theme.textSecondary }}>
            <div style={{ fontSize: isMobile ? 40 : 48, marginBottom: isMobile ? 8 : 16 }}>⏰</div>
            <div style={{ fontSize: isMobile ? 14 : 16, marginBottom: isMobile ? 4 : 8 }}>
              Henüz saatlik aktivite verisi yok
            </div>
            <div style={{ fontSize: isMobile ? 11 : 13 }}>
              Ziyaretçiler geldikçe görünecek
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDetail;