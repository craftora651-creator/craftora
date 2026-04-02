// EditProduct.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useUpdateProduct } from '../server/FastAPI/product.hooks';
import { useUploadFile } from '../server/Gin/upload.hooks';
import { FilePurpose, type UploadResponse } from '../types/upload.types';
import { ProductStatus } from '../types/product.types';
import type { ProductUpdateRequest } from '../types/product.types';
import { isAxiosError } from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: product, isLoading: productLoading } = useProduct(id || '');
    const updateProduct = useUpdateProduct(id || '');
    const uploadFile = useUploadFile();

    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    // State'ler
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        basePrice: '',
        compareAtPrice: '',
        sku: '',
        barcode: '',
        stockQuantity: 0,
        primaryCategory: '',
        tags: [] as string[],
        status: 'draft',
        featureImageUrl: '',
        imageGallery: [] as string[],
    });

    const [tagInput, setTagInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [updatedProductName, setUpdatedProductName] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Kullanıcı ID'si
    const userId = localStorage.getItem('user_id') || 'test-user-id';

    // Dark mode'u localStorage'a kaydet ve body bg ayarla
    useEffect(() => {
        localStorage.setItem('darkMode', String(isDarkMode));
        if (isDarkMode) {
            document.documentElement.style.backgroundColor = '#0f172a';
        } else {
            document.documentElement.style.backgroundColor = '#f8fafc';
        }
    }, [isDarkMode]);

    // Ürün verisi geldiğinde formu doldur
    useEffect(() => {
        if (product) {
            console.log('📦 Product:', product);
            const featureImageUrl = product.feature_image_url ? String(product.feature_image_url) : '';
            const imageGallery = product.image_gallery?.map(url => String(url)) || [];

            setFormData({
                name: product.name || '',
                description: product.description || '',
                shortDescription: product.short_description || '',
                basePrice: product.base_price?.toString() || '',
                compareAtPrice: product.compare_at_price?.toString() || '',
                sku: product.sku || '',
                barcode: product.barcode || '',
                stockQuantity: product.stock_quantity || 0,
                primaryCategory: product.primary_category || '',
                tags: product.tags || [],
                status: product.status || 'draft',
                featureImageUrl: featureImageUrl,
                imageGallery: imageGallery,
            });
        }
    }, [product]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const isMobile = windowWidth < 640;
    const isTablet = windowWidth < 1024;
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'stockQuantity') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: numericValue === '' ? 0 : parseInt(numericValue, 10)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleDeleteTag = (tagToDelete: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToDelete)
        }));
    };

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    // Görsel yükle
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !userId) return;
        const MAX_IMAGES = 10;
        const currentCount = formData.imageGallery.length;
        if (currentCount >= MAX_IMAGES) {
            alert(`❌ En fazla ${MAX_IMAGES} görsel yükleyebilirsiniz! (Şu an: ${currentCount})`);
            return;
        }

        const remainingSlots = MAX_IMAGES - currentCount;
        const filesToUpload = Array.from(files).slice(0, remainingSlots);

        if (files.length > remainingSlots) {
            alert(`⚠️ Sadece ${remainingSlots} görsel yüklenebilir. ${files.length - remainingSlots} görsel dikkate alınmadı.`);
        }
        setIsUploading(true);
        try {
            const uploadedUrls: string[] = [];
            for (const file of filesToUpload) {
                const result = await uploadFile.mutateAsync({
                    file,
                    userId,
                    purpose: FilePurpose.PRODUCT_COVER
                }) as UploadResponse;
                if (result?.file?.s3_url) {
                    uploadedUrls.push(String(result.file.s3_url));
                }
            }
            setFormData(prev => ({
                ...prev,
                imageGallery: [...prev.imageGallery, ...uploadedUrls],
                featureImageUrl: prev.featureImageUrl || uploadedUrls[0] || '',
            }));
            alert(`✅ ${uploadedUrls.length} görsel yüklendi! (${formData.imageGallery.length + uploadedUrls.length}/${MAX_IMAGES})`);
        } catch (error) {
            console.error('❌ Görsel yükleme hatası:', error);
            alert('❌ Görsel yüklenirken hata oluştu!');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSetFeatured = (imageUrl: string) => {
        setFormData(prev => ({ ...prev, featureImageUrl: imageUrl }));
    };

    const handleDeleteClick = (imageUrl: string) => {
        setImageToDelete(imageUrl);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (!imageToDelete) return;
        setFormData(prev => ({
            ...prev,
            imageGallery: prev.imageGallery.filter(img => img !== imageToDelete),
            featureImageUrl: prev.featureImageUrl === imageToDelete ? '' : prev.featureImageUrl,
        }));
        setShowDeleteModal(false);
        setImageToDelete(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const basePrice = formData.basePrice ? parseFloat(formData.basePrice) : undefined;
            const comparePrice = formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined;
            let status: ProductStatus | undefined;
            if (formData.status === 'draft') status = ProductStatus.DRAFT;
            else if (formData.status === 'published') status = ProductStatus.PUBLISHED;
            else if (formData.status === 'archived') status = ProductStatus.ARCHIVED;
            const updateData: ProductUpdateRequest = {
                ...(formData.name && { name: formData.name }),
                ...(formData.description && { description: formData.description }),
                ...(formData.shortDescription && { short_description: formData.shortDescription }),
                ...(basePrice && { base_price: basePrice }),
                ...(comparePrice && { compare_at_price: comparePrice }),
                ...(formData.sku && { sku: formData.sku }),
                ...(formData.barcode && { barcode: formData.barcode }),
                ...(formData.stockQuantity && { stock_quantity: formData.stockQuantity }),
                ...(formData.primaryCategory && { primary_category: formData.primaryCategory }),
                ...(formData.tags.length > 0 && { tags: formData.tags }),
                ...(status && { status }),
                ...(formData.featureImageUrl && { feature_image_url: formData.featureImageUrl }),
                ...(formData.imageGallery.length > 0 && { image_gallery: formData.imageGallery }),
            };
            console.log('📦 Gönderilen veri:', updateData);
            await updateProduct.mutateAsync(updateData);
            setUpdatedProductName(formData.name || product?.name || 'Ürün');
            setShowSuccessModal(true);

        } catch (error) {
            console.error('❌ Güncelleme hatası:', error);
            let message = 'Bilinmeyen hata';
            if (isAxiosError(error)) {
                if (error.response?.data) {
                    const responseData = error.response.data as { detail?: string; message?: string };
                    message = responseData?.detail || responseData?.message || error.message;
                } else {
                    message = error.message || 'Bağlantı hatası';
                }
            } else if (error instanceof Error) {
                message = error.message;
            }
            setErrorMessage(message);
            setShowErrorModal(true);
        }
    };

    // Loading
    if (productLoading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                gap: '1rem',
                backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: `3px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                    borderTopColor: '#0ea5e9',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: isDarkMode ? '#94a3b8' : '#475569' }}>Ürün bilgileri yükleniyor...</p>
            </div>
        );
    }

    // Ürün yoksa
    if (!product) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                gap: '1rem',
                backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc'
            }}>
                <h2 style={{ fontSize: '1.5rem', color: isDarkMode ? '#e2e8f0' : '#0f172a' }}>😕 Ürün Bulunamadı!</h2>
                <button
                    onClick={() => navigate('/admin/products')}
                    style={{
                        padding: '0.5rem 1rem',
                        background: '#0ea5e9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Ürünlere Dön
                </button>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
            color: isDarkMode ? '#e2e8f0' : '#0f172a'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: isMobile ? '1rem' : '2rem'
            }}>
                {/* Breadcrumbs */}
                <div style={{
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
                        <span className="material-icons" style={{ fontSize: '1rem' }}>dashboard</span>
                        Dashboard
                    </span>
                    <span style={{ color: isDarkMode ? '#475569' : '#cbd5e1' }}>/</span>
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
                        <span className="material-icons" style={{ fontSize: '1rem' }}>inventory_2</span>
                        Dijital Ürünler
                    </span>
                    <span style={{ color: isDarkMode ? '#475569' : '#cbd5e1' }}>/</span>
                    <span style={{
                        color: '#0ea5e9',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <span className="material-icons" style={{ fontSize: '1rem' }}>edit</span>
                        {product.name}
                    </span>
                </div>

                {/* Header */}
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'stretch' : 'center',
                    marginBottom: '2rem',
                    gap: '1rem'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
                            fontWeight: 700,
                            color: isDarkMode ? '#f1f5f9' : '#0f172a',
                            margin: '0 0 0.5rem 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>✏️</span> Ürünü Düzenle
                        </h1>
                        <p style={{
                            color: isDarkMode ? '#94a3b8' : '#475569',
                            margin: 0,
                            fontSize: 'clamp(0.875rem, 3vw, 0.95rem)'
                        }}>
                            Ürün bilgilerini güncelleyin
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: '1rem',
                        width: isMobile ? '100%' : 'auto'
                    }}>
                        <button
                            onClick={() => navigate(`/products/view/${product.id}`)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: isDarkMode ? '#1e293b' : '#ffffff',
                                border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                borderRadius: '10px',
                                color: isDarkMode ? '#e2e8f0' : '#475569',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                width: isMobile ? '100%' : 'auto'
                            }}
                        >
                            <span className="material-icons" style={{ fontSize: '1.25rem' }}>visibility</span>
                            Görüntüle
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={updateProduct.isPending || isUploading}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: updateProduct.isPending ? '#94a3b8' : 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                color: 'white',
                                cursor: updateProduct.isPending ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                opacity: updateProduct.isPending ? 0.6 : 1,
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                width: isMobile ? '100%' : 'auto'
                            }}
                        >
                            <span className="material-icons" style={{ fontSize: '1.25rem' }}>
                                {updateProduct.isPending ? 'hourglass_empty' : 'save'}
                            </span>
                            {updateProduct.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: isDarkMode ? '#334155' : '#f1f5f9',
                                border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                borderRadius: '10px',
                                color: isDarkMode ? '#f1f5f9' : '#475569',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                width: isMobile ? '100%' : 'auto'
                            }}
                        >
                            <span className="material-icons" style={{ fontSize: '1.25rem' }}>
                                {isDarkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                            {isDarkMode ? 'Açık Mod' : 'Koyu Mod'}
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile || isTablet ? '1fr' : '2fr 1fr',
                        gap: '2rem'
                    }}>
                        {/* Sol Kolon */}
                        <div>
                            {/* Görsel Galerisi */}
                            <div style={{
                                background: isDarkMode ? '#1e293b' : '#ffffff',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: isMobile ? 'column' : 'row',
                                    justifyContent: 'space-between',
                                    alignItems: isMobile ? 'stretch' : 'center',
                                    marginBottom: '1.5rem',
                                    gap: '1rem'
                                }}>
                                    <h2 style={{
                                        fontSize: '1.125rem',
                                        fontWeight: 600,
                                        color: isDarkMode ? '#f1f5f9' : '#0f172a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        margin: 0
                                    }}>
                                        <span className="material-icons" style={{ color: '#0ea5e9' }}>photo_library</span>
                                        Ürün Görselleri
                                    </h2>
                                    <label
                                        htmlFor="image-upload-header"
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: isDarkMode ? '#334155' : '#f8fafc',
                                            border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.875rem',
                                            color: isDarkMode ? '#e2e8f0' : '#475569',
                                            width: isMobile ? '100%' : 'auto'
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            id="image-upload-header"
                                            disabled={isUploading}
                                            style={{ display: 'none' }}
                                        />
                                        {isUploading ? (
                                            <>
                                                <div style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    border: `2px solid ${isDarkMode ? '#475569' : '#e2e8f0'}`,
                                                    borderTopColor: '#0ea5e9',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite'
                                                }} />
                                                Yükleniyor...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-icons" style={{ fontSize: '1.25rem' }}>cloud_upload</span>
                                                Görsel Yükle
                                            </>
                                        )}
                                    </label>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    {formData.imageGallery.map((img, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                position: 'relative',
                                                aspectRatio: '1',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                border: formData.featureImageUrl === img ? '2px solid #0ea5e9' : (isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0'),
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <img
                                                src={img}
                                                alt={`Ürün görseli ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'rgba(0,0,0,0.5)',
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetFeatured(img)}
                                                    style={{
                                                        background: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        padding: '6px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                    title="Öne çıkan yap"
                                                >
                                                    <span className="material-icons" style={{ fontSize: '1rem', color: '#f59e0b' }}>star</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick(img)}
                                                    style={{
                                                        background: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        padding: '6px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                    title="Sil"
                                                >
                                                    <span className="material-icons" style={{ fontSize: '1rem', color: '#ef4444' }}>delete</span>
                                                </button>
                                            </div>
                                            {formData.featureImageUrl === img && (
                                                <span style={{
                                                    position: 'absolute',
                                                    bottom: '4px',
                                                    left: '4px',
                                                    background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                                                    color: 'white',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.7rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '2px'
                                                }}>
                                                    <span className="material-icons" style={{ fontSize: '0.7rem' }}>star</span>
                                                    Öne Çıkan
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Temel Bilgiler */}
                            <div style={{
                                background: isDarkMode ? '#1e293b' : '#ffffff',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                marginBottom: '1.5rem'
                            }}>
                                <h2 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: isDarkMode ? '#f1f5f9' : '#0f172a',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span className="material-icons" style={{ color: '#0ea5e9' }}>info</span>
                                    Temel Bilgiler
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                    gap: '1rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: isDarkMode ? '#e2e8f0' : '#0f172a'
                                        }}>Ürün Adı *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Örn: Python Programlama Eğitimi"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                background: isDarkMode ? '#334155' : '#f8fafc',
                                                border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: isDarkMode ? '#e2e8f0' : '#0f172a'
                                        }}>Kategori</label>
                                        <select
                                            name="primaryCategory"
                                            value={formData.primaryCategory}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                background: isDarkMode ? '#334155' : '#f8fafc',
                                                border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                            }}
                                        >
                                            <option value="">Seçiniz</option>
                                            <option value="Roman">Roman</option>
                                            <option value="Bilim Kurgu">Bilim Kurgu</option>
                                            <option value="Tarih">Tarih</option>
                                            <option value="Felsefe">Felsefe</option>
                                            <option value="Eğitim">Eğitim</option>
                                            <option value="Yazılım">Yazılım</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: isDarkMode ? '#e2e8f0' : '#0f172a'
                                    }}>Açıklama</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={5}
                                        placeholder="Ürün içeriği hakkında detaylı bilgi verin..."
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            background: isDarkMode ? '#334155' : '#f8fafc',
                                            border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                            borderRadius: '10px',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            resize: 'vertical',
                                            color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Fiyat Bilgileri */}
                            <div style={{
                                background: isDarkMode ? '#1e293b' : '#ffffff',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                marginBottom: '1.5rem'
                            }}>
                                <h2 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: isDarkMode ? '#f1f5f9' : '#0f172a',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span className="material-icons" style={{ color: '#0ea5e9' }}>attach_money</span>
                                    Fiyat Bilgileri
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                    gap: '1rem'
                                }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: isDarkMode ? '#e2e8f0' : '#0f172a'
                                        }}>Fiyat (TL) *</label>
                                        <input
                                            type="number"
                                            name="basePrice"
                                            value={formData.basePrice}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                background: isDarkMode ? '#334155' : '#f8fafc',
                                                border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: isDarkMode ? '#e2e8f0' : '#0f172a'
                                        }}>İndirimli Fiyat</label>
                                        <input
                                            type="number"
                                            name="compareAtPrice"
                                            value={formData.compareAtPrice}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                background: isDarkMode ? '#334155' : '#f8fafc',
                                                border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stok ve Envanter */}
                            <div style={{
                                background: isDarkMode ? '#1e293b' : '#ffffff',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                marginBottom: '1.5rem'
                            }}>
                                <h2 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: isDarkMode ? '#f1f5f9' : '#0f172a',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span className="material-icons" style={{ color: '#0ea5e9' }}>inventory</span>
                                    Stok ve Envanter
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr 1fr' : '1fr 1fr 1fr'),
                                    gap: '1rem'
                                }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: isDarkMode ? '#e2e8f0' : '#0f172a'
                                        }}>SKU</label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleInputChange}
                                            placeholder="Ürün kodu"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                background: isDarkMode ? '#334155' : '#f8fafc',
                                                border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: isDarkMode ? '#e2e8f0' : '#0f172a'
                                        }}>Barkod</label>
                                        <input
                                            type="text"
                                            name="barcode"
                                            value={formData.barcode}
                                            onChange={handleInputChange}
                                            placeholder="Barkod numarası"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                background: isDarkMode ? '#334155' : '#f8fafc',
                                                border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: isDarkMode ? '#e2e8f0' : '#0f172a'
                                        }}>Stok Miktarı</label>
                                        <input
                                            type="number"
                                            name="stockQuantity"
                                            value={formData.stockQuantity}
                                            onChange={handleInputChange}
                                            min="0"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                background: isDarkMode ? '#334155' : '#f8fafc',
                                                border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                                borderRadius: '10px',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sağ Kolon */}
                        <div>
                            {/* Ürün Durumu */}
                            <div style={{
                                background: isDarkMode ? '#1e293b' : '#ffffff',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                marginBottom: '1.5rem'
                            }}>
                                <h2 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: isDarkMode ? '#f1f5f9' : '#0f172a',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span className="material-icons" style={{ color: '#0ea5e9' }}>settings</span>
                                    Ürün Durumu
                                </h2>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: isDarkMode ? '#e2e8f0' : '#0f172a'
                                    }}>Durum</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            background: isDarkMode ? '#334155' : '#f8fafc',
                                            border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                            borderRadius: '10px',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                        }}
                                    >
                                        <option value="draft">📝 Taslak</option>
                                        <option value="published">🚀 Yayında</option>
                                        <option value="archived">🗄️ Arşivlenmiş</option>
                                    </select>
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '0.75rem 1rem',
                                        background: isDarkMode ? '#0f172a' : '#f1f5f9',
                                        borderRadius: '8px',
                                        color: isDarkMode ? '#94a3b8' : '#334155',
                                        fontSize: '0.9rem'
                                    }}>
                                        <span className="material-icons" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '4px' }}>info</span>
                                        {formData.status === 'draft' && 'Ürün henüz yayında değil. Sadece siz görebilirsiniz.'}
                                        {formData.status === 'published' && 'Ürün mağazada görünür ve satışa açıktır.'}
                                        {formData.status === 'archived' && 'Ürün mağazadan kaldırıldı, ancak verileri duruyor.'}
                                    </div>
                                </div>
                            </div>

                            {/* Etiketler */}
                            <div style={{
                                background: isDarkMode ? '#1e293b' : '#ffffff',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                marginBottom: '1.5rem'
                            }}>
                                <h2 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: isDarkMode ? '#f1f5f9' : '#0f172a',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span className="material-icons" style={{ color: '#0ea5e9' }}>local_offer</span>
                                    Etiketler
                                </h2>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: isMobile ? 'column' : 'row',
                                    gap: '0.5rem',
                                    marginBottom: '1rem'
                                }}>
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={handleTagKeyPress}
                                        placeholder="Yeni etiket yazın"
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem 1rem',
                                            background: isDarkMode ? '#334155' : '#f8fafc',
                                            border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                            borderRadius: '10px',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            width: isMobile ? '100%' : 'auto',
                                            color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            background: '#0ea5e9',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                            width: isMobile ? '100%' : 'auto'
                                        }}
                                    >
                                        Ekle
                                    </button>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem'
                                }}>
                                    {formData.tags.map(tag => (
                                        <span
                                            key={tag}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                background: isDarkMode ? '#334155' : '#f1f5f9',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '8px',
                                                fontSize: '0.875rem',
                                                color: isDarkMode ? '#e2e8f0' : '#0f172a'
                                            }}
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTag(tag)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    color: isDarkMode ? '#94a3b8' : '#64748b',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '0'
                                                }}
                                            >
                                                <span className="material-icons" style={{ fontSize: '1rem' }}>close</span>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Kısa Açıklama */}
                            <div style={{
                                background: isDarkMode ? '#1e293b' : '#ffffff',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
                            }}>
                                <h2 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: isDarkMode ? '#f1f5f9' : '#0f172a',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span className="material-icons" style={{ color: '#0ea5e9' }}>description</span>
                                    Kısa Açıklama
                                </h2>
                                <div>
                                    <textarea
                                        name="shortDescription"
                                        value={formData.shortDescription}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Ürün özeti (max 300 karakter)"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            background: isDarkMode ? '#334155' : '#f8fafc',
                                            border: isDarkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                            borderRadius: '10px',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            resize: 'vertical',
                                            color: isDarkMode ? '#f1f5f9' : '#0f172a'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Silme Onay Modalı */}
                {showDeleteModal && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1rem'
                        }}
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <div
                            style={{
                                background: isDarkMode ? '#1e293b' : 'white',
                                borderRadius: '16px',
                                padding: '2rem',
                                maxWidth: '400px',
                                width: '100%'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 style={{
                                fontSize: '1.25rem',
                                marginBottom: '1rem',
                                color: isDarkMode ? '#f1f5f9' : '#0f172a',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span className="material-icons" style={{ color: '#ef4444' }}>warning</span>
                                Görseli Sil
                            </h3>
                            <p style={{
                                marginBottom: '1.5rem',
                                color: isDarkMode ? '#94a3b8' : '#475569'
                            }}>Bu görseli silmek istediğinize emin misiniz?</p>
                            <div style={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: '1rem',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: isDarkMode ? '#334155' : '#f1f5f9',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        color: isDarkMode ? '#e2e8f0' : '#475569',
                                        fontWeight: 500,
                                        width: isMobile ? '100%' : 'auto'
                                    }}
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        width: isMobile ? '100%' : 'auto'
                                    }}
                                >
                                    Evet, Sil
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            <Dialog
                open={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                PaperProps={{
                    style: {
                        borderRadius: '20px',
                        padding: '8px',
                        maxWidth: '400px',
                        width: '90%',
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff'
                    }
                }}
            >
                <DialogTitle style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '24px 24px 8px 24px'
                }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#10b981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span className="material-icons" style={{ color: 'white', fontSize: 28 }}>check</span>
                    </div>
                    Başarıyla Kaydedildi!
                </DialogTitle>
                <DialogContent style={{ padding: '8px 24px 16px 24px' }}>
                    <DialogContentText style={{ color: isDarkMode ? '#94a3b8' : '#475569', fontSize: '1rem' }}>
                        <strong style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>"{updatedProductName}"</strong> ürünü başarıyla güncellendi.
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{
                    padding: '16px 24px 24px 24px',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'stretch'
                }}>
                    <Button
                        onClick={() => {
                            setShowSuccessModal(false);
                            navigate(`/products/view/${id}`);
                        }}
                        style={{
                            backgroundColor: '#0ea5e9',
                            color: 'white',
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            padding: '10px 16px',
                            flex: 1,
                            borderRadius: '10px',
                            boxShadow: 'none'
                        }}
                    >
                        Ürünü Görüntüle
                    </Button>
                    <Button
                        onClick={() => {
                            setShowSuccessModal(false);
                            navigate('/admin/products');
                        }}
                        style={{
                            backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
                            color: isDarkMode ? '#e2e8f0' : '#334155',
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            padding: '10px 16px',
                            flex: 1,
                            borderRadius: '10px',
                            boxShadow: 'none'
                        }}
                    >
                        Ürünlere Dön
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Hata Modalı */}
            <Dialog
                open={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                PaperProps={{
                    style: {
                        borderRadius: '20px',
                        padding: '8px',
                        maxWidth: '400px',
                        width: '90%',
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff'
                    }
                }}
            >
                <DialogTitle style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: isDarkMode ? '#f1f5f9' : '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '24px 24px 8px 24px'
                }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#ef4444',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span className="material-icons" style={{ color: 'white', fontSize: 28 }}>error</span>
                    </div>
                    Hata Oluştu!
                </DialogTitle>
                <DialogContent style={{ padding: '8px 24px 16px 24px' }}>
                    <DialogContentText style={{ color: isDarkMode ? '#94a3b8' : '#475569', fontSize: '1rem' }}>
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{
                    padding: '16px 24px 24px 24px',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <Button
                        onClick={() => setShowErrorModal(false)}
                        style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                            padding: '10px 24px',
                            borderRadius: '10px',
                            boxShadow: 'none'
                        }}
                    >
                        Tamam
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditProduct;