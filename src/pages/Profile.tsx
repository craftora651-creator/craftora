// Profile.tsx
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCog, FaPlus, FaPlay, FaEye, FaShoppingBag, FaUserPlus, FaStore, FaStar } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

interface ProfileProps {
  onNavigate?: (page: string) => void;
  userPlan?: 'free' | 'premium'; // Kullanıcının planı
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, userPlan = 'free' }) => {
  const [activeTab, setActiveTab] = useState('videos'); // videos, liked, saved
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Kullanıcı verileri (geçici)
  const userData = {
    name: 'Emma Watson',
    username: '@emmawatson',
    bio: 'Fashion lover | Content Creator | Craftora Ambassador ✨',
    avatar: 'https://images.unsplash.com/photo-1494790108777-466d5eb9166c?w=150&h=150&fit=crop',
    followers: '12.5K',
    shopVisitors: '8.2K',
    reviews: '156',
    isVerified: true,
    isPremium: userPlan === 'premium'
  };

  // Videolar (geçici)
  const videos = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&h=400&fit=crop', views: '12.5K', sales: 42 },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=300&h=400&fit=crop', views: '8.2K', sales: 28 },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=300&h=400&fit=crop', views: '15.3K', sales: 67 },
    { id: 4, thumbnail: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=300&h=400&fit=crop', views: '5.1K', sales: 19 },
    { id: 5, thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&h=400&fit=crop', views: '22.4K', sales: 103 },
    { id: 6, thumbnail: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=300&h=400&fit=crop', views: '9.8K', sales: 34 },
  ];

  // Renkler
  const colors = {
    bg: isDarkMode ? '#0a0a0a' : '#ffffff',
    surface: isDarkMode ? '#141414' : '#f8f8f8',
    surface2: isDarkMode ? '#1f1f1f' : '#f0f0f0',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    textSecondary: isDarkMode ? '#a0a0a0' : '#666666',  // ? ile düzelt
    border: isDarkMode ? '#2a2a2a' : '#e5e5e5',
    primary: '#e07c5c',
    primaryDark: '#c96b4d',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.bg,
      color: colors.text,
      fontFamily: "'Space Grotesk', sans-serif",
      paddingBottom: '80px'
    }}>
      {/* Üst Bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: colors.bg,
        borderBottom: `1px solid ${colors.border}`,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => onNavigate?.('back')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              borderRadius: '50%',
              transition: 'all 0.2s'
            }}
          >
            <FaArrowLeft size={20} />
          </button>
          <div style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '-0.5px',
            background: `linear-gradient(135deg, #ffffff, ${colors.primary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CRAFT<span style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>ORA</span>
          </div>
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: colors.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            borderRadius: '50%',
            transition: 'all 0.2s'
          }}
        >
          <FaCog size={20} />
        </button>
      </div>

      {/* Profil Bilgileri */}
      <div style={{ padding: '24px 20px' }}>
        {/* Avatar ve İsim */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundImage: `url(${userData.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: `3px solid ${colors.primary}`
          }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{userData.name}</h2>
              {userData.isVerified && <MdVerified size={20} color={colors.primary} />}
            </div>
            <p style={{ color: colors.textSecondary, margin: '4px 0 8px' }}>{userData.username}</p>
            <p style={{ fontSize: 14, color: colors.textSecondary, maxWidth: 300 }}>{userData.bio}</p>
          </div>
        </div>

        {/* Premium Plan Butonu */}
        {!userData.isPremium && (
          <div style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            borderRadius: 16,
            padding: '12px 20px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>✨ Premium Plan</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Video ekleme ve daha fazlası</div>
            </div>
            <button style={{
              background: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: 30,
              fontWeight: 600,
              fontSize: 13,
              color: colors.primary,
              cursor: 'pointer'
            }}>
              Yükselt
            </button>
          </div>
        )}

        {/* Premium kullanıcı için Video Ekle Butonu */}
        {userData.isPremium && (
          <button style={{
            width: '100%',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
            border: 'none',
            padding: '14px',
            borderRadius: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'white',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            marginBottom: 24,
            transition: 'all 0.2s'
          }}>
            <FaPlus size={16} />
            Yeni Video Ekle
          </button>
        )}

        {/* İstatistikler */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          gap: 16,
          padding: '20px 0',
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: 24
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>{userData.followers}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>Takipçi</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>{userData.shopVisitors}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>Mağaza Ziyaretçisi</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary }}>{userData.reviews}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>Değerlendirme</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 32,
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: 20
        }}>
          <button
            onClick={() => setActiveTab('videos')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 0',
              fontSize: 15,
              fontWeight: activeTab === 'videos' ? 600 : 400,
              color: activeTab === 'videos' ? colors.primary : colors.textSecondary,
              cursor: 'pointer',
              borderBottom: activeTab === 'videos' ? `2px solid ${colors.primary}` : 'none',
              transition: 'all 0.2s'
            }}
          >
            Videolar
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 0',
              fontSize: 15,
              fontWeight: activeTab === 'liked' ? 600 : 400,
              color: activeTab === 'liked' ? colors.primary : colors.textSecondary,
              cursor: 'pointer',
              borderBottom: activeTab === 'liked' ? `2px solid ${colors.primary}` : 'none',
              transition: 'all 0.2s'
            }}
          >
            Beğenilenler
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 0',
              fontSize: 15,
              fontWeight: activeTab === 'saved' ? 600 : 400,
              color: activeTab === 'saved' ? colors.primary : colors.textSecondary,
              cursor: 'pointer',
              borderBottom: activeTab === 'saved' ? `2px solid ${colors.primary}` : 'none',
              transition: 'all 0.2s'
            }}
          >
            Kaydedilenler
          </button>
        </div>

        {/* Video Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16
        }}>
          {videos.map((video) => (
            <div
              key={video.id}
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: colors.surface2,
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
            >
              <div style={{
                position: 'relative',
                aspectRatio: '9/16',
                backgroundImage: `url(${video.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: 20,
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <FaPlay size={10} color="white" />
                  <span style={{ fontSize: 11, color: 'white' }}>{video.views}</span>
                </div>
              </div>
              <div style={{
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaEye size={12} color={colors.textSecondary} />
                    <span style={{ fontSize: 12, color: colors.textSecondary }}>{video.views}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaShoppingBag size={12} color={colors.primary} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: colors.primary }}>{video.sales}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boş durum */}
        {videos.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: colors.textSecondary
          }}>
            Henüz video yok
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;