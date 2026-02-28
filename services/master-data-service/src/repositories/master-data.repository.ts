import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

// ============================================
// Master Data Repository
// ============================================
export interface IMasterDataRepository {
  // Industries
  findAllIndustries(onlyActive?: boolean): Promise<any[]>;
  findIndustryById(id: string): Promise<any>;
  findIndustryBySlug(slug: string): Promise<any>;
  createIndustry(data: any): Promise<any>;
  updateIndustry(id: string, data: any): Promise<any>;
  deleteIndustry(id: string): Promise<void>;

  // Category Templates
  findCategoryTemplates(industryId: string): Promise<any[]>;
  createCategoryTemplate(data: any): Promise<any>;
  updateCategoryTemplate(id: string, data: any): Promise<any>;
  deleteCategoryTemplate(id: string): Promise<void>;

  // Reward Templates
  findRewardTemplates(industryId?: string, plan?: string): Promise<any[]>;
  findRewardTemplateById(id: string): Promise<any>;
  createRewardTemplate(data: any): Promise<any>;
  updateRewardTemplate(id: string, data: any): Promise<any>;
  deleteRewardTemplate(id: string): Promise<void>;

  // Platform Config
  findConfigByKey(key: string): Promise<any>;
  findConfigsByCategory(category: string): Promise<any[]>;
  findPublicConfigs(): Promise<any[]>;
  upsertConfig(key: string, value: any, description?: string, category?: string, isPublic?: boolean): Promise<any>;
  deleteConfig(key: string): Promise<void>;

  // Plan Definitions
  findAllPlans(onlyActive?: boolean): Promise<any[]>;
  findPlanBySlug(slug: string): Promise<any>;
  createPlan(data: any): Promise<any>;
  updatePlan(id: string, data: any): Promise<any>;

  // FAQs
  findAllFaqs(category?: string): Promise<any[]>;
  createFaq(data: any): Promise<any>;
  updateFaq(id: string, data: any): Promise<any>;
  deleteFaq(id: string): Promise<void>;
}

export class MasterDataRepository implements IMasterDataRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // ---- Industries ----

  async findAllIndustries(onlyActive = true) {
    return this.prisma.industry.findMany({
      where: onlyActive ? { isActive: true } : {},
      include: { _count: { select: { rewardTemplates: true, categoryTemplates: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findIndustryById(id: string) {
    return this.prisma.industry.findUnique({
      where: { id },
      include: { rewardTemplates: true, categoryTemplates: true },
    });
  }

  async findIndustryBySlug(slug: string) {
    return this.prisma.industry.findUnique({
      where: { slug },
      include: { rewardTemplates: true, categoryTemplates: true },
    });
  }

  async createIndustry(data: any) {
    return this.prisma.industry.create({ data });
  }

  async updateIndustry(id: string, data: any) {
    return this.prisma.industry.update({ where: { id }, data });
  }

  async deleteIndustry(id: string) {
    await this.prisma.industry.delete({ where: { id } });
  }

  // ---- Category Templates ----

  async findCategoryTemplates(industryId: string) {
    return this.prisma.categoryTemplate.findMany({
      where: { industryId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategoryTemplate(data: any) {
    return this.prisma.categoryTemplate.create({ data });
  }

  async updateCategoryTemplate(id: string, data: any) {
    return this.prisma.categoryTemplate.update({ where: { id }, data });
  }

  async deleteCategoryTemplate(id: string) {
    await this.prisma.categoryTemplate.delete({ where: { id } });
  }

  // ---- Reward Templates ----

  async findRewardTemplates(industryId?: string, plan?: string) {
    const where: Prisma.RewardTemplateWhereInput = { isActive: true };
    if (industryId) where.industryId = industryId;
    if (plan) where.requiredPlan = plan;
    return this.prisma.rewardTemplate.findMany({
      where,
      include: { industry: { select: { id: true, name: true, slug: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findRewardTemplateById(id: string) {
    return this.prisma.rewardTemplate.findUnique({
      where: { id },
      include: { industry: true },
    });
  }

  async createRewardTemplate(data: any) {
    return this.prisma.rewardTemplate.create({ data });
  }

  async updateRewardTemplate(id: string, data: any) {
    return this.prisma.rewardTemplate.update({ where: { id }, data });
  }

  async deleteRewardTemplate(id: string) {
    await this.prisma.rewardTemplate.delete({ where: { id } });
  }

  // ---- Platform Config ----

  async findConfigByKey(key: string) {
    return this.prisma.platformConfig.findUnique({ where: { key } });
  }

  async findConfigsByCategory(category: string) {
    return this.prisma.platformConfig.findMany({ where: { category } });
  }

  async findPublicConfigs() {
    return this.prisma.platformConfig.findMany({ where: { isPublic: true } });
  }

  async upsertConfig(key: string, value: any, description?: string, category?: string, isPublic?: boolean) {
    return this.prisma.platformConfig.upsert({
      where: { key },
      update: { value, ...(description && { description }), ...(category && { category }), ...(isPublic !== undefined && { isPublic }) },
      create: { key, value, description, category: category || 'general', isPublic: isPublic || false },
    });
  }

  async deleteConfig(key: string) {
    await this.prisma.platformConfig.delete({ where: { key } });
  }

  // ---- Plan Definitions ----

  async findAllPlans(onlyActive = true) {
    return this.prisma.planDefinition.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findPlanBySlug(slug: string) {
    return this.prisma.planDefinition.findUnique({ where: { slug } });
  }

  async createPlan(data: any) {
    return this.prisma.planDefinition.create({ data });
  }

  async updatePlan(id: string, data: any) {
    return this.prisma.planDefinition.update({ where: { id }, data });
  }

  // ---- FAQs ----

  async findAllFaqs(category?: string) {
    const where: Prisma.FAQWhereInput = { isActive: true };
    if (category) where.category = category;
    return this.prisma.fAQ.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createFaq(data: any) {
    return this.prisma.fAQ.create({ data });
  }

  async updateFaq(id: string, data: any) {
    return this.prisma.fAQ.update({ where: { id }, data });
  }

  async deleteFaq(id: string) {
    await this.prisma.fAQ.delete({ where: { id } });
  }
}
