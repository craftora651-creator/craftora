import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import ProductsPage from '../config/Products';
import AnalyticsPage from '../config/Analytics';
import CustomersPage from '../config/Customers';
import OrdersPage from '../config/Orders';
import ReportsPage from '../config/Reports';
import PhysicalProductsPage from '../config/PhysicalProductsPage';
import SuppliersPage from '../config/SuppliersPage';
import MyShopsPage from '../config/MyShops';
import { Routes, Route } from 'react-router-dom';
import ProductDetail from '../lib/ProductDetail';
import EditProduct from '../helpers/EditProduct';
import AnalyticsDetail from '../lib/AnalyticsDetail';
import SupplierDetail from '../lib/SupplierDetail';
import SupplierSettings from '../lib/SupplierSettings';
import CreateModal from '../.paket/CreateModal';
import SettingsPage from '../config/Settings';
import HelpCenter from '../config/HelpCenter';
import ThemesPage from '../config/ThemesPage';
import { Chart } from 'chart.js';
import { useCurrentUser } from '../server/FastAPI/user.hooks';
import { useMyShops } from '../server/FastAPI/shop.hooks';


declare global {
  interface Window {
    Chart: typeof Chart;
    revenueChart: Chart | undefined;
    trafficChart: Chart | undefined;
  }
}

