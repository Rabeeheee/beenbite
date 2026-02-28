import { PrismaClient, Prisma, NotificationType, NotificationStatus } from '@prisma/client';
import { logger } from '../utils/logger';

// ============================================
// Notification Repository
// ============================================
export interface INotificationRepository {
  create(data: any): Promise<any>;
  findById(id: string): Promise<any>;
  findByUser(userId: string, filters?: any): Promise<{ notifications: any[]; total: number }>;
  findByCompany(companyId: string, filters?: any): Promise<{ notifications: any[]; total: number }>;
  updateStatus(id: string, status: NotificationStatus, extra?: any): Promise<any>;
  markAsRead(id: string): Promise<any>;
  markAllAsRead(userId: string): Promise<number>;
  getUnreadCount(userId: string): Promise<number>;
  deleteNotification(id: string): Promise<void>;

  // Templates
  findTemplateByName(name: string): Promise<any>;
  findAllTemplates(): Promise<any[]>;
  createTemplate(data: any): Promise<any>;
  updateTemplate(id: string, data: any): Promise<any>;
  deleteTemplate(id: string): Promise<void>;

  // Preferences
  getPreferences(userId: string): Promise<any>;
  upsertPreferences(userId: string, data: any): Promise<any>;
}

export class NotificationRepository implements INotificationRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: any) {
    return this.prisma.notification.create({ data });
  }

  async findById(id: string) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  async findByUser(userId: string, filters: any = {}) {
    const { page = 1, limit = 20, type, status } = filters;
    const skip = (page - 1) * limit;
    const where: Prisma.NotificationWhereInput = { userId };
    if (type) where.type = type;
    if (status) where.status = status;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  async findByCompany(companyId: string, filters: any = {}) {
    const { page = 1, limit = 20, type, status } = filters;
    const skip = (page - 1) * limit;
    const where: Prisma.NotificationWhereInput = { companyId };
    if (type) where.type = type;
    if (status) where.status = status;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  async updateStatus(id: string, status: NotificationStatus, extra: any = {}) {
    return this.prisma.notification.update({
      where: { id },
      data: { status, ...extra },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { status: 'read', readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, status: { not: 'read' } },
      data: { status: 'read', readAt: new Date() },
    });
    return result.count;
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, status: { not: 'read' } },
    });
  }

  async deleteNotification(id: string) {
    await this.prisma.notification.delete({ where: { id } });
  }

  // Templates
  async findTemplateByName(name: string) {
    return this.prisma.notificationTemplate.findUnique({ where: { name } });
  }

  async findAllTemplates() {
    return this.prisma.notificationTemplate.findMany({ orderBy: { name: 'asc' } });
  }

  async createTemplate(data: any) {
    return this.prisma.notificationTemplate.create({ data });
  }

  async updateTemplate(id: string, data: any) {
    return this.prisma.notificationTemplate.update({ where: { id }, data });
  }

  async deleteTemplate(id: string) {
    await this.prisma.notificationTemplate.delete({ where: { id } });
  }

  // Preferences
  async getPreferences(userId: string) {
    return this.prisma.notificationPreference.findUnique({ where: { userId } });
  }

  async upsertPreferences(userId: string, data: any) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }
}
