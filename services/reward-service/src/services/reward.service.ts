import { RewardRepository, IRewardRepository } from '../repositories/reward.repository';
import {
  RewardStrategyFactory,
  PlanFeatureToggle,
  RewardEligibilityContext,
} from '../strategies/reward.strategy';
import { logger } from '../utils/logger';
import crypto from 'crypto';

// ============================================
// Reward Service Interface
// ============================================
export interface IRewardService {
  // Rewards
  createReward(companyId: string, companyPlan: string, data: any): Promise<any>;
  getReward(id: string): Promise<any>;
  getRewardsByCompany(companyId: string, filters?: any): Promise<any>;
  getActiveRewards(companyId: string): Promise<any>;
  updateReward(id: string, companyId: string, data: any): Promise<any>;
  deleteReward(id: string, companyId: string): Promise<any>;
  getRewardsByIndustry(industryType: string): Promise<any>;

  // Redemptions
  redeemReward(userId: string, rewardId: string, companyId: string, context: Partial<RewardEligibilityContext>): Promise<any>;
  getUserRedemptions(userId: string, companyId?: string): Promise<any>;
  getCompanyRedemptions(companyId: string, filters?: any): Promise<any>;
  getUserRewardSummary(userId: string, companyId: string): Promise<any>;

  // Dynamic Coupons
  createDynamicCoupon(companyId: string, data: any): Promise<any>;
  validateCoupon(code: string, companyId: string): Promise<any>;
  applyCoupon(code: string, companyId: string, userId: string): Promise<any>;
  getCoupons(companyId: string): Promise<any>;
  updateCoupon(id: string, companyId: string, data: any): Promise<any>;
  deleteCoupon(id: string, companyId: string): Promise<any>;

  // Analytics
  getRewardAnalytics(companyId: string): Promise<any>;
  getTopRewards(companyId: string, limit?: number): Promise<any>;
}

// ============================================
// Reward Service Implementation
// ============================================
export class RewardService implements IRewardService {
  private repository: IRewardRepository;

  constructor() {
    this.repository = new RewardRepository();
  }

  // ---- Rewards ----

  async createReward(companyId: string, companyPlan: string, data: any) {
    // Check if reward type is allowed for the company's plan
    const allowedTypes = PlanFeatureToggle.getAllowedRewardTypes(companyPlan);
    if (!allowedTypes.includes(data.type)) {
      throw new Error(
        `Reward type "${data.type}" is not available on your current plan (${companyPlan}). ` +
        `Allowed types: ${allowedTypes.join(', ')}. Please upgrade your plan.`
      );
    }

    // Generate coupon code if type is coupon and no code provided
    if (data.type === 'coupon' && !data.couponCode) {
      data.couponCode = this.generateCouponCode();
    }

    const reward = await this.repository.createReward({
      ...data,
      companyId,
      conditions: data.conditions ? JSON.stringify(data.conditions) : null,
    });

    logger.info(`Reward created: ${reward.id} (${reward.type}) for company ${companyId}`);
    return reward;
  }

  async getReward(id: string) {
    const reward = await this.repository.findRewardById(id);
    if (!reward) throw new Error('Reward not found');
    return reward;
  }

  async getRewardsByCompany(companyId: string, filters?: any) {
    return this.repository.findRewardsByCompany(companyId, filters);
  }

  async getActiveRewards(companyId: string) {
    return this.repository.findActiveRewards(companyId);
  }

  async updateReward(id: string, companyId: string, data: any) {
    const reward = await this.repository.findRewardById(id);
    if (!reward) throw new Error('Reward not found');
    if (reward.companyId !== companyId) throw new Error('Unauthorized: Reward does not belong to your company');

    if (data.conditions) {
      data.conditions = JSON.stringify(data.conditions);
    }

    const updated = await this.repository.updateReward(id, data);
    logger.info(`Reward updated: ${id}`);
    return updated;
  }

  async deleteReward(id: string, companyId: string) {
    const reward = await this.repository.findRewardById(id);
    if (!reward) throw new Error('Reward not found');
    if (reward.companyId !== companyId) throw new Error('Unauthorized: Reward does not belong to your company');

    await this.repository.deleteReward(id);
    logger.info(`Reward soft-deleted: ${id}`);
    return { message: 'Reward deleted successfully' };
  }

  async getRewardsByIndustry(industryType: string) {
    return this.repository.findRewardsByIndustry(industryType);
  }

  // ---- Redemptions ----

