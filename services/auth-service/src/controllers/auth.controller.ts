// ============================================
// Auth Controller - Handles HTTP Layer
// ============================================

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthService } from '../services/auth.service';
import { createLogger } from '../utils/logger';

const logger = createLogger('auth-service');

export class AuthController {
  constructor(private authService: IAuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Registration successful',
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Login successful',
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshToken(refreshToken);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Logged out successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  logoutAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      await this.authService.logoutAll(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'All sessions revoked',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;
      await this.authService.resetPassword(token, password);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Password reset successful',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Token required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const payload = await this.authService.verifyToken(token);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Token is valid',
        data: payload,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Token required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const payload = await this.authService.verifyToken(token);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'User profile',
        data: payload,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };
}
