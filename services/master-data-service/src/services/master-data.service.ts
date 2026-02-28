import { MasterDataRepository, IMasterDataRepository } from '../repositories/master-data.repository';
import { logger } from '../utils/logger';

// ============================================
// Master Data Service
// ============================================
export class MasterDataService {
  private repository: IMasterDataRepository;

  constructor() {
    this.repository = new MasterDataRepository();
  }

  // ---- Industries ----

  async getAllIndustries(onlyActive = true) {
    return this.repository.findAllIndustries(onlyActive);
  }

  async getIndustryById(id: string) {
    const industry = await this.repository.findIndustryById(id);
    if (!industry) throw new Error('Industry not found');
    return industry;
  }

  async getIndustryBySlug(slug: string) {
    const industry = await this.repository.findIndustryBySlug(slug);
    if (!industry) throw new Error('Industry not found');
    return industry;
  }

  async createIndustry(data: any) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const industry = await this.repository.createIndustry({ ...data, slug });
    logger.info(`Industry created: ${industry.name}`);
    return industry;
  }

  async updateIndustry(id: string, data: any) {
    const industry = await this.repository.updateIndustry(id, data);
    logger.info(`Industry updated: ${id}`);
    return industry;
  }

  async deleteIndustry(id: string) {
    await this.repository.deleteIndustry(id);
    logger.info(`Industry deleted: ${id}`);
    return { message: 'Industry deleted successfully' };
  }

  // ---- Category Templates ----

  async getCategoryTemplates(industryId: string) {
    return this.repository.findCategoryTemplates(industryId);
  }

  async createCategoryTemplate(data: any) {
    const template = await this.repository.createCategoryTemplate(data);
    logger.info(`Category template created: ${template.name}`);
    return template;
  }

  async updateCategoryTemplate(id: string, data: any) {
    return this.repository.updateCategoryTemplate(id, data);
  }

  async deleteCategoryTemplate(id: string) {
    await this.repository.deleteCategoryTemplate(id);
    return { message: 'Category template deleted successfully' };
  }

  // ---- Reward Templates ----

  async getRewardTemplates(industryId?: string, plan?: string) {
    return this.repository.findRewardTemplates(industryId, plan);
  }

  async getRewardTemplateById(id: string) {
    const template = await this.repository.findRewardTemplateById(id);
    if (!template) throw new Error('Reward template not found');
    return template;
  }

  async createRewardTemplate(data: any) {
    if (data.conditions && typeof data.conditions === 'object') {
      data.conditions = data.conditions;
    }
    const template = await this.repository.createRewardTemplate(data);
    logger.info(`Reward template created: ${template.name}`);
    return template;
  }

  async updateRewardTemplate(id: string, data: any) {
    return this.repository.updateRewardTemplate(id, data);
  }

  async deleteRewardTemplate(id: string) {
    await this.repository.deleteRewardTemplate(id);
    return { message: 'Reward template deleted successfully' };
  }

  // ---- Platform Config ----

  async getConfig(key: string) {
    const config = await this.repository.findConfigByKey(key);
    if (!config) throw new Error(`Config key "${key}" not found`);
    return config;
  }

  async getConfigsByCategory(category: string) {
    return this.repository.findConfigsByCategory(category);
  }

  async getPublicConfigs() {
    return this.repository.findPublicConfigs();
  }

  async setConfig(key: string, value: any, description?: string, category?: string, isPublic?: boolean) {
    const config = await this.repository.upsertConfig(key, value, description, category, isPublic);
    logger.info(`Config set: ${key}`);
    return config;
  }

  async deleteConfig(key: string) {
    await this.repository.deleteConfig(key);
    logger.info(`Config deleted: ${key}`);
    return { message: 'Config deleted successfully' };
  }

  // ---- Plan Definitions ----

  async getAllPlans(onlyActive = true) {
    return this.repository.findAllPlans(onlyActive);
  }

  async getPlanBySlug(slug: string) {
    const plan = await this.repository.findPlanBySlug(slug);
    if (!plan) throw new Error('Plan not found');
    return plan;
  }

  async createPlan(data: any) {
    const plan = await this.repository.createPlan(data);
    logger.info(`Plan created: ${plan.name}`);
    return plan;
  }

  async updatePlan(id: string, data: any) {
    const plan = await this.repository.updatePlan(id, data);
    logger.info(`Plan updated: ${id}`);
    return plan;
  }

  // ---- FAQs ----

  async getFaqs(category?: string) {
    return this.repository.findAllFaqs(category);
  }

  async createFaq(data: any) {
    const faq = await this.repository.createFaq(data);
    logger.info(`FAQ created: ${faq.id}`);
    return faq;
  }

  async updateFaq(id: string, data: any) {
    return this.repository.updateFaq(id, data);
  }

  async deleteFaq(id: string) {
    await this.repository.deleteFaq(id);
    return { message: 'FAQ deleted successfully' };
  }

  // ---- Seed helper: Bootstrap initial data ----

  async seedDefaultData() {
    logger.info('Seeding default master data...');

    // Default Industries
    const industries = [
      { name: 'Restaurant', slug: 'restaurant', icon: '🍽️', description: 'Restaurants, diners, and eateries', sortOrder: 1 },
      { name: 'Cafe', slug: 'cafe', icon: '☕', description: 'Cafes, coffee shops, and bakeries', sortOrder: 2 },
      { name: 'Salon & Spa', slug: 'salon-spa', icon: '💇', description: 'Beauty salons, barbershops, and spas', sortOrder: 3 },
      { name: 'Gym & Fitness', slug: 'gym-fitness', icon: '🏋️', description: 'Gyms, fitness centers, and yoga studios', sortOrder: 4 },
      { name: 'Retail', slug: 'retail', icon: '🛍️', description: 'Retail stores and shops', sortOrder: 5 },
      { name: 'Hotel & Hospitality', slug: 'hotel-hospitality', icon: '🏨', description: 'Hotels, resorts, and hospitality', sortOrder: 6 },
      { name: 'Healthcare', slug: 'healthcare', icon: '🏥', description: 'Clinics, hospitals, and pharmacies', sortOrder: 7 },
      { name: 'Education', slug: 'education', icon: '📚', description: 'Schools, coaching centers, and ed-tech', sortOrder: 8 },
      { name: 'Entertainment', slug: 'entertainment', icon: '🎬', description: 'Cinemas, game zones, and event venues', sortOrder: 9 },
      { name: 'Other', slug: 'other', icon: '🏢', description: 'Other business types', sortOrder: 10 },
    ];

    for (const ind of industries) {
      try {
        await this.repository.createIndustry(ind);
      } catch (e: any) {
        if (!e.message?.includes('Unique constraint')) {
          logger.warn(`Skipping industry ${ind.name}: ${e.message}`);
        }
      }
    }

    // Default Plan Definitions
    const plans = [
      {
        name: 'starter', slug: 'starter', displayName: 'Starter Plan', description: 'Perfect for small businesses getting started with rewards',
        price: 999, currency: 'INR', billingPeriod: 'monthly',
        features: { qrScanner: true, basicAnalytics: true, emailSupport: true },
        rewardTypes: ['points', 'discount', 'freebie', 'coupon'],
        maxProducts: 50, maxCategories: 10, maxUsers: 500,
        hasAnalytics: false, hasWhatsApp: false, hasCustomDomain: false, sortOrder: 1,
      },
      {
        name: 'professional', slug: 'professional', displayName: 'Professional Plan', description: 'For growing businesses wanting more engagement',
        price: 1499, currency: 'INR', billingPeriod: 'monthly',
        features: { qrScanner: true, advancedAnalytics: true, emailSupport: true, socialRewards: true, badges: true },
        rewardTypes: ['points', 'discount', 'freebie', 'coupon', 'cashback', 'badge'],
        maxProducts: 200, maxCategories: 30, maxUsers: 2000,
        hasAnalytics: true, hasWhatsApp: false, hasCustomDomain: false, sortOrder: 2,
      },
      {
        name: 'enterprise', slug: 'enterprise', displayName: 'Enterprise Plan', description: 'Full-featured plan for large businesses',
        price: 1999, currency: 'INR', billingPeriod: 'monthly',
        features: { qrScanner: true, advancedAnalytics: true, prioritySupport: true, socialRewards: true, badges: true, whatsapp: true, googleReview: true, customDomain: true },
        rewardTypes: ['points', 'discount', 'freebie', 'coupon', 'cashback', 'badge'],
        maxProducts: -1, maxCategories: -1, maxUsers: -1,
        hasAnalytics: true, hasWhatsApp: true, hasCustomDomain: true, sortOrder: 3,
      },
    ];

    for (const plan of plans) {
      try {
        await this.repository.createPlan(plan);
      } catch (e: any) {
        if (!e.message?.includes('Unique constraint')) {
          logger.warn(`Skipping plan ${plan.name}: ${e.message}`);
        }
      }
    }

    logger.info('Default master data seeded successfully');
  }
}
