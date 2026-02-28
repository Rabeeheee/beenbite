import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';

const router = Router();
const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/', userController.listUsers);
router.get('/me', userController.getProfile);
router.get('/leaderboard/:companyId', userController.getLeaderboard);
router.get('/:userId', userController.getProfile);
router.post('/', userController.createProfile);
router.put('/:userId', userController.updateProfile);
router.delete('/:userId', userController.deleteProfile);
router.post('/:userId/points', userController.addPoints);
router.post('/:userId/visits', userController.recordVisit);
router.post('/:userId/badges', userController.addBadge);
router.post('/referral', userController.applyReferral);

export default router;
