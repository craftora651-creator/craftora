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