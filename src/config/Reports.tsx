import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';
import * as XLSX from 'xlsx';

interface ReportsPageProps {
    colors: {
        bg: string;
        surface: string;
        border: string;
        text: string;
        textSecondary: string;
    };
}

const ReportsPage = ({ colors }: ReportsPageProps) => {
    const [craftoraStatus, setCraftoraStatus] = useState<'acik' | 'kapali'>('acik');
    const [selectedDate, setSelectedDate] = useState('today');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showMailModal, setShowMailModal] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth <= 768;
    const isTablet = windowWidth > 768 && windowWidth <= 1024;

    // Craftora Medya verileri
    const craftoraData = {
        acik: {
            reelsIzlenme: 45200,
            reelsBegeni: 12400,
            reelsSepet: 3200,
            reelsSatis: 891,
            canliZiyaretci: 24,
            bugunGiren: 342,
            yeniZiyaretci: 128
        },
        kapali: {
            reelsIzlenme: 0,
            reelsBegeni: 0,
            reelsSepet: 0,
            reelsSatis: 0,
            canliZiyaretci: 12,
            bugunGiren: 156,
            yeniZiyaretci: 45
        }
    };

    const data = craftoraData[craftoraStatus];

    // Mesajlar
    const messages = [
        { id: 1, name: 'Jenny Wilson', message: 'Ürün ne zaman gelecek?', time: '2 dk önce', avatar: 'JW', platform: 'instagram' },
        { id: 2, name: 'Robert Fox', message: 'İndirim kodu var mı?', time: '15 dk önce', avatar: 'RF', platform: 'whatsapp' },
        { id: 3, name: 'Jacob Jones', message: 'Sipariş takibi yapabilir miyim?', time: '1 saat önce', avatar: 'JJ', platform: 'facebook' },
        { id: 4, name: 'Courtney Henry', message: 'Fatura gönderebilir misiniz?', time: '3 saat önce', avatar: 'CH', platform: 'instagram' }
    ];

    // Mailler
    const mails = [
        { id: 1, from: 'robert@example.com', subject: 'Sipariş takibi', preview: 'Siparişimin durumu hakkında bilgi alabilir miyim?', time: '5 dk önce' },
        { id: 2, from: 'jacob@example.com', subject: 'Fatura talebi', preview: 'Faturamı gönderebilir misiniz?', time: '1 saat önce' },
        { id: 3, from: 'jenny@example.com', subject: 'İade işlemi', preview: 'Ürünü iade etmek istiyorum.', time: '3 saat önce' },
        { id: 4, from: 'courtney@example.com', subject: 'Toplu sipariş', preview: 'Kurumsal sipariş vermek istiyoruz.', time: '5 saat önce' }
    ];

    // En çok satan ürünler
    const topProducts = [
        { name: 'Nike Air Max 270', category: 'Giyim', sales: 245, revenue: 31850 },
        { name: 'Ultimate UI Kit', category: 'Dijital', sales: 189, revenue: 9261 },
        { name: 'Quantum Processor V4', category: 'Elektronik', sales: 56, revenue: 699944 },
        { name: 'SEO Mastery E-book', category: 'Dijital', sales: 142, revenue: 5538 },
        { name: 'Lightroom Presets', category: 'Dijital', sales: 328, revenue: 8200 }
    ];

    // En çok kazandıran müşteriler
    const topCustomers = [
        { name: 'Courtney Henry', email: 'courtney@example.com', spent: 86700, orders: 67, type: 'VIP' },
        { name: 'Ronald Richards', email: 'ronald@example.com', spent: 45000, orders: 124, type: 'VIP' },
        { name: 'Jenny Wilson', email: 'jenny@example.com', spent: 12500, orders: 24, type: 'Premium' },
        { name: 'Robert Fox', email: 'robert@example.com', spent: 8700, orders: 15, type: 'Standart' },
        { name: 'Jacob Jones', email: 'jacob@example.com', spent: 2300, orders: 5, type: 'Standart' }
    ];

    // Kategori dağılımı
    const categoryDistribution = [
        { name: 'Elektronik', percentage: 45, color: '#0ea5e9', revenue: 1250000 },
        { name: 'Giyim', percentage: 30, color: '#10b981', revenue: 850000 },
        { name: 'Dijital', percentage: 25, color: '#a855f7', revenue: 450000 }
    ];

    // Ödeme yöntemleri
    const paymentMethods = [
        { name: 'Kredi Kartı', percentage: 65, color: '#0ea5e9' },
        { name: 'PayPal', percentage: 20, color: '#a855f7' },
        { name: 'Havale', percentage: 15, color: '#f59e0b' }
    ];

    // PDF İndir
    const downloadPDF = () => {
        const element = document.getElementById('report-content');
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'craftora_rapor.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    // Excel İndir
    const downloadExcel = () => {
        const wb = XLSX.utils.book_new();
        const productsWS = XLSX.utils.json_to_sheet(topProducts);
        XLSX.utils.book_append_sheet(wb, productsWS, "En Cok Satanlar");
        const customersWS = XLSX.utils.json_to_sheet(topCustomers);
        XLSX.utils.book_append_sheet(wb, customersWS, "En Cok Kazandiranlar");
        const messagesWS = XLSX.utils.json_to_sheet(messages);
        XLSX.utils.book_append_sheet(wb, messagesWS, "Mesajlar");
        XLSX.writeFile(wb, "craftora_rapor.xlsx");
    };

    // Mobil kart bileşeni
    const MetricCard = ({ title, value, subtitle, color, icon }: any) => (
        <div style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: isMobile ? 16 : 20,
            border: `1px solid ${colors.border}`,
            flex: 1
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                </div>
                <div>
                    <div style={{ fontSize: 11, color: colors.textSecondary }}>{title}</div>
                    <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: colors.text }}>{value}</div>
                </div>
            </div>
            {subtitle && <div style={{ fontSize: 11, color: colors.textSecondary }}>{subtitle}</div>}
        </div>
    );

    return (
        <div id="report-content" style={{ minHeight: '100%', paddingBottom: 24 }}>
            {/* Scrollbar styles */}
            <style>{`
                ::-webkit-scrollbar { width: 8px; height: 8px; }
                ::-webkit-scrollbar-track { background: ${colors.bg}; border-radius: 10px; }
                ::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 10px; border: 2px solid ${colors.bg}; }
                ::-webkit-scrollbar-thumb:hover { background: #0284c7; }
                * { scrollbar-width: thin; scrollbar-color: #0ea5e9 ${colors.bg}; }
            `}</style>

            {/* Header - Tarih Seçici ve İhracat */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'center',
                marginBottom: 24,
                gap: isMobile ? 16 : 0
            }}>
                <h1 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 600, color: colors.text, margin: 0 }}>
                    Rapor Merkezi
                </h1>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {/* Tarih Seçici */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            style={{
                                padding: isMobile ? '8px 16px' : '8px 20px',
                                backgroundColor: colors.surface,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 30,
                                color: colors.text,
                                fontSize: 13,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            <span className="material-icons-round" style={{ fontSize: 18 }}>calendar_today</span>
                            {selectedDate === 'today' && 'Bugün'}
                            {selectedDate === 'week' && 'Bu Hafta'}
                            {selectedDate === 'month' && 'Bu Ay'}
                            {selectedDate === 'year' && 'Bu Yıl'}
                        </button>

                        {showDatePicker && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: 8,
                                backgroundColor: colors.surface,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 12,
                                padding: '8px',
                                zIndex: 10,
                                minWidth: 140
                            }}>
                                {[
                                    { value: 'today', label: 'Bugün' },
                                    { value: 'week', label: 'Bu Hafta' },
                                    { value: 'month', label: 'Bu Ay' },
                                    { value: 'year', label: 'Bu Yıl' }
                                ].map(option => (
                                    <div
                                        key={option.value}
                                        onClick={() => {
                                            setSelectedDate(option.value);
                                            setShowDatePicker(false);
                                        }}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            backgroundColor: selectedDate === option.value ? colors.bg : 'transparent',
                                            color: selectedDate === option.value ? colors.text : colors.textSecondary
                                        }}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* İhracat Butonları */}
                    <button
                        onClick={downloadPDF}
                        style={{
                            padding: isMobile ? '8px 16px' : '8px 20px',
                            backgroundColor: '#ef4444',
                            border: 'none',
                            borderRadius: 30,
                            color: 'white',
                            fontSize: 13,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: 18 }}>picture_as_pdf</span>
                        {!isMobile && 'PDF İndir'}
                    </button>
                    <button
                        onClick={downloadExcel}
                        style={{
                            padding: isMobile ? '8px 16px' : '8px 20px',
                            backgroundColor: '#10b981',
                            border: 'none',
                            borderRadius: 30,
                            color: 'white',
                            fontSize: 13,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: 18 }}>table_chart</span>
                        {!isMobile && 'Excel İndir'}
                    </button>
                </div>
            </div>

            {/* Craftora Medya Kartı - Full genişlik */}
            {/* Craftora Medya Kartı - YENİ TASARIM */}
<div style={{
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 0,
    border: `1px solid ${colors.border}`,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative'
}}>
    {/* Gradient Header */}
    <div style={{
        background: craftoraStatus === 'acik' 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        padding: isMobile ? '16px 20px' : '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
                width: 48,
                height: 48,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24
            }}>
                🎬
            </div>
            <div>
                <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: 'white', margin: 0 }}>
                    Craftora Medya
                </h3>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                    {craftoraStatus === 'acik' ? 'Yayında - Aktif' : 'Yayın durduruldu'}
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
            <button
                onClick={() => setCraftoraStatus('acik')}
                style={{
                    padding: '8px 20px',
                    backgroundColor: craftoraStatus === 'acik' ? 'white' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: 30,
                    color: craftoraStatus === 'acik' ? '#059669' : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease'
                }}
            >
                <span>🟢</span> AÇIK
            </button>
            <button
                onClick={() => setCraftoraStatus('kapali')}
                style={{
                    padding: '8px 20px',
                    backgroundColor: craftoraStatus === 'kapali' ? 'white' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: 30,
                    color: craftoraStatus === 'kapali' ? '#dc2626' : 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease'
                }}
            >
                <span>🔴</span> KAPALI
            </button>
        </div>
    </div>

    {craftoraStatus === 'acik' ? (
        <>
            {/* Ana Metrikler - Büyük ve Dikkat Çekici */}
            <div style={{
                padding: isMobile ? 20 : 24,
                background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.bg} 100%)`
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: isMobile ? 12 : 20,
                    marginBottom: 24
                }}>
                    {/* Reels İzlenme */}
                    <div style={{
                        background: colors.surface,
                        borderRadius: 20,
                        padding: isMobile ? 16 : 20,
                        textAlign: 'center',
                        border: `1px solid ${colors.border}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer'
                    }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#0ea5e9', marginBottom: 4 }}>
                            {(data.reelsIzlenme / 1000).toFixed(1)}K
                        </div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Reels İzlenme</div>
                        <div style={{ fontSize: 11, color: '#10b981', marginTop: 6 }}>↑ %12</div>
                    </div>

                    {/* Beğeni */}
                    <div style={{
                        background: colors.surface,
                        borderRadius: 20,
                        padding: isMobile ? 16 : 20,
                        textAlign: 'center',
                        border: `1px solid ${colors.border}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>❤️</div>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f43f5e', marginBottom: 4 }}>
                            {(data.reelsBegeni / 1000).toFixed(1)}K
                        </div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Beğeni</div>
                        <div style={{ fontSize: 11, color: '#10b981', marginTop: 6 }}>↑ %8</div>
                    </div>

                    {/* Sepete Ekleme */}
                    <div style={{
                        background: colors.surface,
                        borderRadius: 20,
                        padding: isMobile ? 16 : 20,
                        textAlign: 'center',
                        border: `1px solid ${colors.border}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🛒</div>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f59e0b', marginBottom: 4 }}>
                            {(data.reelsSepet / 1000).toFixed(1)}K
                        </div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Sepete Ekleme</div>
                        <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 6 }}>↑ %5</div>
                    </div>

                    {/* Satın Alma */}
                    <div style={{
                        background: colors.surface,
                        borderRadius: 20,
                        padding: isMobile ? 16 : 20,
                        textAlign: 'center',
                        border: `1px solid ${colors.border}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981', marginBottom: 4 }}>
                            {data.reelsSatis}
                        </div>
                        <div style={{ fontSize: 12, color: colors.textSecondary }}>Satın Alma</div>
                        <div style={{ fontSize: 11, color: '#10b981', marginTop: 6 }}>Dönüşüm %2.1</div>
                    </div>
                </div>

                {/* İkincil Metrikler */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: 16
                }}>
                    {/* Canlı Ziyaretçi */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: isMobile ? 16 : 20,
                        background: colors.surface,
                        borderRadius: 16,
                        border: `1px solid ${colors.border}`
                    }}>
                        <div>
                            <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Canlı Ziyaretçi</div>
                            <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#10b981' }}>
                                {data.canliZiyaretci}
                            </div>
                            <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>Aktif şu an</div>
                        </div>
                        <div style={{ fontSize: 40, opacity: 0.8 }}>👥</div>
                    </div>

                    {/* Bugün Giren */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: isMobile ? 16 : 20,
                        background: colors.surface,
                        borderRadius: 16,
                        border: `1px solid ${colors.border}`
                    }}>
                        <div>
                            <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Bugün Giren</div>
                            <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#0ea5e9' }}>
                                {data.bugunGiren}
                            </div>
                            <div style={{ fontSize: 11, color: '#0ea5e9', marginTop: 4 }}>Toplam ziyaret</div>
                        </div>
                        <div style={{ fontSize: 40, opacity: 0.8 }}>📊</div>
                    </div>

                    {/* Yeni Ziyaretçi */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: isMobile ? 16 : 20,
                        background: colors.surface,
                        borderRadius: 16,
                        border: `1px solid ${colors.border}`
                    }}>
                        <div>
                            <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Yeni Ziyaretçi</div>
                            <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 'bold', color: '#a855f7' }}>
                                {data.yeniZiyaretci}
                            </div>
                            <div style={{ fontSize: 11, color: '#a855f7', marginTop: 4 }}>İlk kez gelen</div>
                        </div>
                        <div style={{ fontSize: 40, opacity: 0.8 }}>✨</div>
                    </div>
                </div>

                {/* Progress Bar - Dönüşüm */}
                <div style={{
                    marginTop: 24,
                    padding: isMobile ? 16 : 20,
                    background: colors.surface,
                    borderRadius: 16,
                    border: `1px solid ${colors.border}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: colors.textSecondary }}>Dönüşüm Oranı</span>
                        <span style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981' }}>2.1%</span>
                    </div>
                    <div style={{ width: '100%', height: 8, backgroundColor: colors.bg, borderRadius: 4 }}>
                        <div style={{ width: '21%', height: 8, background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 4 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <span style={{ fontSize: 11, color: colors.textSecondary }}>Sepet → Satın Alma</span>
                        <span style={{ fontSize: 11, color: colors.textSecondary }}>Hedef: %5</span>
                    </div>
                </div>
            </div>
        </>
    ) : (
        /* KAPALI DURUM - DAHA ŞIK TASARIM */
        <div style={{
            padding: isMobile ? 32 : 48,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.surface} 100%)`
        }}>
            <div style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                background: 'rgba(239,68,68,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
            }}>
                <span style={{ fontSize: 48 }}>🔴</span>
            </div>
            <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: colors.text, marginBottom: 8 }}>
                Craftora Medya Kapalı
            </div>
            <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 24, maxWidth: 300, margin: '0 auto 24px' }}>
                Şu anda yayın yapılmıyor. Yayını başlatmak için AÇIK butonuna tıklayın.
            </div>
            <button
                onClick={() => setCraftoraStatus('acik')}
                style={{
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: 40,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <span>🟢</span>
                Craftora Medya'yı Başlat
            </button>
        </div>
    )}
</div>

            {/* Aktivite ve Performans Gridi */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
                gap: 20,
                marginBottom: 24
            }}>
                {/* Canlı Aktivite */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: isMobile ? 20 : 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, marginBottom: 20 }}>👥 Canlı Aktivite</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 12,
                        marginBottom: 20
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981' }}>{data.canliZiyaretci}</div>
                            <div style={{ fontSize: 11, color: colors.textSecondary }}>Şu Anda</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>{data.bugunGiren}</div>
                            <div style={{ fontSize: 11, color: colors.textSecondary }}>Bugün</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#0ea5e9' }}>{data.yeniZiyaretci}</div>
                            <div style={{ fontSize: 11, color: colors.textSecondary }}>Yeni</div>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12 }}>Anlık Hareketler</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                                <span>⬆️</span>
                                <span style={{ color: colors.text }}>Ali sepete ekledi</span>
                                <span style={{ color: colors.textSecondary, marginLeft: 'auto', fontSize: 11 }}>2dk</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                                <span>👀</span>
                                <span style={{ color: colors.text }}>Ayşe inceliyor</span>
                                <span style={{ color: colors.textSecondary, marginLeft: 'auto', fontSize: 11 }}>3dk</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                                <span>💬</span>
                                <span style={{ color: colors.text }}>Mehmet sordu</span>
                                <span style={{ color: colors.textSecondary, marginLeft: 'auto', fontSize: 11 }}>5dk</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Başarı Metrikleri */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: isMobile ? 20 : 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, marginBottom: 20 }}>📊 Başarı Metrikleri</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>Sepet Dönüşüm</span>
                                <span style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981' }}>3.2%</span>
                            </div>
                            <div style={{ width: '100%', height: 6, backgroundColor: colors.bg, borderRadius: 3 }}>
                                <div style={{ width: '32%', height: 6, backgroundColor: '#10b981', borderRadius: 3 }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>İzlenme/Satın Alma</span>
                                <span style={{ fontSize: 14, fontWeight: 'bold', color: '#f43f5e' }}>2.1%</span>
                            </div>
                            <div style={{ width: '100%', height: 6, backgroundColor: colors.bg, borderRadius: 3 }}>
                                <div style={{ width: '21%', height: 6, backgroundColor: '#f43f5e', borderRadius: 3 }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>Tıklama Oranı (CTR)</span>
                                <span style={{ fontSize: 14, fontWeight: 'bold', color: '#0ea5e9' }}>4.8%</span>
                            </div>
                            <div style={{ width: '100%', height: 6, backgroundColor: colors.bg, borderRadius: 3 }}>
                                <div style={{ width: '48%', height: 6, backgroundColor: '#0ea5e9', borderRadius: 3 }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performans Trendleri */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: isMobile ? 20 : 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, marginBottom: 20 }}>📈 Son 7 Gün</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Gelir</span>
                                <span style={{ fontSize: 14, fontWeight: 'bold', color: '#0ea5e9' }}>$12,450</span>
                            </div>
                            <div style={{ height: 40, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                                {[45, 62, 38, 55, 72, 58, 63].map((height, i) => (
                                    <div key={i} style={{ flex: 1, height: height * 0.6, backgroundColor: '#0ea5e9', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Sipariş</span>
                                <span style={{ fontSize: 14, fontWeight: 'bold', color: '#f59e0b' }}>1,482</span>
                            </div>
                            <div style={{ height: 40, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                                {[38, 42, 35, 48, 52, 45, 49].map((height, i) => (
                                    <div key={i} style={{ flex: 1, height: height * 0.6, backgroundColor: '#f59e0b', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Müşteri Mesajları ve Mail Kutusu */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 20,
                marginBottom: 24
            }}>
                {/* Mesajlar */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: isMobile ? 20 : 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, margin: 0 }}>💬 Müşteri Mesajları</h3>
                        <button
                            onClick={() => setShowMessageModal(true)}
                            style={{
                                background: 'none',
                                border: `1px solid ${colors.border}`,
                                borderRadius: 20,
                                padding: '6px 12px',
                                fontSize: 12,
                                color: colors.text,
                                cursor: 'pointer'
                            }}
                        >
                            Tümü →
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {messages.slice(0, isMobile ? 2 : 3).map(msg => (
                            <div key={msg.id} style={{ display: 'flex', gap: 12 }}>
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: '#0ea5e9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: 'bold'
                                }}>
                                    {msg.avatar}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                                        <span style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{msg.name}</span>
                                        <span style={{ fontSize: 11, color: colors.textSecondary }}>{msg.time}</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>{msg.message}</p>
                                    <span style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4, display: 'block' }}>{msg.platform}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mailler */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: isMobile ? 20 : 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, margin: 0 }}>📧 Mail Kutusu</h3>
                        <button
                            onClick={() => setShowMailModal(true)}
                            style={{
                                background: 'none',
                                border: `1px solid ${colors.border}`,
                                borderRadius: 20,
                                padding: '6px 12px',
                                fontSize: 12,
                                color: colors.text,
                                cursor: 'pointer'
                            }}
                        >
                            Tümü →
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {mails.slice(0, isMobile ? 2 : 3).map(mail => (
                            <div key={mail.id} style={{ display: 'flex', gap: 12 }}>
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: '#a855f7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: 20
                                }}>
                                    📧
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                                        <span style={{ fontSize: 13, fontWeight: 500, color: colors.text }}>{mail.from}</span>
                                        <span style={{ fontSize: 11, color: colors.textSecondary }}>{mail.time}</span>
                                    </div>
                                    <p style={{ fontSize: 13, fontWeight: 500, color: colors.text, margin: '0 0 4px 0' }}>{mail.subject}</p>
                                    <p style={{ fontSize: 12, color: colors.textSecondary, margin: 0 }}>{mail.preview}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Kategori ve Ödeme */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 20,
                marginBottom: 24
            }}>
                {/* Kategori Dağılımı */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: isMobile ? 20 : 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, marginBottom: 20 }}>🥧 Kategori Dağılımı</h3>
                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'center',
                        gap: 24
                    }}>
                        <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
                            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0ea5e9" strokeWidth="12" strokeDasharray={`${45 * 2.51} 251`} />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray={`${30 * 2.51} 251`} strokeDashoffset={`-${45 * 2.51}`} />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="12" strokeDasharray={`${25 * 2.51} 251`} strokeDashoffset={`-${(45 + 30) * 2.51}`} />
                            </svg>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text }}>1.5K</div>
                                <div style={{ fontSize: 10, color: colors.textSecondary }}>ÜRÜN</div>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            {categoryDistribution.map(cat => (
                                <div key={cat.name} style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 10, height: 10, backgroundColor: cat.color, borderRadius: 3 }} />
                                            <span style={{ fontSize: 13, color: colors.textSecondary }}>{cat.name}</span>
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 'bold', color: colors.text }}>{cat.percentage}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: 4, backgroundColor: colors.bg, borderRadius: 2 }}>
                                        <div style={{ width: `${cat.percentage}%`, height: 4, backgroundColor: cat.color, borderRadius: 2 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ödeme Yöntemleri */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: isMobile ? 20 : 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, marginBottom: 20 }}>💳 Ödeme Yöntemleri</h3>
                    {paymentMethods.map(method => (
                        <div key={method.name} style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>{method.name}</span>
                                <span style={{ fontSize: 13, fontWeight: 'bold', color: colors.text }}>{method.percentage}%</span>
                            </div>
                            <div style={{ width: '100%', height: 6, backgroundColor: colors.bg, borderRadius: 3 }}>
                                <div style={{ width: `${method.percentage}%`, height: 6, backgroundColor: method.color, borderRadius: 3 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* En Çok Satanlar ve Kazandıran Müşteriler - Tablolar mobil için kartlara dönüştü */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 20,
                marginBottom: 24
            }}>
                {/* En Çok Satan Ürünler */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: isMobile ? 20 : 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, marginBottom: 16 }}>🏆 En Çok Satan Ürünler</h3>
                    {isMobile ? (
                        topProducts.map(product => (
                            <div key={product.name} style={{
                                padding: '12px 0',
                                borderBottom: `1px solid ${colors.border}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{product.name}</div>
                                    <div style={{ fontSize: 11, color: colors.textSecondary }}>{product.category}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981' }}>${product.revenue.toLocaleString()}</div>
                                    <div style={{ fontSize: 11, color: colors.textSecondary }}>{product.sales} satış</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ fontSize: 11, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                                    <th style={{ padding: '8px 0', textAlign: 'left' }}>Ürün</th>
                                    <th style={{ padding: '8px 0', textAlign: 'left' }}>Kategori</th>
                                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Satış</th>
                                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Gelir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map(product => (
                                    <tr key={product.name} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                        <td style={{ padding: '12px 0', fontSize: 13, color: colors.text }}>{product.name}</td>
                                        <td style={{ padding: '12px 0', fontSize: 12, color: colors.textSecondary }}>{product.category}</td>
                                        <td style={{ padding: '12px 0', fontSize: 13, color: colors.text, textAlign: 'right' }}>{product.sales}</td>
                                        <td style={{ padding: '12px 0', fontSize: 13, fontWeight: 'bold', color: '#10b981', textAlign: 'right' }}>${product.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* En Çok Kazandıran Müşteriler */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: isMobile ? 20 : 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, marginBottom: 16 }}>👑 En Çok Kazandıran Müşteriler</h3>
                    {isMobile ? (
                        topCustomers.map(customer => (
                            <div key={customer.email} style={{
                                padding: '12px 0',
                                borderBottom: `1px solid ${colors.border}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{customer.name}</div>
                                        <div style={{ fontSize: 11, color: colors.textSecondary }}>{customer.email}</div>
                                    </div>
                                    <span style={{
                                        padding: '2px 8px',
                                        backgroundColor: customer.type === 'VIP' ? 'rgba(168,85,247,0.1)' : 'rgba(14,165,233,0.1)',
                                        color: customer.type === 'VIP' ? '#a855f7' : '#0ea5e9',
                                        fontSize: 10,
                                        borderRadius: 20
                                    }}>
                                        {customer.type}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                    <span style={{ fontSize: 12, color: colors.textSecondary }}>{customer.orders} sipariş</span>
                                    <span style={{ fontSize: 14, fontWeight: 'bold', color: '#a855f7' }}>${customer.spent.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ fontSize: 11, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>
                                    <th style={{ padding: '8px 0', textAlign: 'left' }}>Müşteri</th>
                                    <th style={{ padding: '8px 0', textAlign: 'left' }}>Tip</th>
                                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Sipariş</th>
                                    <th style={{ padding: '8px 0', textAlign: 'right' }}>Harcama</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCustomers.map(customer => (
                                    <tr key={customer.email} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                        <td style={{ padding: '12px 0' }}>
                                            <div style={{ fontSize: 13, color: colors.text }}>{customer.name}</div>
                                            <div style={{ fontSize: 11, color: colors.textSecondary }}>{customer.email}</div>
                                        </td>
                                        <td style={{ padding: '12px 0' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                backgroundColor: customer.type === 'VIP' ? 'rgba(168,85,247,0.1)' : 'rgba(14,165,233,0.1)',
                                                color: customer.type === 'VIP' ? '#a855f7' : '#0ea5e9',
                                                fontSize: 11,
                                                borderRadius: 20
                                            }}>
                                                {customer.type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 0', fontSize: 13, color: colors.text, textAlign: 'right' }}>{customer.orders}</td>
                                        <td style={{ padding: '12px 0', fontSize: 13, fontWeight: 'bold', color: '#a855f7', textAlign: 'right' }}>${customer.spent.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Özet */}
            <div style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: isMobile ? 20 : 24,
                border: `1px solid ${colors.border}`
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: colors.text, margin: 0 }}>📋 Dönem Özeti</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={downloadPDF} style={{ padding: '8px 16px', backgroundColor: '#ef4444', border: 'none', borderRadius: 30, color: 'white', fontSize: 12, cursor: 'pointer' }}>PDF</button>
                        <button onClick={downloadExcel} style={{ padding: '8px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: 30, color: 'white', fontSize: 12, cursor: 'pointer' }}>Excel</button>
                    </div>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: isMobile ? 16 : 20
                }}>
                    <div style={{ backgroundColor: colors.bg, borderRadius: 16, padding: 16 }}>
                        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Günlük</div>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>$12,450</div>
                        <div style={{ fontSize: 11, color: colors.textSecondary }}>45 sipariş</div>
                    </div>
                    <div style={{ backgroundColor: colors.bg, borderRadius: 16, padding: 16 }}>
                        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Haftalık</div>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>$89,450</div>
                        <div style={{ fontSize: 11, color: colors.textSecondary }}>312 sipariş</div>
                    </div>
                    <div style={{ backgroundColor: colors.bg, borderRadius: 16, padding: 16 }}>
                        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Aylık</div>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>$348,900</div>
                        <div style={{ fontSize: 11, color: colors.textSecondary }}>1,482 sipariş</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;