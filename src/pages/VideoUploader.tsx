import React, { useState } from 'react';
import { useMyProducts } from '../server/FastAPI/product.hooks';
import { useUploadReels } from '../server/Gin/reels.hooks';

interface VideoUploaderProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (video: any) => void;
    colors: any;
    userId: string;
}

const VideoUploader = ({ isOpen, onClose, onSuccess, colors, userId }: VideoUploaderProps) => {
  const [step, setStep] = useState<'product' | 'upload' | 'details'>('product');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');

  const { data: products = [], isLoading: productsLoading } = useMyProducts();
  const { mutate: uploadReels, isPending: isUploading } = useUploadReels();
   console.log("📌 VideoUploader userId:", userId);  // ← EKLE
    console.log("📌 userId type:", typeof userId);    // ← EKLE
    console.log("📌 userId length:", userId?.length); // ← EKLE

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setStep('upload');
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
    }
  };

  const handlePublish = () => {
    if (!videoFile || !selectedProduct) return;
    
    // Backend'e yükle (thumbnail backend'de otomatik oluşacak)
    uploadReels({
      product_id: selectedProduct.id,
      caption: description,
      video: videoFile,
      thumbnail: thumbnailFile || undefined,
      userId: userId,  // ← BUNU EKLE
    }, {
      onSuccess: (uploadedVideo) => {
        // Backend'den dönen videoyu frontend'in beklediği formata çevir
        const newVideo = {
          id: uploadedVideo.id,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          productImage: selectedProduct.feature_image_url,
          videoUrl: uploadedVideo.video_url,
          thumbnailUrl: uploadedVideo.thumbnail_url,
          description: description,
          hashtags: hashtags.split(',').map(h => h.trim()).filter(h => h),
          stats: {
            views: uploadedVideo.views || 0,
            likes: uploadedVideo.likes || 0,
            comments: uploadedVideo.comment_count || 0,
            shares: uploadedVideo.share_count || 0,
            sales: 0
          },
          user: {
            id: userId,
            name: '',
            username: '',
            avatar: '',
            isVerified: false
          },
          createdAt: uploadedVideo.created_at
        };
        
        onSuccess(newVideo);
        onClose();
        
        // Formu temizle
        setSelectedProduct(null);
        setVideoFile(null);
        setThumbnailFile(null);
        setDescription('');
        setHashtags('');
        setStep('product');
      },
      onError: (error) => {
        console.error('Yükleme hatası:', error);
        alert('Video yüklenirken bir hata oluştu');
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.95)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        width: '100%',
        maxWidth: 550,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          padding: 20,
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: colors.text }}>
            {step === 'product' && '📦 Ürün Seç'}
            {step === 'upload' && '🎬 Video ve Kapak Yükle'}
            {step === 'details' && '✏️ Video Detayları'}
          </h3>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: colors.text,
            fontSize: 24,
            cursor: 'pointer'
          }}>✕</button>
        </div>

        {/* Step 1: Ürün Seç */}
        {step === 'product' && (
          <div style={{ padding: 20 }}>
            {productsLoading ? (
              <div style={{ textAlign: 'center', padding: 40, color: colors.textSecondary }}>Yükleniyor...</div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                <div style={{ color: colors.textSecondary }}>Hiç ürününüz yok</div>
                <button onClick={() => window.location.href = '/products/add'} style={{ marginTop: 16, padding: '8px 20px', background: '#0ea5e9', border: 'none', borderRadius: 30, color: 'white', cursor: 'pointer' }}>Ürün Ekle</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {products.map((product: any) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      backgroundColor: selectedProduct?.id === product.id ? 'rgba(14,165,233,0.1)' : colors.bg,
                      border: selectedProduct?.id === product.id ? `2px solid #0ea5e9` : `1px solid ${colors.border}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    {product.feature_image_url ? (
                      <img src={product.feature_image_url} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 48, height: 48, backgroundColor: colors.surface2, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {product.product_type === 'digital' ? '📱' : '📦'}
                      </div>
                    )}
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontWeight: 600, color: colors.text }}>{product.name}</div>
                      <div style={{ fontSize: 12, color: colors.textSecondary }}>₺{product.base_price}</div>
                    </div>
                    {selectedProduct?.id === product.id && <div style={{ color: '#0ea5e9' }}>✓</div>}
                  </button>
                ))}
              </div>
            )}
            
            {selectedProduct && (
              <button onClick={() => setStep('upload')} style={{ width: '100%', marginTop: 20, padding: 14, background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', border: 'none', borderRadius: 12, color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                Devam Et →
              </button>
            )}
          </div>
        )}

        {/* Step 2: Video ve Kapak Yükle */}
        {step === 'upload' && (
          <div style={{ padding: 20 }}>
            {/* Seçili Ürün */}
            <div style={{ marginBottom: 20, padding: 12, backgroundColor: colors.bg, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              {selectedProduct?.feature_image_url ? <img src={selectedProduct.feature_image_url} alt="" style={{ width: 40, height: 40, borderRadius: 8 }} /> : <div style={{ width: 40, height: 40, backgroundColor: colors.surface2, borderRadius: 8 }} />}
              <div><div style={{ fontWeight: 500, color: colors.text }}>{selectedProduct?.name}</div><div style={{ fontSize: 12, color: colors.textSecondary }}>Seçili Ürün</div></div>
            </div>

            {/* Video Yükleme */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, color: colors.textSecondary, fontSize: 13 }}>🎬 Video *</label>
              <div onClick={() => document.getElementById('video-upload')?.click()} style={{ border: `2px dashed ${colors.border}`, borderRadius: 16, padding: 30, textAlign: 'center', cursor: 'pointer', backgroundColor: colors.bg }}>
                <input id="video-upload" type="file" accept="video/*" onChange={handleVideoSelect} style={{ display: 'none' }} />
                {videoFile ? (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>🎬</div>
                    <div style={{ color: colors.text }}>{videoFile.name}</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>{(videoFile.size / 1024 / 1024).toFixed(2)} MB</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>📹</div>
                    <div style={{ color: colors.text }}>Video seçmek için tıkla</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>MP4, MOV (Max 100MB)</div>
                  </>
                )}
              </div>
            </div>

            {/* Kapak Fotoğrafı Yükleme */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, color: colors.textSecondary, fontSize: 13 }}>🖼️ Kapak Fotoğrafı (önerilir)</label>
              <div onClick={() => document.getElementById('thumbnail-upload')?.click()} style={{ border: `2px dashed ${colors.border}`, borderRadius: 16, padding: 30, textAlign: 'center', cursor: 'pointer', backgroundColor: colors.bg }}>
                <input id="thumbnail-upload" type="file" accept="image/*" onChange={handleThumbnailSelect} style={{ display: 'none' }} />
                {thumbnailFile ? (
                  <div>
                    <img src={URL.createObjectURL(thumbnailFile)} alt="kapak" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12 }} />
                    <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8 }}>{thumbnailFile.name}</div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>🖼️</div>
                    <div style={{ color: colors.text }}>Kapak fotoğrafı seç</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>JPG, PNG (Önerilen: 9:16 oran)</div>
                  </>
                )}
              </div>
            </div>
            
            {videoFile && (
              <button onClick={() => setStep('details')} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', border: 'none', borderRadius: 12, color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                Devam Et →
              </button>
            )}
          </div>
        )}

        {/* Step 3: Detaylar */}
        {step === 'details' && (
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: colors.textSecondary, fontSize: 13 }}>📝 Açıklama</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Videonuz hakkında bir şeyler yazın..." rows={3} style={{ width: '100%', padding: 12, backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text, resize: 'none' }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, color: colors.textSecondary, fontSize: 13 }}># Hashtag'ler</label>
              <input value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="#moda, #stil, #yaz" style={{ width: '100%', padding: 12, backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.text }} />
            </div>

            {/* Önizleme */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>Önizleme</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {thumbnailFile && <img src={URL.createObjectURL(thumbnailFile)} alt="kapak" style={{ width: 80, height: 142, objectFit: 'cover', borderRadius: 12 }} />}
                {videoFile && <video src={URL.createObjectURL(videoFile)} controls style={{ width: thumbnailFile ? 120 : '100%', borderRadius: 12 }} />}
              </div>
            </div>

            <button onClick={handlePublish} disabled={isUploading} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 12, color: 'white', fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.6 : 1 }}>
              {isUploading ? 'Yayınlanıyor...' : '🚀 Videoyu Yayınla'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;