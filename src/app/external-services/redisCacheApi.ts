import { CONFIG } from '../../config';
import { createClient, RedisClientType } from 'redis';
import { CacheApi } from './types/cacheApi';
import { injectable } from 'inversify';
import { logger } from '../utils/logger';

@injectable()
export class RedisCacheApi implements CacheApi {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: CONFIG.redisUrl,
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  isConnected(): boolean {
    return this.client.isOpen;
  }
  async clearAll(): Promise<void> {
    const client = this.getClient();
    if (client.isOpen) {
      const keys = await client.keys('*');
      if (keys.length > 0) {
        await client.del(keys);
      }
    }
  }
}
