// types/email.types.ts
import type { EmailTemplate, EmailStatus, BaseUser, Timestamps } from './common.types';

// ==================== EMAIL LOG ====================
export interface EmailLog extends Timestamps {
  id: string;
  user_id: string;
  to_email: string;
  subject: string;
  template: EmailTemplate;
  status: EmailStatus;
  error?: string;
  sent_at: string;
  metadata?: Record<string, unknown>;
  
  // İlişkili user (opsiyonel)
  user?: BaseUser;
}

// ==================== EMAIL CONFIG ====================
export interface EmailConfig {
  host: string;
  port: string;
  username: string;
  from: string;
  mode: 'test' | 'production';
  db_connected: boolean;
  test_mode?: boolean;
}

// ==================== SEND EMAIL REQUEST ====================
export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  template?: EmailTemplate;
  metadata?: Record<string, unknown>;
  cc?: string[];
  bcc?: string[];
}

// ==================== SEND EMAIL RESPONSE ====================
export interface SendEmailResponse {
  success: boolean;
  message: string;
  to: string;
  subject: string;
  log_id?: string;
  config?: EmailConfig;
}

// ==================== TEST EMAIL REQUEST ====================
export interface TestEmailRequest {
  email?: string;
  subject?: string;
  body?: string;
  template?: EmailTemplate;
}

// ==================== EMAIL STATS ====================
export interface EmailStats {
  total_sent: number;
  total_failed: number;
  success_rate: number;
  last_sent: string;
  today_count: number;
  monthly_count: number;
  by_template: Record<EmailTemplate, number>;
  by_status: Record<EmailStatus, number>;
}

// ==================== EMAIL LIST RESPONSE ====================
export interface EmailListResponse {
  emails: EmailLog[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// ==================== EMAIL SERVICE INTERFACES ====================
export interface IEmailService {
  // Email gönder
  sendEmail(data: SendEmailRequest): Promise<SendEmailResponse>;
  
  // Test email'i
  sendTestEmail(data?: TestEmailRequest): Promise<SendEmailResponse>;
  
  // Hızlı test
  quickTest(): Promise<SendEmailResponse>;
  
  // Gerçek test
  realTest(): Promise<SendEmailResponse>;
  
  // Email log'ları
  getEmailLogs(limit?: number): Promise<EmailLog[]>;
  
  // Email config
  getEmailConfig(): Promise<EmailConfig>;
  
  // Email stats
  getEmailStats(): Promise<EmailStats>;
  
  // Paginated email list
  getEmailList(params?: {
    page?: number;
    limit?: number;
    status?: EmailStatus;
    template?: EmailTemplate;
    date_from?: string;
    date_to?: string;
  }): Promise<EmailListResponse>;
}


// ==================== BİLDİRİM TİPLERİ (YENİ) ====================

// Bildirim tipi
export type NotificationType = 
  | 'new_order'      // Yeni sipariş
  | 'new_subscriber' // Yeni abone
  | 'payout_sent'    // Ödeme gönderildi
  | 'customer_message' // Müşteri mesajı
  | 'low_stock'      // Stok azaldı
  | 'new_review'     // Yeni yorum
  | 'payment_reminder'; // Ödeme hatırlatma

// Bildirim durumu
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'cancelled';

// Bildirim önceliği
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// Bildirim log'u
export interface NotificationLog {
  id: string;
  shop_id: string;
  user_id: string;
  type: NotificationType;
  status: NotificationStatus;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, unknown>;  // Ek veriler (sipariş ID, tutar vb.)
  sent_at?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

// Yeni Sipariş Bildirimi Request
export interface NewOrderNotificationRequest {
  to_email: string;
  order_id: string;
  order_total: string;
  customer_name: string;
  shop_name: string;
}

// Yeni Abone Bildirimi Request
export interface NewSubscriberNotificationRequest {
  to_email: string;
  subscriber_email: string;
  shop_name: string;
}

// Ödeme Bildirimi Request
export interface PayoutNotificationRequest {
  to_email: string;
  amount: string;
  payment_date: string;
  shop_name: string;
}

// Müşteri Mesajı Bildirimi Request
export interface CustomerMessageNotificationRequest {
  to_email: string;
  customer_name: string;
  message: string;
  shop_name: string;
}

// Bildirim Tercihleri (Settings'te kaydedilecek)
export interface NotificationPreferences {
  new_order: boolean;           // Yeni sipariş
  new_subscriber: boolean;      // Yeni abone
  customer_message: boolean;    // Müşteri mesajı
  payout_sent: boolean;         // Ödeme gönderildi
  low_stock: boolean;           // Stok azaldı
  new_review: boolean;          // Yeni yorum
  payment_reminder: boolean;    // Ödeme hatırlatma
}

// Bildirim Response
export interface NotificationResponse {
  success: boolean;
  message: string;
  notification_id?: string;
}