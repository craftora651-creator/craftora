import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Card,
    CardMedia,
    Chip,
    CircularProgress,
    Box,
    IconButton,
    InputAdornment,
    Breadcrumbs,
    Link,
    Avatar,
    Collapse,
    Fade
} from '@mui/material';
import {
    FaArrowLeft,
    FaLink,
    FaCheck,
    FaCopy,
    FaRocket,
    FaLightbulb,
    FaCrown,
    FaExternalLinkAlt
} from 'react-icons/fa';
import { useFetchCJProduct, type CJProduct } from '../server/FastAPI/cj.hooks';
import { useMyShops } from '../server/FastAPI/shop.hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateProduct } from '../server/FastAPI/product.hooks';
import { ProductStatus, FulfillmentType, type Currency, type ProductType } from '../types/product.types';

const CJProductImport = () => {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<CJProduct | null>(null);
    const [loading, setLoading] = useState(false);
    const [markupPercent, setMarkupPercent] = useState(20);
    const [copied, setCopied] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [imageError, setImageError] = useState(false);
    const queryClient = useQueryClient();
    const { data: shops } = useMyShops();
    const fetchProduct = useFetchCJProduct();
    const createProduct = useCreateProduct();
    const handleFetchProduct = async () => {
        if (!url) return;
        setLoading(true);
        setImageError(false);
        try {
            const cleanedUrl = url
                .normalize('NFKD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[ğĞ]/g, 'g')
                .replace(/[üÜ]/g, 'u')
                .replace(/[şŞ]/g, 's')
                .replace(/[ıİ]/g, 'i')
                .replace(/[öÖ]/g, 'o')
                .replace(/[çÇ]/g, 'c');
            console.log('🔗 Orijinal URL:', url);
            console.log('🔗 Temizlenmiş URL:', cleanedUrl);
            const product = await fetchProduct.mutateAsync({ url: cleanedUrl });
            setSelectedProduct(product);
        } catch (error) {
            console.error('Ürün getirme hatası:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async () => {
        console.log('🏪 Shops verisi:', shops);
        console.log('🏪 İlk mağaza:', shops?.[0]);
        if (!selectedProduct) {
            alert('❌ Lütfen önce bir ürün getirin!');
            return;
        }
        if (!shops || shops.length === 0) {
            alert('❌ Önce bir mağaza oluşturmalısınız!');
            navigate('/shops/create');
            return;
        }
        const finalPrice = selectedProduct.price * (1 + markupPercent / 100);
        const productData = {
            name: selectedProduct.name,
            description: selectedProduct.description?.replace(/<[^>]*>/g, '').substring(0, 300) || '',
            short_description: selectedProduct.description?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
            base_price: finalPrice,
            compare_at_price: selectedProduct.compare_price || undefined,
            cost_per_item: selectedProduct.price,
            product_type: 'physical' as ProductType,
            currency: 'USD' as Currency,
            primary_category: (selectedProduct.categories?.[0] || 'Diğer').substring(0, 50),
            secondary_categories: [],
            tags: ['cj-dropshipping'],
            seo_title: selectedProduct.name.substring(0, 60),
            seo_description: selectedProduct.description?.replace(/<[^>]*>/g, '').substring(0, 160) || '',
            seo_keywords: '',
            status: 'draft' as ProductStatus,
            weight: selectedProduct.weight ? parseFloat(selectedProduct.weight.toString().split('-')[0]) : 0.1,
            dimensions: undefined,
            requires_shipping: true,
            shipping_class: 'standard',
            stock_quantity: 999,
            low_stock_threshold: 5,
            allows_backorder: false,
            sku: String(selectedProduct.supplier_product_id),
            barcode: undefined,
            feature_image_url: selectedProduct.images?.[0] || '',
            thumbnail_url: selectedProduct.images?.[0] || '',
            video_url: undefined,
            image_gallery: selectedProduct.images || [],
            fulfillment_type: FulfillmentType.MANUAL,
            shop_id: shops[0]?.id,
            processing_time_days: 3,
            is_on_sale: false,
            sale_starts_at: undefined,
            sale_ends_at: undefined,
            stock_type: 'limited' as const,
        };

        try {
            console.log('📦 Gönderilen veri:', JSON.stringify(productData, null, 2));
            const savedProduct = await createProduct.mutateAsync(productData);
            console.log('✅ Ürün eklendi:', savedProduct);
            queryClient.invalidateQueries({ queryKey: ['products'] });
            alert(`✅ "${savedProduct.name}" başarıyla mağazaya eklendi!`);
            navigate('/admin/products');
        } catch (error) {
            console.error('❌ Ürün ekleme hatası:', error);
            alert('Ürün eklenirken hata oluştu!');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const colors = {
        primary: '#FF7700',
        primaryLight: '#FF9933',
        primaryDark: '#CC5C00',
        secondary: '#333333',
        success: '#28a745',
        bg: '#F5F5F5',
        surface: '#FFFFFF',
        border: '#E0E0E0',
        text: '#333333',
        textSecondary: '#666666',
        textLight: '#999999'
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: colors.bg }}>
            {/* Üst Bar */}
            <Paper sx={{
                p: 2,
                borderBottom: `1px solid ${colors.border}`,
                bgcolor: colors.surface
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton onClick={() => navigate('/products')} sx={{ color: colors.primary }}>
                                <FaArrowLeft />
                            </IconButton>
                            <Breadcrumbs separator="›">
                                <Link
                                    component="button"
                                    onClick={() => navigate('/')}
                                    sx={{ color: colors.textLight, textDecoration: 'none' }}
                                >
                                    Ana Sayfa
                                </Link>
                                <Link
                                    component="button"
                                    onClick={() => navigate('/products')}
                                    sx={{ color: colors.textLight, textDecoration: 'none' }}
                                >
                                    Ürünler
                                </Link>
                                <Typography color={colors.text} fontWeight={600}>CJ Entegrasyon</Typography>
                            </Breadcrumbs>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: colors.primary, width: 40, height: 40 }}>
                                <FaCrown color="white" size={20} />
                            </Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight={700} color={colors.text}>
                                    CJ Dropshipping
                                </Typography>
                                <Typography variant="caption" color={colors.textSecondary}>
                                    Resmi Entegrasyon
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Paper>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Ana Kart */}
                <Paper sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: `1px solid ${colors.border}`
                }}>
                    {/* Header */}
                    <Box sx={{ bgcolor: colors.primary, p: 3 }}>
                        <Typography variant="h4" fontWeight={700} color="white">
                            CJ Dropshipping
                        </Typography>
                        <Typography variant="body1" color="white" sx={{ opacity: 0.9 }}>
                            Ürünleri tek tıkla mağazana ekle
                        </Typography>
                    </Box>

                    {/* İçerik */}
                    <Box sx={{ p: { xs: 2, md: 4 } }}>
                        {/* 2 Buton */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 6 }}>
                                <Button
                                    fullWidth
                                    variant={showTips ? 'contained' : 'outlined'}
                                    onClick={() => setShowTips(!showTips)}
                                    startIcon={<FaLightbulb />}
                                    sx={{
                                        py: 2,
                                        borderColor: colors.primary,
                                        color: showTips ? 'white' : colors.primary,
                                        backgroundColor: showTips ? colors.primary : 'transparent',
                                        '&:hover': {
                                            backgroundColor: showTips ? colors.primaryDark : 'rgba(255, 119, 0, 0.05)',
                                        }
                                    }}
                                >
                                    💡 İpuçları
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Button
                                    fullWidth
                                    variant={!showTips ? 'contained' : 'outlined'}
                                    onClick={() => setShowTips(false)}
                                    startIcon={<FaRocket />}
                                    sx={{
                                        py: 2,
                                        borderColor: colors.primary,
                                        color: !showTips ? 'white' : colors.primary,
                                        backgroundColor: !showTips ? colors.primary : 'transparent',
                                        '&:hover': {
                                            backgroundColor: !showTips ? colors.primaryDark : 'rgba(255, 119, 0, 0.05)',
                                        }
                                    }}
                                >
                                    🚀 URL ile Getir
                                </Button>
                            </Grid>
                        </Grid>

                        {/* İpuçları */}
                        <Collapse in={showTips}>
                            <Paper sx={{ p: 3, mb: 3, bgcolor: '#FFF9F2', border: `1px solid ${colors.primary}20` }}>
                                <Typography variant="h6" fontWeight={700} color={colors.primary} gutterBottom>
                                    ✨ Nasıl Yapılır?
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: colors.primary }}>1</Avatar>
                                            <Typography variant="body2">CJ'de ürün linkini kopyala</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: colors.primary }}>2</Avatar>
                                            <Typography variant="body2">Buraya yapıştır, getir</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: colors.primary }}>3</Avatar>
                                            <Typography variant="body2">Kar marjı ekle, kaydet</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Collapse>

                        {/* URL ile Getir */}
                        {!showTips && (
                            <Fade in={!showTips}>
                                <Box>
                                    {/* URL Girişi */}
                                    <Paper sx={{ p: 3, mb: 3, border: `1px solid ${colors.border}` }}>
                                        <Typography variant="h6" fontWeight={700} gutterBottom>
                                            CJ Ürün Linki
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <TextField
                                                fullWidth
                                                placeholder="https://cjdropshipping.com/product/..."
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                size="small"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><FaLink color={colors.primary} /></InputAdornment>
                                                }}
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={handleFetchProduct}
                                                disabled={!url || loading}
                                                sx={{
                                                    bgcolor: colors.primary,
                                                    color: 'white',
                                                    px: 4,
                                                    '&:hover': { bgcolor: colors.primaryDark }
                                                }}
                                            >
                                                {loading ? <CircularProgress size={24} /> : 'Getir'}
                                            </Button>
                                        </Box>

                                        {/* Örnek Link */}
                                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography variant="caption" color={colors.textSecondary}>Örnek:</Typography>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: colors.bg, p: 0.5, px: 1 }}>
                                                https://cjdropshipping.com/product/2407080551161616500.html
                                            </Typography>
                                            <IconButton size="small" onClick={() => copyToClipboard('https://cjdropshipping.com/product/2407080551161616500.html')}>
                                                <FaCopy size={14} />
                                            </IconButton>
                                            {copied && <Typography variant="caption" sx={{ color: colors.success }}>Kopyalandı!</Typography>}
                                        </Box>
                                    </Paper>

                                    {/* Ürün Detayları */}
                                    {selectedProduct && (
                                        <Fade in={!!selectedProduct}>
                                            <Paper sx={{ p: 3, border: `1px solid ${colors.border}` }}>
                                                <Grid container spacing={3}>
                                                    {/* Resim - 200x200 sabit */}
                                                    <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Card sx={{ width: 200, height: 200 }}>
                                                            {!imageError ? (
                                                                <CardMedia
                                                                    component="img"
                                                                    image={selectedProduct.images?.[0] || 'https://via.placeholder.com/200'}
                                                                    onError={() => setImageError(true)}
                                                                    sx={{ width: 200, height: 200, objectFit: 'cover' }}
                                                                />
                                                            ) : (
                                                                <Box sx={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: colors.bg }}>
                                                                    <FaExternalLinkAlt size={40} color={colors.textLight} />
                                                                </Box>
                                                            )}
                                                        </Card>
                                                    </Grid>

                                                    {/* Bilgiler */}
                                                    <Grid size={{ xs: 12, md: 8 }}>
                                                        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                                                            {selectedProduct.name}
                                                        </Typography>

                                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                                            <Chip label="CJ" size="small" sx={{ bgcolor: colors.primary, color: 'white' }} />
                                                            <Chip label="Stokta" size="small" sx={{ bgcolor: colors.success, color: 'white' }} />
                                                        </Box>

                                                        {/* Fiyat */}
                                                        <Paper sx={{ p: 2, mb: 2, bgcolor: colors.bg }}>
                                                            <Grid container spacing={2}>
                                                                <Grid size={{ xs: 4 }}>
                                                                    <Typography variant="caption" color={colors.textSecondary}>CJ Fiyatı</Typography>
                                                                    <Typography variant="h6" fontWeight={700}>${selectedProduct.price?.toFixed(2)}</Typography>
                                                                </Grid>
                                                                <Grid size={{ xs: 4 }}>
                                                                    <Typography variant="caption" color={colors.textSecondary}>Kar Marjı</Typography>
                                                                    <TextField
                                                                        value={markupPercent}
                                                                        onChange={(e) => setMarkupPercent(Number(e.target.value))}
                                                                        size="small"
                                                                        sx={{ width: 80 }}
                                                                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                                                    />
                                                                </Grid>
                                                                <Grid size={{ xs: 4 }}>
                                                                    <Typography variant="caption" color={colors.textSecondary}>Satış Fiyatın</Typography>
                                                                    <Typography variant="h6" color={colors.primary} fontWeight={700}>
                                                                        ${(selectedProduct.price * (1 + markupPercent / 100)).toFixed(2)}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Paper>

                                                        <Button
                                                            variant="contained"
                                                            fullWidth
                                                            onClick={handleAddProduct}
                                                            disabled={createProduct.isPending}
                                                            sx={{
                                                                bgcolor: colors.primary,
                                                                color: 'white',
                                                                py: 1.5,
                                                                '&:hover': { bgcolor: colors.primaryDark }
                                                            }}
                                                        >
                                                            {createProduct.isPending ? (
                                                                <CircularProgress size={24} color="inherit" />
                                                            ) : (
                                                                <>
                                                                    <FaCheck style={{ marginRight: 8 }} /> Mağazaya Ekle
                                                                </>
                                                            )}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Fade>
                                    )}
                                </Box>
                            </Fade>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default CJProductImport;