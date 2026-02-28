import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SubscriptionService } from '../services/subscription.service';

export class SubscriptionController {
  constructor(private svc: SubscriptionService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.body.companyId || req.headers['x-company-id'] as string;
      const sub = await this.svc.createSubscription(companyId, req.body.plan);
      res.status(StatusCodes.CREATED).json({ success: true, message: 'Subscription created', data: sub, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.params.companyId || req.headers['x-company-id'] as string;
      const sub = await this.svc.getSubscription(companyId);
      res.json({ success: true, data: sub, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sub = await this.svc.getSubscriptionById(req.params.id);
      res.json({ success: true, data: sub, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  activate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sub = await this.svc.activateSubscription(req.params.id);
      res.json({ success: true, message: 'Subscription activated', data: sub, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  upgrade = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const sub = await this.svc.upgradePlan(companyId, req.body.plan);
      res.json({ success: true, message: 'Plan upgraded', data: sub, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const sub = await this.svc.cancelSubscription(companyId, req.body.reason);
      res.json({ success: true, message: 'Subscription cancelled', data: sub, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  renew = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sub = await this.svc.renewSubscription(req.params.id);
      res.json({ success: true, message: 'Subscription renewed', data: sub, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.svc.listSubscriptions({ page, limit, status: req.query.status, plan: req.query.plan });
      res.json({ success: true, data: result.data, meta: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) }, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  history = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const history = await this.svc.getHistory(req.params.id);
      res.json({ success: true, data: history, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  checkFeature = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const allowed = await this.svc.checkFeature(companyId, req.params.feature);
      res.json({ success: true, data: { feature: req.params.feature, allowed }, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  canChangeRewardType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const allowed = await this.svc.canChangeRewardType(companyId);
      res.json({ success: true, data: { allowed }, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  getPlans = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const plans = await this.svc.getPlans();
      res.json({ success: true, data: plans, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };
}
