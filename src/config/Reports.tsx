import React, { useState } from 'react';
import html2pdf from 'html2pdf';
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

        // En çok satan ürünler sayfası
        const productsWS = XLSX.utils.json_to_sheet(topProducts);
        XLSX.utils.book_append_sheet(wb, productsWS, "En Cok Satanlar");

        // En çok kazandıran müşteriler sayfası
        const customersWS = XLSX.utils.json_to_sheet(topCustomers);
        XLSX.utils.book_append_sheet(wb, customersWS, "En Cok Kazandiranlar");

        // Mesajlar sayfası
        const messagesWS = XLSX.utils.json_to_sheet(messages);
        XLSX.utils.book_append_sheet(wb, messagesWS, "Mesajlar");

        XLSX.writeFile(wb, "craftora_rapor.xlsx");
    };

    return (
        <div id="report-content" style={{ minHeight: '100%' }}>
            {/* Header - Tarih Seçici ve İhracat */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24
            }}>
                <h1 style={{ fontSize: 28, fontWeight: 600, color: colors.text, margin: 0 }}>
                    Rapor Merkezi
                </h1>
                <div style={{ display: 'flex', gap: 12 }}>
                    {/* Tarih Seçici */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            style={{
                                padding: '8px 20px',
                                backgroundColor: colors.surface,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 30,
                                color: colors.text,
                                fontSize: 14,
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
                                minWidth: 160
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
                            padding: '8px 20px',
                            backgroundColor: '#ef4444',
                            border: 'none',
                            borderRadius: 30,
                            color: 'white',
                            fontSize: 14,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: 18 }}>picture_as_pdf</span>
                        PDF İndir
                    </button>
                    <button
                        onClick={downloadExcel}
                        style={{
                            padding: '8px 20px',
                            backgroundColor: '#10b981',
                            border: 'none',
                            borderRadius: 30,
                            color: 'white',
                            fontSize: 14,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: 18 }}>table_chart</span>
                        Excel İndir
                    </button>
                </div>
            </div>

            {/* 4'lü Kartlar */}
            {/* 4'lü Kartlar */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 20,
                marginBottom: 24
            }}>
                {/* Craftora Medya Durumu */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>🎬 Craftora Medya</h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                onClick={() => setCraftoraStatus('acik')}
                                style={{
                                    padding: '4px 12px',
                                    backgroundColor: craftoraStatus === 'acik' ? '#10b981' : 'transparent',
                                    border: `1px solid ${craftoraStatus === 'acik' ? '#10b981' : colors.border}`,
                                    borderRadius: 20,
                                    color: craftoraStatus === 'acik' ? 'white' : colors.textSecondary,
                                    fontSize: 12,
                                    cursor: 'pointer'
                                }}
                            >
                                🟢 AÇIK
                            </button>
                            <button
                                onClick={() => setCraftoraStatus('kapali')}
                                style={{
                                    padding: '4px 12px',
                                    backgroundColor: craftoraStatus === 'kapali' ? '#ef4444' : 'transparent',
                                    border: `1px solid ${craftoraStatus === 'kapali' ? '#ef4444' : colors.border}`,
                                    borderRadius: 20,
                                    color: craftoraStatus === 'kapali' ? 'white' : colors.textSecondary,
                                    fontSize: 12,
                                    cursor: 'pointer'
                                }}
                            >
                                🔴 KAPALI
                            </button>
                        </div>
                    </div>

                    {/* Craftora Medya İçeriği */}
                    {craftoraStatus === 'acik' ? (
                        <div style={{ flex: 1 }}>
                            {/* Canlı İstatistikler */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12,
                                marginBottom: 16
                            }}>
                                <div style={{
                                    backgroundColor: 'rgba(16,185,129,0.1)',
                                    borderRadius: 12,
                                    padding: '12px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Canlı İzlenme</div>
                                    <div style={{ fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>1.2K</div>
                                </div>
                                <div style={{
                                    backgroundColor: 'rgba(14,165,233,0.1)',
                                    borderRadius: 12,
                                    padding: '12px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Bugünkü Etkileşim</div>
                                    <div style={{ fontSize: 20, fontWeight: 'bold', color: '#0ea5e9' }}>3.4K</div>
                                </div>
                            </div>

                            {/* Reels Performansı */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: 13, color: colors.textSecondary }}>Reels İzlenme (Son 7 gün)</span>
                                    <span style={{ fontSize: 13, fontWeight: 'bold', color: colors.text }}>45.2K</span>
                                </div>
                                <div style={{ width: '100%', height: 6, backgroundColor: colors.bg, borderRadius: 3 }}>
                                    <div style={{ width: '78%', height: 6, backgroundColor: '#0ea5e9', borderRadius: 3 }} />
                                </div>
                            </div>

                            {/* Metrikler */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div>
                                    <div style={{ fontSize: 11, color: colors.textSecondary }}>Beğeni</div>
                                    <div style={{ fontSize: 15, fontWeight: 'bold', color: '#f43f5e' }}>12.4K</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, color: colors.textSecondary }}>Sepete Ekleme</div>
                                    <div style={{ fontSize: 15, fontWeight: 'bold', color: '#f59e0b' }}>3.2K</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, color: colors.textSecondary }}>Satın Alma</div>
                                    <div style={{ fontSize: 15, fontWeight: 'bold', color: '#10b981' }}>891</div>
                                </div>
                            </div>

                            {/* Dönüşüm Oranı */}
                            <div style={{
                                padding: '12px',
                                backgroundColor: colors.bg,
                                borderRadius: 12,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>Dönüşüm Oranı</span>
                                <span style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>2.1%</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1 }}>
                            {/* Kapalı Uyarısı */}
                            <div style={{
                                padding: '16px',
                                backgroundColor: 'rgba(244,67,54,0.1)',
                                borderRadius: 12,
                                color: '#ef4444',
                                fontSize: 13,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 16
                            }}>
                                <span className="material-icons-round" style={{ fontSize: 20 }}>warning</span>
                                <div>
                                    <strong>Craftora Medya kapalı!</strong><br />
                                    Açmak için yukarıdaki 🟢 AÇIK butonuna tıklayın.
                                </div>
                            </div>

                            {/* Kapalıyken Gösterilecek Bilgiler */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12,
                                opacity: 0.5,
                                marginBottom: 16
                            }}>
                                <div style={{
                                    backgroundColor: colors.bg,
                                    borderRadius: 12,
                                    padding: '12px'
                                }}>
                                    <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Son Açık Kalma</div>
                                    <div style={{ fontSize: 14, fontWeight: 'bold', color: colors.text }}>2 gün önce</div>
                                </div>
                                <div style={{
                                    backgroundColor: colors.bg,
                                    borderRadius: 12,
                                    padding: '12px'
                                }}>
                                    <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Toplam İzlenme</div>
                                    <div style={{ fontSize: 14, fontWeight: 'bold', color: colors.text }}>124.5K</div>
                                </div>
                            </div>

                            {/* Açma Butonu */}
                            <button
                                onClick={() => setCraftoraStatus('acik')}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#10b981',
                                    border: 'none',
                                    borderRadius: 12,
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    marginBottom: 16
                                }}
                            >
                                <span className="material-icons-round" style={{ fontSize: 18 }}>power_settings_new</span>
                                Craftora Medya'yı Aç
                            </button>
                        </div>
                    )}

                    {/* Detayları Gör Butonu - Her durumda gösterilir */}
                    <button
                        onClick={() => alert('Craftora Medya Detayları')}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: 'transparent',
                            border: `1px solid ${colors.border}`,
                            borderRadius: 12,
                            color: colors.text,
                            fontSize: 13,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            marginTop: 'auto'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: 16 }}>visibility</span>
                        Detayları Gör
                    </button>
                </div>

                {/* Canlı Aktivite */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>👥 Canlı Aktivite</h3>

                    {/* Ana Metrikler */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 8,
                        marginBottom: 20
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>{data.canliZiyaretci}</div>
                            <div style={{ fontSize: 11, color: colors.textSecondary }}>Şu Anda</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>{data.bugunGiren}</div>
                            <div style={{ fontSize: 11, color: colors.textSecondary }}>Bugün</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#0ea5e9' }}>{data.yeniZiyaretci}</div>
                            <div style={{ fontSize: 11, color: colors.textSecondary }}>Yeni</div>
                        </div>
                    </div>

                    {/* Anlık Hareketler */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12 }}>Anlık Hareketler</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                <span style={{ color: '#10b981' }}>⬆️</span>
                                <span style={{ color: colors.text }}>Ali sepete ekledi</span>
                                <span style={{ color: colors.textSecondary, marginLeft: 'auto' }}>2dk</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                <span style={{ color: '#0ea5e9' }}>👀</span>
                                <span style={{ color: colors.text }}>Ayşe inceliyor</span>
                                <span style={{ color: colors.textSecondary, marginLeft: 'auto' }}>3dk</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                <span style={{ color: '#f59e0b' }}>💬</span>
                                <span style={{ color: colors.text }}>Mehmet sordu</span>
                                <span style={{ color: colors.textSecondary, marginLeft: 'auto' }}>5dk</span>
                            </div>
                        </div>
                    </div>

                    {/* Ziyaretçi Grafiği (Mini) */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 40 }}>
                            {[45, 62, 38, 55, 72, 58, 63].map((height, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: height * 0.5,
                                        backgroundColor: i === 3 ? '#10b981' : colors.border,
                                        borderRadius: '2px 2px 0 0'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Detayları Gör Butonu */}
                    <button
                        onClick={() => alert('Canlı Aktivite Detayları')}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: 'transparent',
                            border: `1px solid ${colors.border}`,
                            borderRadius: 12,
                            color: colors.text,
                            fontSize: 13,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            marginTop: 'auto'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: 16 }}>visibility</span>
                        Detayları Gör
                    </button>
                </div>

                {/* Reels Performans */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>📱 Reels Performans</h3>

                    {craftoraStatus === 'acik' ? (
                        <>
                            {/* Ana Metrikler */}
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 }}>45.2K</div>
                                <div style={{ fontSize: 12, color: colors.textSecondary }}>Toplam İzlenme</div>
                            </div>

                            {/* Metrik Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 12,
                                marginBottom: 20
                            }}>
                                <div>
                                    <div style={{ fontSize: 11, color: colors.textSecondary }}>Beğeni</div>
                                    <div style={{ fontSize: 16, fontWeight: 'bold', color: '#f43f5e' }}>12.4K</div>
                                    <div style={{ fontSize: 10, color: colors.textSecondary }}>%27</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, color: colors.textSecondary }}>Sepete Ekleme</div>
                                    <div style={{ fontSize: 16, fontWeight: 'bold', color: '#f59e0b' }}>3.2K</div>
                                    <div style={{ fontSize: 10, color: colors.textSecondary }}>%7</div>
                                </div>
                            </div>

                            {/* Dönüşüm */}
                            <div style={{
                                padding: '12px',
                                backgroundColor: colors.bg,
                                borderRadius: 12,
                                marginBottom: 20
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 12, color: colors.textSecondary }}>Satın Alma</span>
                                    <span style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981' }}>891</span>
                                </div>
                                <div style={{ fontSize: 11, color: colors.textSecondary }}>Dönüşüm: %2</div>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.textSecondary,
                            fontSize: 13,
                            marginBottom: 20
                        }}>
                            Craftora Medya kapalıyken veri gösterilmiyor
                        </div>
                    )}

                    {/* Detayları Gör Butonu */}
                    <button
                        onClick={() => alert('Reels Performans Detayları')}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: 'transparent',
                            border: `1px solid ${colors.border}`,
                            borderRadius: 12,
                            color: colors.text,
                            fontSize: 13,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            marginTop: 'auto'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: 16 }}>visibility</span>
                        Detayları Gör
                    </button>
                </div>

                {/* Başarı Metrikleri */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>📊 Başarı Metrikleri</h3>

                    {/* Metrikler */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Sepet Dönüşüm</span>
                                <span style={{ fontSize: 13, fontWeight: 'bold', color: '#10b981' }}>3.2%</span>
                            </div>
                            <div style={{ width: '100%', height: 4, backgroundColor: colors.bg, borderRadius: 2 }}>
                                <div style={{ width: '32%', height: 4, backgroundColor: '#10b981', borderRadius: 2 }} />
                            </div>
                            <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 2 }}>↑0.5%</div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>İzlenme/Satın Alma</span>
                                <span style={{ fontSize: 13, fontWeight: 'bold', color: '#f43f5e' }}>2.1%</span>
                            </div>
                            <div style={{ width: '100%', height: 4, backgroundColor: colors.bg, borderRadius: 2 }}>
                                <div style={{ width: '21%', height: 4, backgroundColor: '#f43f5e', borderRadius: 2 }} />
                            </div>
                            <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 2 }}>↓0.3%</div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Tıklama Oranı (CTR)</span>
                                <span style={{ fontSize: 13, fontWeight: 'bold', color: '#0ea5e9' }}>4.8%</span>
                            </div>
                            <div style={{ width: '100%', height: 4, backgroundColor: colors.bg, borderRadius: 2 }}>
                                <div style={{ width: '48%', height: 4, backgroundColor: '#0ea5e9', borderRadius: 2 }} />
                            </div>
                            <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 2 }}>↑1.2%</div>
                        </div>
                    </div>

                    {/* Detayları Gör Butonu */}
                    <button
                        onClick={() => alert('Başarı Metrikleri Detayları')}
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: 'transparent',
                            border: `1px solid ${colors.border}`,
                            borderRadius: 12,
                            color: colors.text,
                            fontSize: 13,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            marginTop: 'auto'
                        }}
                    >
                        <span className="material-icons-round" style={{ fontSize: 16 }}>visibility</span>
                        Detayları Gör
                    </button>
                </div>
            </div>

            {/* Müşteri Mesajları ve Mail Kutusu */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
                marginBottom: 24
            }}>
                {/* Mesajlar */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>💬 Müşteri Mesajları</h3>
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
                            Tüm Mesajları Gör →
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {messages.slice(0, 3).map(msg => (
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{msg.name}</span>
                                        <span style={{ fontSize: 11, color: colors.textSecondary }}>{msg.time}</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>{msg.message}</p>
                                    <span style={{ fontSize: 10, color: colors.textSecondary }}>{msg.platform}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mailler */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>📧 Mail Kutusu</h3>
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
                            Tüm Mailleri Gör →
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {mails.slice(0, 3).map(mail => (
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 14, fontWeight: 500, color: colors.text }}>{mail.from}</span>
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

            {/* Grafikler ve Kategori Dağılımı */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: 20,
                marginBottom: 24
            }}>
                {/* Grafikler */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 20px 0' }}>📈 Performans Trendleri</h3>

                    {/* Gelir Grafiği */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>Gelir (Günlük)</span>
                                <span style={{ fontSize: 11, color: colors.textSecondary }}>son 14 gün</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 13, fontWeight: 'bold', color: '#0ea5e9' }}>$12,450</span>
                                <span style={{ fontSize: 11, color: '#10b981' }}>↑15.3%</span>
                            </div>
                        </div>
                        <div style={{ height: 70, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
                            {[45, 62, 38, 55, 72, 58, 63, 41, 67, 53, 49, 71, 58, 44].map((height, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: height,
                                        background: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 100%)',
                                        borderRadius: '6px 6px 0 0',
                                        opacity: 0.9,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sipariş Trendi */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>Sipariş (Günlük)</span>
                                <span style={{ fontSize: 11, color: colors.textSecondary }}>son 14 gün</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 13, fontWeight: 'bold', color: '#f59e0b' }}>1,482</span>
                                <span style={{ fontSize: 11, color: '#10b981' }}>↑8.2%</span>
                            </div>
                        </div>
                        <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
                            {[38, 42, 35, 48, 52, 45, 49, 41, 53, 47, 44, 51, 48, 46].map((height, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: height,
                                        background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%)',
                                        borderRadius: '6px 6px 0 0',
                                        opacity: 0.9,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Ziyaretçi Trendi - YENİ */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 13, color: colors.textSecondary }}>Ziyaretçi (Günlük)</span>
                                <span style={{ fontSize: 11, color: colors.textSecondary }}>son 14 gün</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 13, fontWeight: 'bold', color: '#a855f7' }}>3,245</span>
                                <span style={{ fontSize: 11, color: '#10b981' }}>↑12.3%</span>
                            </div>
                        </div>
                        <div style={{ height: 70, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
                            {[52, 48, 63, 58, 71, 65, 59, 62, 68, 55, 61, 57, 64, 70].map((height, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: height,
                                        background: 'linear-gradient(180deg, #a855f7 0%, #c084fc 100%)',
                                        borderRadius: '6px 6px 0 0',
                                        opacity: 0.9,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Kategori Dağılımı ve Ödeme Yöntemleri */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>🥧 Kategori Dağılımı</h3>

                    {/* Pie Chart */}
                    <div style={{
                        position: 'relative',
                        width: 180,  // 150'den 180'e çıktı
                        height: 180, // 150'den 180'e çıktı
                        margin: '0 auto 24px'
                    }}>
                        <svg viewBox="0 0 100 100" style={{
                            transform: 'rotate(-90deg)',
                            width: '100%',
                            height: '100%'
                        }}>
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="#0ea5e9"
                                strokeWidth="12"
                                strokeDasharray={`${45 * 2.51} 251`}
                                strokeDashoffset="0"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="#10b981"
                                strokeWidth="12"
                                strokeDasharray={`${30 * 2.51} 251`}
                                strokeDashoffset={`-${45 * 2.51}`}
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="#a855f7"
                                strokeWidth="12"
                                strokeDasharray={`${25 * 2.51} 251`}
                                strokeDashoffset={`-${(45 + 30) * 2.51}`}
                            />
                        </svg>

                        {/* Yuvarlağın İçindeki Sayı - BÜYÜTÜLDÜ */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            width: '100%',
                            padding: '0 5px'
                        }}>
                            <div style={{
                                fontSize: 36, // 28'den 36'ya çıktı
                                fontWeight: 'bold',
                                color: colors.text,
                                lineHeight: 1.2,
                                marginBottom: 8 // 0'dan 8'e çıktı
                            }}>
                                1,482
                            </div>
                            <div style={{
                                fontSize: 12, // 10'dan 12'ye çıktı
                                color: colors.textSecondary,
                                letterSpacing: 1, // 0.5'ten 1'e çıktı
                                fontWeight: 500
                            }}>
                                TOPLAM ÜRÜN
                            </div>
                        </div>
                    </div>

                    {/* Kategori Listesi */}
                    <div style={{ marginBottom: 24 }}>
                        {categoryDistribution.map(cat => (
                            <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 10, height: 10, backgroundColor: cat.color, borderRadius: 3 }} />
                                    <span style={{ fontSize: 13, color: colors.textSecondary }}>{cat.name}</span>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 'bold', color: colors.text }}>{cat.percentage}%</span>
                            </div>
                        ))}
                    </div>

                    {/* Ödeme Yöntemleri */}
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>💳 Ödeme Yöntemleri</h3>
                    {paymentMethods.map(method => (
                        <div key={method.name} style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>{method.name}</span>
                                <span style={{ fontSize: 12, fontWeight: 'bold', color: colors.text }}>{method.percentage}%</span>
                            </div>
                            <div style={{ width: '100%', height: 4, backgroundColor: colors.bg, borderRadius: 2 }}>
                                <div style={{ width: `${method.percentage}%`, height: 4, backgroundColor: method.color, borderRadius: 2 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* En Çok Satanlar ve Kazandıran Müşteriler */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
                marginBottom: 24
            }}>
                {/* En Çok Satan Ürünler */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>🏆 En Çok Satan Ürünler</h3>
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
                </div>

                {/* En Çok Kazandıran Müşteriler */}
                <div style={{
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 24,
                    border: `1px solid ${colors.border}`
                }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: '0 0 16px 0' }}>👑 En Çok Kazandıran Müşteriler</h3>
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
                </div>
            </div>

            {/* Özet ve İhracat */}
            <div style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 24,
                border: `1px solid ${colors.border}`
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.text, margin: 0 }}>📋 Günlük/Haftalık/Aylık Özet</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={downloadPDF}
                            style={{
                                padding: '8px 20px',
                                backgroundColor: '#ef4444',
                                border: 'none',
                                borderRadius: 30,
                                color: 'white',
                                fontSize: 13,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            <span className="material-icons-round" style={{ fontSize: 18 }}>picture_as_pdf</span>
                            PDF İndir
                        </button>
                        <button
                            onClick={downloadExcel}
                            style={{
                                padding: '8px 20px',
                                backgroundColor: '#10b981',
                                border: 'none',
                                borderRadius: 30,
                                color: 'white',
                                fontSize: 13,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            <span className="material-icons-round" style={{ fontSize: 18 }}>table_chart</span>
                            Excel İndir
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    <div>
                        <h4 style={{ fontSize: 14, fontWeight: 500, color: colors.text, margin: '0 0 12px 0' }}>Günlük Özet</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Ziyaretçi:</span>
                                <span style={{ fontSize: 12, color: colors.text }}>1,245</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Sipariş:</span>
                                <span style={{ fontSize: 12, color: colors.text }}>45</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Gelir:</span>
                                <span style={{ fontSize: 12, fontWeight: 'bold', color: '#10b981' }}>$12,450</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: 14, fontWeight: 500, color: colors.text, margin: '0 0 12px 0' }}>Haftalık Özet</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Ziyaretçi:</span>
                                <span style={{ fontSize: 12, color: colors.text }}>8,942</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Sipariş:</span>
                                <span style={{ fontSize: 12, color: colors.text }}>312</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Gelir:</span>
                                <span style={{ fontSize: 12, fontWeight: 'bold', color: '#10b981' }}>$89,450</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: 14, fontWeight: 500, color: colors.text, margin: '0 0 12px 0' }}>Aylık Özet</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Ziyaretçi:</span>
                                <span style={{ fontSize: 12, color: colors.text }}>32,450</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Sipariş:</span>
                                <span style={{ fontSize: 12, color: colors.text }}>1,482</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, color: colors.textSecondary }}>Gelir:</span>
                                <span style={{ fontSize: 12, fontWeight: 'bold', color: '#10b981' }}>$348,900</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;