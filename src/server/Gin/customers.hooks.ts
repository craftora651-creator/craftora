import { useState, useEffect } from 'react';
import { apiClient } from '../../api/apiClient';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'ACTIVE' | 'AWAY' | 'OFFLINE';
  lastActive: string;
  online: boolean;
  avatar: string;
  type: 'VIP' | 'Premium' | 'Standard' | 'Basic';
  lastPurchase: string;
  totalOrders: number;
  joinDate: string;
  isTestUser?: boolean;
}

// Test kullanıcısı (navmuhammed@gmail.com)
export const testCustomer: Customer = {
  id: 'test-navmuhammed',
  name: 'Nav Muhammed',
  email: 'navmuhammed@gmail.com',
  phone: '+90 555 123 4567',
  location: 'İstanbul, Türkiye',
  status: 'ACTIVE',
  lastActive: 'Şimdi',
  online: true,
  avatar: 'https://ui-avatars.com/api/?name=Nav+Muhammed&background=0ea5e9&color=fff&size=40',
  type: 'VIP',
  lastPurchase: 'Craftora Pro',
  totalOrders: 42,
  joinDate: new Date().toLocaleDateString('tr-TR'),
  isTestUser: true
};

// Müşterileri getir
export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        
        // Token kontrolü
        const token = localStorage.getItem('access_token');
        
        // Backend'den müşterileri getir
        const response = await apiClient.get('/api/customers', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }).catch(err => {
          console.log('Customer API henüz yok, test kullanıcısı gösteriliyor:', err);
          return { data: [] };
        });

        // Test kullanıcısını en başa ekle
        setCustomers([testCustomer, ...(response.data || [])]);
        setError(null);
      } catch (err) {
        console.error('Müşteriler yüklenirken hata:', err);
        setError('Müşteriler yüklenemedi');
        // Hata durumunda sadece test kullanıcısını göster
        setCustomers([testCustomer]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return { customers, loading, error };
};

// Email gönderme hook'u
export const useSendEmail = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (to: string, subject: string, body: string) => {
    try {
      setSending(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Lütfen önce giriş yapın');
      }

      const response = await apiClient.post('/email/send', {
        to,
        subject,
        body
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        return { success: true, message: 'Email başarıyla gönderildi' };
      } else {
        throw new Error(response.data.message || 'Email gönderilemedi');
      }
    } catch (err: any) {
      console.error('Email gönderme hatası:', err);
      setError(err.message || 'Email gönderilemedi');
      return { success: false, error: err.message };
    } finally {
      setSending(false);
    }
  };

  return { sendEmail, sending, error };
};

// WhatsApp mesajı gönder
export const sendWhatsApp = (phone: string, message: string) => {
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  return { success: true };
};

// SMS simülasyonu (backend yok)
export const sendSMS = (phone: string, message: string) => {
  alert(`📱 SMS gönderilecek: ${phone}\n\nMesaj: ${message}`);
  return { success: true };
};

// Craftora bildirimi (backend yok)
export const sendCraftoraNotification = (userId: string, message: string) => {
  alert(`📢 Craftora bildirimi gönderilecek: ${userId}\n\nMesaj: ${message}`);
  return { success: true };
};