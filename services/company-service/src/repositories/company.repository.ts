// ============================================
// Company Repository - Repository Pattern
// ============================================

import { PrismaClient, Company, CompanyStatus, IndustryType } from '@prisma/client';

export interface ICompanyRepository {
  findById(id: string): Promise<any>;
  findBySlug(slug: string): Promise<any>;
  findByGst(gstNumber: string): Promise<Company | null>;
  findAll(params: any): Promise<{ data: any[]; total: number }>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: CompanyStatus): Promise<Company>;
  updateTheme(companyId: string, theme: any): Promise<any>;
  getTheme(companyId: string): Promise<any>;
  // Product methods
  createProduct(data: any): Promise<any>;
  updateProduct(id: string, data: any): Promise<any>;
  deleteProduct(id: string): Promise<void>;
  findProducts(companyId: string, params: any): Promise<{ data: any[]; total: number }>;
  // Category methods
  createCategory(data: any): Promise<any>;
  updateCategory(id: string, data: any): Promise<any>;
  deleteCategory(id: string): Promise<void>;
  findCategories(companyId: string): Promise<any[]>;
}

export class CompanyRepository implements ICompanyRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.company.findUnique({ where: { id }, include: { address: true, theme: true, _count: { select: { products: true, categories: true } } } });
  }

  async findBySlug(slug: string) {
    return this.prisma.company.findUnique({ where: { slug }, include: { address: true, theme: true } });
  }

  async findByGst(gstNumber: string) {
    return this.prisma.company.findUnique({ where: { gstNumber } });
  }

  async findAll(params: { page: number; limit: number; search?: string; status?: CompanyStatus; industry?: IndustryType }) {
    const { page, limit, search, status, industry } = params;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;
    if (industry) where.industry = industry;
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }];
    const [data, total] = await Promise.all([
      this.prisma.company.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { address: true, theme: true, _count: { select: { products: true, categories: true } } } }),
      this.prisma.company.count({ where }),
    ]);
    return { data, total };
  }

  async create(data: any) {
    const slug = this.generateSlug(data.name);
    return this.prisma.company.create({
      data: { ...data, slug, address: data.address ? { create: data.address } : undefined, theme: { create: {} } },
      include: { address: true, theme: true },
    });
  }

  async update(id: string, data: any) {
    const { address, ...companyData } = data;
    const result = await this.prisma.company.update({
      where: { id },
      data: { ...companyData, ...(address ? { address: { upsert: { create: address, update: address } } } : {}) },
      include: { address: true, theme: true },
    });
    return result;
  }

  async delete(id: string) { await this.prisma.company.delete({ where: { id } }); }

  async updateStatus(id: string, status: CompanyStatus) {
    return this.prisma.company.update({ where: { id }, data: { status } });
  }

  async updateTheme(companyId: string, theme: any) {
    return this.prisma.companyTheme.upsert({ where: { companyId }, create: { companyId, ...theme }, update: theme });
  }

  async getTheme(companyId: string) {
    return this.prisma.companyTheme.findUnique({ where: { companyId } });
  }

  // Product CRUD
  async createProduct(data: any) { return this.prisma.product.create({ data, include: { category: true } }); }
  async updateProduct(id: string, data: any) { return this.prisma.product.update({ where: { id }, data, include: { category: true } }); }
  async deleteProduct(id: string) { await this.prisma.product.delete({ where: { id } }); }
  async findProducts(companyId: string, params: { page: number; limit: number; search?: string; categoryId?: string }) {
    const { page, limit, search, categoryId } = params;
    const where: any = { companyId };
    if (categoryId) where.categoryId = categoryId;
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: { category: true } }),
      this.prisma.product.count({ where }),
    ]);
    return { data, total };
  }

  // Category CRUD
  async createCategory(data: any) { return this.prisma.category.create({ data, include: { children: true } }); }
  async updateCategory(id: string, data: any) { return this.prisma.category.update({ where: { id }, data }); }
  async deleteCategory(id: string) { await this.prisma.category.delete({ where: { id } }); }
  async findCategories(companyId: string) {
    return this.prisma.category.findMany({ where: { companyId, parentId: null }, include: { children: true, _count: { select: { products: true } } }, orderBy: { name: 'asc' } });
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 6);
  }
}
