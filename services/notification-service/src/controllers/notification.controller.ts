import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { logger } from '../utils/logger';

const service = new NotificationService();

// ============================================
// Notification Controller
// ============================================
export class NotificationController {
  // Send notification
  static async send(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.sendNotification(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Send notification error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Send bulk notifications
  static async sendBulk(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.sendBulkNotification(req.body);
      res.json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Send bulk notification error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get user notifications
  static async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId || (req.headers['x-user-id'] as string);
      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        type: req.query.type,
        status: req.query.status,
      };
      const result = await service.getUserNotifications(userId, filters);
      res.json({
        success: true,
        data: result.notifications,
        meta: {
          total: result.total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(result.total / filters.limit),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get company notifications
  static async getCompanyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId || (req.headers['x-company-id'] as string);
      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        type: req.query.type,
        status: req.query.status,
      };
      const result = await service.getCompanyNotifications(companyId, filters);
      res.json({
        success: true,
        data: result.notifications,
        meta: {
          total: result.total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(result.total / filters.limit),
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Mark as read
  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await service.markAsRead(req.params.id);
      res.json({ success: true, data: notification });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Mark all as read
  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const result = await service.markAllAsRead(userId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get unread count
  static async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId || (req.headers['x-user-id'] as string);
      const result = await service.getUnreadCount(userId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete notification
  static async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.deleteNotification(req.params.id);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ---- Templates ----

  static async getTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await service.getTemplates();
      res.json({ success: true, data: templates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await service.createTemplate(req.body);
      res.status(201).json({ success: true, data: template });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await service.updateTemplate(req.params.id, req.body);
      res.json({ success: true, data: template });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.deleteTemplate(req.params.id);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ---- Preferences ----

  static async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId || (req.headers['x-user-id'] as string);
      const prefs = await service.getPreferences(userId);
      res.json({ success: true, data: prefs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const prefs = await service.updatePreferences(userId, req.body);
      res.json({ success: true, data: prefs, message: 'Preferences updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
