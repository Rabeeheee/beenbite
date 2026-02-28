// ============================================
// User Repository - Repository Pattern
// ============================================

import { PrismaClient, UserProfile } from '@prisma/client';

export interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>;
  findByUserId(userId: string): Promise<UserProfile | null>;
  findByEmail(email: string): Promise<UserProfile | null>;
  findAll(params: { page: number; limit: number; search?: string; companyId?: string }): Promise<{ data: UserProfile[]; total: number }>;
  create(data: any): Promise<UserProfile>;
  update(id: string, data: any): Promise<UserProfile>;
  delete(id: string): Promise<void>;
  addPoints(userId: string, points: number): Promise<UserProfile>;
  incrementVisits(userId: string): Promise<UserProfile>;
  findByReferralCode(code: string): Promise<UserProfile | null>;
  getLeaderboard(companyId: string, limit: number): Promise<UserProfile[]>;
}

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.userProfile.findUnique({
      where: { id },
      include: { address: true, preferences: true },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.userProfile.findUnique({
      where: { userId },
      include: { address: true, preferences: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.userProfile.findUnique({ where: { email } });
  }

  async findAll(params: { page: number; limit: number; search?: string; companyId?: string }) {
    const { page, limit, search, companyId } = params;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (companyId) where.companyId = companyId;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.userProfile.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { address: true } }),
      this.prisma.userProfile.count({ where }),
    ]);
    return { data, total };
  }

  async create(data: any) {
    return this.prisma.userProfile.create({
      data: {
        ...data,
        referralCode: this.generateReferralCode(),
      },
      include: { address: true, preferences: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.userProfile.update({
      where: { id },
      data,
      include: { address: true, preferences: true },
    });
  }

  async delete(id: string) {
    await this.prisma.userProfile.delete({ where: { id } });
  }

  async addPoints(userId: string, points: number) {
    const profile = await this.prisma.userProfile.update({
      where: { userId },
      data: { points: { increment: points } },
    });
    // Auto-upgrade tier
    const tier = this.calculateTier(profile.points);
    if (tier !== profile.tier) {
      return this.prisma.userProfile.update({ where: { userId }, data: { tier } });
    }
    return profile;
  }

  async incrementVisits(userId: string) {
    return this.prisma.userProfile.update({
      where: { userId },
      data: { totalVisits: { increment: 1 } },
    });
  }

  async findByReferralCode(code: string) {
    return this.prisma.userProfile.findUnique({ where: { referralCode: code } });
  }

  async getLeaderboard(companyId: string, limit: number) {
    return this.prisma.userProfile.findMany({
      where: { companyId, isActive: true },
      orderBy: { points: 'desc' },
      take: limit,
      select: { id: true, firstName: true, lastName: true, points: true, tier: true, badges: true, avatar: true, userId: true, email: true, phone: true, companyId: true, dateOfBirth: true, gender: true, referralCode: true, referredBy: true, isActive: true, totalVisits: true, createdAt: true, updatedAt: true },
    });
  }

  private generateReferralCode(): string {
    return 'BB' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private calculateTier(points: number): string {
    if (points >= 10000) return 'platinum';
    if (points >= 5000) return 'gold';
    if (points >= 1000) return 'silver';
    return 'bronze';
  }
}
