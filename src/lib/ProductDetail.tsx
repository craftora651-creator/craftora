import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../server/FastAPI/product.hooks';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'details' | 'files' | 'stats' | 'seo' | 'variants'>('details');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [zoomImage, setZoomImage] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const { data: product, isLoading, error } = useProduct(id || '');

    const getImageUrl = (url: string | null | undefined): string | null => {
        if (!url) return null;
        return url;
    };

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;

    // Responsive grid helper
    const getGridColumns = (desktop: string, tablet: string, mobile: string) => {
        if (isMobile) return mobile;
        if (isTablet) return tablet;
        return desktop;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        border: '3px solid #e2e8f0',
                        borderTopColor: '#0ea5e9',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p style={{ color: '#475569', fontWeight: 500 }}>Ürün detayları yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '24px',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '100%'
                }}>
                    <div style={{
                        fontSize: '4rem',
                        color: '#ef4444',
                        marginBottom: '1.5rem'
                    }}>😕</div>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        marginBottom: '0.5rem'
                    }}>Ürün Bulunamadı</h2>
                    <p style={{
                        color: '#64748b',
                        marginBottom: '2rem'
                    }}>Ürün silinmiş veya mevcut değil</p>
                    <button
                        onClick={() => navigate('/admin/products')}
                        style={{
                            padding: '0.75rem 2rem',
                            background: '#0ea5e9',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#0284c7'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#0ea5e9'}
                    >
                        Ürünlere Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page"
         style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            padding: isMobile ? '1rem' : '2rem'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Breadcrumb - Sadece desktop */}
                {/* Breadcrumb - Sadece desktop */}
                <div className="desktop-only" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    fontSize: '0.875rem',
                    flexWrap: 'wrap'
                }}>
                    <span
                        onClick={() => navigate('/admin')}
                        style={{
                            color: '#0ea5e9',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '1rem' }}>dashboard</span>
                        Dashboard
                    </span>
                    <span style={{ color: '#cbd5e1' }}>/</span>
                    <span
                        onClick={() => navigate('/admin/products')}
                        style={{
                            color: '#0ea5e9',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: '1rem' }}>inventory_2</span>
                        Ürünler
                    </span>
                    <span style={{ color: '#cbd5e1' }}>/</span>
                    <span style={{
                        color: '#0ea5e9',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: '1rem' }}>visibility</span>
                        {product.name}
                    </span>
                </div>

                {/* Header Actions */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 5vw, 1.875rem)',
                            fontWeight: 600,
                            color: '#0f172a',
                            margin: '0 0 0.25rem 0'
                        }}>{product.name}</h1>
                        <p className="product-meta" style={{
                            fontSize: 'clamp(0.75rem, 4vw, 0.875rem)',
                            color: '#64748b',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                        }}>
                            <span>ID: {product.id}</span>
                            <span>•</span>
                            <span>Oluşturulma: {formatDate(product.created_at)}</span>
                        </p>
                    </div>
                    <div className="header-actions" style={{
                        display: 'flex',
                        gap: '0.75rem',
                        width: isMobile ? '100%' : 'auto',
                        flexDirection: 'row',
                        justifyContent: isMobile ? 'space-between' : 'flex-end'
                    }}>
                        <button
                            onClick={() => navigate(`/products/edit/${product.id}`)}
                            style={{
                                padding: '0.625rem 1.25rem',
                                background: '#0ea5e9',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#0284c7'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#0ea5e9'}
                        >
                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>edit</span>
                            <span className="action-text">Düzenle</span>
                        </button>


                    </div>
                </div>

                {/* Main Grid */}
                <div className="product-detail-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr' : '1fr 1.2fr'),
                    gap: '2rem'
                }}>
                    {/* Sol Kolon - Görsel Galeri */}
                    <div>
                        <div className="sticky-column" style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            border: '1px solid #e2e8f0',
                            position: isMobile ? 'relative' : 'sticky',
                            top: '2rem'
                        }}>
                            {/* Ana Görsel */}
                            <div
                                style={{
                                    aspectRatio: '1',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    marginBottom: '1.5rem',
                                    backgroundColor: '#f8fafc',
                                    cursor: zoomImage ? 'zoom-out' : 'zoom-in',
                                    transition: 'all 0.3s'
                                }}
                                onClick={() => setZoomImage(!zoomImage)}
                            >
                                {selectedImage || product.feature_image_url ? (
                                    <img
                                        src={getImageUrl(selectedImage || product.feature_image_url) || ''}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: zoomImage ? 'contain' : 'cover',
                                            transition: 'all 0.3s'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#94a3b8'
                                    }}>
                                        <span className="material-icons-round" style={{ fontSize: '4rem', marginBottom: '1rem' }}>image</span>
                                        <span>Görsel Yok</span>
                                    </div>
                                )}
                            </div>

                            {/* Galeri Thumbnail'leri */}
                            {(product.image_gallery?.length > 0 || product.feature_image_url) && (
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '1rem'
                                    }}>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: '#0f172a'
                                        }}>Ürün Görselleri</span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: '#64748b'
                                        }}>
                                            {product.image_gallery?.length ? product.image_gallery.length + (product.feature_image_url ? 1 : 0) : 1} görsel
                                        </span>
                                    </div>
                                    <div className="thumbnail-grid" style={{
                                        display: 'grid',
                                        gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : (isTablet ? 'repeat(5, 1fr)' : 'repeat(auto-fill, minmax(80px, 1fr))'),
                                        gap: '0.75rem'
                                    }}>
                                        {product.feature_image_url && (
                                            <div
                                                onClick={() => setSelectedImage(null)}
                                                style={{
                                                    aspectRatio: '1',
                                                    borderRadius: '10px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    border: !selectedImage ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                                                    position: 'relative',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <img
                                                    src={getImageUrl(product.feature_image_url) || ''}
                                                    alt="feature"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                {!selectedImage && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: 'rgba(14,165,233,0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: '1.25rem' }}>check</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {product.image_gallery?.map((img, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setSelectedImage(img)}
                                                style={{
                                                    aspectRatio: '1',
                                                    borderRadius: '10px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    border: selectedImage === img ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                                                    position: 'relative',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <img
                                                    src={getImageUrl(img) || ''}
                                                    alt={`gallery-${index}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                {selectedImage === img && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: 'rgba(14,165,233,0.1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <span className="material-icons-round" style={{ color: '#0ea5e9', fontSize: '1.25rem' }}>check</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Hızlı İşlemler */}
                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                background: '#f8fafc',
                                borderRadius: '16px'
                            }}>
                                <h3 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    margin: '0 0 1rem 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span className="material-icons-round" style={{ fontSize: '1.25rem', color: '#64748b' }}>bolt</span>
                                    Hızlı İşlemler
                                </h3>
                                <div className="quick-actions" style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.75rem'
                                }}>
                                    <button style={{
                                        padding: '0.75rem',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        color: '#475569',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.borderColor = '#cbd5e1';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                        }}>
                                        <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>content_copy</span>
                                        Kopyala
                                    </button>
                                    <button style={{
                                        padding: '0.75rem',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        color: '#475569',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.borderColor = '#cbd5e1';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                        }}>
                                        <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>archive</span>
                                        Arşivle
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Kolon - Ürün Bilgileri */}
                    <div>
                        <div style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '2rem',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            border: '1px solid #e2e8f0'
                        }}>
                            {/* Status Badges */}
                            <div className="status-badges" style={{
                                display: 'flex',
                                gap: '0.75rem',
                                marginBottom: '1.5rem',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{
                                    padding: '0.375rem 1rem',
                                    background: product.status === 'published' ? '#10b98115' : '#f59e0b15',
                                    color: product.status === 'published' ? '#10b981' : '#f59e0b',
                                    borderRadius: '30px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem'
                                }}>
                                    <span className="material-icons-round" style={{ fontSize: '1rem' }}>
                                        {product.status === 'published' ? 'check_circle' : 'access_time'}
                                    </span>
                                    {product.status === 'published' ? 'Yayında' : 'Taslak'}
                                </span>
                                <span style={{
                                    padding: '0.375rem 1rem',
                                    background: product.product_type === 'digital' ? '#8b5cf615' : '#f9731615',
                                    color: product.product_type === 'digital' ? '#8b5cf6' : '#f97316',
                                    borderRadius: '30px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem'
                                }}>
                                    <span className="material-icons-round" style={{ fontSize: '1rem' }}>
                                        {product.product_type === 'digital' ? 'cloud' : 'inventory'}
                                    </span>
                                    {product.product_type === 'digital' ? 'Dijital Ürün' : 'Fiziksel Ürün'}
                                </span>
                                {product.is_featured && (
                                    <span style={{
                                        padding: '0.375rem 1rem',
                                        background: '#8b5cf615',
                                        color: '#8b5cf6',
                                        borderRadius: '30px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.375rem'
                                    }}>
                                        <span className="material-icons-round" style={{ fontSize: '1rem' }}>star</span>
                                        Öne Çıkan
                                    </span>
                                )}
                            </div>

                            {/* Fiyat Bilgileri */}
                            <div className="price-card" style={{
                                marginBottom: '2rem',
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                                borderRadius: '16px',
                                color: 'white'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: '1rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    {/* İndirimli fiyat (varsa compare_at_price, yoksa base_price) */}
                                    <span style={{
                                        fontSize: '2.5rem',
                                        fontWeight: 700
                                    }}>
                                        {formatCurrency(product.compare_at_price || product.base_price)}
                                    </span>

                                    {/* Normal fiyat (eğer compare_at_price varsa base_price'ı çiz) */}
                                    {product.compare_at_price && (
                                        <span style={{
                                            fontSize: '1.25rem',
                                            opacity: 0.8,
                                            textDecoration: 'line-through'
                                        }}>
                                            {formatCurrency(product.base_price)}
                                        </span>
                                    )}
                                </div>

                                {/* İndirim oranı */}
                                {product.compare_at_price && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.875rem',
                                        opacity: 0.9
                                    }}>
                                        <span className="material-icons-round" style={{ fontSize: '1rem' }}>savings</span>
                                        <span>
                                            İndirim: %{Math.round((1 - product.compare_at_price / product.base_price) * 100)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Detaylı Bilgi Kartları */}
                            <div className="info-cards" style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                                gap: '1rem',
                                marginBottom: '2rem'
                            }}>
                                <div style={{
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Stok Durumu</div>
                                    <div style={{
                                        fontSize: '1.125rem',
                                        fontWeight: 600,
                                        color: product.stock_quantity > 0 ? '#10b981' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>
                                            {product.stock_quantity > 0 ? 'inventory' : 'inventory_2'}
                                        </span>
                                        {product.stock_quantity > 0 ? `${product.stock_quantity} adet` : 'Stokta Yok'}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Kategori</div>
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span className="material-icons-round" style={{ fontSize: '1.25rem', color: '#64748b' }}>folder</span>
                                        {product.primary_category || 'Kategorisiz'}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>SKU</div>
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span className="material-icons-round" style={{ fontSize: '1.25rem', color: '#64748b' }}>qr_code_scanner</span>
                                        {product.sku || '-'}
                                    </div>
                                </div>
                                <div style={{
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Barkod</div>
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        color: '#0f172a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span className="material-icons-round" style={{ fontSize: '1.25rem', color: '#64748b' }}>tag</span> {/* tag icon */}
                                        {product.barcode ? product.barcode.replace(/[<>]/g, '').trim() : '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Tab Menü */}
                            <div className="tab-menu" style={{
                                borderBottom: '1px solid #e2e8f0',
                                marginBottom: '1.5rem',
                                overflowX: 'auto',
                                whiteSpace: 'nowrap'
                            }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {[
                                        { id: 'details', label: 'Detaylar', icon: 'info' },
                                        { id: 'files', label: 'Dosyalar', icon: 'description' },
                                        { id: 'stats', label: 'İstatistikler', icon: 'bar_chart' },
                                        { id: 'seo', label: 'SEO', icon: 'search' },
                                        { id: 'variants', label: 'Varyantlar', icon: 'layers' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            style={{
                                                padding: '0.75rem 1.25rem',
                                                background: 'none',
                                                border: 'none',
                                                borderBottom: activeTab === tab.id ? '2px solid #0ea5e9' : '2px solid transparent',
                                                color: activeTab === tab.id ? '#0ea5e9' : '#64748b',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>
                                                {tab.icon}
                                            </span>
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab İçerikleri - Bu kısım aynen devam ediyor */}
                            <div>
                                {/* Detaylar Tab */}
                                {activeTab === 'details' && (
                                    <div>
                                        {/* Açıklama */}
                                        {product.description && (
                                            <div style={{ marginBottom: '2rem' }}>
                                                <h3 style={{
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    color: '#0f172a',
                                                    marginBottom: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    <span className="material-icons-round" style={{ color: '#64748b' }}>description</span>
                                                    Ürün Açıklaması
                                                </h3>
                                                <div style={{
                                                    fontSize: '0.9375rem',
                                                    color: '#475569',
                                                    lineHeight: '1.7',
                                                    background: '#f8fafc',
                                                    padding: '1.5rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    {product.description}
                                                </div>
                                            </div>
                                        )}

                                        {/* Teknik Detaylar */}
                                        <div style={{ marginBottom: '2rem' }}>
                                            <h3 style={{
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                color: '#0f172a',
                                                marginBottom: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <span className="material-icons-round" style={{ color: '#64748b' }}>engineering</span>
                                                Teknik Detaylar
                                            </h3>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                                                gap: '1rem'
                                            }}>
                                                {product.weight && (
                                                    <div style={{
                                                        padding: '0.75rem',
                                                        background: '#f8fafc',
                                                        borderRadius: '8px',
                                                        border: '1px solid #e2e8f0'
                                                    }}>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ağırlık</div>
                                                        <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#0f172a' }}>{product.weight} kg</div>
                                                    </div>
                                                )}
                                                {product.dimensions && (
                                                    <>
                                                        <div style={{
                                                            padding: '0.75rem',
                                                            background: '#f8fafc',
                                                            borderRadius: '8px',
                                                            border: '1px solid #e2e8f0'
                                                        }}>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Uzunluk</div>
                                                            <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#0f172a' }}>{product.dimensions.length} cm</div>
                                                        </div>
                                                        <div style={{
                                                            padding: '0.75rem',
                                                            background: '#f8fafc',
                                                            borderRadius: '8px',
                                                            border: '1px solid #e2e8f0'
                                                        }}>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Genişlik</div>
                                                            <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#0f172a' }}>{product.dimensions.width} cm</div>
                                                        </div>
                                                        <div style={{
                                                            padding: '0.75rem',
                                                            background: '#f8fafc',
                                                            borderRadius: '8px',
                                                            border: '1px solid #e2e8f0'
                                                        }}>
                                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Yükseklik</div>
                                                            <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#0f172a' }}>{product.dimensions.height} cm</div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Etiketler */}
                                        {product.tags && product.tags.length > 0 && (
                                            <div>
                                                <h3 style={{
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    color: '#0f172a',
                                                    marginBottom: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    <span className="material-icons-round" style={{ color: '#64748b' }}>local_offer</span>
                                                    Etiketler
                                                </h3>
                                                <div style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '0.5rem'
                                                }}>
                                                    {product.tags.map(tag => (
                                                        <span key={tag} style={{
                                                            padding: '0.375rem 1rem',
                                                            background: '#f1f5f9',
                                                            color: '#475569',
                                                            borderRadius: '30px',
                                                            fontSize: '0.8125rem',
                                                            fontWeight: 500,
                                                            border: '1px solid #e2e8f0'
                                                        }}>
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Dosyalar Tab */}
                                {activeTab === 'files' && (
                                    <div>
                                        {product.product_type === 'digital' ? (
                                            <div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '1.25rem',
                                                    background: '#f8fafc',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{
                                                            width: '48px',
                                                            height: '48px',
                                                            background: '#e2e8f0',
                                                            borderRadius: '12px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#64748b'
                                                        }}>
                                                            <span className="material-icons-round" style={{ fontSize: '1.75rem' }}>insert_drive_file</span>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>
                                                                {product.file_name || 'Dosya adı belirtilmemiş'}
                                                            </div>
                                                            {product.file_size && (
                                                                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                                                                    {(product.file_size / 1024 / 1024).toFixed(2)} MB • {product.file_type || 'Bilinmeyen tip'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {product.file_url && (
                                                        <a
                                                            href={product.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                padding: '0.625rem 1.25rem',
                                                                background: '#0ea5e9',
                                                                color: 'white',
                                                                borderRadius: '10px',
                                                                textDecoration: 'none',
                                                                fontSize: '0.875rem',
                                                                fontWeight: 500,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#0284c7'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = '#0ea5e9'}
                                                        >
                                                            <span className="material-icons-round" style={{ fontSize: '1.25rem' }}>download</span>
                                                            İndir
                                                        </a>
                                                    )}
                                                </div>
                                                <p style={{
                                                    fontSize: '0.8125rem',
                                                    color: '#64748b',
                                                    marginTop: '0.75rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}>
                                                    <span className="material-icons-round" style={{ fontSize: '1rem' }}>info</span>
                                                    Bu dosya müşteriler tarafından satın alındıktan sonra indirilebilir.
                                                </p>
                                            </div>
                                        ) : (
                                            <div style={{
                                                padding: '2rem',
                                                textAlign: 'center',
                                                background: '#f8fafc',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <span className="material-icons-round" style={{ fontSize: '3rem', color: '#94a3b8', marginBottom: '1rem' }}>inventory</span>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                                                    Fiziksel Ürün
                                                </h3>
                                                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                                    Bu ürün fiziksel olduğu için dosya bulunmuyor.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* İstatistikler Tab */}
                                {activeTab === 'stats' && (
                                    <div>
                                        {/* Ana Metrikler */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                                            gap: '1rem',
                                            marginBottom: '2rem'
                                        }}>
                                            {[
                                                { icon: 'visibility', value: product.view_count || 0, label: 'Görüntülenme', change: '+12%' },
                                                { icon: 'shopping_cart', value: product.purchase_count || 0, label: 'Satış', change: '+5%' },
                                                { icon: 'star', value: product.average_rating || '0.0', label: `Puan (${product.review_count || 0} yorum)`, change: '+0.2' },
                                                { icon: 'favorite', value: product.wishlist_count || 0, label: 'Favori', change: '+8%' }
                                            ].map((stat, index) => (
                                                <div key={index} style={{
                                                    padding: '1.25rem',
                                                    background: '#f8fafc',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                        <span className="material-icons-round" style={{ color: '#64748b' }}>{stat.icon}</span>
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            color: '#10b981',
                                                            background: '#10b98115',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '20px'
                                                        }}>{stat.change}</span>
                                                    </div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{stat.value}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Son Siparişler */}
                                        <div>
                                            <h3 style={{
                                                fontSize: '1rem',
                                                fontWeight: 600,
                                                color: '#0f172a',
                                                marginBottom: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <span className="material-icons-round" style={{ color: '#64748b' }}>receipt</span>
                                                Son Siparişler
                                            </h3>
                                            <div style={{
                                                background: '#f8fafc',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    padding: '1rem',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'auto 1fr auto',
                                                    gap: '1rem',
                                                    alignItems: 'center'
                                                }}>
                                                    <span className="material-icons-round" style={{ color: '#10b981' }}>check_circle</span>
                                                    <div>
                                                        <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#0f172a' }}>#SIP-2024-001</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>2 gün önce</div>
                                                    </div>
                                                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a' }}>₺1.299</div>
                                                </div>
                                                <div style={{
                                                    padding: '1rem',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'auto 1fr auto',
                                                    gap: '1rem',
                                                    alignItems: 'center'
                                                }}>
                                                    <span className="material-icons-round" style={{ color: '#f59e0b' }}>pending</span>
                                                    <div>
                                                        <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#0f172a' }}>#SIP-2024-002</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>5 gün önce</div>
                                                    </div>
                                                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a' }}>₺899</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SEO Tab */}
                                {activeTab === 'seo' && (
                                    <div>
                                        <div style={{
                                            padding: '1.5rem',
                                            background: '#f8fafc',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>SEO Başlığı</div>
                                                <div style={{
                                                    fontSize: '1rem',
                                                    fontWeight: 500,
                                                    color: '#0f172a',
                                                    padding: '0.75rem',
                                                    background: 'white',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    {product.seo_title || product.name}
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Meta Açıklama</div>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    color: '#475569',
                                                    padding: '0.75rem',
                                                    background: 'white',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    {product.meta_description || product.description?.substring(0, 160) || 'Meta açıklama bulunmuyor.'}
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>SEO URL</div>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    color: '#0ea5e9',
                                                    padding: '0.75rem',
                                                    background: 'white',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    /{product.slug || 'urun'}/{product.id}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Anahtar Kelimeler</div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '0.5rem'
                                                }}>
                                                    {(product.seo_keywords || ['ürün', 'e-ticaret', 'satılık']).map((keyword, index) => (
                                                        <span key={index} style={{
                                                            padding: '0.375rem 1rem',
                                                            background: 'white',
                                                            color: '#475569',
                                                            borderRadius: '30px',
                                                            fontSize: '0.8125rem',
                                                            border: '1px solid #e2e8f0'
                                                        }}>
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Varyantlar Tab */}
                                {activeTab === 'variants' && (
                                    <div>
                                        {product.variants && product.variants.length > 0 ? (
                                            <div style={{
                                                background: '#f8fafc',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0',
                                                overflow: 'hidden'
                                            }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: '#f1f5f9' }}>
                                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Varyant</th>
                                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>SKU</th>
                                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Fiyat</th>
                                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Stok</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {product.variants.map((variant, index) => (
                                                            <tr key={index} style={{ borderTop: '1px solid #e2e8f0' }}>
                                                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#0f172a' }}>{variant.name}</td>
                                                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{variant.sku}</td>
                                                                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{formatCurrency(variant.price)}</td>
                                                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: variant.stock > 0 ? '#10b981' : '#ef4444' }}>{variant.stock}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div style={{
                                                padding: '2rem',
                                                textAlign: 'center',
                                                background: '#f8fafc',
                                                borderRadius: '12px',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                <span className="material-icons-round" style={{ fontSize: '3rem', color: '#94a3b8', marginBottom: '1rem' }}>layers</span>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                                                    Varyant Bulunmuyor
                                                </h3>
                                                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                                    Bu ürün için henüz varyant eklenmemiş.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;