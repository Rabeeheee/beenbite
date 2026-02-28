import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import subscriptionRoutes from './routes/subscription.routes';
import { createLogger } from './utils/logger';

const logger = createLogger('subscription-service');
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { service: 'subscription-service', status: 'healthy', version: '1.0.0', uptime: process.uptime() }, timestamp: new Date().toISOString() });
});

app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/admin/subscriptions', subscriptionRoutes);

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Error:', { message: err.message, path: req.path });
  res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : 'Internal server error', code: err.code || 'INTERNAL_ERROR', timestamp: new Date().toISOString() });
});

const server = app.listen(config.port, () => logger.info(`💳 Subscription Service running on port ${config.port}`));
process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT', () => { server.close(() => process.exit(0)); });
export default app;
