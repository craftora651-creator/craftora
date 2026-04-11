// pages/Security.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaGoogle, 
  FaShieldAlt, 
  FaTrashAlt, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaEnvelope,
  FaIdCard,
  FaClock,
  FaInfoCircle
} from 'react-icons/fa';
import { useCurrentUser, useDeleteAccount } from '../server/FastAPI/user.hooks';
import { useLogout } from '../server/FastAPI/auth.hooks';

const Security: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const deleteAccount = useDeleteAccount();
  const logout = useLogout();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const colors = {
    bg: '#121212',
    surface: '#1e1e1e',
    surface2: '#2a2a2a',
    surface3: '#363636',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    textMuted: '#6b6b6b',
    border: '#2a2a2a',
    primary: '#e07c5c',
    primaryDark: '#c96b4d',
    danger: '#ff4444',
    dangerDark: '#cc0000',
    warning: '#ff9800',
    success: '#4caf50',
    google: '#4285f4',
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount.mutateAsync();
      await logout.mutateAsync();
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Hesap silme hatası:', error);
      setIsDeleting(false);
    }
  };

  // Hesap oluşturma tarihini formatla
  const formattedDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '-';

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      paddingBottom: 40
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        zIndex: 10
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: colors.surface2,
            border: 'none',
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: colors.text
          }}
        >
          <FaArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: colors.text }}>
          Gizlilik ve Güvenlik
        </h1>
      </div>

      {/* Ana İçerik */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
        
        {/* Bağlı Hesap Kartı - Google Detaylı */}
        <div style={{
          background: colors.surface,
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              background: `${colors.google}15`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaGoogle size={24} color={colors.google} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: colors.text }}>Google ile Bağlı</div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>Kimlik Doğrulama Sağlayıcısı</div>
            </div>
          </div>

          <div style={{
            background: colors.surface2,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <FaEnvelope size={14} color={colors.textMuted} />
              <span style={{ fontSize: 13, color: colors.textMuted }}>Bağlı E-posta</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: colors.text, marginLeft: 24 }}>
              {user?.email}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaClock size={12} color={colors.textMuted} />
              <span style={{ fontSize: 12, color: colors.textMuted }}>Hesap oluşturulma:</span>
              <span style={{ fontSize: 12, color: colors.textSecondary }}>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Kimlik Doğrulama Kartı */}
        <div style={{
          background: colors.surface,
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              background: `${colors.success}15`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaIdCard size={24} color={colors.success} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: colors.text }}>Kimlik Doğrulama</div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>Hesap Güvenlik Durumu</div>
            </div>
          </div>

          <div style={{
            background: user?.is_verified ? `${colors.success}10` : `${colors.warning}10`,
            borderRadius: 16,
            padding: 16,
            border: `1px solid ${user?.is_verified ? colors.success : colors.warning}30`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {user?.is_verified ? (
                <FaCheckCircle size={24} color={colors.success} />
              ) : (
                <FaExclamationTriangle size={24} color={colors.warning} />
              )}
              <div>
                <div style={{ 
                  fontSize: 14, 
                  fontWeight: 500, 
                  color: user?.is_verified ? colors.success : colors.warning 
                }}>
                  {user?.is_verified ? 'Doğrulanmış Hesap' : 'Doğrulanmamış Hesap'}
                </div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>
                  {user?.is_verified 
                    ? 'E-posta adresiniz doğrulanmıştır. Hesabınız tam güvenliktedir.'
                    : 'E-posta adresiniz doğrulanmamıştır. Bazı özellikler kısıtlı olabilir.'
                  }
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 12, background: colors.surface2, borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FaInfoCircle size={12} color={colors.primary} />
              <span style={{ fontSize: 12, color: colors.primary, fontWeight: 500 }}>Google ile Güvenli Giriş</span>
            </div>
            <p style={{ fontSize: 12, color: colors.textSecondary, margin: 0, lineHeight: 1.5 }}>
              Google hesabınızla giriş yaptığınız için ayrı bir şifre yönetimine ihtiyacınız yoktur. 
              Tüm güvenlik ayarlarınız Google hesabınız üzerinden yönetilir.
            </p>
          </div>
        </div>

        {/* Hesap Yönetimi Kartı */}
        <div style={{
          background: colors.surface,
          borderRadius: 24,
          padding: 20,
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              background: `${colors.danger}15`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaTrashAlt size={22} color={colors.danger} />
            </div>
            <div>
              <div style={{ fontWeight: 600, color: colors.text }}>Hesap Yönetimi</div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>Kalıcı işlemler</div>
            </div>
          </div>

          {/* Hesap Silme Butonu */}
          <div
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: `${colors.danger}08`,
              borderRadius: 16,
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: `1px solid ${colors.danger}30`
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${colors.danger}15`}
            onMouseLeave={(e) => e.currentTarget.style.background = `${colors.danger}08`}
          >
            <div>
              <div style={{ fontWeight: 500, color: colors.danger, marginBottom: 4 }}>Hesabı Kalıcı Olarak Sil</div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>
                Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
              </div>
            </div>
            <div style={{ color: colors.danger, fontSize: 20 }}>›</div>
          </div>
        </div>

        {/* Bilgi Notu */}
        <div style={{
          marginTop: 20,
          padding: '12px 16px',
          background: `${colors.primary}08`,
          borderRadius: 16,
          border: `1px solid ${colors.primary}20`,
          textAlign: 'center'
        }}>
          <FaShieldAlt size={14} color={colors.primary} style={{ marginRight: 8 }} />
          <span style={{ fontSize: 12, color: colors.textSecondary }}>
            Hesabınız Google OAuth ile korunmaktadır. Ek güvenlik için Google hesabınızın güvenlik ayarlarını kontrol edin.
          </span>
        </div>
      </div>

      {/* Hesap Silme Onay Modalı */}
      {showDeleteConfirm && (
        <>
          <div
            onClick={() => setShowDeleteConfirm(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(4px)',
              zIndex: 100
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            background: colors.surface,
            borderRadius: 24,
            padding: 24,
            zIndex: 101,
            border: `1px solid ${colors.danger}`
          }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 56,
                height: 56,
                background: `${colors.danger}20`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <FaExclamationTriangle size={28} color={colors.danger} />
              </div>
              <h3 style={{ color: colors.text, marginBottom: 8 }}>Hesabınızı Silmek İstediğinize Emin misiniz?</h3>
              <p style={{ color: colors.textSecondary, fontSize: 13 }}>
                Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
              </p>
            </div>

            <textarea
              placeholder="Neden hesabınızı silmek istiyorsunuz? (isteğe bağlı)"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: colors.surface2,
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                color: colors.text,
                fontSize: 14,
                resize: 'vertical',
                marginBottom: 20,
                fontFamily: 'inherit'
              }}
              rows={3}
            />

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  background: colors.surface2,
                  border: `1px solid ${colors.border}`,
                  padding: '12px',
                  borderRadius: 40,
                  color: colors.text,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                İptal
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  background: colors.danger,
                  border: 'none',
                  padding: '12px',
                  borderRadius: 40,
                  color: 'white',
                  fontWeight: 500,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  opacity: isDeleting ? 0.7 : 1
                }}
              >
                {isDeleting ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Başarılı Bildirimi */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          background: colors.success,
          color: 'white',
          padding: '12px 24px',
          borderRadius: 40,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          zIndex: 200,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <FaCheckCircle size={14} /> Hesabınız başarıyla silindi
        </div>
      )}
    </div>
  );
};

export default Security;