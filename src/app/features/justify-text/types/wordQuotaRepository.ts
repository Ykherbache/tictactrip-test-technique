export interface WordQuotaRepository {
  getWordCount(token: string): Promise<number>;
  incrementWordCount(token: string, wordCount: number): Promise<number>;
}
