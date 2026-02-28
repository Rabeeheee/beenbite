// ============================================
// Shared Types & Interfaces - BeenBite Platform
// ============================================

// User Roles
export enum UserRole {
  USER = 'user',
  COMPANY_ADMIN = 'company_admin',
  SUPER_ADMIN = 'super_admin',
}

// Subscription Plans
export enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  TRIAL = 'trial',
  PENDING = 'pending',
}

// Plan pricing (in paise/cents)
export const PLAN_PRICING = {
  [SubscriptionPlan.STARTER]: {
    amount: 99900, // ₹999
    currency: 'INR',
    name: 'Starter Plan',
    features: [
      'normal_rewards',
      'custom_ui',
      'basic_analytics',
      'user_management',
      'product_management',
      'category_management',
    ],
  },
  [SubscriptionPlan.PROFESSIONAL]: {
    amount: 149900, // ₹1499
    currency: 'INR',
    name: 'Professional Plan',
    features: [
      'normal_rewards',
      'custom_ui',
      'basic_analytics',
      'user_management',
      'product_management',
      'category_management',
      'customer_details_access',
      'social_follow_benefits',
      'advanced_analytics',
    ],
  },
  [SubscriptionPlan.ENTERPRISE]: {
    amount: 199900, // ₹1999
    currency: 'INR',
    name: 'Enterprise Plan',
    features: [
      'normal_rewards',
      'custom_ui',
      'basic_analytics',
      'user_management',
      'product_management',
      'category_management',
      'customer_details_access',
      'social_follow_benefits',
      'advanced_analytics',
      'whatsapp_push',
      'google_review_verification',
      'priority_support',
      'api_access',
      'custom_integrations',
    ],
  },
} as const;

// Company verification status
export enum CompanyStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

// Payment status
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Reward types
export enum RewardType {
  POINTS = 'points',
  DISCOUNT = 'discount',
  CASHBACK = 'cashback',
  FREEBIE = 'freebie',
  COUPON = 'coupon',
  BADGE = 'badge',
}

// Industry types
export enum IndustryType {
  FOOD_BEVERAGE = 'food_beverage',
  RETAIL = 'retail',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  FITNESS = 'fitness',
  BEAUTY = 'beauty',
  TECHNOLOGY = 'technology',
  ENTERTAINMENT = 'entertainment',
  TRAVEL = 'travel',
  OTHER = 'other',
}

// Notification types
export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PUSH = 'push',
  IN_APP = 'in_app',
}

// Token payload
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  companyId?: string;
  iat?: number;
  exp?: number;
}

// Pagination query
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Theme customization
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  sidebarColor: string;
  headerColor: string;
  fontFamily: string;
  borderRadius: string;
  logoUrl?: string;
  faviconUrl?: string;
}

// Feature flags
export interface FeatureFlags {
  normalRewards: boolean;
  customUi: boolean;
  customerDetails: boolean;
  socialFollowBenefits: boolean;
  whatsappPush: boolean;
  googleReviewVerification: boolean;
  advancedAnalytics: boolean;
  apiAccess: boolean;
  customIntegrations: boolean;
  prioritySupport: boolean;
}

// Service health
export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  uptime: number;
  version: string;
  timestamp: string;
}
