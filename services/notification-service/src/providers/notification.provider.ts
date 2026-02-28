import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../utils/logger';

// ============================================
// Notification Provider Strategy Pattern
// ============================================

export interface NotificationPayload {
  to: string;
  subject?: string;
  body: string;
  templateId?: string;
  variables?: Record<string, string>;
  metadata?: any;
}

export interface INotificationProvider {
  send(payload: NotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// ============================================
// Email Provider (Nodemailer)
// ============================================
export class EmailProvider implements INotificationProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  async send(payload: NotificationPayload) {
    try {
      const info = await this.transporter.sendMail({
        from: config.smtp.from,
        to: payload.to,
        subject: payload.subject || 'BeenBite Notification',
        html: this.compileTemplate(payload.body, payload.variables),
      });

      logger.info(`Email sent: ${info.messageId} to ${payload.to}`);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      logger.error(`Email send failed to ${payload.to}:`, error);
      return { success: false, error: error.message };
    }
  }

  private compileTemplate(body: string, variables?: Record<string, string>): string {
    if (!variables) return body;
    let compiled = body;
    for (const [key, value] of Object.entries(variables)) {
      compiled = compiled.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return compiled;
  }
}

// ============================================
// WhatsApp Provider (API-based)
// ============================================
export class WhatsAppProvider implements INotificationProvider {
  async send(payload: NotificationPayload) {
    try {
      if (!config.whatsapp.apiUrl) {
        logger.warn('WhatsApp API not configured, skipping');
        return { success: false, error: 'WhatsApp API not configured' };
      }

      // WhatsApp Business API integration
      const response = await fetch(config.whatsapp.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.whatsapp.apiKey}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: payload.to,
          type: 'text',
          text: { body: payload.body },
        }),
      });

      const data = await response.json() as any;
      if (response.ok) {
        logger.info(`WhatsApp sent to ${payload.to}`);
        return { success: true, messageId: data.messages?.[0]?.id };
      } else {
        logger.error(`WhatsApp send failed:`, data);
        return { success: false, error: data.error?.message || 'Unknown error' };
      }
    } catch (error: any) {
      logger.error(`WhatsApp send failed to ${payload.to}:`, error);
      return { success: false, error: error.message };
    }
  }
}

// ============================================
// Push Notification Provider (FCM placeholder)
// ============================================
export class PushProvider implements INotificationProvider {
  async send(payload: NotificationPayload) {
    try {
      // Firebase Cloud Messaging or similar push notification service
      logger.info(`Push notification sent to ${payload.to}: ${payload.subject}`);
      return { success: true, messageId: `push-${Date.now()}` };
    } catch (error: any) {
      logger.error(`Push send failed:`, error);
      return { success: false, error: error.message };
    }
  }
}

// ============================================
// In-App Provider (stores in DB only)
// ============================================
export class InAppProvider implements INotificationProvider {
  async send(payload: NotificationPayload) {
    // In-app notifications are stored in the DB by the service
    logger.info(`In-app notification created for ${payload.to}`);
    return { success: true, messageId: `inapp-${Date.now()}` };
  }
}

// ============================================
// Provider Factory
// ============================================
export function getNotificationProvider(type: string): INotificationProvider {
  switch (type) {
    case 'email': return new EmailProvider();
    case 'whatsapp': return new WhatsAppProvider();
    case 'push': return new PushProvider();
    case 'in_app': return new InAppProvider();
    default: return new EmailProvider();
  }
}
