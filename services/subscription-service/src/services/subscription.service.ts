// ============================================
// Subscription Service - Business Logic
// Includes: Plan management, feature flags,
// reward type change rules, trial logic
// ============================================

import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { ISubscriptionRepository } from '../repositories/subscription.repository';
import { createLogger } from '../utils/logger';
import { config } from '../config';

const logger = createLogger('subscription-service');

// Plan pricing map
const PLAN_PRICING: Record<string, { amount: number; name: string; features: string[] }> = {
  starter: {
    amount: 99900,
    name: 'Starter Plan - ₹999',
    features: ['normal_rewards', 'custom_ui', 'basic_analytics', 'user_management', 'product_management', 'category_management'],
  },
  professional: {
    amount: 149900,
    name: 'Professional Plan - ₹1499',
    features: ['normal_rewards', 'custom_ui', 'basic_analytics', 'user_management', 'product_management', 'category_management', 'customer_details_access', 'social_follow_benefits', 'advanced_analytics'],
  },
  enterprise: {
    amount: 199900,
    name: 'Enterprise Plan - ₹1999',
    features: ['normal_rewards', 'custom_ui', 'basic_analytics', 'user_management', 'product_management', 'category_management', 'customer_details_access', 'social_follow_benefits', 'advanced_analytics', 'whatsapp_push', 'google_review_verification', 'priority_support', 'api_access', 'custom_integrations'],
  },
};

export class SubscriptionService {
  constructor(private repo: ISubscriptionRepository) {}

  async createSubscription(companyId: string, plan: SubscriptionPlan) {
    // Check existing active subscription
    const existing = await this.repo.findByCompanyId(companyId);
    if (existing && (existing.status === 'active' || existing.status === 'trial')) {
      throw { statusCode: 409, message: 'Company already has an active subscription', code: 'ACTIVE_SUB_EXISTS' };
    }

    const planConfig = PLAN_PRICING[plan];
    if (!planConfig) throw { statusCode: 400, message: 'Invalid plan', code: 'INVALID_PLAN' };

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 days

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + config.trialDays);

    const subscription = await this.repo.create({
      companyId,
      plan,
      status: 'trial' as SubscriptionStatus,
      startDate,
      endDate,
      trialEndsAt,
      amount: planConfig.amount,
      currency: 'INR',
      features: planConfig.features,
    });

    await this.repo.addHistory({
      subscriptionId: subscription.id,
      action: 'created',
      newPlan: plan,
      newStatus: 'trial' as SubscriptionStatus,
      amount: planConfig.amount,
      note: `${planConfig.name} subscription created with ${config.trialDays}-day trial`,
    });

