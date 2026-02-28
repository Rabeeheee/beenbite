import { Request, Response, NextFunction } from 'express';
import { MasterDataService } from '../services/master-data.service';
import { logger } from '../utils/logger';

const service = new MasterDataService();

// ============================================
// Master Data Controller
// ============================================
export class MasterDataController {
  // ---- Industries ----

  static async getIndustries(req: Request, res: Response, next: NextFunction) {
    try {
      const onlyActive = req.query.all !== 'true';
      const industries = await service.getAllIndustries(onlyActive);
      res.json({ success: true, data: industries });
    } catch (error: any) {
      logger.error('Get industries error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getIndustryById(req: Request, res: Response, next: NextFunction) {
    try {
      const industry = await service.getIndustryById(req.params.id);
      res.json({ success: true, data: industry });
    } catch (error: any) {
      res.status(error.message === 'Industry not found' ? 404 : 500).json({ success: false, message: error.message });
    }
  }

  static async getIndustryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const industry = await service.getIndustryBySlug(req.params.slug);
      res.json({ success: true, data: industry });
    } catch (error: any) {
      res.status(error.message === 'Industry not found' ? 404 : 500).json({ success: false, message: error.message });
    }
  }

  static async createIndustry(req: Request, res: Response, next: NextFunction) {
    try {
      const industry = await service.createIndustry(req.body);
      res.status(201).json({ success: true, data: industry, message: 'Industry created' });
    } catch (error: any) {
      logger.error('Create industry error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateIndustry(req: Request, res: Response, next: NextFunction) {
    try {
      const industry = await service.updateIndustry(req.params.id, req.body);
      res.json({ success: true, data: industry, message: 'Industry updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteIndustry(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.deleteIndustry(req.params.id);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ---- Category Templates ----

  static async getCategoryTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await service.getCategoryTemplates(req.params.industryId);
      res.json({ success: true, data: templates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createCategoryTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await service.createCategoryTemplate(req.body);
      res.status(201).json({ success: true, data: template, message: 'Category template created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateCategoryTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await service.updateCategoryTemplate(req.params.id, req.body);
      res.json({ success: true, data: template });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteCategoryTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.deleteCategoryTemplate(req.params.id);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ---- Reward Templates ----

  static async getRewardTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await service.getRewardTemplates(
        req.query.industryId as string,
        req.query.plan as string
      );
      res.json({ success: true, data: templates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getRewardTemplateById(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await service.getRewardTemplateById(req.params.id);
      res.json({ success: true, data: template });
    } catch (error: any) {
      res.status(error.message === 'Reward template not found' ? 404 : 500).json({ success: false, message: error.message });
    }
  }

  static async createRewardTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await service.createRewardTemplate(req.body);
      res.status(201).json({ success: true, data: template, message: 'Reward template created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateRewardTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await service.updateRewardTemplate(req.params.id, req.body);
      res.json({ success: true, data: template });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteRewardTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.deleteRewardTemplate(req.params.id);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ---- Platform Config ----

  static async getPublicConfigs(req: Request, res: Response, next: NextFunction) {
    try {
      const configs = await service.getPublicConfigs();
      res.json({ success: true, data: configs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const config = await service.getConfig(req.params.key);
      res.json({ success: true, data: config });
    } catch (error: any) {
      res.status(error.message?.includes('not found') ? 404 : 500).json({ success: false, message: error.message });
    }
  }

  static async getConfigsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const configs = await service.getConfigsByCategory(req.params.category);
      res.json({ success: true, data: configs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async setConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { key, value, description, category, isPublic } = req.body;
      const config = await service.setConfig(key, value, description, category, isPublic);
      res.json({ success: true, data: config, message: 'Config saved' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.deleteConfig(req.params.key);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ---- Plan Definitions ----

  static async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const onlyActive = req.query.all !== 'true';
      const plans = await service.getAllPlans(onlyActive);
      res.json({ success: true, data: plans });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getPlanBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await service.getPlanBySlug(req.params.slug);
      res.json({ success: true, data: plan });
    } catch (error: any) {
      res.status(error.message === 'Plan not found' ? 404 : 500).json({ success: false, message: error.message });
    }
  }

  static async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await service.createPlan(req.body);
      res.status(201).json({ success: true, data: plan, message: 'Plan created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await service.updatePlan(req.params.id, req.body);
      res.json({ success: true, data: plan, message: 'Plan updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ---- FAQs ----

  static async getFaqs(req: Request, res: Response, next: NextFunction) {
    try {
      const faqs = await service.getFaqs(req.query.category as string);
      res.json({ success: true, data: faqs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const faq = await service.createFaq(req.body);
      res.status(201).json({ success: true, data: faq, message: 'FAQ created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const faq = await service.updateFaq(req.params.id, req.body);
      res.json({ success: true, data: faq });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.deleteFaq(req.params.id);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ---- Seed ----

  static async seedData(req: Request, res: Response, next: NextFunction) {
    try {
      await service.seedDefaultData();
      res.json({ success: true, message: 'Default data seeded successfully' });
    } catch (error: any) {
      logger.error('Seed error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
