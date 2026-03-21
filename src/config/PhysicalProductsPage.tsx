import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface PhysicalProductsPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

// Mock fiziksel ürün verileri
const MOCK_PHYSICAL_PRODUCTS = [
  {
    id: '1',
    name: 'Nike Air Max 90',
    sku: 'NK-AM90-42',
    description: 'Spor ayakkabı, siyah, 42 numara',
    base_price: 129.99,
    status: 'published',
    stock_quantity: 45,
    supplier_id: 'autods',
    supplier_name: 'AutoDS',
    supplier_product_id: 'AUTO-12345',
    feature_image_url: 'https://via.placeholder.com/40/0ea5e9/ffffff?text=Nike',
    created_at: '2024-01-15',
    category: 'Ayakkabı',
    weight: '0.8 kg',
    supplier_logo: '🚀'
  },
  {
    id: '2',
    name: 'Basic Cotton T-Shirt',
    sku: 'TS-BLK-L',
    description: 'Pamuklu tişört, siyah, L beden',
    base_price: 29.99,
    status: 'published',
    stock_quantity: 128,
    supplier_id: 'cj',
    supplier_name: 'CJ Dropshipping',
    supplier_product_id: 'CJ-67890',
    feature_image_url: 'https://via.placeholder.com/40/f59e0b/ffffff?text=T-Shirt',
    created_at: '2024-02-10',
    category: 'Giyim',
    weight: '0.2 kg',
    supplier_logo: '⚡'
  },
  {
    id: '3',
    name: 'Deri Cüzdan',
    sku: 'WLT-BRN-001',
    description: 'Hakiki deri cüzdan, kahverengi',
    base_price: 49.99,
    status: 'draft',
    stock_quantity: 0,
    supplier_id: 'autods',
    supplier_name: 'AutoDS',
    supplier_product_id: 'AUTO-67890',
    feature_image_url: 'https://via.placeholder.com/40/a855f7/ffffff?text=Wallet',
    created_at: '2024-03-01',
    category: 'Aksesuar',
    weight: '0.1 kg',
    supplier_logo: '🚀'
  },
  {
    id: '4',
    name: 'Bluetooth Kulaklık',
    sku: 'BT-EAR-001',
    description: 'Kablosuz Bluetooth kulaklık, siyah',
    base_price: 79.99,
    status: 'published',
    stock_quantity: 23,
    supplier_id: 'cj',
    supplier_name: 'CJ Dropshipping',
    supplier_product_id: 'CJ-12345',
    feature_image_url: 'https://via.placeholder.com/40/10b981/ffffff?text=Headphone',
    created_at: '2024-02-15',
    category: 'Elektronik',
    weight: '0.3 kg',
    supplier_logo: '⚡'
  },
  {
    id: '5',
    name: 'Akıllı Saat',
    sku: 'SWATCH-001',
    description: 'Fitness takipli akıllı saat, siyah',
    base_price: 199.99,
    status: 'published',
    stock_quantity: 12,
    supplier_id: '',
    supplier_name: '',
    supplier_product_id: '',
    feature_image_url: 'https://via.placeholder.com/40/ef4444/ffffff?text=Watch',
    created_at: '2024-03-05',
    category: 'Elektronik',
    weight: '0.2 kg',
    supplier_logo: '❌'
  }
];

