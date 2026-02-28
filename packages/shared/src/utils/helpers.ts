// ============================================
// Shared Utilities - BeenBite Platform
// ============================================

import { SubscriptionPlan, FeatureFlags, PLAN_PRICING } from '../types';

/**
 * Generate a unique ID with prefix
 */
export const generateId = (prefix = ''): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
};

/**
 * Get feature flags for a given subscription plan
 */
export const getFeatureFlags = (plan: SubscriptionPlan): FeatureFlags => {
  const features = PLAN_PRICING[plan].features;
  return {
    normalRewards: features.includes('normal_rewards'),
    customUi: features.includes('custom_ui'),
    customerDetails: features.includes('customer_details_access'),
    socialFollowBenefits: features.includes('social_follow_benefits'),
    whatsappPush: features.includes('whatsapp_push'),
    googleReviewVerification: features.includes('google_review_verification'),
    advancedAnalytics: features.includes('advanced_analytics'),
    apiAccess: features.includes('api_access'),
    customIntegrations: features.includes('custom_integrations'),
    prioritySupport: features.includes('priority_support'),
  };
};

/**
 * Sleep utility for async operations
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sanitize string for safe display
 */
export const sanitizeString = (str: string): string => {
  return str.replace(/[<>\"'&]/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '&': '&amp;',
    };
    return entities[char] || char;
  });
};

/**
 * Format currency amount from paise/cents to display format
 */
export const formatCurrency = (
  amount: number,
  currency = 'INR'
): string => {
  const displayAmount = amount / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(displayAmount);
};

/**
 * Mask sensitive data (email, phone)
 */
export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  const maskedName = name.charAt(0) + '***' + name.charAt(name.length - 1);
  return `${maskedName}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  return phone.replace(/(\d{2})\d+(\d{2})/, '$1******$2');
};
