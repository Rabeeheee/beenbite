import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CompanyRepository } from '../repositories/company.repository';
import { CompanyService } from '../services/company.service';
import { CompanyController } from '../controllers/company.controller';

const router = Router();
const prisma = new PrismaClient();
const repo = new CompanyRepository(prisma);
const svc = new CompanyService(repo);
const ctrl = new CompanyController(svc);

// Company CRUD
router.get('/', ctrl.list);
router.get('/slug/:slug', ctrl.getBySlug);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

// Verification (Admin)
router.post('/:id/verify', ctrl.verify);

// Theme
router.get('/:id/theme', ctrl.getTheme);
router.put('/:id/theme', ctrl.updateTheme);

// Products
router.get('/products/list', ctrl.listProducts);
router.post('/products', ctrl.createProduct);
router.put('/products/:productId', ctrl.updateProduct);
router.delete('/products/:productId', ctrl.deleteProduct);

// Categories
router.get('/categories/list', ctrl.listCategories);
router.post('/categories', ctrl.createCategory);
router.put('/categories/:categoryId', ctrl.updateCategory);
router.delete('/categories/:categoryId', ctrl.deleteCategory);

export default router;
