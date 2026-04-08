import { useState, useEffect } from 'react';
import { useMyProducts, useBulkDeleteProducts, useDeleteProduct } from '../server/FastAPI/product.hooks';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

interface ProductsPageProps {
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
}

const ProductsPage = ({ colors }: ProductsPageProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [productType, setProductType] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productNameToDelete, setProductNameToDelete] = useState('');
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [supplierFilter, setSupplierFilter] = useState('all');
  const productsPerPage = 7;
  const queryClient = useQueryClient();  // 👈 GERİ GETİR!
  const { data: products = [], isLoading, error } = useMyProducts();

  useEffect(() => {
    if (products.length > 0) {
      console.log('✅ API ÜRÜN FORMATI:', JSON.stringify(products[0], null, 2));
    }
  }, [products]);
  const deleteProduct = useDeleteProduct(productToDelete || '');
  const bulkDeleteProducts = useBulkDeleteProducts();
  const tumUrunler = products;
  const filteredProducts = tumUrunler.filter(product => {
    if (statusFilter !== 'all' && product.status !== statusFilter) {
      return false;
    }
    if (productType !== 'all') {
      if (product.product_type !== productType) {
        return false;
      }
    }
    return true;
  });
  useEffect(() => {
    console.log('🔥 products from hook:', products);
    console.log('📦 products length:', products.length);
    console.log('🎯 tumUrunler:', tumUrunler);
    console.log('📊 filteredProducts:', filteredProducts);
    console.log('🔍 statusFilter:', statusFilter);
    console.log('📦 productType:', productType);
  }, [products, tumUrunler, filteredProducts, statusFilter, productType]); // Bağımlılıkları da ekle
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  console.log('🔢 currentPage:', currentPage);
  console.log('🔢 productsPerPage:', productsPerPage);
  console.log('🔢 indexOfFirstProduct:', indexOfFirstProduct);
  console.log('🔢 indexOfLastProduct:', indexOfLastProduct);
  console.log('📦 filteredProducts.length:', filteredProducts.length);
  console.log('📦 currentProducts.length:', currentProducts.length);
  console.log('📦 currentProducts:', currentProducts);
  const totalProducts = filteredProducts.length;
  const archivedProducts = filteredProducts.filter(p => p.status === 'archived').length;
  const unsoldProducts = filteredProducts.filter(p => p.purchase_count === 0).length;
  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  const navigate = useNavigate();
  const handleDeleteClick = (productId: string, productName: string) => {
    setProductToDelete(productId);
    setProductNameToDelete(productName);
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct.mutateAsync({ permanent: false });
      setDeleteModalOpen(false);
      setProductToDelete(null);
      setProductNameToDelete('');
      queryClient.invalidateQueries({ queryKey: ['products', 'my'] });
    } catch (error) {
      console.error('❌ Silme hatası:', error);
    }
  };
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowWidth <= 768;
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{
            width: 40,
            height: 40,
            border: `3px solid ${colors.border}`,
            borderTopColor: '#0ea5e9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: colors.textSecondary }}>Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem',
        textAlign: 'center'
      }}>
        <div>
          <span className="material-icons-round" style={{
            fontSize: '3rem',
            color: '#ef4444',
            marginBottom: '1rem'
          }}>error</span>
          <h3 style={{ color: colors.text, marginBottom: '0.5rem' }}>Bir hata oluştu!</h3>
          <p style={{ color: colors.textSecondary }}>Ürünler yüklenirken hata oluştu. Lütfen tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Metric Kartları */}
      <div className="grid-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
        marginBottom: 32
      }}>
        {/* Toplam Ürün Sayısı */}
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
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: 24 }}>inventory</span>
            </div>
            <span style={{
              color: '#10b981',
              fontSize: 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: '4px 10px',
              borderRadius: 20
            }}>
              +12.5%
            </span>
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>TOTAL PRODUCTS</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>{totalProducts}</div>
        </div>

        {/* Arşivdeki Ürünler */}
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
              <span className="material-icons-round" style={{ color: '#a855f7', fontSize: 24 }}>archive</span>
            </div>
            <span style={{
              color: colors.textSecondary,
              fontSize: 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              padding: '4px 10px',
              borderRadius: 20
            }}>
              +28
            </span>
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>ARCHIVED PRODUCTS</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>{archivedProducts}</div>
        </div>

        {/* Satılmayan Ürünler */}
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
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#f43f5e', fontSize: 24 }}>block</span>
            </div>
            <span style={{
              color: '#f43f5e',
              fontSize: 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              padding: '4px 10px',
              borderRadius: 20
            }}>
              -3.2%
            </span>
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>UNSOLD PRODUCTS</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>{unsoldProducts}</div>
        </div>

        {/* Global Velocity */}
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
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: 24 }}>speed</span>
            </div>
            <span style={{
              color: '#0ea5e9',
              fontSize: 12,
              fontWeight: 'bold',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              padding: '4px 10px',
              borderRadius: 20
            }}>
              +5.2%
            </span>
          </div>
          <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>GLOBAL VELOCITY</div>
          <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>842 mph</div>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? 12 : 0,
        marginBottom: 24
      }}>
        {/* Filtre Butonları */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row', // Mobilde üst üste
          gap: isMobile ? 8 : 8,
          backgroundColor: isMobile ? 'transparent' : colors.surface, // Mobilde arkaplan yok
          padding: isMobile ? 0 : 4,
          borderRadius: 30,
          border: isMobile ? 'none' : `1px solid ${colors.border}`, // Mobilde border yok
          width: isMobile ? '100%' : 'auto'
        }}>
          <div style={{
            display: 'flex',
            gap: 8,
            width: '100%'
          }}>
            <button
              onClick={() => {
                setStatusFilter('all');
                setProductType('all');
              }}
              style={{
                flex: isMobile ? 1 : 'none', // Mobilde eşit genişlik
                padding: isMobile ? '10px 0' : '8px 24px',
                backgroundColor: statusFilter === 'all' && productType === 'all'
                  ? '#0ea5e9'
                  : isMobile ? colors.surface : 'transparent', // Mobilde arkaplanlı
                border: isMobile ? `1px solid ${colors.border}` : 'none',
                borderRadius: 30,
                color: statusFilter === 'all' && productType === 'all'
                  ? 'white'
                  : colors.textSecondary,
                fontSize: isMobile ? 14 : 14,
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              All
            </button>

            <button
              onClick={() => {
                setProductType('digital');
                setStatusFilter('all');
              }}
              style={{
                flex: isMobile ? 1 : 'none',
                padding: isMobile ? '10px 0' : '8px 24px',
                backgroundColor: productType === 'digital'
                  ? '#0ea5e9'
                  : isMobile ? colors.surface : 'transparent',
                border: isMobile ? `1px solid ${colors.border}` : 'none',
                borderRadius: 30,
                color: productType === 'digital' ? 'white' : colors.textSecondary,
                fontSize: isMobile ? 14 : 14,
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Digital
            </button>

            <button
              disabled={true}
              style={{
                flex: isMobile ? 1 : 'none',
                padding: isMobile ? '10px 0' : '8px 24px',
                backgroundColor: isMobile ? colors.surface : 'transparent',
                border: isMobile ? `1px solid ${colors.border}` : 'none',
                borderRadius: 30,
                color: colors.textSecondary,
                fontSize: isMobile ? 14 : 14,
                fontWeight: 500,
                cursor: 'not-allowed',
                textAlign: 'center',
                opacity: 0.5,
                position: 'relative'
              }}
            >
              Physical
              <span style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: '#f59e0b',
                color: 'white',
                fontSize: 9,
                padding: '2px 6px',
                borderRadius: 20,
                fontWeight: 600
              }}>
                Yakında
              </span>
            </button>
            {productType === 'physical' && (
              <select
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                style={{
                  padding: isMobile ? '10px 16px' : '8px 24px',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 30,
                  color: colors.text,
                  fontSize: isMobile ? 14 : 14,
                  outline: 'none',
                  cursor: 'pointer',
                  marginLeft: isMobile ? 0 : 8
                }}
              >
                <option value="all">Tüm Tedarikçiler</option>
                <option value="autods">🚀 AutoDS</option>
                <option value="cj">⚡ CJ Dropshipping</option>
                <option value="manual">✋ Manuel</option>
              </select>
            )}
            {productType === 'physical' && (
              <>
                <button
                  onClick={() => navigate('/cj-import')}
                  style={{
                    flex: isMobile ? 1 : 'none',
                    padding: isMobile ? '10px 16px' : '8px 24px',
                    backgroundColor: '#f59e0b',
                    border: 'none',
                    borderRadius: 30,
                    color: 'white',
                    fontSize: isMobile ? 14 : 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginLeft: isMobile ? 0 : 8
                  }}
                >
                  <span style={{ fontSize: 16 }}>⚡</span>
                  {isMobile ? 'CJ' : 'CJ\'den Ürün Ekle'}
                </button>




              </>
            )}


          </div>
        </div>

        {/* Arama Kutusu */}


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
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
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
        padding: 20
      }}>
        {/* BAŞLIK - İsteğe bağlı */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          paddingBottom: 12,
          borderBottom: `1px solid ${colors.border}`
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: colors.text, margin: 0 }}>
            🛍️ Ürünlerim
          </h2>
          <span style={{ color: colors.textSecondary, fontSize: 14 }}>
            {currentProducts.length} ürün
          </span>
        </div>

        {/* ÜRÜN KARTLARI GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20
        }}>
          {currentProducts.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                border: `1px solid ${colors.border}`,
                overflow: 'hidden',
                transition: 'all 0.2s',
                boxShadow: selectedProducts.includes(product.id)
                  ? `0 0 0 2px ${colors.primary}20, 0 4px 12px rgba(0,0,0,0.1)`
                  : '0 2px 8px rgba(0,0,0,0.04)',
                position: 'relative'
              }}
            >
              {/* SEÇİM CHECKBOX */}
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 2
              }}>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  style={{
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                    accentColor: colors.primary
                  }}
                />
              </div>

              {/* RESİM ALANI */}
              <div style={{
                height: 200,
                backgroundColor: colors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {product.feature_image_url ? (
                  <img
                    src={product.feature_image_url}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ) : (
                  <span style={{ fontSize: 48, opacity: 0.3 }}>📦</span>
                )}

                {/* TİP BADGE - Resim üstünde */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  backgroundColor: colors.surface + 'cc',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 10px',
                  borderRadius: 30,
                  fontSize: 11,
                  fontWeight: 600,
                  color: product.product_type === 'digital' ? '#0ea5e9' : '#a855f7',
                  border: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  {product.product_type === 'digital' ? '📱' : '📦'}
                  {product.product_type === 'digital' ? 'Dijital' : 'Fiziksel'}
                </div>
              </div>

              {/* ÜRÜN İÇERİĞİ */}
              <div style={{ padding: 16 }}>
                {/* ÜRÜN ADI (Uzun isimler için özel) */}
                <div style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.text,
                  lineHeight: 1.4,
                  marginBottom: 12,
                  minHeight: 44,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {product.name}
                </div>

                {/* TEDARİKÇİ ve DURUM */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  {/* TEDARİKÇİ */}
                  {product.supplier_name ? (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: colors.primary + '10',
                      padding: '4px 10px',
                      borderRadius: 30,
                      fontSize: 12,
                      fontWeight: 500,
                      color: colors.primary
                    }}>
                      <span style={{ fontSize: 14 }}>⚡</span>
                      CJ
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: colors.textSecondary }}>—</span>
                  )}

                  {/* DURUM */}
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: product.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(244,67,54,0.1)',
                    color: product.status === 'published' ? '#10b981' : '#ef4444',
                    fontSize: 11,
                    fontWeight: 500,
                    borderRadius: 30
                  }}>
                    {product.status === 'published' ? '✅ Yayında' : '✏️ Taslak'}
                  </span>
                </div>

                {/* FİYAT ve TARİH */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginBottom: 16,
                  padding: 12,
                  backgroundColor: colors.bg,
                  borderRadius: 12
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>Fiyat</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>
                      ${Number(product.base_price).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 2 }}>Eklenme</div>
                    <div style={{ fontSize: 13, color: colors.textSecondary }}>
                      {new Date(product.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </div>

                {/* TEDARİKÇİ DETAY (Varsa) */}
                {product.supplier_product_id && (
                  <div style={{
                    fontSize: 11,
                    color: colors.textSecondary,
                    marginBottom: 16,
                    padding: '8px 12px',
                    backgroundColor: colors.bg,
                    borderRadius: 8,
                    fontFamily: 'monospace'
                  }}>
                    🆔 {product.supplier_product_id}
                  </div>
                )}

                {/* İŞLEM BUTONLARI */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8
                }}>
                  <button
                    onClick={() => navigate(`/products/edit/${product.id}`)}
                    style={{
                      padding: '10px 0',
                      background: 'none',
                      border: `1px solid ${colors.border}`,
                      borderRadius: 30,
                      color: colors.text,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    ✏️ Düzenle
                  </button>
                  <button
                    onClick={() => navigate(`/products/view/${product.id}`)}
                    style={{
                      padding: '10px 0',
                      background: 'none',
                      border: `1px solid ${colors.border}`,
                      borderRadius: 30,
                      color: colors.text,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    👁️ Görüntüle
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product.id, product.name)}
                    style={{
                      padding: '10px 0',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: 30,
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                  >
                    🗑️ Sil
                  </button>
                </div>
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
        gap: isMobile ? 16 : 0
      }}>
        <div style={{ fontSize: 13, color: colors.textSecondary, textAlign: isMobile ? 'center' : 'left' }}>
          Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
        </div>

        <div style={{
          display: 'flex',
          gap: 4,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: isMobile ? '4px 8px' : '6px 12px',
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              color: currentPage === 1 ? colors.textSecondary : colors.text,
              fontSize: isMobile ? 12 : 13,
              cursor: currentPage === 1 ? 'default' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: isMobile ? '4px 8px' : '6px 12px',
                background: currentPage === i + 1 ? colors.bg : 'none',
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: currentPage === i + 1 ? colors.text : colors.textSecondary,
                fontSize: isMobile ? 12 : 13,
                cursor: 'pointer',
                minWidth: isMobile ? 32 : 36
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: isMobile ? '4px 8px' : '6px 12px',
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              color: currentPage === totalPages ? colors.textSecondary : colors.text,
              fontSize: isMobile ? 12 : 13,
              cursor: currentPage === totalPages ? 'default' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Silme Onay Modalı */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '8px'
          }
        }}
      >
        <DialogTitle style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '24px' }}>🗑️</span> Ürünü Sil
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: '#475569' }}>
            <strong>"{productNameToDelete}"</strong> ürününü silmek istediğinize emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px 24px' }}>
          <Button
            onClick={() => setDeleteModalOpen(false)}
            style={{
              color: '#64748b',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.9rem'
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={deleteProduct.isPending}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.9rem',
              padding: '6px 16px',
              marginLeft: '8px'
            }}
          >
            {deleteProduct.isPending ? 'Siliniyor...' : 'Evet, Sil'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Toplu Silme Onay Modalı */}
      {/* Toplu Silme Onay Modalı */}
      <Dialog
        open={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '8px'
          }
        }}
      >
        <DialogTitle style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '24px' }}>🗑️</span> Toplu Sil
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: '#475569' }}>
            <strong>{selectedProducts.length} ürünü</strong> silmek istediğinize emin misiniz?
          </DialogContentText>
          <div style={{
            marginTop: '16px',
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            {selectedProducts.map(id => {
              const product = products.find(p => p.id === id);
              return (
                <div key={id} style={{ padding: '4px 0', color: '#334155' }}>
                  • {product?.name}
                </div>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px 24px' }}>
          <Button
            onClick={() => setBulkDeleteModalOpen(false)}
            style={{
              color: '#64748b',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.9rem'
            }}
          >
            İptal
          </Button>
          <Button
            onClick={async () => {
              try {
                await bulkDeleteProducts.mutateAsync({
                  product_ids: selectedProducts,
                  permanent: false
                });

                setBulkDeleteModalOpen(false);
                setSelectedProducts([]);

              } catch (error) {
                console.error('❌ Toplu silme hatası:', error);
              }
            }}
            disabled={bulkDeleteProducts.isPending}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.9rem',
              padding: '6px 16px',
              marginLeft: '8px'
            }}
          >
            {bulkDeleteProducts.isPending ? 'Siliniyor...' : 'Evet, Hepsini Sil'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductsPage;