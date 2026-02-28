import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import userRoutes from './routes/user.routes';
import { createLogger } from './utils/logger';

const logger = createLogger('user-service');
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { service: 'user-service', status: 'healthy', version: '1.0.0', uptime: process.uptime() }, timestamp: new Date().toISOString() });
});

app.use('/api/v1/users', userRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Error:', { message: err.message, statusCode: err.statusCode, path: req.path });
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.statusCode ? err.message : 'Internal server error', code: err.code || 'INTERNAL_ERROR', timestamp: new Date().toISOString() });
});

const server = app.listen(config.port, () => logger.info(`👤 User Service running on port ${config.port}`));
process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT', () => { server.close(() => process.exit(0)); });

export default app;
