import { AuthRepository } from './types/authRepository';
import { createClient, RedisClientType } from 'redis';

export class AuthRedisRepository implements AuthRepository {
  private client: RedisClientType;

  constructor(redisUrl?: string) {
    this.client = createClient({
      url: redisUrl || process.env.REDIS_URL || 'redis://localhost:6379',
    });
    this.client.connect().catch(console.error);
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
}
