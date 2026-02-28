// ============================================
// Proxy Routes Configuration - API Gateway
// ============================================

import { Router, Request, Response } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { config } from '../config';
import {
  authMiddleware,
  roleMiddleware,
  authRateLimiter,
} from '../middlewares';
import { createLogger } from '../utils/logger';

const logger = createLogger('api-gateway');
const router = Router();

// Proxy factory
const createProxy = (target: string, pathRewrite?: Record<string, string>) => {
  const options: Options = {
    target,
    changeOrigin: true,
    pathRewrite,
    on: {
      proxyReq: (proxyReq, req: any) => {
        if (req.headers['x-request-id']) {
          proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
        }
        if (req.headers['x-user-id']) {
          proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
        }
        if (req.headers['x-user-email']) {
          proxyReq.setHeader('x-user-email', req.headers['x-user-email']);
        }
        if (req.headers['x-user-role']) {
          proxyReq.setHeader('x-user-role', req.headers['x-user-role']);
        }
        if (req.headers['x-company-id']) {
          proxyReq.setHeader('x-company-id', req.headers['x-company-id']);
        }
      },
      proxyRes: (proxyRes, req: any) => {
        logger.debug(`Proxied ${req.method} ${req.path} -> ${proxyRes.statusCode}`);
      },
      error: (err, req: any, res: any) => {
        logger.error(`Proxy error for ${req.path}:`, err.message);
        if (res && !res.headersSent) {
          res.status(503).json({
            success: false,
            message: 'Service temporarily unavailable',
            code: 'SERVICE_UNAVAILABLE',
            timestamp: new Date().toISOString(),
          });
        }
      },
    },
  };
  return createProxyMiddleware(options);
};

// ============================================
// Health Check
// ============================================
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API Gateway is healthy',
    data: {
      service: 'api-gateway',
      status: 'healthy',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// ============================================
// Auth Routes (Public)
// ============================================
router.use(
  '/api/v1/auth',
  authRateLimiter,
  createProxy(config.services.auth, { '^/api/v1/auth': '/api/v1/auth' })
);

// ============================================
// User Routes (Protected)
// ============================================
router.use(
  '/api/v1/users',
  authMiddleware,
  createProxy(config.services.user, { '^/api/v1/users': '/api/v1/users' })
);

// ============================================
// Company Routes (Protected)
// ============================================
router.use(
  '/api/v1/companies',
  authMiddleware,
  createProxy(config.services.company, { '^/api/v1/companies': '/api/v1/companies' })
);

// ============================================
// Subscription Routes (Protected)
// ============================================
router.use(
  '/api/v1/subscriptions',
  authMiddleware,
  createProxy(config.services.subscription, { '^/api/v1/subscriptions': '/api/v1/subscriptions' })
);

// ============================================
// Payment Routes (Protected + Webhook)
// ============================================
router.use(
  '/api/v1/payments/webhook',
  createProxy(config.services.payment, { '^/api/v1/payments/webhook': '/api/v1/payments/webhook' })
);
router.use(
  '/api/v1/payments',
  authMiddleware,
  createProxy(config.services.payment, { '^/api/v1/payments': '/api/v1/payments' })
);

// ============================================
// Reward Routes (Protected)
// ============================================
router.use(
  '/api/v1/rewards',
  authMiddleware,
  createProxy(config.services.reward, { '^/api/v1/rewards': '/api/v1/rewards' })
);

// ============================================
// Master Data Routes (Mixed)
// ============================================
router.use(
  '/api/v1/master',
  createProxy(config.services.masterData, { '^/api/v1/master': '/api/v1/master' })
);

// ============================================
// Notification Routes (Protected)
// ============================================
router.use(
  '/api/v1/notifications',
  authMiddleware,
  createProxy(config.services.notification, { '^/api/v1/notifications': '/api/v1/notifications' })
);

// ============================================
// Admin Routes (Super Admin only)
// ============================================
router.use(
  '/api/v1/admin/companies',
  authMiddleware,
  roleMiddleware('super_admin'),
  createProxy(config.services.company, { '^/api/v1/admin/companies': '/api/v1/admin/companies' })
);

router.use(
  '/api/v1/admin/subscriptions',
  authMiddleware,
  roleMiddleware('super_admin'),
  createProxy(config.services.subscription, { '^/api/v1/admin/subscriptions': '/api/v1/admin/subscriptions' })
);

router.use(
  '/api/v1/admin/users',
  authMiddleware,
  roleMiddleware('super_admin'),
  createProxy(config.services.user, { '^/api/v1/admin/users': '/api/v1/admin/users' })
);

router.use(
  '/api/v1/admin/analytics',
  authMiddleware,
  roleMiddleware('super_admin'),
  createProxy(config.services.masterData, { '^/api/v1/admin/analytics': '/api/v1/admin/analytics' })
);

export default router;