const KankamAdminPanel = () => {
  const location = useLocation();
  const getActiveSectionFromPath = useCallback(() => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'dashboard';
    if (path.includes('/admin/products')) return 'products';
    if (path.includes('/admin/analytics')) return 'analytics';
    if (path.includes('/admin/customers')) return 'customers';
    if (path.includes('/admin/orders')) return 'orders';
    if (path.includes('/admin/suppliers')) return 'suppliers';
    if (path.includes('/admin/reports')) return 'reports';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/general')) return 'general';
    if (path.includes('/admin/help')) return 'help';
    if (path.includes('/admin/myshops')) return 'myshops';
    if (path.includes('/admin/themes')) return 'themes';
    return 'dashboard';
  }, [location.pathname]);

  const [activeSection, setActiveSection] = useState(getActiveSectionFromPath());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const handleOpenProfileModal = () => setOpenProfileModal(true);
  const handleCloseProfileModal = () => setOpenProfileModal(false);
  const { data: shops, isLoading: shopsLoading } = useMyShops();
  const currentShop = shops?.[0];


  useEffect(() => {
    setActiveSection(getActiveSectionFromPath());
  }, [getActiveSectionFromPath]); // sadece getActiveSectionFromPath yeterli

  const theme = {
    dark: {
      bg: '#0f172a',
      surface: '#1e293b',
      border: '#334155',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      hover: '#2d3a4f',
      primary: '#0ea5e9'
    },
    light: {
      bg: '#f8fafc',
      surface: '#ffffff',
      border: '#e2e8f0',
      text: '#0f172a',
      textSecondary: '#475569',
      hover: '#f1f5f9',
      primary: '#0ea5e9'
    }
  };
  const colors = theme[isDarkMode ? 'dark' : 'light'];
  useEffect(() => {
    const handleResize = () => {
      // Desktop'a geçince (1024px'den büyük) sidebar'ı aç
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    if (window.innerWidth > 1024) {
      setIsMobileMenuOpen(false);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const loadScripts = () => {
      if (!document.querySelector('#chartjs-script')) {
        const script = document.createElement('script');
        script.id = 'chartjs-script';
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
        document.head.appendChild(script);
      }
    };
    loadScripts();
  }, []);
  const GoProduct = () => {
    handleOpenCreateModal();
  };

  const navigate = useNavigate();
  const { data: userData, isLoading: userLoading } = useCurrentUser();
  const userFullName = userData?.full_name || userData?.email?.split('@')[0] || 'Kullanıcı';
  const userEmail = userData?.email || '';
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };


  return (
    <div style={{
      backgroundColor: colors.bg,
      color: colors.text,
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      transition: 'all 0.3s ease'
    }}>
      <style>
        {`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');
    
    * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
    }
    
    body { 
      margin: 0; 
      padding: 0; 
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
    }
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #0ea5e9;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #0284c7;
}

    /* === TEMEL STILLER === */
    .admin-container {
      display: flex;
      min-height: 100vh;
      position: relative;
    }
    .main-content-wrapper {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: filter 0.3s ease;
    }

    .header {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      transition: all 0.3s ease;
      position: relative;
    }

    /* Grid sistemleri */
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .revenue-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    /* Hamburger buton - SADECE MOBİLDE */
    .mobile-menu-btn-header {
      display: none !important;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      cursor: pointer;
      margin-right: 8px;
      background: transparent;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }

    .mobile-menu-btn-header:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: #334155;
    }

    /* === TABLET (769px - 1024px) === */
@media (min-width: 769px) and (max-width: 1024px) {
  /* Sidebar - tablette de mobil gibi drawer olsun */
 

  .sidebar.open {
    left: 0 !important;
    box-shadow: 4px 0 30px rgba(0, 0, 0, 0.3);
  }

  /* Overlay - tablette de göster */
  .sidebar-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 1150;
    transition: all 0.3s ease;
  }

  .sidebar-overlay.active {
    display: block !important;
  }

  /* Ana içerik blur - tablette de olsun */
  .main-content-wrapper.blur {
    filter: blur(4px);
    pointer-events: none;
  }

  /* Grid düzenlemeleri */
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .revenue-grid,
  .products-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .header {
    padding: 0 20px;
  }

  .header h1 {
    font-size: 22px;
  }

  .desktop-only input {
    width: 200px;
  }

  .main-content {
    padding: 24px !important;
  }

  /* Hamburger buton tablette GÖSTER */
  .mobile-menu-btn-header {
    display: flex !important;
  }
}

    /* === MOBİL (max-width: 768px) === */
    @media (max-width: 768px) {
      /* ===== HEADER DÜZENLEMESİ ===== */
      .header {
        height: auto;
        min-height: 60px;
        padding: 8px 12px !important;
        gap: 6px;
      }

      /* Sol taraf - Hamburger + Overview */
      .header-left {
        display: flex !important;
        align-items: center;
        gap: 4px;
        flex: 1;
      }

      /* Hamburger buton GÖSTER */
      .mobile-menu-btn-header {
        display: flex !important;
        width: 36px !important;
        height: 36px !important;
        min-width: 36px;
        margin-right: 4px;
        background: transparent;
        border: 1px solid transparent;
        color: #94a3b8;
      }

      .mobile-menu-btn-header:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: #334155;
      }

      .header h1 {
        font-size: 16px !important;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 110px;
        margin: 0;
        color: inherit;
      }

      /* ===== SAĞ TARAF - BUTONLAR ===== */
      .header-right {
        display: flex !important;
        align-items: center;
        gap: 6px;
      }

      /* Arama icon butonu */
      .mobile-search-btn {
        display: flex !important;
        width: 36px !important;
        height: 36px !important;
        min-width: 36px;
        border-radius: 10px !important;
        background: transparent;
        border: 1px solid transparent;
        color: #94a3b8;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .mobile-search-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: #334155;
      }

      /* Dark mode butonu */
      .theme-toggle-btn {
        display: flex !important;
        width: 36px !important;
        height: 36px !important;
        min-width: 36px;
        border-radius: 10px !important;
        background: transparent;
        border: 1px solid transparent;
        color: #94a3b8;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .theme-toggle-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: #334155;
      }

      /* Notification butonu */
      .notification-btn {
        display: flex !important;
        width: 36px !important;
        height: 36px !important;
        min-width: 36px;
        border-radius: 10px !important;
        background: transparent;
        border: 1px solid transparent;
        color: #94a3b8;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        position: relative;
      }

      .notification-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: #334155;
      }

      /* Create product butonu - en sağda */
      .create-product-btn {
        display: flex !important;
        width: 36px !important;
        height: 36px !important;
        min-width: 36px;
        border-radius: 10px !important;
        background: #0ea5e9 !important;
        border: none !important;
        color: white !important;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        margin-left: 2px;
      }

      .create-product-btn:hover {
        background: #0284c7 !important;
      }

      .create-product-btn span:last-child {
        display: none;
      }

      .create-product-btn span:first-child {
        font-size: 18px;
      }

      /* Masaüstü arama inputunu gizle */
      .desktop-search {
        display: none !important;
      }

      /* Desktop-only class'ını ez */
      .desktop-only {
        margin: 0 !important;
      }

      /* Buton yazılarını gizle */
      .mobile-hide {
        display: none !important;
      }

      /* ===== ARAMA OVERLAY ===== */
      .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #1e293b;
        padding: 12px 16px;
        z-index: 1400;
        transform: translateY(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-bottom: 1px solid #334155;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }

      .search-overlay.open {
        transform: translateY(0);
      }

      .search-overlay .search-container {
        position: relative;
        width: 100%;
      }

      .search-overlay input {
        width: 100%;
        padding: 12px 40px 12px 44px;
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 30px;
        color: #f1f5f9;
        font-size: 15px;
        outline: none;
      }

      .search-overlay .search-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        font-size: 20px;
      }

      .search-overlay .close-btn {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .search-overlay .close-btn:hover {
        color: #f1f5f9;
      }

      /* Arama overlay arkaplanı */
      .search-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 1350;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .search-backdrop.active {
        opacity: 1;
        pointer-events: auto;
      }

      /* ===== SIDEBAR (DOKUNMA) ===== */
     

      .sidebar.open {
        box-shadow: 4px 0 30px rgba(0, 0, 0, 0.3);
      }

      .sidebar-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 1150;
        transition: all 0.3s ease;
      }

      .sidebar-overlay.active {
        display: block;
      }

      .main-content-wrapper.blur {
        filter: blur(4px);
        pointer-events: none;
      }

      /* ===== İÇERİK ALANI ===== */
      .main-content {
        padding: 20px 12px !important;
      }

      /* Grid düzenlemeleri */
      .grid-4 {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px !important;
        margin-bottom: 20px !important;
      }

      /* Stat kartları */
      .grid-4 > div {
        padding: 16px !important;
        border-radius: 16px !important;
      }

      .grid-4 > div > div:first-child {
        margin-bottom: 12px !important;
      }

      .grid-4 > div > div:first-child > div:first-child {
        width: 40px !important;
        height: 40px !important;
        border-radius: 12px !important;
      }

      .grid-4 > div > div:first-child > span {
        padding: 2px 8px !important;
        font-size: 11px !important;
      }

      .grid-4 > div > div:nth-child(2) {
        font-size: 11px !important;
        margin-bottom: 4px !important;
      }

      .grid-4 > div > div:last-child {
        font-size: 22px !important;
      }

      /* Revenue Grid */
      .revenue-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
        margin-bottom: 20px !important;
      }

      .revenue-grid > div {
        padding: 18px !important;
        border-radius: 18px !important;
      }

      .revenue-grid h2 {
        font-size: 16px !important;
      }

      .revenue-grid p {
        font-size: 12px !important;
      }

      .revenue-grid > div:first-child > div:first-child button {
        padding: 4px 12px !important;
        font-size: 11px !important;
      }

      #revenue-chart {
        max-height: 200px !important;
      }

      /* Traffic Sources */
      .revenue-grid > div:last-child > div {
        gap: 16px !important;
      }

      .revenue-grid > div:last-child > div > div:first-child {
        width: 140px !important;
        height: 140px !important;
      }

      /* Products Grid */
      .products-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
      }

      .products-grid > div:first-child {
        border-radius: 18px !important;
        overflow: hidden;
      }

      .products-grid > div:first-child > div:first-child {
        padding: 16px 18px !important;
      }

      .products-grid > div:first-child > div:first-child h2 {
        font-size: 16px !important;
      }

      /* Tablo */
      .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      table {
        min-width: 500px !important;
      }

      table th {
        padding: 10px 16px !important;
        font-size: 11px !important;
      }

      table td {
        padding: 12px 16px !important;
      }

      /* Recent Customers */
      .products-grid > div:last-child {
        padding: 18px !important;
        border-radius: 18px !important;
      }

      .products-grid > div:last-child h2 {
        font-size: 16px !important;
        margin-bottom: 18px !important;
      }

      .products-grid > div:last-child button {
        margin-top: 18px !important;
        padding: 12px !important;
        font-size: 12px !important;
      }
    }

    /* === KÜÇÜK TELEFON (max-width: 480px) === */
    @media (max-width: 480px) {
      .header {
        padding: 6px 10px !important;
      }

      .header h1 {
        font-size: 15px !important;
        max-width: 100px;
      }

      .mobile-menu-btn-header,
      .mobile-search-btn,
      .theme-toggle-btn,
      .notification-btn,
      .create-product-btn {
        width: 34px !important;
        height: 34px !important;
        min-width: 34px;
      }

      .main-content {
        padding: 16px 10px !important;
      }

      .grid-4 {
        gap: 8px !important;
      }

      .grid-4 > div {
        padding: 14px !important;
      }

      .grid-4 > div > div:last-child {
        font-size: 20px !important;
      }

      .revenue-grid > div {
        padding: 16px !important;
      }

      .products-grid > div:first-child > div:first-child {
        padding: 14px 16px !important;
      }

      .products-grid > div:last-child {
        padding: 16px !important;
      }

      table {
        min-width: 420px !important;
      }
    }
  `}
      </style>

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

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        {/* Sidebar */}
        <div className="sidebar" style={{
          width: 280,
          flexShrink: 0,
          backgroundColor: colors.surface,
          borderRight: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: window.innerWidth <= 1024 ? 'fixed' : 'sticky',
          top: 0,
          left: window.innerWidth <= 1024
            ? (isMobileMenuOpen ? 0 : '-100%')
            : 0,
          zIndex: 1200,
          transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          {/* Logo */}
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                backgroundColor: '#0ea5e9',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(14,165,233,0.3)'
              }}>
                <span className="material-icons-round" style={{ color: 'white', fontSize: 24 }}>dashboard</span>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>Craftora</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, letterSpacing: 1 }}>Dashboard</div>
              </div>
            </div>
          </div>
          {/* Arama */}
          {/* Menü Butonları */}
          <nav style={{ flex: 1, padding: '0 16px' }}>
            {[
              { id: 'dashboard', icon: 'grid_view', label: 'Overview', path: '/admin' },
              { id: 'products', icon: 'shopping_bag', label: 'Products', path: '/admin/products' },
              { id: 'analytics', icon: 'analytics', label: 'Analytics', path: '/admin/analytics' },
              { id: 'customers', icon: 'group', label: 'Customers', path: '/admin/customers' },
              { id: 'orders', icon: 'local_shipping', label: 'Orders', path: '/admin/orders' },
              { id: 'myshops', icon: 'store', label: 'Mağazam', path: '/admin/myshops' },
              { id: 'themes', icon: 'color_lens', label: 'Temalar', path: '/admin/themes' },
              { id: 'reports', icon: 'receipt_long', label: 'Reports', path: '/admin/reports' }
            ].map(item => (
              <SidebarButton
                key={item.id}
                {...item}
                activeSection={activeSection}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                colors={colors}
                isDarkMode={isDarkMode}
              />
            ))}
            <div style={{ marginTop: 40, marginBottom: 16, paddingLeft: 12 }}>
              <div style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 'bold', letterSpacing: 1 }}>SETTINGS</div>
            </div>
            {[
              { id: 'suppliers', icon: 'link', label: 'Tedarikçiler', path: '/admin/suppliers' },
              { id: 'settings', icon: 'settings', label: 'Settings', path: '/admin/settings' },
              { id: 'help', icon: 'help_outline', label: 'Help', path: '/admin/help' }
            ].map(item => (
              <SidebarButton
                key={item.id}
                {...item}
                activeSection={activeSection}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                colors={colors}
                isDarkMode={isDarkMode}
              />
            ))}
          </nav>
          {/* Profil */}

          {/* Profil - Güncellenmiş Modern Tasarım */}
          <div style={{ padding: 24 }}>
            <div onClick={handleOpenProfileModal} style={{
              padding: 20,
              background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.bg} 100%)`,
              borderRadius: 20,
              border: `1px solid ${colors.border}`,
              boxShadow: isDarkMode
                ? '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 8px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Dekoratif gradient arkaplan efekti */}
              <div style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0) 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                position: 'relative',
                zIndex: 1
              }}>
                {/* Avatar - Animasyonlu hover efekti */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    background: `linear-gradient(135deg, #0ea5e9, #3b82f6)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span style={{
                      fontSize: 22,
                      color: 'white',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                      {userFullName?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  {/* Online durumu göstergesi */}
                  <div style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: '#10b981',
                    border: `2px solid ${colors.surface}`,
                    boxShadow: '0 0 0 2px rgba(16,185,129,0.3)'
                  }} />
                </div>

                {/* Kullanıcı Bilgileri */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: colors.text,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: 4
                  }}>
                    {userFullName}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: colors.textSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    <span className="material-icons-round" style={{ fontSize: 12 }}>email</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</span>
                  </div>
                </div>

                {/* Logout Butonu - Tooltip efekti */}
                <div
                  onClick={handleLogout}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                    color: '#ef4444',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title="Çıkış Yap"
                >
                  <span className="material-icons-round" style={{ fontSize: 20 }}>logout</span>
                </div>
              </div>

              {/* Kullanıcı rolü / plan bilgisi (opsiyonel) */}
              <div style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-icons-round" style={{ fontSize: 14, color: '#0ea5e9' }}>verified</span>
                  <span style={{ fontSize: 10, color: colors.textSecondary, fontWeight: 500 }}>Pro Account</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-icons-round" style={{ fontSize: 12, color: '#f59e0b' }}>star</span>
                  <span style={{ fontSize: 10, color: colors.textSecondary }}>Seller Level 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="sidebar-overlay active"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 1100
            }}
          />
        )}
        {/* Ana İçerik */}
        <div className={`main-content-wrapper ${isMobileMenuOpen ? 'blur' : ''}`} style={{ flex: 1, paddingTop: '80px', minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          {/* Header - DÜZELTİLMİŞ VERSİYON */}
          <div className="header" style={{
            position: 'fixed',
            top: 0,
            left: window.innerWidth <= 1024 ? 0 : 280,
            right: 0,
            zIndex: 1000,
            height: 80,
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: colors.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Hamburger buton - SADECE MOBİLDE GÖRÜNÜR */}
              <div
                className="mobile-menu-btn-header"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  display: 'none', // CSS ile gösterilecek
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                  color: colors.textSecondary,
                  cursor: 'pointer'
                }}
              >
                <span className="material-icons-round">menu</span>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, margin: 0 }}>
                {activeSection === 'dashboard' && 'Overview'}
                {activeSection === 'products' && 'Products'}
                {activeSection === 'analytics' && 'Analytics'}
                {activeSection === 'customers' && 'Customers'}
                {activeSection === 'suppliers' && 'Tedarikçiler'}
                {activeSection === 'myshops' && 'My Shops'}
                {activeSection === 'themes' && 'Themes'}
                {activeSection === 'orders' && 'Orders'}
                {activeSection === 'reports' && 'Reports'}
                {activeSection === 'general' && 'General Settings'}
                {activeSection === 'help' && 'Help'}
                {activeSection === 'settings' && 'Settings'}
              </h1>
            </div>
            {/* Header sağ kısım - BUTONLAR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {/* Arama - Mobilde icon, masaüstünde input */}
              <div style={{ position: 'relative' }} className="desktop-only">
                {/* Masaüstü input */}
                <div className="desktop-search">
                  <span className="material-icons-round" style={{
                    position: 'absolute',
                    left: 12,
                    top: 10,
                    color: colors.textSecondary,
                    fontSize: 18
                  }}>search</span>
                  <input
                    placeholder="Search..."
                    style={{
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 30,
                      padding: '8px 16px 8px 40px',
                      width: 240,
                      color: colors.text,
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                </div>
                {/* Mobil icon buton */}
                <button
                  className="mobile-search-btn"
                  onClick={() => setIsSearchOpen(true)}
                  style={{
                    display: 'none',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    color: colors.textSecondary,
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span className="material-icons-round">search</span>
                </button>
              </div>
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{
                  background: 'none',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 30,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backgroundColor: colors.bg,
                  color: colors.textSecondary
                }}>
                <span className="material-icons-round">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
              </button>
              {/* Notifications */}
              <button style={{
                background: 'none',
                border: `1px solid ${colors.border}`,
                borderRadius: 30,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: colors.bg,
                color: colors.textSecondary,
                position: 'relative'
              }}>
                <span className="material-icons-round">notifications</span>
                <span style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 8,
                  height: 8,
                  backgroundColor: '#ef4444',
                  borderRadius: 4,
                  border: `2px solid ${colors.surface}`
                }} />
              </button>
              {/* Create Product Button */}
              <button
                onClick={GoProduct}
                style={{
                  backgroundColor: '#0ea5e9',
                  border: 'none',
                  borderRadius: 30,
                  padding: '8px 20px',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}>
                <span className="material-icons-round" style={{ fontSize: 18 }}>add</span>
                <span className="mobile-hide">Create Product</span>
              </button>
            </div>
          </div>
          {/* Arama Overlay - Mobilde */}
          <div className={`search-overlay ${isSearchOpen ? 'open' : ''}`} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            background: colors.surface,
            padding: '16px',
            zIndex: 1300,
            transform: isSearchOpen ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderBottom: `1px solid ${colors.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ position: 'relative' }}>
              <span className="material-icons-round" style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.textSecondary
              }}>search</span>
              <input
                type="text"
                placeholder="Search..."
                autoFocus={isSearchOpen}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 30,
                  color: colors.text,
                  fontSize: 16,
                  outline: 'none'
                }}
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: colors.textSecondary,
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>
          </div>
          {/* Arama Overlay arkaplan karartma */}
          {isSearchOpen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1200,
                backgroundColor: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)'
              }}
              onClick={() => setIsSearchOpen(false)}
            />
          )}
          {/* İçerik Alani */}
          <div className="main-content" style={{
            flex: 1,
            overflow: 'auto',
            padding: '32px',
            backgroundColor: colors.bg
          }}>
            <Routes>
              <Route path="/" element={
                <DashboardContent colors={colors} isDarkMode={isDarkMode} />
              } />

              <Route path="/products" element={
                <ProductsPage colors={colors} />
              } />
              <Route path="/product/view/:id" element={<ProductDetail />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route
                path="/analytics-shop"
                element={<AnalyticsDetail colors={colors} />}
              />
              {/* 👇 YENİ - Ürün detay */}
              <Route path="/settings" element={<SettingsPage colors={colors} />} />

              {/* 👇 YENİ - Ürün düzenle */}
              <Route path="/products/edit/:id" element={
                <EditProduct />
              } />
              <Route path="/help" element={<HelpCenter colors={colors} />} />
              <Route path="/myshops" element={
                <MyShopsPage colors={colors} />
              } />

              <Route path="/analytics" element={
                <AnalyticsPage colors={colors} />
              } />

              <Route path="/customers" element={
                <CustomersPage colors={colors} />
              } />

              <Route path="/orders" element={
                <OrdersPage colors={colors} />
              } />

              <Route path="/themes" element={
                <ThemesPage colors={colors} shopId={currentShop?.id || ''} />
              } />

              <Route path="/reports" element={
                <ReportsPage colors={colors} />
              } />
              <Route path="/suppliers" element={
                <SuppliersPage colors={colors} />
              } />
              <Route path="/suppliers/:id" element={
                <SupplierDetail colors={colors} />
              } />
              <Route path="/suppliers/:id/settings" element={
                <SupplierSettings colors={colors} />
              } />
              <Route path="/physical-products" element={
                <PhysicalProductsPage colors={colors} />
              } />
            </Routes>
          </div>
        </div>
      </div>
      <CreateModal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        colors={colors}
      />

      {/* PROFILE MODAL - BURAYA EKLE */}
      {openProfileModal && (
        <>
          {/* Backdrop */}
          <div
            onClick={handleCloseProfileModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 2000,
            }}
          />

          {/* Modal İçeriği */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 480,
            backgroundColor: colors.surface,
            borderRadius: 28,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            zIndex: 2001,
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, #0ea5e9, #3b82f6)`,
              padding: '32px 24px',
              textAlign: 'center',
              position: 'relative'
            }}>
              <button
                onClick={handleCloseProfileModal}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: 30,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <span className="material-icons-round" style={{ fontSize: 20 }}>close</span>
              </button>

              <div style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                background: `linear-gradient(135deg, #fff, #e2e8f0)`,
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                border: '4px solid rgba(255,255,255,0.3)'
              }}>
                <span style={{ fontSize: 48, fontWeight: 700, color: '#0ea5e9' }}>
                  {userFullName?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 700, color: 'white', margin: '0 0 4px 0' }}>
                {userFullName}
              </h2>

              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                {userEmail}
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: `1px solid ${colors.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: 20 }}>verified</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Hesap Durumu</div>
                    <div style={{ fontSize: 11, color: colors.textSecondary }}>Premium Üyelik</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 30, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                  Aktif
                </span>
              </div>

              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                <button
                  onClick={() => {
                    handleCloseProfileModal();
                    navigate('/admin/settings');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 30,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: 'transparent',
                    color: colors.text,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <span className="material-icons-round" style={{ fontSize: 18 }}>settings</span>
                  Hesap Ayarları
                </button>

                <button
                  onClick={() => {
                    handleCloseProfileModal();
                    handleLogout();
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 30,
                    border: 'none',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <span className="material-icons-round" style={{ fontSize: 18 }}>logout</span>
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Sidebar Butonu
interface SidebarButtonProps {
  id: string;
  icon: string;
  label: string;
  activeSection: string;
  setIsMobileMenuOpen: (open: boolean) => void;
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    hover: string;
  };
  isDarkMode: boolean;
  path: string;
}

const SidebarButton = ({
  id,
  icon,
  label,
  activeSection,
  setIsMobileMenuOpen,
  colors,
  isDarkMode,
  path
}: SidebarButtonProps) => {
  const isActive = activeSection === id;
  const navigate = useNavigate();
  const comingSoonMenus = ['suppliers', 'themes'];
  const handleClick = () => {
    // Eğer yakında menüsüyse hiçbir şey yapma
    if (comingSoonMenus.includes(id)) {
      return;
    }
    navigate(path);
    if (window.innerWidth <= 1024) {
      setIsMobileMenuOpen(false);
    }
  };

 return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 12,
        cursor: comingSoonMenus.includes(id) ? 'default' : 'pointer',
        backgroundColor: isActive
          ? isDarkMode ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)'
          : 'transparent',
        color: isActive ? '#0ea5e9' : colors.textSecondary,
        marginBottom: 4,
        transition: 'all 0.2s ease',
        opacity: comingSoonMenus.includes(id) ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isActive && !comingSoonMenus.includes(id)) {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#2d3a4f' : '#f1f5f9';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive && !comingSoonMenus.includes(id)) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <span className="material-icons-round" style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}>{label}</span>
      {comingSoonMenus.includes(id) && (
        <span style={{
          marginLeft: 'auto',
          fontSize: 10,
          backgroundColor: '#f59e0b',
          color: 'white',
          padding: '2px 8px',
          borderRadius: 30,
          fontWeight: 600,
          letterSpacing: 0.5
        }}>
          Yakında
        </span>
      )}
    </div>
  );
};

interface DashboardContentProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    hover: string;
    primary: string;
  };
  isDarkMode: boolean;
}

// Dashboard İçeriği
const DashboardContent = ({ colors, isDarkMode }: DashboardContentProps) => {
  const [chartsCreated, setChartsCreated] = useState(false);
  const createCharts = () => {
    // Revenue Chart
    const canvas1 = document.getElementById('revenue-chart') as HTMLCanvasElement | null;
    const ctx1 = canvas1?.getContext('2d');

    if (ctx1 && window.Chart) {
      if (window.revenueChart) {
        window.revenueChart.destroy();
      }

      window.revenueChart = new window.Chart(ctx1, {
        type: 'line',
        data: {
          labels: ['Oct 1', 'Oct 8', 'Oct 15', 'Oct 22', 'Oct 29'],
          datasets: [{
            label: 'Revenue',
            data: [8500, 10200, 14800, 12400, 16500],
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#0ea5e9',
            pointBorderColor: isDarkMode ? '#1e293b' : '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              grid: { color: isDarkMode ? '#334155' : '#e2e8f0' },
              ticks: { color: colors.textSecondary }
            },
            x: {
              grid: { display: false },
              ticks: { color: colors.textSecondary }
            }
          }
        }
      });
    }

    // Traffic Sources Pie Chart
    const canvas2 = document.getElementById('traffic-chart') as HTMLCanvasElement | null;
    const ctx2 = canvas2?.getContext('2d');

    if (ctx2 && window.Chart) {
      if (window.trafficChart) {
        window.trafficChart.destroy();
      }

      window.trafficChart = new window.Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Organic Search 45%', 'Social Media 25%', 'Direct 18%', 'Referral 12%'],
          datasets: [{
            data: [45, 25, 18, 12],
            backgroundColor: ['#0ea5e9', '#a855f7', '#f59e0b', '#10b981'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          cutout: '70%'
        }
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initCharts = () => {
      if (typeof window !== 'undefined' && window.Chart) {
        createCharts();
        if (isMounted) {
          setChartsCreated(true);
        }
      }
    };

    initCharts();

    const checkChartJs = setInterval(() => {
      if (typeof window !== 'undefined' && window.Chart && !chartsCreated && isMounted) {
        createCharts();
        setChartsCreated(true);
        clearInterval(checkChartJs);
      }
    }, 100);

    return () => {
      isMounted = false;
      clearInterval(checkChartJs);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 Boş array, sadece mount'ta çalışır


  return (
    <div>
      {/* 4'lü Kartlar */}
      <div className="grid-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        marginBottom: 32
      }}>
        <StatCard
          icon="attach_money"
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.1)"
          change="+12.5%"
          title="TOTAL REVENUE"
          value="$12,450"
          colors={colors}
        />
        <StatCard
          icon="person"
          color="#0ea5e9"
          bgColor="rgba(14, 165, 233, 0.1)"
          change="+5.2%"
          title="ACTIVE USERS"
          value="1,240"
          colors={colors}
        />
        <StatCard
          icon="shopping_cart"
          color="#a855f7"
          bgColor="rgba(168, 85, 247, 0.1)"
          change="+8.1%"
          title="DIGITAL SALES"
          value="342"
          colors={colors}
        />
        <StatCard
          icon="visibility"
          color="#f43f5e"
          bgColor="rgba(244, 63, 94, 0.1)"
          change="-2.8%"
          title="BLOG VIEWS"
          value="45.2k"
          colors={colors}
        />
      </div>

      {/* Revenue Performance ve Traffic Sources */}
      <div className="revenue-grid" style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 24,
        marginBottom: 32
      }}>
        {/* Revenue Performance */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`,
          boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: 0 }}>Revenue Performance</h2>
              <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0 0' }}>Comparison with last month</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['7D', '30D', '1Y'].map(period => (
                <button
                  key={period}
                  style={{
                    padding: '6px 16px',
                    fontSize: 12,
                    background: period === '30D' ? '#0ea5e9' : 'transparent',
                    border: `1px solid ${period === '30D' ? '#0ea5e9' : colors.border}`,
                    borderRadius: 20,
                    color: period === '30D' ? 'white' : colors.textSecondary,
                    cursor: 'pointer',
                    fontWeight: period === '30D' ? 600 : 400
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Container */}
          <div style={{ height: 250, width: '100%' }}>
            <canvas id="revenue-chart"></canvas>
          </div>

          {/* X-Axis Labels */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 16,
            padding: '0 16px'
          }}>
            {['OCT 1', 'OCT 8', 'OCT 15', 'OCT 22', 'OCT 29'].map(day => (
              <span key={day} style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 500 }}>{day}</span>
            ))}
          </div>
        </div>


        {/* Traffic Sources */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`,
          boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 24px 0' }}>Traffic Sources</h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24
          }}>
            {/* Pie Chart ile Total Visits */}
            <div style={{ position: 'relative', width: 180, height: 180 }}>
              <canvas id="traffic-chart" style={{ width: '100%', height: '100%' }}></canvas>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>45.2k</div>
                <div style={{ fontSize: 9, color: colors.textSecondary, letterSpacing: 0.5 }}>TOTAL VISITS</div>
              </div>
            </div>

            {/* Legend - Alt alta */}
            {/* Legend - Alt alta */}
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}>
              <TrafficLegend color="#0ea5e9" label="Organic Search" percentage="45%" colors={colors} />
              <TrafficLegend color="#a855f7" label="Social Media" percentage="25%" colors={colors} />
              <TrafficLegend color="#f59e0b" label="Direct" percentage="18%" colors={colors} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Products ve Recent Customers */}
      <div className="products-grid" style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 24
      }}>
        {/* Top Products */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px'
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: 0 }}>Top Performing Products</h2>
            <a href="#" style={{ color: '#0ea5e9', fontSize: 13, textDecoration: 'none' }}>View All →</a>
          </div>

          {/* Responsive Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{
                  backgroundColor: colors.bg,
                  fontSize: 12,
                  color: colors.textSecondary
                }}>
                  <th style={{ padding: '12px 24px', textAlign: 'left' }}>Product Name</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left' }}>Price</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left' }}>Sales</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <ProductRow
                  icon="diamond"
                  name="Ultimate UI Kit"
                  category="Design Assets"
                  price="$49.00"
                  sales="1,234"
                  colors={colors}
                />
                <ProductRow
                  icon="auto_stories"
                  name="SEO Mastery E-book"
                  category="Education"
                  price="$39.00"
                  sales="856"
                  colors={colors}
                />
                <ProductRow
                  icon="filter_vintage"
                  name="Lightroom Presets"
                  category="Photography"
                  price="$25.00"
                  sales="543"
                  colors={colors}
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Customers */}
        <div style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${colors.border}`,
          boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.text, margin: '0 0 24px 0' }}>Recent Customers</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <CustomerItem
              name="Jenny Wilson"
              action="Purchased Ultimate UI Kit"
              time="2m ago"
              colors={colors}
            />
            <CustomerItem
              name="Robert Fox"
              action="Purchased SEO E-book"
              time="15m ago"
              colors={colors}
            />
            <CustomerItem
              name="Jacob Jones"
              action="Subscribed to newsletter"
              time="1h ago"
              colors={colors}
            />
            <CustomerItem
              name="Courtney Henry"
              action="Purchased Lightroom Presets"
              time="3h ago"
              colors={colors}
            />
          </div>

          <button style={{
            width: '100%',
            marginTop: 24,
            padding: '14px',
            backgroundColor: 'transparent',
            border: `1px solid ${colors.border}`,
            borderRadius: 30,
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            See All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: string;
  color: string;
  bgColor: string;
  change: string;
  title: string;
  value: string;
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    hover: string;
    primary: string;
  };
}

