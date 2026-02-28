import { ICompanyRepository } from '../repositories/company.repository';
import { createLogger } from '../utils/logger';

const logger = createLogger('company-service');

export class CompanyService {
  constructor(private companyRepo: ICompanyRepository) {}

  async createCompany(data: any, adminUserId: string) {
    const existingGst = await this.companyRepo.findByGst(data.gstNumber);
    if (existingGst) throw { statusCode: 409, message: 'GST number already registered', code: 'GST_EXISTS' };
    const company = await this.companyRepo.create({ ...data, adminUserId });
    logger.info(`Company created: ${company.name} (${company.id})`);
    return company;
  }

  async getCompany(id: string) {
    const company = await this.companyRepo.findById(id);
    if (!company) throw { statusCode: 404, message: 'Company not found', code: 'COMPANY_NOT_FOUND' };
    return company;
  }

  async getCompanyBySlug(slug: string) {
    const company = await this.companyRepo.findBySlug(slug);
    if (!company) throw { statusCode: 404, message: 'Company not found', code: 'COMPANY_NOT_FOUND' };
    return company;
  }

  async updateCompany(id: string, data: any) {
    const company = await this.companyRepo.findById(id);
    if (!company) throw { statusCode: 404, message: 'Company not found', code: 'COMPANY_NOT_FOUND' };
    return this.companyRepo.update(id, data);
  }

  async deleteCompany(id: string) { await this.companyRepo.delete(id); }

  async listCompanies(params: any) { return this.companyRepo.findAll(params); }

  async verifyCompany(id: string, status: 'verified' | 'rejected') {
    const company = await this.companyRepo.findById(id);
    if (!company) throw { statusCode: 404, message: 'Company not found', code: 'COMPANY_NOT_FOUND' };
    const updated = await this.companyRepo.updateStatus(id, status as any);
    logger.info(`Company ${id} status updated to: ${status}`);
    return updated;
  }

  // Theme
  async updateTheme(companyId: string, theme: any) { return this.companyRepo.updateTheme(companyId, theme); }
  async getTheme(companyId: string) { return this.companyRepo.getTheme(companyId); }

  // Products
  async createProduct(companyId: string, data: any) { return this.companyRepo.createProduct({ ...data, companyId }); }
  async updateProduct(id: string, data: any) { return this.companyRepo.updateProduct(id, data); }
  async deleteProduct(id: string) { await this.companyRepo.deleteProduct(id); }
  async listProducts(companyId: string, params: any) { return this.companyRepo.findProducts(companyId, params); }

  // Categories
  async createCategory(companyId: string, data: any) { return this.companyRepo.createCategory({ ...data, companyId }); }
  async updateCategory(id: string, data: any) { return this.companyRepo.updateCategory(id, data); }
  async deleteCategory(id: string) { await this.companyRepo.deleteCategory(id); }
  async listCategories(companyId: string) { return this.companyRepo.findCategories(companyId); }
}
