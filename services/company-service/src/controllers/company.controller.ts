import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CompanyService } from '../services/company.service';

export class CompanyController {
  constructor(private svc: CompanyService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminUserId = req.headers['x-user-id'] as string;
      const company = await this.svc.createCompany(req.body, adminUserId);
      res.status(StatusCodes.CREATED).json({ success: true, message: 'Company created', data: company, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const company = await this.svc.getCompany(req.params.id);
      res.json({ success: true, data: company, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const company = await this.svc.getCompanyBySlug(req.params.slug);
      res.json({ success: true, data: company, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const company = await this.svc.updateCompany(req.params.id, req.body);
      res.json({ success: true, message: 'Company updated', data: company, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.svc.deleteCompany(req.params.id);
      res.json({ success: true, message: 'Company deleted', timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.svc.listCompanies({ page, limit, search: req.query.search, status: req.query.status, industry: req.query.industry });
      res.json({ success: true, data: result.data, meta: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) }, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const company = await this.svc.verifyCompany(req.params.id, req.body.status);
      res.json({ success: true, message: `Company ${req.body.status}`, data: company, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  // Theme
  updateTheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.params.id || req.headers['x-company-id'] as string;
      const theme = await this.svc.updateTheme(companyId, req.body);
      res.json({ success: true, message: 'Theme updated', data: theme, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  getTheme = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.params.id || req.headers['x-company-id'] as string;
      const theme = await this.svc.getTheme(companyId);
      res.json({ success: true, data: theme, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  // Products
  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const product = await this.svc.createProduct(companyId, req.body);
      res.status(StatusCodes.CREATED).json({ success: true, data: product, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };
  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { const product = await this.svc.updateProduct(req.params.productId, req.body); res.json({ success: true, data: product, timestamp: new Date().toISOString() }); } catch (e) { next(e); }
  };
  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { await this.svc.deleteProduct(req.params.productId); res.json({ success: true, message: 'Product deleted', timestamp: new Date().toISOString() }); } catch (e) { next(e); }
  };
  listProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.svc.listProducts(companyId, { page, limit, search: req.query.search, categoryId: req.query.categoryId });
      res.json({ success: true, data: result.data, meta: { page, limit, total: result.total }, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  // Categories
  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const category = await this.svc.createCategory(companyId, req.body);
      res.status(StatusCodes.CREATED).json({ success: true, data: category, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };
  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { const cat = await this.svc.updateCategory(req.params.categoryId, req.body); res.json({ success: true, data: cat, timestamp: new Date().toISOString() }); } catch (e) { next(e); }
  };
  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { await this.svc.deleteCategory(req.params.categoryId); res.json({ success: true, message: 'Category deleted', timestamp: new Date().toISOString() }); } catch (e) { next(e); }
  };
  listCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const cats = await this.svc.listCategories(companyId);
      res.json({ success: true, data: cats, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };
}
