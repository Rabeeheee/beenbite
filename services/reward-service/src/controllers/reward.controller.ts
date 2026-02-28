import { Request, Response, NextFunction } from 'express';
import { RewardService } from '../services/reward.service';
import { logger } from '../utils/logger';

const rewardService = new RewardService();

// ============================================
// Reward Controller
// ============================================
export class RewardController {
  // ---- Rewards ----

  static async createReward(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const companyPlan = (req.headers['x-company-plan'] as string) || 'starter';

      if (!companyId) {
        return res.status(400).json({ success: false, message: 'Company ID is required' });
      }

      const reward = await rewardService.createReward(companyId, companyPlan, req.body);
      res.status(201).json({ success: true, data: reward, message: 'Reward created successfully' });
    } catch (error: any) {
      logger.error('Create reward error:', error);
      res.status(error.message?.includes('not available') ? 403 : 500).json({
        success: false,
        message: error.message || 'Failed to create reward',
      });
    }
  }

  static async getReward(req: Request, res: Response, next: NextFunction) {
    try {
      const reward = await rewardService.getReward(req.params.id);
      res.json({ success: true, data: reward });
    } catch (error: any) {
      logger.error('Get reward error:', error);
      res.status(error.message === 'Reward not found' ? 404 : 500).json({
        success: false,
        message: error.message || 'Failed to get reward',
      });
    }
  }

  static async getRewardsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId || (req.headers['x-company-id'] as string);
      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        type: req.query.type,
        isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
        search: req.query.search,
      };

      const result = await rewardService.getRewardsByCompany(companyId, filters);
      res.json({
        success: true,
        data: result.rewards,
        meta: {
          total: result.total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(result.total / filters.limit),
        },
      });
    } catch (error: any) {
      logger.error('Get rewards by company error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to get rewards' });
    }
  }

  static async getActiveRewards(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId || (req.headers['x-company-id'] as string);
      const rewards = await rewardService.getActiveRewards(companyId);
      res.json({ success: true, data: rewards });
    } catch (error: any) {
      logger.error('Get active rewards error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to get active rewards' });
    }
  }

  static async updateReward(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const reward = await rewardService.updateReward(req.params.id, companyId, req.body);
      res.json({ success: true, data: reward, message: 'Reward updated successfully' });
    } catch (error: any) {
      logger.error('Update reward error:', error);
      const status = error.message === 'Reward not found' ? 404 : error.message?.includes('Unauthorized') ? 403 : 500;
      res.status(status).json({ success: false, message: error.message || 'Failed to update reward' });
    }
  }

  static async deleteReward(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const result = await rewardService.deleteReward(req.params.id, companyId);
      res.json({ success: true, ...result });
    } catch (error: any) {
      logger.error('Delete reward error:', error);
      const status = error.message === 'Reward not found' ? 404 : error.message?.includes('Unauthorized') ? 403 : 500;
      res.status(status).json({ success: false, message: error.message || 'Failed to delete reward' });
    }
  }

  static async getRewardsByIndustry(req: Request, res: Response, next: NextFunction) {
    try {
      const rewards = await rewardService.getRewardsByIndustry(req.params.industryType);
      res.json({ success: true, data: rewards });
    } catch (error: any) {
      logger.error('Get rewards by industry error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to get rewards' });
    }
  }

  // ---- Redemptions ----

  static async redeemReward(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const companyId = req.headers['x-company-id'] as string;
      const { rewardId, ...context } = req.body;

      if (!userId) return res.status(400).json({ success: false, message: 'User ID is required' });
      if (!rewardId) return res.status(400).json({ success: false, message: 'Reward ID is required' });

      const result = await rewardService.redeemReward(userId, rewardId, companyId, context);
      res.status(201).json({ success: true, data: result, message: 'Reward redeemed successfully' });
    } catch (error: any) {
      logger.error('Redeem reward error:', error);
      const status = error.message?.includes('not found') ? 404
        : error.message?.includes('not eligible') || error.message?.includes('not active') || error.message?.includes('expired') || error.message?.includes('maximum') ? 400
        : 500;
      res.status(status).json({ success: false, message: error.message || 'Failed to redeem reward' });
    }
  }

  static async getUserRedemptions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId || (req.headers['x-user-id'] as string);
      const companyId = req.query.companyId as string | undefined;
      const redemptions = await rewardService.getUserRedemptions(userId, companyId);
      res.json({ success: true, data: redemptions });
    } catch (error: any) {
      logger.error('Get user redemptions error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to get redemptions' });
    }
  }

  static async getCompanyRedemptions(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId || (req.headers['x-company-id'] as string);
      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        userId: req.query.userId,
        rewardId: req.query.rewardId,
        status: req.query.status,
      };

      const result = await rewardService.getCompanyRedemptions(companyId, filters);
      res.json({
        success: true,
        data: result.redemptions,
        meta: {
          total: result.total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(result.total / filters.limit),
        },
      });
    } catch (error: any) {
      logger.error('Get company redemptions error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to get redemptions' });
    }
  }

  static async getUserRewardSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId || (req.headers['x-user-id'] as string);
      const companyId = req.params.companyId || (req.headers['x-company-id'] as string);
      const summary = await rewardService.getUserRewardSummary(userId, companyId);
      res.json({ success: true, data: summary });
    } catch (error: any) {
      logger.error('Get user reward summary error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to get summary' });
    }
  }

  // ---- Dynamic Coupons ----

  static async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.headers['x-company-id'] as string;
      if (!companyId) return res.status(400).json({ success: false, message: 'Company ID is required' });

      const coupon = await rewardService.createDynamicCoupon(companyId, req.body);
      res.status(201).json({ success: true, data: coupon, message: 'Coupon created successfully' });
    } catch (error: any) {
      logger.error('Create coupon error:', error);
      res.status(error.message?.includes('already exists') ? 409 : 500).json({
        success: false,
        message: error.message || 'Failed to create coupon',
      });
    }
  }

  static async validateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const { code } = req.params;
      const result = await rewardService.validateCoupon(code, companyId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      logger.error('Validate coupon error:', error);
      res.status(error.message?.includes('Invalid') || error.message?.includes('expired') ? 400 : 500).json({
        success: false,
        message: error.message || 'Failed to validate coupon',
      });
    }
  }

  static async applyCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const companyId = req.headers['x-company-id'] as string;
      const { code } = req.body;

      if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });

      const result = await rewardService.applyCoupon(code, companyId, userId);
      res.json({ success: true, data: result, message: 'Coupon applied successfully' });
    } catch (error: any) {
      logger.error('Apply coupon error:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to apply coupon' });
    }
  }

  static async getCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const coupons = await rewardService.getCoupons(companyId);
      res.json({ success: true, data: coupons });
    } catch (error: any) {
      logger.error('Get coupons error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to get coupons' });
    }
  }

  static async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const coupon = await rewardService.updateCoupon(req.params.id, companyId, req.body);
      res.json({ success: true, data: coupon, message: 'Coupon updated successfully' });
    } catch (error: any) {
      logger.error('Update coupon error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to update coupon' });
    }
  }

  static async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const result = await rewardService.deleteCoupon(req.params.id, companyId);
      res.json({ success: true, ...result });
    } catch (error: any) {
      logger.error('Delete coupon error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to delete coupon' });
    }
  }

  // ---- Analytics ----

  static async getRewardAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId || (req.headers['x-company-id'] as string);
      const analytics = await rewardService.getRewardAnalytics(companyId);
      res.json({ success: true, data: analytics });
    } catch (error: any) {
      logger.error('Get reward analytics error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to get analytics' });
    }
  }

  static async getTopRewards(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId || (req.headers['x-company-id'] as string);
      const limit = parseInt(req.query.limit as string) || 5;
      const topRewards = await rewardService.getTopRewards(companyId, limit);
      res.json({ success: true, data: topRewards });
    } catch (error: any) {
      logger.error('Get top rewards error:', error);
      res.status(500).json({ success: false, message: error.message || 'Failed to get top rewards' });
    }
  }
}
