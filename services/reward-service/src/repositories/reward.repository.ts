import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

// ============================================
// Reward Repository Interface
// ============================================
export interface IRewardRepository {
  // Rewards CRUD
  findRewardById(id: string): Promise<any>;
  findRewardsByCompany(companyId: string, filters?: any): Promise<{ rewards: any[]; total: number }>;
  createReward(data: any): Promise<any>;
  updateReward(id: string, data: any): Promise<any>;
  deleteReward(id: string): Promise<any>;
  findActiveRewards(companyId: string): Promise<any[]>;
  findRewardsByType(companyId: string, type: string): Promise<any[]>;
  findRewardsByIndustry(industryType: string): Promise<any[]>;

  // Redemptions
  createRedemption(data: any): Promise<any>;
  findRedemptionById(id: string): Promise<any>;
  findRedemptionsByUser(userId: string, companyId?: string): Promise<any[]>;
  findRedemptionsByReward(rewardId: string): Promise<any[]>;
  findRedemptionsByCompany(companyId: string, filters?: any): Promise<{ redemptions: any[]; total: number }>;
  getRedemptionCount(rewardId: string): Promise<number>;
  getUserRedemptionCount(userId: string, rewardId: string): Promise<number>;

  // Dynamic Coupons
  createDynamicCoupon(data: any): Promise<any>;
  findCouponByCode(code: string, companyId: string): Promise<any>;
  findCouponsByCompany(companyId: string): Promise<any[]>;
  updateCoupon(id: string, data: any): Promise<any>;
  deleteCoupon(id: string): Promise<any>;
  incrementCouponUsage(id: string): Promise<any>;

  // Analytics
  getRewardAnalytics(companyId: string): Promise<any>;
  getTopRewards(companyId: string, limit?: number): Promise<any[]>;
  getUserRewardSummary(userId: string, companyId: string): Promise<any>;
}

// ============================================
// Prisma Reward Repository Implementation
// ============================================
export class RewardRepository implements IRewardRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // ---- Rewards CRUD ----

  async findRewardById(id: string) {
    return this.prisma.reward.findUnique({
      where: { id },
      include: { _count: { select: { redemptions: true } } },
    });
  }

  async findRewardsByCompany(companyId: string, filters: any = {}) {
    const { page = 1, limit = 10, type, isActive, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.RewardWhereInput = { companyId };
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [rewards, total] = await Promise.all([
      this.prisma.reward.findMany({
        where,
        include: { _count: { select: { redemptions: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.reward.count({ where }),
    ]);

    return { rewards, total };
  }

  async createReward(data: any) {
    return this.prisma.reward.create({ data });
  }

  async updateReward(id: string, data: any) {
    return this.prisma.reward.update({ where: { id }, data });
  }

  async deleteReward(id: string) {
    return this.prisma.reward.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findActiveRewards(companyId: string) {
    const now = new Date();
    return this.prisma.reward.findMany({
      where: {
        companyId,
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      include: { _count: { select: { redemptions: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRewardsByType(companyId: string, type: string) {
    return this.prisma.reward.findMany({
      where: { companyId, type, isActive: true },
      include: { _count: { select: { redemptions: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRewardsByIndustry(industryType: string) {
    return this.prisma.reward.findMany({
      where: { industryType, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ---- Redemptions ----

  async createRedemption(data: any) {
    return this.prisma.rewardRedemption.create({ data });
  }

  async findRedemptionById(id: string) {
    return this.prisma.rewardRedemption.findUnique({
      where: { id },
      include: { reward: true },
    });
  }

  async findRedemptionsByUser(userId: string, companyId?: string) {
    const where: Prisma.RewardRedemptionWhereInput = { userId };
    if (companyId) where.companyId = companyId;
    return this.prisma.rewardRedemption.findMany({
      where,
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  async findRedemptionsByReward(rewardId: string) {
    return this.prisma.rewardRedemption.findMany({
      where: { rewardId },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  async findRedemptionsByCompany(companyId: string, filters: any = {}) {
    const { page = 1, limit = 10, userId, rewardId, status } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.RewardRedemptionWhereInput = { companyId };
    if (userId) where.userId = userId;
    if (rewardId) where.rewardId = rewardId;
    if (status) where.status = status;

    const [redemptions, total] = await Promise.all([
      this.prisma.rewardRedemption.findMany({
        where,
        include: { reward: true },
        orderBy: { redeemedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.rewardRedemption.count({ where }),
    ]);

    return { redemptions, total };
  }

  async getRedemptionCount(rewardId: string) {
    return this.prisma.rewardRedemption.count({ where: { rewardId } });
  }

  async getUserRedemptionCount(userId: string, rewardId: string) {
    return this.prisma.rewardRedemption.count({
      where: { userId, rewardId },
    });
  }

  // ---- Dynamic Coupons ----

  async createDynamicCoupon(data: any) {
    return this.prisma.dynamicCoupon.create({ data });
  }

  async findCouponByCode(code: string, companyId: string) {
    return this.prisma.dynamicCoupon.findFirst({
      where: { code, companyId },
    });
  }

  async findCouponsByCompany(companyId: string) {
    return this.prisma.dynamicCoupon.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCoupon(id: string, data: any) {
    return this.prisma.dynamicCoupon.update({ where: { id }, data });
  }

  async deleteCoupon(id: string) {
    return this.prisma.dynamicCoupon.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async incrementCouponUsage(id: string) {
    return this.prisma.dynamicCoupon.update({
      where: { id },
      data: { currentUsage: { increment: 1 } },
    });
  }

  // ---- Analytics ----

  async getRewardAnalytics(companyId: string) {
    const [totalRewards, activeRewards, totalRedemptions, rewardsByType] = await Promise.all([
      this.prisma.reward.count({ where: { companyId } }),
      this.prisma.reward.count({ where: { companyId, isActive: true } }),
      this.prisma.rewardRedemption.count({ where: { companyId } }),
      this.prisma.reward.groupBy({
        by: ['type'],
        where: { companyId },
        _count: { type: true },
      }),
    ]);

    return {
      totalRewards,
      activeRewards,
      totalRedemptions,
      rewardsByType: rewardsByType.map(r => ({ type: r.type, count: r._count.type })),
    };
  }

  async getTopRewards(companyId: string, limit = 5) {
    return this.prisma.reward.findMany({
      where: { companyId, isActive: true },
      include: { _count: { select: { redemptions: true } } },
      orderBy: { redemptions: { _count: 'desc' } },
      take: limit,
    });
  }

  async getUserRewardSummary(userId: string, companyId: string) {
    const [totalRedemptions, rewardsByType, recentRedemptions] = await Promise.all([
      this.prisma.rewardRedemption.count({ where: { userId, companyId } }),
      this.prisma.rewardRedemption.groupBy({
        by: ['status'],
        where: { userId, companyId },
        _count: { status: true },
      }),
      this.prisma.rewardRedemption.findMany({
        where: { userId, companyId },
        include: { reward: true },
        orderBy: { redeemedAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      totalRedemptions,
      statusBreakdown: rewardsByType.map(r => ({ status: r.status, count: r._count.status })),
      recentRedemptions,
    };
  }
}
