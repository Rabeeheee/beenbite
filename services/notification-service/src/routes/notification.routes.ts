import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();

// ============================================
// Notification Routes
// ============================================

// Send
router.post('/send', NotificationController.send);
router.post('/send/bulk', NotificationController.sendBulk);

// User notifications
router.get('/user', NotificationController.getUserNotifications);
router.get('/user/:userId', NotificationController.getUserNotifications);
router.get('/unread-count', NotificationController.getUnreadCount);
router.get('/unread-count/:userId', NotificationController.getUnreadCount);
router.put('/read/:id', NotificationController.markAsRead);
router.put('/read-all', NotificationController.markAllAsRead);
router.delete('/:id', NotificationController.deleteNotification);

// Company notifications
router.get('/company', NotificationController.getCompanyNotifications);
router.get('/company/:companyId', NotificationController.getCompanyNotifications);

// Templates (admin)
router.get('/templates', NotificationController.getTemplates);
router.post('/templates', NotificationController.createTemplate);
router.put('/templates/:id', NotificationController.updateTemplate);
router.delete('/templates/:id', NotificationController.deleteTemplate);

// Preferences
router.get('/preferences', NotificationController.getPreferences);
router.get('/preferences/:userId', NotificationController.getPreferences);
router.put('/preferences', NotificationController.updatePreferences);

export default router;
