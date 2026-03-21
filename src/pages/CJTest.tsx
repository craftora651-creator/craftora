// pages/CJProductImport.tsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
  Stepper,
  Step,
  StepLabel,
  Tab,
  Tabs,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Tooltip,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FaSearch,
  FaHeart,
  FaRegHeart,
  FaPlus,
  FaLink,  
  FaCheck,
  FaCog,
  FaTh,
  FaList,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import { 
  MdStore,
  MdExitToApp,
  MdRefresh,
} from 'react-icons/md';
import { useFetchCJProduct, useImportCJProduct, useSearchCJProducts, type CJProduct } from '../server/FastAPI/cj.hooks';
import { useCurrentUser } from '../server/FastAPI/user.hooks';
import { useMyShops } from '../server/FastAPI/shop.hooks';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CJProductImport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tabValue, setTabValue] = useState(0);
  const [url, setUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [fetchedProduct, setFetchedProduct] = useState<CJProduct | null>(null);
  const [markupPercent, setMarkupPercent] = useState(20);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState('best_match');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data: currentUser } = useCurrentUser();
  const { data: shops } = useMyShops();
  const fetchProduct = useFetchCJProduct();
  const importProduct = useImportCJProduct();
  const searchProducts = useSearchCJProducts();

  const steps = ['Ürün Getir', 'Önizle', 'Mağazaya Ekle'];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFetchProduct = async () => {
    try {
      const product = await fetchProduct.mutateAsync({ url });
      setFetchedProduct(product);
      setActiveStep(1);
      setTabValue(1);
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  const handleSearch = async (pageNum: number = 1) => {
    try {
      const results = await searchProducts.mutateAsync({
        query: searchQuery,
        page: pageNum,
        limit: 20
      });
      setSearchResults(results.products);
      setTotalPages(Math.ceil(results.total / 20));
      setPage(pageNum);
    } catch (error) {
      console.error('Arama hatası:', error);
    }
  };

  const handleImportProduct = async () => {
    if (!fetchedProduct) {
      console.error("❌ Ürün bulunamadı");
      return;
    }
    
    if (!shops || shops.length === 0) {
      console.error("❌ Mağaza bulunamadı");
      return;
    }
    
    const shopId = shops[0]?.id;
    if (!shopId) {
      console.error("❌ Mağaza ID'si alınamadı");
      return;
    }

    try {
      await importProduct.mutateAsync({
        supplier_product_id: fetchedProduct.supplier_product_id,
        name: fetchedProduct.name,
        description: fetchedProduct.description,
        price: fetchedProduct.price,
        compare_price: fetchedProduct.compare_price,
        images: fetchedProduct.images || [],
        variants: fetchedProduct.variants || [],
        shipping_methods: fetchedProduct.shipping_methods || [],
        shop_id: shopId,
        markup_percent: markupPercent,
      });
      setActiveStep(2);
    } catch (error) {
      console.error('Import hatası:', error);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Güvenlik kontrolleri
  const safeImages = fetchedProduct?.images || [];
  const safeVariants = fetchedProduct?.variants || [];
  const safeShippingMethods = fetchedProduct?.shipping_methods || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Üst Bar */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MdStore size={40} />
          <Box>
            <Typography variant="h4" fontWeight="700">
              CJ Dropshipping Entegrasyonu
            </Typography>
            <Typography variant="subtitle1">
              {currentUser?.email || 'Mağaza Sahibi'} | {shops?.length || 0} Mağaza
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Yenile">
            <IconButton color="inherit" onClick={() => window.location.reload()}>
              <MdRefresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ayarlar">
            <IconButton color="inherit">
              <FaCog />
            </IconButton>
          </Tooltip>
          <Tooltip title="Çıkış">
            <IconButton color="inherit">
              <MdExitToApp />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Ana Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab 
            icon={<FaSearch />} 
            label="Ürün Ara" 
            iconPosition="start"
            sx={{ fontWeight: 600 }}
          />
          <Tab 
            icon={<FaPlus />} 
            label="URL ile Getir" 
            iconPosition="start"
            sx={{ fontWeight: 600 }}
          />
          <Tab 
            icon={<FaHeart />} 
            label="Favorilerim" 
            iconPosition="start"
            sx={{ fontWeight: 600 }}
          />
        </Tabs>
      </Box>

      {/* Tab 1: Ürün Ara */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Filtreler */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  Filtreler
                </Typography>
                <IconButton size="small" onClick={() => setShowFilters(!showFilters)}>
                  <FaFilter />
                </IconButton>
              </Box>
              
              <Collapse in={showFilters}>
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Kategori</InputLabel>
                    <Select
                      value={selectedCategory}
                      label="Kategori"
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <MenuItem value="">Tüm Kategoriler</MenuItem>
                      <MenuItem value="electronics">Elektronik</MenuItem>
                      <MenuItem value="clothing">Giyim</MenuItem>
                      <MenuItem value="home">Ev & Yaşam</MenuItem>
                      <MenuItem value="beauty">Güzellik</MenuItem>
                      <MenuItem value="toys">Oyuncak</MenuItem>
                      <MenuItem value="sports">Spor</MenuItem>
                    </Select>
                  </FormControl>

                  <Typography gutterBottom>Fiyat Aralığı</Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue as [number, number])}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      size="small"
                      label="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    />
                    <TextField
                      size="small"
                      label="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                  </Box>

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Sıralama</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sıralama"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="best_match">En İyi Eşleşme</MenuItem>
                      <MenuItem value="price_asc">Fiyat (Düşük → Yüksek)</MenuItem>
                      <MenuItem value="price_desc">Fiyat (Yüksek → Düşük)</MenuItem>
                      <MenuItem value="newest">En Yeni</MenuItem>
                      <MenuItem value="popular">En Popüler</MenuItem>
                    </Select>
                  </FormControl>

                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => handleSearch(1)}
                    startIcon={<FaSearch />}
                  >
                    Filtreleri Uygula
                  </Button>
                </Box>
              </Collapse>
            </Paper>
          </Grid>

          {/* Arama Sonuçları */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 2 }}>
              {/* Arama Kutusu */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ürün ara (örnek: phone case, dress, watch)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleSearch(1)}
                  disabled={searchProducts.isPending}
                >
                  {searchProducts.isPending ? <CircularProgress size={24} /> : 'Ara'}
                </Button>
              </Box>

              {/* Görünüm Değiştirici */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {searchProducts.data?.total || 0} ürün bulundu
                </Typography>
                <Box>
                  <IconButton 
                    size="small" 
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                    onClick={() => setViewMode('grid')}
                  >
                    <FaTh />
                  </IconButton>
                  <IconButton 
                    size="small"
                    color={viewMode === 'list' ? 'primary' : 'default'}
                    onClick={() => setViewMode('list')}
                  >
                    <FaList />
                  </IconButton>
                </Box>
              </Box>

              {/* Ürün Listesi */}
              {searchProducts.isPending ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : searchResults.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <Grid container spacing={2}>
                      {searchResults.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.supplier_product_id}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              position: 'relative',
                              '&:hover': {
                                boxShadow: 6,
                                transform: 'translateY(-4px)',
                                transition: 'all 0.3s'
                              }
                            }}
                          >
                            <IconButton
                              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                              onClick={() => toggleFavorite(product.supplier_product_id)}
                            >
                              {favorites.includes(product.supplier_product_id) ? (
                                <FaHeart color="red" />
                              ) : (
                                <FaRegHeart />
                              )}
                            </IconButton>
                            <CardMedia
                              component="img"
                              height="200"
                              image={product.image || 'https://via.placeholder.com/200'}
                              alt={product.name}
                              sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography gutterBottom variant="h6" component="div" noWrap>
                                {product.name}
                              </Typography>
                              <Typography variant="h6" color="primary" fontWeight="700">
                                ${product.price.toFixed(2)}
                              </Typography>
                              <Chip 
                                size="small"
                                label={product.stock_status === 'in_stock' ? 'Stokta' : 'Stokta Değil'}
                                color={product.stock_status === 'in_stock' ? 'success' : 'error'}
                                sx={{ mt: 1 }}
                              />
                            </CardContent>
                            <Box sx={{ p: 2, pt: 0 }}>
                              <Button 
                                variant="outlined" 
                                fullWidth
                                onClick={() => {
                                  setUrl(`https://cjdropshipping.com/product/${product.supplier_product_id}.html`);
                                  setTabValue(1);
                                  handleFetchProduct();
                                }}
                              >
                                İncele
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <List>
                      {searchResults.map((product) => (
                        <ListItem 
                          key={product.supplier_product_id}
                          secondaryAction={
                            <IconButton edge="end" onClick={() => toggleFavorite(product.supplier_product_id)}>
                              {favorites.includes(product.supplier_product_id) ? (
                                <FaHeart color="red" />
                              ) : (
                                <FaRegHeart />
                              )}
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={product.name}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="primary">
                                  ${product.price.toFixed(2)}
                                </Typography>
                                {' • '}
                                <Chip 
                                  size="small"
                                  label={product.stock_status === 'in_stock' ? 'Stokta' : 'Stokta Değil'}
                                  color={product.stock_status === 'in_stock' ? 'success' : 'error'}
                                />
                              </>
                            }
                          />
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => {
                              setUrl(`https://cjdropshipping.com/product/${product.supplier_product_id}.html`);
                              setTabValue(1);
                              handleFetchProduct();
                            }}
                          >
                            İncele
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}

                  {/* Sayfalama */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, alignItems: 'center' }}>
                    <IconButton 
                      disabled={page === 1}
                      onClick={() => handleSearch(page - 1)}
                    >
                      <FaArrowLeft />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>
                      Sayfa {page} / {totalPages}
                    </Typography>
                    <IconButton 
                      disabled={page === totalPages}
                      onClick={() => handleSearch(page + 1)}
                    >
                      <FaArrowRight />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Alert severity="info">
                  Henüz arama yapılmadı. Bir şeyler aramayı dene!
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 2: URL ile Getir */}
      <TabPanel value={tabValue} index={1}>
        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Adım 1: URL ile ürün getir */}
        {activeStep === 0 && (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="600">
              1. CJ Ürün URL'si Gir
            </Typography>
            
            <TextField
              fullWidth
              label="CJ Ürün URL'si"
              placeholder="https://cjdropshipping.com/product/xxx.html"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              margin="normal"
              helperText="Örnek: https://cjdropshipping.com/product/2407080551161616500.html"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLink />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleFetchProduct}
              disabled={!url || fetchProduct.isPending}
              sx={{ mt: 2 }}
            >
              {fetchProduct.isPending ? <CircularProgress size={24} /> : 'Ürünü Getir →'}
            </Button>

            {fetchProduct.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Ürün getirilemedi: {fetchProduct.error.message}
              </Alert>
            )}
          </Paper>
        )}

        {/* Adım 2: Ürün Önizleme */}
        {activeStep === 1 && fetchedProduct && (
          <Grid container spacing={3}>
            {/* Sol Taraf - Görseller */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Ürün Görselleri ({safeImages.length})
                </Typography>
                {safeImages.length > 0 ? (
                  <Grid container spacing={1}>
                    {safeImages.map((img, idx) => (
                      <Grid item xs={4} key={idx}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="120"
                            image={img}
                            alt={`Ürün ${idx + 1}`}
                            sx={{ objectFit: 'cover' }}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Görsel bulunamadı.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Sağ Taraf - Ürün Detayları */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                  {fetchedProduct.name || 'İsimsiz Ürün'}
                </Typography>

                <Box sx={{ my: 2 }}>
                  <Chip 
                    label={fetchedProduct.supplier?.toUpperCase() || 'CJ'} 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={fetchedProduct.stock_status || 'Bilinmiyor'} 
                    color={fetchedProduct.stock_status === 'in_stock' ? 'success' : 'warning'} 
                    size="small" 
                  />
                </Box>

                <Typography variant="body1" paragraph>
                  {fetchedProduct.description?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5" color="primary" fontWeight="700">
                  ${fetchedProduct.price?.toFixed(2) || '0.00'}
                  {fetchedProduct.compare_price && (
                    <Typography component="span" sx={{ ml: 2, textDecoration: 'line-through', color: 'text.secondary' }}>
                      ${fetchedProduct.compare_price.toFixed(2)}
                    </Typography>
                  )}
                </Typography>

                {/* Varyantlar */}
                {safeVariants.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mt: 3, mb: 2 }} fontWeight="600">
                      Varyantlar
                    </Typography>
                    {safeVariants.map((variant, idx) => (
                      <Box key={idx} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="600">
                          {variant.name || 'Varyant'}:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {(variant.values || []).map((value, i) => (
                            <Chip key={i} label={value} variant="outlined" size="small" />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </>
                )}

                {/* Kargo */}
                {safeShippingMethods.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mt: 3, mb: 2 }} fontWeight="600">
                      Kargo Seçenekleri
                    </Typography>
                    <List dense>
                      {safeShippingMethods.map((method, idx) => (
                        <ListItem key={idx}>
                          <ListItemText
                            primary={method.method || 'Bilinmeyen Metod'}
                            secondary={`${method.estimated_days || 'Süre belirtilmemiş'} • ${method.from_location || 'Kaynak belirtilmemiş'}`}
                          />
                          <Typography variant="body2" fontWeight="600">
                            ${method.price?.toFixed(2) || '0.00'}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {/* Kar Marjı */}
                <Box sx={{ mt: 3 }}>
                  <TextField
                    label="Kar Marjı (%)"
                    type="number"
                    value={markupPercent}
                    onChange={(e) => setMarkupPercent(Number(e.target.value))}
                    size="small"
                    sx={{ width: 150 }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                    Satış Fiyatı: ${((fetchedProduct.price || 0) * (1 + markupPercent / 100)).toFixed(2)}
                  </Typography>
                </Box>

                {/* Butonlar */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep(0)}
                    startIcon={<FaArrowLeft />}
                  >
                    Geri
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleImportProduct}
                    disabled={importProduct.isPending}
                    startIcon={importProduct.isPending ? <CircularProgress size={20} /> : <FaCheck />}
                  >
                    {importProduct.isPending ? 'Ekleniyor...' : 'Mağazaya Ekle'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Adım 3: Başarılı */}
        {activeStep === 2 && (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              🎉
            </Typography>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Ürün Başarıyla Eklendi!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Ürün mağazana eklendi. Şimdi ürünler sayfasından görüntüleyebilirsin.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                setActiveStep(0);
                setFetchedProduct(null);
                setUrl('');
              }}
              sx={{ mt: 2 }}
            >
              Yeni Ürün Getir
            </Button>
          </Paper>
        )}
      </TabPanel>

      {/* Tab 3: Favorilerim */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="600">
            Favori Ürünlerim
          </Typography>
          {favorites.length > 0 ? (
            <Grid container spacing={2}>
              {favorites.map((productId) => (
                <Grid item xs={12} sm={6} md={4} key={productId}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Ürün ID: {productId}
                      </Typography>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        sx={{ mt: 1 }}
                        onClick={() => {
                          setUrl(`https://cjdropshipping.com/product/${productId}.html`);
                          setTabValue(1);
                          handleFetchProduct();
                        }}
                      >
                        Ürünü Getir
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              Henüz favori ürünün yok. Ürün ararken kalp ikonuna tıklayarak favorilerine ekleyebilirsin.
            </Alert>
          )}
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default CJProductImport;