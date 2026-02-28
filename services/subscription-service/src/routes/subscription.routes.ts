import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionController } from '../controllers/subscription.controller';

const router = Router();
const prisma = new PrismaClient();
const repo = new SubscriptionRepository(prisma);
const svc = new SubscriptionService(repo);
const ctrl = new SubscriptionController(svc);

router.get('/plans', ctrl.getPlans);
router.get('/company/:companyId', ctrl.get);
router.get('/check-feature/:feature', ctrl.checkFeature);
router.get('/can-change-reward-type', ctrl.canChangeRewardType);
router.get('/:id', ctrl.getById);
router.get('/:id/history', ctrl.history);
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.post('/:id/activate', ctrl.activate);
router.post('/:id/renew', ctrl.renew);
router.put('/upgrade', ctrl.upgrade);
router.post('/cancel', ctrl.cancel);

export default router;
