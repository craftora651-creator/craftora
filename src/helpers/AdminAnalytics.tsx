// pages/Analytics.tsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, LineChart
} from 'recharts';
import {
  MdShoppingCart,
  MdPeople,
  MdAttachMoney,
  MdPublic,
  MdTimer,
  MdRefresh,
  MdArrowUpward,
  MdArrowDownward,
  MdLocationOn,
  MdAccessTime,
  MdVisibility,
  MdMouse,
  MdExitToApp,
  MdTimeline,
  MdTune,
  MdInsights,
  MdAnalytics,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';
import {
  fetchAllAnalytics,
  selectDashboard,
  selectAnalyticsLoading,
  selectAnalyticsSummary,
  selectSourceDistribution,
  selectDeviceDistribution,
  selectTopProducts,
  selectRanking,
  selectTrafficSources
} from '../redux/analyticsSlice';
import { useAppDispatch } from '../redux/store';

type ViewType = 'overview' | 'visitors' | 'ranking' | 'charts';

// Örnek veri (API'den gelene kadar)
const performanceData = [
  { month: 'Oca', sales: 4000, tui: 2400, arpu: 2400, conversion: 2.4 },
  { month: 'Şub', sales: 3000, tui: 1398, arpu: 2210, conversion: 3.2 },
  { month: 'Mar', sales: 5000, tui: 3800, arpu: 2290, conversion: 2.8 },
  { month: 'Nis', sales: 4780, tui: 3908, arpu: 2000, conversion: 3.5 },
  { month: 'May', sales: 5890, tui: 4800, arpu: 2181, conversion: 3.0 },
  { month: 'Haz', sales: 6390, tui: 3800, arpu: 2500, conversion: 3.8 },
  { month: 'Tem', sales: 7490, tui: 4300, arpu: 2100, conversion: 4.2 },
];

const Analytics: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedView, setSelectedView] = useState<ViewType>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedChart, setExpandedChart] = useState<string | null>('performance');

  // Redux verileri
  const dashboard = useSelector(selectDashboard);
  const loading = useSelector(selectAnalyticsLoading);
  const summary = useSelector(selectAnalyticsSummary);
  const sources = useSelector(selectSourceDistribution);
  const devices = useSelector(selectDeviceDistribution);
  const topProducts = useSelector(selectTopProducts);
  const ranking = useSelector(selectRanking);
  const trafficSources = useSelector(selectTrafficSources);

  const toggleChart = (chartName: string) => {
    setExpandedChart(expandedChart === chartName ? null : chartName);
  };

  // Verileri yenile
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(fetchAllAnalytics(selectedPeriod));
    setIsRefreshing(false);
  };

  // Period değişince verileri güncelle
  useEffect(() => {
    dispatch(fetchAllAnalytics(selectedPeriod));
  }, [selectedPeriod, dispatch]);

  // Renk paleti
  const COLORS = {
    primary: '#6366f1',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    purple: '#a855f7',
    pink: '#ec4899',
    cyan: '#06b6d4',
    orange: '#f97316',
    craftora: '#8b5cf6',
    instagram: '#e1306c',
    tiktok: '#000000',
    google: '#4285f4',
    facebook: '#1877f2',
    twitter: '#1da1f2',
    direct: '#64748b'
  };

  if (loading.dashboard) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Analytics yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>
            <MdAnalytics className="header-icon" />
            Analytics Dashboard
          </h1>
          <div className="live-badge">
            <span className="live-dot"></span>
            Canlı Veri
          </div>
        </div>
        
        <div className="header-right">
          <div className="period-selector">
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as any)}>
              <option value="7d">Son 7 Gün</option>
              <option value="30d">Son 30 Gün</option>
              <option value="90d">Son 90 Gün</option>
              <option value="1y">Son 1 Yıl</option>
            </select>
          </div>
          
          <button 
            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`} 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <MdRefresh className={isRefreshing ? 'spin' : ''} />
            {isRefreshing ? 'Yenileniyor...' : 'Yenile'}
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="view-tabs">
        <button 
          className={`tab-btn ${selectedView === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedView('overview')}
        >
          <MdInsights />
          Genel Bakış
        </button>
        <button 
          className={`tab-btn ${selectedView === 'visitors' ? 'active' : ''}`}
          onClick={() => setSelectedView('visitors')}
        >
          <MdPeople />
          Ziyaretçi Analizi
        </button>
        <button 
          className={`tab-btn ${selectedView === 'ranking' ? 'active' : ''}`}
          onClick={() => setSelectedView('ranking')}
        >
          <MdTimeline />
          Sıralamalar
        </button>
        <button 
          className={`tab-btn ${selectedView === 'charts' ? 'active' : ''}`}
          onClick={() => setSelectedView('charts')}
        >
          <MdInsights />
          Charts
        </button>
      </div>

      {/* GENEL BAKIŞ VIEW */}
      {selectedView === 'overview' && (
        <div className="overview-view">
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card primary">
              <div className="kpi-icon">
                <MdAttachMoney size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Toplam Gelir</span>
                <div className="kpi-value-wrapper">
                  <span className="kpi-value">${summary?.revenue?.toLocaleString() || '0'}</span>
                  <span className="kpi-trend positive">
                    <MdArrowUpward /> %12.5
                  </span>
                </div>
                <span className="kpi-period">Geçen aya göre</span>
              </div>
            </div>

            <div className="kpi-card success">
              <div className="kpi-icon">
                <MdShoppingCart size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Toplam Sipariş</span>
                <div className="kpi-value-wrapper">
                  <span className="kpi-value">{summary?.orders || 0}</span>
                  <span className="kpi-trend positive">
                    <MdArrowUpward /> %8.2
                  </span>
                </div>
                <span className="kpi-period">+24 sipariş</span>
              </div>
            </div>

            <div className="kpi-card warning">
              <div className="kpi-icon">
                <MdPeople size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Müşteri Sayısı</span>
                <div className="kpi-value-wrapper">
                  <span className="kpi-value">{summary?.customers || 0}</span>
                  <span className="kpi-trend positive">
                    <MdArrowUpward /> %5.3
                  </span>
                </div>
                <span className="kpi-period">+12 yeni müşteri</span>
              </div>
            </div>

            <div className="kpi-card info">
              <div className="kpi-icon">
                <MdTimer size={24} />
              </div>
              <div className="kpi-content">
                <span className="kpi-label">Dönüşüm Oranı</span>
                <div className="kpi-value-wrapper">
                  <span className="kpi-value">%{summary?.conversion?.toFixed(1) || '0'}</span>
                  <span className="kpi-trend negative">
                    <MdArrowDownward /> %2.1
                  </span>
                </div>
                <span className="kpi-period">Sektör ort: %3.2</span>
              </div>
            </div>
          </div>

          {/* Performance Over Time Chart */}
          <div className="craftora-chart-container">
            <div className="craftora-chart-header" onClick={() => toggleChart('performance')}>
              <div>
                <h3 className="craftora-chart-title">Performance Over Time</h3>
                <p className="craftora-chart-subtitle">Comparing activations over conversion.</p>
              </div>
              <button className="craftora-chart-toggle">
                {expandedChart === 'performance' ? <MdExpandLess /> : <MdExpandMore />}
              </button>
            </div>
            
            {expandedChart === 'performance' && (
              <div className="craftora-chart-body">
                <div className="craftora-metrics-row">
                  <span className="craftora-metric-item active">Sales</span>
                  <span className="craftora-metric-item">TUI</span>
                  <span className="craftora-metric-item">ARPU</span>
                  <span className="craftora-metric-item">Conversion</span>
                </div>
                
                <div className="craftora-chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3a" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ background: '#1e1e2f', border: '1px solid #3b82f6' }}
                      />
                      <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="tui" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="arpu" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="conversion" stroke="#f59e0b" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="craftora-legend-row">
                  <span className="craftora-legend-dot primary"></span>
                  <span className="craftora-legend-text">Revenue</span>
                  <span className="craftora-legend-dot warning"></span>
                  <span className="craftora-legend-text">Conversion</span>
                </div>
              </div>
            )}
          </div>

          {/* User Activity Chart */}
          <div className="craftora-chart-container">
            <div className="craftora-chart-header" onClick={() => toggleChart('activity')}>
              <h3 className="craftora-chart-title">User Activity by Time</h3>
              <button className="craftora-chart-toggle">
                {expandedChart === 'activity' ? <MdExpandLess /> : <MdExpandMore />}
              </button>
            </div>
            
            {expandedChart === 'activity' && (
              <div className="craftora-chart-body">
                <div className="craftora-activity-grid">
                  <div className="craftora-activity-card">
                    <div className="craftora-activity-value">82%</div>
                    <div className="craftora-activity-label">Morning</div>
                  </div>
                  <div className="craftora-activity-card">
                    <div className="craftora-activity-value">10%</div>
                    <div className="craftora-activity-label">Afternoon</div>
                  </div>
                  <div className="craftora-activity-card">
                    <div className="craftora-activity-value">8%</div>
                    <div className="craftora-activity-label">Night</div>
                  </div>
                  <div className="craftora-activity-card">
                    <div className="craftora-activity-value">6%</div>
                    <div className="craftora-activity-label">Evening</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Regions Chart */}
          <div className="craftora-chart-container">
            <div className="craftora-chart-header" onClick={() => toggleChart('regions')}>
              <div>
                <h3 className="craftora-chart-title">Top Performing Regions</h3>
              </div>
              <div className="craftora-header-right">
                <button className="craftora-view-btn">View All</button>
                <button className="craftora-chart-toggle">
                  {expandedChart === 'regions' ? <MdExpandLess /> : <MdExpandMore />}
                </button>
              </div>
            </div>
            
            {expandedChart === 'regions' && (
              <div className="craftora-chart-body">
                <div className="craftora-regions-list">
                  <div className="craftora-region-item">
                    <span className="craftora-region-name">North America</span>
                    <span className="craftora-region-value">42.5K</span>
                  </div>
                  <div className="craftora-region-item">
                    <span className="craftora-region-name">Europe</span>
                    <span className="craftora-region-value">28.1K</span>
                  </div>
                  <div className="craftora-region-item">
                    <span className="craftora-region-name">Asia</span>
                    <span className="craftora-region-value">15.3K</span>
                  </div>
                  <div className="craftora-region-item">
                    <span className="craftora-region-name">Others</span>
                    <span className="craftora-region-value">14.1K</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Traffic Sources Chart */}
          <div className="craftora-chart-container">
            <div className="craftora-chart-header" onClick={() => toggleChart('traffic')}>
              <h3 className="craftora-chart-title">Real-time Traffic Sources</h3>
              <button className="craftora-chart-toggle">
                {expandedChart === 'traffic' ? <MdExpandLess /> : <MdExpandMore />}
              </button>
            </div>
            
            {expandedChart === 'traffic' && (
              <div className="craftora-chart-body">
                <div className="craftora-traffic-list">
                  <div className="craftora-traffic-item">
                    <span className="craftora-traffic-source">DOMAIN: TRADER</span>
                    <span className="craftora-traffic-value">15.1K VISITORS</span>
                  </div>
                  <div className="craftora-traffic-item">
                    <span className="craftora-traffic-source">DIRECT TRAFFIC</span>
                    <span className="craftora-traffic-value">8.7K VISITORS</span>
                  </div>
                  <div className="craftora-traffic-item">
                    <span className="craftora-traffic-source">SOCIAL NETWORKING</span>
                    <span className="craftora-traffic-value">3.9K VISITORS</span>
                  </div>
                  <div className="craftora-traffic-item">
                    <span className="craftora-traffic-source">EMAIL CAMPAIGN</span>
                    <span className="craftora-traffic-value">2.4K VISITORS</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ana Gelir Grafiği */}
          <div className="main-chart-card">
            <div className="chart-header">
              <div>
                <h3>Gelir Performansı</h3>
                <p className="chart-subtitle">Son {selectedPeriod} içindeki gelir değişimi</p>
              </div>
              <div className="chart-legend">
                <span className="legend-dot primary"></span>
                <span>Gelir</span>
                <span className="legend-dot success"></span>
                <span>Hedef</span>
              </div>
            </div>
            
            <div className="chart-container">
              <svg width="100%" height="350" viewBox="0 0 1000 350" style={{ background: '#1e1e2f', borderRadius: '12px' }}>
                <line x1="50" y1="50" x2="950" y2="50" stroke="#334155" strokeWidth="1" />
                <line x1="50" y1="150" x2="950" y2="150" stroke="#334155" strokeWidth="1" />
                <line x1="50" y1="250" x2="950" y2="250" stroke="#334155" strokeWidth="1" />
                
                <polyline 
                  points="50,280 150,220 250,180 350,120 450,160 550,100 650,140 750,80 850,120 950,60"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                
                <path 
                  d="M50,280 L150,220 L250,180 L350,120 L450,160 L550,100 L650,140 L750,80 L850,120 L950,60 L950,350 L50,350 Z"
                  fill="url(#gradient)"
                  opacity="0.3"
                />
                
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                <text x="50" y="320" fill="#94a3b8" fontSize="12">Oca</text>
                <text x="250" y="320" fill="#94a3b8" fontSize="12">Şub</text>
                <text x="450" y="320" fill="#94a3b8" fontSize="12">Mar</text>
                <text x="650" y="320" fill="#94a3b8" fontSize="12">Nis</text>
                <text x="850" y="320" fill="#94a3b8" fontSize="12">May</text>
              </svg>
            </div>
          </div>

          {/* Alt Grid - Trafik ve Ürünler */}
          <div className="charts-grid">
            {/* Trafik Kaynakları */}
            <div className="chart-card">
              <div className="chart-header">
                <h4>Trafik Kaynakları</h4>
                <MdTune className="chart-menu" />
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={Object.entries(sources || {}).map(([name, value]) => ({
                        name,
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {Object.keys(sources || {}).map((key) => (
                        <Cell key={key} fill={COLORS[key as keyof typeof COLORS] || COLORS.primary} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="source-list">
                  {Object.entries(sources || {}).map(([source, count]) => (
                    <div key={source} className="source-item">
                      <div className="source-info">
                        <span className="source-dot" style={{ background: COLORS[source as keyof typeof COLORS] || COLORS.primary }}></span>
                        <span className="source-name">{source}</span>
                      </div>
                      <div className="source-stats">
                        <span className="source-count">{count}</span>
                        <span className="source-percent">
                          ({((count / Object.values(sources || {}).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* En Çok Satan Ürünler */}
            <div className="chart-card">
              <div className="chart-header">
                <h4>En Çok Satan Ürünler</h4>
              </div>
              <div className="chart-body">
                <div className="top-products">
                  {(topProducts || []).slice(0, 5).map((product, index) => (
                    <div key={product.product_id || index} className="product-item">
                      <div className="product-rank">{index + 1}</div>
                      <div className="product-info">
                        <span className="product-name">{product.product_name || 'Ürün'}</span>
                        <div className="product-stats">
                          <span className="product-sales">{product.quantity || 0} satış</span>
                          <span className="product-revenue">${product.revenue || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZİYARETÇİ ANALİZİ VIEW */}
      {selectedView === 'visitors' && (
        <div className="visitors-view">
          {/* Ziyaretçi KPI'ları */}
          <div className="visitor-kpi-grid">
            <div className="visitor-kpi">
              <MdPeople className="kpi-icon-large" />
              <div className="kpi-detail">
                <span className="kpi-detail-label">Toplam Ziyaret</span>
                <span className="kpi-detail-value">{dashboard?.traffic?.total_visitors?.toLocaleString() || '0'}</span>
                <span className="kpi-detail-trend positive">+%8.2</span>
              </div>
            </div>
            
            <div className="visitor-kpi">
              <MdVisibility className="kpi-icon-large" />
              <div className="kpi-detail">
                <span className="kpi-detail-label">Sayfa Görüntüleme</span>
                <span className="kpi-detail-value">12,847</span>
                <span className="kpi-detail-trend positive">+%5.3</span>
              </div>
            </div>
            
            <div className="visitor-kpi">
              <MdAccessTime className="kpi-icon-large" />
              <div className="kpi-detail">
                <span className="kpi-detail-label">Ortalama Süre</span>
                <span className="kpi-detail-value">4:32 dk</span>
                <span className="kpi-detail-trend negative">-%1.5</span>
              </div>
            </div>
            
            <div className="visitor-kpi">
              <MdExitToApp className="kpi-icon-large" />
              <div className="kpi-detail">
                <span className="kpi-detail-label">Hemen Çıkma</span>
                <span className="kpi-detail-value">%42.3</span>
                <span className="kpi-detail-trend negative">+%3.1</span>
              </div>
            </div>
          </div>

          {/* Trafik Kaynakları Detaylı */}
          <div className="traffic-analysis-grid">
            <div className="traffic-card">
              <h4>Trafik Kaynakları Dağılımı</h4>
              <div className="sources-progress">
                {(trafficSources?.sources || []).map((source) => (
                  <div key={source.source} className="source-progress-item">
                    <div className="source-progress-header">
                      <span className="source-progress-name">{source.source}</span>
                      <span className="source-progress-value">{source.visits} ziyaret</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${(source.visits / ((trafficSources?.sources?.reduce((acc, s) => acc + s.visits, 0)) || 1)) * 100}%`,
                          background: COLORS[source.source as keyof typeof COLORS] || COLORS.primary
                        }}
                      ></div>
                    </div>
                    <div className="source-progress-footer">
                      <span>{source.unique_visitors} unique</span>
                      <span className="source-progress-percent">
                        {((source.visits / ((trafficSources?.sources?.reduce((acc, s) => acc + s.visits, 0)) || 1)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ziyaretçi Davranışı */}
            <div className="behavior-card">
              <h4>Ziyaretçi Davranışı</h4>
              <div className="behavior-stats">
                <div className="behavior-item">
                  <MdMouse className="behavior-icon" />
                  <div>
                    <div className="behavior-label">Tıklama Sayısı</div>
                    <div className="behavior-value">45,231</div>
                  </div>
                </div>
                <div className="behavior-item">
                  <MdVisibility className="behavior-icon" />
                  <div>
                    <div className="behavior-label">Sayfa/Ziyaret</div>
                    <div className="behavior-value">4.2</div>
                  </div>
                </div>
                <div className="behavior-item">
                  <MdAccessTime className="behavior-icon" />
                  <div>
                    <div className="behavior-label">Oturum Süresi</div>
                    <div className="behavior-value">4:32 dk</div>
                  </div>
                </div>
                <div className="behavior-item">
                  <MdExitToApp className="behavior-icon" />
                  <div>
                    <div className="behavior-label">Çıkış Sayısı</div>
                    <div className="behavior-value">2,341</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cihaz Dağılımı */}
            <div className="device-card">
              <h4>Cihaz Dağılımı</h4>
              <div className="device-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Mobil', value: devices?.mobile || 0 },
                        { name: 'Masaüstü', value: devices?.desktop || 0 },
                        { name: 'Tablet', value: devices?.tablet || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="value"
                    >
                      <Cell fill={COLORS.purple} />
                      <Cell fill={COLORS.primary} />
                      <Cell fill={COLORS.cyan} />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="device-legend">
                  <div className="device-legend-item">
                    <span className="device-dot" style={{ background: COLORS.purple }}></span>
                    <span>Mobil ({devices?.mobile})</span>
                  </div>
                  <div className="device-legend-item">
                    <span className="device-dot" style={{ background: COLORS.primary }}></span>
                    <span>Masaüstü ({devices?.desktop})</span>
                  </div>
                  <div className="device-legend-item">
                    <span className="device-dot" style={{ background: COLORS.cyan }}></span>
                    <span>Tablet ({devices?.tablet})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coğrafi Dağılım */}
            <div className="geo-card">
              <h4>Coğrafi Dağılım</h4>
              <div className="geo-list">
                <div className="geo-item">
                  <span className="geo-country">
                    <MdLocationOn /> Türkiye
                  </span>
                  <span className="geo-visitors">12,847 ziyaretçi</span>
                  <span className="geo-percent">%48.3</span>
                </div>
                <div className="geo-item">
                  <span className="geo-country">
                    <MdLocationOn /> ABD
                  </span>
                  <span className="geo-visitors">5,231 ziyaretçi</span>
                  <span className="geo-percent">%19.7</span>
                </div>
                <div className="geo-item">
                  <span className="geo-country">
                    <MdLocationOn /> Almanya
                  </span>
                  <span className="geo-visitors">3,845 ziyaretçi</span>
                  <span className="geo-percent">%14.5</span>
                </div>
                <div className="geo-item">
                  <span className="geo-country">
                    <MdLocationOn /> İngiltere
                  </span>
                  <span className="geo-visitors">2,934 ziyaretçi</span>
                  <span className="geo-percent">%11.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIRALAMA VIEW */}
      {selectedView === 'ranking' && (
        <div className="ranking-view">
          {/* Dünya Sıralaması */}
          <div className="world-ranking-card">
            <div className="ranking-header">
              <h3>
                <MdPublic className="ranking-icon" />
                Dünya Sıralaması
              </h3>
              <div className="ranking-badge">Canlı</div>
            </div>
            
            <div className="rank-position">
              <div className="current-rank">
                <span className="rank-number">#{ranking?.world_rank || 'N/A'}</span>
                <span className="rank-label">Dünya Sıralaması</span>
              </div>
              <div className="rank-stats">
                <div className="rank-stat">
                  <span className="stat-label">Toplam Mağaza</span>
                  <span className="stat-value">{ranking?.total_shops || 0}</span>
                </div>
                <div className="rank-stat">
                  <span className="stat-label">Top % Dilim</span>
                  <span className="stat-value">%{ranking?.top_percent?.toFixed(1) || '0'}</span>
                </div>
                <div className="rank-stat">
                  <span className="stat-label">Gelir</span>
                  <span className="stat-value">${ranking?.revenue?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* İlk 10 Mağaza */}
          <div className="top-shops-card">
            <h3>🏆 Dünyada İlk 10 Mağaza</h3>
            <div className="top-shops-list">
              <div className="top-shop-item gold">
                <span className="shop-rank">1</span>
                <span className="shop-name">Ali Digital Products</span>
                <span className="shop-revenue">$149.97</span>
                <span className="shop-growth positive">+%12.4</span>
              </div>
              <div className="top-shop-item silver">
                <span className="shop-rank">2</span>
                <span className="shop-name">Mega Test Shop</span>
                <span className="shop-revenue">$99.99</span>
                <span className="shop-growth positive">+%8.2</span>
              </div>
              <div className="top-shop-item bronze">
                <span className="shop-rank">3</span>
                <span className="shop-name">Craftora Official</span>
                <span className="shop-revenue">$89.50</span>
                <span className="shop-growth positive">+%5.7</span>
              </div>
              {[4,5,6,7,8,9,10].map(i => (
                <div key={i} className="top-shop-item">
                  <span className="shop-rank">{i}</span>
                  <span className="shop-name">Mağaza {i}</span>
                  <span className="shop-revenue">${(100 - i * 5).toFixed(2)}</span>
                  <span className="shop-growth positive">+%{(i * 0.5).toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kategori Sıralamaları */}
          <div className="category-ranking-card">
            <h3>📊 Kategori Sıralamaları</h3>
            <div className="category-list">
              <div className="category-item">
                <span className="category-name">Elektronik</span>
                <span className="category-rank">#2</span>
                <div className="category-bar">
                  <div className="bar-fill" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="category-item">
                <span className="category-name">Giyim</span>
                <span className="category-rank">#5</span>
                <div className="category-bar">
                  <div className="bar-fill" style={{ width: '62%' }}></div>
                </div>
              </div>
              <div className="category-item">
                <span className="category-name">Ev & Yaşam</span>
                <span className="category-rank">#8</span>
                <div className="category-bar">
                  <div className="bar-fill" style={{ width: '41%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHARTS VIEW - Eğer boşsa overview'daki grafikleri göster */}
      {selectedView === 'charts' && (
        <div className="overview-view">
          <div className="main-chart-card">
            <div className="chart-header">
              <h3>Grafik Analizleri</h3>
              <p className="chart-subtitle">Tüm grafikler burada görüntülenebilir</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ background: '#1e1e2f', border: '1px solid #3b82f6' }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
                  <Line type="monotone" dataKey="tui" stroke="#8b5cf6" strokeWidth={3} />
                  <Line type="monotone" dataKey="arpu" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;