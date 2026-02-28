import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const config = {
  port: parseInt(process.env.SUBSCRIPTION_SERVICE_PORT || '3004', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL ||
      `postgresql://${process.env.DB_USERNAME || 'beenbite_admin'}:${process.env.DB_PASSWORD || 'beenbite_secure_password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME_SUBSCRIPTION || 'beenbite_subscriptions'}?schema=public`,
  },
  redis: { host: process.env.REDIS_HOST || 'localhost', port: parseInt(process.env.REDIS_PORT || '6379', 10) },
  rabbitmq: { url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672' },
  trialDays: 14,
  gracePeriodDays: 3,
};
process.env.DATABASE_URL = config.database.url;
