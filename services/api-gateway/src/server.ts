// ============================================
// API Gateway Server - BeenBite Platform
// ============================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import { config } from './config';
import {
  globalRateLimiter,
  requestIdMiddleware,
  requestLogger,
  errorHandler,
  notFoundHandler,
} from './middlewares';
import proxyRoutes from './routes/proxy.routes';
import { createLogger } from './utils/logger';

const logger = createLogger('api-gateway');
const app = express();

// ============================================
// Security Middlewares
// ============================================
app.use(helmet());
app.use(hpp());
app.use(cors(config.cors));
app.use(compression());

// ============================================
// Request Processing
// ============================================
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(globalRateLimiter);

// Body parsing (for non-proxy routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// Routes
// ============================================
app.use(proxyRoutes);

// ============================================
// Error Handling
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// Start Server
// ============================================
const server = app.listen(config.port, () => {
  logger.info(`🚀 API Gateway running on port ${config.port}`);
  logger.info(`📝 Environment: ${config.nodeEnv}`);
  logger.info(`🔗 Services configured:`);
  Object.entries(config.services).forEach(([name, url]) => {
    logger.info(`   - ${name}: ${url}`);
  });
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;
