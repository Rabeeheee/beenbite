import { Router } from 'express';
import { RewardController } from '../controllers/reward.controller';

const router = Router();

// ============================================
// Reward Routes
// ============================================

/**
 * @swagger
 * /api/v1/rewards:
 *   post:
 *     summary: Create a new reward
 *     tags: [Rewards]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', RewardController.createReward);

/**
 * @swagger
 * /api/v1/rewards/active:
 *   get:
 *     summary: Get active rewards for the company
 *     tags: [Rewards]
 */
router.get('/active', RewardController.getActiveRewards);

/**
 * @swagger
 * /api/v1/rewards/industry/{industryType}:
 *   get:
 *     summary: Get rewards by industry type
 *     tags: [Rewards]
 */
router.get('/industry/:industryType', RewardController.getRewardsByIndustry);

/**
 * @swagger
 * /api/v1/rewards/analytics:
 *   get:
 *     summary: Get reward analytics for company
 *     tags: [Rewards]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/analytics', RewardController.getRewardAnalytics);

/**
 * @swagger
 * /api/v1/rewards/top:
 *   get:
 *     summary: Get top-performing rewards
 *     tags: [Rewards]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/top', RewardController.getTopRewards);

/**
 * @swagger
 * /api/v1/rewards/company/{companyId}:
 *   get:
 *     summary: Get all rewards for a specific company
 *     tags: [Rewards]
 */
router.get('/company/:companyId', RewardController.getRewardsByCompany);

/**
 * @swagger
 * /api/v1/rewards/{id}:
 *   get:
 *     summary: Get reward by ID
 *     tags: [Rewards]
 */
router.get('/:id', RewardController.getReward);

/**
 * @swagger
 * /api/v1/rewards/{id}:
 *   put:
 *     summary: Update a reward
 *     tags: [Rewards]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/:id', RewardController.updateReward);

/**
 * @swagger
 * /api/v1/rewards/{id}:
 *   delete:
 *     summary: Delete (soft) a reward
 *     tags: [Rewards]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/:id', RewardController.deleteReward);

// ============================================
// Redemption Routes
// ============================================

/**
 * @swagger
 * /api/v1/rewards/redeem:
 *   post:
 *     summary: Redeem a reward
 *     tags: [Redemptions]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/redeem', RewardController.redeemReward);

/**
 * @swagger
 * /api/v1/rewards/redemptions/user/{userId}:
 *   get:
 *     summary: Get redemptions for a user
 *     tags: [Redemptions]
 */
router.get('/redemptions/user/:userId', RewardController.getUserRedemptions);

/**
 * @swagger
 * /api/v1/rewards/redemptions/user:
 *   get:
 *     summary: Get redemptions for the current user
 *     tags: [Redemptions]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/redemptions/user', RewardController.getUserRedemptions);

/**
 * @swagger
 * /api/v1/rewards/redemptions/company/{companyId}:
 *   get:
 *     summary: Get all redemptions for a company
 *     tags: [Redemptions]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/redemptions/company/:companyId', RewardController.getCompanyRedemptions);

/**
 * @swagger
 * /api/v1/rewards/redemptions/company:
 *   get:
 *     summary: Get all redemptions for the current company
 *     tags: [Redemptions]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/redemptions/company', RewardController.getCompanyRedemptions);

/**
 * @swagger
 * /api/v1/rewards/summary/{userId}/{companyId}:
 *   get:
 *     summary: Get user reward summary for a company
 *     tags: [Redemptions]
 */
router.get('/summary/:userId/:companyId', RewardController.getUserRewardSummary);

// ============================================
// Dynamic Coupon Routes
// ============================================

/**
 * @swagger
 * /api/v1/rewards/coupons:
 *   post:
 *     summary: Create a dynamic coupon
 *     tags: [Coupons]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/coupons', RewardController.createCoupon);

/**
 * @swagger
 * /api/v1/rewards/coupons:
 *   get:
 *     summary: Get all coupons for the company
 *     tags: [Coupons]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/coupons', RewardController.getCoupons);

/**
 * @swagger
 * /api/v1/rewards/coupons/validate/{code}:
 *   get:
 *     summary: Validate a coupon code
 *     tags: [Coupons]
 */
router.get('/coupons/validate/:code', RewardController.validateCoupon);

/**
 * @swagger
 * /api/v1/rewards/coupons/apply:
 *   post:
 *     summary: Apply a coupon code
 *     tags: [Coupons]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/coupons/apply', RewardController.applyCoupon);

/**
 * @swagger
 * /api/v1/rewards/coupons/{id}:
 *   put:
 *     summary: Update a coupon
 *     tags: [Coupons]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/coupons/:id', RewardController.updateCoupon);

/**
 * @swagger
 * /api/v1/rewards/coupons/{id}:
 *   delete:
 *     summary: Delete (soft) a coupon
 *     tags: [Coupons]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/coupons/:id', RewardController.deleteCoupon);

export default router;
