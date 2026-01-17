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

  private getQuotaKey(email: string): string {
    return `${QUOTA_KEY_PREFIX}${email}`;
  }

  private getSecondsUntilMidnightUTC(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0); // Set to midnight of next day
    const secondsUntilMidnight = Math.floor(
      (tomorrow.getTime() - now.getTime()) / 1000,
    );
    return Math.ceil(secondsUntilMidnight);
  }

  async getWordCount(email: string): Promise<number> {
    const client = this.cacheApi.getClient();
    const key = this.getQuotaKey(email);
    const count = await client.get(key);
    return count ? parseInt(count, 10) : 0;
  }

  async incrementWordCount(email: string, wordCount: number): Promise<number> {
    const client = this.cacheApi.getClient();
    const key = this.getQuotaKey(email);
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
