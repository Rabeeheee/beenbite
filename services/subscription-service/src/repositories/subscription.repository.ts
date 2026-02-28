// ============================================
// Subscription Repository
// ============================================

import { PrismaClient, Subscription, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export interface ISubscriptionRepository {
  findById(id: string): Promise<Subscription | null>;
  findByCompanyId(companyId: string): Promise<Subscription | null>;
  findAll(params: any): Promise<{ data: any[]; total: number }>;
  create(data: any): Promise<Subscription>;
  update(id: string, data: any): Promise<Subscription>;
  addHistory(data: any): Promise<any>;
  getHistory(subscriptionId: string): Promise<any[]>;
  findExpiring(daysBeforeExpiry: number): Promise<Subscription[]>;
  findExpired(): Promise<Subscription[]>;
  getPlanConfig(plan: SubscriptionPlan): Promise<any>;
}

export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.subscription.findUnique({ where: { id }, include: { history: { orderBy: { createdAt: 'desc' }, take: 10 } } });
  }

  async findByCompanyId(companyId: string) {
    return this.prisma.subscription.findFirst({ where: { companyId }, orderBy: { createdAt: 'desc' }, include: { history: { orderBy: { createdAt: 'desc' }, take: 5 } } });
  }

  async findAll(params: { page: number; limit: number; status?: SubscriptionStatus; plan?: SubscriptionPlan }) {
    const { page, limit, status, plan } = params;
    const where: any = {};
    if (status) where.status = status;
    if (plan) where.plan = plan;
    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { history: { take: 3, orderBy: { createdAt: 'desc' } } } }),
      this.prisma.subscription.count({ where }),
    ]);
    return { data, total };
  }

  async create(data: any) {
    return this.prisma.subscription.create({ data, include: { history: true } });
  }

  async update(id: string, data: any) {
    return this.prisma.subscription.update({ where: { id }, data, include: { history: { take: 5, orderBy: { createdAt: 'desc' } } } });
  }

  async addHistory(data: any) {
    return this.prisma.subscriptionHistory.create({ data });
  }

  async getHistory(subscriptionId: string) {
    return this.prisma.subscriptionHistory.findMany({ where: { subscriptionId }, orderBy: { createdAt: 'desc' } });
  }

  async findExpiring(daysBeforeExpiry: number) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysBeforeExpiry);
    return this.prisma.subscription.findMany({ where: { status: 'active', endDate: { lte: futureDate, gte: new Date() } } });
  }

  async findExpired() {
    return this.prisma.subscription.findMany({ where: { status: 'active', endDate: { lt: new Date() } } });
  }

  async getPlanConfig(plan: SubscriptionPlan) {
    return this.prisma.planConfig.findUnique({ where: { plan } });
  }
}