  async redeemReward(
    userId: string,
    rewardId: string,
    companyId: string,
    context: Partial<RewardEligibilityContext>
  ) {
    const reward = await this.repository.findRewardById(rewardId);
    if (!reward) throw new Error('Reward not found');
    if (!reward.isActive) throw new Error('Reward is not active');
    if (reward.companyId !== companyId) throw new Error('Reward does not belong to this company');

    // Check date validity
    const now = new Date();
    if (reward.startDate && new Date(reward.startDate) > now) {
      throw new Error('Reward is not yet active');
    }
    if (reward.endDate && new Date(reward.endDate) < now) {
      throw new Error('Reward has expired');
    }

    // Check max redemptions
    if (reward.maxRedemptions) {
      const totalRedemptions = await this.repository.getRedemptionCount(rewardId);
      if (totalRedemptions >= reward.maxRedemptions) {
        throw new Error('Reward has reached maximum redemptions');
      }
    }

    // Check per-user redemption limit
    if (reward.maxPerUser) {
      const userRedemptions = await this.repository.getUserRedemptionCount(userId, rewardId);
      if (userRedemptions >= reward.maxPerUser) {
        throw new Error('You have reached the maximum redemption limit for this reward');
      }
    }

    // Use strategy pattern to check eligibility
    const strategy = RewardStrategyFactory.getStrategy(reward.type);
    const conditions = reward.conditions ? JSON.parse(reward.conditions as string) : {};
    const eligibilityContext: RewardEligibilityContext = {
      userPoints: context.userPoints || 0,
      userVisits: context.userVisits || 0,
      userTier: context.userTier || 'bronze',
      purchaseAmount: context.purchaseAmount || 0,
      companyPlan: context.companyPlan || 'starter',
      dayOfWeek: context.dayOfWeek || new Date().toLocaleDateString('en-US', { weekday: 'lowercase' as any }),
      hasGoogleReview: context.hasGoogleReview || false,
      hasSocialFollow: context.hasSocialFollow || false,
      industryType: context.industryType || '',
    };

    if (!strategy.isEligible(eligibilityContext, conditions)) {
      throw new Error('You are not eligible for this reward. Check the reward conditions.');
    }

    // Calculate reward value
    let rewardValue = reward.value;
    if (reward.type === 'discount' && reward.value > 100) {
      rewardValue = Math.min(reward.value, context.purchaseAmount || 0);
    }

    // Create redemption
    const redemption = await this.repository.createRedemption({
      rewardId,
      userId,
      companyId,
      pointsUsed: reward.type === 'points' ? reward.pointsCost || 0 : 0,
      rewardValue,
      status: 'completed',
    });

    logger.info(`Reward redeemed: ${rewardId} by user ${userId} for company ${companyId}`);

    return {
      redemption,
      reward: {
        name: reward.name,
        type: reward.type,
        value: rewardValue,
      },
    };
  }

  async getUserRedemptions(userId: string, companyId?: string) {
    return this.repository.findRedemptionsByUser(userId, companyId);
  }

  async getCompanyRedemptions(companyId: string, filters?: any) {
    return this.repository.findRedemptionsByCompany(companyId, filters);
  }

  async getUserRewardSummary(userId: string, companyId: string) {
    return this.repository.getUserRewardSummary(userId, companyId);
  }

  // ---- Dynamic Coupons ----

  async createDynamicCoupon(companyId: string, data: any) {
    // Check if coupon code already exists for this company
    const existing = await this.repository.findCouponByCode(data.code, companyId);
    if (existing) throw new Error('Coupon code already exists for this company');

    const coupon = await this.repository.createDynamicCoupon({
      ...data,
      companyId,
      code: data.code.toUpperCase(),
    });

    logger.info(`Dynamic coupon created: ${coupon.code} for company ${companyId}`);
    return coupon;
  }

  async validateCoupon(code: string, companyId: string) {
    const coupon = await this.repository.findCouponByCode(code.toUpperCase(), companyId);
    if (!coupon) throw new Error('Invalid coupon code');
    if (!coupon.isActive) throw new Error('Coupon is no longer active');

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      throw new Error('Coupon is not yet valid');
    }
    if (coupon.endDate && new Date(coupon.endDate) < now) {
      throw new Error('Coupon has expired');
    }
    if (coupon.maxUsage && coupon.currentUsage >= coupon.maxUsage) {
      throw new Error('Coupon usage limit reached');
    }

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
        maxDiscount: coupon.maxDiscount,
      },
    };
  }

  async applyCoupon(code: string, companyId: string, userId: string) {
    const validation = await this.validateCoupon(code, companyId);
    const coupon = await this.repository.findCouponByCode(code.toUpperCase(), companyId);
    if (!coupon) throw new Error('Invalid coupon code');

    await this.repository.incrementCouponUsage(coupon.id);
    logger.info(`Coupon applied: ${code} by user ${userId} for company ${companyId}`);

    return {
      applied: true,
      discount: validation.coupon,
    };
  }

  async getCoupons(companyId: string) {
    return this.repository.findCouponsByCompany(companyId);
  }

  async updateCoupon(id: string, companyId: string, data: any) {
    return this.repository.updateCoupon(id, data);
  }

  async deleteCoupon(id: string, companyId: string) {
    await this.repository.deleteCoupon(id);
    logger.info(`Coupon soft-deleted: ${id}`);
    return { message: 'Coupon deleted successfully' };
  }

  // ---- Analytics ----

  async getRewardAnalytics(companyId: string) {
    return this.repository.getRewardAnalytics(companyId);
  }

  async getTopRewards(companyId: string, limit = 5) {
    return this.repository.getTopRewards(companyId, limit);
  }

  // ---- Helpers ----

  private generateCouponCode(length = 8): string {
    return 'BB-' + crypto.randomBytes(length).toString('hex').toUpperCase().slice(0, length);
  }
}
