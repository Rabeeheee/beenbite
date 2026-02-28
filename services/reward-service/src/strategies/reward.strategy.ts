// ============================================
// Reward Eligibility Strategy Pattern
// ============================================

export interface RewardEligibilityContext {
  userPoints: number;
  userVisits: number;
  userTier: string;
  purchaseAmount: number;
  companyPlan: string;
  dayOfWeek: string;
  hasGoogleReview: boolean;
  hasSocialFollow: boolean;
  industryType: string;
}

// Strategy Interface
export interface IRewardEligibilityStrategy {
  isEligible(context: RewardEligibilityContext, conditions: any): boolean;
}

// Points-based Strategy
export class PointsRewardStrategy implements IRewardEligibilityStrategy {
  isEligible(context: RewardEligibilityContext, conditions: any): boolean {
    if (conditions.minPoints && context.userPoints < conditions.minPoints) return false;
    if (conditions.minVisits && context.userVisits < conditions.minVisits) return false;
    return true;
  }
}

// Discount Strategy
export class DiscountRewardStrategy implements IRewardEligibilityStrategy {
  isEligible(context: RewardEligibilityContext, conditions: any): boolean {
    if (conditions.minPurchaseAmount && context.purchaseAmount < conditions.minPurchaseAmount) return false;
    if (conditions.specificDays && !conditions.specificDays.includes(context.dayOfWeek)) return false;
    return true;
  }
}

// Cashback Strategy
export class CashbackRewardStrategy implements IRewardEligibilityStrategy {
  isEligible(context: RewardEligibilityContext, conditions: any): boolean {
    if (conditions.minPurchaseAmount && context.purchaseAmount < conditions.minPurchaseAmount) return false;
    if (conditions.minTier) {
      const tierOrder = ['bronze', 'silver', 'gold', 'platinum'];
      if (tierOrder.indexOf(context.userTier) < tierOrder.indexOf(conditions.minTier)) return false;
    }
    return true;
  }
}

// Social Follow Strategy (Plan 2+)
export class SocialFollowRewardStrategy implements IRewardEligibilityStrategy {
  isEligible(context: RewardEligibilityContext, conditions: any): boolean {
    if (!['professional', 'enterprise'].includes(context.companyPlan)) return false;
    if (conditions.requiresSocialFollow && !context.hasSocialFollow) return false;
    return true;
  }
}

// Google Review Strategy (Plan 3)
export class GoogleReviewRewardStrategy implements IRewardEligibilityStrategy {
  isEligible(context: RewardEligibilityContext, conditions: any): boolean {
    if (context.companyPlan !== 'enterprise') return false;
    if (conditions.requiresGoogleReview && !context.hasGoogleReview) return false;
    return true;
  }
}

// Badge Strategy
export class BadgeRewardStrategy implements IRewardEligibilityStrategy {
  isEligible(context: RewardEligibilityContext, conditions: any): boolean {
    if (conditions.minPoints && context.userPoints < conditions.minPoints) return false;
    if (conditions.minVisits && context.userVisits < conditions.minVisits) return false;
    return true;
  }
}

// Plan-based feature toggle
export class PlanFeatureToggle {
  private static planFeatures: Record<string, string[]> = {
    starter: ['points', 'discount', 'freebie', 'coupon'],
    professional: ['points', 'discount', 'freebie', 'coupon', 'cashback', 'badge', 'social_follow'],
    enterprise: ['points', 'discount', 'freebie', 'coupon', 'cashback', 'badge', 'social_follow', 'google_review', 'whatsapp_push'],
  };

  static isFeatureAllowed(plan: string, feature: string): boolean {
    return this.planFeatures[plan]?.includes(feature) ?? false;
  }

  static getAllowedRewardTypes(plan: string): string[] {
    return this.planFeatures[plan] || this.planFeatures['starter'];
  }
}

// Strategy Factory
export class RewardStrategyFactory {
  static getStrategy(rewardType: string): IRewardEligibilityStrategy {
    switch (rewardType) {
      case 'points': return new PointsRewardStrategy();
      case 'discount': return new DiscountRewardStrategy();
      case 'cashback': return new CashbackRewardStrategy();
      case 'freebie': return new PointsRewardStrategy();
      case 'coupon': return new DiscountRewardStrategy();
      case 'badge': return new BadgeRewardStrategy();
      default: return new PointsRewardStrategy();
    }
  }
}