    logger.info(`Subscription created for company ${companyId}: ${plan}`);
    return subscription;
  }

  async getSubscription(companyId: string) {
    const sub = await this.repo.findByCompanyId(companyId);
    if (!sub) throw { statusCode: 404, message: 'No subscription found', code: 'SUB_NOT_FOUND' };
    return { ...sub, planDetails: PLAN_PRICING[sub.plan] };
  }

  async getSubscriptionById(id: string) {
    const sub = await this.repo.findById(id);
    if (!sub) throw { statusCode: 404, message: 'Subscription not found', code: 'SUB_NOT_FOUND' };
    return { ...sub, planDetails: PLAN_PRICING[sub.plan] };
  }

  async activateSubscription(subscriptionId: string) {
    const sub = await this.repo.findById(subscriptionId);
    if (!sub) throw { statusCode: 404, message: 'Subscription not found', code: 'SUB_NOT_FOUND' };

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const updated = await this.repo.update(subscriptionId, { status: 'active' as SubscriptionStatus, endDate });

    await this.repo.addHistory({
      subscriptionId,
      action: 'activated',
      previousStatus: sub.status,
      newStatus: 'active' as SubscriptionStatus,
      note: 'Subscription activated after payment',
    });

    logger.info(`Subscription ${subscriptionId} activated`);
    return updated;
  }

  async upgradePlan(companyId: string, newPlan: SubscriptionPlan) {
    const sub = await this.repo.findByCompanyId(companyId);
    if (!sub) throw { statusCode: 404, message: 'No subscription found', code: 'SUB_NOT_FOUND' };
    if (sub.status !== 'active' && sub.status !== 'trial') {
      throw { statusCode: 400, message: 'Subscription must be active to upgrade', code: 'INACTIVE_SUB' };
    }

    const planConfig = PLAN_PRICING[newPlan];
    const updated = await this.repo.update(sub.id, { plan: newPlan, amount: planConfig.amount, features: planConfig.features });

    await this.repo.addHistory({
      subscriptionId: sub.id,
      action: 'upgraded',
      previousPlan: sub.plan,
      newPlan,
      amount: planConfig.amount,
      note: `Upgraded from ${sub.plan} to ${newPlan}`,
    });

    logger.info(`Subscription upgraded: ${sub.plan} -> ${newPlan} for company ${companyId}`);
    return updated;
  }

  async cancelSubscription(companyId: string, reason?: string) {
    const sub = await this.repo.findByCompanyId(companyId);
    if (!sub) throw { statusCode: 404, message: 'No subscription found', code: 'SUB_NOT_FOUND' };

    const updated = await this.repo.update(sub.id, { status: 'cancelled' as SubscriptionStatus, autoRenew: false });

    await this.repo.addHistory({
      subscriptionId: sub.id,
      action: 'cancelled',
      previousStatus: sub.status,
      newStatus: 'cancelled' as SubscriptionStatus,
      note: reason || 'Subscription cancelled by user',
    });

    logger.info(`Subscription cancelled for company ${companyId}`);
    return updated;
  }

  async renewSubscription(subscriptionId: string) {
    const sub = await this.repo.findById(subscriptionId);
    if (!sub) throw { statusCode: 404, message: 'Subscription not found', code: 'SUB_NOT_FOUND' };

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const updated = await this.repo.update(subscriptionId, { status: 'active' as SubscriptionStatus, endDate });

    await this.repo.addHistory({
      subscriptionId,
      action: 'renewed',
      previousStatus: sub.status,
      newStatus: 'active' as SubscriptionStatus,
      amount: sub.amount,
      note: 'Subscription renewed',
    });

    return updated;
  }

  async listSubscriptions(params: any) {
    return this.repo.findAll(params);
  }

  async getHistory(subscriptionId: string) {
    return this.repo.getHistory(subscriptionId);
  }

  // Feature flag check
  async checkFeature(companyId: string, feature: string): Promise<boolean> {
    const sub = await this.repo.findByCompanyId(companyId);
    if (!sub || (sub.status !== 'active' && sub.status !== 'trial')) return false;
    return sub.features.includes(feature);
  }

  // Reward type change rule: Only during active subscription
  async canChangeRewardType(companyId: string): Promise<boolean> {
    const sub = await this.repo.findByCompanyId(companyId);
    if (!sub || sub.status !== 'active') return false;
    return true;
  }

  async getPlans() {
    return Object.entries(PLAN_PRICING).map(([key, val]) => ({
      id: key,
      ...val,
      displayAmount: `₹${val.amount / 100}`,
    }));
  }

  // Cron job helper: expire subscriptions
  async processExpiredSubscriptions() {
    const expired = await this.repo.findExpired();
    for (const sub of expired) {
      await this.repo.update(sub.id, { status: 'expired' as SubscriptionStatus });
      await this.repo.addHistory({
        subscriptionId: sub.id,
        action: 'expired',
        previousStatus: sub.status,
        newStatus: 'expired' as SubscriptionStatus,
        note: 'Subscription expired automatically',
      });
      logger.info(`Subscription ${sub.id} expired`);
    }
    return expired.length;
  }
}
