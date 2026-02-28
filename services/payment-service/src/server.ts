import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import paymentRoutes from './routes/payment.routes';
import { createLogger } from './utils/logger';

const logger = createLogger('payment-service');
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { service: 'payment-service', status: 'healthy', version: '1.0.0', uptime: process.uptime() }, timestamp: new Date().toISOString() });
});

app.use('/api/v1/payments', paymentRoutes);

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Error:', { message: err.message, path: req.path });
  res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : 'Internal server error', code: err.code || 'INTERNAL_ERROR', timestamp: new Date().toISOString() });
});

const server = app.listen(config.port, () => logger.info(`💰 Payment Service running on port ${config.port}`));
process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT', () => { server.close(() => process.exit(0)); });
export default app;
