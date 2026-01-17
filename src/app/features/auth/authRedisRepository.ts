import { inject, injectable } from 'inversify';
import { AuthRepository } from './types/authRepository';
import { CacheApi } from '../../external-services/types/cacheApi';
import { TYPE } from '../../inversify/type.inversify';

const AUTH_TOKEN_PREFIX = 'auth:';

@injectable()
export class AuthRedisRepository implements AuthRepository {
  constructor(
    @inject(TYPE.CacheApi)
    private readonly cacheApi: CacheApi,
  ) {}

  private getTokenKey(token: string): string {
    return `${AUTH_TOKEN_PREFIX}${token}`;
  }

  async saveToken(token: string, email: string): Promise<void> {
    const client = this.cacheApi.getClient();
    await client.set(this.getTokenKey(token), email);
  }

  async getEmailByToken(token: string): Promise<string | null> {
    const client = this.cacheApi.getClient();
    const email = await client.get(this.getTokenKey(token));
    return email ?? null;
  }

  async getTokenByEmail(email: string): Promise<string | null> {
    const client = this.cacheApi.getClient();
    let cursor = 0;
    do {
      const result = await client.scan(cursor, {
        MATCH: `${AUTH_TOKEN_PREFIX}*`,
        COUNT: 100,
      });
      cursor = result.cursor;

      for (const key of result.keys) {
        const value = await client.get(key);
        if (value === email) {
          return key.replace(AUTH_TOKEN_PREFIX, '');
        }
      }
    } while (cursor !== 0);

    return null;
  }

  async hasToken(token: string): Promise<boolean> {
    const client = this.cacheApi.getClient();
    const exists = await client.exists(this.getTokenKey(token));
    return exists === 1;
  }

  async deleteToken(token: string): Promise<void> {
    const client = this.cacheApi.getClient();
    await client.del(this.getTokenKey(token));
  }

  async clearAll(): Promise<void> {
    const client = this.cacheApi.getClient();
    if (client.isOpen) {
      await client.flushAll();
    }
  }
}
