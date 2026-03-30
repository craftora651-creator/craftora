// src/themes/pages/ContactPage.tsx
import React, { useState, useEffect } from 'react';
import { useSendEmail } from '../../server/Gin/email.hooks';

interface ContactPageProps {
  settings: any;
  shopId: string;
  isDarkMode?: boolean;
}

const ContactPage: React.FC<ContactPageProps> = ({ settings, shopId, isDarkMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const { mutate: sendEmail, isPending, isSuccess, isError, reset } = useSendEmail();

  // Light/Dark mode renkleri
  const lightColors = {
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    accent: '#3b82f6',
    border: '#eef2f6',
    background: '#ffffff',
    cardBg: '#f9fafb',
    inputBg: '#ffffff',
    notificationSuccess: '#10b981',
    notificationError: '#ef4444',
  };

  const darkColors = {
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    accent: '#60a5fa',
    border: '#374151',
    background: '#111827',
    cardBg: '#1f2937',
    inputBg: '#374151',
    notificationSuccess: '#10b981',
    notificationError: '#ef4444',
  };

  const colors = isDarkMode ? darkColors : (settings?.colors || lightColors);

  // Satıcının iletişim bilgileri (API'den gelecek, şimdilik mock)
  const sellerInfo = {
    name: 'Craftora Destek',
    email: 'destek@craftora.com',
    phone: '+90 555 123 45 67',
    address: 'Maslak, İstanbul / Türkiye',
    workingHours: 'Pazartesi - Cuma: 09:00 - 18:00',
    socialMedia: {
      instagram: 'https://instagram.com/craftora',
      twitter: 'https://twitter.com/craftora',
      linkedin: 'https://linkedin.com/company/craftora',
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Craftora Messages - Bildirim göster
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    sendEmail({
      to: sellerInfo.email,
      subject: formData.subject,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #3b82f6; margin-bottom: 20px;">📬 Yeni İletişim Mesajı</h2>
          <div style="margin-bottom: 20px; padding: 12px; background-color: #f9fafb; border-radius: 8px;">
            <p style="margin: 8px 0;"><strong>👤 Gönderen:</strong> ${formData.name}</p>
            <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${formData.email}</p>
            <p style="margin: 8px 0;"><strong>📌 Konu:</strong> ${formData.subject}</p>
            <p style="margin: 8px 0;"><strong>🆔 Mağaza ID:</strong> ${shopId}</p>
          </div>
          <div style="padding: 16px; background-color: #fef3c7; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; font-style: italic;">${formData.message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            Bu mesaj Craftora üzerinden gönderilmiştir.
          </p>
        </div>
      `,
      template: 'contact',
    });
  };

  // Başarılı/başarısız durumları bildirim olarak göster
  useEffect(() => {
    if (isSuccess) {
      showNotification('success', '✅ Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (isError) {
      showNotification('error', '❌ Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  }, [isError]);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '80px 24px',
      backgroundColor: colors.background,
      minHeight: 'calc(100vh - 200px)',
      position: 'relative',
    }}>
      {/* Craftora Messages - Bildirim */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '24px',
          zIndex: 1000,
          animation: 'slideInRight 0.3s ease',
          maxWidth: '400px',
          width: 'calc(100% - 48px)',
        }}>
          <div style={{
            backgroundColor: notification.type === 'success' ? colors.notificationSuccess : colors.notificationError,
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '20px' }}>
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span style={{ flex: 1, fontSize: '14px', lineHeight: 1.4 }}>
              {notification.message}
            </span>
            <button
              onClick={() => setNotification(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px',
                opacity: 0.8,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Başlık */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{
          fontSize: '14px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: '16px',
        }}>Bize Ulaşın</div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 700,
          color: colors.textPrimary,
          marginBottom: '20px',
          fontFamily: "'Playfair Display', Georgia, serif",
        }}>İletişim</h1>
        <div style={{
          width: '80px',
          height: '2px',
          backgroundColor: colors.accent,
          margin: '0 auto',
        }} />
        <p style={{
          fontSize: '18px',
          color: colors.textSecondary,
          marginTop: '24px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Sorularınız, önerileriniz veya iş birliği talepleriniz için bize yazın. 
          Size en kısa sürede dönüş yapalım.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '60px',
      }}>
        {/* Sol Taraf - İletişim Bilgileri */}
        <div>
          <div style={{
            backgroundColor: colors.cardBg,
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: colors.textPrimary,
              marginBottom: '24px',
            }}>İletişim Bilgileri</h2>

            {/* Email */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: '28px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: `${colors.accent}15`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>📧</div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.textPrimary,
                  marginBottom: '4px',
                }}>E-posta</h3>
                <a href={`mailto:${sellerInfo.email}`} style={{
                  color: colors.accent,
                  textDecoration: 'none',
                  fontSize: '15px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                  {sellerInfo.email}
                </a>
              </div>
            </div>

            {/* Telefon */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: '28px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: `${colors.accent}15`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>📞</div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.textPrimary,
                  marginBottom: '4px',
                }}>Telefon</h3>
                <a href={`tel:${sellerInfo.phone}`} style={{
                  color: colors.textSecondary,
                  textDecoration: 'none',
                  fontSize: '15px',
                }}>
                  {sellerInfo.phone}
                </a>
              </div>
            </div>

            {/* Adres */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: '28px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: `${colors.accent}15`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>📍</div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.textPrimary,
                  marginBottom: '4px',
                }}>Adres</h3>
                <p style={{
                  color: colors.textSecondary,
                  fontSize: '15px',
                  lineHeight: 1.5,
                }}>
                  {sellerInfo.address}
                </p>
              </div>
            </div>

            {/* Çalışma Saatleri */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: '28px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: `${colors.accent}15`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>🕐</div>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.textPrimary,
                  marginBottom: '4px',
                }}>Çalışma Saatleri</h3>
                <p style={{
                  color: colors.textSecondary,
                  fontSize: '15px',
                }}>
                  {sellerInfo.workingHours}
                </p>
              </div>
            </div>

            {/* Sosyal Medya */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: colors.textPrimary,
                marginBottom: '16px',
              }}>Sosyal Medya</h3>
              <div style={{ display: 'flex', gap: '16px' }}>
                {Object.entries(sellerInfo.socialMedia).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: `${colors.accent}15`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.accent;
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.accent}15`;
                      e.currentTarget.style.color = 'inherit';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {platform === 'instagram' && '📷'}
                    {platform === 'twitter' && '🐦'}
                    {platform === 'linkedin' && '🔗'}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Mesaj Formu */}
        <div>
          <div style={{
            backgroundColor: colors.cardBg,
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: colors.textPrimary,
              marginBottom: '24px',
            }}>Mesaj Gönder</h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.textPrimary,
                  marginBottom: '8px',
                }}>
                  Adınız Soyadınız *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: colors.textPrimary,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.accent;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.textPrimary,
                  marginBottom: '8px',
                }}>
                  E-posta Adresiniz *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: colors.textPrimary,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.accent;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.textPrimary,
                  marginBottom: '8px',
                }}>
                  Konu *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: colors.textPrimary,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.accent;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: colors.textPrimary,
                  marginBottom: '8px',
                }}>
                  Mesajınız *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    fontSize: '15px',
                    color: colors.textPrimary,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.accent;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accent}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                style={{
                  width: '100%',
                  backgroundColor: colors.accent,
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '40px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.7 : 1,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  if (!isPending) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.accent}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isPending ? (
                  <>
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: `2px solid white`,
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                    }} />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    Mesaj Gönder
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Animasyonlar */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;