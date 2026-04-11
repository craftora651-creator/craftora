// pages/Profile.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser, useUpdateProfile } from '../server/FastAPI/user.hooks';
import { FaArrowLeft, FaCheck, FaPen, FaEnvelope, FaCamera, FaPhone, FaStore, FaCalendar, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { apiClient } from '../api/apiClient';
import { useQueryClient } from '@tanstack/react-query';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { data: user, isLoading, refetch } = useCurrentUser();
    const updateProfile = useUpdateProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        avatar_url: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();


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
        primaryLight: '#f0a088',
        success: '#4caf50',
    };

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: colors.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ color: colors.primary }}>Yükleniyor...</div>
            </div>
        );
    }

    const handleSave = async () => {
        await updateProfile.mutateAsync(formData);
        await refetch();
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.log("❌ Dosya seçilmedi!");
            return;
        }

        console.log("📸 Dosya seçildi:", file.name, file.type, file.size);

        setIsUploading(true);
        try {
            console.log("🚀 Dosya yükleniyor...");
            const uploadResult = await apiClient.uploadFile(file, user?.id || '', 'product_image');

            console.log("📦 TÜM uploadResult:", JSON.stringify(uploadResult, null, 2));
            console.log("📦 s3_url:", uploadResult.file?.s3_url);

            const avatarUrl = uploadResult.file?.s3_url;

            if (avatarUrl) {
                console.log("✅ Avatar URL alındı:", avatarUrl);

                console.log("💾 Profil güncelleniyor...");
                await updateProfile.mutateAsync({ avatar_url: avatarUrl });

                console.log("🔄 Cache yenileniyor...");
                await refetch();  // ✅ refetch yeterli, queryClient'a gerek yok!
                const newUser = queryClient.getQueryData(['user', 'current']);
                console.log("🔄 Yeni avatar:", newUser?.avatar_url);


            } else {
                console.log("❌ Avatar URL bulunamadı!");
            }

        } catch (error) {
            console.error('❌ Avatar yükleme hatası:', error);
        } finally {
            setIsUploading(false);
            console.log("🏁 Avatar yükleme işlemi tamamlandı.");
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: colors.bg,
            paddingBottom: 80
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
                    Profilim
                </h1>
                {!isEditing && (
                    <button
                        onClick={() => {
                            setFormData({
                                full_name: user?.full_name || '',
                                phone_number: user?.phone_number || '',
                                avatar_url: user?.avatar_url || ''
                            });
                            setIsEditing(true);
                        }}
                        style={{
                            marginLeft: 'auto',
                            background: 'none',
                            border: 'none',
                            color: colors.primary,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <FaPen size={12} /> Düzenle
                    </button>
                )}
            </div>

            {/* Başarılı Bildirimi */}
            {showSuccess && (
                <div style={{
                    position: 'fixed',
                    top: 80,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: colors.success,
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: 40,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    zIndex: 100,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <FaCheck size={14} /> Profil başarıyla güncellendi
                </div>
            )}

            {/* Ana İçerik */}
            <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>

                {/* Avatar Kartı */}
                <div style={{
                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.surface})`,
                    borderRadius: 28,
                    padding: 24,
                    marginBottom: 24,
                    textAlign: 'center',
                    border: `1px solid ${colors.border}`
                }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=${colors.primary.replace('#', '')}&color=fff&size=120`}
                            alt="Avatar"
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: `4px solid ${colors.primary}`,
                                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                            }}
                        />

                        {/* ✅ Kamera butonu */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            style={{
                                position: 'absolute',
                                bottom: 4,
                                right: 4,
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: colors.primary,
                                border: `2px solid ${colors.surface}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isUploading ? (
                                <FaSpinner size={14} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <FaCamera size={14} color="white" />
                            )}
                        </button>

                        {/* Gizli file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleAvatarUpload}
                            style={{ display: 'none' }}
                        />

                        {user?.is_verified && (
                            <MdVerified
                                size={24}
                                color={colors.primary}
                                style={{
                                    position: 'absolute',
                                    bottom: 4,
                                    left: 4,
                                    background: colors.surface,
                                    borderRadius: '50%'
                                }}
                            />
                        )}
                    </div>

                    <h2 style={{ fontSize: 22, fontWeight: 600, marginTop: 16, marginBottom: 4, color: colors.text }}>
                        {user?.full_name || 'İsimsiz Kullanıcı'}
                    </h2>
                    <p style={{ color: colors.textSecondary, fontSize: 14, margin: 0 }}>
                        {user?.role === 'seller' ? '👑 Satıcı' : '👤 Kullanıcı'}
                    </p>
                </div>

                {/* Bilgi Kartları */}
                <div style={{
                    background: colors.surface,
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: `1px solid ${colors.border}`
                }}>
                    {/* Email */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px 20px',
                        borderBottom: `1px solid ${colors.border}`
                    }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            background: `${colors.primary}15`,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <FaEnvelope color={colors.primary} size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>Email Adresi</div>
                            <div style={{ fontSize: 15, color: colors.text }}>{user?.email}</div>
                        </div>
                        <div style={{ fontSize: 12, color: colors.textMuted }}>Doğrulanmış ✓</div>
                    </div>

                    {/* Telefon */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px 20px',
                        borderBottom: `1px solid ${colors.border}`
                    }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            background: `${colors.primary}15`,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <FaPhone color={colors.primary} size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>Telefon Numarası</div>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={formData.phone_number}
                                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                    placeholder="+90 555 123 4567"
                                    style={{
                                        background: colors.surface2,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: 12,
                                        padding: '10px 12px',
                                        color: colors.text,
                                        fontSize: 14,
                                        width: '100%',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <div style={{ fontSize: 15, color: colors.text }}>
                                    {user?.phone_number || 'Telefon eklenmemiş'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Üyelik Tarihi */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px 20px'
                    }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            background: `${colors.primary}15`,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <FaCalendar color={colors.primary} size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>Üyelik Tarihi</div>
                            <div style={{ fontSize: 15, color: colors.text }}>
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : '-'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Satıcı Bilgileri (eğer satıcıysa) */}
                {user?.role === 'seller' && (
                    <div style={{
                        background: `linear-gradient(135deg, ${colors.primary}10, ${colors.surface})`,
                        borderRadius: 24,
                        padding: 20,
                        marginTop: 20,
                        border: `1px solid ${colors.primary}30`
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <FaStore size={20} color={colors.primary} />
                            <span style={{ fontWeight: 600, color: colors.text }}>Satıcı Bilgileri</span>
                            {/* ✅ Onaylı her zaman göster (veya kaldır) */}
                            <span style={{
                                background: `${colors.success}20`,
                                color: colors.success,
                                fontSize: 11,
                                padding: '4px 10px',
                                borderRadius: 20
                            }}>
                                <FaCheckCircle size={10} style={{ marginRight: 4 }} />
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                            <div>
                                <div style={{ fontSize: 11, color: colors.textMuted }}>Mağaza Sayısı</div>
                                <div style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>{user?.shop_count || 0}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: colors.textMuted }}>Satıcılık Başlangıcı</div>
                                <div style={{ fontSize: 14, color: colors.text }}>
                                    {user?.seller_since ? new Date(user.seller_since).toLocaleDateString('tr-TR') : '-'}
                                </div>
                            </div>
                        </div>

                        {/* İşletme Bilgileri (varsa göster) */}
                        {(user?.business_name || user?.tax_id) && (
                            <div style={{
                                marginTop: 12,
                                paddingTop: 12,
                                borderTop: `1px solid ${colors.border}`
                            }}>
                                {user?.business_name && (
                                    <div style={{ marginBottom: 8 }}>
                                        <div style={{ fontSize: 11, color: colors.textMuted }}>İşletme Adı</div>
                                        <div style={{ fontSize: 14, color: colors.text }}>{user.business_name}</div>
                                    </div>
                                )}
                                {user?.tax_id && (
                                    <div>
                                        <div style={{ fontSize: 11, color: colors.textMuted }}>Vergi Numarası</div>
                                        <div style={{ fontSize: 14, color: colors.text }}>{user.tax_id}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Düzenleme Modu Butonları */}
                {isEditing && (
                    <div style={{
                        position: 'fixed',
                        bottom: 20,
                        left: 20,
                        right: 20,
                        display: 'flex',
                        gap: 12,
                        maxWidth: 400,
                        margin: '0 auto',
                        zIndex: 20
                    }}>
                        <button
                            onClick={() => setIsEditing(false)}
                            style={{
                                flex: 1,
                                background: colors.surface2,
                                border: `1px solid ${colors.border}`,
                                padding: '14px',
                                borderRadius: 40,
                                color: colors.text,
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSave}
                            style={{
                                flex: 1,
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                                border: 'none',
                                padding: '14px',
                                borderRadius: 40,
                                color: 'white',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: `0 4px 12px ${colors.primary}40`
                            }}
                        >
                            Kaydet
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;