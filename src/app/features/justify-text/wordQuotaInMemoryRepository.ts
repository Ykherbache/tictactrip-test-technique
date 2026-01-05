import { injectable } from 'inversify';
import { WordQuotaRepository } from './types/wordQuotaRepository';

@injectable()
export class WordQuotaInMemoryRepository implements WordQuotaRepository {
  private quotaMap: Map<string, number> = new Map();

  async getWordCount(token: string): Promise<number> {
    return this.quotaMap.get(token) || 0;
  }

  async incrementWordCount(token: string, wordCount: number): Promise<number> {
    const currentCount = this.quotaMap.get(token) || 0;
    const newCount = currentCount + wordCount;
    this.quotaMap.set(token, newCount);
    return newCount;
  }
}
