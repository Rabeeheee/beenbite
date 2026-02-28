import { NotificationRepository, INotificationRepository } from '../repositories/notification.repository';
import { getNotificationProvider, NotificationPayload } from '../providers/notification.provider';
import { logger } from '../utils/logger';

// ============================================
// Notification Service
// ============================================
export class NotificationService {
  private repository: INotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
  }

  // ---- Send Notification ----

  async sendNotification(data: {
    type: string;
    userId?: string;
    companyId?: string;
    recipientEmail?: string;
    recipientPhone?: string;
    subject?: string;
    body: string;
    templateId?: string;
    variables?: Record<string, string>;
    metadata?: any;
  }) {
    // Check user preferences if userId is provided
    if (data.userId) {
      const prefs = await this.repository.getPreferences(data.userId);
      if (prefs) {
        const prefMap: Record<string, boolean> = {
          email: prefs.emailEnabled,
          whatsapp: prefs.whatsappEnabled,
          push: prefs.pushEnabled,
          sms: prefs.smsEnabled,
          in_app: prefs.inAppEnabled,
        };
        if (prefMap[data.type] === false) {
          logger.info(`Notification type ${data.type} disabled for user ${data.userId}`);
          return { skipped: true, reason: 'User has disabled this notification type' };
        }
      }
    }

    // If template is specified, compile the body
    let finalBody = data.body;
    let finalSubject = data.subject;
    if (data.templateId) {
      const template = await this.repository.findTemplateByName(data.templateId);
      if (template) {
        finalBody = this.compileTemplate(template.body, data.variables);
        finalSubject = template.subject ? this.compileTemplate(template.subject, data.variables) : finalSubject;
      }
    }

    // Create notification record
    const notification = await this.repository.create({
      type: data.type,
      userId: data.userId,
      companyId: data.companyId,
      subject: finalSubject,
      body: finalBody,
      templateId: data.templateId,
      recipientEmail: data.recipientEmail,
      recipientPhone: data.recipientPhone,
      metadata: data.metadata,
      status: 'pending',
    });

    // Determine recipient
    const to = data.recipientEmail || data.recipientPhone || data.userId || '';

    // Send via provider
    const provider = getNotificationProvider(data.type);
    const result = await provider.send({
      to,
      subject: finalSubject,
      body: finalBody,
      variables: data.variables,
      metadata: data.metadata,
    });

    // Update status
    if (result.success) {
      await this.repository.updateStatus(notification.id, 'sent', {
        sentAt: new Date(),
        metadata: { ...(notification.metadata as any || {}), providerMessageId: result.messageId },
      });
    } else {
      await this.repository.updateStatus(notification.id, 'failed', {
        failureReason: result.error,
        retryCount: { increment: 1 },
      });
    }

    return {
      notificationId: notification.id,
      sent: result.success,
      messageId: result.messageId,
      error: result.error,
    };
  }

  // ---- Bulk Send ----

  async sendBulkNotification(data: {
    type: string;
    companyId: string;
    recipients: Array<{ userId?: string; email?: string; phone?: string }>;
    subject?: string;
    body: string;
    templateId?: string;
    variables?: Record<string, string>;
  }) {
    const results = [];
    for (const recipient of data.recipients) {
      const result = await this.sendNotification({
        type: data.type,
        userId: recipient.userId,
        companyId: data.companyId,
        recipientEmail: recipient.email,
        recipientPhone: recipient.phone,
        subject: data.subject,
        body: data.body,
        templateId: data.templateId,
        variables: data.variables,
      });
      results.push(result);
    }

    const sent = results.filter(r => r.sent).length;
    const failed = results.filter(r => !r.sent && !r.skipped).length;
    const skipped = results.filter(r => r.skipped).length;

    logger.info(`Bulk notification: ${sent} sent, ${failed} failed, ${skipped} skipped for company ${data.companyId}`);
    return { total: data.recipients.length, sent, failed, skipped, results };
  }

  // ---- User Notifications ----

  async getUserNotifications(userId: string, filters?: any) {
    return this.repository.findByUser(userId, filters);
  }

  async getCompanyNotifications(companyId: string, filters?: any) {
    return this.repository.findByCompany(companyId, filters);
  }

  async markAsRead(id: string) {
    return this.repository.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    const count = await this.repository.markAllAsRead(userId);
    return { markedAsRead: count };
  }

  async getUnreadCount(userId: string) {
    const count = await this.repository.getUnreadCount(userId);
    return { unreadCount: count };
  }

  async deleteNotification(id: string) {
    await this.repository.deleteNotification(id);
    return { message: 'Notification deleted' };
  }

  // ---- Templates ----

  async getTemplates() {
    return this.repository.findAllTemplates();
  }

  async createTemplate(data: any) {
    const template = await this.repository.createTemplate(data);
    logger.info(`Template created: ${template.name}`);
    return template;
  }

  async updateTemplate(id: string, data: any) {
    return this.repository.updateTemplate(id, data);
  }

  async deleteTemplate(id: string) {
    await this.repository.deleteTemplate(id);
    return { message: 'Template deleted' };
  }

  // ---- Preferences ----

  async getPreferences(userId: string) {
    let prefs = await this.repository.getPreferences(userId);
    if (!prefs) {
      prefs = await this.repository.upsertPreferences(userId, {});
    }
    return prefs;
  }

  async updatePreferences(userId: string, data: any) {
    return this.repository.upsertPreferences(userId, data);
  }

  // ---- Event Handlers (for RabbitMQ consumers) ----

  async handleEvent(eventName: string, eventData: any) {
    logger.info(`Processing event: ${eventName}`, eventData);

    switch (eventName) {
      case 'user.registered':
        await this.sendNotification({
          type: 'email',
          userId: eventData.userId,
          recipientEmail: eventData.email,
          subject: 'Welcome to BeenBite! 🎉',
          body: `<h1>Welcome, {{name}}!</h1><p>Your account has been created. Start earning rewards now!</p>`,
          variables: { name: eventData.name || 'User' },
        });
        break;

      case 'reward.redeemed':
        await this.sendNotification({
          type: 'in_app',
          userId: eventData.userId,
          subject: 'Reward Redeemed! 🎁',
          body: `You've successfully redeemed "${eventData.rewardName}". Enjoy!`,
        });
        break;

      case 'subscription.created':
        await this.sendNotification({
          type: 'email',
          companyId: eventData.companyId,
          recipientEmail: eventData.email,
          subject: 'Subscription Activated 🚀',
          body: `<h1>Your ${eventData.plan} plan is active!</h1><p>Start setting up your rewards and engaging with customers.</p>`,
        });
        break;

      case 'subscription.expiring':
        await this.sendNotification({
          type: 'email',
          companyId: eventData.companyId,
          recipientEmail: eventData.email,
          subject: 'Subscription Expiring Soon ⚠️',
          body: `<p>Your subscription expires on ${eventData.expiryDate}. Renew now to keep your rewards active!</p>`,
        });
        break;

      case 'company.verified':
        await this.sendNotification({
          type: 'email',
          companyId: eventData.companyId,
          recipientEmail: eventData.email,
          subject: 'Company Verified ✅',
          body: `<h1>Congratulations!</h1><p>Your company "${eventData.companyName}" has been verified. You can now start creating rewards!</p>`,
        });
        break;

      case 'payment.success':
        await this.sendNotification({
          type: 'email',
          companyId: eventData.companyId,
          recipientEmail: eventData.email,
          subject: 'Payment Received 💰',
          body: `<p>We've received your payment of ₹${eventData.amount}. Invoice #${eventData.invoiceNumber} is attached.</p>`,
        });
        break;

      default:
        logger.warn(`Unhandled event: ${eventName}`);
    }
  }

  // ---- Helpers ----

  private compileTemplate(template: string, variables?: Record<string, string>): string {
    if (!variables) return template;
    let compiled = template;
    for (const [key, value] of Object.entries(variables)) {
      compiled = compiled.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return compiled;
  }
}
