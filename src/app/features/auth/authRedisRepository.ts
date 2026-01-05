import { inject } from 'inversify';
import { AuthRepository } from './types/authRepository';
import { CacheApi } from '../../external-services/types/cacheApi';
import { TYPE } from '../../inversify/type.inversify';

export class AuthRedisRepository implements AuthRepository {
  constructor(
    @inject(TYPE.CacheApi)
    private readonly cacheApi: CacheApi,
  ) {}

  async saveToken(token: string, email: string): Promise<void> {
    const client = this.cacheApi.getClient();
    await client.set(token, email);
  }

  async getEmailByToken(token: string): Promise<string | undefined> {
    const client = this.cacheApi.getClient();
    const email = await client.get(token);
    return email || null;
  }

  async hasToken(token: string): Promise<boolean> {
    const client = this.cacheApi.getClient();
    const exists = await client.exists(token);
    return exists === 1;
  }

  async connect(): Promise<void> {
    await this.cacheApi.connect();
  }

  async clearAll(): Promise<void> {
    const client = this.cacheApi.getClient();
    if (client.isOpen) {
      await client.flushAll();
    }
  }

  async disconnect(): Promise<void> {
    await this.cacheApi.disconnect();
  }
}
