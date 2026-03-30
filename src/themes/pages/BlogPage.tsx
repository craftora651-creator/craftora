// src/themes/pages/BlogPage.tsx
import React from 'react';
import { usePosts } from '../../server/Gin/theme.hook';
import type { ThemeSettings } from '../../types/theme.types';

// makeEditable helper'ı buraya ekle (veya dışarıdan import et)

type OnElementClick = (
  elementType: string,
  meta?: { id?: number; currentData?: Record<string, string> }
) => void;

const makeEditable = (
  elementType: string,
  isEditing: boolean,
  onElementClick?: OnElementClick,
  meta?: { id?: number; currentData?: Record<string, string> },
  accentColor: string = '#3b82f6'
) => {
  if (!isEditing) return {};
  return {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onElementClick?.(elementType, meta);
    },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.outline = `2px dashed ${accentColor}`;
      e.currentTarget.style.backgroundColor = `${accentColor}18`;
      e.currentTarget.style.cursor = 'pointer';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.outline = 'none';
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.cursor = 'default';
    },
  };
};

interface BlogPageProps {
  settings?: ThemeSettings;
  isDarkMode?: boolean;
  isEditing?: boolean;           // YENİ
  onElementClick?: (            // YENİ
    elementType: string,
    meta?: { id?: number; currentData?: Record<string, string> }
  ) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ 
  isDarkMode = false,
  isEditing = false,      // YENİ - default false
  onElementClick          // YENİ
}) => {
  const { data: posts, isLoading } = usePosts(true, 100, 0);

  // Light/Dark mode renkleri (aynı kalabilir)
  const lightColors = {
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    accent: '#3b82f6',
    border: '#e5e7eb',
    background: '#ffffff',
    quoteBg: '#f9fafb',
    cardBg: '#ffffff',
    tagBg: '#f3f4f6',
    tagHover: '#3b82f6',
  };

  const darkColors = {
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    accent: '#60a5fa',
    border: '#374151',
    background: '#111827',
    quoteBg: '#1f2937',
    cardBg: '#1f2937',
    tagBg: '#374151',
    tagHover: '#60a5fa',
  };

  const colors = isDarkMode ? darkColors : lightColors;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: `3px solid ${colors.border}`,
          borderTopColor: colors.accent,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '80px 32px',
      backgroundColor: colors.background,
      fontFamily: "'Georgia', 'Times New Roman', serif",
      transition: 'background-color 0.3s ease',
    }}>
      {/* Blog Başlığı - EDITABLE YAPILDI */}
      <div 
        {...makeEditable('blog-header', isEditing, onElementClick, {
          currentData: {
            title: 'BLOG',
            subtitle: 'Her yazı bir yolculuk, her satır bir keşif'
          }
        }, colors.accent)}
        style={{ textAlign: 'center', marginBottom: '80px', cursor: isEditing ? 'pointer' : 'default' }}
      >
        <div style={{
          fontSize: '14px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: '16px',
        }}>KELİMELERİN DERGÂHI</div>
        <h1 style={{
          fontSize: '64px',
          fontWeight: 700,
          color: colors.textPrimary,
          marginBottom: '24px',
          letterSpacing: '-0.02em',
          fontFamily: "'Playfair Display', 'Georgia', serif",
          transition: 'color 0.3s ease',
        }}>BLOG</h1>
        <div style={{
          width: '100px',
          height: '2px',
          backgroundColor: colors.accent,
          margin: '0 auto',
        }} />
        <p style={{
          fontSize: '18px',
          color: colors.textSecondary,
          marginTop: '24px',
          fontStyle: 'italic',
          transition: 'color 0.3s ease',
        }}>Her yazı bir yolculuk, her satır bir keşif</p>
      </div>

      {/* Yazılar */}
      {posts?.map((post, idx) => (
        <article key={post.id} style={{ marginBottom: '120px' }}>
          
          {/* BAŞLIK ve TARİH - EDITABLE */}
          <div 
            {...makeEditable('blog-post-header', isEditing, onElementClick, {
              id: post.id,
              currentData: {
                title: post.title,
                author: post.author_name || 'Craftora',
                date: post.published_at ? new Date(post.published_at).toLocaleDateString('tr-TR') : 'Yakında'
              }
            }, colors.accent)}
            style={{ marginBottom: '48px', cursor: isEditing ? 'pointer' : 'default' }}
          >
            <div style={{
              fontSize: '13px',
              color: colors.accent,
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              {post.published_at ? new Date(post.published_at).toLocaleDateString('tr-TR') : 'Yakında'} • {post.author_name || 'Craftora'}
            </div>
            
            <h2 style={{
              fontSize: '42px',
              fontWeight: 700,
              color: colors.textPrimary,
              marginBottom: '28px',
              lineHeight: 1.2,
              fontFamily: "'Playfair Display', 'Georgia', serif",
              transition: 'color 0.3s ease',
            }}>
              {post.title}
            </h2>
            
            {/* ÖZET - EDITABLE */}
            <p 
              {...makeEditable('blog-post-excerpt', isEditing, onElementClick, {
                id: post.id,
                currentData: { excerpt: post.excerpt || 'Bir varmış bir yokmuş...' }
              }, colors.accent)}
              style={{
                fontSize: '18px',
                lineHeight: 1.8,
                color: colors.textSecondary,
                marginBottom: '32px',
                transition: 'color 0.3s ease',
                cursor: isEditing ? 'pointer' : 'default'
              }}
            >
              {post.excerpt || 'Bir varmış bir yokmuş, evvel zaman içinde kalbur saman içinde... İnsanlığın en kadim sorularından biriydi: Güzellik nerede başlar, nerede biter? Bu yazıda, estetiğin derin sularında bir yolculuğa çıkıyoruz.'}
            </p>
          </div>

          {/* 1. FOTOĞRAF - EDITABLE */}
          {post.featured_image && (
            <div 
              {...makeEditable('blog-post-image', isEditing, onElementClick, {
                id: post.id,
                currentData: { imageUrl: post.featured_image, caption: `${post.title} — Kapak görseli` }
              }, colors.accent)}
              style={{
                marginBottom: '48px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 35px -12px rgba(0,0,0,0.15)',
                cursor: isEditing ? 'pointer' : 'default'
              }}
            >
              <img
                src={post.featured_image}
                alt={post.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition: 'transform 0.6s ease',
                }}
                onMouseEnter={(e) => !isEditing && (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                padding: '12px 20px',
                backgroundColor: colors.quoteBg,
                fontSize: '13px',
                color: colors.textSecondary,
                textAlign: 'center',
                borderTop: `1px solid ${colors.border}`,
                transition: 'all 0.3s ease',
              }}>
                📷 {post.title} — Kapak görseli, ilk bakışta ruhu okşar
              </div>
            </div>
          )}

          {/* İÇERİK - EDITABLE (tüm yazı bloğu tek bir editable olabilir) */}
          <div 
            {...makeEditable('blog-post-content', isEditing, onElementClick, {
              id: post.id,
              currentData: { content: post.content || 'İnsan ruhunun derinliklerinde...' }
            }, colors.accent)}
            style={{ cursor: isEditing ? 'pointer' : 'default' }}
          >
            <div style={{ marginBottom: '48px' }}>
              <p style={{
                fontSize: '17px',
                lineHeight: 1.9,
                color: colors.textSecondary,
                marginBottom: '28px',
                transition: 'color 0.3s ease',
              }}>
                İnsan ruhunun derinliklerinde saklı olan o esrarengiz güzellik, zamanın tozlu sayfaları arasında kendine bir yer arar. Kimi zaman bir tablonun fırça darbelerinde, kimi zaman bir şiirin mısralarında, kimi zaman da bir mimari eserin kubbesinde kendini gösterir. İşte bu yazı, o güzelliğin peşinde bir serüven.
              </p>
              
              <p style={{
                fontSize: '17px',
                lineHeight: 1.9,
                color: colors.textSecondary,
                marginBottom: '32px',
                transition: 'color 0.3s ease',
              }}>
                Antik Yunan'dan Rönesans'a, Osmanlı'dan modern zamanlara kadar uzanan bu yolculukta, güzelliğin değişmeyen yüzünü görmek mümkün. Platon'un 'İdealar'ından, Aristoteles'in 'Mimesis'ine; İbn-i Arabi'nin 'Aşk' anlayışından, Mevlana'nın 'Ney'ine kadar uzanan bir düşünce iklimi bizi bekliyor.
              </p>
            </div>

            {/* ALINTI - EDITABLE */}
            <div 
              {...makeEditable('blog-post-quote', isEditing, onElementClick, {
                id: post.id,
                currentData: { quote: '“Güzellik, gören gözler içindir değil, seven yürekler içindir.”', author: 'Mevlânâ' }
              }, colors.accent)}
              style={{
                borderLeft: `5px solid ${colors.accent}`,
                paddingLeft: '32px',
                marginTop: '48px',
                marginBottom: '48px',
                backgroundColor: colors.quoteBg,
                padding: '32px',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                cursor: isEditing ? 'pointer' : 'default'
              }}
            >
              <p style={{
                fontSize: '24px',
                fontStyle: 'italic',
                color: colors.textPrimary,
                fontWeight: 500,
                lineHeight: 1.4,
                fontFamily: "'Playfair Display', 'Georgia', serif",
                transition: 'color 0.3s ease',
              }}>
                “Güzellik, gören gözler içindir değil, seven yürekler içindir.”
              </p>
              <p style={{
                fontSize: '14px',
                color: colors.accent,
                marginTop: '16px',
              }}>
                — Mevlânâ Celâleddîn-i Rûmî
              </p>
            </div>
          </div>

          {/* ETİKETLER - EDITABLE */}
          {post.tags && post.tags.length > 0 && (
            <div 
              {...makeEditable('blog-post-tags', isEditing, onElementClick, {
                id: post.id,
                currentData: { tags: post.tags.join(', ') }
              }, colors.accent)}
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '32px',
                cursor: isEditing ? 'pointer' : 'default'
              }}
            >
              {post.tags.map(tag => (
                <span key={tag} style={{
                  backgroundColor: colors.tagBg,
                  padding: '6px 16px',
                  borderRadius: '30px',
                  fontSize: '12px',
                  color: colors.textSecondary,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.tagHover;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.tagBg;
                  e.currentTarget.style.color = colors.textSecondary;
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Ayırıcı */}
          {idx !== posts.length - 1 && (
            <div style={{
              marginTop: '80px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '60px',
                height: '3px',
                backgroundColor: colors.accent,
                margin: '0 auto',
              }} />
              <div style={{
                fontSize: '24px',
                color: colors.border,
                marginTop: '16px',
              }}>✦ ✦ ✦</div>
            </div>
          )}
        </article>
      ))}

      {/* Boş Durum */}
      {posts?.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '100px 0',
          color: colors.textSecondary,
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📖</div>
          <p style={{ fontSize: '20px' }}>Henüz bir hikaye yazılmamış.</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>İlk yazıyı sen ekle, destanlar seninle başlasın.</p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BlogPage;