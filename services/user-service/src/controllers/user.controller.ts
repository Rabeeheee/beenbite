// ============================================
// User Controller - HTTP Layer
// ============================================

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IUserService } from '../services/user.service';

export class UserController {
  constructor(private userService: IUserService) {}

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId || req.headers['x-user-id'] as string;
      const profile = await this.userService.getProfile(userId);
      res.json({ success: true, message: 'Profile retrieved', data: profile, timestamp: new Date().toISOString() });
    } catch (error) { next(error); }
  };

  createProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await this.userService.createProfile(req.body);
      res.status(StatusCodes.CREATED).json({ success: true, message: 'Profile created', data: profile, timestamp: new Date().toISOString() });
    } catch (error) { next(error); }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId || req.headers['x-user-id'] as string;
      const profile = await this.userService.updateProfile(userId, req.body);
      res.json({ success: true, message: 'Profile updated', data: profile, timestamp: new Date().toISOString() });
    } catch (error) { next(error); }
  };

  deleteProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.deleteProfile(req.params.userId);
      res.json({ success: true, message: 'Profile deleted', timestamp: new Date().toISOString() });
    } catch (error) { next(error); }
  };

  listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const companyId = req.query.companyId as string || req.headers['x-company-id'] as string;
      const result = await this.userService.listUsers({ page, limit, search, companyId });
      res.json({
        success: true, message: 'Users retrieved', data: result.data,
        meta: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit), hasNext: page < Math.ceil(result.total / limit), hasPrev: page > 1 },
        timestamp: new Date().toISOString(),
      });
    } catch (error) { next(error); }
  };

  addPoints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { points } = req.body;
      const profile = await this.userService.addPoints(userId, points);
      res.json({ success: true, message: `${points} points added`, data: profile, timestamp: new Date().toISOString() });
    } catch (error) { next(error); }
  };

  recordVisit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId || req.headers['x-user-id'] as string;
      const profile = await this.userService.recordVisit(userId);
      res.json({ success: true, message: 'Visit recorded', data: profile, timestamp: new Date().toISOString() });
    } catch (error) { next(error); }
  };

  getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.params.companyId || req.headers['x-company-id'] as string;
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await this.userService.getLeaderboard(companyId, limit);
      res.json({ success: true, message: 'Leaderboard retrieved', data: leaderboard, timestamp: new Date().toISOString() });
    } catch (error) { next(error); }
  };

  applyReferral = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { referralCode } = req.body;
      const result = await this.userService.applyReferral(userId, referralCode);
      res.json({ success: true, message: 'Referral applied', data: result, timestamp: new Date().toISOString() });
    } catch (error) { next(error); }
  };

  addBadge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { badge } = req.body;
      const profile = await this.userService.addBadge(userId, badge);
      res.json({ success: true, message: 'Badge added', data: profile, timestamp: new Date().toISOString() });
    } catch (error) { next(error); }
  };
}
