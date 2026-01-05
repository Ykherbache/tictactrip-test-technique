import { CONFIG } from '../../config';
import { createClient, RedisClientType } from 'redis';
import { CacheApi } from './types/cacheApi';

export class RedisCacheApi implements CacheApi {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: CONFIG.redisUrl,
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
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
}
