// ============================================
// Payment Strategy Pattern - Stripe & Razorpay
// ============================================

import Stripe from 'stripe';
import { config } from '../config';
import { createLogger } from '../utils/logger';

const logger = createLogger('payment-service');

// Payment Provider Interface (Strategy Pattern)
export interface IPaymentProvider {
  createOrder(params: { amount: number; currency: string; metadata: any }): Promise<{ orderId: string; providerData: any }>;
  verifyPayment(params: { orderId: string; paymentId: string; signature?: string }): Promise<boolean>;
  createRefund(paymentId: string, amount?: number): Promise<any>;
}

// Stripe Provider
export class StripeProvider implements IPaymentProvider {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey, { apiVersion: '2023-10-16' as any });
  }

  async createOrder(params: { amount: number; currency: string; metadata: any }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: params.currency.toLowerCase(),
          product_data: { name: params.metadata.planName || 'BeenBite Subscription', description: params.metadata.description || 'Monthly subscription' },
          unit_amount: params.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`,
      metadata: params.metadata,
    });

    logger.info(`Stripe session created: ${session.id}`);
    return { orderId: session.id, providerData: { url: session.url, sessionId: session.id } };
  }

  async verifyPayment(params: { orderId: string; paymentId: string }) {
    const session = await this.stripe.checkout.sessions.retrieve(params.orderId);
    return session.payment_status === 'paid';
  }

  async createRefund(paymentId: string, amount?: number) {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentId,
      ...(amount ? { amount } : {}),
    });
    return refund;
  }
}

// Razorpay Provider
export class RazorpayProvider implements IPaymentProvider {
  private razorpay: any;

  constructor() {
    // Dynamic import to avoid issues when razorpay keys are not set
    try {
      const Razorpay = require('razorpay');
      this.razorpay = new Razorpay({ key_id: config.razorpay.keyId, key_secret: config.razorpay.keySecret });
    } catch (err) {
      logger.warn('Razorpay SDK not available');
    }
  }

  async createOrder(params: { amount: number; currency: string; metadata: any }) {
    const order = await this.razorpay.orders.create({
      amount: params.amount,
      currency: params.currency,
      receipt: `rcpt_${Date.now()}`,
      notes: params.metadata,
    });

    logger.info(`Razorpay order created: ${order.id}`);
    return { orderId: order.id, providerData: { orderId: order.id, keyId: config.razorpay.keyId } };
  }

  async verifyPayment(params: { orderId: string; paymentId: string; signature?: string }) {
    const crypto = require('crypto');
    const body = params.orderId + '|' + params.paymentId;
    const expectedSignature = crypto.createHmac('sha256', config.razorpay.keySecret).update(body).digest('hex');
    return expectedSignature === params.signature;
  }

  async createRefund(paymentId: string, amount?: number) {
    return this.razorpay.payments.refund(paymentId, { amount });
  }
}

// Factory
export const getPaymentProvider = (): IPaymentProvider => {
  if (config.paymentProvider === 'razorpay') return new RazorpayProvider();
  return new StripeProvider();
};
