import { CONFIG } from '../../../config';
import { AuthRepository } from './types/authRepository';
import { createClient, RedisClientType } from 'redis';

export class AuthRedisRepository implements AuthRepository {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: CONFIG.redisUrl,
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });
  }

  async saveToken(token: string, email: string): Promise<void> {
    await this.client.set(token, email);
  }

  async getEmailByToken(token: string): Promise<string | null> {
    const email = await this.client.get(token);
    return email || null;
  }

  async hasToken(token: string): Promise<boolean> {
    const exists = await this.client.exists(token);
    return exists === 1;
  }

  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }
  async clearAll(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.flushAll();
    }
  }

  async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }
}
