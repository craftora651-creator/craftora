// components/onboarding/data/steps.ts
import { Step } from '../types/onboarding.types';

export const steps: Step[] = [
  {
    id: 1,
    title: "🎨 CRAFTORA'ya Hoş Geldin!",
    subtitle: "Hayallerini Gerçeğe Dönüştür",
    description: "Senin gibi binlerce kreatif girişimci, el emeği ürünlerini dünyaya satıyor. Şimdi sıra sende! İlk 3 ay **%0 komisyon** ile başla, kazancının tamamı cebinde kalsın. ✨",
    icon: "🖌️",
    theme: "warm",
    buttonText: "Hikayemi Başlat!",
    features: [
      "✓ 0₺ mağaza açılış ücreti",
      "✓ İlk 3 ay komisyonsuz satış",
      "✓ 50.000+ aktif alıcı"
    ]
  },
  {
    id: 2,
    title: "⚡ 5 Dakikada Mağazan Hazır!",
    subtitle: "Profesyonel Görün, Hemen Satışa Başla",
    description: "Kod bilmeden, tasarım derdi olmadan saniyeler içinde kişisel mağazanı oluştur. Sürükle-bırak ile ürünlerini ekle, vitrinini düzenle. **Hiç bu kadar kolay olmamıştı!** 🚀",
    icon: "🚀",
    theme: "modern",
    buttonText: "Hızlı Kurulum Yap",
    features: [
      "✓ Sürükle-bırak mağaza düzenleyici",
      "✓ 20+ profesyonel tema",
      "✓ Mobil uyumlu tasarım"
    ]
  },
  {
    id: 3,
    title: "💰 İlk Satışından Hemen Kazan!",
    subtitle: "Anında Ödeme, Düşük Komisyon",
    description: "Müşterin ödediği an, paran senin! Haftalık ödeme yerine **anında hesabında**. Sektörün en düşük komisyonuyla (%5) daha çok kazan. 🤑",
    icon: "💸",
    theme: "creative",
    buttonText: "Kazanmaya Başla",
    features: [
      "✓ Anında ödeme sistemi",
      "✓ Sadece %5 komisyon",
      "✓ Haftalık bonus fırsatları"
    ]
  },
  {
    id: 4,
    title: "🌟 VIP Satıcı Olma Şansı!",
    subtitle: "Ayrıcalıklar Seni Bekliyor",
    description: "İlk 100 satıcı arasına katıl, **VIP programına ücretsiz üye ol**. Öne çıkarılan ürünler, özel müşteri desteği ve daha fazlası! 🎯",
    icon: "👑",
    theme: "creative",
    buttonText: "VIP Ol, Fark Yarat!",
    features: [
      "✓ Öne çıkarılan ürünler",
      "✓ 7/24 özel destek hattı",
      "✓ Özel satıcı etkinlikleri"
    ]
  }
];