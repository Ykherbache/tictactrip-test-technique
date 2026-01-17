import { injectable } from 'inversify';
import { WordQuotaRepository } from './types/wordQuotaRepository';

@injectable()
export class WordQuotaInMemoryRepository implements WordQuotaRepository {
  private quotaMap: Map<string, number> = new Map();

  async getWordCount(email: string): Promise<number> {
    return this.quotaMap.get(email) || 0;
  }

  async incrementWordCount(email: string, wordCount: number): Promise<number> {
    const currentCount = this.quotaMap.get(email) || 0;
    const newCount = currentCount + wordCount;
    this.quotaMap.set(email, newCount);
    return newCount;
  }
}
