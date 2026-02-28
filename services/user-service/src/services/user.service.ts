// ============================================
// User Service - Business Logic
// ============================================

import { IUserRepository } from '../repositories/user.repository';
import { createLogger } from '../utils/logger';

const logger = createLogger('user-service');

export interface IUserService {
  getProfile(userId: string): Promise<any>;
  createProfile(data: any): Promise<any>;
  updateProfile(userId: string, data: any): Promise<any>;
  deleteProfile(userId: string): Promise<void>;
  listUsers(params: { page: number; limit: number; search?: string; companyId?: string }): Promise<any>;
  addPoints(userId: string, points: number): Promise<any>;
  recordVisit(userId: string): Promise<any>;
  getLeaderboard(companyId: string, limit?: number): Promise<any>;
  applyReferral(userId: string, referralCode: string): Promise<any>;
  addBadge(userId: string, badge: string): Promise<any>;
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getProfile(userId: string) {
    const profile = await this.userRepository.findByUserId(userId);
    if (!profile) throw { statusCode: 404, message: 'User profile not found', code: 'PROFILE_NOT_FOUND' };
    return profile;
  }

  async createProfile(data: any) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) throw { statusCode: 409, message: 'Profile already exists', code: 'PROFILE_EXISTS' };
    const profile = await this.userRepository.create(data);
    logger.info(`Profile created for user: ${data.userId}`);
    return profile;
  }

  async updateProfile(userId: string, data: any) {
    const profile = await this.userRepository.findByUserId(userId);
    if (!profile) throw { statusCode: 404, message: 'User profile not found', code: 'PROFILE_NOT_FOUND' };
    const updated = await this.userRepository.update(profile.id, data);
    logger.info(`Profile updated for user: ${userId}`);
    return updated;
  }

  async deleteProfile(userId: string) {
    const profile = await this.userRepository.findByUserId(userId);
    if (!profile) throw { statusCode: 404, message: 'User profile not found', code: 'PROFILE_NOT_FOUND' };
    await this.userRepository.delete(profile.id);
    logger.info(`Profile deleted for user: ${userId}`);
  }

  async listUsers(params: { page: number; limit: number; search?: string; companyId?: string }) {
    return this.userRepository.findAll(params);
  }

  async addPoints(userId: string, points: number) {
    const profile = await this.userRepository.addPoints(userId, points);
    logger.info(`Added ${points} points to user: ${userId}. Total: ${profile.points}`);
    return profile;
  }

  async recordVisit(userId: string) {
    const profile = await this.userRepository.incrementVisits(userId);
    logger.info(`Visit recorded for user: ${userId}. Total visits: ${profile.totalVisits}`);
    return profile;
  }

  async getLeaderboard(companyId: string, limit = 10) {
    return this.userRepository.getLeaderboard(companyId, limit);
  }

  async applyReferral(userId: string, referralCode: string) {
    const referrer = await this.userRepository.findByReferralCode(referralCode);
    if (!referrer) throw { statusCode: 404, message: 'Invalid referral code', code: 'INVALID_REFERRAL' };
    if (referrer.userId === userId) throw { statusCode: 400, message: 'Cannot refer yourself', code: 'SELF_REFERRAL' };

    // Give both users bonus points
    await this.userRepository.addPoints(referrer.userId, 100);
    await this.userRepository.addPoints(userId, 50);
    
    // Update referred by
    const profile = await this.userRepository.findByUserId(userId);
    if (profile) {
      await this.userRepository.update(profile.id, { referredBy: referrer.userId });
    }

    logger.info(`Referral applied: ${userId} referred by ${referrer.userId}`);
    return { referrerBonus: 100, referreeBonus: 50 };
  }

  async addBadge(userId: string, badge: string) {
    const profile = await this.userRepository.findByUserId(userId);
    if (!profile) throw { statusCode: 404, message: 'User profile not found', code: 'PROFILE_NOT_FOUND' };
    
    if (profile.badges.includes(badge)) {
      return profile; // Already has badge
    }

    const updated = await this.userRepository.update(profile.id, {
      badges: [...profile.badges, badge],
    });
    logger.info(`Badge '${badge}' added to user: ${userId}`);
    return updated;
  }
}
