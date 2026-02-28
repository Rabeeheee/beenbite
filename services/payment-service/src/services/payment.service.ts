import { PaymentRepository } from '../repositories/payment.repository';
import { IPaymentProvider } from '../providers/payment.provider';
import { createLogger } from '../utils/logger';
import { config } from '../config';

const logger = createLogger('payment-service');

export class PaymentService {
  constructor(
    private paymentRepo: PaymentRepository,
    private paymentProvider: IPaymentProvider
  ) {}

  async initiatePayment(data: { companyId: string; subscriptionId: string; amount: number; currency: string; planName: string }) {
    // Create order with provider
    const order = await this.paymentProvider.createOrder({
      amount: data.amount,
      currency: data.currency || 'INR',
      metadata: { companyId: data.companyId, subscriptionId: data.subscriptionId, planName: data.planName },
    });

    // Store payment record
    const payment = await this.paymentRepo.create({
      companyId: data.companyId,
      subscriptionId: data.subscriptionId,
      amount: data.amount,
      currency: data.currency || 'INR',
      status: 'pending',
      provider: config.paymentProvider,
      providerOrderId: order.orderId,
    });

    logger.info(`Payment initiated: ${payment.id} for company ${data.companyId}`);
    return { payment, providerData: order.providerData };
  }

  async verifyPayment(data: { orderId: string; paymentId: string; signature?: string }) {
    const isValid = await this.paymentProvider.verifyPayment(data);

    const payment = await this.paymentRepo.findByProviderOrderId(data.orderId);
    if (!payment) throw { statusCode: 404, message: 'Payment not found', code: 'PAYMENT_NOT_FOUND' };

    if (isValid) {
      const updated = await this.paymentRepo.update(payment.id, {
        status: 'completed',
        providerPaymentId: data.paymentId,
        providerSignature: data.signature,
        paidAt: new Date(),
      });

      // Generate invoice
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const tax = Math.round(payment.amount * 0.18); // 18% GST
      await this.paymentRepo.createInvoice({
        paymentId: payment.id,
        invoiceNumber,
        companyId: payment.companyId,
        companyName: 'Company', // Would fetch from company service
        plan: 'subscription',
        amount: payment.amount,
        tax,
        totalAmount: payment.amount + tax,
        currency: payment.currency,
      });

      logger.info(`Payment verified and completed: ${payment.id}`);
      return { ...updated, verified: true };
    } else {
      await this.paymentRepo.update(payment.id, { status: 'failed', failureReason: 'Payment verification failed' });
      throw { statusCode: 400, message: 'Payment verification failed', code: 'VERIFICATION_FAILED' };
    }
  }

  async handleWebhook(provider: string, event: any) {
    logger.info(`Webhook received from ${provider}: ${event.type || event.event}`);

    if (provider === 'stripe') {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const payment = await this.paymentRepo.findByProviderOrderId(session.id);
          if (payment) {
            await this.paymentRepo.update(payment.id, { status: 'completed', paidAt: new Date() });
          }
          break;
        }
        case 'payment_intent.payment_failed': {
          const intent = event.data.object;
          const payment = await this.paymentRepo.findByProviderPaymentId(intent.id);
          if (payment) {
            await this.paymentRepo.update(payment.id, { status: 'failed', failureReason: intent.last_payment_error?.message });
          }
          break;
        }
      }
    } else if (provider === 'razorpay') {
      if (event.event === 'payment.captured') {
        const paymentData = event.payload.payment.entity;
        const payment = await this.paymentRepo.findByProviderOrderId(paymentData.order_id);
        if (payment) {
          await this.paymentRepo.update(payment.id, { status: 'completed', providerPaymentId: paymentData.id, paidAt: new Date() });
        }
      }
    }
  }

  async refundPayment(paymentId: string) {
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) throw { statusCode: 404, message: 'Payment not found', code: 'PAYMENT_NOT_FOUND' };
    if (payment.status !== 'completed') throw { statusCode: 400, message: 'Can only refund completed payments', code: 'INVALID_REFUND' };

    await this.paymentProvider.createRefund(payment.providerPaymentId || '');
    const updated = await this.paymentRepo.update(paymentId, { status: 'refunded' });
    logger.info(`Payment refunded: ${paymentId}`);
    return updated;
  }

  async getPayment(id: string) { return this.paymentRepo.findById(id); }
  async getCompanyPayments(companyId: string, params: any) { return this.paymentRepo.findByCompany(companyId, params); }
  async listPayments(params: any) { return this.paymentRepo.findAll(params); }
  async getInvoice(paymentId: string) { return this.paymentRepo.getInvoice(paymentId); }
  async getCompanyInvoices(companyId: string) { return this.paymentRepo.getInvoicesByCompany(companyId); }
}
