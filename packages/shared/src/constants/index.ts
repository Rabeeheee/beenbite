// ============================================
// Shared Constants - BeenBite Platform
// ============================================

export const CONSTANTS = {
  // API Versioning
  API_VERSION: 'v1',
  API_PREFIX: '/api/v1',

  // Pagination defaults
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Token expiry
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  RESET_TOKEN_EXPIRY: '1h',

  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100,
  AUTH_RATE_LIMIT_MAX: 10,

  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],

  // Cache TTL (seconds)
  CACHE_TTL_SHORT: 60, // 1 minute
  CACHE_TTL_MEDIUM: 300, // 5 minutes
  CACHE_TTL_LONG: 3600, // 1 hour
  CACHE_TTL_DAY: 86400, // 24 hours

  // Subscription
  TRIAL_DAYS: 14,
  SUBSCRIPTION_GRACE_PERIOD: 3, // days

  // Reward limits
  MAX_REWARDS_PER_COMPANY: 50,
  MAX_CATEGORIES_PER_COMPANY: 20,
  MAX_PRODUCTS_PER_COMPANY: 500,

  // Event names for message queue
  EVENTS: {
    USER_REGISTERED: 'user.registered',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
    COMPANY_CREATED: 'company.created',
    COMPANY_VERIFIED: 'company.verified',
    COMPANY_SUSPENDED: 'company.suspended',
    SUBSCRIPTION_CREATED: 'subscription.created',
    SUBSCRIPTION_RENEWED: 'subscription.renewed',
    SUBSCRIPTION_EXPIRED: 'subscription.expired',
    SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
    PAYMENT_COMPLETED: 'payment.completed',
    PAYMENT_FAILED: 'payment.failed',
    REWARD_CREATED: 'reward.created',
    REWARD_REDEEMED: 'reward.redeemed',
    NOTIFICATION_SEND: 'notification.send',
  },
} as const;
