// Settings.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTimes, 
  FaUser, 
  FaBell, 
  FaLock, 
  FaPalette, 
  FaLanguage, 
  FaQuestionCircle, 
  FaSignOutAlt,
  FaChevronRight,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
    } else {
      setTimeout(() => setAnimate(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !animate) return null;

  const userData = {
    name: 'Emma Watson',
    username: '@emmawatson',
    email: 'emma@craftora.com',
    avatar: 'https://images.unsplash.com/photo-1494790108777-466d5eb9166c?w=150&h=150&fit=crop',
    isVerified: true
  };

  const menuItems = [
    { icon: <FaUser />, label: 'Profilim', description: 'Kişisel bilgilerini düzenle', onClick: () => navigate('/medya-profile') },
    { icon: <FaBell />, label: 'Bildirimler', description: 'Bildirim tercihlerini yönet', onClick: () => {} },
    { icon: <FaLock />, label: 'Gizlilik ve Güvenlik', description: 'Hesap güvenlik ayarları', onClick: () => navigate('/security') },
    { icon: <FaPalette />, label: 'Tema', description: 'Light / Dark mod seçimi', onClick: () => setIsDarkMode(!isDarkMode) },
    { icon: <FaLanguage />, label: 'Dil', description: 'Türkçe / English', onClick: () => {} },
    { icon: <FaQuestionCircle />, label: 'Yardım', description: 'Sık sorulan sorular', onClick: () => {} },
  ];

  const colors = {
    bg: '#121212',
    surface: '#1e1e1e',
    surface2: '#2a2a2a',
    text: '#eeeeee',
    textSecondary: '#a0a0a0',
    border: '#2a2a2a',
    primary: '#e07c5c',
    primaryDark: '#c96b4d',
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          animation: isOpen ? 'fadeIn 0.3s ease' : 'fadeOut 0.3s ease',
          transition: 'all 0.3s ease'
        }}
      />

      {/* Sidebar Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: 420,
        backgroundColor: colors.bg,
        boxShadow: '-4px 0 30px rgba(0,0,0,0.5)',
        zIndex: 1001,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: colors.text }}>Ayarlar</h2>
          <button
            onClick={onClose}
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
              color: colors.textSecondary,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.primary}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.surface2}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Profil Bilgisi */}
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          cursor: 'pointer'
        }}
        onClick={() => {
          onClose();
          navigate('/profile');
        }}
        >
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundImage: `url(${userData.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: `2px solid ${colors.primary}`
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{userData.name}</span>
              {userData.isVerified && <MdVerified size={14} color={colors.primary} />}
            </div>
            <span style={{ fontSize: 13, color: colors.textSecondary }}>{userData.email}</span>
          </div>
          <FaChevronRight size={16} color={colors.textSecondary} />
        </div>

        {/* Menü Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={item.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderBottom: index !== menuItems.length - 1 ? `1px solid ${colors.border}` : 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = colors.surface2}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: colors.surface2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.primary,
                fontSize: 18
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: colors.text }}>{item.label}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>{item.description}</div>
              </div>
              {item.label === 'Tema' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: colors.surface2,
                  padding: '4px 8px',
                  borderRadius: 30
                }}>
                  {isDarkMode ? <FaMoon size={12} color={colors.primary} /> : <FaSun size={12} color={colors.primary} />}
                  <span style={{ fontSize: 12, color: colors.text }}>{isDarkMode ? 'Dark' : 'Light'}</span>
                </div>
              )}
              <FaChevronRight size={14} color={colors.textSecondary} />
            </div>
          ))}
        </div>

        {/* Çıkış Butonu */}
        <div style={{
          padding: '20px',
          borderTop: `1px solid ${colors.border}`
        }}>
          <button
            onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              navigate('/login');
            }}
            style={{
              width: '100%',
              background: 'none',
              border: `1px solid ${colors.border}`,
              padding: '14px',
              borderRadius: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              color: colors.textSecondary,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ff444410';
              e.currentTarget.style.borderColor = '#ff4444';
              e.currentTarget.style.color = '#ff4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.color = colors.textSecondary;
            }}
          >
            <FaSignOutAlt size={16} />
            Çıkış Yap
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default Settings;