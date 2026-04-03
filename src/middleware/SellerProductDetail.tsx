// sellerProductDetail.tsx
import { useState, useEffect } from 'react';
import { useProduct } from '../server/FastAPI/product.hooks';

interface ProductDetailProps {
  productId: string;
  colors: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  isDarkMode: boolean;
  onAddToCart: (product: any, quantity: number) => void;
  onClose: () => void;
}

const SellerProductDetail = ({ productId, colors, isDarkMode, onAddToCart, onClose }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { data: product, isLoading, error } = useProduct(productId);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: colors.text }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${colors.border}`, borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          Ürün bilgileri yükleniyor...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          ❌ Ürün bulunamadı!
          <button onClick={onClose} style={{ display: 'block', marginTop: 16, padding: '8px 24px', backgroundColor: '#0ea5e9', border: 'none', borderRadius: 30, color: 'white', cursor: 'pointer' }}>Geri Dön</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) {
      alert('Lütfen bir yorum yazın!');
      return;
    }
    alert(`Yorumunuz için teşekkürler! Puan: ${reviewRating}⭐\nYorum: ${reviewText}`);
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg }}>
      {/* Geri Dön Butonu - Sadece ikon, border yok, background yok */}
      {/* Geri Dön Butonu - Daha şık ve belirgin */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: isMobile ? '16px 16px 0 16px' : '20px 24px 0 24px',
        width: '100%'
      }}>
        <button
          onClick={onClose}
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 30,
            cursor: 'pointer',
            color: colors.text,
            fontSize: 14,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.bg;
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.surface;
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span style={{ fontSize: 16 }}>←</span>
          <span>Geri Dön</span>
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '20px 16px 60px' : '20px 24px 80px' }}>

        {/* Ürün Detay İçeriği */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 0 : 0,
          backgroundColor: colors.surface,
          borderRadius: 24,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden'
        }}>

          {/* Sol: Ürün Görseli - Tam div'i kapla */}
          <div style={{
            flex: isMobile ? 'none' : 1,
            backgroundColor: colors.bg,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? 300 : 'auto',
            overflow: 'hidden'
          }}>
            <img
              src={product.feature_image_url || 'https://placehold.co/600x400/0ea5e9/white?text=Product'}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                minHeight: isMobile ? 300 : 400,
                objectFit: 'cover',
                borderRadius: 0
              }}
            />
          </div>

          {/* Sağ: Ürün Bilgileri */}
          <div style={{ flex: isMobile ? 'none' : 1, padding: isMobile ? 20 : 32 }}>

            <span style={{ display: 'inline-block', backgroundColor: 'rgba(14,165,233,0.1)', color: '#0ea5e9', padding: '4px 12px', borderRadius: 20, fontSize: 12, marginBottom: 12 }}>
              {product.primary_category || 'Ürün'}
            </span>

            <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 'bold', color: colors.text, marginBottom: 12 }}>{product.name}</h1>

            <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 16 }}>
              ${product.base_price ? Number(product.base_price).toFixed(2) : '0'}
            </div>

            <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6, marginBottom: 24 }}>
              {product.short_description || product.description?.substring(0, 150) || 'Ürün açıklaması bulunmamaktadır.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>Miktar</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, cursor: 'pointer', fontSize: 18, color: colors.text }}>-</button>
                  <span style={{ fontSize: 18, fontWeight: 500, color: colors.text, minWidth: 40, textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${colors.border}`, backgroundColor: colors.bg, cursor: 'pointer', fontSize: 18, color: colors.text }}>+</button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>Stok Durumu</label>
                <div style={{ fontSize: 14, fontWeight: 500, color: product.stock_quantity > 0 ? '#10b981' : '#ef4444' }}>
                  {product.stock_quantity > 0 ? `📦 ${product.stock_quantity} adet stokta` : '❌ Stokta yok'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
              <button onClick={handleAddToCart} disabled={product.stock_quantity === 0} style={{
                flex: 1, padding: '14px 24px', backgroundColor: product.stock_quantity > 0 ? '#0ea5e9' : '#9ca3af', border: 'none', borderRadius: 40, color: 'white', fontSize: 16, fontWeight: 600, cursor: product.stock_quantity > 0 ? 'pointer' : 'not-allowed'
              }}>
                🛒 Sepete Ekle
              </button>
              <button onClick={handleAddToCart} disabled={product.stock_quantity === 0} style={{
                flex: 1, padding: '14px 24px', backgroundColor: 'transparent', border: `2px solid ${product.stock_quantity > 0 ? '#0ea5e9' : '#9ca3af'}`, borderRadius: 40, color: product.stock_quantity > 0 ? '#0ea5e9' : '#9ca3af', fontSize: 16, fontWeight: 600, cursor: product.stock_quantity > 0 ? 'pointer' : 'not-allowed'
              }}>
                ⚡ Hemen Satın Al
              </button>
            </div>

            <div style={{ padding: 12, backgroundColor: colors.bg, borderRadius: 12, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>🔒</span><span style={{ fontSize: 11, color: colors.textSecondary }}>Güvenli Ödeme</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>⚡</span><span style={{ fontSize: 11, color: colors.textSecondary }}>Anında Teslimat</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>🔄</span><span style={{ fontSize: 11, color: colors.textSecondary }}>30 Gün İade</span></div>
            </div>
          </div>
        </div>

        {/* Sekmeler */}
        <div style={{ marginTop: 48, backgroundColor: colors.surface, borderRadius: 24, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border}`, overflowX: 'auto' }}>
            <button onClick={() => setActiveTab('details')} style={{ padding: '14px 24px', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'details' ? '#0ea5e9' : colors.textSecondary, fontWeight: activeTab === 'details' ? 600 : 400, borderBottom: activeTab === 'details' ? `2px solid #0ea5e9` : 'none', whiteSpace: 'nowrap' }}>📄 Detaylı Bilgi</button>
            <button onClick={() => setActiveTab('reviews')} style={{ padding: '14px 24px', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'reviews' ? '#0ea5e9' : colors.textSecondary, fontWeight: activeTab === 'reviews' ? 600 : 400, borderBottom: activeTab === 'reviews' ? `2px solid #0ea5e9` : 'none', whiteSpace: 'nowrap' }}>💬 Yorumlar ({product.review_count || 0})</button>
          </div>

          <div style={{ padding: isMobile ? 20 : 32 }}>
            {activeTab === 'details' && (
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 16 }}>Ürün Açıklaması</h3>
                <div style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 1.8 }}>
                  {product.description || 'Ürün açıklaması bulunmamaktadır.'}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div style={{ marginBottom: 32, padding: 20, backgroundColor: colors.bg, borderRadius: 16 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 16 }}>📝 Değerlendirme Yap</h4>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, color: colors.textSecondary, marginBottom: 6 }}>Puanınız</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setReviewRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, color: star <= reviewRating ? '#f59e0b' : colors.border }}>★</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, color: colors.textSecondary, marginBottom: 6 }}>Yorumunuz</label>
                    <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={4} style={{ width: '100%', padding: 12, backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, fontSize: 14, resize: 'vertical' }} placeholder="Ürün hakkındaki düşüncelerinizi yazın..." />
                  </div>
                  <button onClick={handleSubmitReview} style={{ padding: '10px 24px', backgroundColor: '#0ea5e9', border: 'none', borderRadius: 30, color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Gönder</button>
                </div>

                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review: any, index: number) => (
                    <div key={index} style={{ padding: 16, borderBottom: `1px solid ${colors.border}`, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{review.user_name?.charAt(0) || 'K'}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: colors.text }}>{review.user_name || 'Kullanıcı'}</div>
                          <div style={{ fontSize: 11, color: colors.textSecondary }}>{new Date(review.created_at).toLocaleDateString('tr-TR')}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>{[1, 2, 3, 4, 5].map(star => (<span key={star} style={{ color: star <= review.rating ? '#f59e0b' : colors.border }}>★</span>))}</div>
                      <p style={{ fontSize: 14, color: colors.textSecondary }}>{review.comment}</p>
                      {review.image && <img src={review.image} alt="yorum" style={{ marginTop: 10, width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />}
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: colors.textSecondary }}>Henüz yorum bulunmuyor. İlk yorumu siz yapın!</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProductDetail;