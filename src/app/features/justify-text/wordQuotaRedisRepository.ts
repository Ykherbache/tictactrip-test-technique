import { inject, injectable } from 'inversify';
import { WordQuotaRepository } from './types/wordQuotaRepository';
import { CacheApi } from '../../external-services/types/cacheApi';
import { TYPE } from '../../inversify/type.inversify';

const QUOTA_KEY_PREFIX = 'word_quota:';

@injectable()
export class WordQuotaRedisRepository implements WordQuotaRepository {
  constructor(
    @inject(TYPE.CacheApi)
    private readonly cacheApi: CacheApi,
  ) {}

  private getQuotaKey(token: string): string {
    return `${QUOTA_KEY_PREFIX}${token}`;
  }

  private getSecondsUntilMidnightUTC(): number {
    const now = new Date();
    const midnightUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0,
      ),
    );
    const diffMs = midnightUTC.getTime() - now.getTime();
    return Math.ceil(diffMs / 1000);
  }

  async getWordCount(token: string): Promise<number> {
    const client = this.cacheApi.getClient();
    const key = this.getQuotaKey(token);
    const count = await client.get(key);
    return count ? parseInt(count, 10) : 0;
  }

  async incrementWordCount(token: string, wordCount: number): Promise<number> {
    const client = this.cacheApi.getClient();
    const key = this.getQuotaKey(token);
    const ttl = this.getSecondsUntilMidnightUTC();
    const newCount = await client.incrBy(key, wordCount);
    await client.expire(key, ttl);
    return newCount;
  }

  async connect(): Promise<void> {
    await this.cacheApi.connect();
  }

  async disconnect(): Promise<void> {
    await this.cacheApi.disconnect();
  }

  async clearAll(): Promise<void> {
    const client = this.cacheApi.getClient();
    if (client.isOpen) {
      const keys = await client.keys(`${QUOTA_KEY_PREFIX}*`);
      if (keys.length > 0) {
        await client.del(keys);
      }
    }
  }
}
