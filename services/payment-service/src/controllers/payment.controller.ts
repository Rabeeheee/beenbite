import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  constructor(private svc: PaymentService) {}

  initiate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const result = await this.svc.initiatePayment({ ...req.body, companyId });
      res.status(StatusCodes.CREATED).json({ success: true, message: 'Payment initiated', data: result, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.svc.verifyPayment(req.body);
      res.json({ success: true, message: 'Payment verified', data: result, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  stripeWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.svc.handleWebhook('stripe', req.body);
      res.json({ received: true });
    } catch (e) { next(e); }
  };

  razorpayWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.svc.handleWebhook('razorpay', req.body);
      res.json({ received: true });
    } catch (e) { next(e); }
  };

  refund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.svc.refundPayment(req.params.id);
      res.json({ success: true, message: 'Payment refunded', data: result, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payment = await this.svc.getPayment(req.params.id);
      res.json({ success: true, data: payment, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  listCompanyPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.svc.getCompanyPayments(companyId, { page, limit });
      res.json({ success: true, data: result.data, meta: { page, limit, total: result.total }, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.svc.listPayments({ page, limit, status: req.query.status });
      res.json({ success: true, data: result.data, meta: { page, limit, total: result.total }, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  getInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const invoice = await this.svc.getInvoice(req.params.id);
      res.json({ success: true, data: invoice, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };

  companyInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = req.headers['x-company-id'] as string;
      const invoices = await this.svc.getCompanyInvoices(companyId);
      res.json({ success: true, data: invoices, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };
}
