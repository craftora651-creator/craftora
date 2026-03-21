import { Groq } from 'groq-sdk';

// Vite'da environment variable'lar import.meta.env.VITE_ ile başlar
const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  console.error('❌ VITE_GROQ_API_KEY bulunamadı! .env dosyasını kontrol edin.');
  console.error('📌 .env dosyasına şunu ekleyin: VITE_GROQ_API_KEY=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');
}

const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Browser'da çalışması için gerekli
});

// Test fonksiyonu
export async function testGroqModels() {
  console.log('🔍 Groq API Testi Başlıyor...\n');

  try {
    // 1. Mevcut modelleri listele
    console.log('📋 Mevcut Modeller:');
    const models = await groq.models.list();
    models.data.forEach(model => {
      console.log(`  - ${model.id}`);
    });
    console.log('');

    // 2. Popüler modelleri test et
  const testModels = [
  'llama-3.3-70b-versatile',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'gemma2-9b-it',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant'
];

    console.log('🧪 Modeller Test Ediliyor...\n');

    for (const modelId of testModels) {
      try {
        console.log(`🔄 ${modelId} test ediliyor...`);
        
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'Sen bir yardımsever asistansın.'
            },
            {
              role: 'user',
              content: 'Merhaba, nasılsın? Kısa bir cevap ver.'
            }
          ],
          model: modelId,
          temperature: 0.7,
          max_tokens: 50
        });

        console.log(`✅ ${modelId} başarılı!`);
        console.log(`   Cevap: ${completion.choices[0]?.message?.content?.substring(0, 50)}...\n`);
        
      } catch (error: any) {
        if (error.status === 404) {
          console.log(`❌ ${modelId} bulunamadı (404)\n`);
        } else {
          console.log(`❌ ${modelId} hata: ${error.message}\n`);
        }
      }
    }

    // 3. Sadece aktif olan modeli bul
    console.log('✨ Çalışan Model(ler):');
    for (const modelId of testModels) {
      try {
        await groq.chat.completions.create({
          messages: [{ role: 'user', content: 'test' }],
          model: modelId,
          max_tokens: 1
        });
        console.log(`  ✅ ${modelId} - AKTİF`);
      } catch {
        // Pasif model, sessizce geç
      }
    }

  } catch (error) {
    console.error('❌ API bağlantı hatası:', error);
  }
}

// Tek mesaj gönderme fonksiyonu
// Tek mesaj gönderme fonksiyonu
export async function sendMessage(message: string, modelId: string = 'llama-3.3-70b-versatile') {
  try {
    console.log(`📤 Mesaj gönderiliyor (${modelId}): ${message}`);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Sen yardımsever bir asistansın. Kısa ve net cevaplar ver.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: modelId,
      temperature: 0.7,
      max_tokens: 150
    });

    const response = completion.choices[0]?.message?.content;
    console.log('📥 Cevap:', response);
    return response;
    
  } catch (error) {
    console.error('❌ Mesaj gönderilemedi:', error);
    return null;
  }
}