const PhysicalProductsPage = ({ colors }: PhysicalProductsPageProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productNameToDelete, setProductNameToDelete] = useState('');
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [cjProductId, setCjProductId] = useState('CJXFLPJY00674-Black'); // TEST İÇİN: varsayılan ID

  const addCJProduct = () => {
  const newProduct = {
    id: Date.now().toString(),
    name: 'Distance Measuring Instrument',
    sku: 'CJXFLPJY00674-Black',
    description: 'Electronic Measuring Ruler Tape Measure High Definition Digital LCD High Precision Electronic Measuring Ruler Tool',
    base_price: 3.14,
    status: 'published',
    stock_quantity: 32,
    supplier_id: 'cj',
    supplier_name: 'CJ Dropshipping',
    supplier_product_id: 'CJXFLPJY00674-Black',
    feature_image_url: 'https://via.placeholder.com/40/f59e0b/ffffff?text=CJ',
    created_at: new Date().toISOString().split('T')[0],
    category: 'Elektronik',
    weight: '0.076 kg',
    supplier_logo: '⚡'
  };
  
  setProducts([...products, newProduct]);
  alert('✅ CJ ürünü başarıyla eklendi!');
};

  const productsPerPage = 7;
  const navigate = useNavigate();

  // Mock ürünler (gerçekte API'den gelecek)
  const products = MOCK_PHYSICAL_PRODUCTS;

  // Filtreleme
  const filteredProducts = products.filter(product => {
    if (statusFilter !== 'all' && product.status !== statusFilter) return false;
    if (supplierFilter !== 'all' && product.supplier_id !== supplierFilter) return false;
    return true;
  });

  // Sayfalama
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Metric hesaplamaları
  const totalProducts = filteredProducts.length;
  const inStockProducts = filteredProducts.filter(p => p.stock_quantity > 0).length;
  const outOfStockProducts = filteredProducts.filter(p => p.stock_quantity === 0).length;
  const totalValue = filteredProducts.reduce((sum, p) => sum + (Number(p.base_price) * p.stock_quantity), 0);

  

  // Checkbox işlemleri
  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map(p => p.id));
    }
  };

  // Silme işlemleri
  const handleDeleteClick = (productId: string, productName: string) => {
    setProductToDelete(productId);
    setProductNameToDelete(productName);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    // Mock silme işlemi
    console.log('Ürün silindi:', productToDelete);
    setDeleteModalOpen(false);
    setProductToDelete(null);
    setProductNameToDelete('');
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;

  return (
    <div style={{ 
      minHeight: '100%',
      padding: isMobile ? 16 : 24,
      backgroundColor: colors.bg
    }}>
      {/* Header - Başlık ve Yeni Ürün Butonu */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{ 
            fontSize: isMobile ? 24 : 28, 
            fontWeight: 700, 
            color: colors.text, 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 32 }}>📦</span> 
            Fiziksel Ürünler
          </h1>
          <p style={{ 
            fontSize: isMobile ? 13 : 14, 
            color: colors.textSecondary, 
            margin: '8px 0 0 0'
          }}>
            Tedarikçili ürünlerinizi yönetin, stok ve kargo takibi yapın
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          {/* CJ'den Ürün Ekle Butonu */}
           <button
      onClick={addCJProduct}
      style={{
        padding: isMobile ? '10px 16px' : '12px 24px',
        backgroundColor: '#10b981', // Yeşil renk
        border: 'none',
        borderRadius: 30,
        color: 'white',
        fontSize: isMobile ? 13 : 14,
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
      }}
    >
      <span style={{ fontSize: 18 }}>⚡</span>
      CJ'den Örnek Ürün Ekle
    </button>
          <button
            onClick={() => window.open('https://app.cjdropshipping.com/products/list', '_blank')}
            style={{
              padding: isMobile ? '10px 16px' : '12px 24px',
              backgroundColor: '#f59e0b',
              border: 'none',
              borderRadius: 30,
              color: 'white',
              fontSize: isMobile ? 13 : 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
            }}
          >
            <span style={{ fontSize: 18 }}>⚡</span>
            CJ'den Ürün Ekle
          </button>

          {/* Manuel Ürün Ekle Butonu */}
          <button
            onClick={() => navigate('/admin/physical-products/add')}
            style={{
              padding: isMobile ? '10px 16px' : '12px 24px',
              backgroundColor: '#0ea5e9',
              border: 'none',
              borderRadius: 30,
              color: 'white',
              fontSize: isMobile ? 13 : 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(14,165,233,0.3)'
            }}
          >
            <span className="material-icons-round" style={{ fontSize: 18 }}>add</span>
            Manuel Ürün Ekle
          </button>
        </div>
      </div>

      {/* Metric Kartları */}
      <div className="grid-4" style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
        gap: isMobile ? 10 : 20,
        marginBottom: 32
      }}>
        {/* Toplam Fiziksel Ürün */}
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
              <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: isMobile ? 20 : 24 }}>inventory</span>
            </div>
            <span style={{
              color: '#10b981',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              +{products.length}
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            TOPLAM ÜRÜN
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>{products.length}</div>
        </div>

        {/* Stoktaki Ürünler */}
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
              <span className="material-icons-round" style={{ color: '#10b981', fontSize: isMobile ? 20 : 24 }}>check_circle</span>
            </div>
            <span style={{
              color: colors.textSecondary,
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              Stokta
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            STOKTAKİ ÜRÜN
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>{inStockProducts}</div>
        </div>

        {/* Tükenen Ürünler */}
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
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#f43f5e', fontSize: isMobile ? 20 : 24 }}>block</span>
            </div>
            <span style={{
              color: '#f43f5e',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              {outOfStockProducts}
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            TÜKENEN ÜRÜN
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>{outOfStockProducts}</div>
        </div>

        {/* Toplam Stok Değeri */}
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
              <span className="material-icons-round" style={{ color: '#a855f7', fontSize: isMobile ? 20 : 24 }}>attach_money</span>
            </div>
            <span style={{
              color: '#a855f7',
              fontSize: isMobile ? 11 : 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              padding: isMobile ? '2px 8px' : '4px 10px',
              borderRadius: 20
            }}>
              Değer
            </span>
          </div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: colors.textSecondary, marginBottom: isMobile ? 4 : 6 }}>
            STOK DEĞERİ
          </div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 'bold', color: colors.text }}>
            ${totalValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? 12 : 0,
        marginBottom: 24
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          {/* Durum Filtresi */}
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
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '6px 16px',
                backgroundColor: statusFilter === 'all' ? '#0ea5e9' : 'transparent',
                border: 'none',
                borderRadius: 30,
                color: statusFilter === 'all' ? 'white' : colors.textSecondary,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              style={{
                padding: '6px 16px',
                backgroundColor: statusFilter === 'published' ? '#10b981' : 'transparent',
                border: 'none',
                borderRadius: 30,
                color: statusFilter === 'published' ? 'white' : colors.textSecondary,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Yayında
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              style={{
                padding: '6px 16px',
                backgroundColor: statusFilter === 'draft' ? '#f59e0b' : 'transparent',
                border: 'none',
                borderRadius: 30,
                color: statusFilter === 'draft' ? 'white' : colors.textSecondary,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Taslak
            </button>
          </div>

          {/* Tedarikçi Filtresi */}
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            style={{
              padding: '6px 16px',
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 30,
              color: colors.text,
              fontSize: 13,
              outline: 'none'
            }}
          >
            <option value="all">Tüm Tedarikçiler</option>
            <option value="autods">🚀 AutoDS</option>
            <option value="cj">⚡ CJ Dropshipping</option>
            <option value="">❌ Tedarikçisiz</option>
          </select>
        </div>

        {/* Toplu işlemler */}
        {selectedProducts.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            width: isMobile ? '100%' : 'auto'
          }}>
            <div style={{ fontSize: 13, color: colors.textSecondary }}>
              {selectedProducts.length} ürün seçildi
            </div>
            <button
              onClick={() => setBulkDeleteModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: isMobile ? '6px 10px' : '6px 12px',
                backgroundColor: '#ef4444',
                border: 'none',
                borderRadius: 6,
                color: 'white',
                fontSize: isMobile ? 12 : 13,
                cursor: 'pointer'
              }}
            >
              <span className="material-icons-round" style={{ fontSize: isMobile ? 16 : 18 }}>delete</span>
              <span>{isMobile ? 'Sil' : 'Seçilenleri Sil'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Ürün Listesi Tablosu */}
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden'
      }}>
        <div style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {/* Tablo Başlığı */}
          <div style={{
            display: 'flex',
            minWidth: isMobile ? '1000px' : '100%',
            padding: '16px 24px',
            backgroundColor: colors.bg,
            borderBottom: `1px solid ${colors.border}`,
            fontSize: 13,
            fontWeight: 500,
            color: colors.textSecondary,
            textTransform: 'uppercase',
            alignItems: 'center'
          }}>
            <div style={{ width: '40px', flexShrink: 0 }}>
              <input type="checkbox" onChange={toggleAll} />
            </div>
            <div style={{ width: '60px', flexShrink: 0 }}>GÖRSEL</div>
            <div style={{ flex: '2', minWidth: '200px' }}>ÜRÜN</div>
            <div style={{ flex: '1', minWidth: '120px' }}>TEDARİKÇİ</div>
            <div style={{ flex: '0.8', minWidth: '80px' }}>STOK</div>
            <div style={{ flex: '0.8', minWidth: '80px' }}>DURUM</div>
            <div style={{ flex: '0.8', minWidth: '80px' }}>FİYAT</div>
            <div style={{ width: '120px', flexShrink: 0 }}>İŞLEMLER</div>
          </div>

          {/* Ürün Satırları */}
          {currentProducts.map((product) => (
            <div
              key={product.id}
              style={{
                display: 'flex',
                minWidth: isMobile ? '1000px' : '100%',
                padding: '16px 24px',
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: selectedProducts.includes(product.id) ? 'rgba(14,165,233,0.1)' : colors.surface,
                alignItems: 'center'
              }}
            >
              {/* Checkbox */}
              <div style={{ width: '40px', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                />
              </div>

              {/* Görsel */}
              <div style={{ width: '60px', flexShrink: 0 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: colors.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20
                }}>
                  {product.supplier_logo || '📦'}
                </div>
              </div>

              {/* Ürün Bilgisi */}
              <div style={{ flex: '2', minWidth: '200px', paddingRight: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{product.name}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>SKU: {product.sku}</div>
              </div>

              {/* Tedarikçi */}
              <div style={{ flex: '1', minWidth: '120px' }}>
                {product.supplier_name ? (
                  <div>
                    <div style={{ fontSize: 13, color: colors.text }}>{product.supplier_name}</div>
                    <div style={{ fontSize: 11, color: colors.textSecondary }}>ID: {product.supplier_product_id}</div>
                  </div>
                ) : (
                  <span style={{ color: colors.textSecondary, fontSize: 12 }}>Tedarikçi Yok</span>
                )}
              </div>

              {/* Stok */}
              <div style={{ flex: '0.8', minWidth: '80px' }}>
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: product.stock_quantity > 10 ? '#10b981' : product.stock_quantity > 0 ? '#f59e0b' : '#ef4444'
                }}>
                  {product.stock_quantity}
                </span>
              </div>

              {/* Durum */}
              <div style={{ flex: '0.8', minWidth: '80px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  backgroundColor: product.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                  color: product.status === 'published' ? '#10b981' : '#f59e0b',
                  fontSize: 11,
                  borderRadius: 30
                }}>
                  {product.status === 'published' ? 'Yayında' : 'Taslak'}
                </span>
              </div>

              {/* Fiyat */}
              <div style={{ flex: '0.8', minWidth: '80px', fontSize: 14, fontWeight: 600, color: colors.text }}>
                ${product.base_price}
              </div>

              {/* İşlemler */}
              <div style={{ width: '120px', flexShrink: 0, display: 'flex', gap: 8 }}>
                <button onClick={() => navigate(`/physical-products/edit/${product.id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✏️</button>
                <button onClick={() => navigate(`/physical-products/view/${product.id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>👁️</button>
                <button onClick={() => handleDeleteClick(product.id, product.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>🗑️</button>
                {!product.supplier_id && (
                  <button onClick={() => navigate(`/admin/product-matching/${product.id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#f59e0b' }}>🔗</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sayfalama */}
      <div style={{
        marginTop: 24,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16
      }}>
        <div style={{ fontSize: 13, color: colors.textSecondary }}>
          {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, filteredProducts.length)} / {filteredProducts.length} ürün
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px',
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              color: currentPage === 1 ? colors.textSecondary : colors.text,
              cursor: currentPage === 1 ? 'default' : 'pointer'
            }}
          >
            Önceki
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: '6px 12px',
                background: currentPage === i + 1 ? colors.bg : 'none',
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: currentPage === i + 1 ? colors.text : colors.textSecondary
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '6px 12px',
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              color: currentPage === totalPages ? colors.textSecondary : colors.text,
              cursor: currentPage === totalPages ? 'default' : 'pointer'
            }}
          >
            Sonraki
          </button>
        </div>
      </div>

      {/* Silme Modalı */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Ürünü Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>"{productNameToDelete}"</strong> ürününü silmek istediğinize emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>İptal</Button>
          <Button onClick={handleConfirmDelete} color="error">Evet, Sil</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PhysicalProductsPage;