const StatCard = ({ icon, color, bgColor, change, title, value, colors }: StatCardProps) => (
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
        backgroundColor: bgColor,
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="material-icons-round" style={{ color, fontSize: 24 }}>{icon}</span>
      </div>
      <span style={{
        color: change.startsWith('+') ? '#10b981' : '#f43f5e',
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: change.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
        padding: '4px 10px',
        borderRadius: 20
      }}>
        {change}
      </span>
    </div>
    <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>{value}</div>
  </div>
);

interface TrafficLegendProps {
  color: string;
  label: string;
  percentage: string;
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    hover: string;
    primary: string;
  };
}

// Traffic Legend - colors parametresi eklendi
const TrafficLegend = ({ color, label, percentage, colors }: TrafficLegendProps) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 10, height: 10, backgroundColor: color, borderRadius: 3 }} />
      <span style={{ fontSize: 13, color: colors.textSecondary }}>{label}</span>
    </div>
    <span style={{ fontSize: 13, fontWeight: 'bold', color: colors.text }}>{percentage}</span>
  </div>
);

interface ProductRowProps {
  icon: string;
  name: string;
  category: string;
  price: string;
  sales: string;
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    hover: string;
    primary: string;
  };
}

const ProductRow = ({ icon, name, category, price, sales, colors }: ProductRowProps) => (
  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
    <td style={{ padding: '16px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          backgroundColor: colors.bg,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span className="material-icons-round" style={{ color: colors.textSecondary, fontSize: 20 }}>{icon}</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{name}</span>
      </div>
    </td>
    <td style={{ padding: '16px 24px', color: colors.textSecondary, fontSize: 13 }}>{category}</td>
    <td style={{ padding: '16px 24px', color: colors.text, fontSize: 14, fontWeight: 600 }}>{price}</td>
    <td style={{ padding: '16px 24px', color: colors.text, fontSize: 13 }}>{sales}</td>
    <td style={{ padding: '16px 24px' }}>
      <span style={{
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        fontSize: 11,
        fontWeight: 600,
        padding: '4px 10px',
        borderRadius: 30
      }}>
        ACTIVE
      </span>
    </td>
  </tr>
);

interface CustomerItemProps {
  name: string;
  action: string;
  time: string;
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    hover: string;
    primary: string;
  };
}

const CustomerItem = ({ name, action, time, colors }: CustomerItemProps) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 40,
        height: 40,
        backgroundColor: '#0ea5e9',
        borderRadius: 20,
        backgroundImage: `url(https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=0ea5e9&color=fff&size=40)`,
        backgroundSize: 'cover'
      }} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{name}</div>
        <div style={{ fontSize: 12, color: colors.textSecondary }}>{action}</div>
      </div>
    </div>
    <span style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 500 }}>{time}</span>
  </div>
);
export default KankamAdminPanel;