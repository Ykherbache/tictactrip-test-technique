export interface WordQuotaRepository {
  getWordCount(email: string): Promise<number>;
  incrementWordCount(email: string, wordCount: number): Promise<number>;
}
