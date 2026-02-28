import amqplib from 'amqplib';
import { config } from '../config';
import { logger } from '../utils/logger';
import { NotificationService } from '../services/notification.service';

// ============================================
// RabbitMQ Event Consumer
// ============================================

const EXCHANGE_NAME = 'beenbite.events';
const QUEUE_NAME = 'notification-service.events';

export class EventConsumer {
  private connection: amqplib.Connection | null = null;
  private channel: amqplib.Channel | null = null;
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async connect() {
    try {
      this.connection = await amqplib.connect(config.rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      // Create exchange
      await this.channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

      // Create queue
      await this.channel.assertQueue(QUEUE_NAME, { durable: true });

      // Bind to events we care about
      const bindingKeys = [
        'user.registered',
        'reward.redeemed',
        'subscription.created',
        'subscription.expiring',
        'company.verified',
        'payment.success',
        'payment.failed',
      ];

      for (const key of bindingKeys) {
        await this.channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, key);
      }

      // Consume messages
      await this.channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;

        try {
          const eventName = msg.fields.routingKey;
          const eventData = JSON.parse(msg.content.toString());

          logger.info(`Received event: ${eventName}`, eventData);
          await this.notificationService.handleEvent(eventName, eventData);

          this.channel!.ack(msg);
        } catch (error) {
          logger.error('Error processing message:', error);
          // Negative acknowledge - requeue the message
          this.channel!.nack(msg, false, true);
        }
      });

      logger.info('🐰 RabbitMQ consumer connected and listening for events');
    } catch (error) {
      logger.error('Failed to connect to RabbitMQ:', error);
      // Retry after 5 seconds
      setTimeout(() => this.connect(), 5000);
    }
  }

  async disconnect() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      logger.info('RabbitMQ consumer disconnected');
    } catch (error) {
      logger.error('Error disconnecting from RabbitMQ:', error);
    }
  }
}
