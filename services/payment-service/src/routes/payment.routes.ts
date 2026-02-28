import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentService } from '../services/payment.service';
import { PaymentController } from '../controllers/payment.controller';
import { getPaymentProvider } from '../providers/payment.provider';

const router = Router();
const prisma = new PrismaClient();
const repo = new PaymentRepository(prisma);
const provider = getPaymentProvider();
const svc = new PaymentService(repo, provider);
const ctrl = new PaymentController(svc);

// Webhooks (no auth)
router.post('/webhook/stripe', ctrl.stripeWebhook);
router.post('/webhook/razorpay', ctrl.razorpayWebhook);

// Payment operations
router.post('/initiate', ctrl.initiate);
router.post('/verify', ctrl.verify);
router.post('/:id/refund', ctrl.refund);
router.get('/company', ctrl.listCompanyPayments);
router.get('/invoices', ctrl.companyInvoices);
router.get('/:id', ctrl.get);
router.get('/:id/invoice', ctrl.getInvoice);
router.get('/', ctrl.listAll);

export default router;
