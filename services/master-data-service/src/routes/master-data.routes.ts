import { Router } from 'express';
import { MasterDataController } from '../controllers/master-data.controller';

const router = Router();

// ============================================
// Public Routes (no auth required)
// ============================================

// Industries
router.get('/industries', MasterDataController.getIndustries);
router.get('/industries/slug/:slug', MasterDataController.getIndustryBySlug);
router.get('/industries/:id', MasterDataController.getIndustryById);

// Category Templates
router.get('/category-templates/:industryId', MasterDataController.getCategoryTemplates);

// Reward Templates
router.get('/reward-templates', MasterDataController.getRewardTemplates);
router.get('/reward-templates/:id', MasterDataController.getRewardTemplateById);

// Plans
router.get('/plans', MasterDataController.getPlans);
router.get('/plans/:slug', MasterDataController.getPlanBySlug);

// FAQs
router.get('/faqs', MasterDataController.getFaqs);

// Public configs
router.get('/configs/public', MasterDataController.getPublicConfigs);

// ============================================
// Admin Routes (super_admin only via gateway)
// ============================================

// Industries CRUD
router.post('/admin/industries', MasterDataController.createIndustry);
router.put('/admin/industries/:id', MasterDataController.updateIndustry);
router.delete('/admin/industries/:id', MasterDataController.deleteIndustry);

// Category Templates CRUD
router.post('/admin/category-templates', MasterDataController.createCategoryTemplate);
router.put('/admin/category-templates/:id', MasterDataController.updateCategoryTemplate);
router.delete('/admin/category-templates/:id', MasterDataController.deleteCategoryTemplate);

// Reward Templates CRUD
router.post('/admin/reward-templates', MasterDataController.createRewardTemplate);
router.put('/admin/reward-templates/:id', MasterDataController.updateRewardTemplate);
router.delete('/admin/reward-templates/:id', MasterDataController.deleteRewardTemplate);

// Plans CRUD
router.post('/admin/plans', MasterDataController.createPlan);
router.put('/admin/plans/:id', MasterDataController.updatePlan);

// FAQs CRUD
router.post('/admin/faqs', MasterDataController.createFaq);
router.put('/admin/faqs/:id', MasterDataController.updateFaq);
router.delete('/admin/faqs/:id', MasterDataController.deleteFaq);

// Config CRUD
router.get('/admin/configs/:key', MasterDataController.getConfig);
router.get('/admin/configs/category/:category', MasterDataController.getConfigsByCategory);
router.post('/admin/configs', MasterDataController.setConfig);
router.delete('/admin/configs/:key', MasterDataController.deleteConfig);

// Seed data
router.post('/admin/seed', MasterDataController.seedData);

export default router;
