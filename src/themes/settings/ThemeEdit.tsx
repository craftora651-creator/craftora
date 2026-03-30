// src/themes/settings/ThemeEdit.tsx
import React, { useState, useEffect } from 'react';
import { useUpdateSection, useUpdatePost, useUpdateThemeSettings, useUpdateMenu } from '../../server/Gin/theme.hook'

export interface SelectedElement {
  type: string;
  id?: number;
  currentData?: Record<string, string>;
}

interface ThemeEditProps {
  selectedElement: SelectedElement | null;
  shopId: string;
  onSave?: (type: string, id: number | undefined, data: Record<string, string>) => void;
}

const ThemeEdit: React.FC<ThemeEditProps> = ({ 
  selectedElement, 
  shopId, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  // Mutation hook'ları
  const updateSection = useUpdateSection();
  const updatePost = useUpdatePost();
  const updateThemeSettings = useUpdateThemeSettings();
  const updateMenu = useUpdateMenu();

  // Seçilen element değişince form verilerini güncelle
  useEffect(() => {
    if (selectedElement?.currentData) {
      setFormData(selectedElement.currentData);
    } else {
      setFormData({});
    }
    setSaved(false);
  }, [selectedElement]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!selectedElement) return;

    const type = selectedElement.type;
    const id = selectedElement.id;
    const data = formData;

    try {
      // Element tipine göre doğru mutation'ı çağır
      if (type.includes('hero') || type.includes('section')) {
        // Section güncelleme (hero, featured products vb.)
        if (id) {
          await updateSection.mutateAsync({
            id,
            updates: {
              content: data,
              title: data.title
            }
          });
        }
      } 
      else if (type.includes('blog')) {
        // Blog post güncelleme
        if (id) {
          await updatePost.mutateAsync({
            id,
            updates: {
              title: data.title,
              excerpt: data.excerpt,
              content: data.content,
              featured_image: data.imageUrl,
              author_name: data.author,
              tags: data.tags?.split(',').map(t => t.trim()) || []
            }
          });
        }
      }
      else if (type.includes('header') || type.includes('footer')) {
        // Menu veya tema ayarları güncelleme
        if (type === 'header-logo') {
          await updateThemeSettings.mutateAsync({
            logoText: data.logoText,
            logoSubText: data.logoSubText
          });
        } else if (type === 'header-nav') {
          if (id) {
            await updateMenu.mutateAsync({
              id,
              updates: {
                items: [
                  { title: data.nav1, url: '/', order: 0 },
                  { title: data.nav2, url: '/products', order: 1 },
                  { title: data.nav3, url: '/blog', order: 2 },
                  { title: data.nav4, url: '/contact', order: 3 }
                ]
              }
            });
          }
        } else if (type.includes('footer')) {
          await updateThemeSettings.mutateAsync({
            footerBrand: data.footerBrand,
            footerDesc: data.footerDesc,
            footerCopyright: data.footerCopyright
          });
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSave?.(type, id, data);
      
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Kaydedilirken bir hata oluştu');
    }
  };

  // Loading durumu
  const isLoading = 
    updateSection.isPending || 
    updatePost.isPending || 
    updateThemeSettings.isPending || 
    updateMenu.isPending;

  // Seçili element yoksa karşılama ekranı
  if (!selectedElement) {
    return (
      <div style={{
        width: '380px',
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #1e293b',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🎨</span> Tema Düzenleyici
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#94a3b8' }}>Mağaza: {shopId}</p>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#1e293b',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}>
            <span style={{ fontSize: '40px' }}>👆</span>
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 500 }}>Bir alan seçin</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
            Sağ taraftaki temada<br />
            düzenlemek istediğin alana tıkla
          </p>
        </div>
      </div>
    );
  }

  // Element tipine göre form render et (önceki gibi devam ediyor)
  const renderEditor = () => {
    const type = selectedElement.type;
    const data = formData;

    // Hero Editor
    if (type.includes('hero')) {
      return (
        <>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', marginBottom: '8px', display: 'block' }}>HERO BÖLÜMÜ</label>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Hero Alanı</h3>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>🏷️ Rozet Metni</label>
            <input type="text" value={data.badge || ''} onChange={(e) => handleChange('badge', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>📝 Başlık</label>
            <input type="text" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>✨ Vurgulu Kelime</label>
            <input type="text" value={data.titleHighlight || ''} onChange={(e) => handleChange('titleHighlight', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>📄 Alt Başlık</label>
            <textarea value={data.subtitle || ''} onChange={(e) => handleChange('subtitle', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>🖼️ Görsel URL</label>
            <input type="text" value={data.imageUrl || ''} onChange={(e) => handleChange('imageUrl', e.target.value)} style={inputStyle} />
            {data.imageUrl && (
              <div style={{ marginTop: '8px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#1e293b', height: '100px' }}>
                <img src={data.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>🔘 Buton 1</label>
              <input type="text" value={data.buttonText || ''} onChange={(e) => handleChange('buttonText', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>🔘 Buton 2</label>
              <input type="text" value={data.secondaryButtonText || ''} onChange={(e) => handleChange('secondaryButtonText', e.target.value)} style={inputStyle} />
            </div>
          </div>
        </>
      );
    }

    // Blog Editor
    if (type.includes('blog')) {
      return (
        <>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', marginBottom: '8px', display: 'block' }}>BLOG YAZISI</label>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{data.title || 'Blog Yazısı'}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>ID: {selectedElement.id}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>📌 Başlık</label>
            <input type="text" value={data.title || ''} onChange={(e) => handleChange('title', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>📝 Özet</label>
            <textarea value={data.excerpt || ''} onChange={(e) => handleChange('excerpt', e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>🖼️ Kapak Görseli</label>
            <input type="text" value={data.imageUrl || ''} onChange={(e) => handleChange('imageUrl', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>✍️ Yazar</label>
            <input type="text" value={data.author || ''} onChange={(e) => handleChange('author', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>🏷️ Etiketler (virgülle ayır)</label>
            <input type="text" value={data.tags || ''} onChange={(e) => handleChange('tags', e.target.value)} style={inputStyle} />
          </div>
        </>
      );
    }

    // Header Editor
    if (type.includes('header')) {
      return (
        <>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', marginBottom: '8px', display: 'block' }}>HEADER</label>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Üst Menü</h3>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>🏠 Logo Metni</label>
            <input type="text" value={data.logoText || ''} onChange={(e) => handleChange('logoText', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>🔤 Logo Alt Metni</label>
            <input type="text" value={data.logoSubText || ''} onChange={(e) => handleChange('logoSubText', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>📋 Menü Linkleri</label>
            <input type="text" value={data.nav1 || ''} onChange={(e) => handleChange('nav1', e.target.value)} style={{ ...inputStyle, marginBottom: '8px' }} placeholder="Link 1" />
            <input type="text" value={data.nav2 || ''} onChange={(e) => handleChange('nav2', e.target.value)} style={{ ...inputStyle, marginBottom: '8px' }} placeholder="Link 2" />
            <input type="text" value={data.nav3 || ''} onChange={(e) => handleChange('nav3', e.target.value)} style={{ ...inputStyle, marginBottom: '8px' }} placeholder="Link 3" />
            <input type="text" value={data.nav4 || ''} onChange={(e) => handleChange('nav4', e.target.value)} style={inputStyle} placeholder="Link 4" />
          </div>
        </>
      );
    }

    // Footer Editor
    if (type.includes('footer')) {
      return (
        <>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', marginBottom: '8px', display: 'block' }}>FOOTER</label>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Alt Bilgi</h3>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>🏢 Marka Adı</label>
            <input type="text" value={data.footerBrand || ''} onChange={(e) => handleChange('footerBrand', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>📝 Açıklama</label>
            <textarea value={data.footerDesc || ''} onChange={(e) => handleChange('footerDesc', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>©️ Copyright</label>
            <input type="text" value={data.footerCopyright || ''} onChange={(e) => handleChange('footerCopyright', e.target.value)} style={inputStyle} />
          </div>
        </>
      );
    }

    // Default
    return (
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '16px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
          ⚡ Bu alan için düzenleme seçenekleri yakında gelecek.
        </p>
      </div>
    );
  };

  return (
    <div style={{
      width: '420px',
      height: '100vh',
      backgroundColor: '#0f172a',
      color: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      fontFamily: "'Inter', sans-serif",
      boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #1e293b',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎨</span> Tema Düzenleyici
            </h2>
          </div>
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b' }}>
          Düzenleniyor: <span style={{ color: '#60a5fa' }}>{selectedElement.type}</span>
        </p>
      </div>

      {/* Form İçeriği */}
      <div style={{ padding: '24px', flex: 1 }}>
        {renderEditor()}
      </div>

      {/* Footer - Kaydet Butonu */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #1e293b',
        backgroundColor: '#0f172a',
        position: 'sticky',
        bottom: 0,
      }}>
        <button
          onClick={handleSave}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: saved ? '#10b981' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? (
            <span>💾 Kaydediliyor...</span>
          ) : saved ? (
            <span>✅ Kaydedildi!</span>
          ) : (
            <span>💾 Değişiklikleri Kaydet</span>
          )}
        </button>
      </div>
    </div>
  );
};

// Ortak input stilleri
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '10px',
  fontSize: '14px',
  color: '#f1f5f9',
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
};

export default ThemeEdit;